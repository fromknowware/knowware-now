# Receipts follow-up (batch D): XA AIG, XC Moody's, 1A, 3A, 3C

Written 2026-10-17 by a Claude session. **Nothing here has been checked by a human, and I am not a human check.** This file says what I read, not what I believe. Mine means my own arithmetic or inference. Quotes are 15 words or fewer, at most three per fact; everything else is paraphrase.

**Scope.** This pass covers only the five thin reads from batch D of `corrections-plan.md`: the AIG chapters and the Moody's sections of the FCIC report (slots XA, XC), the PNAS correction (1A), the Rogers Commission chapters VI to IX (3A), and the Heartbleed code history (3C). **Not done in this pass:** the other batch D reads (the Parks complaint pp. 16 to 29, BSR section 3, the Missouri Commission decision, NAO Parts 2 to 5, JAMA page and supplement, the Mission Control loop, MKUltra remainder), and Facebook's own statement for 1A (I did not attempt it).

---

## XA. AIG Financial Products (Chapter X, FCIC Final Report)

### 1. Document and how I read it

*The Financial Crisis Inquiry Report*, Financial Crisis Inquiry Commission, January 2011, 663 PDF pages. I downloaded https://www.govinfo.gov/content/pkg/GPO-FCIC/pdf/GPO-FCIC.pdf (SHA-256 `4ff588a6...2ae7c`, same file as the earlier session). **The PDF's text layer drops all digits**, so I took words from `pdftotext` and read the page image (rendered with `pdftoppm`) for every number I quote. Printed page = PDF page minus 29, confirmed on the images of printed pages 147, 148, 201, 243, 266, 267 and 352.

Pages I found by counting "AIG" per page and read:
- **Read in full (text):** printed 140 to 142; 200 to 202; 243 to 244; 266 to 268 (images for 201, 243, 266, 267); 350 to 352 (image for 352).
- **Read only as extracted sentences containing "know", "aware", "surprise", "understand" and similar words:** printed 269 to 273 and 344 to 349. I did not read these pages through.
- **Not read:** printed 376 to 379 (searched, no hits) and everything else in the 663 pages.

### 2. Receipts (printed page numbers)

1. **What the unit did (pp. 140 to 141).** AIG Financial Products wrote credit default swaps on super-senior CDO tranches, relying on the parent's triple-A rating. AIG posted no initial collateral on writing the contracts, but agreed to post collateral if the underlying securities fell in value or AIG's own long-term debt rating was cut. The Commission says these terms "would have an enormous impact on the crisis".
2. **Growth (p. 201).** By June 2007 AIG had written swaps on $79 billion in multisector CDOs, five times the $18 billion held at the end of 2005 (page image).
3. **The people who doubted it (pp. 200 to 201).** Gene Park and Andrew Forster raised doubts in 2005; Park, citing a consultant, found the CDOs were mostly subprime and Alt-A. By February 2006 Park and others persuaded Cassano and the swap salesman, Alan Frost, to stop writing subprime CDS protection. The unit nevertheless completed 37 deals between September 2005 and July 2006, one on a CDO backed 93% by subprime assets (page image). Park said "I'm not getting paid enough to stand on these tracks" (p. 200).
4. **Who knew the collateral terms: two accounts (pp. 201 to 202).** Park said neither he nor most others at AIG knew the swaps entailed collateral calls if market value fell; their worry was only defaults. Cassano told the Commission he did know about the possible calls. AIG's SEC filings for that year mentioned the risk of collateral calls only on a downgrade.
5. **The Commission's statement (p. 243, page image).** CEO Martin Sullivan, CFO Steven Bensinger, Chief Risk Officer Robert Lewis, Chief Credit Officer Kevin McGinn and division CFO Elias Habayeb "told FCIC investigators" they did not know the collateral terms until the calls arrived in July 2007. The Office of Thrift Supervision "didn't know either". Frost knew and thought the terms were industry standard; Cassano "also knew". The counterparties knew. Goldman held $21 billion of AIG's super-senior swaps and sent the first collateral call by email on July 26, 2007.
6. **The same-company counter-account (p. 266, page image).** The first call was "a shock" to most senior executives. Park said the first rule at the unit was never to post collateral. But **Jake Sun, the unit's general counsel, reviewed the swap contracts before they were executed** and said the provisions were standard at AIG and in the industry; Frost agreed; the head of the unit's risk department, Pierre Micottis, said such provisions were common in derivatives but surprising in super-senior CDS contracts that were considered safe.
7. **No valuation model, no hedge (pp. 266 to 267).** The unit had no model of its own to value the CDO portfolio it insured, and had not hedged. It relied on an actuarial model built by consultant Gary Gorton that found, at 99.85% confidence, no real economic loss on the super-senior tranches, and that did not estimate their market value. PricewaterhouseCoopers, "apparently also not aware" of the collateral requirements, concluded the default risk had been effectively removed. Cassano halted a $150 million hedge that was losing money (images of pp. 266 and 267).
8. **The disputed marks (p. 267, page image).** After AIG pushed back, Goldman cut its July 27 demand from $1.8 billion to $1.2 billion. Goldman valued the CDOs at 80 to 97 cents on the dollar; Merrill Lynch valued the same securities at 95 to 100 cents. AIG managers phoned other dealers for marks, which were not "actionable" (would not trade at those prices).
9. **What was said publicly (p. 268, text only).** On the August earnings call Cassano and Chief Risk Officer Lewis said they could see no scenario of loss. The Commission says no one on the call mentioned Goldman's collateral demand, the prospect of larger calls, or the risk of a large mark-down. (The day-of-month and the dollar amounts were dropped by the text layer and I did not render this page.)
10. **The regulator (pp. 350 to 351).** OTS former director John Reich told the Commission that as late as September of the crisis year he had "no clue" what AIG's CDS liability was (the year digit was dropped; context is 2008). An OTS review in July, a week before Goldman's first call, judged the CDS risk too small to measure and put off a detailed review. An in-depth review began only ten days before AIG went to the Fed. Reich said the OTS had never fully understood the Financial Products unit.
11. **The Commission's conclusion on the AIG chapter (p. 352, page image).** AIG failed and was rescued "primarily because" its CDS sales were made without initial collateral, capital reserves or hedging, "a profound failure in corporate governance, particularly its risk management practices". It also names deregulation of OTC derivatives, regulatory arbitrage and the OTS's failure. The government committed more than $180 billion.
12. **A regulatory counterfactual (p. 352).** Had the swaps been regulated as insurance, AIG would have needed capital reserves and would not have been able to enter contracts requiring collateral posting.

