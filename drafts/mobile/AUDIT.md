# Knowware mobile audit

Baseline: `origin/main` @ `d61b634`, built with `astro build`, served by `wrangler pages dev`.
Measured **2026-10-17** under true device emulation (puppeteer-core driving the system Chrome through
`Emulation.setDeviceMetricsOverride` + mobile user agent + touch; no cropped desktop window).
Tool: [`scripts/mobile-check.mjs`](../../scripts/mobile-check.mjs) (see [docs/mobile-check.md](../../docs/mobile-check.md)).

| Device | Size (CSS px) | DPR |
|---|---|---|
| iPhone SE (1st gen) | 320×568 | 2 |
| Small Android | 360×800 | 3 |
| iPhone SE (2nd/3rd gen) | 375×667 | 2 |
| iPhone 14 | 390×844 | 3 |
| Large phone | 430×932 | 3 |
| Landscape phone | 844×390 | 3 |
| Tablet | 768×1024 | 2 |

20 pages × 7 devices = 140 runs. Reader pages (`/read/NN`, `/read/x`) were loaded **signed out** (fresh browser
context) so the gate is what the reader sees; `/read/01/full` was loaded after a test sign-up against local KV.
Overflow was measured with the `overflow-x:hidden` safety net on `html, body` lifted, so hidden overflow is
not mistaken for none. Axe-core 4.14 in light, dark and warm at 375. *Correction:* the first baseline run
reported 40 dark/warm colour-contrast violations; they were an artefact of running axe while the 0.7s theme
transition was still animating colours. Re-measured with transitions off (320 and 375, 11 pages): **zero axe
violations on `main`**, so there is no contrast fix to make and none is claimed.

## Verdict in one paragraph

The site reflows better than the report suggested: body copy, `/method`, `/definition`, `/stories`, `/order`,
`/rules`, `/colophon`, the dossier reading order and the cold-open box (with its asterisk footnote) are all
single-column and readable at 320. What is genuinely broken is concentrated in a few places: **the nav**
(26px-wide tap targets on phones; seven tabs plus the theme button measure 868px, so tablets and landscape
phones lose the last tab *and the theme button* behind an invisible scroll), **the home wordmark** (clipped, and
the only page-level horizontal overflow on the site), **The 81** (a 9-column ELEMENTS grid you must swipe, and a
GRAPH that is 81 overlapping labels in 343px with hover-only interaction), **/read/NN** (tier badges overflow
at 320/360, quote boxes squeezed into two-thirds of the screen, a causal-diagram SVG whose labels render at
about 7px), **/agents** (two tables cropped to half their width), and **everywhere** a long tail of 41px buttons,
41–42px inputs, a 14px text field that makes iOS zoom on focus, 11px mono labels, and dark/warm contrast
failures. Page weight is not a problem (three JetBrains Mono weights = 64 KB of woff2; the largest page HTML is
`/the-81` at 134 KB; no photographic images on pages).

## Measurements

**Before** (`main` @ `d61b634`, 20 pages per width; axe row is the corrected figure, see above):

