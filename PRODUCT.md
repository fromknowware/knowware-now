# PRODUCT.md — Knowware: Systems of Intelligence

## What it is
Companion website for the book *Knowware: Systems of Intelligence* by Khayyam Wakil (The ARC Institute of Knowware). Live at knowware.press. The site presents the book's 81 "voices" (experts spanning academics, practitioners, visionaries), the manuscript chapters, and the method behind the book: human knowledge coordinated with machine synthesis ("the Third Body"). The site is itself a demonstration of the book's thesis — "This book is not about Knowware. This book IS Knowware."

## Register
brand — the site is an editorial/archival experience; design IS the product.

## Users
- Prospective readers evaluating the book before buying/reading
- Editors, reviewers, and press evaluating the project
- Researchers and practitioners exploring the 81 voices and the coordination-intelligence framework

## Brand & tone
- Archival, editorial, dossier-like. Paper textures, mono utility labels, periodic-table metaphor for the 81 voices.
- Serious but not academic-dry; intellectually confident.
- Three visual tiers for voices: Academics (blue), Practitioners (terracotta), Visionaries (sage) — equal-lightness OKLCH.
- Three themes: light (default paper), dark, warm.
- Fonts: JetBrains Mono for utility/labels, Helvetica Neue for body.

## Key surfaces
- Home / Manuscript view (chapters, synthesis bands)
- The 81 (cast list + periodic table grid)
- Graph view (force-directed co-citation network, hollow tier-colored nodes, red co-citation strings)
- Dossier pages (per-voice: affiliation, cold open, bio, M.O. classifiers, evidence archive)
- Method page (#method — the C(A,B,Context)→Emergence formalism)

## Anti-references
- Generic SaaS landing pages, hero-metric templates, gradient-text startup aesthetics
- Anything that frames the 81 syntheses as real conducted interviews (they are Third Body syntheses; the site must never claim otherwise)

## Constraints
- No build step: Babel-standalone React SPA served as static files on Cloudflare Pages; index.html is canonical, cache-busted via ?v=N query strings.
- Must remain fast on static hosting; React/Babel loaded from unpkg CDN.