### 3. Does it support the slate's angle?

The slate narrowed XA to "who knew the collateral-call terms and who did not" (FCIC p. 243).

**Partly supported, and more complicated than "the top did not know".**
- Supported: receipt 5 (named executives and the supervisor did not know; the salesman, the division CEO and the counterparties did).
- Complicating, from the same Commission text: the unit's own general counsel reviewed the contracts and called them standard (receipt 6); the unit's CEO says he knew (receipt 4); the people who doubted the business did not know the terms (receipt 4); the auditor apparently did not know (receipt 7). So the knowledge sat with the sellers and counterparties, partly with the lawyers, and not with the governance layers or the dissenters.
- The executives' statements are what they "told FCIC investigators" after the fact; I found no passage where the Commission tested them beyond Sun's and Frost's accounts.
- The Commission's own headline is governance and risk management, plus deregulation (receipt 11). A script titled on "nobody knew" would overstate the Commission; the narrower, defensible claim is about who held the collateral terms.
- Recommendation: keep XA narrowed, with receipts 5, 6 and 7 as the spine. **Still unread:** printed pp. 269 to 273 and 344 to 349 (read only as keyword sentences), and the rest of the report.

### 4. Differences from the book

No new comparison; see `receipts-ch9-x.md` §XA.4. This pass adds nothing about the book.

### 5. Status

**READ** for the passages above; the pages marked as keyword-only are not READ.

---

## XC. Moody's CDO ratings and the correlation assumption (Chapter X, FCIC Final Report)

### 1. Document and how I read it

Same FCIC PDF. Moody's sections found by counting "Moody" per page. **Read in full (text):** printed pp. 146 to 150 ("Moody's: 'Achieved Through Some Alchemy'") and 206 to 208 ("Moody's: 'It Was All About Revenue'") plus the first lines of p. 209; page images for 147 and 148. **Not read:** printed 118 to 121 ("Moody's: 'Given a Blank Check'"), 221 to 223, and the rest of the report (including the conclusions on rating agencies at p. xxv, read by the earlier session).

### 2. Receipts

