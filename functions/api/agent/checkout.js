// POST /api/agent/checkout — an agent asks for a checkout link for its person.
//   Authorization: Bearer <agent token with the "checkout" scope>
//   Idempotency-Key: <8-64 chars [A-Za-z0-9_-]>   (required)
//   {"product":"preorder","quantity":1,"note":"why, in a line"}
// Off unless AGENT_CHECKOUT=test. Test-mode Stripe only. A human pays.

import { json, readJson } from '../../../lib/server/guard.js';
import { NOTICE_HEADER, agentJson, authenticateAgent, windowLimited } from '../../../lib/server/agent.js';
import { IDEM_RE, createOrder, validateCheckoutInput } from '../../../lib/server/checkout.js';
import { checkoutMode } from '../../../lib/server/stripe.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (checkoutMode(env) !== 'test') {
    return agentJson({ ok: false, error: 'checkout_not_open', message: 'The pre-order is not open. Nothing can be bought yet, by a person or an agent.' }, 503);
  }
  const auth = await authenticateAgent(request, env, 'checkout');
  if (auth.response) return auth.response;

  const idemKey = request.headers.get('Idempotency-Key') || '';
  if (!IDEM_RE.test(idemKey)) return agentJson({ ok: false, error: 'idempotency_key_required', hint: '8-64 characters from A-Z a-z 0-9 _ -' }, 400);

  const parsed = await readJson(request, 1024);
  if (parsed.response) return parsed.response;
  const input = validateCheckoutInput(parsed.data);
  if (input.error) return agentJson({ ok: false, error: input.error }, 422);

  // A replay costs nothing, so only fresh orders count against the hourly cap.
  const result = await createOrder(env, auth.agent, input, idemKey, undefined, () => windowLimited(env, ['agco', auth.keyHash.slice(0, 24)], 5, 3600));
  if (result.limited) return agentJson({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '3600' });
  if (result.error) {
    console.error('agent-checkout', result.error, result.detail || '');
    return agentJson({ ok: false, error: result.error }, result.status);
  }
  return agentJson(result.response, result.status, {
    'X-Knowware-Notice': NOTICE_HEADER,
    ...(result.replay ? { 'Idempotent-Replayed': 'true' } : {}),
  });
}
