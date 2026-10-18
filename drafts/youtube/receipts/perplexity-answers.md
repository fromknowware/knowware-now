# Perplexity answers compared with our research

2026-10-17. Perplexity answered queries A1–A10 and B1–B9 (see `perplexity-queries.md`). B10–B12 were not answered. Each row below says what Perplexity reported, what our own re-fetch found when we opened the cited page, and the status. **Nothing here is human-checked.** "I opened" means an AI session downloaded the page and searched it; Perplexity's own quotes and URLs were treated as leads.

## Where Perplexity was wrong or unsupported (three items found so far)

| Item | Perplexity said | What the page says | Effect |
|---|---|---|---|
| B4 | Autodesk release on GM bracket dated "September 8, 2018" | The Autodesk article is dated **3 May 2018**. Figures match (40% lighter, 20% stronger). | Perplexity's date is wrong. Our date range (May 2018) stands. |
| B5 | OpenSSL advisory names `dtls1_process_heartbeat` / `tls1_process_heartbeat` | The advisory text (the whole file) contains neither function name; it says "missing bounds check" and "up to 64k of memory". | The function names come from somewhere else (probably the fix commit), not the advisory. The advisory still supports the bounds-check point. |
| B7 | Patterson et al. compare GPT-3's energy to "123 U.S. homes" | In the paper's text "123" appears only as a TPU TeraFLOPS figure, and the only "homes" is an analogy about LED bulbs. The homes claim rests on an SF Examiner article. | Not in the paper. Our finding stands: the paper has 1,287 MWh and 552.1 tCO2e and no homes or lifetime comparison. |

Perplexity also quotes "1,287 gigawatt hours" from a NIST comment and then corrects it to MWh. Patterson Table 4 gives MWh.

## Row by row

| Q | Perplexity | What we found when we opened the source | Status |
|---|---|---|---|
| A1 | >90% sensitivity and specificity is stated in Beede et al. (ACM full HTML); image totals, ungradable count and any clinic stopping not verified | Same >90% figure appears in the receipts. We could not open the full text either. | **Agree on >90%. Numbers and any shutdown still unchecked by anyone this pass.** |
| A2 | Not verified (only a UNT link to the CAIB volume) | Not verified by us either | **Still open** |
| A3 | ACLU-NJ amicus brief says Parks "spent ten days in jail"; ACLU case page says a "blurry and shadowed image of this driver license photo" | **I opened the brief**: it says "spent ten days in jail" (and cites an expert report, ECF 109-5, saying "10 days"). It is an advocacy brief, not the complaint. The case page was not opened by me. Our complaint reading (p. 6 ¶23: photo from the fake licence) is consistent. | **"Ten days" now has a court-filed source. The book's "blurry surveillance image" still differs from the filings.** The CNN "11 days" report is Perplexity's only and unchecked by me. |
| A4 | 30 hours is the complaint's allegation (ACLU page); settlement documents give no dollar amount | Matches our receipts (30 hours is an allegation; $300,000 only in news reporting). Neither side has the City's answer's wording. | **Agree** |
| A5 | New source: Texas A&M ethics collection excerpt of the 1985 Missouri decision | **I opened it**: it carries Case No. AR840239, the Missouri Board v. Duncan, Gillum and G.C.E., and says the double-hanger-rod change was made in February 1979, with the telephone calls disputed. I did not read it end to end. | **New lead, partly confirmed.** Who approved the change is not yet established. |
| A6 | IEEE Spectrum: Burkhart played Guitar Hero "in 2015" | **I opened it**: "In 2015, a group of neuroscientists and engineers assembled to watch a man play the video game Guitar Hero", and it names Burkhart as that participant. Trade press, not the Nature paper or a release. | **New lead.** If right, the session predates the April 2016 reports (the Nature paper was received August 2015). The book's 2020 is still unsupported. |
| A7 | Deadline first reported "more than $100 million" (via the NYT); Netflix confirmed 26 episodes, not the price | Matches AllThingsD, which we read. The NYT article was not opened by me. | **Agree** |
| A8 | Not done | | **Still open** |
| A9 | Mockus's second term 2001–03; Harvard Gazette (Mar 2004) says he "finished his second term as mayor this past January" | **I opened the Gazette**: that sentence is there. | **Supported by the Gazette; no Bogotá official page yet.** |
| A10 | Only 1993 ≈ 80 found; other years not found | The Harvard Gazette (which quotes Mockus) says **80 in 1993 to 22 in 2003**; the World Bank/IDB case study says 22 in **2004**. The two differ by one year for the same figure. | **Year of the "22" needs an official table** |
| B1 | No source for the Stanford story; nearest items are CheXNet and CheXpert | Matches ours | **Agree** |
| B2 | No $50 million in the paper or the Expression of Concern | Matches ours | **Agree** |
| B3 | Airbus 3 Mar 2016, Autodesk newsroom 1 Dec 2015, 45% (30 kg); no 2019 | **I opened the Autodesk page**: dated 1 DEC 2015, "45 per cent (30 kg)". | **Agree** |
| B4 | 40%, 20%, eight into one; not for EVs; dated 8 Sep 2018 | Figures agree; date wrong (3 May 2018). The Autodesk article mentions electric vehicles only in a general GM quote about the future and about range. It does not say the bracket was for EVs. | **Agree on figures; date corrected** |
| B5 | Heartbleed bounds check; Morris several routes; Code Red buffer overflow | Matches ours except the function-name point above | **Agree on causes** |
| B6 | Microsoft ~70%; Android 76% → 24%; Chromium not retrieved | Matches ours (we opened Chromium, MSRC and Google directly) | **Agree** |
| B7 | 1,287 MWh and 552.1 tCO2e; "123 homes" | See top table | **Figures agree; homes claim unsupported** |
| B8 | USGS 74% (2023), 76% (2024), 73% (2025) | Matches ours | **Agree** |
| B9 | Not done | | **Still open** |
| B10–B12 | Not done | | **Still open; re-send these three** |

