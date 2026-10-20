// Pure helpers for the weekly domain watch (see scripts/domain-watch.mjs).
// Public data only: RDAP and DNS. No secrets, no accounts.

const eventDate = (rdap, action) => (rdap.events || []).find((e) => e.eventAction === action)?.eventDate ?? null;
const registrarName = (rdap) => {
  const ent = (rdap.entities || []).find((e) => (e.roles || []).includes('registrar'));
  const fn = ent?.vcardArray?.[1]?.find((f) => f[0] === 'fn');
  return fn ? fn[3] : null;
};

// The fields that matter for "has this domain changed hands or changed purpose".
// Deliberately excludes RDAP's "last changed" and "last update of RDAP database"
// events, which move on every refresh and would raise a false alarm each week.
export function snapshotFromRdap(rdap, mx) {
  return {
    registered: true,
    registrar: registrarName(rdap),
    status: [...(rdap.status || [])].map((s) => s.toLowerCase()).sort(),
    nameservers: (rdap.nameservers || []).map((n) => n.ldhName.toLowerCase()).sort(),
    registration: eventDate(rdap, 'registration'),
    expiration: eventDate(rdap, 'expiration'),
    mx: [...mx].sort(),
  };
}

export const unregisteredSnapshot = () => ({ registered: false });

const FIELDS = ['registered', 'registrar', 'status', 'nameservers', 'registration', 'expiration', 'mx'];

export function diffSnapshots(before, after) {
  const changes = [];
  for (const f of FIELDS) {
    const a = JSON.stringify(before?.[f] ?? null);
    const b = JSON.stringify(after?.[f] ?? null);
    if (a !== b) changes.push({ field: f, before: before?.[f] ?? null, after: after?.[f] ?? null });
  }
  return changes;
}

export function daysUntil(iso, now = new Date()) {
  if (!iso) return null;
  return Math.floor((new Date(iso).getTime() - now.getTime()) / 86400000);
}

export function renderIssue(domain, note, changes, now = new Date()) {
  const fmt = (v) => '`' + (Array.isArray(v) ? v.join(', ') || '(none)' : String(v)) + '`';
  const rows = changes.map((c) => `| ${c.field} | ${fmt(c.before)} | ${fmt(c.after)} |`).join('\n');
  return [
    `Weekly domain watch saw a change for **${domain}** on ${now.toISOString().slice(0, 10)}.`,
    '',
    note ? `_${note}_` : '',
    '',
    '| Field | Baseline | Now |',
    '|---|---|---|',
    rows,
    '',
    'Public RDAP and DNS data only. Nothing here has contacted anyone.',
    'Review it, then accept the new state by running `node scripts/domain-watch.mjs --update` and committing `.github/domain-watch/baseline.json`.',
  ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
}
