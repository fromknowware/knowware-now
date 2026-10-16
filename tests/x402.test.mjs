// Unit tests for the x402 testnet rail. The facilitator is a fake; nothing is signed or sent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { b64decode, b64encode, checkPayload, challenge, payForDigital, requirements, x402Problem, NETWORK } from '../lib/server/x402.js';

function fakeKV() {
  const m = new Map();
  return { m, async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } };
}
const PAYTO = '0x209693Bc6afc0C5328bA36FaF03C514EF312287C';
const env = () => ({ CLAIMS: fakeKV(), X402_MODE: 'testnet', X402_PAY_TO: PAYTO });
const agent = { keyHash: 'b'.repeat(64), id: 'abcdef012345', prin: 'p'.repeat(32), email: 'person@example.com', name: 'Wallet Agent', operator: 'Ops', scopes: ['pay'], expiresAt: '2099-01-01T00:00:00Z' };
const now = Math.floor(Date.now() / 1000);
const payment = (e, over = {}, authOver = {}) => ({
  x402Version: 2,
  accepted: { ...requirements(e), ...over },
  payload: {
    signature: '0x' + 'cd'.repeat(65),
    authorization: { from: '0x857b06519E91e3A54538791bDbb0E22373e36b66', to: PAYTO, value: '11950000', validAfter: String(now - 5), validBefore: String(now + 55), nonce: '0x' + 'ab'.repeat(32), ...authOver },
  },
});
const header = (p) => b64encode(p);
function facilitator({ valid = true, settle = true } = {}) {
  const calls = [];
  const f = async (url, init) => {
    const path = new URL(url).pathname.replace(/^\/facilitator/, '');
    calls.push(path);
    const body = path === '/verify' ? (valid ? { isValid: true, payer: '0xabc' } : { isValid: false, invalidReason: 'insufficient_funds' }) : (settle ? { success: true, transaction: '0x' + '12'.repeat(32), payer: '0xabc' } : { success: false, errorReason: 'transaction_failed' });
    return new Response(JSON.stringify(body));
  };
  f.calls = calls;
  return f;
}

test('off by default; needs a pay-to address; refuses unknown facilitators', () => {
  assert.equal(x402Problem({}), 'x402_not_open');
  assert.equal(x402Problem({ X402_MODE: 'mainnet', X402_PAY_TO: PAYTO }), 'x402_not_open');
  assert.equal(x402Problem({ X402_MODE: 'testnet' }), 'misconfigured');
  assert.equal(x402Problem({ ...env(), X402_FACILITATOR_URL: 'https://evil.example/facilitator' }), 'misconfigured');
  assert.equal(x402Problem({ ...env(), X402_FACILITATOR_URL: 'https://x402.org/facilitator' }), '');
  assert.equal(x402Problem(env()), '');
});

test('requirements are testnet only and server-defined', () => {
  const r = requirements(env());
  assert.equal(r.network, NETWORK);
  assert.equal(r.network, 'eip155:84532');
  assert.equal(r.amount, '11950000');
  assert.equal(r.asset, '0x036CbD53842c5426634e7929541eC2318f3dCF7e');
});

test('the challenge is base64 JSON that round-trips and names the human', () => {
  const c = challenge(env(), agent, 'need payment');
  assert.deepEqual(b64decode(c.header).accepts[0], requirements(env()));
  assert.equal(c.body.knowware.human_principal.label, 'p***@example.com');
  assert.match(c.body.knowware.instructions_for_agent, /TESTNET/);
});

test('b64decode rejects junk and oversize', () => {
  assert.equal(b64decode('%%%'), null);
  assert.equal(b64decode('A'.repeat(9000)), null);
  assert.equal(b64decode(btoa('not json')), null);
});

