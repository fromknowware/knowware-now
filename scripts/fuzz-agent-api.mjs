#!/usr/bin/env node
// Seeded fuzzer for the agent API, the Stripe webhook, the admin view and /mcp.
// Needs a local `wrangler pages dev dist --kv CLAIMS` with .dev.vars set as for the
// other test scripts (AGENT_REQUIRE_VERIFIED_EMAIL=false, mock Stripe and facilitator
// optional). Makes no external calls.
//   node scripts/fuzz-agent-api.mjs [base] [--n 3000] [--seed 1]
// Rules every response must obey, whatever we throw at it:
//   - never a 5xx (an unexpected throw is a bug even though the shield hides it)
//   - never a stack trace, file path, or internal name in the body
//   - never echo back a credential we sent (cookie, bearer token, admin token, signature)
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const BASE = (args[0] && !args[0].startsWith('--') ? args[0] : 'http://localhost:8788').replace(/\/$/, '');
const N = Number(opt('n', 3000));
let seed = Number(opt('seed', 1)) >>> 0;
const ADMIN = process.env.ADMIN_TOKEN || 'local-admin-token-for-tests-0123456789abcdef';

function rand() { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const pick = (a) => a[Math.floor(rand() * a.length)];
const chance = (p) => rand() < p;
const randIp = () => `198.51.${Math.floor(rand() * 250)}.${Math.floor(rand() * 250)}`;
const rstr = (n) => Array.from({ length: n }, () => String.fromCharCode(32 + Math.floor(rand() * 95))).join('');

async function signup(email) {
  const res = await fetch(`${BASE}/api/reader`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE, 'CF-Connecting-IP': randIp() }, body: JSON.stringify({ email, chapter: '01' }) });
  const m = (res.headers.get('set-cookie') || '').match(/kw_reader=([^;]+)/);
  if (!m) throw new Error(`could not sign up ${email}: ${res.status}`);
  return `kw_reader=${m[1]}`;
}
async function mint(cookie, name, scopes) {
  const res = await fetch(`${BASE}/api/agent/tokens`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE, Cookie: cookie, 'CF-Connecting-IP': randIp() }, body: JSON.stringify({ name, operator: 'Fuzz Ops', lifetime: '1h', scopes }) });
  const j = await res.json();
  if (!j.token) throw new Error(`mint failed for ${name}: ${JSON.stringify(j)}`);
  return j.token;
}

const readers = [];
for (let i = 0; i < 3; i++) {
  const cookie = await signup(`fuzz-${Date.now()}-${i}@example.com`);
  readers.push({ cookie, read: await mint(cookie, 'Fuzz Reader', ['read']), checkout: await mint(cookie, 'Fuzz Shopper', ['read', 'checkout']), pay: await mint(cookie, 'Fuzz Wallet', ['read', 'pay']) });
}
const SECRETS = [...readers.flatMap((r) => [r.cookie.split('=')[1], r.read, r.checkout, r.pay]), ADMIN];

