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
not mistaken for none. Axe-core 4.14 in light, dark and warm at 375.

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

| Check | 320 | 360 | 375 | 390 | 430 | 844 (land.) | 768 (tab.) |
|---|---|---|---|---|---|---|---|
| Pages with horizontal overflow (of 20, `overflow-x:hidden` lifted) | 2 (`/` 392px, `/read/01` 367px) | 2 (`/` 392, `/read/01` 367) | 1 (`/` 392) | 1 (`/` 392) | 0 | 0 | 0 |
| Failing checks, summed over 20 pages (overflow, tap targets, 16px fields, axe; axe only at 375) | 24 | 24 | 62 | 22 | 22 | 22 | 22 |

Nav row width: **868px** (`scrollWidth` of `.kw-nav-shell`) vs 768 / 844 available, so `07 Agents` and the theme button
were clipped at 768 and 844. At 320–430 every tab was **26×51px**, the theme button 40×51px.

Tap targets under 44px at 375 (non-inline, unique):

| Element | Size | Where |
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
"Fix PR" is filled in as the PRs open; `—` means not changed (reason in the last column of the summary below).

| # | Page | Widths | What is wrong | Sev | Evidence | Fix PR |
|---|---|---|---|---|---|---|
| G1 | all | 320–430 | Nav shows seven numbers only (no labels) as 26×51px tap targets; theme button 40px | High | [nav](shots/audit/home-hero-375.jpg) | nav-dock |
| G2 | all | 768, 844 | Nav row is 868px in a `height:52px; overflow-x:auto` bar: `07 Agents` and the theme button are hidden behind a scroll with no affordance | High | [768](shots/audit/nav-tablet-768.jpg) [844](shots/audit/nav-landscape-844.jpg) | nav-dock |
| G3 | all | all | Dock bar: no safe-area padding (sits on the iPhone home indicator and the landscape notch), CTA 30px tall, 11px type, cannot be dismissed | Med | — | nav-dock |
| G4 | all | all | Viewport meta lacks `viewport-fit=cover`, so `env(safe-area-inset-*)` is always 0 | Med | — | nav-dock |
| G5 | all | all | Footer email link 156×18; colophon strip 11px; dock reserve hard-coded 48px | Med | — | nav-dock |
| G6 | all | all | No `text-size-adjust`: iOS inflates fonts on rotation | Low | — | nav-dock |
| G7 | `/the-81`, `/voices/NN` | all | `position:sticky; top:52px` on the cast chapter header and the dossier top bar, but the nav is **not** sticky: a 52px hole opens above them and list rows scroll visibly through it | Med | [sticky](shots/audit/the81-sticky-375.jpg) | the-81, dossier |
| G8 | all | all | `.kw-btn` 41px, text fields 41–42px tall | Med | — | controls |
| G9 | all | all | Dark and warm colour-contrast violations in axe: `--sub2` text (`.kw-nav-tab-num`, `.kw-masthead-lbl`, `.cast-num`, `.kw-voice-num`, `.dos-alias`, `.dos-section-hd`, `.kw-foot-colophon`), `.st-back` link, `.kw-body` links, in-copy links in warm | Med | — | contrast |
| G10 | all | all | 11px mono labels, badges and captions (see measurements) | Low | — | per area |
| H1 | `/` | 320–390 | Hero wordmark `KNOWWARE` is `clamp(64px,15vw,…)`: 64px minimum makes the text 392px wide in a 288–358px box; the last letter is clipped and the page overflows by 17–72px. Together with R1 this is the only page-level horizontal overflow on the site | High | [hero](shots/audit/home-hero-375.jpg) | home |
| H2 | `/` | all | Marquee strip: items cut mid-word is intentional, but the **Pause motion** button (120×35) sits inside the clipped strip, on the right edge | Med | [hero](shots/audit/home-hero-375.jpg) | home |
| H3 | `/` | all | Spine bar chart: nine 33px-wide link targets; rotated labels truncated ("The Coordina…") with no full title | Med | — | home |
| H4 | `/` | all | Home buttons 41px; inline links "What is knowware? →" 16px tall; "Read manuscript" 28px | Med | — | home |
| T1 | `/the-81` | all | CAST / ELEMENTS / GRAPH view tabs 32px tall, 11px type | Med | — | the-81 |
| T2 | `/the-81` | 320–430 | Legend is nine items plus stray "·" separators wrapping to 4–5 lines before the list starts | Med | — | the-81 |
| T3 | `/the-81` | ≤900 | ELEMENTS: nine fixed 130px columns; about 2.3 visible at 375, swipe sideways, chapter headers detach, no affordance | High | [elements](shots/audit/the81-elements-375.jpg) | the-81 |
| T4 | `/the-81` | ≤900 | GRAPH: 81 nodes with labels on a 343px canvas, overlapping text, hover-only affordances, tiny hit radius; the 280px sidebar stacks below with its own 260px scroller (nested scroll) | High | [graph](shots/audit/the81-graph-375.jpg) | the-81 |
| D1 | `/voices/NN` | all | Breadcrumb "DOSSIER · №01 OF 81 · …" is clipped by `overflow:hidden`; prev/next arrow 32×32; "Back to The 81" 133×28; CTAs 38px | Med | [dossier](shots/audit/dossier-375.jpg) | dossier |
| D2 | `/voices/NN` | all | Contrast (dark/warm) `.dos-alias`, `.dos-section-hd` count; 11px labels | Low | — | contrast, dossier |
| R1 | `/read/NN` (nine voices) | 320, 360 | Tier badge ("PRACTITIONER") passes the right edge: page is 367px wide in a 320/360 viewport; quote box is squeezed into about 65% of the width by the 40px number gutter | High | [cards](shots/audit/read01-cards-320.jpg) | read |
| R2 | `/read/NN` | all | Causal-diagram SVG scales to the viewport: node labels render at about 7px and cannot be read at 375 | High | — | read |
| R3 | `/read/NN`, `/read/x` | all | Gate: input 41px, button 41px, chapter-nav link 34px, 11px labels | Med | [gate](shots/audit/read-gate-375.jpg) | read |
| R4 | `/read`, `/read/NN/full` | all | 11px chapter titles/numbers; next-chapter link 39px | Low | — | read |
| F1 | `/contribute` | all | Text fields are **14px**: iOS Safari zooms the page on focus (and does not zoom back); fields 42px | High | [form](shots/audit/contribute-375.jpg) | controls |
| F2 | `/order`, `/order/listed` | all | Waiting-list button/inputs 41px, 11px legal line | Med | — | controls |
| S1 | `/stories`, `/stories/<slug>` | all | Buttons 41px (share, atom feed), 8–16 inline links, 11px badges/captions. Canvases: diagram animates continuously — check cost on slow phones | Med | — | stories |
| A1 | `/agents` | all | Two tables (`.ag-table-wrap`) are 520px wide inside 286–341px: second column cut mid-word with no scroll cue ("Knowware: Systems o…", "NOT OP…") | High | [agents](shots/audit/agents-table-375.jpg) | stories-agents |
| A2 | `/agents` | all | 22 small inline links, long mono endpoints in prose | Low | — | stories-agents |
| X1 | `/404` | all | Buttons 41px | Low | — | controls |
| X2 | all | all | `html, body { overflow-x:hidden }` hides overflow instead of fixing it | Info | — | kept as a safety net; the check tool lifts it |

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
