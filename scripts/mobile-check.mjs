#!/usr/bin/env node
// Mobile regression check — developer tool, not part of the site build.
//
// Loads each page under TRUE device emulation (CDP Emulation.setDeviceMetricsOverride
// through puppeteer-core, system Chrome, no browser download) and fails when:
//   1. the page overflows horizontally (measured with the html/body overflow-x:hidden
//      safety net temporarily removed, so hidden overflow is not mistaken for none);
//   2. an interactive element is smaller than 44x44 CSS px (inline links in running
//      text are listed as warnings, not failures);
//   3. axe-core reports a violation (light, dark and warm themes);
//   4. text smaller than 12px is rendered (warning only);
//   5. the fixed dock bar covers the last content at the bottom of the page.
//
//   npm run mobile-check -- --pages /,/the-81      (see docs/mobile-check.md)
//   node scripts/mobile-check.mjs --base http://localhost:8799 --pages /,/the-81 --devices iphone-se,iphone-14
//
// Needs: `npm install --no-save puppeteer-core`, the site served (wrangler pages dev dist --port 8799
// --kv CLAIMS), and Google Chrome at /Applications/Google Chrome.app (or CHROME_PATH).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

export const DEVICES = {
  'iphone-se-1':  { w: 320, h: 568, dpr: 2, ua: 'iphone', label: 'iPhone SE (1st gen) 320x568' },
  'iphone-se':    { w: 375, h: 667, dpr: 2, ua: 'iphone', label: 'iPhone SE 375x667' },
  'android-s':    { w: 360, h: 800, dpr: 3, ua: 'android', label: 'Small Android 360x800' },
  'iphone-14':    { w: 390, h: 844, dpr: 3, ua: 'iphone', label: 'iPhone 14 390x844' },
  'phone-large':  { w: 430, h: 932, dpr: 3, ua: 'iphone', label: 'Large phone 430x932' },
  'landscape':    { w: 844, h: 390, dpr: 3, ua: 'iphone', label: 'Landscape 844x390', landscape: true },
  'tablet':       { w: 768, h: 1024, dpr: 2, ua: 'ipad', label: 'Tablet 768x1024' },
};
const UA = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
};
// Standard run: the five phone widths the audit cares about, plus landscape and tablet.
const DEFAULT_DEVICES = ['iphone-se-1', 'android-s', 'iphone-se', 'iphone-14', 'phone-large', 'landscape', 'tablet'];

export const PAGES = [
  '/', '/the-81', '/voices/01', '/voices/42', '/voices/81',
  '/read', '/read/01', '/read/x', '/read/01/full',
  '/method', '/definition', '/stories', '/stories/knight-capital-2012',
  '/stories/anthropic-agentic-misalignment-simulation',
  '/contribute', '/order', '/rules', '/colophon', '/agents', '/this-page-does-not-exist',
];

function parseArgs(argv) {
  const o = { base: 'http://localhost:8799', pages: null, devices: null, themes: ['light', 'dark', 'warm'],
    axe: true, axeAll: false, shots: null, json: null, noFail: false, sliceH: 1400, verbose: false, scrollDock: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const v = () => argv[++i];
    if (a === '--base') o.base = v();
    else if (a === '--pages') o.pages = v().split(',');
    else if (a === '--devices') o.devices = v().split(',');
    else if (a === '--themes') o.themes = v().split(',');
    else if (a === '--no-axe') o.axe = false;
    else if (a === '--axe-all') o.axeAll = true;
    else if (a === '--shots') o.shots = v();
    else if (a === '--json') o.json = v();
    else if (a === '--no-fail') o.noFail = true;
    else if (a === '--slice') o.sliceH = Number(v());
    else if (a === '--verbose' || a === '-v') o.verbose = true;
    else if (a === '--help' || a === '-h') { console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 22).join('\n')); process.exit(0); }
    else { console.error('unknown arg ' + a); process.exit(2); }
  }
  return o;
}