const SLUGS = ['01', '02', 'x', '99', '', '../x', '..%2F..%2Fetc%2Fpasswd', '%00', '01%0d%0aX-Evil:1', 'a'.repeat(300), '😀', '{{7*7}}', '01.md', '__proto__'];
const IDS = ['self', 'ord_0000000000000000', '0123456789ab', '../self', 'a'.repeat(200), '%00', 'constructor'];
// [path, the method it expects]. 85% of the time we use the right method so the deep code runs.
const ENDPOINTS = [
  () => ['/api/agent/status', 'GET'], () => ['/api/agent/me', 'GET'], () => ['/api/agent/chapters', 'GET'], () => [`/api/agent/chapters/${pick(SLUGS)}${chance(0.3) ? `?format=${pick(['md', 'json', 'x', '<script>', 'md&format=json'])}` : ''}`, 'GET'],
  () => [`/api/agent/orders/${pick(IDS)}`, 'GET'], () => ['/api/agent/tokens', pick(['POST', 'GET'])], () => [`/api/agent/tokens/${pick(IDS)}`, 'DELETE'], () => ['/api/agent/checkout', 'POST'], () => ['/api/agent/x402/digital', 'POST'],
  () => ['/api/stripe/webhook', 'POST'], () => [`/api/admin/orders${chance(0.5) ? `?status=${pick(['paid', '../x', 'a'.repeat(80), '%00', 'pending_payment'])}&cursor=${pick(['', 'abc', '!!', 'a'.repeat(600)])}` : ''}`, 'GET'], () => ['/mcp', 'POST'], () => ['/mcp', 'POST'], () => ['/api/agent/nope', 'GET'],
];
const METHODS = ['POST', 'POST', 'POST', 'GET', 'GET', 'DELETE', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];
const CTYPES = ['application/json', 'application/json', 'application/json; charset=utf-8', 'text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data; boundary=x', 'application/octet-stream', '', 'application/json;;;', 'APPLICATION/JSON', 'text/markdown'];
const FIELD = ['name', 'operator', 'lifetime', 'scopes', 'product', 'quantity', 'note', 'term', 'slug', 'arguments', 'email', 'jsonrpc', 'method', 'params', 'id', 'status', 'cursor'];
const WEIRD = [null, true, false, 0, -1, 1, 1.5, 1e308, '', ' ', '\u0000', '\ud800', '😀😀😀', 'a'.repeat(5000), [], [[]], ['read', 'pay', 'checkout', 'admin'], {}, { toString: 1 }, { __proto__: { admin: true } }, { a: { b: { c: [1, 2, { d: null }] } } }, 'preorder', 'digital', 'read', '1h', 'knowware', 'tools/list', 'tools/call', 'ping', '2.0'];
function jsonBody() {
  const roll = rand();
  if (roll < 0.08) return pick(['', 'null', '[]', '{}', '"s"', '123', 'true', '{', '{"a":', '﻿{}', '{"__proto__":{"x":1}}', '[' .repeat(5000), '{"a":'.repeat(3000), '{"a":1,"a":2}']);
  const o = {};
  for (let i = 0; i < 1 + Math.floor(rand() * 5); i++) o[pick(FIELD)] = pick(WEIRD);
  if (chance(0.25)) { o.jsonrpc = '2.0'; o.id = pick([1, 'a', null, 0, {}, []]); o.method = pick(['tools/list', 'tools/call', 'initialize', 'server/discover', 'ping', 'x', '', 'a'.repeat(100)]); o.params = pick([{ name: pick(['read_chapter', 'read_preview', 'define_term', 'list_chapters', 'zzz', {}]), arguments: pick(WEIRD) }, null, [], 'x', { protocolVersion: pick(['2026-07-28', 'x', 1]) }]); }
  if (chance(0.15)) o.note = rstr(Math.floor(rand() * 400));
  return JSON.stringify(o);
}
function body(ctype) {
  if (/json/i.test(ctype) || ctype === '') return chance(0.04) ? Buffer.from(Array.from({ length: 64 }, () => Math.floor(rand() * 256))) : jsonBody();
  if (/x-www-form/.test(ctype)) return new URLSearchParams({ [pick(FIELD)]: (() => { try { return JSON.stringify(pick(WEIRD)) ?? ''; } catch { return ''; } })(), email: rstr(20), company: rstr(5) }).toString();
  if (/multipart/.test(ctype)) return `--x\r\nContent-Disposition: form-data; name="${pick(FIELD)}"\r\n\r\n${rstr(30)}\r\n--x--`;
  return rstr(Math.floor(rand() * 2000));
}
const b64 = (s) => Buffer.from(s).toString('base64');
function headers(r, method) {
  const h = { 'CF-Connecting-IP': randIp() };
  const ct = pick(CTYPES); if (ct) h['Content-Type'] = ct;
  const who = pick(readers);
  const tok = pick([who.read, who.checkout, who.pay, 'kwa_' + 'A'.repeat(43), 'nope', '', ' ', 'a'.repeat(500), '😀']);
  const authForms = [`Bearer ${tok}`, `Bearer ${tok}`, `bearer ${tok}`, `Bearer  ${tok}`, `Basic ${b64(tok)}`, 'Bearer', `Bearer ${ADMIN}`, `Bearer ${ADMIN}x`, tok];
  if (chance(0.8)) { try { h.Authorization = pick(authForms); } catch {} }
  if (chance(0.25)) h.Cookie = pick([who.cookie, who.cookie + ';x=1', 'kw_reader=' + 'A'.repeat(43), 'kw_reader=', 'kw_reader=' + 'a'.repeat(4000), 'a=b; kw_reader=' + who.cookie.split('=')[1], '=;;;']);
  if (chance(0.6)) h.Origin = pick([BASE, BASE, 'https://evil.example', 'null', 'http://localhost:1', 'https://knowware.press', 'https://knowware.press.evil.example', '']);
  if (chance(0.5)) h['Idempotency-Key'] = pick(['k-12345678', rstr(8).replace(/[^A-Za-z0-9]/g, 'a'), 'x', 'a'.repeat(64), 'a'.repeat(65), 'bad key!', '😀😀😀😀😀😀😀😀', `fuzz-${Math.floor(rand() * 1e9)}-abc`]);
  if (chance(0.4)) h['PAYMENT-SIGNATURE'] = pick(['x', '%%%', 'A'.repeat(9000), b64('{}'), b64('null'), b64('[]'), b64('{"x402Version":2}'), b64('{"x402Version":2,"accepted":{},"payload":{}}'), b64('{"x402Version":2,"accepted":null,"payload":{"authorization":null}}'), b64('['.repeat(2000))]);
  if (chance(0.3)) h['Stripe-Signature'] = pick(['x', 't=1,v1=00', `t=${Math.floor(Date.now() / 1000)},v1=${'0'.repeat(64)}`, `t=${'9'.repeat(30)},v1=${'a'.repeat(64)}`, 'v1=' + 'a'.repeat(64), 't=,v1=', ','.repeat(300)]);
  if (chance(0.2)) h['Sec-Fetch-Site'] = pick(['same-origin', 'cross-site', 'none', 'same-site', 'x']);
  if (chance(0.15)) h.Accept = pick(['text/markdown', 'application/json', '*/*', 'text/event-stream', 'x'.repeat(2000)]);
  return h;
}

