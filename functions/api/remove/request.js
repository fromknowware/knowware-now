// POST /api/remove/request {email} — someone asks to leave a list or be deleted. If we hold anything
// for the address we mail ONE link (/api/remove/confirm); the answer is the same either way, so this
// cannot be used to find out who is on a list, and a stranger can remove no one.

import { EMAIL_RE, clean, json, originAllowed, rateLimited, readJson } from '../../../lib/server/guard.js';
import { removalEmail, sendMail } from '../../../lib/server/mail.js';
import { startRemoval } from '../../../lib/server/removal.js';
import { guard } from '../../../lib/server/shield.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });

async function handle({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const isForm = (request.headers.get('Content-Type') || '').startsWith('application/x-www-form-urlencoded');
  let data;
  if (isForm) {
    const raw = await request.text();
    if (raw.length > 1024) return redirect('/unsubscribe/');
    const p = new URLSearchParams(raw);
    data = { email: p.get('email') || '', company: p.get('company') || '' };
  } else {
    const parsed = await readJson(request, 1024);
    if (parsed.response) return parsed.response;
    data = parsed.data;
  }
  const sent = () => (isForm ? redirect('/unsubscribe/sent/') : json({ ok: true, sent: true }));
  if (clean(data.company, 200)) return sent();
  const email = clean(data.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    if (isForm) return redirect('/unsubscribe/');
    return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
  }
  if (await rateLimited(env, request, 'remove', 5, 3600)) {
    if (isForm) return redirect('/unsubscribe/');
    return json({ ok: false, error: 'Too many requests from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }
  if (!env.RESEND_API_KEY) {
    if (isForm) return redirect('/unsubscribe/');
    return json({ ok: false, error: 'This is paused for a moment. Write to the address at the bottom of the page and we will remove you by hand.' }, 503, { 'Retry-After': '600' });
  }
  const started = await startRemoval(env, email);
  if (started) {
    const link = `${new URL(request.url).origin}/api/remove/confirm?t=${started.token}`;
    const ok = await sendMail(env, 'removal link', { to: email, ...removalEmail({ link }) });
    if (!ok) {
      if (isForm) return redirect('/unsubscribe/');
      return json({ ok: false, error: 'We could not send the email. Try again in a few minutes.' }, 502);
    }
  }
  return sent();
}

export const onRequest = guard(handle, { exemptFromKillSwitch: true });
