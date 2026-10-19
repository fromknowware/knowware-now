// Per-story social card (1200x630 PNG), rendered at build time with satori
// (layout to SVG, fonts embedded as paths) and resvg (SVG to PNG). Nothing
// depends on system fonts, so the card looks the same on every machine.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { LAYER_LABEL, eventLine, type Story } from './stories';

const W = 1200;
const H = 630;
const INK = '#191938';
const BG = '#EDEEE4';
const SUB = '#55554f';
const SIGNAL = '#2F55E0';

const fontDir = join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files');
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700 | 800; style: 'normal' }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    ([400, 700, 800] as const).map(async (weight) => ({
      name: 'JetBrains Mono',
      data: await readFile(join(fontDir, `jetbrains-mono-latin-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, ...(children === undefined ? {} : { children }) },
});

function pill(label: string, filled: boolean): Node {
  return el('div', {
    padding: '8px 14px', fontSize: 20, fontWeight: 700, letterSpacing: 3,
    border: `2px solid ${INK}`, background: filled ? INK : 'transparent', color: filled ? BG : INK,
  }, label);
}

export async function renderStoryCard(story: Story): Promise<Uint8Array> {
  const d = story.data;
  const len = d.headline.length;
  const headlineSize = len > 95 ? 44 : len > 70 ? 50 : 58;

  const badges = [pill(`GRADE ${d.grade}`, true)];
  if (d.simulation) badges.push(pill('SIMULATION', false));
  if (d.alleged) badges.push(pill('ALLEGED', false));

  const tree = el('div', { boxSizing: 'border-box', width: W, height: H, flexDirection: 'column', background: BG, color: INK, padding: '48px 56px', fontFamily: 'JetBrains Mono' }, [
    el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
      el('div', { alignItems: 'center', fontSize: 24, fontWeight: 800, letterSpacing: 5 }, [
        el('div', { width: 16, height: 16, borderRadius: 8, background: INK, marginRight: 14 }),
        'KNOWWARE · STORIES',
      ]),
      el('div', { gap: 10 }, badges),
    ]),
    el('div', { flex: 1, alignItems: 'center', fontSize: headlineSize, fontWeight: 800, lineHeight: 1.18, letterSpacing: -1, paddingTop: 12 }, d.headline),
    el('div', { borderTop: `3px solid ${INK}`, paddingTop: 22, justifyContent: 'space-between', alignItems: 'flex-end' }, [
      el('div', { flexDirection: 'column' }, [
        el('div', { fontSize: 18, fontWeight: 400, letterSpacing: 4, color: SUB }, 'MISSING LAYER'),
        el('div', { fontSize: 38, fontWeight: 700, color: SIGNAL, marginTop: 6 }, LAYER_LABEL[d.missingLayer]),
      ]),
      el('div', { flexDirection: 'column', alignItems: 'flex-end', fontSize: 20, color: SUB }, [
        el('div', {}, eventLine(story).slice(0, 60)),
        el('div', { color: INK, fontWeight: 700, marginTop: 6 }, 'knowware.systems/stories'),
      ]),
    ]),
  ]);

  const svg = await satori(tree as never, { width: W, height: H, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}

/** The card for the /stories index, so pasting that link unfurls with the Knowware mark too. */
export async function renderIndexCard(count: number): Promise<Uint8Array> {
  const tree = el('div', { boxSizing: 'border-box', width: W, height: H, flexDirection: 'column', background: BG, color: INK, padding: '48px 56px', fontFamily: 'JetBrains Mono' }, [
    el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
      el('div', { alignItems: 'center', fontSize: 24, fontWeight: 800, letterSpacing: 5 }, [
        el('div', { width: 16, height: 16, borderRadius: 8, background: INK, marginRight: 14 }),
        'KNOWWARE · STORIES',
      ]),
      el('div', { gap: 10 }, [pill(`${count} CITED ${count === 1 ? 'STORY' : 'STORIES'}`, true)]),
    ]),
    el('div', { flex: 1, flexDirection: 'column', justifyContent: 'center' }, [
      el('div', { fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }, 'Coordination without knowing'),
      el('div', { fontSize: 28, fontWeight: 400, lineHeight: 1.35, color: SUB, marginTop: 22, maxWidth: 980 },
        'Real cases where systems acted at speed and nobody held the knowing. Cited, graded, newest event first.'),
    ]),
    el('div', { borderTop: `3px solid ${INK}`, paddingTop: 22, justifyContent: 'space-between', alignItems: 'flex-end' }, [
      el('div', { flexDirection: 'column' }, [
        el('div', { fontSize: 18, fontWeight: 400, letterSpacing: 4, color: SUB }, 'EVERY ENTRY NAMES THE MISSING LAYER'),
        el('div', { fontSize: 28, fontWeight: 700, color: SIGNAL, marginTop: 6 }, 'Knowing · Context · Accountability · Meaning'),
      ]),
      el('div', { fontSize: 20, fontWeight: 700, color: INK }, 'knowware.systems/stories'),
    ]),
  ]);

  const svg = await satori(tree as never, { width: W, height: H, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
