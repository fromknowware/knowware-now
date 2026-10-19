// POST handler for joining one list (/api/waitlist, /api/interest): origin check, small bodies,
// honeypot, per-connection limit, then ONE confirmation email. The answer is the same for a new
// address, a member and a throttled address, so the list cannot be probed.
// A form post without JavaScript gets redirects, never JSON, and the address never lands in a URL.

import { json, originAllowed, rateLimited, readJson } from './guard.js';
import { LISTS, confirmJoin, readSubmission, requestJoin } from './lists.js';
import { listConfirmEmail, sendMail } from './mail.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });

export function listJoinHandler(list, { sentPath, backPath, bucket = `list-${list}`, limit = 6 }) {
  return async function handle({ request, env }) {
    if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
    if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);

    const isForm = (request.headers.get('Content-Type') || '').startsWith('application/x-www-form-urlencoded');
    let data;
    if (isForm) {
      const raw = await request.text();
      if (raw.length > 1024) return redirect(backPath);
      const p = new URLSearchParams(raw);
      data = { email: p.get('email') || '', company: p.get('company') || '' };
    } else {
      const parsed = await readJson(request, 1024);
      if (parsed.response) return parsed.response;
      data = parsed.data;
    }

    const sub = readSubmission(data);
    const checkEmail = () => (isForm ? redirect(sentPath) : json({ ok: true, sent: true }));
    // Honeypot: look successful, store and send nothing.
    if (sub.trap) return checkEmail();
    if (!sub.valid) {
      if (isForm) return redirect(backPath);
      return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
    }
    if (await rateLimited(env, request, bucket, limit, 3600)) {
      if (isForm) return redirect(backPath);
      return json({ ok: false, error: 'Too many sign-ups from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
    }

    // Local development and CI only, and only with no email key set: confirm at once.
    if (!env.RESEND_API_KEY && env.READER_AUTOCONFIRM === 'true') {
      const started = await requestJoin(env, list, sub.email);
      if (started) await confirmJoin(env, started.token);
      return isForm ? redirect(LISTS[list].done) : json({ ok: true });
    }
    if (!env.RESEND_API_KEY) {
      if (isForm) return redirect(backPath);
      return json({ ok: false, error: 'Sign-up is paused for a moment. Try again later.' }, 503, { 'Retry-After': '600' });
    }

    const started = await requestJoin(env, list, sub.email);
    if (!started) return checkEmail();
    const link = `${new URL(request.url).origin}/api/list/confirm?t=${started.token}`;
    const sent = await sendMail(env, `${list} confirmation`, {
      to: sub.email,
      subject: LISTS[list].subject,
      ...listConfirmEmail({ link, ask: LISTS[list].ask }),
    });
    if (!sent) {
      if (isForm) return redirect(backPath);
      return json({ ok: false, error: 'We could not send the email. Try again in a few minutes.' }, 502);
    }
    return checkEmail();
  };
}
