// usage: BASE=http://localhost:8799 node probe.mjs <url> <width> <height> '<js expression string>'
// Evaluates an expression in an emulated phone viewport (DPR 2) and prints the JSON result.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url.replace('drafts/mobile/tools/probe.mjs', 'scripts/x.mjs'));
const puppeteer = require('puppeteer-core');
const [url, w, h, expr] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto((process.env.BASE || 'http://localhost:8799') + url, { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 600));
console.log(JSON.stringify(await p.evaluate(expr), null, 1));
await b.close();
