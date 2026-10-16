import test from 'node:test';
import assert from 'node:assert/strict';
import { adminAuth, listOrders } from '../lib/server/admin.js';

function fakeKV() {
  const m = new Map();
  return { m, async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); },
    async list({ prefix, limit = 1000 }) { const keys = [...m.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit).map((name) => ({ name })); return { keys, list_complete: true }; } };
}
const SECRET = 'x'.repeat(40);
const req = (token) => new Request('https://knowware.press/api/admin/orders', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'CF-Connecting-IP': '198.51.100.9' } });

test('admin is off without a long ADMIN_TOKEN', async () => {
  assert.equal((await adminAuth(req(SECRET), { CLAIMS: fakeKV() })).response.status, 404);
  assert.equal((await adminAuth(req('short'), { CLAIMS: fakeKV(), ADMIN_TOKEN: 'short' })).response.status, 404);
});

test('only the exact token passes; others are 401 and counted', async () => {
  const env = { CLAIMS: fakeKV(), ADMIN_TOKEN: SECRET };
  assert.equal((await adminAuth(req(SECRET), env)).ok, true);
  assert.equal((await adminAuth(req(SECRET + 'y'), env)).response.status, 401);
  assert.equal((await adminAuth(req(), env)).response.status, 401);
  let last;
  for (let i = 0; i < 12; i++) last = await adminAuth(req('nope'), env);
  assert.equal(last.response.status, 429);
  // Even the right token is refused from a connection that has been guessing.
  assert.equal((await adminAuth(req(SECRET), env)).response.status, 429);
});

test('a browser origin that is not ours is refused', async () => {
  const r = new Request('https://knowware.press/api/admin/orders', { headers: { Authorization: `Bearer ${SECRET}`, Origin: 'https://evil.example' } });
  assert.equal((await adminAuth(r, { CLAIMS: fakeKV(), ADMIN_TOKEN: SECRET })).response.status, 403);
});

test('listing returns the human, the agent and the note, and filters by status', async () => {
  const env = { CLAIMS: fakeKV() };
  const o = (id, status) => JSON.stringify({ id, status, mode: 'test', product: 'preorder', amountCents: 3300, currency: 'usd', principal: { id: 'p_1', email: 'a@example.com', prin: 'secret' }, agent: { name: 'A', operator: 'O', tokenId: 'tok' }, context: 'note', createdAt: 't' });
  env.CLAIMS.m.set('order:ord_1', o('ord_1', 'paid'));
  env.CLAIMS.m.set('order:ord_2', o('ord_2', 'pending_payment'));
  env.CLAIMS.m.set('rl:other', '1');
  const all = await listOrders(env);
  assert.equal(all.orders.length, 2);
  assert.deepEqual(all.orders[0].human, { id: 'p_1', email: 'a@example.com' });
  assert.equal(JSON.stringify(all).includes('secret'), false); // internal principal hash and token id are not exposed
  assert.equal(JSON.stringify(all).includes('tok'), false);
  assert.equal((await listOrders(env, { status: 'paid' })).orders.length, 1);
});
