// GET /api/agent/status — whether agent checkout is switched on. Public; the
// static manifest cannot know a runtime flag.
import { json } from '../../../lib/server/guard.js';
import { agentJson } from '../../../lib/server/agent.js';
import { checkoutMode } from '../../../lib/server/stripe.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const mode = checkoutMode(env);
  return agentJson({
    ok: true,
    checkout: mode === 'test' ? 'test' : 'not_open',
    autonomous_payment: 'not_supported',
    note: mode === 'test' ? 'Test mode: a checkout link can be requested; a person pays; no real money moves.' : 'The pre-order is not open. Nothing can be bought yet.',
  });
}
