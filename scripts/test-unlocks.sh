#!/usr/bin/env bash
# Tests chapter unlocks end to end against a local `wrangler pages dev dist --kv CLAIMS` that has
# RESEND_API_KEY, RESEND_API_BASE=http://127.0.0.1:12113 (scripts/mock-resend.mjs) and AGENT_TOKENS=on.
# Makes no external calls; no real email is sent.
# Usage: scripts/test-unlocks.sh [base-url] [mock-url]   (defaults http://localhost:8789 and http://127.0.0.1:12113)
set -u
B="${1:-http://localhost:8789}"; M="${2:-http://127.0.0.1:12113}"
O="Origin: $B"; J='Content-Type: application/json'
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
newip() { IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"; }
newip
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
N="$RANDOM$RANDOM"

# signin EMAIL [REF] → prints the kw_reader cookie after the full confirm-by-email flow
signin() {
  newip
  local body="{\"email\":\"$1\",\"chapter\":\"01\"$([ -n "${2:-}" ] && printf ',"ref":"%s"' "$2")}"
  cu -s -o /dev/null -X POST "$B/api/reader" -H "$O" -H "$J" -d "$body"
  local link; link=$(curl -s "$M/__mails?to=$1" | sed -n 's/.*"text":"[^"]*\/api\/reader\/confirm?t=\([A-Za-z0-9_-]*\).*/\1/p' | head -1)
  cu -si -X POST "$B/api/reader/confirm" -H "$O" -d "t=$link" | tr -d '\r' | sed -n 's/^[Ss]et-[Cc]ookie: \(kw_reader=[^;]*\);.*/\1/p' | head -1
}
status_of() { code "$B/read/$1/full" -H "Cookie: $2"; }

A="alice-$N@example.com"; BOB="bob-$N@example.com"
echo "a new reader"
AC=$(signin "$A")
check "signed in" 1 "$([ -n "$AC" ] && echo 1 || echo 0)"
check "Chapter 1 is open" 200 "$(status_of 01 "$AC")"
check "Chapter 2 is not" 302 "$(status_of 02 "$AC")"
check "locked chapter sends them to the progress page" "/read/progress/?locked=02" "$(cu -si "$B/read/02/full" -H "Cookie: $AC" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p')"
check "the progress page exists" 200 "$(code "$B/read/progress/")"
ME=$(cu -s "$B/api/reader/me" -H "Cookie: $AC")
check "/me: 1 of 10 open" '"unlocked":1' "$(printf '%s' "$ME" | grep -o '"unlocked":[0-9]*')"
check "/me hides the address" 0 "$(printf '%s' "$ME" | grep -c "$A")"
check "/me needs a cookie" 401 "$(code "$B/api/reader/me")"
REF=$(printf '%s' "$ME" | sed -n 's/.*ref=\([A-HJ-NP-Z2-9]\{8\}\).*/\1/p')
check "there is a share link" 1 "$([ -n "$REF" ] && echo 1 || echo 0)"

echo "inviting a friend"
BC=$(signin "$BOB" "$REF")
check "the friend gets Chapter 1" 200 "$(status_of 01 "$BC")"
check "the friend does not get Chapter 2" 302 "$(status_of 02 "$BC")"
check "the inviter now has Chapter 2" 200 "$(status_of 02 "$AC")"
check "still not Chapter 3" 302 "$(status_of 03 "$AC")"
AC2=$(signin "alice+again-$N@example.com" "$REF")
check "an alias of the inviter earns nothing" 302 "$(status_of 03 "$AC")"

echo "a note to the author"
NOTE=$(cu -s -X POST "$B/api/reader/note" -H "$O" -H "$J" -H "Cookie: $AC" -d '{"note":"The opening scene sold me on the whole argument.","chapter":"01"}')
check "the note is accepted and credited" '{"ok":true,"credited":true,"unlocked":3}' "$NOTE"
check "Chapter 3 is open" 200 "$(status_of 03 "$AC")"
check "a short note is refused" 422 "$(code -X POST "$B/api/reader/note" -H "$O" -H "$J" -H "Cookie: $AC" -d '{"note":"short"}')"
check "a note needs a cookie" 401 "$(code -X POST "$B/api/reader/note" -H "$O" -H "$J" -d '{"note":"This should not be accepted anonymously."}')"
check "a note from a foreign origin → 403" 403 "$(code -X POST "$B/api/reader/note" -H 'Origin: https://evil.example' -H "$J" -H "Cookie: $AC" -d '{"note":"This should not be accepted from elsewhere."}')"

echo "agents get what their person has"
TOK=$(cu -s -X POST "$B/api/agent/tokens" -H "$O" -H "$J" -H "Cookie: $AC" -d '{"name":"Test Agent","operator":"Test Ops","lifetime":"1h","scopes":["read"]}' | sed -n 's/.*"token":"\(kwa_[A-Za-z0-9_-]*\)".*/\1/p')
check "a token was minted" 1 "$([ -n "$TOK" ] && echo 1 || echo 0)"
H="Authorization: Bearer $TOK"
check "agent reads an open chapter" 200 "$(code "$B/api/agent/chapters/03" -H "$H")"
check "agent cannot read a locked chapter" 403 "$(code "$B/api/agent/chapters/04" -H "$H")"
check "the refusal says why" 1 "$(cu -s "$B/api/agent/chapters/04" -H "$H" | grep -c 'chapter_locked')"

echo "sign-out"
check "signing out closes everything on that device" 302 "$(cu -s -o /dev/null -w '%{http_code}' "$B/api/reader?forget=1" -H "Cookie: $AC")"
check "and the chapter is closed again" 302 "$(status_of 01 "$AC")"

printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