| Check | 320 | 360 | 375 | 390 | 430 | 844 (land.) | 768 (tab.) |
|---|---|---|---|---|---|---|---|
| Pages with horizontal overflow | 2 / 20 | 2 / 20 | 1 / 20 | 1 / 20 | 0 / 20 | 0 / 20 | 0 / 20 |
| Tap targets under 44px (non-inline, summed over pages) | 251 | 255 | 255 | 255 | 259 | 98 | 98 |
| ...of which in nav/footer/dock | 180 | 180 | 180 | 180 | 181 | 29 | 29 |
| Text nodes under 12px (summed) | 772 | 772 | 772 | 772 | 760 | 860 | 860 |
| Pages failing any check except axe | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 |
| axe violations (rules, all themes) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**After** (all fix PRs merged into one scratch branch, same 140 runs): see [Results after the fixes](#results-after-the-fixes).

Nav row width: **868px** (`scrollWidth` of `.kw-nav-shell`) vs 768 / 844 available, so `07 Agents` and the theme button
were clipped at 768 and 844. At 320–430 every tab was **26×51px**, the theme button 40×51px.

Tap targets under 44px at 375 (non-inline, unique):

| Element | Size | Where (all fixed, see the issue table) |
|---|---|---|
| `.kw-nav-tab` ×7 | 26×51 | every page |
| `#kw-theme-btn` | 40×51 | every page |
| `.kw-btn` (all variants) | 41px tall | home, definition, stories, story pages, dossier, read gate, 404, contribute, order |
| `.field-input` / gate input | 41–42px tall | contribute, read gate, order |
| `.kw-spine-bar` ×9 | 33px wide | home |
| `.kw-spine-read-btn` | 134×28 | home |
| `#kw-motion-btn` (Pause motion) | 120×35 | home |
| home inline links "What is knowware? →" | 125×16, 145×16 | home |
| `.cast-vtab` ×3 (CAST/ELEMENTS/GRAPH) | 32px tall | /the-81 |
| `.dos-nav-btn` | 32×32 | dossier |
| `.dos-back-btn` | 133×28 | dossier |
| `.dos-cta` ×2 | 38px tall | dossier |
| `.chapter-nav-link` | 34px tall | /read/NN |
| `.kw-full-nav-link--next` | 39px tall | /read/NN/full |
| `.kw-foot-email` | 156×18 | every page |
| `#kw-dock-cta` | 129×30 | every page (after 240px scroll) |

Text under 12px (text nodes at 375): home 95, /the-81 229, dossier 36–42, /read 31, /read/01 38, /method 43, /stories 36, /contribute 21, others 12–23. Almost all are
11px JetBrains Mono uppercase labels, badges and captions.

Page weight: JetBrains Mono 400/500/600 woff2 = 21.2 + 21.8 + 21.9 KB; CSS 23 KB (Base) + per-page ≤ 7 KB; largest JS
9 KB (story motion). Largest document: `/the-81` 134 KB (81 rows twice: list + grid). No image heavier than the 176 KB
`assets/00-blanche-slate.png`, which no page loads. Nothing to fix for slow connections beyond possibly dropping the
600 weight.

## Issue table

Severity: **High** = content hidden, clipped or unusable; **Med** = usability / WCAG target / zoom; **Low** = polish.
"Fix PR" links the pull request that fixes the row. Nothing is merged: each PR is independent and branched off `main`.

| # | Page | Widths | What is wrong | Sev | Evidence | Fix PR |
|---|---|---|---|---|---|---|
| G1 | all | 320–430 | Nav shows seven numbers only (no labels) as 26×51px tap targets; theme button 40px | High | [nav](shots/audit/home-hero-375.jpg) | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G2 | all | 768, 844 | Nav row is 868px in a `height:52px; overflow-x:auto` bar: `07 Agents` and the theme button are hidden behind a scroll with no affordance | High | [768](shots/audit/nav-tablet-768.jpg) [844](shots/audit/nav-landscape-844.jpg) | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G3 | all | all | Dock bar: no safe-area padding (sits on the iPhone home indicator and the landscape notch), CTA 30px tall, 11px type, cannot be dismissed | Med | — | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G4 | all | all | Viewport meta lacks `viewport-fit=cover`, so `env(safe-area-inset-*)` is always 0 | Med | — | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G5 | all | all | Footer email link 156×18; colophon strip 11px; dock reserve hard-coded 48px | Med | — | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G6 | all | all | No `text-size-adjust`: iOS inflates fonts on rotation | Low | — | [#32](https://github.com/fromknowware/knowware-now/pull/32) |
| G7 | `/the-81`, `/voices/NN` | all | `position:sticky; top:52px` on the cast chapter header and the dossier top bar, but the nav is **not** sticky: a 52px hole opens above them and list rows scroll visibly through it | Med | [sticky](shots/audit/the81-sticky-375.jpg) | [#35](https://github.com/fromknowware/knowware-now/pull/35), [#36](https://github.com/fromknowware/knowware-now/pull/36) |
| G8 | all | all | `.kw-btn` 41px, text fields 41–42px tall | Med | — | [#38](https://github.com/fromknowware/knowware-now/pull/38) |
| G9 | all | all | ~~Dark/warm colour contrast~~ **withdrawn**: first reported by axe mid-transition; with transitions off there are no violations and every token pair computes ≥ 4.5:1 | — | — | none needed |
| G10 | all | all | 11px mono labels, badges and captions (see measurements) | Low | — | [#42](https://github.com/fromknowware/knowware-now/pull/42) (+ area PRs) |
| H1 | `/` | 320–390 | Hero wordmark `KNOWWARE` is `clamp(64px,15vw,…)`: 64px minimum makes the text 392px wide in a 288–358px box; the last letter is clipped and the page overflows by 17–72px. Together with R1 this is the only page-level horizontal overflow on the site | High | [hero](shots/audit/home-hero-375.jpg) | [#34](https://github.com/fromknowware/knowware-now/pull/34) |
| H2 | `/` | all | Marquee strip: items cut mid-word is intentional, but the **Pause motion** button (120×35) sits inside the clipped strip, on the right edge | Med | [hero](shots/audit/home-hero-375.jpg) | [#34](https://github.com/fromknowware/knowware-now/pull/34) |
| H3 | `/` | all | Spine bar chart: nine 33px-wide link targets; rotated labels truncated ("The Coordina…") with no full title | Med | — | [#34](https://github.com/fromknowware/knowware-now/pull/34) |
| H4 | `/` | all | Home buttons 41px; inline links "What is knowware? →" 16px tall; "Read manuscript" 28px | Med | — | [#34](https://github.com/fromknowware/knowware-now/pull/34) |
| T1 | `/the-81` | all | CAST / ELEMENTS / GRAPH view tabs 32px tall, 11px type | Med | — | [#35](https://github.com/fromknowware/knowware-now/pull/35) |
| T2 | `/the-81` | 320–430 | Legend is nine items plus stray "·" separators wrapping to 4–5 lines before the list starts | Med | — | [#35](https://github.com/fromknowware/knowware-now/pull/35) |
| T3 | `/the-81` | ≤900 | ELEMENTS: nine fixed 130px columns; about 2.3 visible at 375, swipe sideways, chapter headers detach, no affordance | High | [elements](shots/audit/the81-elements-375.jpg) | [#35](https://github.com/fromknowware/knowware-now/pull/35) |
| T4 | `/the-81` | ≤900 | GRAPH: 81 nodes with labels on a 343px canvas, overlapping text, hover-only affordances, tiny hit radius; the 280px sidebar stacks below with its own 260px scroller (nested scroll) | High | [graph](shots/audit/the81-graph-375.jpg) | [#35](https://github.com/fromknowware/knowware-now/pull/35) |
| D1 | `/voices/NN` | all | Breadcrumb "DOSSIER · №01 OF 81 · …" is clipped by `overflow:hidden`; prev/next arrow 32×32; "Back to The 81" 133×28; CTAs 38px | Med | [dossier](shots/audit/dossier-375.jpg) | [#36](https://github.com/fromknowware/knowware-now/pull/36) |
| D2 | `/voices/NN` | all | Contrast (dark/warm) `.dos-alias`, `.dos-section-hd` count; 11px labels | Low | — | [#36](https://github.com/fromknowware/knowware-now/pull/36) |
| R1 | `/read/NN` (nine voices) | 320, 360 | Tier badge ("PRACTITIONER") passes the right edge: page is 367px wide in a 320/360 viewport; quote box is squeezed into about 65% of the width by the 40px number gutter | High | [cards](shots/audit/read01-cards-320.jpg) | [#37](https://github.com/fromknowware/knowware-now/pull/37) |
| R2 | `/read/NN` | all | Causal-diagram SVG scales to the viewport: node labels render at about 7px and cannot be read at 375 | High | — | [#37](https://github.com/fromknowware/knowware-now/pull/37) |
| R3 | `/read/NN`, `/read/x` | all | Gate: input 41px, button 41px, chapter-nav link 34px, 11px labels | Med | [gate](shots/audit/read-gate-375.jpg) | [#37](https://github.com/fromknowware/knowware-now/pull/37) |
| R4 | `/read`, `/read/NN/full` | all | 11px chapter titles/numbers; next-chapter link 39px | Low | — | [#37](https://github.com/fromknowware/knowware-now/pull/37) |
| F1 | `/contribute` | all | Text fields are **14px**: iOS Safari zooms the page on focus (and does not zoom back); fields 42px | High | [form](shots/audit/contribute-375.jpg) | [#38](https://github.com/fromknowware/knowware-now/pull/38) |
| F2 | `/order`, `/order/listed` | all | Waiting-list button/inputs 41px, 11px legal line | Med | — | [#38](https://github.com/fromknowware/knowware-now/pull/38) |
| S1 | `/stories`, `/stories/<slug>` | all | Buttons 41px (share, atom feed), 8–16 inline links, 11px badges/captions. Canvases: diagram animates continuously — check cost on slow phones | Med | — | stories |
| A1 | `/agents` | all | Two tables (`.ag-table-wrap`) are 520px wide inside 286–341px: second column cut mid-word with no scroll cue ("Knowware: Systems o…", "NOT OP…") | High | [agents](shots/audit/agents-table-375.jpg) | [#41](https://github.com/fromknowware/knowware-now/pull/41) |
| A2 | `/agents` | all | 22 small inline links, long mono endpoints in prose | Low | — | [#41](https://github.com/fromknowware/knowware-now/pull/41) |
| X1 | `/404` | all | Buttons 41px | Low | — | [#38](https://github.com/fromknowware/knowware-now/pull/38) |
| X2 | all | all | `html, body { overflow-x:hidden }` hides overflow instead of fixing it | Info | — | kept as a safety net; the check tool lifts it |
| X3 | `/read/NN` | all | Gate: `display:flex` beat the `hidden` attribute, so a signed-in reader saw the sign-up form under *Continue reading* (found while testing, not in the first scan) | Med | — | [#37](https://github.com/fromknowware/knowware-now/pull/37) |
| X4 | `/the-81` graph | touch | `touchmove` called `preventDefault`: a swipe starting on the canvas never scrolled the page (0px measured) | High | — | [#35](https://github.com/fromknowware/knowware-now/pull/35) |

## Not a problem (checked and left alone)

- Body-copy measure and wrapping at 320–430 (`/method`, `/definition`, `/rules`, `/colophon`, story text).
- Dossier order: name → tier → meta → cold-open box with its asterisk footnote intact → bio → works.
- Cold-open box and footnote in the nine-voices cards render intact (only the layout around them is cramped: R1).
- `/read/NN/full` signed-in reading is one column with comfortable measure.
- Fonts and images (see page weight).
- Landscape 844×390: content reflows; the only landscape-specific defect is the nav (G2).

## Constraints the fixes keep

No analytics, no cookies beyond the reader flag (the dismissible dock uses `sessionStorage` for the current tab
only), strict CSP (any new inline script is hashed by `integrations/security-headers.mjs`; the new code lives in
the bundled module `src/scripts/kw.ts`), WCAG 2.2 AA, identity untouched (navy, cream, signal blue, Helvetica Neue,
JetBrains Mono, hairline rules, bar field).

## Results after the fixes

All fix PRs (#32, #34–#38, #41, #42) merged into one scratch branch (not pushed, not for merging), built, and run
through the same tool: 20 pages × 7 devices = 140 runs, axe in light/dark/warm at 375, reader pages signed out,
`/read/01/full` signed in.

| Check | 320 | 360 | 375 | 390 | 430 | 844 (land.) | 768 (tab.) |
|---|---|---|---|---|---|---|---|
| Pages with horizontal overflow | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 |
| Tap targets under 44px (non-inline, summed over pages) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ...of which in nav/footer/dock | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Text nodes under 12px (summed) | 18 | 18 | 18 | 18 | 18 | 18 | 18 |
| Pages failing any check except axe | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 | 0 / 20 |
| axe violations (rules, all themes) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**140 runs, 0 failures.** What the tool still lists as warnings (none fail the run): inline links under 44px inside
running text (exempt under WCAG 2.2 target size), the marquee strip clipping its own scrolling items on purpose, the
cast role column ellipsis on wide screens, and the 11px labels drawn on the graph canvas. "Pages failing" is zero
because the check is the pass criterion: overflow, 44px targets, 16px text fields, dock bar clearance and controls,
console/CSP errors, axe.

Measured by hand in addition to the tool (true emulation): the graph taps select nodes and a swipe from the canvas
scrolls the page (before: 0px); a text field in focus hides the dock bar; the signed-in gate no longer shows the
form; the hero wordmark fits at 320, 375 and 430; the menu opens, closes on Esc and on a tap outside.

## What could not be tested here, and what to check on your own phone

Everything above was measured in headless Chrome under device emulation (viewport size, device pixel ratio,
touch events, mobile user agent). That is real layout at the real width, but it is not a phone. Not covered:

| Not testable here | Why it matters | What to look at |
|---|---|---|
| iOS Safari rendering | WebKit differs from Chrome: dynamic toolbar (`100vh`), `position: sticky` inside scrollers, `-webkit-mask-image` fades, `backdrop-filter`, canvas text | Scroll the home page and `/the-81` with the toolbar collapsing: nothing should jump, the sticky strip on the graph should stay put |
| Safe-area insets | `env(safe-area-inset-*)` is always 0 in headless Chrome | iPhone with a home indicator: the pre-order bar must sit above it, in portrait and landscape; in landscape neither bar nor menu may touch the notch |
| iOS zoom on focus | Emulation cannot trigger it | Focus the fields on `/contribute`, `/order`, the gate on `/read/01`, the token form on `/agents`: the page must not zoom |
| On-screen keyboard | The pre-order bar hides while a field is focused; the field must stay visible | Same fields; type a long email |
| Real touch | Tap accuracy, scroll inertia, pinch-zoom on the graph canvas | `/the-81` graph: tap a node, swipe the page from the canvas, pinch |
| Android Chrome | Different default fonts (Roboto instead of Helvetica Neue): the home wordmark is sized from its measured width with 7% slack | `/` at 360 and 412: the whole word KNOWWARE visible |
| Performance | Emulation does not throttle the CPU of an older phone | `/the-81` graph and the animated story diagrams on an older phone: no stutter, no heat |
| Dark and warm on OLED | Emulation does not show panel behaviour | Switch theme in the menu: band sections, the dock bar and the graph canvas should not smear or glow |
| 200% text and OS font size | Layout with large text | iOS Settings > Display > Text Size and Android font scale to the largest: nav menu, forms and dossier still usable |

URLs to open on the phone (use the production domain once the PRs are merged; before that use the Pages preview):

- https://knowware.press/
- https://knowware.press/the-81 (tap CAST / ELEMENTS / GRAPH; tap two nodes on the graph)
- https://knowware.press/voices/42
- https://knowware.press/read, /read/01 (gate, causal diagram, voice cards), /read/x
- https://knowware.press/read/01/full after signing up (signed-in reading)
- https://knowware.press/method, /definition
- https://knowware.press/stories, /stories/knight-capital-2012
- https://knowware.press/contribute, /order
- https://knowware.press/agents (the two tables)
- https://knowware.press/rules, /colophon, /no-such-page

## Not done, on purpose

- **Contrast tokens**: nothing to fix (see the correction above).
- **Story canvas cost**: reviewed in code (on-screen only, DPR capped at 2, honours reduced motion), not measured on a
  slow phone.
- **Webfont weights**: three weights, 64 KB in total; dropping the 600 weight would save 22 KB but changes the look.
- The nav stays non-sticky as it is on `main` (the brief called it sticky; the code never made it so). The sticky bars
  that assumed a 52px sticky nav were fixed instead.