// ---- in-page measurements ------------------------------------------------
// Everything below runs inside the page; it must stay self-contained.
function measureInPage(minTap) {
  const vw = document.documentElement.clientWidth;
  const out = { vw, scrollW: 0, offenders: [], clipped: [], scrollers: [], smallInputs: [], small: [], tiny: [], sticky: [], dock: null, viewportMeta: document.querySelector('meta[name=viewport]')?.content || '' };
  const html = document.documentElement;
  out.scrollW = Math.max(html.scrollWidth, document.body.scrollWidth);
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (c.length) s += '.' + c.join('.');
    return s;
  };
  const visible = (el, r, cs) => r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  const clipAncestor = (el) => {
    for (let p = el.parentElement; p && p !== document.body && p !== html; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) return { p, cs };
    }
    return null;
  };
  const all = document.body.querySelectorAll('*');
  for (const el of all) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!visible(el, r, cs)) continue;
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    // 1. horizontal overflow of the viewport
    if (r.right < -1000) continue; // honeypot fields parked far off-screen on purpose
    if (r.right > vw + 0.5 || r.left < -0.5) {
      const ca = clipAncestor(el);
      if (!ca) out.offenders.push({ el: sel(el), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), text: (el.textContent || '').trim().slice(0, 40) });
      else if (/hidden|clip/.test(ca.cs.overflowX) && r.width > 2 && ca.p.clientWidth > 2) out.clipped.push({ el: sel(el), by: sel(ca.p), left: Math.round(r.left), right: Math.round(r.right), text: (el.textContent || '').trim().slice(0, 40) });
    }
    // content cut off by overflow:hidden on the element itself
    if (/hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 2 && !['svg', 'canvas'].includes(el.tagName.toLowerCase())) {
      out.clipped.push({ el: sel(el), by: 'self', scrollW: el.scrollWidth, clientW: el.clientWidth, text: (el.textContent || '').trim().slice(0, 40) });
    }
    // horizontal scrollers that hide content behind a swipe
    if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && !/marquee/.test(el.className)) {
      out.scrollers.push({ el: sel(el), scrollW: el.scrollWidth, clientW: el.clientWidth, text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) });
    }
    // 16px minimum on text fields, or iOS Safari zooms the page on focus
    const tag0 = el.tagName.toLowerCase();
    if ((tag0 === 'input' && !/^(checkbox|radio|hidden|submit|button|range|file)$/.test(el.type)) || tag0 === 'textarea' || tag0 === 'select') {
      if (parseFloat(cs.fontSize) < 16) out.smallInputs.push({ el: sel(el), px: parseFloat(cs.fontSize) });
    }
    // 2. tap targets
    const tag = el.tagName.toLowerCase();
    const isCtl = (tag === 'a' && el.hasAttribute('href')) || tag === 'button' || tag === 'select' || tag === 'textarea' || tag === 'summary' ||
      (tag === 'input' && el.type !== 'hidden') || el.getAttribute('role') === 'button' || el.getAttribute('role') === 'tab' ||
      (el.hasAttribute('tabindex') && el.tabIndex >= 0 && tag !== 'main' && !el.closest('svg'));
    if (isCtl && !el.closest('[inert]')) {
      // a label-wrapped checkbox/radio: measure the label
      let m = el;
      if (tag === 'input' && (el.type === 'checkbox' || el.type === 'radio')) { const l = el.closest('label') || (el.id && document.querySelector('label[for="' + el.id + '"]')); if (l) m = l; }
      const mr = m.getBoundingClientRect();
      const onscreenX = mr.right > 0 && mr.left < vw;
      const skip = el.classList.contains('kw-skip') || !onscreenX;
      if (!skip && (mr.width < minTap - 0.5 || mr.height < minTap - 0.5)) {
        const inline = cs.display === 'inline' && !!el.closest('p, li, dd, blockquote, figcaption, td');
        out.small.push({ el: sel(el), w: Math.round(mr.width), h: Math.round(mr.height), inline, text: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 30) });
      }
    }
    // 4. tiny text
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (hasText) {
      const fs = parseFloat(cs.fontSize);
      if (fs < 12) out.tiny.push({ el: sel(el), px: Math.round(fs * 10) / 10, text: el.textContent.trim().slice(0, 30) });
    }
    if (cs.position === 'sticky' || cs.position === 'fixed') {
      out.sticky.push({ el: sel(el), pos: cs.position, top: cs.top, bottom: cs.bottom, h: Math.round(r.height), z: cs.zIndex });
    }
  }
  return out;
}

