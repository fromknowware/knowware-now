// Readers: who may open the full chapters, and the email that proves it.
//
//   startSignup    a typed address → a pending record + a one-time token for the emailed link
//   confirmSignup  the link used → the address is verified, this device gets an access token
//   readerFromToken / signOut / device cap
//
// Nothing unlocks until the link is used. KV holds only SHA-256 hashes of tokens, so a KV
// leak unlocks nothing. Keys:
//   pending:<h(token)>          {email, chapter, interest}            48 h, consumed on use
//   acct:<h(email)>             {email, createdAt, verifiedAt}
//   reader:<h(token)>           {email, createdAt, verifiedAt, via, dev}   180 d, one per device
//   readerdev:<h(email)>:<ms>:<h(token)>   device index, oldest first (cap MAX_DEVICES)
//   interest:<h(email)>         the news list; see lib/server/lists.js
//   mail10:<h(email)> / maild:<h(email)>   per-address send throttles

import { INTEREST_CONSENT } from '../site-facts.mjs';
import { newToken, sha256 } from './guard.js';

export const ACCESS_TTL_S = 60 * 60 * 24 * 180;
export const PENDING_TTL_S = 60 * 60 * 48;
export const MAX_DEVICES = 5;
const GAP_S = 600; // one message per address per ten minutes
const DAILY_MAX = 5; // and five per day

export const CHAPTER_RE = /^(0[1-9]|x)$/;

const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

// Throttle sends to ONE address, so a stranger's inbox cannot be filled by repeating a request.
// Returns true when this send should be skipped. The caller answers the same either way.
export async function addressThrottled(env, eh) {
  if (await env.CLAIMS.get(`mail10:${eh}`)) return true;
  const day = Number((await env.CLAIMS.get(`maild:${eh}`)) || 0);
  if (day >= DAILY_MAX) return true;
  await env.CLAIMS.put(`mail10:${eh}`, '1', { expirationTtl: GAP_S });
  await env.CLAIMS.put(`maild:${eh}`, String(day + 1), { expirationTtl: 86400 });
  return false;
}

// Records a sign-up request. Returns the token for the emailed link and whether the address is known,
// or null when this address was throttled (nothing to send).
export async function startSignup(env, { email, chapter, interest }, now = new Date().toISOString()) {
  const eh = await sha256(email);
  if (await addressThrottled(env, eh)) return null;
  const token = newToken();
  await env.CLAIMS.put(
    `pending:${await sha256(token)}`,
    JSON.stringify({ email, chapter, interest: interest === true, createdAt: now }),
    { expirationTtl: PENDING_TTL_S },
  );
  const known = Boolean(parse(await env.CLAIMS.get(`acct:${eh}`))?.verifiedAt);
  return { token, known };
}

// Looks at a pending token without using it (the confirm page shows who it is for).
export async function peekPending(env, token) {
  return parse(await env.CLAIMS.get(`pending:${await sha256(token)}`));
}

// Issues this device's access token and keeps at most MAX_DEVICES per address, dropping the oldest.
export async function mintDevice(env, email, via, now = new Date().toISOString()) {
  const eh = await sha256(email);
  const prefix = `readerdev:${eh}:`;
  const listed = await env.CLAIMS.list({ prefix, limit: 100 });
  const keys = listed.keys.map((k) => k.name).sort();
  for (const old of keys.slice(0, Math.max(0, keys.length - (MAX_DEVICES - 1)))) {
    const th = old.slice(old.lastIndexOf(':') + 1);
    await env.CLAIMS.delete(`reader:${th}`);
    await env.CLAIMS.delete(old);
  }
  const token = newToken();
  const th = await sha256(token);
  const dev = `${prefix}${String(Date.parse(now)).padStart(15, '0')}:${th}`;
  await env.CLAIMS.put(dev, '1', { expirationTtl: ACCESS_TTL_S });
  await env.CLAIMS.put(`reader:${th}`, JSON.stringify({ email, createdAt: now, verifiedAt: now, via, dev }), { expirationTtl: ACCESS_TTL_S });
  return token;
}

// The link was used. Consumes the pending record (single use), verifies the address, records the
// optional news-list consent now that the address is proven, and issues a device token.
export async function confirmSignup(env, token, now = new Date().toISOString()) {
  const key = `pending:${await sha256(token)}`;
  const pending = parse(await env.CLAIMS.get(key));
  if (!pending) return null;
  await env.CLAIMS.delete(key);
  const { email, chapter, interest } = pending;
  const eh = await sha256(email);
  const acct = parse(await env.CLAIMS.get(`acct:${eh}`));
  await env.CLAIMS.put(`acct:${eh}`, JSON.stringify({ email, createdAt: acct?.createdAt || now, verifiedAt: acct?.verifiedAt || now, lastSignInAt: now }));
  if (interest) await recordInterest(env, email, eh, now, pending.createdAt);
  return { email, chapter, deviceToken: await mintDevice(env, email, 'confirm', now) };
}

// News-list opt-in, recorded when the address is confirmed. Idempotent: the first consent stays.
// An address that unsubscribed stays unsubscribed until it ticks the box again on a new request.
async function recordInterest(env, email, eh, now, askedAt) {
  const key = `interest:${eh}`;
  const existing = parse(await env.CLAIMS.get(key));
  if (existing && existing.status === 'subscribed') return;
  await env.CLAIMS.put(key, JSON.stringify({
    email,
    status: 'subscribed',
    createdAt: existing?.createdAt || now,
    consent: { text: INTEREST_CONSENT, askedAt, confirmedAt: now, source: 'chapter-gate' },
  }));
}

// A device's access, or null. Only confirmed readers have records, but check anyway so a record
// written by an older version of the site (before confirmation existed) opens nothing.
export async function readerFromToken(env, token) {
  const rec = parse(await env.CLAIMS.get(`reader:${await sha256(token)}`));
  return rec && rec.email && rec.verifiedAt ? rec : null;
}

export async function signOut(env, token) {
  const th = await sha256(token);
  const rec = parse(await env.CLAIMS.get(`reader:${th}`));
  await env.CLAIMS.delete(`reader:${th}`);
  if (rec?.dev) await env.CLAIMS.delete(rec.dev);
}
