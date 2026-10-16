// POST /api/agent/x402/digital — buy the digital edition with testnet USDC (x402 v2).
//   Authorization: Bearer <token with the "pay" scope: the person authorized one purchase>
//   Idempotency-Key: <8-64 chars>   {"note":"why, in a line"}
//   1st call: 402 + PAYMENT-REQUIRED (base64 JSON). 2nd call, same key, with PAYMENT-SIGNATURE: 200.
// Off unless X402_MODE=testnet. Testnet only; see lib/server/x402.js.

import { json, readJson, clean } from '../../../../lib/server/guard.js';
import { NOTICE_HEADER, agentJson, authenticateAgent, windowLimited } from '../../../../lib/server/agent.js';
import { IDEM_RE } from '../../../../lib/server/checkout.js';
import { payForDigital, x402Mode } from '../../../../lib/server/x402.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (x402Mode(env) !== 'testnet') {
    return agentJson({ ok: false, error: 'x402_not_open', message: 'Paying from an agent wallet is not open. Nothing can be bought this way yet.' }, 503);
  }
  const auth = await authenticateAgent(request, env, 'pay');
  if (auth.response) return auth.response;

  const idemKey = request.headers.get('Idempotency-Key') || '';
  if (!IDEM_RE.test(idemKey)) return agentJson({ ok: false, error: 'idempotency_key_required', hint: '8-64 characters from A-Z a-z 0-9 _ -' }, 400);

  const parsed = await readJson(request, 1024);
  if (parsed.response) return parsed.response;
  if (parsed.data.note !== undefined && (typeof parsed.data.note !== 'string' || /[\u0000-\u001F\u007F]/.test(parsed.data.note))) return agentJson({ ok: false, error: 'bad_note' }, 422);
  const input = { note: clean(parsed.data.note || '', 200) };

  const result = await payForDigital(env, auth.agent, input, idemKey, request.headers.get('PAYMENT-SIGNATURE'), undefined, () => windowLimited(env, ['agx4', auth.keyHash.slice(0, 24)], 10, 3600));
  if (result.limited) return agentJson({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '3600' });
  if (result.status >= 500) console.error('agent-x402', result.response?.error);
  return agentJson(result.response, result.status, {
    'X-Knowware-Notice': NOTICE_HEADER,
    ...(result.headers || {}),
    ...(result.replay ? { 'Idempotent-Replayed': 'true' } : {}),
  });
}
