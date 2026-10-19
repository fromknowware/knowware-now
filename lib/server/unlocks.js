// Which chapters a confirmed reader has open.
//
//   Chapter 1 opens when the address is confirmed. Every earned action opens the next chapter in
//   order, and one more opens by itself every seven days, so nobody is stuck and reading stays free.
//   unlocked = min(10, 1 + credits + weeks since confirming)
//
// Credits (one chapter each, each with a cap):
//   invite    a NEW person confirms their email through your link      up to 9
//   nominate  you send a voice nomination while signed in              up to 2
//   waitlist  your address is confirmed on the pre-order list           once
//   interest  your address is confirmed on the news list                once
//   note      you send the author a note about a chapter                up to 2
// A credit is never taken back: leaving a list, or the friend leaving, does not close a chapter.
//
// KV (hashes only):
//   credit:<h(email)>:<kind>:<id>   {at}        one key per credit, so crediting is idempotent
//   refcode:<CODE>                  h(email)    the share link's code
//   invited:<h(canonical email)>    h(referrer) the first referrer to bring an address gets the credit

import { sha256 } from './guard.js';

export const ORDER = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 'x'];
export const DRIP_MS = 7 * 24 * 60 * 60 * 1000;
export const CAPS = { invite: 9, nominate: 2, waitlist: 1, interest: 1, note: 2 };
export const REF_RE = /^[A-HJ-NP-Z2-9]{8}$/;
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

// One mailbox, however it is spelled: lowercase, no "+tag", and no dots at Gmail. Used only so a
// person cannot invite themselves with an alias.
export function canonicalEmail(email) {
  const [local, domain] = String(email).toLowerCase().split('@');
  const base = local.split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') return `${base.replace(/\./g, '')}@gmail.com`;
  return `${base}@${domain}`;
}

export async function addCredit(env, eh, kind, id, now = new Date().toISOString()) {
  if (!CAPS[kind]) return false;
  const key = `credit:${eh}:${kind}:${id}`;
  if (await env.CLAIMS.get(key)) return false;
  const held = await env.CLAIMS.list({ prefix: `credit:${eh}:${kind}:`, limit: CAPS[kind] + 1 });
  if (held.keys.length >= CAPS[kind]) return false;
  await env.CLAIMS.put(key, JSON.stringify({ at: now }));
  return true;
}

export async function creditsFor(env, eh) {
  const listed = await env.CLAIMS.list({ prefix: `credit:${eh}:`, limit: 100 });
  const by = Object.fromEntries(Object.keys(CAPS).map((k) => [k, 0]));
  for (const k of listed.keys) { const kind = k.name.split(':')[2]; if (kind in by) by[kind] += 1; }
  return by;
}

// How many chapters (counting from Chapter 1) this reader has open right now.
export async function unlockedFor(env, email, now = Date.now()) {
  const eh = await sha256(email);
  const acct = parse(await env.CLAIMS.get(`acct:${eh}`));
  const credits = await creditsFor(env, eh);
  const earned = Object.values(credits).reduce((a, b) => a + b, 0);
  const since = acct?.verifiedAt ? Date.parse(acct.verifiedAt) : now;
  const weeks = Math.max(0, Math.floor((now - since) / DRIP_MS));
  const count = Math.min(ORDER.length, 1 + earned + weeks);
  const nextDripAt = count < ORDER.length ? new Date(since + (weeks + 1) * DRIP_MS).toISOString() : null;
  return { eh, count, credits, earned, weeks, nextDripAt, acct };
}

export const chapterOpen = (count, slug) => {
  const i = ORDER.indexOf(slug);
  return i >= 0 && i < count;
};

// The share link's code. Made on first need and kept on the account.
export async function ensureRefCode(env, eh) {
  const acct = parse(await env.CLAIMS.get(`acct:${eh}`));
  if (!acct) return null;
  if (acct.ref && REF_RE.test(acct.ref)) return acct.ref;
  for (let tries = 0; tries < 5; tries++) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const code = [...bytes].map((b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
    if (await env.CLAIMS.get(`refcode:${code}`)) continue;
    await env.CLAIMS.put(`refcode:${code}`, eh);
    await env.CLAIMS.put(`acct:${eh}`, JSON.stringify({ ...acct, ref: code }));
    return code;
  }
  return null;
}

// A NEW address confirmed through someone's link: credit the person who shared it, once.
// Nothing happens for an unknown code, for oneself (aliases included) or for an address someone
// else already brought.
export async function creditInvite(env, code, inviteeEmail, now = new Date().toISOString()) {
  if (!REF_RE.test(code || '')) return false;
  const referrerEh = await env.CLAIMS.get(`refcode:${code}`);
  if (!referrerEh) return false;
  const referrer = parse(await env.CLAIMS.get(`acct:${referrerEh}`));
  if (!referrer?.email) return false;
  const ch = await sha256(canonicalEmail(inviteeEmail));
  if (ch === (await sha256(canonicalEmail(referrer.email)))) return false;
  if (await env.CLAIMS.get(`invited:${ch}`)) return false;
  await env.CLAIMS.put(`invited:${ch}`, referrerEh);
  return addCredit(env, referrerEh, 'invite', ch, now);
}
