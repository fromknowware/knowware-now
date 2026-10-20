// The story diagram as a branded, looping GIF (and a matching still), rendered at
// build time. It runs the same scene code as the page (src/scripts/story-motion.ts)
// on @napi-rs/canvas and encodes with gifenc, so there is no browser in the build and
// the fonts are bundled (JetBrains Mono), not taken from the machine.
//
// The GIF is built to travel on its own: Knowware mark, the headline, the evidence
// grade and any SIMULATION or ALLEGED flag, the honest diagram caption, and the URL.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCanvas, GlobalFonts, type SKRSContext2D } from '@napi-rs/canvas';
import gifenc from 'gifenc';
import { H as SH, W as SW, LOOP_SECONDS, STATIC_PHASE, STILL_PHASE, drawFrame, sceneFor, type Palette } from '../scripts/story-motion';
import { diagramCaption } from './diagram-caption';
import { LAYER_LABEL, storyUrl, type Story } from './stories';

const { GIFEncoder, quantize, applyPalette } = gifenc;

export const GIF_WIDTH = 640;
export const GIF_HEIGHT = 616;
const FRAME_MS = 80; // 12.5 frames per second; a 12 s loop is exactly 150 frames
const SCALE = GIF_WIDTH / SW; // the 400x250 scene, drawn at 1.6x
const PAD = 28;
const HEADER = 52;
const HEADLINE = 100;
const SCENE_TOP = HEADER + HEADLINE;
const SCENE_H = SH * SCALE; // 400
const INK = '#191938';
const BG = '#EDEEE4';
const SUB = '#55554f';
const SIGNAL = '#2F55E0';
const LIGHT: Palette = { ink: INK, sub: SUB, accent: SIGNAL, rule: 'rgba(25,25,56,.2)', paper: BG };
const FONT = '"JetBrains Mono", ui-monospace, monospace';

let fontsReady = false;
function loadFonts() {
  if (fontsReady) return;
  const dir = join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files');
  for (const w of [400, 500, 700, 800]) {
    GlobalFonts.register(readFileSync(join(dir, `jetbrains-mono-latin-${w}-normal.woff`)), 'JetBrains Mono');
  }
  fontsReady = true;
}