// Paths that reach one of our functions (after URL normalisation). Anything else is Pages'
// static 404, whose headers (including its default CORS) are not ours to police here.
const ROUTE = /^\/(api\/agent\/(status|me|chapters(\/[^/]+)?|orders\/[^/]+|tokens(\/[^/]+)?|checkout|x402\/digital)|api\/stripe\/webhook|api\/admin\/orders|mcp)\/?$/;
const BAD_BODY = /(\bat [^\s]+\.(js|mjs|ts):\d+|TypeError|ReferenceError|RangeError|SyntaxError|URIError|EvalError|Traceback|\/Users\/|\/Volumes\/|node_modules|CLAIMS|workerd|\bKV\b|stack)/;
const violations = [];
const tally = {};
async function one(i) {
  const [path, right] = pick(ENDPOINTS)();
  const method = chance(0.85) ? right : pick(METHODS);
  const h = headers(readers, method);
  const hasBody = !['GET', 'HEAD'].includes(method);
  const payload = hasBody ? body(h['Content-Type'] || '') : undefined;
  const desc = `${method} ${path.slice(0, 80)} ct=${(h['Content-Type'] || '').slice(0, 30)} auth=${(h.Authorization || '').slice(0, 14)} origin=${h.Origin ?? '-'}`;
  let res, text = '';
  try {
    res = await fetch(BASE + path, { method, headers: h, body: payload, redirect: 'manual', signal: AbortSignal.timeout(20000) });
    text = await res.text();
  } catch (e) {
    // Node refuses some hostile requests before they leave (illegal header characters, etc.): not a server fault.
    if (/Invalid|illegal|header|forbidden|not a valid|ByteString|ERR_INVALID/i.test(String(e?.message) + String(e?.cause?.message ?? e?.cause))) { tally.client_refused = (tally.client_refused || 0) + 1; return; }
    violations.push({ i, desc, why: `request failed: ${e?.name}: ${e?.message} ${e?.cause?.message ?? ''}` });
    return;
  }
  tally[res.status] = (tally[res.status] || 0) + 1;
  const why = [];
  if (res.status >= 500) why.push(`status ${res.status}`);
  // A 200 chapter read legitimately contains the book's own words ("stack" among them); everything else must be clean.
  const isChapterText = res.status === 200 && /\/api\/agent\/chapters\/[^/]+/.test(path);
  if (!isChapterText && BAD_BODY.test(text)) why.push(`internal detail in body: ${text.slice(0, 120)}`);
  for (const s of SECRETS) if (s && s.length > 20 && text.includes(s) && !(res.status === 200 && /\/api\/agent\/chapters\//.test(path))) why.push('echoed a credential we sent');
  if (res.status !== 204 && res.status !== 202 && res.status !== 304 && method !== 'HEAD' && text.length && !res.headers.get('content-type')) why.push('body without a content-type');
  const routed = ROUTE.test(new URL(path, BASE).pathname);
  if (routed) { if (!/nosniff/.test(res.headers.get('x-content-type-options') || '')) why.push('missing nosniff'); if (!res.headers.get('cache-control')) why.push('missing cache-control'); }
  if (routed && res.headers.get('access-control-allow-origin')) why.push('sent a CORS header');
  if (routed && res.status !== 404 && !/default-src 'none'/.test(res.headers.get('content-security-policy') || '')) why.push('missing API CSP (shield not applied)');
  if (why.length) violations.push({ i, desc, why: why.join('; ') });
}

console.log(`fuzzing ${BASE}: ${N} requests, seed ${opt('seed', 1)}, ${readers.length} readers with read/checkout/pay tokens`);
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (next < N) { const i = next++; await one(i); if (i && i % 500 === 0) console.log(`  ${i}/${N}`); } }));

// The server must still be healthy and honest afterwards.
const after = await fetch(`${BASE}/api/agent/status`, { headers: { 'CF-Connecting-IP': randIp() } });
const afterJson = await after.json().catch(() => ({}));
if (after.status !== 200 || afterJson.ok !== true) violations.push({ i: -1, desc: 'post-fuzz health check', why: `status ${after.status}` });
// The fuzzer may legitimately have revoked its own tokens (DELETE .../self), so use a fresh person and token.
const fresh = await signup(`fuzz-after-${Date.now()}@example.com`);
const freshTok = await mint(fresh, 'After Fuzz', ['read']);
const chk = await fetch(`${BASE}/api/agent/chapters/01`, { headers: { Authorization: `Bearer ${freshTok}`, 'CF-Connecting-IP': randIp() } });
if (![200, 429].includes(chk.status)) violations.push({ i: -1, desc: 'post-fuzz valid chapter read', why: `status ${chk.status}` });

console.log('status tally:', JSON.stringify(tally));
if (violations.length) {
  console.error(`\n${violations.length} VIOLATIONS (first 15):`);
  for (const v of violations.slice(0, 15)) console.error(`- #${v.i} ${v.desc}\n    ${v.why}`);
  process.exit(1);
}
console.log('no violations');
