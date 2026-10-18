# Social cards

Every indexable page has its own 1200x630 card, served at `/og/<path>.png`, and its own
`og:` and `twitter:` title, description, image and image alt text.

- `src/layouts/Base.astro` points `og:image` and `twitter:image` at `/og/<path>.png` unless the
  page passes its own `ogImage` (stories do: `/stories/cards/<slug>.png`). The home page keeps the
  cover image, and `noindex` pages (order confirmation, 404) keep the generic one.
- `integrations/social-cards.mjs` runs after the build. It finds every built page that points at
  an `/og/` card, reads that page's own `og:title` and `og:description`, and renders the card with
  satori and resvg using the bundled JetBrains Mono, so it looks the same on every machine.
  The build fails if a page points at a card that was not written.
- A new page needs nothing extra: give it a title and description in `Base` and it gets a card.
  To change a page's kicker (the label top right), add it to `KICKERS` in the integration.
- Voices carry the synthesis disclosure on the card ("From published work. Not a quote.", or "Not a
  real person or a quote." for composites), because a card travels without the page. Chapter cards
  show the title only, never chapter text.
- The card font has no arrows or approximately-equals glyph. The integration swaps in plain
  equivalents (`->` renders as an arrow in JetBrains Mono) and warns in the build log about any
  other character it cannot draw.
