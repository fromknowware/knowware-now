#!/usr/bin/env bash
# Abuse-tests the test-mode checkout against a local `wrangler pages dev dist --kv CLAIMS`
# with .dev.vars set for the mock (see docs/agent-checkout-setup.md) and
# `node scripts/mock-stripe.mjs` running. Makes no calls to Stripe.
# Usage: STRIPE_WEBHOOK_SECRET=whsec_local_test_secret scripts/test-agent-checkout.sh [base-url] [mock-url]
# Needs AGENT_REQUIRE_VERIFIED_EMAIL=false in .dev.vars (local dev only): no email is sent here to confirm.
set -u
B="${1:-http://localhost:8788}"; MOCK="${2:-http://127.0.0.1:12111}"
O="Origin: $B"
export STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-whsec_local_test_secret}"
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
newip() { IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"; }
newip
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
jget() { python3 -c "import sys,json;d=json.load(sys.stdin);print(d$1)" 2>/dev/null; }
signup() { cu -si -X POST "$B/api/reader" -H "$O" -H 'Content-Type: application/json' -d "{\"email\":\"$1\",\"chapter\":\"01\"}" | tr -d '\r' | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1; }
mint() { cu -s -X POST "$B/api/agent/tokens" -H "$O" -H "Cookie: $1" -H 'Content-Type: application/json' -d "$2"; }

C1=$(signup "buyer-$RANDOM@example.com"); C2=$(signup "other-$RANDOM@example.com")
RO=$(mint "$C1" '{"name":"Reader Only","operator":"Test Ops","lifetime":"1h","scopes":["read"]}' | jget "['token']")
CO=$(mint "$C1" '{"name":"Shopper","operator":"Test Ops","lifetime":"1h","scopes":["read","checkout"]}' | jget "['token']")
OT=$(mint "$C2" '{"name":"Other Shopper","operator":"Test Ops","lifetime":"1h","scopes":["checkout"]}' | jget "['token']")
[ -n "$CO" ] && [ -n "$RO" ] && [ -n "$OT" ] || { echo "setup failed (is AGENT_CHECKOUT=test set?)"; exit 2; }
IDEM="idem-$RANDOM-$RANDOM-abcdef"
A="Authorization: Bearer $CO"; J='Content-Type: application/json'

echo "gating"
check "status endpoint says test" test "$(cu -s "$B/api/agent/status" | jget "['checkout']")"
check "no token → 401" 401 "$(code -X POST "$B/api/agent/checkout" -H "Idempotency-Key: $IDEM" -H "$J" -d '{}')"
check "forged token → 401" 401 "$(code -X POST "$B/api/agent/checkout" -H 'Authorization: Bearer kwa_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' -H "Idempotency-Key: $IDEM" -H "$J" -d '{}')"
check "read-only token → 403" 403 "$(code -X POST "$B/api/agent/checkout" -H "Authorization: Bearer $RO" -H "Idempotency-Key: $IDEM" -H "$J" -d '{}')"
check "GET not allowed → 405" 405 "$(code "$B/api/agent/checkout" -H "$A")"
check "foreign origin → 403" 403 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H 'Origin: https://evil.example' -H "Idempotency-Key: $IDEM" -H "$J" -d '{}')"

echo "input"
check "no Idempotency-Key → 400" 400 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "$J" -d '{}')"
check "bad Idempotency-Key → 400" 400 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H 'Idempotency-Key: x' -H "$J" -d '{}')"
check "wrong content type → 415" 415 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H 'Content-Type: text/plain' -d '{}')"
check "oversize body → 413" 413 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d "{\"note\":\"$(head -c 3000 /dev/zero | tr '\0' a)\"}")"
check "quantity 5 → 422" 422 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"quantity":5}')"
check "unknown product → 422" 422 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"product":"free-book"}')"
check "control chars in note → 422" 422 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"note":"a\nb"}')"

