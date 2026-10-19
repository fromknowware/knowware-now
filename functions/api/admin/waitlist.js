// GET /api/admin/waitlist[?format=csv][&status=all][&cursor=...] — the pre-order list, for the
// author. Same as /api/admin/lists?list=waitlist, kept so existing bookmarks keep working.
// Authorization: Bearer <ADMIN_TOKEN>. Disabled (404) unless ADMIN_TOKEN is set.
import { onRequest as lists } from './lists.js';

export function onRequest(context) {
  const url = new URL(context.request.url);
  url.searchParams.set('list', 'waitlist');
  return lists({ ...context, request: new Request(url, context.request) });
}