## Net effect on our files

- **Burkhart:** the claim that Guitar Hero was reported in April 2016 still holds, but the session itself may be 2015 (IEEE Spectrum). The book's 2020 is unsupported either way. Worth a line in `claims-audit.md` and the checklist once a person confirms.
- **Parks:** "ten days" now has a court-filed source, so the correction plan should keep the licence-photo point and drop the doubt about the number of days.
- **Mockus:** the Gazette supports a 2001–03 second term; the World Bank text's "2000–2003" looks like the outlier.
- **GM bracket:** the Autodesk blog, 3 May 2018, is a second source for the figures.
- **Hyatt:** the Texas A&M excerpt is the closest we have to the Missouri decision.
- **Our files not yet edited.** This file is the only change.

## Still to ask Perplexity

A2, A8, A9 (an official Bogotá source), A10 (official table), B9, B10, B11, B12. Re-send them with the preamble.

---

## Deep search, 2026-10-17 (second AI pass; not a human check)

An AI session searched and opened sources for the items Perplexity could not do. "Opened" means downloaded and searched.

| Item | Result | Source opened |
|---|---|---|
| **A1 Beede** | **Confirmed.** The paper says the algorithm has specialist-level accuracy (">90% sensitivity and specificity") for referable cases; "Out of 1838 images … (in the first six months of usage), 393 (21%) didn't meet the system's high standards for grading." No wording about stopping, discontinuing or abandoning the system appears in the full text. | dl.acm.org/doi/fullHtml/10.1145/3313831.3376718 (via the browser pane) |
| **A2 CAIB vs Rogers** | **The two reports do disagree.** CAIB Vol. 1, p. 196, says the joint "had been elevated to a Criticality 1 item" and "was later demoted to a Criticality 1-R (redundant)", then closed out the month before Challenger's launch. Rogers Vol. I Ch. VI says it was classified 1R on 24 Nov 1980, then its status was "changed to Criticality 1", with a waiver granted in March 1983, and that documents kept calling it 1-R "long after the status was changed to Criticality 1". So CAIB's order is 1, then 1-R; Rogers' order is 1R, then 1 with a waiver. | CAIB chapter 8 PDF (nasa akamai mirror); history.nasa.gov/rogersrep/v1ch6.htm |
| **A5 Hyatt** | **Partly resolved, via a secondary summary.** The Texas A&M teaching guide, citing the Missouri decision (Case AR840239, 14 Nov 1985, pp. 54–63), says the fabricator Havens made the single-to-double hanger-rod change, the phone calls about it are disputed, and G.C.E. returned the revised drawings on 26 Feb 1979 "stamped with Gillum's engineering review seal, authorizing construction". The decision itself was not obtained. | ethics.tamu.edu/wp-content/uploads/sites/7/2017/04/HyattRegency.pdf |
| **A8 Bessen** | **Partly resolved.** Bessen's F&D article (opened) gives tellers per average urban branch falling from 20 to 13 (1988–2004) and urban branches up 43%; it shows the teller totals only in Chart 1 (an image), and gives over 400,000 ATMs. Autor (2015) gives the 500,000 to about 550,000 figure and attributes it to Bessen. No source found for 300,000 in 1970. | imf.org/external/pubs/ft/fandd/2015/03/bessen.htm (browser pane) |
| **A9 Mockus term** | **2001–2003 supported by three non-official sources**: Wikipedia (1 Jan 2001 to 31 Dec 2003), the Harvard Gazette (March 2004) and the think-tank paper. No Alcaldía or Concejo page found. El Tiempo adds that he left a year before the end of his term. | search results and earlier pages |
| **A10 Bogotá homicides** | **An official-institute table found.** Acero (Bogotá's security sub-secretary 1995–2003), Biomédica 22, 2002, Cuadro 1, source Instituto Nacional de Medicina Legal, rate per 100,000: **1993 79.0; 1994 69.7; 1995 58.9; 1996 56.5; 1997 47.1; 1998 40.5; 1999 39.0; 2000 34.8; 2001 30.7**. 2002–2004 not found in an official table; Mockus (Gazette) says 22 in 2003, the World Bank case study says 22 in 2004, and a news report says 25.4 in 2003. | redalyc.org/pdf/843/84309605.pdf |
| **B9 MK-Ultra** | **Dates confirmed, no program total found.** Turner's statement in the 1977 hearing: "conducted from 1953-1964". No program-wide dollar total in the hearing text; it mentions "millions of dollars" in a quoted report and "more than $1 million of matching funds" for a hospital fund. "Hundreds of millions" is not there. Church Book I was not re-opened in this pass. | CIA PDF of the 1977 hearing (earlier fetch) |
| **B10 Huyen** | **Still not found.** Searches found no statement of 70% by Huyen. An InfoQ article on why ML projects fail (author not identified in the text I opened) cites older studies up to 85% and a 2023 Rexer Analytics survey in which only 32% of practitioners said projects reached production. **Inference:** 32% reaching production would be about 68% not reaching it, which may be where a "70%" comes from. No source says Huyen said it. | infoq.com/articles/why-ml-projects-fail-production/ |
| **B11 Neuralink** | Already confirmed in the Part 2 re-check. | |
| **B12 Challenger** | Already confirmed in the Part 2 re-check. | |

### What the Bogotá table changes

By 1998, when Peñalosa took office, the rate had already fallen from 79.0 (1993) to 40.5, a fall of about 49%. Taking about 22 as the end point, that is roughly two thirds of the whole fall (38.5 of 57 points): **more than half of the fall happened before his term began.** Mockus's first term (1995–97) saw 58.9 to 47.1. During Peñalosa's term (1998–2000) the table goes from 40.5 to 34.8. The book's chapter text credits Peñalosa; the repo opener credits Mockus. Neither matches the way the figures are distributed. (Acero was a city official and a party to those policies; the underlying numbers are Medicina Legal's.)

### Still open after this pass

- The Missouri decision itself (A5); an Alcaldía or Concejo page for Mockus's second term (A9); official homicide figures for 2002–2004 (A10).
- Bessen's Chart 1 numbers (read the image) and a source for 300,000 in 1970 (A8).
- Church Committee Book I wording on dates and cost (B9).
- Whether Huyen says "70%" anywhere in the book (B10); the book text was not available.
- Everything in Part 1 and Part 2 still needs a human check.
