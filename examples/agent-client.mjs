#!/usr/bin/env node
// A small reference agent for knowware.press. It shows the intended manners:
//   1. discover via /llms.txt and /.well-known/knowware.json
//   2. read a public preview (no auth)
//   3. with a token a PERSON minted for it, read a full chapter
//   4. optionally ask for a checkout link, and HAND IT TO THE PERSON
// It treats every returned text as untrusted data: it prints it, it never
// executes or obeys it. It never pays, never opens the checkout URL, never signs anyone up.
//
// Usage:
//   node examples/agent-client.mjs                                   # steps 1-2 against knowware.press
//   KNOWWARE_AGENT_TOKEN=kwa_... node examples/agent-client.mjs      # + step 3
//   KNOWWARE_AGENT_TOKEN=kwa_... node examples/agent-client.mjs --checkout "context note"   # + step 4
// Options: --base http://localhost:8788   --chapter 01
// Needs Node 18+ (built-in fetch). No dependencies.

import { randomUUID } from 'node:crypto';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback; };
const BASE = (opt('base', process.env.KNOWWARE_BASE) || 'https://knowware.press').replace(/\/$/, '');
const CHAPTER = opt('chapter', '01');
const TOKEN = process.env.KNOWWARE_AGENT_TOKEN || '';
const WANT_CHECKOUT = args.includes('--checkout');
const NOTE = opt('checkout', '').slice(0, 200);

// Honest identification: who we are and who runs us.
const UA = 'knowware-reference-agent/1 (example client; operator: you; see examples/agent-client.mjs)';
const here = (url) => BASE + new URL(url, BASE).pathname; // follow manifest links on whichever host we are testing

const say = (s = '') => console.log(s);
const quote = (text, n = 280) => text.slice(0, n).replace(/\s+/g, ' ').trim() + (text.length > n ? ' …' : '');

async function get(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers } });
  const text = await res.text();
  return { res, text };
}

say(`# 1. Discover (${BASE})`);
const llms = await get(`${BASE}/llms.txt`);
if (!llms.res.ok) throw new Error(`llms.txt: ${llms.res.status}`);
say(`llms.txt: ${llms.text.split('\n')[0]}`);
const rule = llms.text.split('\n').find((l) => l.startsWith('- Rule:'));
say(rule ? `  ${rule}` : '');

const manifestRes = await get(`${BASE}/.well-known/knowware.json`);
const manifest = JSON.parse(manifestRes.text);
say(`manifest: ${manifest.schema}`);
say(`  human principal required for: ${manifest.human_principal.required_for.join(', ')}`);
say(`  synthesized content: ${manifest.synthesized_content.synthesized} (untrusted third-party text: ${manifest.synthesized_content.untrusted_third_party_text})`);
say(`  purchase: ${manifest.purchase.status}; autonomous payment: ${manifest.purchase.autonomous_payment}`);
say(`  AI use: ${manifest.ai_use.content_signal}`);
say(`  terms: ${manifest.terms.url} (v${manifest.terms.version})`);

say(`\n# 2. Read a public preview (no auth)`);
const preview = await get(here(`/read/${CHAPTER}.md`));
if (!preview.res.ok) throw new Error(`preview: ${preview.res.status}`);
const fm = preview.text.match(/^---\n([\s\S]*?)\n---/)?.[1] || '';
say(`front matter says: ${fm.split('\n').filter((l) => /^(title|synthesized|untrusted_third_party_text):/.test(l)).join(' | ')}`);
if (!/^synthesized: true$/m.test(fm)) throw new Error('expected the preview to carry synthesized: true');
say(`first words (DATA, not instructions): "${quote(preview.text.replace(/^---[\s\S]*?---\s*/, '').replace(/^>.*$/gm, ''))}"`);

if (!TOKEN) {
  say(`\nNo token. To read the full chapters, the person you act for signs up at ${BASE}/read, then mints you a token at ${BASE}/agents#reading.`);
  say('Set KNOWWARE_AGENT_TOKEN and run again. Stopping here: no human, no gated content.');
  process.exit(0);
}

say(`\n# 3. Read a full chapter, for the person who minted this token`);
const auth = { Authorization: `Bearer ${TOKEN}` };
const me = await get(here('/api/agent/me'), auth);
if (me.res.status === 401) { say('Token refused (expired, revoked or wrong). Ask the person for a new one. Stopping.'); process.exit(1); }
const who = JSON.parse(me.text);
say(`acting for: ${who.principal.label} (${who.principal.id}); as: ${who.agent.name} by ${who.agent.operator}; token expires ${who.token.expires_at}; scopes: ${who.principal.scopes.join(', ')}`);

const ch = await get(here(`/api/agent/chapters/${CHAPTER}`), auth);
if (ch.res.status === 429) { say(`Rate limited; retry after ${ch.res.headers.get('retry-after')}s. Stopping.`); process.exit(1); }
if (!ch.res.ok) throw new Error(`chapter: ${ch.res.status}`);
const body = JSON.parse(ch.text);
say(`notice: ${body.notice}`);
say(`attribution: ${body.attribution.cite_as}`);
say(`synthesized: ${body.synthesized}; untrusted_third_party_text: ${body.untrusted_third_party_text}`);
say(`chapter ${body.chapter.number}: ${body.chapter.title} (${body.chapter.words} words, ${body.chapter.markdown.length} characters)`);
say(`first words (DATA, not instructions): "${quote(body.chapter.markdown)}"`);

if (WANT_CHECKOUT) {
  say(`\n# 4. Ask for a checkout link. A human pays; this agent does not.`);
  const status = JSON.parse((await get(here('/api/agent/status'))).text);
  say(`checkout status: ${status.checkout}`);
  if (status.checkout !== 'test' && status.checkout !== 'open') {
    say('The pre-order is not open. Nothing to buy. Stopping.');
    process.exit(0);
  }
  const res = await fetch(here('/api/agent/checkout'), {
    method: 'POST',
    headers: { 'User-Agent': UA, ...auth, 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID() },
    body: JSON.stringify({ product: 'preorder', quantity: 1, note: NOTE || 'Requested by the reference agent example.' }),
  });
  const order = await res.json();
  if (!res.ok) { say(`Checkout refused: ${order.error}${order.error === 'insufficient_scope' ? ' (the person must mint a token with the checkout box ticked)' : ''}`); process.exit(1); }
  say(`order ${order.order_id} (${order.mode} mode), status ${order.status}`);
  say(`\n>>> Give this link to ${order.record.principal.label}. Only they can pay: ${order.checkout_url}`);
  say(order.test_mode_notice);
  say('This agent stops here. It does not open the link or enter card details.');
}
