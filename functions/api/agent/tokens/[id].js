// DELETE /api/agent/tokens/<id>    — the person revokes one of their tokens (cookie).
// DELETE /api/agent/tokens/self    — an agent revokes the token it holds (Bearer).

import { json } from '../../../../lib/server/guard.js';
import {
  agentJson, authenticateAgent, browserGuard, principalHash, revokeById, tokensClosed, tokensOpen, verifiedReader,
} from '../../../../lib/server/agent.js';

export async function onRequest({ request, env, params }) {
  if (request.method !== 'DELETE') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'DELETE' });
  const id = String(params.id);

  if (id === 'self') {
    // An agent may always revoke its own token, even while tokens are switched off.
    const auth = await authenticateAgent(request, env, 'read', { allowWhenClosed: true });
    if (auth.response) return auth.response;
    const ok = await revokeById(env, auth.agent.prin, auth.agent.id);
    return agentJson({ ok, revoked: ok ? auth.agent.id : null });
  }

  if (!tokensOpen(env)) return tokensClosed();
  const blocked = browserGuard(request);
  if (blocked) return blocked;
  const who = await verifiedReader(request, env);
  if (who.response) return who.response;
  const ok = await revokeById(env, await principalHash(who.reader.email), id);
  return ok ? agentJson({ ok: true, revoked: id }) : agentJson({ ok: false, error: 'not_found' }, 404);
}
