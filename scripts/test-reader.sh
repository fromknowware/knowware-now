#!/usr/bin/env bash
# Tests verified sign-up end to end against a local `wrangler pages dev dist --kv CLAIMS` that has
# RESEND_API_KEY and RESEND_API_BASE=http://127.0.0.1:12113 (scripts/mock-resend.mjs). Makes no
# external calls; no real email is sent.
# Usage: scripts/test-reader.sh [base-url] [mock-url]   (defaults http://localhost:8789 and http://127.0.0.1:12113)
set -u
B="${1:-http://localhost:8789}"; M="${2:-http://127.0.0.1:12113}"
O="Origin: $B"; J='Content-Type: application/json'
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
EMAIL="reader-$RANDOM$RANDOM@example.com"
mails() { curl -s "$M/__mails?to=$EMAIL"; }

echo "asking for access"
RES=$(cu -si -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$EMAIL\",\"chapter\":\"01\"}" | tr -d '\r')
check "POST → 200" 200 "$(printf '%s' "$RES" | sed -n '1s/[^ ]* \([0-9]*\).*/\1/p')"
check "answer says check your email" 1 "$(printf '%s' "$RES" | grep -c '"sent":true')"
check "no access cookie is set" 0 "$(printf '%s' "$RES" | grep -ci '^set-cookie: kw_reader')"
check "full chapter still refused" 302 "$(code "$B/read/01/full")"
check "exactly one email was sent" 1 "$(mails | grep -o '"subject"' | wc -l | tr -d ' ')"
LINK=$(mails | sed -n 's/.*"text":"[^"]*\(http[^"\\ ]*\/api\/reader\/confirm?t=[A-Za-z0-9_-]*\).*/\1/p' | head -1)
check "the email carries a confirm link" 1 "$([ -n "$LINK" ] && echo 1 || echo 0)"
check "the email also has an HTML part" 1 "$(mails | grep -c '"html":"<!doctype html>')"
LOCAL="$B$(printf '%s' "$LINK" | sed 's|https\{0,1\}://[^/]*||')"
TOKEN=$(printf '%s' "$LINK" | sed 's/.*t=//')

echo "the link page"
PAGE=$(cu -si "$LOCAL" | tr -d '\r')
check "GET shows the confirm page" 200 "$(printf '%s' "$PAGE" | sed -n '1s/[^ ]* \([0-9]*\).*/\1/p')"
check "the page has the button" 1 "$(printf '%s' "$PAGE" | grep -c 'Confirm and read')"
check "the page is no-store and noindex" 2 "$(printf '%s' "$PAGE" | grep -ci '^cache-control: no-store\|^x-robots-tag: noindex')"
check "the page keeps its token out of Referer but lets the form send an Origin (not no-referrer)" "strict-origin" "$(printf '%s' "$PAGE" | sed -n 's/^[Rr]eferrer-[Pp]olicy: //p')"
check "the page does not leak the address" 0 "$(printf '%s' "$PAGE" | grep -c "$EMAIL")"
check "opening the page unlocks nothing" 302 "$(code "$B/read/01/full")"
check "opening it twice is harmless" 200 "$(code "$LOCAL")"
check "bad token → redirect" 302 "$(code "$B/api/reader/confirm?t=nope")"
check "confirm from a foreign origin → 403" 403 "$(code -X POST "$B/api/reader/confirm" -H 'Origin: https://evil.example' -d "t=$TOKEN")"

echo "confirming"
OUT=$(cu -si -X POST "$B/api/reader/confirm" -H "$O" -d "t=$TOKEN" | tr -d '\r')
check "POST confirm → 303" 303 "$(printf '%s' "$OUT" | sed -n '1s/[^ ]* \([0-9]*\).*/\1/p')"
check "goes to the chapter" "/read/01/full#continue" "$(printf '%s' "$OUT" | sed -n 's/^[Ll]ocation: //p')"
COOKIE=$(printf '%s' "$OUT" | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1)
check "an HttpOnly access cookie is set" 1 "$(printf '%s' "$OUT" | grep -ci '^set-cookie: kw_reader=.*httponly')"
check "the full chapter opens with it" 200 "$(code "$B/read/01/full" -H "Cookie: $COOKIE")"
check "a made-up cookie does not" 302 "$(code "$B/read/01/full" -H "Cookie: kw_reader=$(printf 'A%.0s' $(seq 1 43))")"

echo "single use"
check "second use of the link → expired" 302 "$(code "$LOCAL")"
check "second POST → expired redirect" "/read/?link=expired" "$(cu -si -X POST "$B/api/reader/confirm" -H "$O" -d "t=$TOKEN" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "old-style ?t= links open nothing" "/read/?link=invalid" "$(cu -si "$B/api/reader?t=$TOKEN" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"

echo "asking again"
RES2=$(cu -s -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"$EMAIL\",\"chapter\":\"01\"}")
check "same answer, nothing sent inside ten minutes" 1 "$(mails | grep -o '"subject"' | wc -l | tr -d ' ')"
check "answer unchanged" '{"ok":true,"sent":true}' "$RES2"
check "bad address → 422" 422 "$(code -X POST "$B/api/reader" -H "$O" -H "$J" -d '{"email":"nope"}')"
check "foreign origin → 403" 403 "$(code -X POST "$B/api/reader" -H 'Origin: https://evil.example' -H "$J" -d "{\"email\":\"$EMAIL\"}")"
check "honeypot looks successful but sends nothing" 0 "$(cu -s -X POST "$B/api/reader" -H "$O" -H "$J" -d "{\"email\":\"trap-$EMAIL\",\"company\":\"Acme\"}" >/dev/null; curl -s "$M/__mails?to=trap-$EMAIL" | grep -o '"subject"' | wc -l | tr -d ' ')"

echo "signing out"
check "forget removes this device" 302 "$(code "$B/api/reader?forget=1" -H "Cookie: $COOKIE")"
check "the cookie no longer opens the chapter" 302 "$(code "$B/read/01/full" -H "Cookie: $COOKIE")"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
