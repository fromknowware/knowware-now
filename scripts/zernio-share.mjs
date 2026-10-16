#!/usr/bin/env node
/**
 * zernio-share.mjs: send one published story to Zernio (zernio.com), the
 * social posting API, so it can go out on the author's connected accounts.
 *
 * Publishing stays human-approved:
 *   - Only stories already live on the site can be sent. The share text is
 *     read from <base>/stories/share.json, which is generated from the merged
 *     stories collection.
 *   - Nothing is sent without --send. Without it the script prints the exact
 *     request and exits.
 *   - --send alone saves a DRAFT in Zernio (no schedule, no publishNow), so a
 *     person approves it in the Zernio dashboard. --at schedules it; --now
 *     publishes immediately.
 *
 * Usage (Node 18+, no dependencies):
 *   node scripts/zernio-share.mjs --list-accounts
 *   node scripts/zernio-share.mjs <slug> --platforms linkedin,twitter            # dry run
 *   node scripts/zernio-share.mjs <slug> --platforms linkedin --send             # draft in Zernio
 *   node scripts/zernio-share.mjs <slug> --platforms linkedin --send --at 2026-10-20T09:00:00 --tz America/Denver
 *   node scripts/zernio-share.mjs <slug> --platforms linkedin --send --now
 *
 * Options:
 *   --base <url>        site to read share.json from (default https://knowware.press)
 *   --platforms a,b     platform names exactly as Zernio reports them (see --list-accounts)
 *   --account-id <id>   pick one account when a platform has more than one connected
 *
 * Environment:
 *   ZERNIO_API_KEY      required for --list-accounts and --send (a key starting sk_)
 */

const API = 'https://zernio.com/api/v1';

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const key = a.slice(2);
    if (['send', 'now', 'list-accounts'].includes(key)) out[key] = true;
    else out[key] = argv[++i];
  }
  return out;
}

function fail(msg) {
  console.error(`zernio-share: ${msg}`);
  process.exit(1);
}

async function zernio(path, init = {}) {
  const key = process.env.ZERNIO_API_KEY;
  if (!key) fail('ZERNIO_API_KEY is not set.');
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(20000),
  });
  const body = await res.text();
  let json;
  try { json = JSON.parse(body); } catch { json = { raw: body }; }
  if (!res.ok) fail(`Zernio ${init.method ?? 'GET'} ${path} returned ${res.status}: ${body.slice(0, 400)}`);
  return json;
}

const args = parseArgs(process.argv.slice(2));

if (args['list-accounts']) {
  const { accounts = [] } = await zernio('/accounts');
  for (const a of accounts) console.log(`${a.platform}\t${a._id}\t${a.username ?? ''}\t${a.isActive === false ? 'inactive' : 'active'}`);
  process.exit(0);
}

const slug = args._[0];
if (!slug) fail('give a story slug, or use --list-accounts. See the header of this file.');
if (!args.platforms) fail('--platforms is required (for example --platforms linkedin).');
if (args.now && args.at) fail('use --now or --at, not both.');
if (args.at && !args.tz) fail('--at needs --tz (for example --tz America/Denver).');

const base = (args.base ?? 'https://knowware.press').replace(/\/$/, '');
const shareRes = await fetch(`${base}/stories/share.json`, { signal: AbortSignal.timeout(20000) });
if (!shareRes.ok) fail(`could not read ${base}/stories/share.json (${shareRes.status}). Is the story merged and deployed?`);
const story = (await shareRes.json()).find((s) => s.slug === slug);
if (!story) fail(`"${slug}" is not a published story at ${base}.`);

const wanted = args.platforms.split(',').map((p) => p.trim()).filter(Boolean);
let platforms;
if (args.send || process.env.ZERNIO_API_KEY) {
  const { accounts = [] } = await zernio('/accounts');
  platforms = wanted.map((platform) => {
    const matches = accounts.filter((a) => a.platform === platform && a.isActive !== false);
    const chosen = args['account-id'] ? matches.find((a) => a._id === args['account-id']) : matches.length === 1 ? matches[0] : undefined;
    if (!chosen) fail(matches.length === 0
      ? `no active ${platform} account connected in Zernio.`
      : `${matches.length} ${platform} accounts connected; pass --account-id. Run --list-accounts.`);
    return { platform, accountId: chosen._id };
  });
} else {
  platforms = wanted.map((platform) => ({ platform, accountId: '<resolved from Zernio when ZERNIO_API_KEY is set>' }));
}

const payload = { content: story.text, platforms };
let mode = 'draft';
if (args.now) { payload.publishNow = true; mode = 'publish now'; }
else if (args.at) { payload.scheduledFor = args.at; payload.timezone = args.tz; mode = `scheduled for ${args.at} ${args.tz}`; }

console.log(`Story:   ${story.headline} (grade ${story.grade})`);
console.log(`Mode:    ${mode}`);
console.log(`Request: POST ${API}/posts`);
console.log(JSON.stringify(payload, null, 2));

if (!args.send) {
  console.log('\nDry run. Nothing was sent. Add --send to create it in Zernio.');
  process.exit(0);
}

// Same story + same accounts + same mode is the same request, so a retry cannot double-post.
const requestId = `knowware-${slug}-${mode.replace(/\W+/g, '-')}-${platforms.map((p) => p.accountId).join('-')}`.slice(0, 120);
const created = await zernio('/posts', { method: 'POST', body: JSON.stringify(payload), headers: { 'x-request-id': requestId } });
console.log(`\nZernio: ${created.message ?? 'created'}. Post id ${created.post?._id ?? '(none returned)'}; status ${created.post?.status ?? 'unknown'}.`);
if (mode === 'draft') console.log('It is a draft. Review and approve it in the Zernio dashboard.');
