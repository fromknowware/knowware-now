// Share-to-continue: per-chapter unlock via social post receipts.
// Logic lives here so Node tests can exercise it with a fake KV; the
// Cloudflare Functions in functions/api/reader/ just wire request/response
// to these helpers.

import { sha256 } from './guard.js';

export const CHAPTER_RE = /^(0[1-9]|x)$/;
export const CHAPTERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 'x'];

// Each platform's URL pattern. The first capture group, when present, is a
// stable post id used for deduplication; otherwise we hash the full URL.
export const PLATFORMS = {
  instagram: /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)\/?(?:\?.*)?$/,
  linkedin: /^https?:\/\/(?:www\.)?linkedin\.com\/(?:posts\/[^/?#]+|feed\/update\/urn:li:activity:\d+)\/?(?:\?.*)?$/,
  x: /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/(\d+)\/?(?:\?.*)?$/,
  tiktok: /^https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/(\d+)\/?(?:\?.*)?$/,
};

export function detectPlatform(url) {
  if (typeof url !== 'string' || url.length > 2048) return null;
  for (const [name, re] of Object.entries(PLATFORMS)) {
    if (re.test(url)) return name;
  }
  return null;
}

// Normalise so the same post typed two ways (with/without trailing slash,
// query string, http vs https) hashes to the same key.
export function canonicalUrl(url, platform) {
  const re = PLATFORMS[platform];
  if (!re) return url;
  const m = url.match(re);
  if (!m) return url;
  if (platform === 'instagram') return `https://instagram.com/p/${m[1]}`;
  if (platform === 'x') return `https://x.com/i/status/${m[1]}`;
  if (platform === 'tiktok') return `https://tiktok.com/video/${m[1]}`;
  // LinkedIn URL shapes vary; strip query string and trailing slash.
  return url.replace(/[/?#].*$/, '').replace(/\/$/, '');
}

// The reader id is a short, deterministic hash of the reader's access token.
// It appears in signatures and backlinks so a shared post can be attributed
// to the sharer without exposing their token.
export async function readerIdFromToken(token) {
  return (await sha256(token)).slice(0, 8);
}

export async function urlHash(canon) {
  return (await sha256(canon)).slice(0, 24);
}

export function signatureFor(voiceId, readerId) {
  return `#knowware-v${voiceId}-r/${readerId}`;
}

export function backlinkFor(voiceId, readerId, origin = 'https://knowware.systems') {
  return `${origin}/v/${voiceId}?r=${readerId}`;
}

// Submit a share receipt for a chapter. Returns:
//   { ok: true, next }                  — chapter unlocked
//   { ok: false, error, code }          — validation / duplicate / already-claimed
// env.CLAIMS is the KV binding; now is an ISO timestamp.
export async function claimShare(env, { readerToken, subscriberKey, chapter, voice, url, platform, now }) {
  const ch = String(chapter || '').toLowerCase();
  if (!CHAPTER_RE.test(ch)) return { ok: false, error: 'Unknown chapter.', code: 'chapter' };
  if (ch === '01') return { ok: false, error: 'Chapter 1 opens with sign-up, no share needed.', code: 'chapter' };

  const v = Number(voice);
  if (!Number.isInteger(v) || v < 1 || v > 81) return { ok: false, error: 'Pick one of the suggested voices.', code: 'voice' };

  const detected = detectPlatform(url);
  if (!detected) return { ok: false, error: 'That URL does not look like an Instagram, LinkedIn, X or TikTok post.', code: 'url' };
  if (platform && platform !== detected) return { ok: false, error: 'The URL does not match the platform selected.', code: 'platform' };

  // Look up the subscriber record keyed by email hash. The caller passed the
  // key because it already looked up the reader token.
  const subRaw = await env.CLAIMS.get(subscriberKey);
  if (!subRaw) return { ok: false, error: 'Sign up first.', code: 'auth' };
  const sub = JSON.parse(subRaw);
  const readerId = sub.readerId || (await readerIdFromToken(readerToken));

  // One receipt per reader per chapter: refuse the second attempt.
  const reserveKey = `reader-receipts:${readerId}:${ch}`;
  if (await env.CLAIMS.get(reserveKey)) return { ok: false, error: 'This chapter is already unlocked for you.', code: 'already' };

  const canon = canonicalUrl(url, detected);
  const uh = await urlHash(canon);
  const receiptKey = `receipt:${uh}`;

  // Refuse the same URL across readers.
  if (await env.CLAIMS.get(receiptKey)) return { ok: false, error: 'That post has already been used.', code: 'duplicate' };

  const receipt = {
    readerId, chapter: ch, voice: v, platform: detected, url: canon, postedAt: now,
    status: 'pending',
  };
  await env.CLAIMS.put(receiptKey, JSON.stringify(receipt));
  await env.CLAIMS.put(reserveKey, uh);

  // Flip the unlock on the subscriber record.
  sub.readerId = readerId;
  sub.unlocks = { ...(sub.unlocks || {}), [ch]: true };
  sub.updatedAt = now;
  await env.CLAIMS.put(subscriberKey, JSON.stringify(sub));

  return { ok: true, next: `/read/${ch}/full` };
}

// Does this reader have the given chapter unlocked?
// Chapter 1 is always open once they signed up (the welcome flow sets it).
export function hasUnlock(subscriber, chapter) {
  if (!subscriber) return false;
  const unlocks = subscriber.unlocks || {};
  return unlocks[chapter] === true;
}

// Called by functions/api/reader.js on sign-up / link verification so the
// subscriber record always has readerId + unlocks[01] set.
export async function ensureSubscriberShape(env, subscriberKey, token, now) {
  const raw = await env.CLAIMS.get(subscriberKey);
  if (!raw) return null;
  const sub = JSON.parse(raw);
  let dirty = false;
  if (!sub.readerId) { sub.readerId = await readerIdFromToken(token); dirty = true; }
  if (!sub.unlocks || sub.unlocks['01'] !== true) { sub.unlocks = { ...(sub.unlocks || {}), '01': true }; dirty = true; }
  if (dirty) { sub.updatedAt = now; await env.CLAIMS.put(subscriberKey, JSON.stringify(sub)); }
  return sub;
}
