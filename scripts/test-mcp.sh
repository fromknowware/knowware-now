#!/usr/bin/env bash
# Abuse-tests /mcp against a local `wrangler pages dev dist --kv CLAIMS`. No external calls.
# Needs AGENT_REQUIRE_VERIFIED_EMAIL=false in .dev.vars (local dev only): no email is sent here to confirm.
set -u
B="${1:-http://localhost:8788}"; O="Origin: $B"; J='Content-Type: application/json'
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
cu() { command curl "$@" -H "$IPH"; }
code() { cu -s -o /dev/null -w '%{http_code}' "$@"; }
rpc() { cu -s -X POST "$B/mcp" -H "$J" "${@:2}" -d "$1"; }
jq_() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)" 2>/dev/null; }

check "GET → 405" 405 "$(code "$B/mcp")"
check "wrong content type → 415" 415 "$(code -X POST "$B/mcp" -H 'Content-Type: text/plain' -d '{}')"
check "foreign origin → 403" 403 "$(code -X POST "$B/mcp" -H "$J" -H 'Origin: https://evil.example' -d '{"jsonrpc":"2.0","id":1,"method":"ping"}')"
BIG=$(mktemp); python3 -c "print('{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"ping\",\"pad\":\"' + 'a' * 9000 + '\"}')" > "$BIG"
check "oversize body → 413" 413 "$(code -X POST "$B/mcp" -H "$J" --data-binary @"$BIG")"; rm -f "$BIG"
check "batch (array) → 400" 400 "$(code -X POST "$B/mcp" -H "$J" -d '[{"jsonrpc":"2.0","id":1,"method":"ping"}]')"
check "not JSON-RPC → 400" 400 "$(code -X POST "$B/mcp" -H "$J" -d '{"id":1,"method":"ping"}')"
check "notification → 202" 202 "$(code -X POST "$B/mcp" -H "$J" -d '{"jsonrpc":"2.0","method":"notifications/initialized"}')"
check "unknown method → -32601" -32601 "$(rpc '{"jsonrpc":"2.0","id":1,"method":"resources/list"}' | jq_ "d['error']['code']")"
check "unknown tool → -32602" -32602 "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"delete_everything","arguments":{}}}' | jq_ "d['error']['code']")"
check "tools/list has 4 tools" 4 "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq_ "len(d['result']['tools'])")"
check "traversal slug is a tool error, not a crash" True "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_preview","arguments":{"slug":"../../x"}}}' | jq_ "d['result']['isError']")"
check "preview carries notice + synthesized" True "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_preview","arguments":{"slug":"01"}}}' | python3 -c "import sys,json;t=json.loads(json.load(sys.stdin)['result']['content'][0]['text']);print(t['synthesized'] is True and 'Untrusted' in t['notice'] and t['untrusted_third_party_text'])")"
check "read_chapter without a token is refused" True "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_chapter","arguments":{"slug":"01"}}}' | jq_ "d['result']['isError']")"
check "read_chapter with a forged token is refused" True "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_chapter","arguments":{"slug":"01"}}}' -H 'Authorization: Bearer kwa_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' | jq_ "d['result']['isError']")"
check "read_chapter refusal leaks no chapter text" 0 "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_chapter","arguments":{"slug":"01"}}}' | grep -c 'Algorithm That Taught')"
check "extra arguments are ignored" True "$(rpc '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"define_term","arguments":{"term":"knowware","admin":true,"__proto__":{"x":1}}}}' | jq_ "not d['result']['isError']")"
got429=0; IPH="CF-Connecting-IP: 203.0.113.$((RANDOM % 250 + 1)).$((RANDOM % 250 + 1))"
for i in $(seq 1 260); do [ "$(code -X POST "$B/mcp" -H "$J" -d '{"jsonrpc":"2.0","id":1,"method":"ping"}')" = 429 ] && got429=1 && break; done
check "per-connection rate limit → 429" 1 "$got429"
printf '\n%d passed, %d failed\n' "$pass" "$fail"; [ "$fail" -eq 0 ]
