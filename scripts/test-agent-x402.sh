#!/usr/bin/env bash
# Tests the x402 testnet rail against local `wrangler pages dev dist --kv CLAIMS`
# with X402_MODE=testnet, X402_PAY_TO and X402_FACILITATOR_URL pointing at
# `node scripts/mock-facilitator.mjs`. No network, no wallet, no real facilitator.
# Needs AGENT_REQUIRE_VERIFIED_EMAIL=false in .dev.vars (local dev only): no email is sent here to confirm.
set -u
B="${1:-http://localhost:8788}"; MOCKF="${2:-http://127.0.0.1:12112}"
O="Origin: $B"; J='Content-Type: application/json'
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
jget() { python3 -c "import sys,json;d=json.load(sys.stdin);print(d$1)" 2>/dev/null; }
signup() { cu -si -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$1\",\"chapter\":\"01\"}" | tr -d '\r' | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1; }
mint() { cu -s -X POST "$B/api/agent/tokens" -H "$O" -H "Cookie: $1" -H "$J" -d "$2" | jget "['token']"; }
ncalls() { cu -s "$MOCKF/__calls" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))"; }
newkey() { echo "k-$RANDOM-$RANDOM-abcdef"; }

C1=$(signup "x4-$RANDOM@example.com"); C2=$(signup "x4o-$RANDOM@example.com")
READ=$(mint "$C1" '{"name":"Reader","operator":"Ops","lifetime":"1h"}')
CHK=$(mint "$C1" '{"name":"Stripe Only","operator":"Ops","lifetime":"1h","scopes":["read","checkout"]}')
PAY=$(mint "$C1" '{"name":"Wallet Agent","operator":"Ops","lifetime":"1h","scopes":["read","pay"]}')
PAY2=$(mint "$C2" '{"name":"Wallet Two","operator":"Ops","lifetime":"1h","scopes":["pay"]}')
[ -n "$PAY" ] && [ -n "$PAY2" ] || { echo "could not mint pay tokens (is X402_MODE=testnet set?)"; exit 2; }
U="$B/api/agent/x402/digital"

echo "gating"
check "status says testnet" testnet "$(cu -s "$B/api/agent/status" | jget "['x402']")"
check "no token → 401" 401 "$(code -X POST "$U" -H "$J" -H "Idempotency-Key: $(newkey)" -d '{}')"
check "read-only token → 403" 403 "$(code -X POST "$U" -H "Authorization: Bearer $READ" -H "$J" -H "Idempotency-Key: $(newkey)" -d '{}')"
check "Stripe checkout scope is not a pay mandate → 403" 403 "$(code -X POST "$U" -H "Authorization: Bearer $CHK" -H "$J" -H "Idempotency-Key: $(newkey)" -d '{}')"
check "GET → 405" 405 "$(code "$U" -H "Authorization: Bearer $PAY")"
check "foreign origin → 403" 403 "$(code -X POST "$U" -H "Authorization: Bearer $PAY" -H 'Origin: https://evil.example' -H "$J" -H "Idempotency-Key: $(newkey)" -d '{}')"
check "no Idempotency-Key → 400" 400 "$(code -X POST "$U" -H "Authorization: Bearer $PAY" -H "$J" -d '{}')"
check "control characters in note → 422" 422 "$(code -X POST "$U" -H "Authorization: Bearer $PAY" -H "$J" -H "Idempotency-Key: $(newkey)" -d '{"note":"a\nb"}')"
check "oversize body → 413" 413 "$(code -X POST "$U" -H "Authorization: Bearer $PAY" -H "$J" -H "Idempotency-Key: $(newkey)" -d "{\"note\":\"$(head -c 3000 /dev/zero | tr '\0' a)\"}")"

echo "challenge"
K=$(newkey); A="Authorization: Bearer $PAY"
R=$(cu -si -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -d '{"note":"the person asked for the ebook"}' | tr -d '\r')
check "first call → 402" 402 "$(printf '%s' "$R" | head -1 | cut -d' ' -f2)"
PR=$(printf '%s' "$R" | sed -n 's/^[Pp][Aa][Yy][Mm][Ee][Nn][Tt]-[Rr][Ee][Qq][Uu][Ii][Rr][Ee][Dd]: //p')
dec() { printf '%s' "$PR" | python3 -c "import sys,base64,json;d=json.loads(base64.b64decode(sys.stdin.read()));print(d$1)"; }
check "PAYMENT-REQUIRED is x402 v2" 2 "$(dec "['x402Version']")"
check "network is Base Sepolia testnet" eip155:84532 "$(dec "['accepts'][0]['network']")"
check "amount is the digital price in USDC base units" 11950000 "$(dec "['accepts'][0]['amount']")"
check "asset is testnet USDC" 0x036CbD53842c5426634e7929541eC2318f3dCF7e "$(dec "['accepts'][0]['asset']")"
check "scheme exact" exact "$(dec "['accepts'][0]['scheme']")"
check "body names the human principal" True "$(printf '%s' "$R" | sed -n '/^{/p' | python3 -c "import sys,json;b=json.load(sys.stdin)['knowware'];print(bool(b['human_principal']['label']) and 'TESTNET' in b['instructions_for_agent'])")"
N0=$(ncalls)

