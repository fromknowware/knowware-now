// usage: node shot.mjs <base> <url> <device> <out.jpg> [js-to-run-before] [wait-ms] [--full] [--theme=dark]
import { createRequire } from 'node:module';
import { DEVICES } from '../../../scripts/mobile-check.mjs';
const require = createRequire(import.meta.url.replace('drafts/mobile/tools/shot.mjs', 'scripts/x.mjs'));
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const [base, url, dev, out, js, wait] = args.filter((a) => !a.startsWith('--'));
const UA = { iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1', android: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36', ipad: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' };
const d = DEVICES[dev];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
const p = await b.newPage();
await p.setUserAgent(UA[d.ua]);
await p.setViewport({ width: d.w, height: d.h, deviceScaleFactor: flags.includes('--hi') ? d.dpr : 1.5, isMobile: true, hasTouch: true, isLandscape: !!d.landscape });
const th = flags.find((f) => f.startsWith('--theme='));
if (th) await p.evaluateOnNewDocument((t) => { try { localStorage.setItem('kw-theme', t); } catch {} }, th.split('=')[1]);
await p.goto(base + url, { waitUntil: 'networkidle2', timeout: 180000 });
await new Promise((r) => setTimeout(r, 500));
if (js) { const r = await p.evaluate(js); if (r !== undefined) console.log(JSON.stringify(r)); }
await new Promise((r) => setTimeout(r, +(wait || 700)));
await p.screenshot({ path: out, type: 'jpeg', quality: 60, fullPage: flags.includes('--full') });
await b.close();
