// The pre-order waiting list: a person leaves an email, once, to be told when
// pre-orders open. Single purpose, stored in KV, never sent anywhere else.
// Nothing here sends mail; the author exports the list when the pre-order opens.

import { EMAIL_RE, clean, sha256 } from './guard.js';

export const CONSENT_TEXT = 'Email me once, when pre-orders open.';

export function readSubmission(data) {
  const email = clean(data.email, 254).toLowerCase();
  return { email, valid: EMAIL_RE.test(email), trap: Boolean(clean(data.company, 200)) };
}

// Idempotent: a second sign-up with the same address changes nothing and says nothing different.
export async function addToWaitlist(env, email, now = new Date().toISOString()) {
  const key = `waitlist:${await sha256(email)}`;
  if (await env.CLAIMS.get(key)) return { created: false };
  await env.CLAIMS.put(key, JSON.stringify({ email, createdAt: now, consent: { text: CONSENT_TEXT, at: now }, source: 'order-page' }));
  return { created: true };
}
