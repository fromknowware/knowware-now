# Mobile check (developer tool)

`scripts/mobile-check.mjs` loads the site under **true device emulation** and fails when a page has a mobile
defect. It is a developer tool: it is not part of the build and nothing in CI runs it.

## Why not `chrome --headless --window-size=390,844`

Headless Chrome will not go narrower than about 500px. With `--window-size=390,844` it lays the page out at
about 500px and crops the screenshot, which fakes a cut-off. The script instead drives Chrome through
[puppeteer-core](https://pptr.dev) with `Emulation.setDeviceMetricsOverride` (real layout width), a mobile user
agent, touch, and a device pixel ratio of 2 or 3. It uses your installed Google Chrome; nothing is downloaded.

## Run it

```bash
npm install                       # puppeteer-core is a devDependency; axe-core already was
npm run build
find dist functions lib src -name '._*' -delete   # macOS sidecar files break wrangler on external drives
npx wrangler pages dev dist --port 8799 --kv CLAIMS &   # run it directly; the preview launcher hangs
npm run mobile-check              # all pages x all devices, light/dark/warm axe at 375
```

Useful options:

```bash
npm run mobile-check -- --pages /,/the-81 --devices iphone-se-1,iphone-se,phone-large
npm run mobile-check -- --axe-all          # axe at every device, not just 375
npm run mobile-check -- --no-axe -v        # fast; -v also prints warnings
npm run mobile-check -- --shots /tmp/shots # JPEG screenshots, sliced every 1400px
npm run mobile-check -- --json out.json    # raw measurements
npm run mobile-check -- --no-fail          # report only (exit code 0)
CHROME_PATH=/path/to/chrome npm run mobile-check
```

Devices (`--devices`): `iphone-se-1` 320x568, `android-s` 360x800, `iphone-se` 375x667, `iphone-14` 390x844,
`phone-large` 430x932, `landscape` 844x390, `tablet` 768x1024. Default is all seven.

## What fails the run (exit code 1)

| Check | Rule |
|---|---|
| Horizontal overflow | `scrollWidth` of the page greater than the viewport, measured with the `overflow-x:hidden` safety net on `html, body` **lifted**, plus a list of the elements that pass the edge outside an intentional scroller |
| Tap targets | any link, button, field, summary or tab smaller than 44x44 CSS px. Inline links inside running text are listed as warnings (WCAG 2.2 exempts them) |
| Text fields | font size under 16px (iOS Safari zooms the page on focus) |
| Dock bar | its controls under 44px, or the bar covering the last lines of the page |
| axe | any violation in light, dark or warm (at 375; `--axe-all` for every device) |
| Console | any console error or page error (a CSP refusal shows up here) |

Warnings (printed with `-v`, never fail): content clipped by `overflow:hidden`, horizontal scrollers that hide
content, text under 12px, inline links under 44px, a viewport meta without `viewport-fit=cover`.

Reader pages are loaded in a fresh browser context (signed out, so the gate is what you see). `/read/NN/full`
signs a test address (`mobile-check@example.test`) into the local KV, so run it against `wrangler pages dev`,
never against production.

## What it cannot tell you

Headless Chrome is not iOS Safari. The script cannot see the dynamic toolbar (`100vh` vs `100dvh`),
`env(safe-area-inset-*)` (always 0 here), iOS-specific `position:sticky`, mask or backdrop behaviour, pinch-zoom,
or what a thumb actually reaches. See the checklist at the end of `drafts/mobile/AUDIT.md`.
