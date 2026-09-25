/**
 * Extract content collection files from the legacy JSX data sources.
 *
 * Generates:
 *   src/content/chapters/01.md … 09.md   (from knowware-v2/teasers.jsx + pages.jsx CAST)
 *   src/content/voices/01.json … 81.json  (from knowware-v2/voices.jsx + pages.jsx CAST)
 *
 * Usage: node scripts/extract-content.mjs
 */

import { createContext, Script } from 'vm';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function evalJsFile(filePath) {
  const code = readFileSync(filePath, 'utf8');
  const ctx = { window: {} };
  createContext(ctx);
  new Script(code).runInContext(ctx);
  return ctx.window;
}

// ── Load source data ────────────────────────────────────────────────────────

const { TEASERS } = evalJsFile(join(root, 'knowware-v2/teasers.jsx'));
const { VOICES }  = evalJsFile(join(root, 'knowware-v2/voices.jsx'));

// CAST is embedded in React JSX — extract with regex rather than eval
const pagesSource = readFileSync(join(root, 'knowware-v2/pages.jsx'), 'utf8');
const castMatch = pagesSource.match(/const CAST = (\[[\s\S]*?\]);\s*\n/);
if (!castMatch) throw new Error('Could not find CAST array in pages.jsx');
const CAST = Function('"use strict"; return ' + castMatch[1])();

// Chapter titles come from CAST
const CHAPTER_TITLES = Object.fromEntries(CAST.map(c => [String(c.n), c.t]));

// Build a voice-id → chapter+metadata map from CAST
const CAST_META = {};
for (const ch of CAST) {
  for (const v of ch.voices) {
    CAST_META[v.i] = {
      chapter: ch.n,
      tier: v.tri,
      status: v.s,
      tag: v.tg,
      flag: v.f,
      role: v.r,
    };
  }
}

// ── Ensure output directories exist ─────────────────────────────────────────

const chaptersDir = join(root, 'src/content/chapters');
const voicesDir   = join(root, 'src/content/voices');
mkdirSync(chaptersDir, { recursive: true });
mkdirSync(voicesDir,   { recursive: true });

// ── Write chapter .md files ──────────────────────────────────────────────────

for (const [key, teaser] of Object.entries(TEASERS)) {
  if (key === 'X') continue; // epilogue — not a numbered chapter
  const n = parseInt(key, 10);
  const slug = key; // "01", "02", …
  const title = CHAPTER_TITLES[String(n)] ?? '';

  const frontmatter = {
    n,
    title,
    opener: teaser.opener,
    ...(teaser.diagram ? { diagram: teaser.diagram } : {}),
  };

  const body = teaser.paras.map(p => `${p}`).join('\n\n');

  const md = [
    '---',
    `n: ${frontmatter.n}`,
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `opener: "${frontmatter.opener.replace(/"/g, '\\"')}"`,
    ...(frontmatter.diagram ? [
      'diagram:',
      `  title: "${frontmatter.diagram.title.replace(/"/g, '\\"')}"`,
      `  caption: "${frontmatter.diagram.caption.replace(/"/g, '\\"')}"`,
      '  nodes:',
      ...frontmatter.diagram.nodes.map(nd => [
        `    - id: "${nd.id}"`,
        `      label: "${nd.label.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
        `      pos: [${nd.pos.join(', ')}]`,
        ...(nd.latent ? ['      latent: true'] : []),
      ].join('\n')),
      '  arcs:',
      ...frontmatter.diagram.arcs.map(arc => [
        `    - from: "${arc.from}"`,
        `      to: "${arc.to}"`,
        ...(arc.label ? [`      label: "${arc.label.replace(/"/g, '\\"')}"`] : []),
        ...(arc.kind  ? [`      kind: "${arc.kind}"`] : []),
      ].join('\n')),
    ] : []),
    '---',
    '',
    body,
    '',
  ].join('\n');

  writeFileSync(join(chaptersDir, `${slug}.md`), md);
  console.log(`✓ chapters/${slug}.md`);
}

// ── Write voice .json files ───────────────────────────────────────────────────

for (const voice of VOICES) {
  // Find id by matching name
  const castEntry = Object.entries(CAST_META).find(([, m]) => {
    // match by reconstructing — CAST meta has role, VOICES has name
    // We match positionally: VOICES is ordered by id 01..81
    return false; // replaced below
  });

  // VOICES array is in the same order as CAST (01-81)
  const voiceIdx = VOICES.indexOf(voice);
  const id = String(voiceIdx + 1).padStart(2, '0');
  const meta = CAST_META[id];
  if (!meta) {
    console.warn(`⚠ No CAST meta for voice index ${id} (${voice.name})`);
    continue;
  }

  const json = {
    id,
    name: voice.name,
    alias: voice.alias ?? '',
    chapter: meta.chapter,
    tier: meta.tier,
    status: meta.status,
    ...(meta.tag  ? { tag: meta.tag }   : {}),
    flag: meta.flag,
    affiliation: voice.affiliation ?? '',
    active: voice.active ?? '',
    jurisdiction: voice.jurisdiction ?? '',
    role: meta.role,
    awards: voice.awards ?? [],
    works: voice.works ?? [],
    knownFor: voice.knownFor ?? [],
    coldOpen: voice.coldOpen ?? '',
    bio: voice.bio ?? '',
    whyMatters: voice.whyMatters ?? '',
  };

  writeFileSync(join(voicesDir, `${id}.json`), JSON.stringify(json, null, 2));
  console.log(`✓ voices/${id}.json  ${voice.name}`);
}

console.log('\nDone. Content collections populated.');