async function measurePage(page, minTap) {
  return page.evaluate(measureInPage, minTap);
}

// Overflow check with the html/body safety net lifted.
async function overflowCheck(page) {
  return page.evaluate(() => {
    const st = document.createElement('style');
    st.id = '__mc_overflow';
    st.textContent = 'html,body{overflow-x:visible!important}';
    document.head.appendChild(st);
    const html = document.documentElement;
    const r = { vw: html.clientWidth, scrollW: Math.max(html.scrollWidth, document.body.scrollWidth), innerW: window.innerWidth, vvW: window.visualViewport?.width };
    st.remove();
    return r;
  });
}

async function dockCheck(page) {
  // Scroll to the bottom, then see whether the fixed dock sits on top of real content.
  return page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    const dock = document.getElementById('kw-dock');
    if (!dock) return null;
    const dr = dock.getBoundingClientRect();
    const cs = getComputedStyle(dock);
    const shown = dock.classList.contains('kw-visible') || cs.transform === 'none';
    const hits = [];
    document.querySelectorAll('footer *, main > *:last-child *').forEach((el) => {
      if (dock.contains(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const t = (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
      if (t && r.bottom > dr.top + 1 && r.top < dr.bottom - 1 && dr.height > 0 && dr.top < innerHeight) hits.push({ el: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0], text: el.textContent.trim().slice(0, 30) });
    });
    const targets = [...dock.querySelectorAll('a, button')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return { el: e.id || e.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height) }; });
    // Does the last real content end above the dock? (footer text must be fully visible)
    const foot = document.querySelector('footer');
    const lastBottom = foot ? Math.max(...[...foot.querySelectorAll('*')].map((e) => e.getBoundingClientRect().bottom)) : 0;
    const padBottom = parseFloat(getComputedStyle(dock).paddingBottom);
    window.scrollTo(0, 0);
    return { shown, targets, lastBottom: Math.round(lastBottom), padBottom, top: Math.round(dr.top), h: Math.round(dr.height), bottom: Math.round(dr.bottom), vh: innerHeight, hits: hits.slice(0, 5) };
  });
}

async function runAxe(page, axeSource) {
  await page.evaluate(axeSource);
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ').slice(0, 80), summary: (v.nodes[0]?.failureSummary || '').split('\n').slice(1, 3).join(' ').slice(0, 160) }));
  });
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    // The theme change animates colours over 0.7s: measure contrast after the change, not during it.
    if (!document.getElementById('__mc_notrans')) {
      const st = document.createElement('style');
      st.id = '__mc_notrans';
      st.textContent = '*,*::before,*::after{transition:none!important}';
      document.head.appendChild(st);
    }
    if (t === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }, theme);
  await new Promise((r) => setTimeout(r, 120));
}

async function gotoPage(page, base, url) {
  await page.goto(base + url, { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 500));
}

async function ensureReader(page, base) {
  // Reader sign-up with a throw-away test address; wrangler dev only (local KV).
  // The first request after `wrangler pages dev` starts compiles the functions: allow it time, retry once.
  for (let attempt = 0; attempt < 2; attempt++) {
    try { await page.goto(base + '/read/01/', { waitUntil: 'domcontentloaded', timeout: 90000 }); break; } catch (e) { if (attempt) throw e; }
  }
  return page.evaluate(async () => {
    const r = await fetch('/api/reader', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'mobile-check@example.test', updates: false, chapter: '01' }), credentials: 'same-origin' });
    return r.status;
  });
}

