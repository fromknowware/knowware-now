// GET /api/reader/me — what this signed-in reader has open and how to open more.
// Needs the reader cookie. Same-origin only; nothing here is cacheable.

import { TOKEN_RE, json, readCookie } from '../../../lib/server/guard.js';
import { maskEmail } from '../../../lib/server/agent.js';
import { readerFromToken } from '../../../lib/server/reader.js';
import { CAPS, ORDER, ensureRefCode, unlockedFor } from '../../../lib/server/unlocks.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  if (request.headers.get('Origin') === null) {
    const site = request.headers.get('Sec-Fetch-Site');
    if (site && site !== 'same-origin' && site !== 'none') return json({ ok: false, error: 'forbidden' }, 403);
  }
  const token = readCookie(request, 'kw_reader');
  const reader = TOKEN_RE.test(token) ? await readerFromToken(env, token) : null;
  if (!reader) return json({ ok: false, error: 'sign_in_required' }, 401);

  const u = await unlockedFor(env, reader.email);
  const code = await ensureRefCode(env, u.eh);
  return json({
    ok: true,
    email: maskEmail(reader.email),
    unlocked: u.count,
    total: ORDER.length,
    chapters: ORDER.map((slug, i) => ({ slug, open: i < u.count })),
    next_weekly_at: u.nextDripAt,
    credits: Object.fromEntries(Object.keys(CAPS).map((k) => [k, { earned: u.credits[k], max: CAPS[k] }])),
    share_url: code ? `${new URL(request.url).origin}/read/01/?ref=${code}#unlock` : null,
  }, 200, { 'X-Robots-Tag': 'noindex' });
}
