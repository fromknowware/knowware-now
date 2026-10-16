#!/usr/bin/env node
// Invariants that must hold for every build. Run after `npm run build` (CI does).
// Each check states the rule it protects; a failure prints which rule broke.
//   node scripts/verify-build.mjs
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = join(root, 'dist');
const failures = [];
const passes = [];
const check = (rule, ok, detail = '') => (ok ? passes.push(rule) : failures.push(`${rule}${detail ? `: ${detail}` : ''}`));

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('._')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}
const read = (p) => readFileSync(p, 'utf8');
if (!existsSync(dist)) { console.error('dist/ not found: run `npm run build` first'); process.exit(2); }
const files = walk(dist);
const html = files.filter((f) => f.endsWith('.html'));
const text = files.filter((f) => /\.(html|md|txt|json|xml|js|css|webmanifest)$/.test(f));

// 1. The full chapters never ship as static files.
check('no dist/gated directory', !existsSync(join(dist, 'gated')));
check('no static /read/<slug>/full pages', !files.some((f) => /[\\/]read[\\/](0[1-9]|x)[\\/]full[\\/]/.test(f)));
const gatedPath = join(root, 'lib/generated/chapters-md.js');
check('gated Markdown module generated', existsSync(gatedPath));
if (existsSync(gatedPath)) {
  const chapters = (await import(pathToFileURL(gatedPath).href)).default;
  const slugs = Object.keys(chapters);
  check('ten chapters in the gated module', slugs.length === 10, `found ${slugs.length}`);
  const corpus = text.map((f) => read(f)).join('\n');
  for (const slug of slugs) {
    // A sentence from ~65% through the chapter: past the free preview, so it must not be anywhere public.
    const md = chapters[slug].markdown;
    const sentences = md.slice(Math.floor(md.length * 0.65)).split(/(?<=[.!?])\s+/).filter((s) => s.length > 90 && !/[<>`|]/.test(s));
    const probe = sentences[0] ? sentences[0].slice(0, 80) : '';
    check(`chapter ${slug}: a late sentence is not in any public file`, probe.length > 0 && !corpus.includes(probe), probe ? '' : 'could not pick a probe');
  }
}

// 2. No secrets or live-looking credentials in anything public.
const secretRe = /(sk_live_|sk_test_[A-Za-z0-9]{8}|rk_live_|rk_test_[A-Za-z0-9]{8}|whsec_[A-Za-z0-9]{8}|kwa_[A-Za-z0-9_-]{20}|-----BEGIN [A-Z ]*PRIVATE KEY)/;
const leaked = text.filter((f) => secretRe.test(read(f))).map((f) => relative(dist, f));
check('no secret-shaped strings in dist', leaked.length === 0, leaked.join(', '));

// 3. CSP covers every inline script, on static pages and on the gated pages served by a function.
const headers = read(join(dist, '_headers'));
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const allowed = new Set([...csp.matchAll(/'(sha256-[^']+)'/g)].map((m) => m[1]));
const inline = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const hashOf = (body) => `sha256-${createHash('sha256').update(body).digest('base64')}`;
const uncovered = [];
for (const f of html) for (const [, attrs, body] of read(f).matchAll(inline)) {
  if (/application\/(ld\+)?json/i.test(attrs) || !body.trim()) continue;
  if (!allowed.has(hashOf(body))) uncovered.push(relative(dist, f));
}
check('CSP script-src has a hash for every inline script (static pages)', uncovered.length === 0, [...new Set(uncovered)].join(', '));
check("CSP forbids 'unsafe-inline' and 'unsafe-eval' for scripts", !/script-src[^;]*'unsafe-(inline|eval)'/.test(csp));
check("CSP has frame-ancestors 'none' and object-src 'none'", /frame-ancestors 'none'/.test(csp) && /object-src 'none'/.test(csp));
const fullPath = join(root, 'lib/generated/full-chapters.js');
if (existsSync(fullPath)) {
  const full = (await import(pathToFileURL(fullPath).href)).default;
  const bad = [];
  for (const [slug, page] of Object.entries(full)) for (const [, attrs, body] of page.matchAll(inline)) {
    if (/application\/(ld\+)?json/i.test(attrs) || !body.trim()) continue;
    if (!allowed.has(hashOf(body))) bad.push(slug);
  }
  check('CSP covers inline scripts on the gated chapter pages', bad.length === 0, bad.join(', '));
}

// 4. The synthesis disclosure travels with every Markdown file that can hold voices.
const md = files.filter((f) => f.endsWith('.md'));
check('Markdown files exist', md.length > 20, `found ${md.length}`);
const noFront = md.filter((f) => !/^---\n[\s\S]*?\nsynthesized: (true|false)\n/.test(read(f))).map((f) => relative(dist, f));
check('every Markdown file declares synthesized: true|false in its front matter', noFront.length === 0, noFront.join(', '));
const previews = md.filter((f) => /[\\/]read[\\/](0[1-9]|x)\.md$/.test(f));
check('ten chapter previews', previews.length === 10, `found ${previews.length}`);
const weak = previews.filter((f) => { const s = read(f); return !/synthesized: true/.test(s) || !/disclosure: "Synthesized for Knowware/.test(s) || !/untrusted_third_party_text: true/.test(s) || !/Synthesized text\./.test(s); }).map((f) => relative(dist, f));
check('every chapter preview carries the disclosure, the untrusted flag and the visible notice', weak.length === 0, weak.join(', '));
for (const name of ['index.md', 'method.md', 'rules.md', 'read.md']) {
  const p = join(dist, name);
  check(`${name} (may quote voices) carries the disclosure`, existsSync(p) && /synthesized: true/.test(read(p)) && /Not a quote/.test(read(p)));
}
check('llms-full.txt carries the disclosure near the top', /Not a quote/.test(read(join(dist, 'llms-full.txt')).slice(0, 1200)));

// 5. Every site link in llms.txt, llms-full.txt and the manifest points at something that exists.
const exists = (urlPath) => { const p = urlPath.split('#')[0].split('?')[0]; if (!p || p === '/') return true; const base = join(dist, p); return [base, join(base, 'index.html')].some((c) => existsSync(c) && statSync(c).isFile()); };
const runtime = /^\/(api|mcp)(\/|$)/;
const dead = new Set();
for (const name of ['llms.txt', 'agents.txt']) {
  for (const m of read(join(dist, name)).matchAll(/https:\/\/knowware\.press(\/[^\s)>"']*)/g)) {
    const p = m[1].replace(/[.,;]+$/, '').replace(/\{[^}]*\}.*/, '');
    if (!runtime.test(p) && !exists(p)) dead.add(`${name}: ${p}`);
  }
}
const manifest = JSON.parse(read(join(dist, '.well-known/knowware.json')));
for (const m of JSON.stringify(manifest).matchAll(/https:\/\/knowware\.press(\/[^"\s)]*)/g)) {
  const p = m[1].replace(/\{[^}]*\}.*/, '');
  if (!runtime.test(p) && !exists(p)) dead.add(`manifest: ${p}`);
}
check('no dead links in llms.txt, agents.txt or the manifest', dead.size === 0, [...dead].join('; '));

// 6. Nothing says "for sale" while checkout is off.
const checkoutOpen = /CHECKOUT_OPEN\s*=\s*true/.test(read(join(root, 'src/config.ts')));
const jsonLd = html.flatMap((f) => [...read(f).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]));
const hasOffer = jsonLd.some((j) => /"@type":"Offer"/.test(j));
check('no schema.org Offer while CHECKOUT_OPEN is false', checkoutOpen || !hasOffer);
check('manifest purchase status matches CHECKOUT_OPEN', manifest.purchase.status === (checkoutOpen ? 'open' : 'not_open'));
check('llms.txt does not claim the pre-order is open while it is not', checkoutOpen || /not open yet/.test(read(join(dist, 'llms.txt'))));

// 7. Policy and discovery files.
const robots = read(join(dist, 'robots.txt'));
check('robots.txt states ai-train=no', /Content-Signal:[^\n]*ai-train=no/.test(robots));
check('robots.txt keeps /api/ disallowed and the agent API allowed', /Disallow: \/api\//.test(robots) && /Allow: \/api\/agent\//.test(robots));
const sitemaps = files.filter((f) => /sitemap.*\.xml$/.test(f)).map(read).join('\n');
check('sitemap lists /agents and no gated /full pages', /knowware\.press\/agents\//.test(sitemaps) && !/\/read\/[0-9x]+\/full/.test(sitemaps));
check('/.well-known/security.txt is present', existsSync(join(dist, '.well-known/security.txt')));

// 8. Source rules for the server code (no build needed).
const src = (p) => read(join(root, p));
const serverFiles = [...walk(join(root, 'functions')), ...walk(join(root, 'lib/server'))].filter((f) => f.endsWith('.js'));
const logs = serverFiles.flatMap((f) => [...read(f).matchAll(/console\.(log|error|warn|info)\(([^)]*)\)/g)].map((m) => ({ f: relative(root, f), args: m[2] })));
// Method, path and the error CLASS are fine to log; anything else that smells of a request or a credential is not.
const scrub = (a) => a.replace(/request\.method/g, '').replace(/new URL\(request\.url/g, '').replace(/err\?\.name/g, '');
const leaky = logs.filter((l) => /(request|headers|Authorization|token|body|payload|SECRET|KEY|env\.)/i.test(scrub(l.args)));
check('no console call in server code logs requests, headers, tokens, bodies or keys', leaky.length === 0, leaky.map((l) => `${l.f}: ${l.args}`).join(' | '));
check('x402 is Base Sepolia only (no mainnet chain id)', /NETWORK = 'eip155:84532'/.test(src('lib/server/x402.js')) && !/eip155:8453['"]/.test(src('lib/server/x402.js')));
check('Stripe key check refuses live keys', /TEST_KEY_RE = \/\^\(sk\|rk\)_test_/.test(src('lib/server/stripe.js')) && !/sk_live/.test(src('lib/server/stripe.js')));
for (const d of ['agent', 'admin', 'stripe']) check(`functions/api/${d} has the shield middleware`, existsSync(join(root, `functions/api/${d}/_middleware.js`)));
check('/mcp is wrapped by the shield', /guard\(handle\)/.test(src('functions/mcp.js')));
const cors = serverFiles.filter((f) => /Access-Control-Allow-Origin/i.test(read(f))).map((f) => relative(root, f));
check('no server code sets CORS headers', cors.length === 0, cors.join(', '));
check('agent token lookups use constant-time comparison', /timingSafeEqualHex\(record\.keyHash, keyHash\)/.test(src('lib/server/agent.js')));
check('agent tokens are stored only as hashes', /`agent:\$\{keyHash\}`/.test(src('lib/server/agent.js')) && !/put\(`agent:\$\{token/.test(src('lib/server/agent.js')));

console.log(`${passes.length} invariants hold`);
if (failures.length) {
  console.error(`\n${failures.length} BROKEN:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
