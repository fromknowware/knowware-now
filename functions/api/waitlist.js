// POST /api/waitlist {email}  — join the pre-order list.
// A form post (no JavaScript) gets redirects instead of JSON, like /api/reader.
// Browser callers only (our own origins), small bodies, honeypot, per-connection limit.
// Duplicate sign-ups look identical to new ones, so the list cannot be probed.

import { json, originAllowed, rateLimited, readJson } from '../../lib/server/guard.js';
import { addToWaitlist, readSubmission } from '../../lib/server/waitlist.js';
import { guard } from '../../lib/server/shield.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });

async function handle({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);

  const isForm = (request.headers.get('Content-Type') || '').startsWith('application/x-www-form-urlencoded');
  let data;
  if (isForm) {
    const raw = await request.text();
    if (raw.length > 1024) return redirect('/order#waitlist');
    const p = new URLSearchParams(raw);
    data = { email: p.get('email') || '', company: p.get('company') || '' };
  } else {
    const parsed = await readJson(request, 1024);
    if (parsed.response) return parsed.response;
    data = parsed.data;
  }

  const sub = readSubmission(data);
  // Honeypot: look successful, store nothing.
  if (sub.trap) return isForm ? redirect('/order/listed') : json({ ok: true });
  if (!sub.valid) {
    if (isForm) return redirect('/order#waitlist');
    return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
  }
  if (await rateLimited(env, request, 'waitlist', 6, 3600)) {
    if (isForm) return redirect('/order#waitlist');
    return json({ ok: false, error: 'Too many sign-ups from this connection. Try again in an hour.' }, 429, { 'Retry-After': '3600' });
  }
  await addToWaitlist(env, sub.email);
  return isForm ? redirect('/order/listed') : json({ ok: true });
}

export const onRequest = guard(handle, { exemptFromKillSwitch: true }); // not part of the agent API
