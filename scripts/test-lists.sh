#!/usr/bin/env bash
# Tests the two lists (news and pre-order) end to end against a local `wrangler pages dev dist --kv CLAIMS`
# that has RESEND_API_KEY, RESEND_API_BASE=http://127.0.0.1:12113 (scripts/mock-resend.mjs) and ADMIN_TOKEN.
# Makes no external calls; no real email is sent.
# Usage: scripts/test-lists.sh [base-url] [mock-url]   (defaults http://localhost:8789 and http://127.0.0.1:12113)
set -u
B="${1:-http://localhost:8789}"; M="${2:-http://127.0.0.1:12113}"
O="Origin: $B"; J='Content-Type: application/json'
ADMIN="${ADMIN_TOKEN:-local-admin-token-for-tests-0123456789abcdef}"; A="Authorization: Bearer $ADMIN"
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
N="$RANDOM$RANDOM"; W="wl-$N@example.com"; I="news-$N@example.com"; G="gate-$N@example.com"
mails() { curl -s "$M/__mails?to=$1"; }
members() { cu -s "$B/api/admin/lists?list=$1" -H "$A"; }
linkfor() { mails "$1" | sed -n 's/.*"text":"[^"]*\(\/api\/[a-z\/]*confirm?t=[A-Za-z0-9_-]*\).*/\1/p' | head -1; }

echo "pre-order list"
check "join → 200 sent" '{"ok":true,"sent":true}' "$(cu -s -X POST "$B/api/waitlist" -H "$O" -H "$J" -d "{\"email\":\"$W\"}")"
check "not a member before confirming" 0 "$(members waitlist | grep -c "$W")"
L=$(linkfor "$W"); check "a confirm link was mailed" 1 "$([ -n "$L" ] && echo 1 || echo 0)"
check "the email names the list" 1 "$(mails "$W" | grep -c 'when Knowware pre-orders open')"
check "GET the link → button page" 200 "$(code "$B$L")"
check "opening it does not join" 0 "$(members waitlist | grep -c "$W")"
T=${L##*t=}
OUT=$(cu -si -X POST "$B/api/list/confirm" -H "$O" -d "t=$T" | tr -d '\r')
check "POST confirm → thanks page" "/order/confirmed/" "$(printf '%s' "$OUT" | sed -n 's/^[Ll]ocation: //p')"
check "now on the pre-order list" 1 "$(members waitlist | grep -c "$W")"
check "NOT on the news list" 0 "$(members interest | grep -c "$W")"
check "link is single use" "/read/?link=expired" "$(cu -si -X POST "$B/api/list/confirm" -H "$O" -d "t=$T" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "foreign origin on confirm → 403" 403 "$(code -X POST "$B/api/list/confirm" -H 'Origin: https://evil.example' -d "t=$T")"

echo "news list"
check "join → 200 sent" '{"ok":true,"sent":true}' "$(cu -s -X POST "$B/api/interest" -H "$O" -H "$J" -d "{\"email\":\"$I\"}")"
L=$(linkfor "$I"); T=${L##*t=}
check "the email names the list" 1 "$(mails "$I" | grep -c 'a new Knowware chapter is published')"
check "POST confirm → news thanks page" "/read/subscribed/" "$(cu -si -X POST "$B/api/list/confirm" -H "$O" -d "t=$T" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "on the news list" 1 "$(members interest | grep -c "$I")"
check "NOT on the pre-order list" 0 "$(members waitlist | grep -c "$I")"

echo "the chapter gate's box"
cu -s -o /dev/null -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$G\",\"chapter\":\"01\",\"updates\":true}"
check "the confirmation mentions the news box" 1 "$(mails "$G" | grep -c 'ticked the box')"
check "ticking is not membership until confirmed" 0 "$(members interest | grep -c "$G")"
L=$(linkfor "$G"); T=${L##*t=}
cu -s -o /dev/null -X POST "$B/api/reader/confirm" -H "$O" -d "t=$T"
check "confirming reading joins the news list" 1 "$(members interest | grep -c "$G")"
check "and not the pre-order list" 0 "$(members waitlist | grep -c "$G")"

echo "export"
check "needs the token" 401 "$(code "$B/api/admin/lists?list=waitlist")"
check "bad list → 400" 400 "$(code "$B/api/admin/lists?list=nope" -H "$A")"
check "CSV header" 'email,list,status,created_at,confirmed_at,consent,source' "$(cu -s "$B/api/admin/lists?list=waitlist&format=csv" -H "$A" | head -1)"
check "the old waitlist URL still works" 200 "$(code "$B/api/admin/waitlist" -H "$A")"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
