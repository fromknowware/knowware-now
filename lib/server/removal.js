// Leaving: a reader can stop news, leave the pre-order list, or have everything about them deleted.
//
//   startRemoval   an address asked to be removed → a one-time link, mailed only if we hold anything
//   applyRemoval   the link was used and a choice made: "news", "waitlist" or "all"
//   suppress       Resend told us an address bounced for good or complained (or unsubscribed a contact)
//
// A stranger cannot remove someone: every choice needs the link, which only the inbox receives.
// Leaving a list never closes a chapter that is already open. "all" deletes the reader, both list
// records, credits, devices, agent tokens, their notes and nominations and their invite link. It keeps
// only a one-way marker so a bounce or complaint is still honoured. Orders are kept for the author's
// accounting records and are not touched here.
//   rmpending:<h(token)>   {email}                 24 h
//   suppress:<h(email)>    {reason, at}            never sent to again

import { listTokens, principalHash, revokeById } from './agent.js';
import { newToken, sha256 } from './guard.js';
import { LIST_NAMES } from './lists.js';
import { addressThrottled } from './throttle.js';
import { canonicalEmail } from './unlocks.js';

export const REMOVAL_TTL_S = 60 * 60 * 24;
export const CHOICES = ['news', 'waitlist', 'all'];
const LIST_OF = { news: 'interest', waitlist: 'waitlist' };

const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

// Do we hold anything for this address? Decides whether a removal link is worth mailing.
async function holdsAnything(env, eh) {
  for (const key of [`acct:${eh}`, ...LIST_NAMES.map((l) => `${l}:${eh}`)]) if (await env.CLAIMS.get(key)) return true;
  return false;
}

// Returns { token } to mail, or null (nothing held, throttled, or suppressed): the caller answers the same.
export async function startRemoval(env, email, now = new Date().toISOString()) {
  const eh = await sha256(email);
  if (!(await holdsAnything(env, eh))) return null;
  if (await addressThrottled(env, eh, 'rm')) return null;
  const token = newToken();
  await env.CLAIMS.put(`rmpending:${await sha256(token)}`, JSON.stringify({ email, at: now }), { expirationTtl: REMOVAL_TTL_S });
  return { token };
}

export async function peekRemoval(env, token) {
  return parse(await env.CLAIMS.get(`rmpending:${await sha256(token)}`));
}

// Marks one list record "unsubscribed" (kept as a record of the withdrawal, out of every export).
export async function leaveList(env, list, email, reason, now = new Date().toISOString()) {
  const key = `${list}:${await sha256(email)}`;
  const rec = parse(await env.CLAIMS.get(key));
  if (!rec || rec.status === 'unsubscribed') return false;
  await env.CLAIMS.put(key, JSON.stringify({ ...rec, status: 'unsubscribed', unsubscribedAt: now, unsubscribedReason: reason }));
  return true;
}

async function deleteAll(env, prefix) {
  let cursor;
  let n = 0;
  do {
    const page = await env.CLAIMS.list({ prefix, limit: 1000, cursor });
    for (const k of page.keys) { await env.CLAIMS.delete(k.name); n++; }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return n;
}

// Scans a prefix (bounded) for records that name this address and deletes them.
async function deleteWhereEmail(env, prefix, email) {
  let cursor;
  let n = 0;
  for (let pages = 0; pages < 20; pages++) {
    const page = await env.CLAIMS.list({ prefix, limit: 1000, cursor });
    for (const k of page.keys) {
      const rec = parse(await env.CLAIMS.get(k.name));
      if (rec?.email === email) { await env.CLAIMS.delete(k.name); n++; }
    }
    if (page.list_complete) break;
    cursor = page.cursor;
  }
  return n;
}

export async function eraseEverything(env, email) {
  const eh = await sha256(email);
  const acct = parse(await env.CLAIMS.get(`acct:${eh}`));
  if (acct?.ref) await env.CLAIMS.delete(`refcode:${acct.ref}`);

  // Devices: the index key ends in the token hash, which names the reader record.
  let devices = 0;
  const idx = await env.CLAIMS.list({ prefix: `readerdev:${eh}:`, limit: 100 });
  for (const k of idx.keys) {
    await env.CLAIMS.delete(`reader:${k.name.slice(k.name.lastIndexOf(':') + 1)}`);
    await env.CLAIMS.delete(k.name);
    devices++;
  }

  const prin = await principalHash(email);
  for (const t of await listTokens(env, prin)) await revokeById(env, prin, t.id);

  for (const key of [`acct:${eh}`, ...LIST_NAMES.map((l) => `${l}:${eh}`), `mail10:${eh}`, `maild:${eh}`, `rm10:${eh}`, `rmd:${eh}`, `invited:${await sha256(canonicalEmail(email))}`]) {
    await env.CLAIMS.delete(key);
  }
  const credits = await deleteAll(env, `credit:${eh}:`);
  const kept = (await deleteWhereEmail(env, 'claim:', email)) + (await deleteWhereEmail(env, 'note:', email));
  return { devices, credits, records: kept };
}

// The link was used and a choice made. Returns what was done, or null when the link is no good.
export async function applyRemoval(env, token, choice, now = new Date().toISOString()) {
  if (!CHOICES.includes(choice)) return null;
  const key = `rmpending:${await sha256(token)}`;
  const pending = parse(await env.CLAIMS.get(key));
  if (!pending?.email) return null;
  await env.CLAIMS.delete(key);
  if (choice === 'all') {
    await eraseEverything(env, pending.email);
  } else {
    await leaveList(env, LIST_OF[choice], pending.email, 'asked', now);
  }
  return { email: pending.email, choice };
}

// Resend says this address bounced for good or complained. Never mail it again, and take it off both lists.
export async function suppress(env, email, reason, now = new Date().toISOString()) {
  const eh = await sha256(email);
  await env.CLAIMS.put(`suppress:${eh}`, JSON.stringify({ reason, at: now }));
  for (const l of LIST_NAMES) await leaveList(env, l, email, reason, now);
}
