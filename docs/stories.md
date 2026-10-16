# Stories log

A running, cited log at `/stories`, with an Atom feed at `/feed.xml` (also `/feed`).
Add a story by committing one Markdown file to `src/content/stories/`. The build
validates it against the schema in `src/content.config.ts`; a bad entry fails the build.

## Frontmatter

| Field | Rule |
| --- | --- |
| `headline` | Plain statement of what happened. |
| `eventDate` | `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Use `eventDateLabel` when the date is a disclosure. |
| `added` / `updated` | `YYYY-MM-DD`. `added` is the feed `published` date. |
| `summary` | One factual paragraph, only from the cited sources. Say "alleged" (and set `alleged: true`) for allegations; say "simulation" (and set `simulation: true`) for simulations. |
| `missingLayer` | `knowing`, `context`, `accountability`, `meaning` or `third-party`. |
| `missingLayerLine` | One sentence saying how that layer was missing. The page supplies the label. |
| `why` | Why it matters to the thesis. At most two sentences. |
| `grade` | `A` primary source read for this entry; `B` reputable reporting, primary not yet read; `C` lead. |
| `caveats` | Where sources disagree, and what the entry deliberately does not claim. |
| `sources` | At least one with `primary: true`. Only list sources you read. |
| `draft` | `true` hides the entry from the page, the feed and the sitemap. Grade C must stay `draft: true`. |

The body is the full cited write-up. Cite with `[[1]](#src-1)`, numbered in `sources` order.

## Rules

- Facts only from the source. Never attribute a quote to a real person unless you read it in the source.
- Do not claim coordination where the source says none.
- No unverified numbers. When sources disagree, say so in `caveats`.
- Two entries may not share a primary source: add the second outlet as a source on the existing entry. The build enforces this.
- Be sober about harm. Entries that involve deaths need particular care.
- Publishing stays human-approved: nothing is added without a commit.

The feed carries the newest 100 entries. Feed readers get entries with `published`
and `updated` dates, stable ids (the story URL), and never empty content.

## Sharing

Every story gets a 1200x630 social card, generated at build from the entry
(`src/lib/story-card.ts`, satori + resvg, JetBrains Mono from `@fontsource`, so it renders the
same on every machine). It is the story's `og:image` and `twitter:image`, with alt text, and
shows the headline, missing layer, evidence grade and any simulation or alleged flag, so the
caveats travel with the link. Cards live at `/stories/cards/<slug>.png`.

Each story page has a "Share this story" block: the card preview (with a link to save the
image), one prepared post text, the native share sheet where the browser has one, Copy link,
Copy post text, and plain links to X, LinkedIn, Bluesky and email. Nothing loads from any
network until a reader clicks, and there are no third-party scripts or pixels. If the
clipboard is blocked the text is selected for manual copy.

The same text is published at `/stories/share.json` and is used to post from the author's
own accounts through [Zernio](https://zernio.com):

```bash
# needs ZERNIO_API_KEY for anything that talks to Zernio
node scripts/zernio-share.mjs --list-accounts
node scripts/zernio-share.mjs <slug> --platforms linkedin            # dry run, prints the request
node scripts/zernio-share.mjs <slug> --platforms linkedin --send     # saves a DRAFT in Zernio
node scripts/zernio-share.mjs <slug> --platforms linkedin --send --at 2026-10-20T09:00:00 --tz America/Denver
```

- Only stories already live on the site can be sent (the text is read from `share.json`).
- `--send` with no other flag creates a draft, approved in the Zernio dashboard. `--now` publishes immediately.
- The GitHub Action "Share a story via Zernio" runs the same script by hand (`workflow_dispatch` only). It needs a `ZERNIO_API_KEY` repository secret.
- The build fails if a share text would exceed 280 characters, so every story fits X.
