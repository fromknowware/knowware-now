// usage: node graph-tap.mjs <base> <device> <out.jpg>  — open GRAPH, tap nodes by touch, report strip state, screenshot
import { createRequire } from 'node:module';
import { DEVICES } from '../../../scripts/mobile-check.mjs';
const require = createRequire(import.meta.url.replace('drafts/mobile/tools/graph-tap.mjs', 'scripts/x.mjs'));
const puppeteer = require('puppeteer-core');
const [base, dev, out] = process.argv.slice(2);
const d = DEVICES[dev];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
await p.setViewport({ width: d.w, height: d.h, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
await p.goto(base + '/the-81', { waitUntil: 'networkidle2' });
await p.evaluate(() => document.getElementById('btn-graph').click());
await new Promise(r => setTimeout(r, 3500));
await p.evaluate(() => document.getElementById('graph-canvas').scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 300));
const box = await p.evaluate(() => { const r = document.getElementById('graph-canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, vh: innerHeight }; });
console.log('canvas', JSON.stringify(box));
let tapped = 0, picked = [];
for (let gy = 0.1; gy < 0.9 && picked.length < 2; gy += 0.07) for (let gx = 0.1; gx < 0.9 && picked.length < 2; gx += 0.07) {
  const y = box.y + box.h * gy; if (y > box.vh - 10 || y < 10) continue;
  await p.touchscreen.tap(box.x + box.w * gx, y); tapped++;
  const st = await p.evaluate(() => { const s = document.getElementById('graph-strip'); return s.hidden ? null : document.getElementById('graph-strip-name').textContent + '|' + document.getElementById('graph-sel-count').textContent; });
  if (st && !picked.includes(st)) picked.push(st);
}
console.log('taps', tapped, 'picked', JSON.stringify(picked));
await p.screenshot({ path: out, type: 'jpeg', quality: 60 });
// page must still scroll when a swipe starts on the canvas
const y0 = await p.evaluate(() => scrollY);
await p.touchscreen.touchStart(box.x + box.w / 2, Math.min(box.y + 300, box.vh - 100));
await p.touchscreen.touchMove(box.x + box.w / 2, Math.min(box.y + 300, box.vh - 100) - 150);
await p.touchscreen.touchEnd();
await new Promise(r => setTimeout(r, 400));
console.log('scroll moved by swipe on canvas:', (await p.evaluate(() => scrollY)) - y0);
await b.close();