1. **The two things Moody's had to estimate (p. 146).** The probability each mortgage security in a CDO defaulted, and the correlation of defaults. For probability, Moody's "relied almost exclusively" on its own ratings already given to those securities and did not look through to the underlying mortgages. Gary Witt, a former team managing director in the CDO unit, said "We took the rating that had already been assigned".
2. **Correlation by judgment (p. 147, image).** Moody's said in an early explanation that without default data it was impossible to measure default correlation empirically; it relied on analysts' judgment. Witt said Moody's lacked a good model and "made them up". Witt developed a methodology in mid-2004 that built in correlation, not applied to CDO ratings for another year. In early 2005 he proposed a "look through" study of a few CDOs; superiors approved it but contractual disagreements stopped him buying the software. In June 2005 Moody's updated the approach using 20 years of data from a period of rising house prices and low delinquency, then added ad hoc adjustments.
3. **Lower correlation than credit cards (p. 148, image).** Using these methods Moody's estimated two mortgage-backed securities would be less correlated than two backed by credit card or auto loans. The other main agencies "followed a similar approach". A June 2005 report of the Bank for International Settlements warned about concentrations of risk in tranched products.
4. **Stability statistics in pitch books (p. 148, image).** Every pitch book the Commission staff examined cited a Moody's or S&P analysis: between 1983 and 2006, 92% of these new products had no rating change in twelve months against 78% of corporate bonds; but only 56% of triple-A structured finance securities kept their rating after five years. Underwriters kept using the statistics in 2006 and 2007.
5. **What happened (p. 148, image).** In 2007, 20% of U.S. CDO securities were downgraded; in 2008, 91%.
6. **Reversal and mistakes (p. 149).** In late 2008 Moody's replaced its key CDO assumptions with an asset correlation assumption two to three times higher (the year was read from the earlier session's image; this pass saw the text only). The Commission says the models made two key mistakes: assuming diversification across securities that were not very different, and rating CDOs on ratings the agencies had themselves assigned. Bernanke told the Commission they "did not take into account" the right correlation.
7. **Resources (p. 149).** Witt: the unit was "under-resourced" and had "almost no ability to do meaningful research"; new methodology work was done "in our spare time". Eric Kolchinsky said deals rated rose sharply while personnel did not.
8. **Incentives (p. 150).** Lower correlation assumptions allowed larger triple-A tranches; issuers could choose among agencies and the agencies depended on issuers for revenue, so agencies felt pressure to give favorable ratings; many analysts left to join banks.
9. **Culture dispute (pp. 206 to 208).** Former Moody's staff (Kolchinsky, Fons, Witt, McCleskey, Froeba) say that after the company listed, revenue and market share dominated. Chairman and CEO Raymond McDaniel and Brian Clarkson, president of Moody's Investors Service, say ratings quality was paramount and disagree with that account; Clarkson said he did not remember the compliance remark McCleskey recalled. Per the Commission, of the performance goals for managing directors only ratings quality was impossible to measure in real time.
10. **Witt's "smoking gun" (p. 208).** In a town-hall meeting after Moody's announced mass downgrades, Witt recalled managers discussing the financial outlook and not ratings accuracy; the Commission reports this as his recollection.

### 3. Does it support the slate's angle?

**Supported as Good, with one correction to the framing.** The slate's XC text says the report says Moody's "lacked a good correlation model" and that "its insider's proposal for a 'look through' method stalled" (receipts 1, 2). Both are in the Commission text, as Witt's testimony.
- **Where the knowing sat.** An insider held the concern and proposed a test; it was approved but not carried out because of a software-purchase dispute (receipt 2). A June 2005 BIS warning was public (receipt 3). So the knowledge that the correlation assumption was weak existed inside Moody's and outside it, and did not change the ratings. That fits the channel's premise better than "nobody held it".
- **Contested.** Culture and motive claims are from former staff and are denied by current executives (receipt 9). The correlation facts (receipts 1 to 5) are the Commission's own narrative, resting mainly on Witt's testimony; I did not check them against Moody's own documents.
- **Unread:** printed pp. 118 to 121 and 221 to 223, and Moody's own methodology documents.

### 4. Status

**READ** for printed pp. 146 to 150 and 206 to 208. Not read: the rest of the Moody's material. The slate's note "read the full Moody's section" is partly done.

---

## 1A. Facebook emotional-contagion study: the PNAS correction

### 1. Document

