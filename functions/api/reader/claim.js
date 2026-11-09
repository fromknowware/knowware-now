// POST /api/reader/claim — a reader pastes the URL of a post that quotes
// a voice from the chapter they are trying to unlock. The URL is the
// receipt; the chapter opens straight away. Verification of the post itself
// is lazy (see functions/cron/verify-receipts.js).

import { EMAIL_RE, TOKEN_RE, json, originAllowed, rateLimited, readCookie, readJson, sha256 } from '../../../lib/server/guard.js';
import { claimShare } from '../../../lib/server/share.js';

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);

  const token = readCookie(request, 'kw_reader');
  if (!TOKEN_RE.test(token)) return json({ ok: false, error: 'Sign up first.', code: 'auth' }, 401);

  const parsed = await readJson(request, 4096);
  if (parsed.response) return parsed.response;

  if (await rateLimited(env, request, 'claim', 10, 3600)) {
    return json({ ok: false, error: 'Too many claims from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }

  const readerRaw = await env.CLAIMS.get(`reader:${await sha256(token)}`);
  if (!readerRaw) return json({ ok: false, error: 'Your session expired. Sign in again.', code: 'auth' }, 401);
  const reader = JSON.parse(readerRaw);
  if (!reader.email || !EMAIL_RE.test(reader.email)) return json({ ok: false, error: 'Account missing an email.', code: 'auth' }, 401);
  const subscriberKey = `subscriber:${await sha256(reader.email)}`;

  const now = new Date().toISOString();
  const result = await claimShare(env, {
    readerToken: token,
    subscriberKey,
    chapter: parsed.data.chapter,
    voice: parsed.data.voice,
    url: parsed.data.url,
    platform: parsed.data.platform,
    now,
  });

  if (!result.ok) {
    const status = result.code === 'auth' ? 401 : result.code === 'duplicate' || result.code === 'already' ? 409 : 400;
    return json(result, status);
  }
  return json(result, 200);
}
