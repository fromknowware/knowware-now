// Agent checkout: an agent acting for a signed-up person asks for a Stripe
// Checkout link. The person completes payment on Stripe's page. The agent
// never pays, never sees a card, and cannot change the price or quantity.
//
// Every order records the three things the book names: the human (principal),
// the agent (name and operator), and a short context note.

import { SITE_URL } from '../site-facts.mjs';
import { clean, sha256 } from './guard.js';
import { principalBlock } from './agent.js';
import { createCheckoutSession, configProblem } from './stripe.js';

export const IDEM_RE = /^[A-Za-z0-9_-]{8,64}$/;
const PRODUCTS = {
  preorder: { name: 'Knowware pre-order (print + digital)', priceEnv: 'STRIPE_PRICE_PREORDER', amountCents: 3300, currency: 'usd' },
};
const SESSION_TTL_S = 3600;

// A short plain-text note from an agent: a string, no control characters, no lone
// surrogates (they cannot be encoded for Stripe), at most 200 characters.
export function plainNote(value) {
  if (value === undefined || value === null || value === '') return { note: '' };
  if (typeof value !== 'string') return { error: 'note_must_be_text' };
  if (/[\u0000-\u001F\u007F]/.test(value)) return { error: 'note_has_control_characters' };
  if (typeof value.isWellFormed === 'function' && !value.isWellFormed()) return { error: 'note_is_not_valid_text' };
  return { note: clean(value, 200) };
}

export function validateCheckoutInput(data) {
  const product = data.product === undefined ? 'preorder' : data.product;
  if (typeof product !== 'string' || !PRODUCTS[product]) return { error: 'unknown_product' };
  if (data.quantity !== undefined && data.quantity !== 1) return { error: 'quantity_must_be_1' };
  const n = plainNote(data.note);
  if (n.error) return { error: n.error };
  return { product, quantity: 1, note: n.note };
}

export async function createOrder(env, agent, input, idemKey, fetchImpl, limited) {
  const problem = configProblem(env);
  if (problem) return { status: 503, error: problem };

  const bodyHash = await sha256(JSON.stringify([input.product, input.quantity, input.note]));
  const idemRecordKey = `idem:${agent.keyHash.slice(0, 24)}:${idemKey}`;
  const prior = JSON.parse((await env.CLAIMS.get(idemRecordKey)) || 'null');
  if (prior) {
    if (prior.bodyHash !== bodyHash) return { status: 422, error: 'idempotency_key_reused' };
    const order = JSON.parse((await env.CLAIMS.get(`order:${prior.orderId}`)) || 'null');
    return { status: 200, replay: true, order, response: prior.response };
  }

  if (limited && (await limited())) return { limited: true };

  const stripeKey = `kw1_${(await sha256(`${agent.keyHash}:${idemKey}:${bodyHash}`)).slice(0, 40)}`;
  const orderId = `ord_${stripeKey.slice(4, 20)}`;
  const product = PRODUCTS[input.product];
  const principal = principalBlock(agent);
  const now = new Date();

  const params = {
    mode: 'payment',
    line_items: [{ price: env[product.priceEnv], quantity: 1 }],
    success_url: `${SITE_URL}/order/thanks`,
    cancel_url: `${SITE_URL}/agents#buying`,
    customer_email: agent.email,
    client_reference_id: orderId,
    expires_at: Math.floor(now.getTime() / 1000) + SESSION_TTL_S,
    shipping_address_collection: { allowed_countries: String(env.STRIPE_SHIP_COUNTRIES || 'US').split(',').map((c) => c.trim()).filter(Boolean) },
    metadata: {
      order_id: orderId,
      channel: 'agent',
      principal_id: principal.id,
      agent_name: agent.name,
      agent_operator: agent.operator,
      context_note: input.note,
    },
  };
  const created = await createCheckoutSession(env, params, stripeKey, fetchImpl);
  if (created.error) return { status: 502, error: 'payment_provider_error', detail: created.error };
  const session = created.session;
  let host = '';
  try {
    host = new URL(session.url).hostname;
  } catch {}
  if (host !== 'checkout.stripe.com') return { status: 502, error: 'payment_provider_error', detail: 'bad_session_url' };

  const order = {
    id: orderId,
    mode: 'test',
    status: 'pending_payment',
    product: input.product,
    quantity: 1,
    amountCents: Number.isInteger(session.amount_total) ? session.amount_total : product.amountCents,
    currency: product.currency,
    sessionId: session.id,
    principal: { id: principal.id, prin: agent.prin, email: agent.email },
    agent: { name: agent.name, operator: agent.operator, tokenId: agent.id },
    context: input.note,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: new Date((session.expires_at || params.expires_at) * 1000).toISOString(),
  };
  const response = {
    ok: true,
    mode: 'test',
    human_action_required: true,
    order_id: orderId,
    checkout_url: session.url,
    expires_at: order.expiresAt,
    status: order.status,
    instructions_for_agent: `Give checkout_url to the person you act for (${principal.label}). Only they can complete payment, on Stripe's page. Do not open it to pay, enter card details, or alter the URL. Poll GET /api/agent/orders/${orderId} if you need to know the outcome.`,
    test_mode_notice: 'Test mode: no real money moves. The person can pay with a Stripe test card; real cards are declined.',
    record: { principal: { id: principal.id, label: principal.label }, agent: { name: agent.name, operator: agent.operator }, context: input.note },
  };
  await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
  await env.CLAIMS.put(idemRecordKey, JSON.stringify({ bodyHash, orderId, response }), { expirationTtl: 86400 });
  return { status: 201, order, response };
}
