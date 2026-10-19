// Resend webhooks: the way an unsubscribe, a hard bounce or a spam complaint reaches the site
// without giving the site a key that can read contacts. Resend signs each call with Svix:
//   svix-signature = "v1,<base64 HMAC-SHA256>" (space separated if the secret was rotated)
//   signed content = `${svix-id}.${svix-timestamp}.${raw body}`, key = base64 of the secret after "whsec_"
// Events used (https://resend.com/docs/webhooks/event-types):
//   email.bounced      data.bounce.type === "Permanent", data.to[]       → suppress
//   email.complained   data.to[]                                          → suppress
//   contact.updated    data.unsubscribed === true, data.email             → leave both lists
// Nothing is logged but a count.

import { EMAIL_RE } from './guard.js';
import { LIST_NAMES } from './lists.js';
import { leaveList, suppress } from './removal.js';

const TOLERANCE_S = 300;

function b64decode(s) {
  const bin = atob(s);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function verifySvix(secret, headers, body, nowMs = Date.now()) {
  const id = headers.get('svix-id');
  const ts = headers.get('svix-timestamp');
  const sigs = headers.get('svix-signature');
  if (!secret || !id || !ts || !sigs || !/^\d{9,12}$/.test(ts)) return false;
  if (Math.abs(nowMs / 1000 - Number(ts)) > TOLERANCE_S) return false;
  let key;
  try { key = await crypto.subtle.importKey('raw', b64decode(secret.replace(/^whsec_/, '')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); } catch { return false; }
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${ts}.${body}`)));
  const expected = btoa(String.fromCharCode(...mac));
  return sigs.split(' ').some((part) => {
    const [version, sig] = part.split(',');
    if (version !== 'v1' || !sig || sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

const emails = (list) => (Array.isArray(list) ? list : []).filter((e) => typeof e === 'string').map((e) => e.trim().toLowerCase()).filter((e) => EMAIL_RE.test(e));

// Returns how many addresses were acted on.
export async function applyResendEvent(env, event, now = new Date().toISOString()) {
  const data = event?.data;
  if (!data || typeof event.type !== 'string') return 0;
  let n = 0;
  if (event.type === 'email.bounced' && data.bounce?.type === 'Permanent') {
    for (const e of emails(data.to)) { await suppress(env, e, 'bounce', now); n++; }
  } else if (event.type === 'email.complained') {
    for (const e of emails(data.to)) { await suppress(env, e, 'complaint', now); n++; }
  } else if (event.type === 'contact.updated' && data.unsubscribed === true) {
    for (const e of emails([data.email])) {
      for (const l of LIST_NAMES) await leaveList(env, l, e, 'resend-unsubscribe', now);
      n++;
    }
  }
  return n;
}
