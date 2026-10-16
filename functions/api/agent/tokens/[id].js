// DELETE /api/agent/tokens/<id>    — the person revokes one of their tokens (cookie).
// DELETE /api/agent/tokens/self    — an agent revokes the token it holds (Bearer).

import { json } from '../../../../lib/server/guard.js';
import {
  agentJson, authenticateAgent, browserGuard, principalHash, readerFromCookie, revokeById,
} from '../../../../lib/server/agent.js';

export async function onRequest({ request, env, params }) {
  if (request.method !== 'DELETE') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'DELETE' });
  const id = String(params.id);

  if (id === 'self') {
    const auth = await authenticateAgent(request, env, 'read');
    if (auth.response) return auth.response;
    const ok = await revokeById(env, auth.agent.prin, auth.agent.id);
    return agentJson({ ok, revoked: ok ? auth.agent.id : null });
  }

  const blocked = browserGuard(request);
  if (blocked) return blocked;
  const reader = await readerFromCookie(request, env);
  if (!reader) return agentJson({ ok: false, error: 'sign_in_required' }, 401);
  const ok = await revokeById(env, await principalHash(reader.email), id);
  return ok ? agentJson({ ok: true, revoked: id }) : agentJson({ ok: false, error: 'not_found' }, 404);
}
