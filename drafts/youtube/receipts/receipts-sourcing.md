# Receipts: sourcing the unsourced (third sweep)

Written 2026-10-21 by a Claude session. **Nothing here has been checked by a human, and I am not a human check.** This file says what I read, not what I believe. "Mine" marks my own inference. Quotes are 15 words or fewer, at most three per fact; everything else is paraphrase.

Scope: the unread-source list from the last status check (`receipts-open-items.md`, end). Each section says what I got, what I read of it, and what I could not get. A summary table is at the end.

**Access notes.** Earlier scratch downloads had been cleared, so I re-downloaded what I needed. Three things were refused: the JAMA site and the PubMed Central supplement file (both bot checks, the second a reCAPTCHA, which I did not attempt to pass), and the University of Virginia Online Ethics Center page and its print PDF (403, then the browser was denied).

---

## 1. Hyatt: the Missouri Commission decision (7C): still not obtained

- The 442-page decision (Case No. AR840239, Judge James B. Deutsch, November 14, 1985) is not on any open host I could reach. The Online Ethics Center page lists a PDF and a Word copy of it, but I could not resolve the file address, and the page itself and its print PDF returned 403 this time. The Justia copy of the 1988 Court of Appeals opinion also returned 403 (the CourtListener copy was read earlier).
- The Texas A&M guide is the same secondary text as the Virginia page (`receipts-open-items.md` §3).
- **What stands as the primary record for Hyatt:** the NBS report (BSS 143) and the 1988 Missouri Court of Appeals opinion's summary of the Commission's findings (`receipts-ch7-9.md`). Nothing new here.

---

## 2. Epic Sepsis Model (9B)

### What I could not get
- **JAMA's own page:** blocked (bot check). **The online supplement:** blocked (reCAPTCHA on the PMC file link; not bypassed). **The accompanying editorial** (Habib, Lin, Grant): no open copy found. **Epic's own statement:** not found on Epic's public sites in two searches; the only versions are press quotations.

### What I read instead: a second, independent validation at another hospital
Prisma Health (Greenville, South Carolina), "Epic Sepsis Model Inpatient Predictive Analytic Tool: A Validation Study", *Critical Care Explorations* 2023;5(7):e0941, doi 10.1097/CCE.0000000000000941, via PubMed Central PMC10317482 (read the abstract, key points, methods and the discussion's critique of Wong et al.; not the tables).

1. **Setting and design.** A 746-bed academic level 1 trauma center. The model ran silently from January 12, 2018 (11,512 inpatient encounters; 1,171, or 10.2%, with a sepsis diagnosis code); alerts were switched on October 22, 2018; outcomes were compared before and after, through July 31, 2019. Single center, uncontrolled before-and-after study; the authors call it "hypothesis generating".
2. **Performance, as they report it.** A cut-off of 5 or higher, chosen by ROC analysis on the hospital's own data: AUC 0.834, sensitivity 86.0%, specificity 80.8%, positive predictive value 33.8%, negative predictive value 98.1%. Sepsis was identified from diagnosis codes, and the analysis used the **maximum score during the hospitalization**.
3. **Outcome claim.** After alerts began, unadjusted mortality in patients with a score of 5 or higher who had not yet received sepsis antibiotics fell from 24.3% to 15.9%; adjusted odds ratio 0.56 (95% CI 0.39 to 0.80). The authors say a causal link cannot be established.
4. **Their critique of Wong et al.** They say Wong's threshold of 6 was "arbitrarily chosen" without validating the scoring at that institution, and that Wong's study was a retrospective review after the alerting system was already implemented.
5. **Conflicts.** The authors disclose no potential conflicts of interest.

### What this means for the 9B framing (mine)
- **A second hospital got a very different answer.** Michigan: AUC 0.63, PPV 12%, sensitivity 33% (threshold 6, onset-timed analysis). Prisma: AUC 0.834, PPV 33.8%, sensitivity 86% (threshold 5, maximum score during the stay, diagnosis codes). The two papers did not measure the same thing, and the difference in method is exactly the point Wong made about timing (`receipts-ch7-9.md` receipt 8). So "how the model performed in each hospital" depended on who measured and how.
- **A discrepancy to check.** Prisma says Wong's threshold was "arbitrarily chosen"; Wong's text says the threshold was selected by Michigan's hospital operations committee and is within Epic's recommended range of 5 to 8 (`receipts-ch7-9.md` receipt 7). Read both papers' wording before putting either characterization in a script.
- **Epic's response is still second-hand** (MedCity News relayed Epic's emailed statement; `receipts-d2-followup.md`).

