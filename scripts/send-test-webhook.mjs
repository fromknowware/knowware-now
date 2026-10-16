// Sends a signed (or deliberately forged) Stripe-style webhook to the local server.
// Usage: node scripts/send-test-webhook.mjs <type> <order_id> <session_id> [--forge] [--live] [--amount=3300] [--url=http://localhost:8788]
// Reads STRIPE_WEBHOOK_SECRET from the environment (the same value as in .dev.vars).
import { signPayload } from '../lib/server/stripe.js';

const [type, orderId, sessionId, ...flags] = process.argv.slice(2);
const flag = (n) => flags.find((f) => f.startsWith(`--${n}`));
const url = (flag('url') || '--url=http://localhost:8788').split('=')[1];
const amount = Number((flag('amount') || '--amount=3300').split('=')[1]);
const secret = process.env.STRIPE_WEBHOOK_SECRET;
if (!type || !orderId || !sessionId || !secret) { console.error('usage: STRIPE_WEBHOOK_SECRET=... node scripts/send-test-webhook.mjs <type> <order_id> <session_id> [--forge] [--live] [--amount=N]'); process.exit(2); }

const event = {
  id: `evt_test_${Math.random().toString(16).slice(2, 14)}`,
  object: 'event',
  type,
  livemode: Boolean(flag('live')),
  data: { object: { id: sessionId, object: 'checkout.session', client_reference_id: orderId, metadata: { order_id: orderId }, payment_status: type === 'checkout.session.expired' ? 'unpaid' : 'paid', amount_total: amount, currency: 'usd', payment_intent: 'pi_test_123' } },
};
const raw = JSON.stringify(event);
const header = flag('forge') ? await signPayload(raw, 'whsec_not_the_real_secret') : await signPayload(raw, secret);
const res = await fetch(`${url}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header }, body: raw });
console.log(res.status, await res.text(), `event=${event.id}`);
