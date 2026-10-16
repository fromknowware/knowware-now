// GET /api/agent/status — whether agent checkout is switched on. Public; the
// static manifest cannot know a runtime flag.
import { json } from '../../../lib/server/guard.js';
import { agentJson, tokensOpen } from '../../../lib/server/agent.js';
import { checkoutMode } from '../../../lib/server/stripe.js';
import { x402Mode } from '../../../lib/server/x402.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const mode = checkoutMode(env);
  return agentJson({
    ok: true,
    tokens: tokensOpen(env) ? 'on' : 'off',
    checkout: mode === 'test' ? 'test' : 'not_open',
    x402: x402Mode(env) === 'testnet' ? 'testnet' : 'not_open',
    autonomous_payment: x402Mode(env) === 'testnet' ? 'testnet_only_with_a_human_pay_mandate' : 'not_supported',
    note: mode === 'test' ? 'Test mode: a checkout link can be requested; a person pays; no real money moves.' : 'The pre-order is not open. Nothing can be bought yet.',
  });
}