---

## 3. NHS National Programme for IT (9A)

### NAO, HC 888 (May 18, 2011): Parts One to Five (re-downloaded; read selected paragraphs)

1. **Revised approach and interoperability (¶1.5 to 1.7).** From late 2009 the Department planned to link trusts' existing systems "rather than replacing them wholesale"; each trust could keep its system and add modules, but there was "an increased risk" of inadequate interoperability. A January 2011 paper to the Programme Board listed building blocks still needed: standards, supplier adoption of them, and an accreditation process.
2. **No benefits baseline in the contracts (¶1.12).** The local service provider contracts contained no formal projections of financial benefits; benefits information from trusts was submitted voluntarily, "which risks the information being incomplete". The Department had not said what the scope cuts did to expected benefits.
3. **A promised statement not delivered (¶1.14).** After a March 2008 benefits statement (financial benefits of £208 million to March 2007, over 90 percent from the broadband network, ¶1.13), no further statement was published despite a commitment to publish one in summer 2010. The Department did not formally request the audit until May 11, 2011.
4. **Fujitsu (¶3.2 to 3.3).** After 10 months of talks to reset the contract, the Department terminated it in May 2008; "The basis for the termination remains in dispute." It had paid Fujitsu £71 million of a £1,104 million contract; after termination Fujitsu's charge to maintain live sites doubled and it was paid £80 million in the 12 months before BT took over.
5. **Lorenzo (¶4.4 to 4.7).** Release 1 delivered at only seven trusts and not rolled out; Release 2 not delivered at any early-adopter site and not due until June 2012; no release at any mental health trust; an early-adopter trust withdrew in April 2011. Forty of 44 systems delivered in acute and mental health settings were interim systems; the Department "is unable to calculate" how much of the £854 million paid to CSC went on them. In November 2009 the Department found Lorenzo had 3,128 identified defects against a contractual limit of 700.
6. **Still unread:** the figures and tables beyond those paragraphs, and Part Five's risk discussion beyond the paragraphs already cited.

### PAC oral evidence, June 12, 2013 (more questions; read through the browser)

