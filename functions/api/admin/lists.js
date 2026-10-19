// GET /api/admin/lists?list=interest|waitlist[&status=confirmed|all][&format=csv][&cursor=...]
// The two mailing lists, for the author to load into Resend segments (CSV import) or broadcasts.
// Default is confirmed members only; status=unsubscribed lists who left (to remove from Resend). Authorization: Bearer <ADMIN_TOKEN>. Disabled (404) unless
// ADMIN_TOKEN is set. The site's own Resend key is send-only and never sees these lists.
import { json } from '../../../lib/server/guard.js';
import { adminAuth, toCsv } from '../../../lib/server/admin.js';
import { isList, listMembers } from '../../../lib/server/lists.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await adminAuth(request, env);
  if (auth.response) return auth.response;
  const url = new URL(request.url);
  const list = url.searchParams.get('list') || '';
  const status = url.searchParams.get('status') || 'confirmed';
  const cursor = url.searchParams.get('cursor');
  const format = url.searchParams.get('format');
  if (!isList(list) || !['confirmed', 'unsubscribed', 'all'].includes(status)
    || (cursor && !/^[A-Za-z0-9_=+/-]{1,512}$/.test(cursor)) || (format && format !== 'csv' && format !== 'json')) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const page = await listMembers(env, list, { cursor: cursor || undefined, status });
  if (format === 'csv') {
    return new Response(toCsv(page.entries), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="knowware-${list}.csv"`, 'Cache-Control': 'no-store', ...(page.cursor ? { 'X-Next-Cursor': page.cursor } : {}) } });
  }
  return json({ ok: true, list, count: page.entries.length, ...page }, 200, { 'X-Robots-Tag': 'noindex' });
}
