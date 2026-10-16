// GET /api/admin/orders[?status=paid][&cursor=...] — the author's view of agent
// orders (Stripe test-mode and x402 testnet): the human, the agent, the note.
// Authorization: Bearer <ADMIN_TOKEN>. Disabled (404) unless ADMIN_TOKEN is set.
import { json } from '../../../lib/server/guard.js';
import { adminAuth, listOrders } from '../../../lib/server/admin.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await adminAuth(request, env);
  if (auth.response) return auth.response;
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const cursor = url.searchParams.get('cursor');
  if ((status && !/^[a-z_]{3,24}$/.test(status)) || (cursor && !/^[A-Za-z0-9_=+/-]{1,512}$/.test(cursor))) return json({ ok: false, error: 'bad_request' }, 400);
  return json({ ok: true, ...(await listOrders(env, { status: status || undefined, cursor: cursor || undefined })) }, 200, { 'X-Robots-Tag': 'noindex' });
}
