import test from 'node:test';
import assert from 'node:assert/strict';
import { shielded, guard } from '../lib/server/shield.js';

const ctx = (env = {}, url = 'https://knowware.systems/api/agent/x') => ({ env, request: new Request(url, { method: 'POST' }) });

test('a throwing handler becomes a generic 500 with no internals', async () => {
  const quiet = console.error; const logged = []; console.error = (...a) => logged.push(a.join(' '));
  try {
    const res = await shielded(ctx(), async () => { throw new Error('KV secret sk_test_123 at /Users/x/file.js:10'); });
    assert.equal(res.status, 500);
    const text = await res.text();
    assert.equal(text, '{"ok":false,"error":"server_error"}');
    assert.equal(logged.join('\n').includes('sk_test_123'), false); // the message is never logged
    assert.match(logged[0], /unhandled POST \/api\/agent\/x Error/);
  } finally { console.error = quiet; }
});

test('every response gets strict API headers; Cache-Control defaults to no-store', async () => {
  const res = await shielded(ctx(), async () => new Response('hi', { headers: { 'Content-Type': 'text/plain' } }));
  assert.equal(res.headers.get('Content-Security-Policy'), "default-src 'none'; frame-ancestors 'none'; sandbox");
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(res.headers.get('Referrer-Policy'), 'no-referrer');
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  assert.equal(res.headers.get('Content-Type'), 'text/plain'); // handler headers survive
});

test('kill switch answers 503 without running the handler; webhook is exempt', async () => {
  let ran = 0;
  const off = await shielded(ctx({ AGENT_API_DISABLED: 'true' }), async () => { ran++; return new Response('x'); });
  assert.equal(off.status, 503);
  assert.equal(ran, 0);
  const hook = await shielded(ctx({ AGENT_API_DISABLED: 'true' }), async () => { ran++; return new Response('ok'); }, { exemptFromKillSwitch: true });
  assert.equal(hook.status, 200);
  assert.equal(ran, 1);
  assert.equal((await shielded(ctx({ AGENT_API_DISABLED: 'false' }), async () => new Response('ok'))).status, 200);
});

test('guard() wraps a handler for use as a function export', async () => {
  const onRequest = guard(async () => { throw new TypeError('boom'); });
  const quiet = console.error; console.error = () => {};
  try { assert.equal((await onRequest(ctx())).status, 500); } finally { console.error = quiet; }
});