function wrap(c: SKRSContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && c.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function pill(c: SKRSContext2D, label: string, right: number, filled: boolean): number {
  c.font = `700 11px ${FONT}`;
  const text = label.toUpperCase();
  const w = Math.ceil(c.measureText(text).width) + 20;
  const x = right - w;
  const y = (HEADER - 24) / 2;
  if (filled) {
    c.fillStyle = INK;
    c.fillRect(x, y, w, 24);
  } else {
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.strokeRect(x + 0.75, y + 0.75, w - 1.5, 22.5);
  }
  c.fillStyle = filled ? BG : INK;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.fillText(text, x + 10, y + 16);
  return x - 8;
}

/** Everything except the animated scene: Knowware mark, headline, flags, caption, URL. */
function drawChrome(c: SKRSContext2D, story: Story) {
  const d = story.data;
  c.fillStyle = BG;
  c.fillRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

  // Header: mark and name on the left, grade and flags on the right.
  c.fillStyle = INK;
  c.beginPath();
  c.arc(PAD + 7, HEADER / 2, 7, 0, Math.PI * 2);
  c.fill();
  c.font = `800 15px ${FONT}`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.fillText('KNOWWARE · STORIES', PAD + 24, HEADER / 2 + 5);
  let right = GIF_WIDTH - PAD;
  right = pill(c, `Grade ${d.grade}`, right, true);
  if (d.simulation) right = pill(c, 'Simulation', right, false);
  if (d.alleged) right = pill(c, 'Alleged', right, false);
  c.fillStyle = 'rgba(25,25,56,.2)';
  c.fillRect(0, HEADER - 1, GIF_WIDTH, 1);

  // Headline: up to three lines, shrinking one step if it needs more.
  let size = 22;
  let lines: string[] = [];
  for (const s of [22, 19, 17]) {
    size = s;
    c.font = `800 ${s}px ${FONT}`;
    lines = wrap(c, d.headline, GIF_WIDTH - PAD * 2);
    if (lines.length <= 3) break;
  }
  c.fillStyle = INK;
  const lh = Math.round(size * 1.28);
  const top = HEADER + (HEADLINE - lines.length * lh) / 2 + size * 0.85;
  lines.slice(0, 3).forEach((l, i) => c.fillText(l, PAD, top + i * lh));

  // Scene frame.
  c.strokeStyle = 'rgba(25,25,56,.2)';
  c.lineWidth = 1;
  c.strokeRect(0.5, SCENE_TOP + 0.5, GIF_WIDTH - 1, SCENE_H - 1);

  // Footer: the diagram's honest caption, the missing layer, and this story's own link, so the file
  // points back to its source wherever it is posted. The link is on every frame.
  const y1 = SCENE_TOP + SCENE_H + 22;
  c.font = `400 11px ${FONT}`;
  c.fillStyle = SUB;
  c.fillText(diagramCaption(d), PAD, y1);
  c.font = `700 12px ${FONT}`;
  c.fillStyle = INK;
  c.fillText(`Missing layer: ${LAYER_LABEL[d.missingLayer]}`, PAD, y1 + 19);
  c.fillStyle = SIGNAL;
  c.fillText(displayUrl(story), PAD, y1 + 38);
  c.textAlign = 'left';
}

/** knowware.systems/stories/<slug>: the story's page, without the scheme or trailing slash. */
export function displayUrl(story: Story): string {
  return storyUrl(story).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * A GIF comment block (the format's own metadata slot) carrying the title, link and licence, added
 * just before the trailer. Viewers ignore it, but it survives in the file, so a saved GIF still says
 * where it came from.
 */
function withComment(gif: Uint8Array, text: string): Buffer {
  const bytes = Buffer.from(text.replace(/[^\x20-\x7E]/g, ''), 'ascii');
  if (gif[gif.length - 1] !== 0x3b) throw new Error('story-gif: unexpected GIF ending');
  const parts: number[] = [0x21, 0xfe];
  for (let i = 0; i < bytes.length; i += 255) {
    const chunk = bytes.subarray(i, i + 255);
    parts.push(chunk.length, ...chunk);
  }
  parts.push(0x00);
  return Buffer.concat([Buffer.from(gif.subarray(0, gif.length - 1)), Buffer.from(parts), Buffer.from([0x3b])]);
}

function drawScene(c: SKRSContext2D, layer: SKRSContext2D, story: Story, seconds: number, phase?: number) {
  layer.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  // k = 1: the scene is laid out for a 400px-wide canvas, so its text and lines scale up with it.
  drawFrame(layer as unknown as CanvasRenderingContext2D, sceneFor(story.id), {
    k: 1, palette: LIGHT, layer: LAYER_LABEL[story.data.missingLayer], seconds, phase,
  });
  c.fillStyle = BG;
  c.fillRect(1, SCENE_TOP + 1, GIF_WIDTH - 2, SCENE_H - 2);
  c.save();
  c.beginPath();
  c.rect(1, SCENE_TOP + 1, GIF_WIDTH - 2, SCENE_H - 2);
  c.clip();
  c.drawImage(layer.canvas, 0, SCENE_TOP);
  c.restore();
}

function newCanvas() {
  loadFonts();
  const canvas = createCanvas(GIF_WIDTH, GIF_HEIGHT);
  const layer = createCanvas(GIF_WIDTH, SCENE_H).getContext('2d');
  // The bundled JetBrains Mono subsets have no arrow or approximately-equals glyph (the browser
  // falls back to a system font for them; the build has none), so draw plain equivalents.
  const fillText = layer.fillText.bind(layer);
  layer.fillText = (t: string, x: number, y: number, maxWidth?: number) =>
    fillText(t.replace(/≈/g, '~').replace(/→/g, '->'), x, y, maxWidth);
  return { canvas, c: canvas.getContext('2d'), layer };
}

const stills = new Map<string, Promise<Buffer>>();
const gifs = new Map<string, Promise<Buffer>>();

/** One pinned frame, same layout: for readers who ask for reduced motion or pause the GIF. */
export function renderStoryStill(story: Story): Promise<Buffer> {
  let p = stills.get(story.id);
  if (!p) {
    p = (async () => {
      const { canvas, c, layer } = newCanvas();
      drawChrome(c, story);
      drawScene(c, layer, story, 0, STILL_PHASE[story.id] ?? STATIC_PHASE);
      return canvas.encode('png');
    })();
    stills.set(story.id, p);
  }
  return p;
}

export function renderStoryGif(story: Story): Promise<Buffer> {
  let p = gifs.get(story.id);
  if (!p) {
    p = Promise.resolve().then(() => {
      const { c, layer } = newCanvas();
      const frames = Math.round((LOOP_SECONDS * 1000) / FRAME_MS);
      const rgba: Uint8ClampedArray[] = [];
      for (let i = 0; i < frames; i++) {
        drawChrome(c, story);
        drawScene(c, layer, story, (i * FRAME_MS) / 1000);
        rgba.push(new Uint8ClampedArray(c.getImageData(0, 0, GIF_WIDTH, GIF_HEIGHT).data));
      }

      // One shared palette from a sample of frames keeps colours steady across the loop.
      const sample = new Uint8ClampedArray(Math.ceil(frames / 10) * GIF_WIDTH * GIF_HEIGHT * 4);
      let at = 0;
      for (let i = 0; i < frames; i += 10) {
        sample.set(rgba[i], at);
        at += rgba[i].length;
      }
      const palette: number[][] = quantize(sample.subarray(0, at), 63);
      const transparent = palette.length;
      const globalPalette = [...palette, [0, 0, 0]];

      const gif = GIFEncoder();
      let prev: Uint8Array | null = null;
      for (let i = 0; i < frames; i++) {
        const index: Uint8Array = applyPalette(rgba[i], palette);
        let out = index;
        if (prev) {
          // Only pixels that changed are written; the rest are transparent, which keeps the file small.
          out = new Uint8Array(index.length);
          for (let j = 0; j < index.length; j++) out[j] = index[j] === prev[j] ? transparent : index[j];
        }
        gif.writeFrame(out, GIF_WIDTH, GIF_HEIGHT, {
          palette: i === 0 ? globalPalette : undefined,
          delay: FRAME_MS,
          repeat: 0,
          transparent: i > 0,
          transparentIndex: transparent,
          dispose: 1,
        });
        prev = index;
      }
      gif.finish();
      return withComment(
        gif.bytes(),
        `Knowware stories. ${story.data.headline}. ${storyUrl(story)} Evidence grade ${story.data.grade}. Entry text CC BY 4.0; cite the sources on the page.`,
      );
    });
    gifs.set(story.id, p);
  }
  return p;
}
