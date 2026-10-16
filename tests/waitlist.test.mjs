import test from 'node:test';
import assert from 'node:assert/strict';
import { addToWaitlist, readSubmission, CONSENT_TEXT } from '../lib/server/waitlist.js';
import { listWaitlist, toCsv } from '../lib/server/admin.js';

function fakeKV() {
  const m = new Map();
  return { m, async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); },
    async list({ prefix, limit = 1000 }) { return { keys: [...m.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit).map((name) => ({ name })), list_complete: true }; } };
}

test('submissions are normalised, validated, and the honeypot is detected', () => {
  assert.deepEqual(readSubmission({ email: '  Reader@Example.COM ', company: '' }), { email: 'reader@example.com', valid: true, trap: false });
  assert.equal(readSubmission({ email: 'nope' }).valid, false);
  assert.equal(readSubmission({ email: 'a@b.co', company: 'Acme' }).trap, true);
  for (const bad of [null, undefined, 5, {}, [], 'x', { toString: 1 }]) assert.doesNotThrow(() => readSubmission({ email: bad }));
  assert.equal(readSubmission({ email: 'a@b.co\nBcc: evil@x.co' }).valid, false); // header-injection attempt
  assert.equal(readSubmission({ email: 'x'.repeat(300) + '@b.co' }).valid, false);
});

test('joining is idempotent and records consent, with no side effects elsewhere', async () => {
  const env = { CLAIMS: fakeKV() };
  assert.equal((await addToWaitlist(env, 'a@example.com', '2026-10-16T00:00:00Z')).created, true);
  assert.equal((await addToWaitlist(env, 'a@example.com', '2027-01-01T00:00:00Z')).created, false);
  assert.equal(env.CLAIMS.m.size, 1);
  const rec = JSON.parse([...env.CLAIMS.m.values()][0]);
  assert.deepEqual([rec.email, rec.createdAt, rec.consent.text], ['a@example.com', '2026-10-16T00:00:00Z', CONSENT_TEXT]); // first sign-up kept
});

test('the export lists addresses and the CSV neutralises spreadsheet formulas', async () => {
  const env = { CLAIMS: fakeKV() };
  for (const e of ['a@example.com', '=cmd@example.com', '+x@example.com']) await addToWaitlist(env, e);
  const page = await listWaitlist(env);
  assert.equal(page.entries.length, 3);
  const csv = toCsv(page.entries);
  assert.match(csv, /^email,created_at\n/);
  assert.match(csv, /"'=cmd@example.com"/);
  assert.match(csv, /"'\+x@example.com"/);
  assert.equal(csv.includes(',"=cmd'), false);
});
