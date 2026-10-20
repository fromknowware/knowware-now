import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshotFromRdap, unregisteredSnapshot, diffSnapshots, daysUntil, renderIssue } from '../lib/domain-watch.mjs';

const rdap = (over = {}) => ({
  status: ['client transfer prohibited'],
  events: [
    { eventAction: 'registration', eventDate: '2024-08-08T19:15:43Z' },
    { eventAction: 'expiration', eventDate: '2027-08-08T19:15:43Z' },
    { eventAction: 'last changed', eventDate: '2026-09-16T19:28:42Z' },
    { eventAction: 'last update of RDAP database', eventDate: '2026-10-17T12:53:26Z' },
  ],
  nameservers: [{ ldhName: 'NS6.AFTERNIC.COM' }, { ldhName: 'NS5.AFTERNIC.COM' }],
  entities: [{ roles: ['registrar'], vcardArray: ['vcard', [['fn', {}, 'text', 'NameCheap, Inc.']]] }],
  ...over,
});

test('snapshot keeps only the fields that signal a change of hands', () => {
  const s = snapshotFromRdap(rdap(), ['0 .']);
  assert.deepEqual(s, {
    registered: true, registrar: 'NameCheap, Inc.', status: ['client transfer prohibited'],
    nameservers: ['ns5.afternic.com', 'ns6.afternic.com'], registration: '2024-08-08T19:15:43Z',
    expiration: '2027-08-08T19:15:43Z', mx: ['0 .'],
  });
});

test('refresh-only RDAP events and ordering do not raise an alert', () => {
  const a = snapshotFromRdap(rdap(), ['10 b.example', '5 a.example']);
  const b = snapshotFromRdap(rdap({ nameservers: [{ ldhName: 'ns5.afternic.com' }, { ldhName: 'ns6.afternic.com' }], events: [...rdap().events.slice(0, 2), { eventAction: 'last changed', eventDate: '2030-01-01T00:00:00Z' }] }), ['5 a.example', '10 b.example']);
  assert.deepEqual(diffSnapshots(a, b), []);
});

test('nameserver, MX, expiry and drop changes are all caught', () => {
  const base = snapshotFromRdap(rdap(), ['0 .']);
  const moved = snapshotFromRdap(rdap({ nameservers: [{ ldhName: 'ns1.example.net' }] }), ['10 mail.example.net']);
  assert.deepEqual(diffSnapshots(base, moved).map((c) => c.field), ['nameservers', 'mx']);
  const renewed = snapshotFromRdap(rdap({ events: [{ eventAction: 'registration', eventDate: '2024-08-08T19:15:43Z' }, { eventAction: 'expiration', eventDate: '2028-08-08T19:15:43Z' }] }), ['0 .']);
  assert.deepEqual(diffSnapshots(base, renewed).map((c) => c.field), ['expiration']);
  assert.ok(diffSnapshots(base, unregisteredSnapshot()).some((c) => c.field === 'registered'));
});

test('daysUntil and the issue body', () => {
  assert.equal(daysUntil('2026-12-01T00:00:00Z', new Date('2026-10-17T00:00:00Z')), 45);
  assert.equal(daysUntil(null), null);
  const body = renderIssue('example.com', 'a note', [{ field: 'mx', before: ['0 .'], after: ['10 m.example.com'] }], new Date('2026-10-17T00:00:00Z'));
  assert.match(body, /\*\*example\.com\*\*/);
  assert.match(body, /\| mx \| `0 \.` \| `10 m\.example\.com` \|/);
  assert.match(body, /--update/);
});