test('payload checks: version, accepted terms, payee, amount, nonce, window', () => {
  const e = env(), req = requirements(e);
  assert.equal(checkPayload(payment(e), req, now), '');
  assert.equal(checkPayload({ ...payment(e), x402Version: 1 }, req, now), 'bad_version');
  assert.equal(checkPayload(payment(e, { amount: '1' }), req, now), 'accepted_mismatch');
  assert.equal(checkPayload(payment(e, { network: 'eip155:8453' }), req, now), 'accepted_mismatch');
  assert.equal(checkPayload(payment(e, {}, { to: '0x1111111111111111111111111111111111111111' }), req, now), 'bad_authorization');
  assert.equal(checkPayload(payment(e, {}, { value: '11950001' }), req, now), 'wrong_amount');
  assert.equal(checkPayload(payment(e, {}, { nonce: '0x12' }), req, now), 'bad_nonce');
  assert.equal(checkPayload(payment(e, {}, { validBefore: String(now - 1) }), req, now), 'bad_window');
  assert.equal(checkPayload(payment(e, {}, { validBefore: String(now + 99999) }), req, now), 'bad_window');
  assert.equal(checkPayload(payment(e, {}, { validAfter: String(now + 600) }), req, now), 'bad_window');
  const p = payment(e); p.payload.signature = '0x12';
  assert.equal(checkPayload(p, req, now), 'bad_signature_shape');
});

test('flow: 402 challenge, then pay once; replay is free; the mandate is single use', async () => {
  const e = env(), f = facilitator();
  const noSig = await payForDigital(e, agent, { note: 'ebook' }, 'key-12345678', null, f);
  assert.equal(noSig.status, 402);
  assert.equal(f.calls.length, 0);

  const paid = await payForDigital(e, agent, { note: 'ebook' }, 'key-12345678', header(payment(e)), f);
  assert.equal(paid.status, 200);
  assert.equal(paid.response.status, 'paid');
  assert.deepEqual(f.calls, ['/verify', '/settle']);
  assert.ok(paid.headers['PAYMENT-RESPONSE']);

  const replay = await payForDigital(e, agent, { note: 'ebook' }, 'key-12345678', header(payment(e)), f);
  assert.equal(replay.replay, true);
  assert.equal(f.calls.length, 2);

  const again = await payForDigital(e, agent, { note: 'ebook' }, 'key-other-9999', header(payment(e, {}, { nonce: '0x' + 'cd'.repeat(32) })), f);
  assert.equal(again.response.error, 'mandate_used');

  const order = JSON.parse(e.CLAIMS.m.get(`order:${paid.response.order_id}`));
  assert.equal(order.principal.email, 'person@example.com');
  assert.deepEqual([order.agent.name, order.agent.operator, order.context], ['Wallet Agent', 'Ops', 'ebook']);
});

test('invalid or failed payments consume neither the mandate nor the nonce', async () => {
  const e = env();
  const invalid = await payForDigital(e, agent, { note: '' }, 'key-aaaaaaaa', header(payment(e)), facilitator({ valid: false }));
  assert.equal(invalid.response.error, 'payment_not_valid');
  const failed = await payForDigital(e, agent, { note: '' }, 'key-bbbbbbbb', header(payment(e)), facilitator({ settle: false }));
  assert.equal(failed.response.error, 'settlement_failed');
  const ok = await payForDigital(e, agent, { note: '' }, 'key-cccccccc', header(payment(e)), facilitator());
  assert.equal(ok.status, 200);
});

test('one authorization cannot be spent twice by different tokens', async () => {
  const e = env(), f = facilitator();
  await payForDigital(e, agent, { note: '' }, 'key-12345678', header(payment(e)), f);
  const other = { ...agent, keyHash: 'c'.repeat(64), id: 'fedcba543210' };
  const r = await payForDigital(e, other, { note: '' }, 'key-12345678', header(payment(e)), f);
  assert.equal(r.response.error, 'authorization_already_used');
});

test('a facilitator outage leaves no paid order and tells the agent not to pay again', async () => {
  const e = env();
  const down = async () => { throw new Error('network'); };
  const r = await payForDigital(e, agent, { note: '' }, 'key-dddddddd', header(payment(e)), down);
  assert.equal(r.status, 502);
  const verifyOk = async (url) => new Response(JSON.stringify(new URL(url).pathname.endsWith('/verify') ? { isValid: true, payer: '0xabc' } : {}), { status: new URL(url).pathname.endsWith('/verify') ? 200 : 500 });
  const r2 = await payForDigital(e, agent, { note: '' }, 'key-eeeeeeee', header(payment(e, {}, { nonce: '0x' + '77'.repeat(32) })), verifyOk);
  assert.equal(r2.response.error, 'settlement_failed');
  assert.equal([...e.CLAIMS.m.values()].some((v) => v.includes('"status":"paid"')), false);
});
