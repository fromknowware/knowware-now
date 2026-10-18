# Correction plan for the book's factual claims

Drafted 2026-10-17 by an AI session from `claims-audit.md` (its own findings) and section 4 of `drafts/youtube/episode-slate.md` (other sessions' findings, which this session did **not** re-verify except where marked). **Nothing here has been checked by a human, and no book file has been edited.** Proposed wording is a starting point for the author, not a final text.

## Where the fixes go

- **Full chapter text** lives in the manuscript repo `fromknowware/systems-intelligence`, at `chapters/chNN/text/chapter-NN.md` (NN = 01–09, X). The site fetches it at build time (`src/loaders/manuscript.ts`), so a fix there reaches the site on the next build.
- **Openers, captions and diagram frontmatter** live in this repo at `src/content/chapters/NN.md`. These carry their own versions of some claims, and in two places they disagree with the full text (Ch. 4, and Ch. 9, see below).
- **Not searched:** other site copy (`knowware-v2/*.jsx`, teasers, `PRODUCT.md`, social images) may repeat the same claims. Run a text search for each corrected figure before closing an item.

## Tier 1: wrong or contradicted, with a primary source in hand

| # | Where (full text / repo opener) | Now says | Sources say | Proposed fix |
|---|---|---|---|---|
| A | Ch. 5 opening / `05.md` line 43 | 2020; "using only his thoughts"; opener: "first such demonstration in history" | First hand movement June 2014; Guitar Hero reported with the Nature paper, 13 Apr 2016; thoughts are decoded and drive a forearm sleeve that moves his own fingers; "first" is Ohio State/Battelle's own claim | "In 2014 … Ian Burkhart moved his paralysed hand; by 2016 the team reported he could play a guitar video game." Attribute "first" to the researchers, or drop it. |
| B | Ch. 7 opening / `07.md` line 43 | 2019; "generative AI"; "human-designed version" | Unveiled Dec 2015; Airbus announcement 3 Mar 2016; "generative design"; 45% (30 kg) lighter than current designs; A320 | "In 2015 Autodesk, Airbus, APWorks and The Living unveiled a generative-design cabin partition for the A320, 45% (30 kg) lighter than current designs." |
| C | Ch. 9 "Autor" paragraph | Tellers ~300,000 (1970) to ~500,000 (2010) | Autor 2015: 500,000 to about 550,000, 1980–2010; branches +40%, tellers per branch down by over a third (1988–2004) | Use Autor's figures and years; cite Autor 2015 and Bessen 2015. |
| D | Ch. 4 full text and `04.md` line 43 | Full text: Peñalosa, "1998–2001", 80 → 20, −75%; opener: Mockus, −70%; "In 1998 … Then came Mockus" | IDB/World Bank case study: 80 (1993) → 22 (2004); decline began 1993, before either mayor; Mockus 1995–97, Peñalosa 1998–2000, Mockus again from 2000 or 2001 | One version in both places: "From a peak near 80 per 100,000 in 1993 to 22 in 2004", name both administrations, fix the 1998 chronology and Peñalosa's term. |
| E | Ch. 3 memory paragraph | Three cases "trace back to memory management failures"; "most … in the history of computing" | Heartbleed: bounds check; Code Red: buffer overflow; Morris: one of four routes; Microsoft ~70% of CVEs (2019), Chromium ~70% (since 2015), Android 76% (2019) → 24% (2024) | "memory-safety bugs"; replace "history of computing" with the Microsoft/Chromium/Android figures and years, cited. |
| F | Ch. 1 | "in partnership with Cornell and UCSF" | PNAS: Facebook and Cornell; UCSF is one author's later address | "Facebook and Cornell researchers". |
| G | Ch. 1 | "proved, unequivocally"; "without their informed consent" as fact | Effect sizes as small as d = 0.001; the paper cites the Data Use Policy as consent and PNAS called consent a concern | "showed evidence of"; state that consent is disputed and why. (Slate §4, READ by another session; the d = 0.001 point I also read.) |
| H | Ch. 1 | Meadows' top item is "the paradigm" | Top item is the power to transcend paradigms; paradigm is second | One-clause fix. |

## Tier 2: right figure, loose framing or unsourced extras

| # | Where | Issue | Proposed fix |
|---|---|---|---|
| I | Ch. 2, House of Cards | $100M was a press report disputed at the time; "almost entirely" on data goes beyond Sarandos, who named the creative team and source material | "reported at about $100 million (Netflix did not confirm)"; "data was one input" |
| J | Ch. 2, $1B | Correct as a Netflix estimate for personalization and recommendations together | Attribute: "Netflix researchers estimated in 2015 …" and cite Gomez-Uribe & Hunt |
| K | Ch. 6, GPT-3 | Figures right (estimates); "120 homes" and "one person's lifetime" are not in Patterson et al. | Keep the two figures as estimates; drop the comparisons or add a separate source; the paper's own comparison is about 3 jet round trips SF–NY (305% of one) |
| L | Ch. 6, cobalt | 70% is right for 2020–21; USGS now gives 73–76% | State the year; update to the latest USGS figure |
| M | Ch. 7, GM bracket | Figures match GM's May 2018 release, which calls it a proof-of-concept; "for electric vehicles" is not in the release | Add "proof-of-concept"; drop "electric" or source it |

## Tier 3: no source found, so the author must source, relabel or cut

| # | Where | Claim | Options |
|---|---|---|---|
| N | Ch. 9 and X (full text), `09.md` line 44 | 2016 Stanford pneumonia AI, 95% accuracy, deployed, shut down after six months; the repo opener instead says that two years later the radiologists were measurably worse | Nothing found for either ending. The nearest real items are CheXNet (Nov 2017, F1 scores, no deployment) and Zech et al. 2018 (poor external generalisation). Options: (1) replace with a sourced case (see `episode-slate.md` for the deployment-failure cases the other sessions found; I did not check which fits); (2) rewrite as a labelled composite or hypothetical; (3) cut. The two versions disagree with each other, so at minimum one must go. |
| O | Ch. 1 title | "$50 Million" | Title is an unsourced figure. Rename, or document where the number comes from. |
| P | Ch. 7, Huyen | "70% of ML projects never make it to production" | Find the page in her book, or attribute to the industry surveys that publish such figures, or cut. Book text was not available to me. |
| Q | Ch. X | Adoption 11% → 74% (slate) | Anonymous example; label as illustrative or cut |

## Tier 4: other conflicts the slate reports (not re-verified by this session)

Uber crash date and numbers (Ch. 6); Mars Climate Orbiter units (Ch. 1); Breakthrough Listen "1 million stars" vs 820 targets (Ch. 8); Big Dig $22B vs "in excess of $14 billion" (Ch. 4); diabetic-retinopathy "shut down" claim (Ch. 4); Neuralink typing (Ch. 5); Gender Shades, Parks (Ch. 6); MKUltra dates and totals (Ch. 9); NHS EHR (Ch. 9); Challenger and Feynman (Ch. 3). Take these from `episode-slate.md` §4 and the matching `receipts-ch*.md` files, which hold the locators.

## Synthesised voices: a separate question

Chapters 1, 5 and 7 carry a disclosure that expert perspectives are "synthesized" from published work. That does not cover facts the author states in his own voice, so the fixes above still apply. Whether to mark more clearly where quotes are constructed (Meadows, Huyen, Autor, Sarandos-type paraphrases) is an author decision, flagged here only.

## Suggested order of work

1. **Do first (low risk, clear source):** A, B, C, F, H, K, L, M. These are single-fact edits, each with a primary source and locator in `claims-audit.md`.
2. **Then (needs the author's wording):** D, E, G, I, J. Longer rewrites.
3. **Decisions for the author before any edit:** N, O, P, Q (cut, relabel or find a source). N matters most because it opens Ch. 9 and is summarised in Ch. X.
4. **Align the two copies** (full text and `src/content/chapters`) after each edit, then search the site for stale copies of each figure.
5. **Human check:** a person should open each cited source at the locator in the receipts and confirm before the edit is merged. This plan and the audit were produced without that check.

## Decisions I need from the author

1. For N: replace, relabel as composite, or cut?
2. For O: new title, or a source for the figure?
3. For D: keep Peñalosa as the chapter's hero, or share credit with Mockus as the sources do?
4. Do you want the corrections applied as edits to the manuscript repo and to `src/content/chapters`, or only handed to you as a list?

---

## Added 2026-10-17: items reported by the other receipts sessions

These come from hand-over messages from the other research sessions. **I did not verify them**, except that I confirmed the ch4-5 items appear in `receipts-ch4-5.md` (I searched it; I did not re-open the sources). Each line points to the file that holds the locators. Treat them as leads for the Tier 4 list above until a person checks them. No book file was touched.

Other sessions have also written `corrections-plan.md`, `book-corrections-for-author.md` and `correction-plan-addendum-ch1-3.md` in this folder. I have not read or merged them, so the lists may overlap.

| # | Chapter | Book says | Reported source finding | Detail in |
|---|---|---|---|---|
| R1 | 4 retinopathy | 95% accuracy; hospitals deployed it, many shut it down within months | Beede et al. (CHI 2020): >90% sensitivity and specificity; nurses at 3 clinics, prospective study; 393 of 1,838 images (21%) ungradable; no shutdowns reported | `receipts-ch4-5.md` 4A |
| R2 | 4 Sidewalk Labs | Doctoroff quote about coordination not being a blueprint | Not in his 7 May 2020 post, Waterfront Toronto's statement or its 26 Feb 2020 letter; he gives a financial-viability reason; "death spiral" is the book's framing | `receipts-ch4-5.md` 4B |
| R3 | 4 Big Dig | $22B, fifteen years | NTSB/HAR-07/02, p. 15: in excess of $14B, a 20-year effort | `receipts-ch4-5.md` 4C |
| R4 | 5 Neuralink | "typing messages"; Week 1/2/3 sequence | 8 May 2024 post lists text entry as future work and has no weekly sequence; it does report thread retraction and an algorithm fix | `receipts-ch4-5.md` 5B |
| R5 | 6 Gender Shades | "training data overwhelmingly biased toward lighter-skinned males"; "95% accuracy on Black female faces" | Skew figures are for public benchmarks, not vendor training data; follow-up (Raji & Buolamwini 2019) gives Aug 2018 darker-female error of 4.1%, 1.52% and 16.97% for three vendors. Ch. 7 "34% higher" should read a 34.7% error rate | `receipts-ch5-7.md` 6B |
| R6 | 6 Parks | Blurry surveillance image; "ten days" in jail | Complaint alleges the probe was a photo from a fake licence; "ten days" not stated in the pages read (pp. 2–15 of 29) | `receipts-ch5-7.md` 6C |
| R7 | 6 Williams | 30 hours; $300,000 | 30 hours is the plaintiff's allegation; $300,000 appears only in AP reporting; settlement amount redacted | `receipts-ch5-7.md` 6C |
| R8 | 5/6 Myanmar | "not doing enough" | Wording is Facebook's description of BSR's finding; UN says "slow and ineffective"; the book does not name Myanmar | `receipts-ch5-7.md` 5C |
| R9 | 7 Amazon hiring tool | "women's" penalty | Rests on anonymous-source Reuters reporting; no primary document found; swap candidates named but unread | `receipts-ch5-7.md` 7A |
| R10 | 9 MK-Ultra | 1953–1973, "twenty years"; "hundreds of millions of dollars"; "zero validated intelligence applications"; "150 projects"; "chemist-director" | Director's testimony: 1953–1964 (1973 is the records-destruction date); no program-wide dollar total found; sources record some operational use; 149 subprojects; Gottlieb headed the Technical Services Staff | `receipts-ch9-x.md` 9C |
| R11 | 1/4 2008 crisis | "computer models gone haywire" as the cause | FCIC report rejects that framing; its model passages concern rating-agency CDO models, not banks' risk models | `receipts-ch9-x.md` XA |
| R12 | 3 Challenger | "nobody coordinated" findings with the temperature | Thiokol engineers recommended no launch below 53°F and were overruled (Rogers Vol. I Ch. V); the ice-water remark is in the 11 Feb 1986 hearing, not Appendix F | `receipts-ch1-3.md` 3A, `correction-plan-addendum-ch1-3.md` |

**Slate housekeeping reported by the same sessions** (these concern `episode-slate.md`, not the book): the "172-page scan" of the MK-Ultra hearing is a 238-page web capture; the Zillow "shareholder letter" file is the press release; the JAMA URL for the Epic sepsis paper may point to an editorial; the Zillow item has been retired in favour of Moody's CDO correlation.

**Unread areas the sessions say remain open:** Parks complaint pp. 16–29; the full FCIC report (about 620 pages) and dissents; the Missouri Commission decision on Hyatt; GAO-14-694 and NAO 2011 parts 2–5; Epic's own statement; Columbia and Horizon replacement sources.

**My four decisions for the author still stand** (N, O, D, and whether to apply edits). Nothing in R1–R12 changes them, except that R10 and R12 add Ch. 9 and Ch. 3 to the Tier 1 candidates once a person confirms the sources.

---

## Added 2026-10-17 (later): how the plan files fit together, and gaps closed

Three plan files now sit in this folder, written by different sessions. They overlap but have different jobs:

| File | Use it for |
|---|---|
| `book-corrections-for-author.md` | The list to hand to the author: every place the text and a source disagree, grouped as contradicted / not found / goes further than the source / not checked. The most complete list. |
| `correction-plan.md` (this file) | The ten audited claims with proposed wording, tiers and order of work (A–Q), plus R1–R12 from the other sessions. |
| `corrections-plan.md` | Inventory of the receipts files, what is still unread, and the batches of reading still needed (Batch D onward). |
| `correction-plan-addendum-ch1-3.md` | Extra detail on Facebook, Challenger and Therac-25 and on slate wording. |

**Checked against each other (by reading the files, not the sources):** the contradicted and not-found items in this file's Tiers 1–3 and R1–R12 also appear in `book-corrections-for-author.md`, with the same figures. I did not find a case where two files give different numbers for the same claim.

**Items that were not in this file and are now:**

- **R13, Ch. 1 Facebook wording.** The study reduced exposure to posts (positive for one group, negative for another); it did not add content. About 155,000 people per condition posted in the window and entered the analysis, so "689,003 had their feeds manipulated" describes the sample frame, not the analysed group. Reported in `receipts-ch1-3.md` §1A.4.
- **R14, Ch. 3 Therac-25.** Reported finding: the hardware interlocks were "not duplicated", not "removed". The receipts session's total of three deaths is its own tally; the Leveson and Turner paper gives no total. `receipts-ch1-3.md` §3B, and `corrections-plan.md` section 4, item 7.
- **R15, Challenger criticality sequence.** The CAIB report (p. 196) and Rogers Vol. I (pp. 125–128) describe the O-ring criticality sequence differently (as the ch7-9 session reports it). Unreconciled; check both before an episode relies on the sequence. `receipts-d-followup.md` §3A.

**Open discrepancies reported by the ch7-9 session** (all listed in `corrections-plan.md` section 4): Apollo Table 5-I times versus an ALSJ note; NHS Figure 5 (4 trusts) versus paragraph 18 (10); the Hyatt dates and phone call resting on a secondary case study; the JAMA URL possibly pointing to an editorial; FCIC years on AIG and Moody's pages taken from context. None affects the book corrections above, which concern other claims.

**Still true:** nothing here has been checked by a human, and no book file has been changed.
