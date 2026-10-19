#!/usr/bin/env bash
# Tests leaving and erasure end to end, and the Resend webhook, against a local `wrangler pages dev dist --kv CLAIMS`
# with RESEND_API_KEY, RESEND_API_BASE=http://127.0.0.1:12113 (scripts/mock-resend.mjs), ADMIN_TOKEN and
# RESEND_WEBHOOK_SECRET=whsec_dGVzdC13ZWJob29rLXNlY3JldC1mb3ItY2k= . Makes no external calls; no real email is sent.
# Usage: scripts/test-remove.sh [base-url] [mock-url]
set -u
B="${1:-http://localhost:8789}"; M="${2:-http://127.0.0.1:12113}"
O="Origin: $B"; J='Content-Type: application/json'
ADMIN="${ADMIN_TOKEN:-local-admin-token-for-tests-0123456789abcdef}"; A="Authorization: Bearer $ADMIN"
WHSEC="${WH_SECRET:-whsec_dGVzdC13ZWJob29rLXNlY3JldC1mb3ItY2k=}"
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
newip() { IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"; }
newip
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
N="$RANDOM$RANDOM"; E="leaver-$N@example.com"; Z="stranger-$N@example.com"
mails() { curl -s "$M/__mails?to=$1"; }
tokfor() { mails "$1" | sed -n "s/.*\"text\":\"[^\"]*\/api\/$2?t=\([A-Za-z0-9_-]*\).*/\1/p" | tail -1; }
members() { cu -s "$B/api/admin/lists?list=$1&status=$2" -H "$A"; }

# join both lists and become a reader (ticking the news box)
newip; cu -s -o /dev/null -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$E\",\"chapter\":\"01\",\"updates\":true}"
T=$(tokfor "$E" "reader\/confirm"); COOKIE=$(cu -si -X POST "$B/api/reader/confirm" -H "$O" -d "t=$T" | tr -d '\r' | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1)
check "reader signed in" 200 "$(code "$B/read/01/full" -H "Cookie: $COOKIE")"
check "on the news list" 1 "$(members interest confirmed | grep -c "$E")"

echo "asking to leave"
check "unknown address → same answer" '{"ok":true,"sent":true}' "$(cu -s -X POST "$B/api/remove/request" -H "$O" -H "$J" -d "{\"email\":\"$Z\"}")"
check "…and no email goes to a stranger" 0 "$(mails "$Z" | grep -o '"subject"' | wc -l | tr -d ' ')"
RESP=$(cu -s -X POST "$B/api/remove/request" -H "$O" -H "$J" -d "{\"email\":\"$E\"}")
check "known address → the same answer" '{"ok":true,"sent":true}' "$RESP"
RT=$(tokfor "$E" "remove\/confirm"); check "a removal link was mailed" 1 "$([ -n "$RT" ] && echo 1 || echo 0)"
PAGE=$(cu -si "$B/api/remove/confirm?t=$RT" | tr -d '\r')
check "GET shows three choices" 3 "$(printf '%s' "$PAGE" | grep -o 'name="what"' | wc -l | tr -d ' ')"
check "opening it removes nothing" 1 "$(members interest confirmed | grep -c "$E")"
check "foreign origin → 403" 403 "$(code -X POST "$B/api/remove/confirm" -H 'Origin: https://evil.example' -d "t=$RT&what=news")"
check "a bad choice → expired redirect, link kept" "/unsubscribe/?link=expired" "$(cu -si -X POST "$B/api/remove/confirm" -H "$O" -d "t=$RT&what=bogus" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"

echo "stop news"
check "choosing news → done page" "/unsubscribed/" "$(cu -si -X POST "$B/api/remove/confirm" -H "$O" -d "t=$RT&what=news" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "off the news export" 0 "$(members interest confirmed | grep -c "$E")"
check "listed as unsubscribed" 1 "$(members interest unsubscribed | grep -c "$E")"
check "reading still works" 200 "$(code "$B/read/01/full" -H "Cookie: $COOKIE")"
check "the link was single use" "/unsubscribe/?link=expired" "$(cu -si -X POST "$B/api/remove/confirm" -H "$O" -d "t=$RT&what=news" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "the author was told" 1 "$(curl -s "$M/__mails?to=author@example.com" | grep -c "$E")"

echo "delete everything"
F="erase-$N@example.com"
newip; cu -s -o /dev/null -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$F\",\"chapter\":\"01\",\"updates\":true}"
FT=$(tokfor "$F" "reader\/confirm"); FC=$(cu -si -X POST "$B/api/reader/confirm" -H "$O" -d "t=$FT" | tr -d '\r' | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1)
check "second reader is signed in" 200 "$(code "$B/read/01/full" -H "Cookie: $FC")"
cu -s -o /dev/null -X POST "$B/api/remove/request" -H "$O" -H "$J" -d "{\"email\":\"$F\"}"
RT2=$(tokfor "$F" "remove\/confirm")
check "choosing all → done page" "/unsubscribed/" "$(cu -si -X POST "$B/api/remove/confirm" -H "$O" -d "t=$RT2&what=all" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "their reading cookie is dead" 302 "$(code "$B/read/01/full" -H "Cookie: $FC")"
check "gone from every list export" 0 "$(members interest all | grep -c "$F")"
check "a second link inside ten minutes is not mailed to someone we no longer hold" 1 "$(mails "$F" | grep -c 'Manage your Knowware email')"

echo "Resend webhook"
sig() { # id ts body
  local key; key=$(printf '%s' "${WHSEC#whsec_}" | base64 -d | xxd -p | tr -d '\n')
  printf '%s' "$1.$2.$3" | openssl dgst -sha256 -mac HMAC -macopt "hexkey:$key" -binary | base64
}
hook() { # id ts body → status
  curl -s -o /dev/null -w '%{http_code}' -X POST "$B/api/resend-webhook" -H "svix-id: $1" -H "svix-timestamp: $2" -H "svix-signature: v1,$(sig "$1" "$2" "$3")" -d "$3"
}
TS=$(date +%s)
newip; cu -s -o /dev/null -X POST "$B/api/waitlist" -H "$O" -H "$J" -d "{\"email\":\"$Z\"}"; ZT=$(tokfor "$Z" "list\/confirm")
cu -s -o /dev/null -X POST "$B/api/list/confirm" -H "$O" -d "t=$ZT"
check "stranger-turned-member is on the pre-order list" 1 "$(members waitlist confirmed | grep -c "$Z")"
BODY="{\"type\":\"email.complained\",\"data\":{\"to\":[\"$Z\"]}}"
check "bad signature → 401" 401 "$(curl -s -o /dev/null -w '%{http_code}' -X POST "$B/api/resend-webhook" -H "svix-id: msg_bad_$N" -H "svix-timestamp: $TS" -H 'svix-signature: v1,AAAA' -d "$BODY")"
check "stale timestamp → 401" 401 "$(hook "msg_old_$N" "$((TS-3600))" "$BODY")"
check "signed complaint → 200" 200 "$(hook "msg_ok_$N" "$TS" "$BODY")"
check "the address left the pre-order list" 0 "$(members waitlist confirmed | grep -c "$Z")"
check "a replay is accepted but does nothing twice" 200 "$(hook "msg_ok_$N" "$TS" "$BODY")"
check "GET → 405" 405 "$(code "$B/api/resend-webhook")"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
