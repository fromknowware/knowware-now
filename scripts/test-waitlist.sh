#!/usr/bin/env bash
# Tests the pre-order waiting list against local `wrangler pages dev dist --kv CLAIMS`
# with ADMIN_TOKEN and READER_AUTOCONFIRM=true set in .dev.vars (no email key, so sign-up confirms at once).
# The confirm-by-email flow itself is scripts/test-lists.sh. Makes no external calls.
set -u
B="${1:-http://localhost:8788}"; O="Origin: $B"; J='Content-Type: application/json'
ADMIN="${ADMIN_TOKEN:-local-admin-token-for-tests-0123456789abcdef}"
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
newip() { IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"; }
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
EMAIL="waitlist-$RANDOM$RANDOM@example.com"

check "GET → 405" 405 "$(code "$B/api/waitlist")"
check "foreign origin → 403" 403 "$(code -X POST "$B/api/waitlist" -H 'Origin: https://evil.example' -H "$J" -d "{\"email\":\"$EMAIL\"}")"
check "no origin → 403" 403 "$(code -X POST "$B/api/waitlist" -H "$J" -d "{\"email\":\"$EMAIL\"}")"
check "wrong content type → 415" 415 "$(code -X POST "$B/api/waitlist" -H "$O" -H 'Content-Type: text/plain' -d "{\"email\":\"$EMAIL\"}")"
python3 -c "print('{\"email\":\"' + 'a'*3000 + '@b.co\"}')" > /tmp/wl-big.json
check "oversize → 413" 413 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" --data-binary @/tmp/wl-big.json)"
check "broken JSON → 400" 400 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d '{nope')"
check "invalid email → 422" 422 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d '{"email":"nope"}')"
check "header-injection email → 422" 422 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d '{"email":"a@b.co\nBcc: x@y.co"}')"
check "email as an object → 422" 422 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d '{"email":{"a":1}}')"
check "form post, bad email → redirect back to the form" "303 /order#waitlist" "$(cu -s -o /dev/null -w '%{http_code} %{redirect_url}' -X POST "$B/api/waitlist" -H "$O" -d 'email=nope' | sed "s#$B##")"

echo "join"
check "valid sign-up → 200" 200 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d "{\"email\":\"$EMAIL\"}")"
check "same address again → 200, indistinguishable" 200 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d "{\"email\":\"$(echo $EMAIL | tr a-z A-Z)\"}")"
check "form post, valid → redirect to the thanks page" "303 /order/confirmed/" "$(cu -s -o /dev/null -w '%{http_code} %{redirect_url}' -X POST "$B/api/waitlist" -H "$O" -d "email=form-$EMAIL" | sed "s#$B##")"
check "honeypot looks successful but stores nothing" 200 "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d '{"email":"bot-'"$EMAIL"'","company":"Acme"}')"

echo "admin export"
A="Authorization: Bearer $ADMIN"
check "no token → 401" 401 "$(code "$B/api/admin/waitlist")"
check "wrong token → 401" 401 "$(code "$B/api/admin/waitlist" -H 'Authorization: Bearer nope')"
LIST=$(cu -s "$B/api/admin/waitlist" -H "$A")
check "real address is listed" 1 "$(printf '%s' "$LIST" | grep -c "$EMAIL")"
check "same address listed once" 1 "$(printf '%s' "$LIST" | grep -o "\"email\":\"$EMAIL\"" | wc -l | tr -d ' ')"
check "honeypot address is not listed" 0 "$(printf '%s' "$LIST" | grep -c "bot-$EMAIL")"
check "CSV export" "text/csv; charset=utf-8" "$(cu -si "$B/api/admin/waitlist?format=csv" -H "$A" | tr -d '\r' | sed -n 's/^[Cc]ontent-[Tt]ype: //p')"
check "bad format → 400" 400 "$(code "$B/api/admin/waitlist?format=xml" -H "$A")"

echo "limit"
newip; got429=0
for i in $(seq 1 10); do [ "$(code -X POST "$B/api/waitlist" -H "$O" -H "$J" -d "{\"email\":\"rl$i-$EMAIL\"}")" = 429 ] && got429=1 && break; done
check "per-connection limit → 429" 1 "$got429"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
