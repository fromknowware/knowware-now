// POST /api/stripe/webhook — Stripe tells us a Checkout Session was paid or
// expired. The signature is verified over the raw body before anything is
// parsed or trusted. Test mode only; live events are ignored.

import { json } from '../../../lib/server/guard.js';
import { applyEvent, checkoutMode, verifySignature } from '../../../lib/server/stripe.js';

const MAX_BYTES = 65536;

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (checkoutMode(env) !== 'test' || !env.STRIPE_WEBHOOK_SECRET) return json({ ok: false, error: 'not_found' }, 404);
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json({ ok: false, error: 'too_large' }, 413);
  if (!(await verifySignature(raw, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET))) {
    return json({ ok: false, error: 'bad_signature' }, 400);
  }
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const result = await applyEvent(env, event);
  return json({ received: true, handled: Boolean(result.handled) });
}
