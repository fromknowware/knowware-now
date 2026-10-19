// Unit tests for agent tokens, with an in-memory KV. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateAgent, mintToken, revokeById, listTokens, principalHash, timingSafeEqualHex, MAX_ACTIVE } from '../lib/server/agent.js';
import { sha256 } from '../lib/server/guard.js';

function fakeKV() {
  const m = new Map();
  return {
    m,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
    async list({ prefix }) { return { keys: [...m.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }; },
  };
}
const reader = { email: 'person@example.com' };
const req = (token, extra = {}) =>
  new Request('https://knowware.systems/api/agent/me', { headers: { Authorization: `Bearer ${token}`, 'CF-Connecting-IP': '198.51.100.7', ...extra } });
const input = { name: 'Test Agent', operator: 'Test Ops', lifetime: '1h', scopes: ['read'] };

test('a minted token authenticates and carries its principal', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  assert.match(t.token, /^kwa_[A-Za-z0-9_-]{43}$/);
  const auth = await authenticateAgent(req(t.token), env, 'read');
  assert.equal(auth.agent.email, 'person@example.com');
  assert.equal(auth.agent.prin, await principalHash('person@example.com'));
});

test('only the hash of a token is stored', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  const all = JSON.stringify([...env.CLAIMS.m.entries()]);
  assert.equal(all.includes(t.token), false);
  assert.ok(env.CLAIMS.m.has(`agent:${await sha256(t.token)}`));
});

test('an expired token is refused even if KV still holds it', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  const key = `agent:${await sha256(t.token)}`;
  const rec = JSON.parse(env.CLAIMS.m.get(key));
  rec.expiresAt = new Date(Date.now() - 1000).toISOString();
  env.CLAIMS.m.set(key, JSON.stringify(rec));
  const auth = await authenticateAgent(req(t.token), env, 'read');
  assert.equal(auth.response.status, 401);
});

test('a read token cannot be used for a checkout scope', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  const auth = await authenticateAgent(req(t.token), env, 'checkout');
  assert.equal(auth.response.status, 403);
});

test('revoking removes the token and its index entry', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  const prin = await principalHash(reader.email);
  assert.equal((await listTokens(env, prin)).length, 1);
  assert.equal(await revokeById(env, prin, t.id), true);
  assert.equal((await listTokens(env, prin)).length, 0);
  assert.equal((await authenticateAgent(req(t.token), env, 'read')).response.status, 401);
});

test("another person cannot revoke someone else's token", async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(env, reader, input);
  assert.equal(await revokeById(env, await principalHash('other@example.com'), t.id), false);
  assert.ok((await authenticateAgent(req(t.token), env, 'read')).agent);
});

test('a person holds at most MAX_ACTIVE tokens', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  for (let i = 0; i < MAX_ACTIVE; i++) assert.ok((await mintToken(env, reader, input)).token);
  assert.equal((await mintToken(env, reader, input)).status, 409);
});

test('labels with markup, control characters or no operator are refused', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  for (const bad of [{ name: '<b>x</b>' }, { name: 'a\nb' }, { operator: '' }, { name: 'x' }]) {
    assert.ok((await mintToken(env, reader, { ...input, ...bad })).error, JSON.stringify(bad));
  }
});

test('checkout scope is not granted unless asked for, and unknown scopes fail', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  assert.deepEqual((await mintToken(env, reader, { ...input, scopes: undefined })).scopes, ['read']);
  assert.ok((await mintToken(env, reader, { ...input, scopes: ['root'] })).error);
});

test('bad tokens are counted and eventually blocked before lookup', async () => {
  const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  let last;
  for (let i = 0; i < 22; i++) last = await authenticateAgent(req('kwa_' + 'A'.repeat(43)), env, 'read');
  assert.equal(last.response.status, 429);
});

test('timingSafeEqualHex compares by value and length', () => {
  assert.equal(timingSafeEqualHex('abcd', 'abcd'), true);
  assert.equal(timingSafeEqualHex('abcd', 'abce'), false);
  assert.equal(timingSafeEqualHex('abcd', 'abc'), false);
  assert.equal(timingSafeEqualHex('abcd', undefined), false);
});

test('a checkout-scoped token cannot be minted while checkout is off', async () => {
  const off = await mintToken({ CLAIMS: fakeKV(), AGENT_TOKENS: 'on' }, reader, { ...input, scopes: ['read', 'checkout'] });
  assert.ok(off.error);
  const on = await mintToken({ CLAIMS: fakeKV(), AGENT_CHECKOUT: 'test' }, reader, { ...input, scopes: ['read', 'checkout'] });
  assert.deepEqual(on.scopes, ['read', 'checkout']);
});

test('a pay-scoped token cannot be minted unless x402 testnet is on', async () => {
  assert.ok((await mintToken({ CLAIMS: fakeKV(), AGENT_TOKENS: 'on' }, reader, { ...input, scopes: ['read', 'pay'] })).error);
  const on = await mintToken({ CLAIMS: fakeKV(), X402_MODE: 'testnet' }, reader, { ...input, scopes: ['read', 'pay'] });
  assert.deepEqual(on.scopes, ['read', 'pay']);
});

import { verifiedReader } from '../lib/server/agent.js';

test('agent tokens need a confirmed email: an unconfirmed sign-up is refused', async () => {
  const cookieFor = async (rec) => {
    const env = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
    const token = 'A'.repeat(43);
    env.CLAIMS.m.set(`reader:${await sha256(token)}`, JSON.stringify(rec));
    return { env, request: new Request('https://knowware.systems/api/agent/tokens', { headers: { Cookie: `kw_reader=${token}` } }) };
  };
  const unconfirmed = await cookieFor({ email: 'victim@example.com', createdAt: 'x' });
  const r = await verifiedReader(unconfirmed.request, unconfirmed.env);
  assert.equal(r.response.status, 403);
  assert.equal((await r.response.json()).error, 'email_not_verified');

  const confirmed = await cookieFor({ email: 'victim@example.com', createdAt: 'x', verifiedAt: '2026-10-16T00:00:00Z' });
  assert.equal((await verifiedReader(confirmed.request, confirmed.env)).reader.email, 'victim@example.com');

  const dev = await cookieFor({ email: 'victim@example.com', createdAt: 'x' });
  dev.env.AGENT_REQUIRE_VERIFIED_EMAIL = 'false';
  assert.ok((await verifiedReader(dev.request, dev.env)).reader);

  const nobody = await verifiedReader(new Request('https://knowware.systems/'), { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' });
  assert.equal(nobody.response.status, 401);
});

test('with AGENT_TOKENS off, every token path is closed (503) except an agent revoking itself', async () => {
  const on = { CLAIMS: fakeKV(), AGENT_TOKENS: 'on' };
  const t = await mintToken(on, reader, input);
  const off = { ...on, AGENT_TOKENS: undefined };
  const closed = await authenticateAgent(req(t.token), off, 'read');
  assert.equal(closed.response.status, 503);
  assert.equal((await closed.response.json()).error, 'agent_tokens_not_open');
  const ownRevoke = await authenticateAgent(req(t.token), off, 'read', { allowWhenClosed: true });
  assert.ok(ownRevoke.agent);
  assert.equal((await authenticateAgent(req(t.token), { ...on, AGENT_TOKENS: 'yes' }, 'read')).response.status, 503); // only the exact value "on" opens it
});
