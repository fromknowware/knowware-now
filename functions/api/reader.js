// /api/reader — asks for access to the full chapters. Typing an address sends ONE email with a
// confirmation link; nothing unlocks until the link is used (see /api/reader/confirm).
//   POST {email, updates, chapter, company}  → "check your email" (the same answer for every address)
//   GET  ?forget=1                           → signs this device out
// The answer never says whether an address is new, known or throttled, so the form cannot be used
// to probe who reads. Tokens are random; KV keeps only their SHA-256.

import {
  EMAIL_RE, TOKEN_RE, clean, json, originAllowed, rateLimited, readCookie, readJson,
} from '../../lib/server/guard.js';
import { confirmEmail, sendMail } from '../../lib/server/mail.js';
import { CHAPTER_RE, confirmSignup, signOut, startSignup } from '../../lib/server/reader.js';
import { accessCookies, CLEAR_COOKIES, redirect } from '../../lib/server/reader-http.js';

const SENT_PATH = '/read/sent/';

// Without JavaScript the gate form posts natively; answer with redirects so the email never
// lands in a URL.
async function readForm(request, maxBytes) {
  const raw = await request.text();
  if (raw.length > maxBytes) return null;
  const params = new URLSearchParams(raw);
  return {
    email: params.get('email') || '',
    updates: params.get('updates') === 'yes',
    company: params.get('company') || '',
    chapter: params.get('chapter') || '',
  };
}

async function handlePost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);

  const isForm = (request.headers.get('Content-Type') || '').startsWith('application/x-www-form-urlencoded');
  let data;
  if (isForm) {
    data = await readForm(request, 2048);
    if (!data) return redirect('/read/#unlock', [], 303);
  } else {
    const parsed = await readJson(request, 2048);
    if (parsed.response) return parsed.response;
    data = parsed.data;
  }

  const requested = String(data.chapter).toLowerCase();
  const chapter = CHAPTER_RE.test(requested) ? requested : '01';
  const backToGate = () => redirect(`/read/${chapter}/#unlock`, [], 303);
  const checkEmail = () => (isForm ? redirect(SENT_PATH, [], 303) : json({ ok: true, sent: true }));

  // Honeypot: look successful, send nothing.
  if (clean(data.company, 200)) return checkEmail();

  const email = clean(data.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
  }
  const interest = data.updates === true;

  if (await rateLimited(env, request, 'reader', 10, 3600)) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'Too many sign-ups from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }

  // Local development and CI only: with no email key configured, skip the email and confirm at once.
  // Ignored whenever RESEND_API_KEY is set, so it cannot weaken a real deployment.
  if (!env.RESEND_API_KEY && env.READER_AUTOCONFIRM === 'true') {
    const started = await startSignup(env, { email, chapter, interest });
    const confirmed = started && (await confirmSignup(env, started.token));
    if (!confirmed) return checkEmail();
    const next = `/read/${chapter}/full`;
    if (isForm) return redirect(`${next}#continue`, accessCookies(confirmed.deviceToken), 303);
    return json({ ok: true, next }, 200, { 'Set-Cookie': accessCookies(confirmed.deviceToken) });
  }

  if (!env.RESEND_API_KEY) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'Sign-up is paused for a moment. Try again later.' }, 503, { 'Retry-After': '600' });
  }

  const started = await startSignup(env, { email, chapter, interest });
  if (!started) return checkEmail(); // this address was mailed moments ago; say nothing different
  const link = `${new URL(request.url).origin}/api/reader/confirm?t=${started.token}`;
  const sent = await sendMail(env, 'confirmation email', { to: email, ...confirmEmail({ link, signin: started.known, interest }) });
  if (!sent) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'We could not send the email. Try again in a few minutes.' }, 502);
  }
  return checkEmail();
}

async function handleGet({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get('forget') === '1') {
    const token = readCookie(request, 'kw_reader');
    if (TOKEN_RE.test(token)) await signOut(env, token);
    return redirect('/read/?signed-out=1', CLEAR_COOKIES);
  }
  // Links from the old unlock-on-entry emails no longer open anything.
  return redirect('/read/?link=invalid', CLEAR_COOKIES);
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'POST') return handlePost(context);
  if (method === 'GET') return handleGet(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
