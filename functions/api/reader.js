// /api/reader — reader sign-up that unlocks full chapters.
//   POST {email, updates, chapter}  → stores the reader, sets the access cookie
//   GET  ?t=<token>&next=<path>     → magic link from the welcome email
//   GET  ?forget=1                  → signs this device out
// Tokens are random; KV keeps only their SHA-256, so a KV leak can't unlock.

import {
  EMAIL_RE, TOKEN_RE, clean, json, newToken, originAllowed,
  rateLimited, readCookie, readJson, sha256,
} from '../../lib/server/guard.js';
import { CONTACT_EMAIL } from '../../lib/site-facts.mjs';
import { logResend } from '../../lib/server/resend.js';

const ACCESS_TTL_S = 60 * 60 * 24 * 400;
const CONSENT_TEXT = 'Also email me when new chapters and the print edition are ready.';
const CHAPTER_RE = /^(0[1-9]|x)$/;
const FULL_PATH_RE = /^\/read\/(0[1-9]|x)\/full$/;

function accessCookies(token, maxAge = ACCESS_TTL_S) {
  return [
    `kw_reader=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
    `kw_reader_ui=1; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`,
  ];
}

const CLEAR_COOKIES = [
  'kw_reader=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
  'kw_reader_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax',
];

function redirect(location, cookies = [], status = 302) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  cookies.forEach((c) => headers.append('Set-Cookie', c));
  return new Response(null, { status, headers });
}

async function sendWelcome(env, email, link, nn) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.READER_FROM || env.CLAIM_NOTIFY_FROM || 'Knowware <onboarding@resend.dev>',
        reply_to: CONTACT_EMAIL,
        to: [email],
        subject: 'Your Knowware chapters are unlocked',
        text: [
          'Every chapter of Knowware, including the capstone, is unlocked for you.',
          '',
          `Continue Chapter ${nn}:`,
          link,
          '',
          'Open that link on any device to read there too. Keep it private: it works like a key.',
          '',
          'If you did not request this, ignore this email.',
          '',
          'Knowware · knowware.systems',
        ].join('\n'),
      }),
    });
    await logResend('welcome email', res);
  } catch (err) {
    // Access already works on this device; the email is best-effort.
    await logResend('welcome email', null, err);
  }
}

async function addToAudience(env, email) {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) return;
  try {
    const res = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    await logResend('add contact', res);
  } catch (err) {
    await logResend('add contact', null, err);
  }
}

// Without JavaScript the gate form posts natively; answer with redirects
// so the email never lands in a URL.
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
  const next = `/read/${chapter}/full`;
  const backToGate = () => redirect(`/read/${chapter}/#unlock`, [], 303);

  // Honeypot: look successful, grant nothing.
  if (clean(data.company, 200)) return isForm ? backToGate() : json({ ok: true, next });

  const email = clean(data.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
  }
  const updates = data.updates === true;

  if (await rateLimited(env, request, 'reader', 10, 3600)) {
    if (isForm) return backToGate();
    return json({ ok: false, error: 'Too many sign-ups from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }

  const now = new Date().toISOString();
  const token = newToken();
  await env.CLAIMS.put(`reader:${await sha256(token)}`, JSON.stringify({ email, createdAt: now }), { expirationTtl: ACCESS_TTL_S });

  const subKey = `subscriber:${await sha256(email)}`;
  const existing = JSON.parse((await env.CLAIMS.get(subKey)) || 'null');
  const record = {
    email,
    firstChapter: existing?.firstChapter || chapter,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    updates: updates || existing?.updates || false,
    consent: updates ? { text: CONSENT_TEXT, at: now } : existing?.consent || null,
    country: request.cf?.country || '',
  };
  await env.CLAIMS.put(subKey, JSON.stringify(record));

  // The emailed link carries its own token, so signing out this device
  // doesn't break the link.
  let welcome = null;
  if (env.RESEND_API_KEY) {
    const linkToken = newToken();
    await env.CLAIMS.put(`reader:${await sha256(linkToken)}`, JSON.stringify({ email, createdAt: now, via: 'email' }), { expirationTtl: ACCESS_TTL_S });
    const link = `${new URL(request.url).origin}/api/reader?t=${linkToken}&next=${encodeURIComponent(next)}`;
    welcome = sendWelcome(env, email, link, chapter);
  }
  await Promise.all([welcome, updates ? addToAudience(env, email) : null]);

  if (isForm) return redirect(`${next}#continue`, accessCookies(token), 303);
  return json({ ok: true, next }, 200, { 'Set-Cookie': accessCookies(token) });
}

async function handleGet({ request, env }) {
  const url = new URL(request.url);

  if (url.searchParams.get('forget') === '1') {
    const token = readCookie(request, 'kw_reader');
    if (TOKEN_RE.test(token)) await env.CLAIMS.delete(`reader:${await sha256(token)}`);
    return redirect('/read/?signed-out=1', CLEAR_COOKIES);
  }

  const token = url.searchParams.get('t') || '';
  const nextParam = url.searchParams.get('next') || '';
  const next = FULL_PATH_RE.test(nextParam) ? nextParam : '/read/';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid', CLEAR_COOKIES);

  const key = `reader:${await sha256(token)}`;
  const stored = await env.CLAIMS.get(key);
  if (!stored) return redirect('/read/?link=expired', CLEAR_COOKIES);

  // The emailed link stays a reusable key; each device gets its own token so
  // signing out one device leaves the others signed in.
  const record = JSON.parse(stored);
  const now = new Date().toISOString();
  if (!record.verifiedAt) {
    record.verifiedAt = now;
    await env.CLAIMS.put(key, JSON.stringify(record), { expirationTtl: ACCESS_TTL_S });
  }
  const deviceToken = newToken();
  await env.CLAIMS.put(
    `reader:${await sha256(deviceToken)}`,
    JSON.stringify({ email: record.email, createdAt: now, verifiedAt: record.verifiedAt, via: 'link' }),
    { expirationTtl: ACCESS_TTL_S },
  );
  return redirect(next, accessCookies(deviceToken));
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'POST') return handlePost(context);
  if (method === 'GET') return handleGet(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