"Correction for Kramer et al., Experimental evidence of massive-scale emotional contagion through social networks", PNAS 111(29):10779, July 3, 2014 (PMC issue date July 22, 2014), doi 10.1073/pnas.1412583111; https://pmc.ncbi.nlm.nih.gov/articles/PMC4115523/. Read in full (it is one paragraph and the corrected author lines). Note: the earlier receipts said the correction had not been found; this is it.

### 2. Receipts

1. The correction is about affiliations only. It states that when the study was done the middle author, Jamie Guillory, was a graduate student at Cornell under senior author Jeffrey Hancock, and "is now" a postdoctoral fellow at the Center for Tobacco Control Research and Education, University of California, San Francisco.
2. The corrected author lines: Kramer, Core Data Science Team, Facebook; Guillory and Hancock, Cornell Departments of Communication and Information Science; UCSF appears only as Guillory's present address (footnote 2).
3. The correction says nothing about consent, the Data Use Policy, review boards, or the study's findings.

### 3. Effect on earlier claims

- The correction confirms what `receipts-ch1-3.md` said about the book's "in partnership with Cornell University and UCSF": UCSF is a later address, not a study partner.
- **Not read:** Facebook's own statement (Kramer's June 2014 post) or any other statement from Facebook; I did not attempt to fetch it. The slate's 1A coverage should still say Facebook's own statement is unread.

### 4. Status

Stays **READ** (paper, Expression of Concern, Cornell statement, and now the correction). Facebook's own statement: not read.

---

## 3A. Challenger: Rogers Commission Volume I, chapters VI and VII

### 1. Documents and how I read them

Report of the Presidential Commission on the Space Shuttle Challenger Accident, Volume I (1986): Chapter VI "An Accident Rooted in History", Chapter VII "The Silent Safety Program", Chapter VIII "Pressures on the System", Chapter IX "Other Safety Considerations". Downloaded from https://history.nasa.gov/rogersrep/v1ch6.htm to v1ch9.htm (they redirect to nasa.gov/history/rogersrep/). I read: Chapter VI's opening (p. 120) and the criticality passages (pp. 125 to 128); Chapter VII's opening (p. 152) and searched it for communication failures. I searched Chapters VIII and IX for related terms but read no body passages; I record no receipts from them. Page numbers are the Commission's printed page markers in the HTML. Most of Chapter VI (printed pp. 129 to 151), the rest of VII, and VIII and IX are **not read**.

### 2. Receipts

1. **Chapter VI opening (p. 120).** The Commission says Thiokol did not accept the implication of early tests that the joint had a serious flaw; NASA did not accept its engineers' judgment that the design was unacceptable and minimized joint problems in management briefings and reports. As damage to the O-rings was confirmed, both raised the amount of damage considered acceptable; at no time did management recommend a redesign or call for grounding.
2. **The criticality change (pp. 125 to 126).** After tests and a lightweight-case test, Marshall management accepted that the secondary O-ring stopped being functional once the joint rotated at about 40 percent of maximum operating pressure; the dual O-rings were therefore not fully redundant, and the classification was changed from Criticality 1R to Criticality 1 at Marshall on December 17, 1982.
3. **The waiver (pp. 127 to 128).** The Criticality 1 status was waived by NASA Levels I and II in March 1983, approved on March 28, 1983 by the Associate Administrator for Space Flight (Technical), L. Michael Weeks, and processed outside the formal Program Requirements Control Board. The Commission says the waiver itself does not carry the caveat that the secondary seal was redundant except in worst-case tolerances. Weeks said the booster was among "the least worrisome things" in the program. The waiver was signed less than a week before STS-6 launched on April 4; two interviewees said it was approved so STS-6 could fly, and Weeks denied any connection.
4. **Who was told (p. 128).** Some Thiokol engineers and officials said they had no notice of the reclassification and waiver; the Commission concludes from the signatures and distribution that Thiokol officials were sent copies and took part. It also found several documents tracking the erosion at Thiokol and Marshall still labelled the seal Criticality 1-R long after the status had changed.
5. **Chapter VII opening (p. 152).** After many hours of testimony the Commission was surprised that NASA's safety staff was never mentioned. No one thought to invite a safety representative or reliability and quality assurance engineer to the January 27, 1986 teleconference between Marshall and Thiokol, and no safety representative was on the Mission Management Team that made key decisions during the countdown on January 28.
6. **The program manager's list (p. 152).** On April 3, 1986, Space Shuttle program manager Arnold Aldrich described five communication or organization failures affecting the launch decision; the Commission says four relate to the safety program: lack of problem-reporting requirements, inadequate trend analysis, misrepresentation of criticality, and lack of involvement in critical discussions.

