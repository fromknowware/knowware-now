// GET /api/reader/me — the current reader's unlocks, for the UI to decide
// whether to show the email form, the share pane, or the "continue" link.
// Returns an empty object with 200 for a signed-out visitor so the page
// doesn't flash the wrong state.

import { TOKEN_RE, json, readCookie, sha256 } from '../../../lib/server/guard.js';

export async function onRequestGet({ request, env }) {
  const token = readCookie(request, 'kw_reader');
  if (!TOKEN_RE.test(token)) return json({ signedIn: false, unlocks: {} }, 200);

  const readerRaw = await env.CLAIMS.get(`reader:${await sha256(token)}`);
  if (!readerRaw) return json({ signedIn: false, unlocks: {} }, 200);
  const reader = JSON.parse(readerRaw);
  if (!reader.email) return json({ signedIn: false, unlocks: {} }, 200);

  const subRaw = await env.CLAIMS.get(`subscriber:${await sha256(reader.email)}`);
  const sub = subRaw ? JSON.parse(subRaw) : null;
  const unlocks = (sub && sub.unlocks) || { '01': true };
  const readerId = (sub && sub.readerId) || (await sha256(token)).slice(0, 8);

  return json({ signedIn: true, unlocks, readerId }, 200);
}