export async function main(argv = process.argv) {
  const opt = parseArgs(argv);
  let puppeteer;
  try { puppeteer = require('puppeteer-core'); } catch { console.error('puppeteer-core missing: npm install --no-save puppeteer-core'); process.exit(2); }
  const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) { console.error('Chrome not found at ' + chromePath + ' (set CHROME_PATH)'); process.exit(2); }
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const pages = opt.pages || PAGES;
  const devices = opt.devices || DEFAULT_DEVICES;
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-first-run', '--hide-scrollbars'] });
  const results = [];
  let fails = 0, warns = 0;
  try {
    const readerPage = await browser.newPage();
    let status = 0;
    try { status = await ensureReader(readerPage, opt.base); } catch (e) { console.error('(reader sign-up failed: ' + e.message.split('\n')[0] + ')'); }
    if (status !== 200) console.error(`(reader sign-up returned ${status}; /read/NN/full will show the gate)`);
    const anonCtx = await browser.createBrowserContext();
    const anonPage = await anonCtx.newPage();
    // Console errors (a CSP refusal shows up here) fail the run.
    const consoleErrors = new Map();
    for (const pg of [readerPage, anonPage]) {
      consoleErrors.set(pg, []);
      pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) consoleErrors.get(pg).push(m.text().slice(0, 160)); });
      pg.on('pageerror', (e) => consoleErrors.get(pg).push('pageerror: ' + e.message.slice(0, 160)));
    }
    for (const dev of devices) {
      const d = DEVICES[dev];
      if (!d) { console.error('unknown device ' + dev); continue; }
      for (const pg of [readerPage, anonPage]) {
        await pg.setUserAgent(UA[d.ua]);
        await pg.setViewport({ width: d.w, height: d.h, deviceScaleFactor: d.dpr, isMobile: true, hasTouch: true, isLandscape: !!d.landscape });
      }
      for (const url of pages) {
        const page = /\/full\/?$/.test(url) ? readerPage : anonPage; // gate pages must be seen signed out
        const rec = { device: dev, w: d.w, url, fails: [], warns: [] };
        try {
          consoleErrors.get(page).length = 0;
          await gotoPage(page, opt.base, url);
          const ov = await overflowCheck(page);
          rec.vw = ov.vw; rec.scrollW = ov.scrollW;
          if (ov.scrollW > ov.vw + 1) rec.fails.push(`overflow-x: page is ${ov.scrollW}px wide in a ${ov.vw}px viewport`);
          const m = await measurePage(page, 44);
          rec.offenders = m.offenders; rec.clipped = m.clipped;
          if (m.offenders.length) rec.fails.push(`${m.offenders.length} element(s) pass the right/left edge: ` + m.offenders.slice(0, 4).map((o) => `${o.el}[${o.left}..${o.right}] "${o.text}"`).join('; '));
          // Group by the clipping box: a marquee or a carousel clips hundreds of children on purpose.
          const clipBy = {};
          for (const c of m.clipped) { const k = c.by === 'self' ? c.el : c.by; (clipBy[k] ||= { n: 0, text: c.text }).n++; }
          rec.clippedBy = clipBy;
          const clipKeys = Object.keys(clipBy);
          if (clipKeys.length) rec.warns.push(`content clipped by overflow:hidden in ${clipKeys.length} box(es): ` + clipKeys.slice(0, 6).map((k) => `${k} (${clipBy[k].n}) "${clipBy[k].text}"`).join('; '));
          const hard = m.small.filter((s) => !s.inline);
          rec.small = m.small;
          if (hard.length) rec.fails.push(`${hard.length} tap target(s) under 44px: ` + hard.slice(0, 30).map((s) => `${s.el} ${s.w}x${s.h} "${s.text}"`).join('; '));
          const inl = m.small.filter((s) => s.inline);
          if (inl.length) rec.warns.push(`${inl.length} inline link(s) under 44px tall (exempt by WCAG, listed for information)`);
          if (m.tiny.length) rec.warns.push(`${m.tiny.length} text node(s) under 12px: ` + [...new Set(m.tiny.map((t) => t.el + ' ' + t.px + 'px'))].slice(0, 5).join('; '));
          rec.tiny = m.tiny;
          rec.scrollers = m.scrollers;
          if (m.scrollers.length) rec.warns.push(`${m.scrollers.length} horizontal scroller(s) hiding content: ` + m.scrollers.slice(0, 4).map((x) => `${x.el} ${x.clientW}→${x.scrollW}`).join('; '));
          if (m.smallInputs.length) rec.fails.push(`${m.smallInputs.length} text field(s) under 16px (iOS zooms on focus): ` + m.smallInputs.slice(0, 4).map((x) => `${x.el} ${x.px}px`).join('; '));
          if (!/viewport-fit=cover/.test(m.viewportMeta)) rec.warns.push('viewport meta lacks viewport-fit=cover (safe-area insets stay 0 on notched iPhones)');
          rec.sticky = m.sticky;
          if (opt.scrollDock) {
            const dk = await dockCheck(page);
            rec.dock = dk;
            if (dk && dk.hits.length) rec.fails.push('dock bar covers content at the bottom: ' + dk.hits.map((h) => h.el + ' "' + h.text + '"').join('; '));
            if (dk) for (const t of dk.targets) if (t.w < 44 || t.h < 44) rec.fails.push(`dock control ${t.el} is ${t.w}x${t.h} (under 44px)`);
          }
          if (consoleErrors.get(page).length) rec.fails.push('console errors: ' + consoleErrors.get(page).slice(0, 3).join(' | '));
          if (opt.axe) {
            const themes = (opt.axeAll || dev === 'iphone-se') ? opt.themes : ['light'];
            rec.axe = {};
            for (const t of themes) {
              await setTheme(page, t);
              const v = await runAxe(page, axeSource);
              rec.axe[t] = v;
              if (v.length) rec.fails.push(`axe (${t}): ` + v.map((x) => `${x.id}×${x.n} ${x.sample}`).join('; '));
            }
            await setTheme(page, 'light');
          }
          if (opt.shots) {
            fs.mkdirSync(opt.shots, { recursive: true });
            const name = `${url === '/' ? 'home' : url.replace(/^\//, '').replace(/\//g, '_')}-${dev}`;
            await page.evaluate(() => window.scrollTo(0, 0));
            const h = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 12000));
            for (let y = 0, i = 1; y < h; y += opt.sliceH, i++) {
              await page.screenshot({ path: path.join(opt.shots, `${name}-${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 55, captureBeyondViewport: true, clip: { x: 0, y, width: d.w, height: Math.min(opt.sliceH, h - y) } });
            }
          }
        } catch (e) {
          rec.fails.push('error: ' + e.message.split('\n')[0]);
        }
        fails += rec.fails.length; warns += rec.warns.length;
        results.push(rec);
        const tag = rec.fails.length ? 'FAIL' : rec.warns.length ? 'warn' : ' ok ';
        console.log(`${tag}  ${String(d.w).padStart(3)}  ${url}`);
        if (opt.verbose || rec.fails.length) for (const f of rec.fails) console.log('        ✗ ' + f);
        if (opt.verbose) for (const w of rec.warns) console.log('        ! ' + w);
      }
    }
  } finally {
    await browser.close();
  }
  if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(results, null, 1));
  console.log(`\n${results.length} page/device runs · ${fails} failure(s) · ${warns} warning(s)`);
  if (fails && !opt.noFail) process.exit(1);
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