echo "create"
R=$(cu -si -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"product":"preorder","quantity":1,"note":"Reader asked me to get the pre-order","price":1,"amount":1,"price_id":"price_evil","customer_email":"evil@example.com","metadata":{"x":"y"}}' | tr -d '\r')
BODY=$(printf '%s' "$R" | sed -n '/^{/p')
check "created → 201" 201 "$(printf '%s' "$R" | head -1 | cut -d' ' -f2)"
URL=$(printf '%s' "$BODY" | jget "['checkout_url']"); OID=$(printf '%s' "$BODY" | jget "['order_id']")
check "checkout_url is Stripe-hosted" checkout.stripe.com "$(printf '%s' "$URL" | sed -n 's#https://\([^/]*\)/.*#\1#p')"
check "a human must act" True "$(printf '%s' "$BODY" | jget "['human_action_required']")"
check "mode is test" test "$(printf '%s' "$BODY" | jget "['mode']")"
check "record names the human, the agent and the note" "True" "$(printf '%s' "$BODY" | python3 -c "import sys,json;r=json.load(sys.stdin)['record'];print(bool(r['principal']['label']) and r['agent']['name']=='Shopper' and r['agent']['operator']=='Test Ops' and 'pre-order' in r['context'])")"
CALL=$(cu -s "$MOCK/__calls" | python3 -c "import sys,json;c=json.load(sys.stdin);print(json.dumps(c[-1]['params']))")
check "Stripe got the server's price id, not the agent's" price_test_local123 "$(printf '%s' "$CALL" | jget "['line_items[0][price]']")"
check "quantity sent as 1" 1 "$(printf '%s' "$CALL" | jget "['line_items[0][quantity]']")"
check "email came from the principal, not the body" 0 "$(printf '%s' "$CALL" | grep -c 'evil@example.com')"
check "agent identity is in Stripe metadata" Shopper "$(printf '%s' "$CALL" | jget "['metadata[agent_name]']")"
check "agent-supplied metadata is not forwarded" 0 "$(printf '%s' "$CALL" | grep -c '"metadata\[x\]"')"
N1=$(cu -s "$MOCK/__calls" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))")

echo "idempotency and replay"
R2=$(cu -si -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"product":"preorder","quantity":1,"note":"Reader asked me to get the pre-order"}' | tr -d '\r')
check "replay → 200" 200 "$(printf '%s' "$R2" | head -1 | cut -d' ' -f2)"
check "replay returns the same order" "$OID" "$(printf '%s' "$R2" | sed -n '/^{/p' | jget "['order_id']")"
check "replay is marked" 1 "$(printf '%s' "$R2" | grep -ci '^idempotent-replayed: true')"
check "replay made no second Stripe call" "$N1" "$(cu -s "$MOCK/__calls" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))")"
check "same key, different body → 422" 422 "$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: $IDEM" -H "$J" -d '{"note":"something else"}')"

echo "order status"
check "own order readable" pending_payment "$(cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"
check "another person's token cannot read it → 404" 404 "$(code "$B/api/agent/orders/$OID" -H "Authorization: Bearer $OT")"
check "bad order id → 404" 404 "$(code "$B/api/agent/orders/..%2Fx" -H "$A")"

echo "webhook"
SESSION=$(printf '%s' "$URL" | sed 's#.*/##')
W="$B/api/stripe/webhook"
check "no signature → 400" 400 "$(code -X POST "$W" -H "$J" -d '{}')"
check "garbage signature → 400" 400 "$(code -X POST "$W" -H "$J" -H 'Stripe-Signature: t=1,v1=00' -d '{}')"
check "forged signature (wrong secret) → 400" 400 "$(node scripts/send-test-webhook.mjs checkout.session.completed "$OID" "$SESSION" --forge | cut -d' ' -f1)"
check "oversize body → 413" 413 "$(code -X POST "$W" -H "$J" -H 'Stripe-Signature: t=1,v1=00' -d "$(head -c 70000 /dev/zero | tr '\0' a)")"
check "GET → 405" 405 "$(code "$W")"
check "forged event did not mark it paid" pending_payment "$(cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"
check "live-mode event ignored" '{"received":true,"handled":false}' "$(node scripts/send-test-webhook.mjs checkout.session.completed "$OID" "$SESSION" --live | cut -d' ' -f2- | sed 's/ event=.*//')"
check "wrong amount ignored" '{"received":true,"handled":false}' "$(node scripts/send-test-webhook.mjs checkout.session.completed "$OID" "$SESSION" --amount=1 | cut -d' ' -f2- | sed 's/ event=.*//')"
check "wrong session id ignored" '{"received":true,"handled":false}' "$(node scripts/send-test-webhook.mjs checkout.session.completed "$OID" cs_test_someoneelse | cut -d' ' -f2- | sed 's/ event=.*//')"
check "still pending after all that" pending_payment "$(cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"
OUT=$(node scripts/send-test-webhook.mjs checkout.session.completed "$OID" "$SESSION")
check "signed completed event → handled" '200 {"received":true,"handled":true}' "$(printf '%s' "$OUT" | sed 's/ event=.*//')"
check "order is now paid" paid "$(cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"
EVT=$(printf '%s' "$OUT" | sed 's/.*event=//')
check "an already-paid order does not flip to expired" paid "$(node scripts/send-test-webhook.mjs checkout.session.expired "$OID" "$SESSION" >/dev/null; cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"

echo "caps"
newip
got429=0
for i in 1 2 3 4 5 6 7; do
  c=$(code -X POST "$B/api/agent/checkout" -H "$A" -H "Idempotency-Key: cap-$RANDOM-$i-zzzzzz" -H "$J" -d "{\"note\":\"cap $i\"}")
  [ "$c" = 429 ] && got429=1 && break
done
check "more than 5 new orders an hour per token → 429" 1 "$got429"

printf '\n%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
