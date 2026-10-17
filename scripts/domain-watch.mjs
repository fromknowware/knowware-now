// Weekly domain watch. Reads public RDAP + DNS (no secrets), compares with
// .github/domain-watch/baseline.json, and prints a JSON report.
//   node scripts/domain-watch.mjs            compare; exit 0 always, writes report if changed
//   node scripts/domain-watch.mjs --update   rewrite the baseline to the current state
// The workflow turns each report entry into a GitHub issue.
import { readFile, writeFile } from 'node:fs/promises';
import { snapshotFromRdap, unregisteredSnapshot, diffSnapshots, daysUntil, renderIssue } from '../lib/domain-watch.mjs';

const BASELINE = new URL('../.github/domain-watch/baseline.json', import.meta.url);
const REPORT = process.env.DOMAIN_WATCH_REPORT || 'domain-watch-report.json';
const UA = { 'User-Agent': 'knowware-domain-watch/1.0 (+https://github.com/fromknowware/knowware-now)' };

// "watch": a domain we do not control (alert on any change).
// "own": a domain we do control (alert on any change, and when it expires within 60 days).
export const DOMAINS = [
  {
    name: 'systemsofintelligence.com', kind: 'watch', rdap: 'https://rdap.verisign.com/com/v1/domain/',
    note: 'Printed in the manuscript until the text fix lands. Listed on Afternic as of 2026-10-17. A change of nameservers, MX or expiry can mean a sale, a new use, or a drop.',
  },
  { name: 'knowware.press', kind: 'own', rdap: 'https://rdap.org/domain/', note: 'The book\'s official domain.' },
];

async function getJson(url, headers, tries = 3) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, { headers: { ...UA, ...headers }, redirect: 'follow' });
    if (res.status === 404) return null;
    if (res.ok) return res.json();
    if (i >= tries || ![429, 500, 502, 503, 504].includes(res.status)) throw new Error(`${url} -> HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 4000 * i));
  }
}

async function mxOf(name) {
  const j = await getJson(`https://cloudflare-dns.com/dns-query?name=${name}&type=MX`, { Accept: 'application/dns-json' });
  return (j?.Answer || []).filter((a) => a.type === 15).map((a) => a.data.replace(/(\S)\.$/, '$1'));
}

export async function currentSnapshot(d) {
  const rdap = await getJson(d.rdap + d.name, { Accept: 'application/rdap+json' });
  if (!rdap) return unregisteredSnapshot();
  return snapshotFromRdap(rdap, await mxOf(d.name));
}

async function main() {
  const update = process.argv.includes('--update');
  let baseline = {};
  try { baseline = JSON.parse(await readFile(BASELINE, 'utf8')); } catch { /* first run */ }
  const now = new Date();
  const next = {};
  const reports = [];
  for (const d of DOMAINS) {
    const snap = await currentSnapshot(d);
    next[d.name] = snap;
    const changes = diffSnapshots(baseline[d.name], snap);
    if (changes.length && !update && baseline[d.name]) {
      reports.push({ domain: d.name, title: `Domain watch: ${d.name} changed`, body: renderIssue(d.name, d.note, changes, now) });
    }
    const left = d.kind === 'own' ? daysUntil(snap.expiration, now) : null;
    if (left !== null && left <= 60 && !update) {
      reports.push({ domain: d.name, title: `Domain watch: ${d.name} expires in ${left} days`, body: `${d.name} expires ${snap.expiration}. Renew it at the registrar (${snap.registrar}).` });
    }
    console.log(`${d.name}: ${snap.registered ? `ns=${snap.nameservers.join(',')} exp=${snap.expiration?.slice(0, 10)} mx=${snap.mx.join('|') || '(none)'}` : 'NOT REGISTERED'}${changes.length ? `  CHANGED: ${changes.map((c) => c.field).join(',')}` : ''}`);
  }
  if (update) {
    await writeFile(BASELINE, JSON.stringify(next, null, 2) + '\n');
    console.log('baseline updated');
  }
  await writeFile(REPORT, JSON.stringify(reports, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
