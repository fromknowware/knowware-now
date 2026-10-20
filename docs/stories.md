# Stories log

A running, cited log at `/stories`, with an Atom feed at `/feed.xml` (also `/feed`).
Add a story by committing one Markdown file to `src/content/stories/`. The build
validates it against the schema in `src/content.config.ts`; a bad entry fails the build.

## Frontmatter

| Field | Rule |
| --- | --- |
| `headline` | Plain statement of what happened. |
| `eventDate` | `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Use `eventDateLabel` when the date is a disclosure. |
| `added` / `updated` | `YYYY-MM-DD`. `added` is the feed `published` date, and the day the story goes live (see Scheduling). Set it to the day you actually log or release the story; never backdate it. |
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

Every story also gets a branded animated GIF (`/stories/gifs/<slug>.gif`, 640x616, a 12 second
loop) and a matching still frame (`/stories/gifs/still/<slug>.png`). They are rendered at build
from the same scene code as the page diagram (`src/scripts/story-motion.ts`, drawn with
`@napi-rs/canvas`, encoded with `gifenc`), so a new story gets one without extra work. Each
frame carries the Knowware mark, the headline, the evidence grade, any SIMULATION or ALLEGED
flag, the diagram caption ("Not a recording" and so on) and the story's own link
(`knowware.systems/stories/<slug>`), so the caveats and the source travel with it. The same link,
the headline, the grade and the licence are also written into the file as a GIF comment block.
A saved file is named `knowware-<slug>.gif`, and the Save button also copies the post text (which
ends with the story link) so the GIF and the link go into the post together. The GIF is not the link-preview image: networks show the static card for links and
only play a GIF that is attached or pasted.

Each story page has a "Share this story" block: the GIF (with Pause, a still for readers who
ask for reduced motion, and links to save the GIF or the card), one prepared post text, the
native share sheet (which attaches the GIF where the browser can), Copy link,
Copy post text, and plain links to X, LinkedIn, Bluesky and email. Nothing loads from any
network until a reader clicks, and there are no third-party scripts or pixels. If the
clipboard is blocked the text is selected for manual copy.

## Scheduling

Give a story an `added` date in the future and it is held back: the build checks it like
any other entry, but leaves it out of the index, its page, its card, the feed, the sitemap,
`llms.txt` and the Markdown copies until the first build on or after that date.

- A daily run of the deploy workflow (`.github/workflows/pages.yml`, 13:00 UTC, 07:00 in
  Denver) rebuilds `main` so releases go out on their day. It publishes nothing that was not
  already committed and merged to `main`.
- The deploy log lists what is held: `stories: 1 scheduled, not released yet: <slug> (<date>)`.
- To preview a release before its day: `STORIES_TODAY=2026-12-01 npx astro build`.
- The repository is public, so a scheduled entry can be read on GitHub before it goes live.
  Keep anything that must stay quiet out of `main` until its day.
- GitHub can pause scheduled workflows on a repository with no activity for 60 days. If a
  release does not appear, run "Deploy to Cloudflare Pages" by hand.
- Release dates are the dates stories are really added to the log. Event dates carry the
  chronology; the index is ordered by them.