echo "payment checks (no facilitator call for bad payloads)"
pay() { node scripts/make-x402-payment.mjs "$PR" "$@"; }
send() { code -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -H "PAYMENT-SIGNATURE: $1" -d '{"note":"the person asked for the ebook"}'; }
check "garbage header → 422" 422 "$(send 'not-base64!!')"
check "wrong amount authorized → 422" 422 "$(send "$(pay --value 1)")"
check "accepted amount tampered → 422" 422 "$(send "$(pay --accepted-amount 1)")"
check "paid to someone else → 422" 422 "$(send "$(pay --payto 0x1111111111111111111111111111111111111111)")"
check "authorization already expired → 422" 422 "$(send "$(pay --before -10)")"
check "authorization valid far too long → 422" 422 "$(send "$(pay --before 100000)")"
check "none of those reached the facilitator" "$N0" "$(ncalls)"

echo "facilitator outcomes"
K=$(newkey)
check "payer without funds → 402 payment_not_valid" payment_not_valid "$(cu -s -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -H "PAYMENT-SIGNATURE: $(pay --from 0x000000000000000000000000000000000000dead)" -d '{}' | jget "['error']")"
K=$(newkey)
check "settlement failure → 402 settlement_failed" settlement_failed "$(cu -s -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -H "PAYMENT-SIGNATURE: $(pay --from 0x000000000000000000000000000000000000beef)" -d '{}' | jget "['error']")"

echo "success, replay, one-purchase mandate"
K=$(newkey); NONCE=0x$(python3 -c "import secrets;print(secrets.token_hex(32))")
S=$(pay --nonce "$NONCE")
OK=$(cu -si -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -H "PAYMENT-SIGNATURE: $S" -d '{"note":"the person asked for the ebook"}' | tr -d '\r')
check "paid → 200" 200 "$(printf '%s' "$OK" | head -1 | cut -d' ' -f2)"
OB=$(printf '%s' "$OK" | sed -n '/^{/p'); OID=$(printf '%s' "$OB" | jget "['order_id']")
check "PAYMENT-RESPONSE header present" 1 "$(printf '%s' "$OK" | grep -ci '^payment-response:')"
check "order is paid, testnet" "paid x402-testnet" "$(printf '%s' "$OB" | jget "['status']") $(printf '%s' "$OB" | jget "['mode']")"
check "record names the human, the agent and the note" True "$(printf '%s' "$OB" | python3 -c "import sys,json;r=json.load(sys.stdin)['record'];print(r['agent']['name']=='Wallet Agent' and r['agent']['operator']=='Ops' and 'ebook' in r['context'] and bool(r['principal']['id']))")"
check "order readable by the same person's token" paid "$(cu -s "$B/api/agent/orders/$OID" -H "$A" | jget "['status']")"
check "another person's token cannot read it → 404" 404 "$(code "$B/api/agent/orders/$OID" -H "Authorization: Bearer $PAY2")"
N1=$(ncalls)
R2=$(cu -si -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K" -H "PAYMENT-SIGNATURE: $S" -d '{"note":"the person asked for the ebook"}' | tr -d '\r')
check "replay → 200 marked replayed, same order" "200 1 $OID" "$(printf '%s' "$R2" | head -1 | cut -d' ' -f2) $(printf '%s' "$R2" | grep -ci '^idempotent-replayed: true') $(printf '%s' "$R2" | sed -n '/^{/p' | jget "['order_id']")"
check "replay did not touch the facilitator" "$N1" "$(ncalls)"
K2=$(newkey)
check "second purchase on the same token → 409 mandate_used" mandate_used "$(cu -s -X POST "$U" -H "$A" -H "$J" -H "Idempotency-Key: $K2" -d '{}' | jget "['error']")"

echo "authorization reuse by another token"
A2="Authorization: Bearer $PAY2"; K3=$(newkey)
R3=$(cu -si -X POST "$U" -H "$A2" -H "$J" -H "Idempotency-Key: $K3" -d '{}' | tr -d '\r'); PR2=$(printf '%s' "$R3" | sed -n 's/^[Pp][Aa][Yy][Mm][Ee][Nn][Tt]-[Rr][Ee][Qq][Uu][Ii][Rr][Ee][Dd]: //p')
check "same EIP-3009 nonce on another token → 409" authorization_already_used "$(cu -s -X POST "$U" -H "$A2" -H "$J" -H "Idempotency-Key: $K3" -H "PAYMENT-SIGNATURE: $(node scripts/make-x402-payment.mjs "$PR2" --nonce "$NONCE")" -d '{}' | jget "['error']")"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