### 3. Effect on the slate

- Supports the revised framing (the knowing sat with the engineers, was overruled, and did not reach the deciders). It adds a second thread, new from this pass: a redundancy loss was formally recognized in 1982 (receipt 2) and then waived (receipt 3), and later tracking documents still used the old label (receipt 4), so even the formal record carried the wrong status forward. That is a stronger "the knowing was written down and still did not travel" than the temperature story alone.
- Caveat for scripting: Thiokol's claim not to have been notified and the Commission's contrary inference (receipt 4) are in dispute in the text itself; and whether the waiver was approved to let STS-6 fly is contested (receipt 3).
- Differences from the book: unchanged from `receipts-ch1-3.md` §3A.4.

### 4. Status

**READ**, now covering Chapter VI (opening and pp. 125 to 128) and Chapter VII (p. 152) as well as the earlier passages. Most of VI, and VII to IX, not read.

---

## 3C. Heartbleed: the OpenSSL code history

### 1. Documents and how I read them

The OpenSSL advisory (April 7, 2014) was read in the earlier pass and is not repeated. This pass added two primary records from the OpenSSL repository, fetched through GitHub's API (`api.github.com/repos/openssl/openssl/commits/<sha>`), which returns the commit message, dates and the patch:
- the commit that added heartbeat support: `4817504d069b4c5082161b02a22116ad75f822b1`
- the commit that fixed it: `96db9023b881d7cd9f379b0c154650d6c108e9a3`

I read both commit messages and the relevant parts of the patches.

### 2. Receipts

1. **The introducing commit.** Dated 2011-12-31 22:59:57 UTC, author field "Dr. Stephen Henson". Message: "PR: 2658. Submitted by: Robin Seggelmann. Reviewed by: steve. Support for TLS/DTLS heartbeats." It touches 20 files, including `ssl/t1_lib.c` and `ssl/d1_both.c`.
2. **What the added code does.** The new `tls1_process_heartbeat` reads a 2-byte payload length from the received message and copies that many bytes into the reply (`memcpy(bp, pl, payload)`). In the added lines of `t1_lib.c` I found no comparison of that length against the length of the received record (the only uses of "length" are comments and a message-callback call). This is my reading of the diff, not a statement the commit makes.
3. **The fix commit.** Dated 2014-04-05 23:51:06 UTC, author field "Dr. Stephen Henson". Message: "Add heartbeat extension bounds check." It says a missing bounds check in handling the TLS heartbeat extension "can be used to reveal up to 64k of memory", credits Neel Mehta of Google Security with discovering it and Adam Langley and Bodo Moeller with preparing the fix, and cites CVE-2014-0160.
4. **What the fix adds.** Two checks in `tls1_process_heartbeat`: discard the message if it is shorter than the minimum, and discard it if the declared payload plus padding exceeds the record length; the code comment cites RFC 6520 section 4 for the silent discard.
5. **Dates.** The fix commit's date field is April 5, 2014; the advisory is dated April 7, 2014. I did not resolve the gap (a commit's date field is not necessarily the publication date).

### 3. What this does and does not give an episode

- It gives the record that one reviewer ("steve") is named on the commit that introduced the bug, and who found and fixed it. It does **not** say how much review the heartbeat code got, how many projects relied on it, or what the author or the project later said. Those need other documents: the author's own account, OpenSSL's post-mortem, the disclosure timeline, and funding or staffing facts, none of which I read.
- Premise fit: still **unknown**. The record shows a missing check that sat unnoticed for over two years (my arithmetic: December 31, 2011 to April 2014), but nothing I read shows anyone knew and did not pass it on.

### 4. Status

**READ** (advisory plus the two commits). Still needs two or three more documents before drafting, as the slate says.

---

## What changes in the slate and plan

- **XA:** note the pages read in full versus keyword-only; add that the unit's general counsel reviewed the contracts (receipt 6), so the angle is "who held the collateral terms", not "the top did not know".
- **XC:** coverage is now printed pp. 146 to 150 and 206 to 208; Moody's own documents still unread.
- **1A:** the PNAS correction is read (affiliations only); Facebook's statement still unread.
- **3A:** coverage now includes Chapter VI pp. 120 and 125 to 128 and Chapter VII p. 152; adds the 1982 reclassification and 1983 waiver.
- **3C:** add the two commits; fit stays unknown.
