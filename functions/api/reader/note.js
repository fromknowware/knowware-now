// POST /api/reader/note {note, chapter} — a signed-in reader tells the author one thing about a
// chapter. The note goes to the author (CLAIM_NOTIFY_TO) and is kept in KV; it opens one more
// chapter for the reader, twice at most. Same-origin JSON only, small bodies, per-connection limit.

import { TOKEN_RE, json, originAllowed, rateLimited, readCookie, readJson } from '../../../lib/server/guard.js';
import { sendMail } from '../../../lib/server/mail.js';
import { CHAPTER_RE, readerFromToken } from '../../../lib/server/reader.js';
import { addCredit, unlockedFor } from '../../../lib/server/unlocks.js';

const MIN = 20;
const MAX = 1000;

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const token = readCookie(request, 'kw_reader');
  const reader = TOKEN_RE.test(token) ? await readerFromToken(env, token) : null;
  if (!reader) return json({ ok: false, error: 'Sign in with your email first.' }, 401);

  const parsed = await readJson(request, 4096);
  if (parsed.response) return parsed.response;
  const note = typeof parsed.data.note === 'string' ? parsed.data.note.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim() : '';
  if (note.length < MIN || note.length > MAX) {
    return json({ ok: false, error: `Write between ${MIN} and ${MAX} characters.`, fields: ['note'] }, 422);
  }
  const chapter = CHAPTER_RE.test(String(parsed.data.chapter || '').toLowerCase()) ? String(parsed.data.chapter).toLowerCase() : '';
  if (await rateLimited(env, request, 'note', 5, 3600)) {
    return json({ ok: false, error: 'Too many notes from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }

  const at = new Date().toISOString();
  const id = crypto.randomUUID().slice(0, 8);
  await env.CLAIMS.put(`note:${at}:${id}`, JSON.stringify({ email: reader.email, chapter, note, at }));
  if (env.CLAIM_NOTIFY_TO) {
    await sendMail(env, 'reader note', {
      to: env.CLAIM_NOTIFY_TO,
      replyTo: reader.email,
      subject: `Reader note${chapter ? ` on Chapter ${chapter}` : ''}`.slice(0, 150),
      text: [`From: ${reader.email}`, `Chapter: ${chapter || '(any)'}`, '', note, '', at].join('\n'),
    });
  }

  const u0 = await unlockedFor(env, reader.email);
  const credited = await addCredit(env, u0.eh, 'note', id, at);
  const u = credited ? await unlockedFor(env, reader.email) : u0;
  return json({ ok: true, credited, unlocked: u.count });
}