7. **Weak position (Q50 to Q52).** Mr Bacon put it that the software was bought from paper descriptions and the supplier had still not delivered; Tim Donohoe said repeated contract resets meant the Department lacked a strong negotiating position with CSC. (The "paper descriptions" framing is the member's.)
8. **The 2002 and 2003 contracts (Q96 to Q97).** Sir David Nicholson said the Department's contractual position "was what was signed up in 2002 and 2003" and that it had been trying to make the best of contracts "not ideal" for a different time.
9. **Benefits ownership (Q226).** Mr Donohoe said a specific benefits lead would be appointed for each local service provider programme and the central team strengthened; Ian Swales's question predicts the Department will say "We don't collect the data".

---

## 4. HealthCare.gov (4B): GAO-14-694, body read

(GAO's accessible text, read through the browser; Highlights and Background were read earlier, `receipts-open-items.md` §2.)

1. **Unauthorized authorizations.** The task order for the federally facilitated marketplace was modified in April 2013 to add almost $28 million to cover cost increases "inappropriately authorized" by program officials in 2012; the data hub order had about $2.4 million more. GAO says CMS documents show at least 40 instances of work authorized by officials who lacked authority, without the knowledge of the contracting officer or its representative; the work included added features, design changes and a software license.
2. **Why (unclear roles).** Contract oversight was spread across the contracting officer and two program-office roles with "overlapping responsibilities", and CMS's guidance did not fully address making sure contractor directions came only from the contracting officer.
3. **Deliverables.** Particularly in the first year, contract documents show "repeated questions about who was responsible" for reviewing deliverables, including monthly status and financial reports and the quality assurance surveillance plan. When oversight transferred in September 2012 the new COR could not find a complete set, and the original COR could not provide them; he asked the contractors directly.
4. **Recommendations.** Five. HHS concurred with four and partially concurred with the recommendation to assess the causes of continued cost growth; GAO noted the contract to continue development (with a second firm) had risen from $91 million to more than $175 million and not all of that was new requirements.

**Effect on 4B.** The GAO body adds specifics to the "who could approve what" thread: roles overlapped, directions went around the person with authority, and the documents about the work could not be found. Together with the OIG study (warnings not shared) this is the most documented "the knowledge existed but did not reach the right person" case on the slate. The GAO findings were still read from an accessible text, not the PDF.

---

## 5. Post Office Horizon (5B): the court's answers, the Technical Appendix, and the Court of Appeal

### Bates v Post Office (No 6), the "Answers to the Horizon Issues" (¶¶965 to 1030; read ¶¶965 to 1017 closely)

1. **Issue 1.** Bugs, errors and defects had the potential to cause shortfalls and to undermine reliability, and "it actually has happened, and on numerous occasions" (¶969), under both Legacy Horizon and Horizon Online. Dr Worden accepted strong evidence of at least 12 bugs causing a lasting discrepancy (¶970).
2. **Records not kept (¶971).** The number of transaction corrections each year, and how many were upheld when disputed, are not available for most of the system's life; nor does Fujitsu centrally record the bugs found through SPM reports. The judge rejects Mr Parker's PEAK closure-code summary as "wholly unreliable". Transaction corrections numbered over a hundred thousand a year for many years (¶¶971, 1027: over 100,000 each year since 2006).
3. **Issue 2: did Horizon alert SPMs?** "No, the Horizon system did not alert SPMs" (¶973). Some bugs lay undiscovered for years.
4. **Issue 3: robustness (¶¶975 to 976).** Legacy Horizon "was not remotely robust". The first Horizon Online version was slightly more robust but still had many bugs (especially 2010 to 2015) and its robustness "did not justify the confidence routinely stated by the Post Office" before February 2017. The judge also relies on the lack of records or logs at Fujitsu of use of powerful access roles.
5. **Issue 7: remote access (¶991).** Both the Post Office and Fujitsu could read transaction data remotely; Fujitsu could access all of it.
6. **Issue 10 (¶1003).** Fujitsu could insert, edit and delete transaction data and implement fixes affecting branch data: "yes" to all nine permutations the issue sets out.
7. **Issue 11: controls (¶1008).** Permission controls existed, "the roles were very wide" and in the judge's view were not controlled, including a lack of proper logs.
8. **Issue 12: how often (¶1013).** The experts could not give confident evidence because of Fujitsu's record keeping; the APPSUP role was used 2,175 times from 2009 to 2019, about once per working day, with very little detail of why.
9. **Issue 13 (¶1016).** The roles' design was very wide; the experts agreed anyone with APPSUP "could pretty much do whatever they wanted"; the judge finds this had the potential to affect branch accounts materially and that on some occasions it did.
10. **Issue 14 (¶1021).** Horizon can compare cash and stock but "has no facility to record a dispute".

### Technical Appendix (Appendix 1 to the judgment; Post Office Inquiry copy POL00022841, via a catalogue page that carries the text; read ¶444 and the passages on bugs 3 and 4)

11. **Robustness conclusions (¶444).** Legacy Horizon "not remotely robust"; the Post Office's final submissions "forced to concede" so many bugs that the argument moved from their existence to their effect; Horizon Online HNG-X questionable; HNG-A far more robust but still "a Horizon system"; "Drop and Go", Bug 28 in the Bug Table, dates from June 2017.
12. **Dalmellington bug.** Effects seen between 2010 and 2015; Fujitsu's 2015 investigation counted 65 incidents between February 2010 and January 2011, 6 in 2011, 9 in 2012, 7 in 2013, 9 in 2014 and 16 in 2015. For some time in the trial the Post Office called it "an issue" and avoided the word "bug".

### Court of Appeal, *Hamilton & Ors v Post Office Ltd* [2021] EWCA Crim 577, April 23, 2021 (read ¶¶3 to 8, 48 in part, 59 to 61, 447)

13. **What it decided.** Forty-two appellants (convicted 2003 to 2013 of offences from 2000 to 2012; theft, fraud and false accounting, in cases brought by the Post Office as private prosecutor); three appeals were dismissed and the convictions of the other 39 were quashed on both grounds (¶447). Three appellants had died.
14. **Its basis.** The court says Fraser J's findings "have provided the factual basis" for the appeals (¶6). Its summary of his findings (¶48) includes that the Post Office "failed to disclose" the full and accurate position on Horizon's reliability, that SPMs were at a significant disadvantage in access to information, had no way of disputing shortfalls within Horizon, and that remote access to branch accounts was extensive and some branch accounts were altered without the SPM's knowledge.
15. **Disclosure.** Post-conviction disclosure involved reviewing millions of documents; the court records that important documents were not disclosed at the time of the prosecutions nor in the High Court proceedings before Fraser J (¶61).

**Effect on 5B.** This gives the swap's two missing records: the judge's formal answers (what Fujitsu could do and what was not logged) and the Court of Appeal's outcome for prosecutions (receipts 13 to 15). The earlier caution about not scripting prosecutions can be relaxed to this: script them from ¶¶3 to 8, 48 and 447 of the Court of Appeal judgment, not from the High Court judgment. **Not read:** the rest of the Technical Appendix, the High Court's Judgment No. 3 (Common Issues), most of the Court of Appeal judgment (about 44 pages), and any statutory or inquiry follow-up.

---

## 6. Challenger (3A): Rogers Commission Volume I, Chapter VI in full, VII to IX findings

### Chapter VI, pp. 129 to 151 (read: the 51-C and 51-B passages, the launch-constraint passage, and the Findings; not every page)

1. **Cold launch and first secondary-seal damage (p. 135).** STS 51-C (January 24, 1985, the coldest launch to that date, which the table gives as 53°F) showed erosion in both boosters; for the first time a secondary O-ring showed heat effect on a field joint. Boisjoly described the grease between the rings as blackened and the blow-by "over 100 degrees of arc". The Commission says management at Levels I and II were not aware of Thiokol's concern about cold, nor of the one raised after 51-C (p. 135).
2. **A launch constraint, waived every flight (p. 137).** After the 51-B primary O-ring failure (April 1985), Mulloy and the Marshall Problem Assessment Committee placed a "launch constraint" that applied to all flights from STS 51-F on, including 51-L; Mulloy waived it for each flight after July 10, 1985. Thiokol officials said they were unaware of it; Thiokol letters referred to the Marshall record that identified it. Levels I and II were not informed of the constraint (p. 148).
3. **Findings (p. 148).** Neither Thiokol nor NASA responded adequately to internal warnings about the seal. Decisions rested on having "got away with it last time" (Feynman: "a kind of Russian roulette"). The anomaly tracking system failed, including "six consecutive launch constraint waivers" before 51-L that left no record of a waiver or even of an explicit constraint. And: "A careful analysis of the flight history of O-ring performance would have revealed the correlation of O-ring damage and low temperature", but neither organization did that analysis.

### Chapters VII to IX (findings)

4. **Ch. VII, p. 161 (six findings).** Safety, reliability and quality assurance staffing was cut at Marshall and Headquarters; those offices reported to the organizations they check; problem reporting did not get critical information to the right level; "Little or no trend analysis" was done on O-ring erosion; five weeks after the accident the joint's criticality was still not properly documented at Marshall.
5. **Ch. VIII, pp. 176 to 177 (flight-rate pressure).** The system was stretched to support the flight rate in winter 1985 to 1986; the scheduled flight rate did not reflect capabilities; when flights came in rapid succession, requirements did not ensure critical anomalies from one flight were addressed before the next.
6. **Ch. IX, p. 186 onward (other safety considerations).** The shuttle was not designed to survive a booster failure; the Commission also criticised accepting worse weather for abort landings. These bear on the accident's consequences more than on who knew what.

**Effect on 3A (mine).** Receipt 3's finding about the missing analysis and receipt 1's statement that Levels I and II were not told *both* refine the framing: the temperature link was voiced by engineers at Thiokol (and Marshall) but not carried upward, and the organization never did the systematic flight-history analysis that would have shown it. That is stronger than "nobody coordinated" (the book's phrase) and also not simply "the engineers knew and were overruled". **Not read:** the rest of VI (pp. 129 to 134, 138 to 141, 143, 145 to 147) beyond the passages cited, and VII to IX beyond their findings.

---

## 7. Columbia (7A): CAIB Chapters 5 and 7

(CAIB Vol. I; printed page = PDF page minus 1; re-downloaded.)

1. **Ch. 5 conclusion (p. 118).** Three factors shaped the environment: the shuttle budget and workforce were cut by more than 40 percent over the decade; the shuttle was mischaracterized in a 1995 report as "a mature and reliable system", so NASA reduced its direct involvement in safety; and the planned replacement date kept slipping, leaving "policy and budgetary ambivalence" about investing in the vehicle.
2. **Ch. 7 organizational cause statement (p. 177).** The causes are "rooted in the Space Shuttle Program's history and culture", including "reliance on past success as a substitute for sound engineering practices", barriers that "stifled professional differences of opinion", a lack of integrated management, and an informal chain of command outside the rules.
3. **Emails that did not travel (p. 192).** Emails from engineers at Johnson and Langley conveyed the depth of their concern about the foam strike and what they wanted to do; "these e-mails did not reach the Mission Management Team." The Board attributes this partly to organizational structure and spheres of authority.
4. **Reluctance to use channels (p. 192).** The fact that engineers did simulated blown-tire landings at Ames "after hours" is cited as showing reluctance to raise the concern in established channels. The Mission Management Team's low number of meetings and the decision to fly STS-113 without a compelling explanation of the earlier foam loss are read as overconfidence.
5. **Findings F7.4 (p. 193).** The shuttle program "has a wealth of data tucked away in multiple databases without a convenient way to integrate" them; senior safety and element managers do not use the Lessons Learned Information System when making decisions; safety organizations depended on the program for funding; the Integration Office did not have continuous responsibility for foam shedding, so "Integration did not occur."

**Effect on 7A.** Receipts 3 and 5 strengthen the "concern that never reached the decision" angle and add a system-level version (data in many places, no one integrating it). **Not read:** Chapter 7 sections 7.1 to 7.3 (the high-reliability comparisons), most of Chapter 5, Volumes II to VI.

---

## 8. Big Dig (4C): NTSB HAR-07/02, test chapters and recommendations

(NTSB Highway Accident Report HAR-07/02, 132 pages; re-downloaded; printed page numbers.)

1. **Creep tests (pp. 60 to 61).** Investigators hung about 2,000 pounds from two anchors that showed no distress; both began to displace shortly after loading and had not stabilized after 47 hours (about 0.11 and 0.07 inch). Further tests at 1,000, 2,000 and 3,000 pounds in the westbound tunnel produced two complete pull-outs (one at 2,000 pounds after 84 hours, one at 3,000 pounds after 7 hours) and a third anchor relieved of its load after 377 hours; failures were within the epoxy.
2. **Fast Set versus Standard Set (p. 61).** In Turner-Fairbank tests, anchors with Standard Set epoxy showed no significant movement at any load; anchors with Fast Set showed significant displacement and high rates at all loads, and two at 4,000 pounds pulled out completely.
3. **Cost of the difference (p. 66, footnote 65).** Current retail prices: $46.00 against $44.00 for the 22-ounce package; the same price for the 15-ounce; about 30 anchors per 22-ounce package.
4. **What the supplier's manual said (p. 72).** The manual edition current when the ceiling was installed did not distinguish Fast Set from Standard Set in allowable loads or long-term performance, and neither did the 2002 edition. The fifth edition (2006) first added a footnote to reduce bond capacities by 25 percent for Fast Set, "the first mention in a Powers manual" of a possible difference.
5. **Safety factors in the manual (p. 73).** The manual's typical factors were 4 with a creep test and 5.33 without, and said higher factors (10:1 or more) "may be appropriate" for overhead, life-critical applications, to be set by the design professional.
6. **Recommendations (p. 109).** To the Federal Highway Administration: develop (with AASHTO) testing standards and protocols for adhesive anchors in sustained tensile-load overhead highway use, including creep (H-07-15); prohibit such use where failure would risk the public until standards exist (H-07-16); seek legislation for a mandatory tunnel inspection program (H-07-17, H-07-18); develop guidance for tunnel finishes (H-07-19). Parallel recommendations went to AASHTO.
7. **State practice (Appendix B, p. 114).** In a survey, 30 states responded on how they ensure critical systems or materials work properly: for example 25.8 percent said they use or trust the manufacturers' specifications or certifications and 19.4 percent delegate to the contractor (percentages overlap because states could choose several options).

**Effect on 4C.** Receipts 1, 2 and 4 are the strongest receipts for the slate's "supplier held the creep data" angle: the creep difference was measurable in tests (receipts 1 and 2) and the supplier's guidance did not say so until 2006 (receipt 4); the $2 price difference (receipt 3) is a vivid but small detail. **Not read:** pages 62 to 65 and 67 to 71 in detail, and Appendices A and C.

---

## 9. Parks complaint (6B): pages 19 to 28

Rendered and viewed pages 19, 22 and 25; with 16 to 18 and 29 from earlier, I have viewed pages 16 to 19, 22, 25 and 29. Page 19 is Count II (equal protection; alleging "anti-black animus" shown by reliance on facial recognition known to be unable to reliably identify African American faces and by suppression of exonerating evidence including height disparity, failure to use DNA and fingerprints, and alibi evidence); page 22 is Count IV (municipal policy or custom: Woodbridge allegedly allowed facial recognition use and failed to supervise or train); page 25 is Counts VII (conspiracy; Middlesex County policy). **No page viewed states how many days Parks was held**; pages 20, 21, 23, 24, 26, 27 and 28 were not viewed. These are allegations in a complaint, not findings.

---

## 10. LTCM (2C): the Federal Reserve testimony and more of the PWG report

(PWG report: `home.treasury.gov/system/files/236/hedgfund.pdf`; re-downloaded.)

### Greenspan's testimony, October 1, 1998 (Federal Reserve; the URL ends 19981001; read the whole text)

1. **Why the Fed convened.** The New York Fed's role was to help an orderly private-sector adjustment; "no Federal Reserve funds were put at risk"; the concern was a fire sale triggered by cross-default clauses.
2. **LTCM's strategy.** It "levered its capital through securities repurchase contracts and derivatives", relying on mathematical models; it returned $2.75 billion of capital to investors at the end of 1997; as opportunities shrank it used more leverage; by the end of August it had lost half its capital base.
3. **What counterparties knew.** "The troubles of LTCM were not a complete surprise to its counterparties": its earlier statements about August losses were well known and commercial banks had begun taking precautions. But "creditors as a whole most likely underestimated the size and scope" of its bets, which he says is under review.
4. **Stress testing.** The creditors were induced to put capital in "because they failed to stress test their counterparty exposures adequately".
5. **The equity sliver.** The rescue left the original owners one tenth, to keep management incentives.

### PWG report, printed pp. 6 to 8 (Background, "Disclosure and Monitoring" and "Counterparty and Credit Relationships")

6. **What hedge funds disclosed (p. 6).** Hedge funds are subject to fewer public disclosure requirements than many other financial institutions; the "typical accounting statement is still not informative about the risk profile" of their trading.
7. **What lenders did (pp. 7 to 8).** Due diligence included performance history, management ability and reputation, capital, leverage, liquidity and risk management; counterparties typically required audited annual, quarterly and monthly net asset value statements and sometimes on-site visits, but the variability of a fund's position made traditional financial-statement analysis less effective, and qualitative evaluations "may not eliminate counterparties' need for better quantitative information".
8. **Collateral (p. 8).** Because of the difficulty of assessing hedge funds' creditworthiness, counterparties used collateral; the report warns this "can foster a false sense of" security.

**Effect on 2C.** The Federal Reserve's chairman and the working-group report disagree in emphasis, which is itself worth a line in a script: the PWG report stresses that individual counterparties were "not necessarily aware" and that statements were not informative (`receipts-open-items.md` §6), while Greenspan says the troubles were "not a complete surprise" but that creditors underestimated the scale. **Not read:** the PWG appendices (A to G) and the report's conclusions and recommendations in detail; I found no independent (non-government) account to read.

---

## 11. Google Flu Trends's later statements (2C, now less relevant)

Not read. The slot is now LTCM. My one search found only secondary coverage of Google's 2015 shutdown notice, and I did not fetch the notice.

---

## Still not obtained or not read

- The Missouri Commission decision (Hyatt). JAMA's own page and supplement and Epic's own statement (9B). Google's later Flu Trends statements.
- The rest of NAO HC 888's tables and figures; the rest of the PAC oral evidence.
- The rest of CAIB Chapters 5 and 7 and Volumes II to VI; Rogers Chapter VI pp. 129 to 134 and 138 to 147 beyond the passages cited.
- The rest of the NTSB Big Dig report (pp. 62 to 65, 67 to 71, Appendices A and C).
- The Horizon Technical Appendix beyond ¶444 and two bugs; the High Court's Judgment No. 3; the rest of the Court of Appeal judgment.
- Parks pp. 20, 21, 23, 24, 26 to 28.
- The PWG LTCM appendices and any independent account of LTCM.
- Everything on `human-check-checklist.md`.

## Summary

| Item | Result |
|---|---|
| Hyatt Commission decision | Not obtained (not on any open host reached) |
| JAMA page and supplement | Blocked (bot check, reCAPTCHA); a second independent validation (Prisma) read instead |
| Epic's own statement | Not found; still press relay only |
| Google's later Flu Trends statements | Not read (slot now LTCM) |
| NAO 2011 Parts 2 to 5 | Read selected paragraphs |
| PAC oral evidence | More questions read (Q50 to Q52, Q96 to Q97, Q226) |
| Big Dig test chapters | Read key sections and recommendations |
| Rogers VI (rest), VII to IX | Read passages and findings |
| CAIB 5 and 7 | Read conclusion, cause statement and findings |
| Horizon appendix and judgments | Read the court's answers, ¶444, and the Court of Appeal's outcome |
| GAO body | Read |
| Parks 19 to 28 | Viewed 19, 22, 25; no "ten days" |
| LTCM appendices / independent account | Fed testimony read; appendices unread; no independent account |
