// GET /api/agent/orders/<id> — the outcome of an order this person's agent requested.
import { json } from '../../../../lib/server/guard.js';
import { agentJson, authenticateAgent } from '../../../../lib/server/agent.js';

export async function onRequest({ request, env, params }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await authenticateAgent(request, env, 'checkout');
  if (auth.response) return auth.response;
  const id = String(params.id);
  const order = /^ord_[0-9a-f]{16}$/.test(id) ? JSON.parse((await env.CLAIMS.get(`order:${id}`)) || 'null') : null;
  // Only the person's own orders; anything else looks like it does not exist.
  if (!order || order.principal.prin !== auth.agent.prin) return agentJson({ ok: false, error: 'not_found' }, 404);
  return agentJson({
    ok: true,
    mode: order.mode,
    order_id: order.id,
    status: order.status,
    product: order.product,
    amount: { cents: order.amountCents, currency: order.currency },
    created_at: order.createdAt,
    paid_at: order.paidAt || null,
    record: { principal: { id: order.principal.id }, agent: { name: order.agent.name, operator: order.agent.operator }, context: order.context },
  });
}
