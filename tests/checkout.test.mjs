// Unit tests for the Stripe test-mode plumbing. No network: Stripe is a fake.
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyEvent, configProblem, formEncode, signPayload, verifySignature } from '../lib/server/stripe.js';
import { createOrder, validateCheckoutInput } from '../lib/server/checkout.js';

function fakeKV() {
  const m = new Map();
  return { m, async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } };
}
const goodEnv = () => ({
  CLAIMS: fakeKV(), AGENT_CHECKOUT: 'test', STRIPE_SECRET_KEY: 'sk_test_abcdefghijkl',
  STRIPE_PRICE_PREORDER: 'price_1Abc', STRIPE_WEBHOOK_SECRET: 'whsec_x',
});
const agent = { keyHash: 'a'.repeat(64), id: 'abcdef012345', prin: 'p'.repeat(32), email: 'person@example.com', name: 'Shopper', operator: 'Ops', scopes: ['read', 'checkout'], expiresAt: '2099-01-01T00:00:00Z' };
const okSession = (over = {}) => ({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1', amount_total: 3300, currency: 'usd', livemode: false, expires_at: 4102444800, ...over });
const fakeFetch = (session = okSession(), status = 200) => {
  const calls = [];
  const f = async (url, init) => { calls.push({ url, init }); return new Response(JSON.stringify(session), { status }); };
  f.calls = calls;
  return f;
};

test('webhook signatures: valid, tampered, wrong secret, stale, malformed', async () => {
  const body = '{"id":"evt_1"}';
  const now = 1_800_000_000;
  const header = await signPayload(body, 'whsec_x', now);
  assert.equal(await verifySignature(body, header, 'whsec_x', now), true);
  assert.equal(await verifySignature(body + ' ', header, 'whsec_x', now), false);
  assert.equal(await verifySignature(body, header, 'whsec_y', now), false);
  assert.equal(await verifySignature(body, header, 'whsec_x', now + 301), false);
  assert.equal(await verifySignature(body, 'v1=abc', 'whsec_x', now), false);
  assert.equal(await verifySignature(body, null, 'whsec_x', now), false);
  assert.equal(await verifySignature(body, header, '', now), false);
  // Several v1 values: any one may match (key rotation).
  const rotated = `${header},v1=${'0'.repeat(64)}`;
  assert.equal(await verifySignature(body, rotated, 'whsec_x', now), true);
});

test('config: off by default; live keys and odd API bases are refused', () => {
  assert.equal(configProblem({}), 'checkout_not_open');
  assert.equal(configProblem({ ...goodEnv(), AGENT_CHECKOUT: 'live' }), 'checkout_not_open');
  assert.equal(configProblem(goodEnv()), '');
  assert.equal(configProblem({ ...goodEnv(), STRIPE_SECRET_KEY: 'sk_live_abcdefghijkl' }), 'misconfigured');
  assert.equal(configProblem({ ...goodEnv(), STRIPE_API_BASE: 'https://evil.example' }), 'misconfigured');
  assert.equal(configProblem({ ...goodEnv(), STRIPE_API_BASE: 'http://127.0.0.1:12111' }), '');
  assert.equal(configProblem({ ...goodEnv(), STRIPE_PRICE_PREORDER: '' }), 'misconfigured');
});

test('input is a closed schema: only preorder x1 and a short plain note', () => {
  assert.deepEqual(validateCheckoutInput({}), { product: 'preorder', quantity: 1, note: '' });
  assert.equal(validateCheckoutInput({ quantity: 2 }).error, 'quantity_must_be_1');
  assert.equal(validateCheckoutInput({ product: 'free' }).error, 'unknown_product');
  assert.equal(validateCheckoutInput({ note: 'a\nb' }).error, 'note_has_control_characters');
  assert.equal(validateCheckoutInput({ note: 5 }).error, 'note_must_be_text');
  assert.equal(validateCheckoutInput({ note: 'x'.repeat(500) }).note.length, 200);
});

test('form encoding nests with brackets', () => {
  assert.deepEqual(formEncode({ a: { b: 1 }, l: [{ p: 'x', q: 2 }] }), ['a%5Bb%5D=1', 'l%5B0%5D%5Bp%5D=x', 'l%5B0%5D%5Bq%5D=2']);
});

test('createOrder: refuses when off, calls Stripe once, replays from KV', async () => {
  const off = await createOrder({ CLAIMS: fakeKV() }, agent, { product: 'preorder', quantity: 1, note: '' }, 'key-12345678', fakeFetch());
  assert.equal(off.error, 'checkout_not_open');

  const env = goodEnv();
  const f = fakeFetch();
  const input = { product: 'preorder', quantity: 1, note: 'for my person' };
  const a = await createOrder(env, agent, input, 'key-12345678', f);
  assert.equal(a.status, 201);
  assert.equal(a.response.human_action_required, true);
  assert.equal(f.calls.length, 1);
  const body = new URLSearchParams(f.calls[0].init.body);
  assert.equal(body.get('line_items[0][price]'), 'price_1Abc');
  assert.equal(body.get('customer_email'), 'person@example.com');
  assert.equal(f.calls[0].init.headers.Authorization.startsWith('Bearer sk_test_'), true);

  const b = await createOrder(env, agent, input, 'key-12345678', f);
  assert.equal(b.replay, true);
  assert.equal(b.response.order_id, a.response.order_id);
  assert.equal(f.calls.length, 1);

  const c = await createOrder(env, agent, { ...input, note: 'different' }, 'key-12345678', f);
  assert.equal(c.error, 'idempotency_key_reused');
});

test('createOrder rejects a live session or a non-Stripe URL from the provider', async () => {
  const live = await createOrder(goodEnv(), agent, { product: 'preorder', quantity: 1, note: '' }, 'key-aaaaaaaa', fakeFetch(okSession({ livemode: true })));
  assert.equal(live.status, 502);
  const odd = await createOrder(goodEnv(), agent, { product: 'preorder', quantity: 1, note: '' }, 'key-bbbbbbbb', fakeFetch(okSession({ url: 'https://evil.example/pay' })));
  assert.equal(odd.status, 502);
  const down = await createOrder(goodEnv(), agent, { product: 'preorder', quantity: 1, note: '' }, 'key-cccccccc', fakeFetch({ error: {} }, 500));
  assert.equal(down.status, 502);
});

async function paidSetup() {
  const env = goodEnv();
  const a = await createOrder(env, agent, { product: 'preorder', quantity: 1, note: '' }, 'key-12345678', fakeFetch());
  const event = (over = {}, id = 'evt_1') => ({
    id, type: 'checkout.session.completed', livemode: false,
    data: { object: { id: 'cs_test_1', client_reference_id: a.response.order_id, payment_status: 'paid', amount_total: 3300, currency: 'usd', payment_intent: 'pi_1', ...over } },
  });
  return { env, event, orderId: a.response.order_id };
}

test('webhook events: paid once, duplicates and mismatches change nothing', async () => {
  const { env, event, orderId } = await paidSetup();
  const status = async () => JSON.parse(env.CLAIMS.m.get(`order:${orderId}`)).status;
  assert.equal((await applyEvent(env, event({ amount_total: 100 }, 'evt_a'))).ignored, 'amount_mismatch');
  assert.equal((await applyEvent(env, event({ id: 'cs_other' }, 'evt_b'))).ignored, 'unknown_order');
  assert.equal((await applyEvent(env, { ...event(), livemode: true }, 'evt_c')).ignored, 'livemode');
  assert.equal(await status(), 'pending_payment');
  assert.equal((await applyEvent(env, event({}, 'evt_d'))).handled, true);
  assert.equal(await status(), 'paid');
  assert.equal((await applyEvent(env, event({}, 'evt_d'))).duplicate, true);
  // A late "expired" must not undo a payment.
  await applyEvent(env, { ...event({}, 'evt_e'), type: 'checkout.session.expired' });
  assert.equal(await status(), 'paid');
});

test('the order keeps the three things: human, agent, context', async () => {
  const env = goodEnv();
  const a = await createOrder(env, agent, { product: 'preorder', quantity: 1, note: 'because they asked' }, 'key-12345678', fakeFetch());
  const order = JSON.parse(env.CLAIMS.m.get(`order:${a.response.order_id}`));
  assert.equal(order.principal.email, 'person@example.com');
  assert.deepEqual([order.agent.name, order.agent.operator], ['Shopper', 'Ops']);
  assert.equal(order.context, 'because they asked');
  assert.equal(order.mode, 'test');
});

test('a lone surrogate in the note is rejected, and the encoder survives one anyway', async () => {
  assert.equal(validateCheckoutInput({ note: 'a\ud800b' }).error, 'note_is_not_valid_text');
  assert.equal(validateCheckoutInput({ note: 'fine 😀' }).note, 'fine 😀');
  assert.doesNotThrow(() => formEncode({ metadata: { context_note: 'x\ud800y' } }));
});
