// Stripe, test mode only, and only the parts we need: create a Checkout
// Session, verify webhook signatures, apply webhook events to orders.
//
// Hard rules in code, not just docs:
//   - AGENT_CHECKOUT must be exactly "test" or nothing here runs.
//   - STRIPE_SECRET_KEY must be a test key (sk_test_ / rk_test_). Live keys are refused.
//   - Nothing stores card data or payment credentials; Stripe hosts the page.
//   - STRIPE_API_BASE can point only at api.stripe.com or localhost (for the mock).

export const TEST_KEY_RE = /^(sk|rk)_test_[A-Za-z0-9_]{8,}$/;
const API_BASE_RE = /^(https:\/\/api\.stripe\.com|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/;
export const SIGNATURE_TOLERANCE_S = 300;

export function checkoutMode(env) {
  return env.AGENT_CHECKOUT === 'test' ? 'test' : 'off';
}

// Returns an error code or '' when the configuration is safe to use.
export function configProblem(env) {
  if (checkoutMode(env) !== 'test') return 'checkout_not_open';
  if (!TEST_KEY_RE.test(env.STRIPE_SECRET_KEY || '')) return 'misconfigured';
  if (!/^price_[A-Za-z0-9_]+$/.test(env.STRIPE_PRICE_PREORDER || '')) return 'misconfigured';
  if (env.STRIPE_API_BASE && !API_BASE_RE.test(env.STRIPE_API_BASE)) return 'misconfigured';
  return '';
}

export const apiBase = (env) => env.STRIPE_API_BASE || 'https://api.stripe.com';

// Stripe takes form-encoded bodies with bracketed keys.
export function formEncode(obj, prefix = '') {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => parts.push(...(typeof item === 'object' ? formEncode(item, `${key}[${i}]`) : [`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(item)}`])));
    else if (typeof v === 'object') parts.push(...formEncode(v, key));
    else parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
  }
  return parts;
}

export async function createCheckoutSession(env, params, idempotencyKey, fetchImpl = fetch) {
  const res = await fetchImpl(`${apiBase(env)}/v1/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': idempotencyKey,
    },
    body: formEncode(params).join('&'),
    signal: AbortSignal.timeout(10000),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || typeof body.id !== 'string') return { error: `stripe_${res.status}` };
  if (body.livemode === true) return { error: 'live_session_refused' };
  return { session: body };
}

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// Stripe-Signature: t=<unix>,v1=<hmac hex>[,v1=...]. Signed payload is `${t}.${raw body}`.
export async function verifySignature(rawBody, header, secret, nowS = Math.floor(Date.now() / 1000)) {
  if (!secret || typeof header !== 'string' || header.length > 600) return false;
  let t = '';
  const sigs = [];
  for (const part of header.split(',')) {
    const i = part.indexOf('=');
    if (i < 1) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === 't') t = v;
    else if (k === 'v1' && /^[0-9a-f]{64}$/.test(v)) sigs.push(v);
  }
  if (!/^\d{1,12}$/.test(t) || !sigs.length) return false;
  if (Math.abs(nowS - Number(t)) > SIGNATURE_TOLERANCE_S) return false;
  const expected = await hmacHex(secret, `${t}.${rawBody}`);
  return sigs.some((s) => safeEqual(s, expected));
}

// Test helper and local tooling: produce a header the way Stripe does.
export async function signPayload(rawBody, secret, nowS = Math.floor(Date.now() / 1000)) {
  return `t=${nowS},v1=${await hmacHex(secret, `${nowS}.${rawBody}`)}`;
}

// Applies a verified event. Idempotent per event id and per order state.
export async function applyEvent(env, event) {
  if (!event || typeof event.id !== 'string' || typeof event.type !== 'string') return { handled: false };
  // Test mode only: a live event here is a misconfiguration, never act on it.
  if (event.livemode === true) return { handled: false, ignored: 'livemode' };
  const seenKey = `stripe-event:${event.id}`;
  if (await env.CLAIMS.get(seenKey)) return { handled: false, duplicate: true };

  const session = event.data?.object;
  const wanted = ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired'];
  if (!wanted.includes(event.type) || !session || typeof session.id !== 'string') {
    await env.CLAIMS.put(seenKey, '1', { expirationTtl: 604800 });
    return { handled: false };
  }
  const orderId = String(session.client_reference_id || session.metadata?.order_id || '');
  if (!/^ord_[0-9a-f]{16}$/.test(orderId)) return { handled: false, ignored: 'no_order' };
  const order = JSON.parse((await env.CLAIMS.get(`order:${orderId}`)) || 'null');
  // The event must be about the session we created for this order.
  if (!order || order.sessionId !== session.id) return { handled: false, ignored: 'unknown_order' };

  const now = new Date().toISOString();
  if (event.type === 'checkout.session.expired' && order.status === 'pending_payment') {
    order.status = 'expired';
    order.updatedAt = now;
  } else if (event.type === 'checkout.session.async_payment_failed' && order.status !== 'paid') {
    order.status = 'payment_failed';
    order.updatedAt = now;
  } else if (
    (event.type === 'checkout.session.completed' && session.payment_status === 'paid') ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    if (session.amount_total !== order.amountCents || String(session.currency).toLowerCase() !== order.currency) {
      return { handled: false, ignored: 'amount_mismatch' };
    }
    order.status = 'paid';
    order.paidAt = now;
    order.updatedAt = now;
    order.paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : null;
  } else {
    await env.CLAIMS.put(seenKey, '1', { expirationTtl: 604800 });
    return { handled: false };
  }
  await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
  await env.CLAIMS.put(seenKey, '1', { expirationTtl: 604800 });
  return { handled: true, orderId, status: order.status };
}

