// GET /api/admin/waitlist[?format=csv][&cursor=...] — the pre-order waiting list, for the
// author. Authorization: Bearer <ADMIN_TOKEN>. Disabled (404) unless ADMIN_TOKEN is set.
import { json } from '../../../lib/server/guard.js';
import { adminAuth, listWaitlist, toCsv } from '../../../lib/server/admin.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await adminAuth(request, env);
  if (auth.response) return auth.response;
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const format = url.searchParams.get('format');
  if ((cursor && !/^[A-Za-z0-9_=+/-]{1,512}$/.test(cursor)) || (format && format !== 'csv' && format !== 'json')) return json({ ok: false, error: 'bad_request' }, 400);
  const page = await listWaitlist(env, { cursor: cursor || undefined });
  if (format === 'csv') {
    return new Response(toCsv(page.entries), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="knowware-waitlist.csv"', 'Cache-Control': 'no-store', ...(page.cursor ? { 'X-Next-Cursor': page.cursor } : {}) } });
  }
  return json({ ok: true, count: page.entries.length, ...page }, 200, { 'X-Robots-Tag': 'noindex' });
}
