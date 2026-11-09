import test from 'node:test';
import assert from 'node:assert/strict';
import { claimShare, detectPlatform, canonicalUrl, hasUnlock, ensureSubscriberShape, readerIdFromToken } from '../lib/server/share.js';

function fakeKV() {
  const m = new Map();
  return {
    m,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
  };
}

const NOW = '2026-11-08T12:00:00Z';

async function setupReader(env, email = 'a@example.com') {
  // Different readers get different tokens so their readerIds (and the
  // `reader-receipts:<readerId>:<chapter>` keys that enforce one-per-chapter)
  // are distinct.
  const token = email.padEnd(43, '_').slice(0, 43);
  const readerId = await readerIdFromToken(token);
  const subKey = `subscriber:sub-${email}`;
  await env.CLAIMS.put(subKey, JSON.stringify({ email, readerId, unlocks: { '01': true } }));
  return { token, readerId, subKey };
}

test('detectPlatform recognises the four supported hosts', () => {
  assert.equal(detectPlatform('https://x.com/me/status/123456789012'), 'x');
  assert.equal(detectPlatform('https://twitter.com/me/status/9'), 'x');
  assert.equal(detectPlatform('https://www.instagram.com/p/AbCdE_F-gH1/'), 'instagram');
  assert.equal(detectPlatform('https://www.instagram.com/reel/AbCdE_F-gH1'), 'instagram');
  assert.equal(detectPlatform('https://www.linkedin.com/posts/jane-doe_activity-7000000000000000000-abcd'), 'linkedin');
  assert.equal(detectPlatform('https://www.linkedin.com/feed/update/urn:li:activity:7000000000000000000'), 'linkedin');
  assert.equal(detectPlatform('https://www.tiktok.com/@you/video/7000000000000000000'), 'tiktok');
  assert.equal(detectPlatform('https://facebook.com/post/1'), null);
  assert.equal(detectPlatform('ftp://x.com/me/status/1'), null);
  assert.equal(detectPlatform('not a url'), null);
});

test('canonicalUrl normalises Instagram, X and TikTok so near-duplicates collide', () => {
  const a = canonicalUrl('https://www.instagram.com/p/AbCd1/', 'instagram');
  const b = canonicalUrl('https://instagram.com/p/AbCd1?utm=x', 'instagram');
  assert.equal(a, b);
  assert.equal(canonicalUrl('https://twitter.com/you/status/7/', 'x'), canonicalUrl('https://x.com/other/status/7?s=20', 'x'));
  assert.equal(canonicalUrl('https://tiktok.com/@a/video/9', 'tiktok'), canonicalUrl('https://www.tiktok.com/@b/video/9/', 'tiktok'));
});

test('claimShare unlocks a chapter on the first valid URL and refuses rechains', async () => {
  const env = { CLAIMS: fakeKV() };
  const { token, subKey } = await setupReader(env);

  const ok = await claimShare(env, { readerToken: token, subscriberKey: subKey, chapter: '02', voice: 10, url: 'https://x.com/you/status/111', platform: 'x', now: NOW });
  assert.deepEqual(ok, { ok: true, next: '/read/02/full' });

  const sub = JSON.parse(await env.CLAIMS.get(subKey));
  assert.equal(hasUnlock(sub, '02'), true);
  assert.equal(hasUnlock(sub, '03'), false);

  const again = await claimShare(env, { readerToken: token, subscriberKey: subKey, chapter: '02', voice: 11, url: 'https://x.com/you/status/222', platform: 'x', now: NOW });
  assert.equal(again.ok, false);
  assert.equal(again.code, 'already');
});

test('claimShare refuses a URL that was already used by anyone', async () => {
  const env = { CLAIMS: fakeKV() };
  const a = await setupReader(env, 'a@example.com');
  const b = await setupReader(env, 'b@example.com');

  const shared = 'https://x.com/someone/status/555';
  assert.equal((await claimShare(env, { readerToken: a.token, subscriberKey: a.subKey, chapter: '02', voice: 10, url: shared, platform: 'x', now: NOW })).ok, true);
  const dup = await claimShare(env, { readerToken: b.token, subscriberKey: b.subKey, chapter: '02', voice: 10, url: shared, platform: 'x', now: NOW });
  assert.equal(dup.ok, false);
  assert.equal(dup.code, 'duplicate');
});

test('claimShare refuses a URL that does not match a supported platform', async () => {
  const env = { CLAIMS: fakeKV() };
  const r = await setupReader(env);
  const bad = await claimShare(env, { readerToken: r.token, subscriberKey: r.subKey, chapter: '02', voice: 10, url: 'https://facebook.com/post/1', platform: 'x', now: NOW });
  assert.equal(bad.ok, false);
  assert.equal(bad.code, 'url');
});

test('claimShare refuses a mismatched platform tag even for a valid URL', async () => {
  const env = { CLAIMS: fakeKV() };
  const r = await setupReader(env);
  const mis = await claimShare(env, { readerToken: r.token, subscriberKey: r.subKey, chapter: '02', voice: 10, url: 'https://x.com/you/status/1', platform: 'tiktok', now: NOW });
  assert.equal(mis.ok, false);
  assert.equal(mis.code, 'platform');
});

test('claimShare refuses chapter 01 (it opens with email, not a share)', async () => {
  const env = { CLAIMS: fakeKV() };
  const r = await setupReader(env);
  const res = await claimShare(env, { readerToken: r.token, subscriberKey: r.subKey, chapter: '01', voice: 1, url: 'https://x.com/a/status/1', platform: 'x', now: NOW });
  assert.equal(res.ok, false);
  assert.equal(res.code, 'chapter');
});

test('ensureSubscriberShape back-fills readerId and unlocks[01] for legacy records', async () => {
  const env = { CLAIMS: fakeKV() };
  const subKey = 'subscriber:legacy';
  await env.CLAIMS.put(subKey, JSON.stringify({ email: 'legacy@example.com' })); // no readerId, no unlocks
  const token = 'Y'.repeat(43);
  const sub = await ensureSubscriberShape(env, subKey, token, NOW);
  assert.equal(typeof sub.readerId, 'string');
  assert.equal(sub.readerId.length, 8);
  assert.equal(sub.unlocks['01'], true);
});
