// /api/reader/confirm — the page behind the emailed link.
//   GET  ?t=<token>   shows a "Confirm and read" button. It changes nothing, so a mail scanner that
//                     fetches every link cannot confirm an address on someone's behalf.
//   POST t=<token>    uses the link: verifies the address, signs this device in, opens the chapter.
// The link works once and expires in 48 hours.

import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, json, originAllowed } from '../../../lib/server/guard.js';
import { maskEmail } from '../../../lib/server/agent.js';
import { confirmPage } from '../../../lib/server/confirm-page.js';
import { esc } from '../../../lib/server/mail.js';
import { confirmSignup, peekPending } from '../../../lib/server/reader.js';
import { accessCookies, redirect } from '../../../lib/server/reader-http.js';

const page = (token, pending) => confirmPage(pageHeaders, {
  heading: 'Confirm your email.',
  lead: `This confirms <strong>${esc(maskEmail(pending.email))}</strong> and opens Knowware on this device.`,
  action: '/api/reader/confirm',
  token,
  button: 'Confirm and read',
});

async function handleGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('t') || '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid');
  const pending = await peekPending(env, token);
  if (!pending) return redirect('/read/?link=expired');
  return page(token, pending);
}

async function handlePost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const raw = await request.text();
  const token = raw.length <= 512 ? new URLSearchParams(raw).get('t') || '' : '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid', [], 303);
  const done = await confirmSignup(env, token);
  if (!done) return redirect('/read/?link=expired', [], 303);
  return redirect(`/read/${done.chapter}/full#continue`, accessCookies(done.deviceToken), 303);
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'GET') return handleGet(context);
  if (method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
