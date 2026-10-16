// GET /api/agent/me — lets an agent confirm who its token acts for.
import { json } from '../../../lib/server/guard.js';
import { NOTICE_HEADER, agentJson, authenticateAgent, principalBlock } from '../../../lib/server/agent.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await authenticateAgent(request, env, 'read');
  if (auth.response) return auth.response;
  const a = auth.agent;
  return agentJson({
    ok: true,
    principal: principalBlock(a),
    agent: { name: a.name, operator: a.operator },
    token: { id: a.id, created_at: a.createdAt, expires_at: a.expiresAt },
  }, 200, { 'X-Knowware-Notice': NOTICE_HEADER });
}
