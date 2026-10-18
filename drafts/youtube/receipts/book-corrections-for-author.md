# Knowware: places where the text and the sources disagree

A list for the author, Khayyam Wakil. Compiled 2026-10-17 from six research sessions' notes (`receipts-ch1-3.md`, `receipts-ch4-5.md`, `receipts-ch5-7.md`, `receipts-ch7-9.md`, `receipts-ch9-x.md`, `claims-audit.md`) and the consolidated table in `episode-slate.md` section 5.

**How far to trust this.** Models read the sources; no person has checked any item. For each item the "Where to look" column names the notes file and section that has the exact locator, so you can open the source passage yourself in under a minute. Where I could not find a source, the item says "not found", which is not the same as "false". Nothing here is a judgment about your arguments, only about specific facts and quotes.

Order: contradicted by a source first, then not found, then wording that goes further than the source, then things nobody has checked.

## 1. A source says something different

| Ch | Book says | Source says | Where to look | Possible fix |
|---|---|---|---|---|
| 6 | Uber crash on "October 21, 2018" (also in `src/content/chapters/06.md`) | NTSB: March 18, 2018, about 9:58 p.m. | slate §5 (NTSB/HAR-19/03) | Correct the date |
| 6 | Collision judged imminent 1.5 seconds out; "impact at 43 mph"; operator streaming for "6.7 seconds" | NTSB: 1.2 seconds; 45 mph at detection and 39 mph when the operator began steering; about 6 seconds with gaze down; no classification timestamps at 4.0, 3.3, 2.7 s; no "four-lane" and no names in the report | slate §5 | Re-source each figure to the report or drop |
| 5 | Burkhart played Guitar Hero in 2020; "first such demonstration in history" | First hand movement June 2014; Guitar Hero reported with the Nature paper in April 2016; the institutions' "first" claim is narrower | claims-audit rows 4a, 4b | Fix the year; narrow "first" |
| 9 | Bank tellers rose from about 300,000 (1970) to nearly 500,000 (2010) | Autor (2015): 500,000 to about 550,000 over 1980 to 2010 | claims-audit row 10 | Use Autor's figures and years |
| 4 | Big Dig: "$22 billion and fifteen years" | NTSB report: "in excess of $14 billion" and a 20-year effort (the $22 billion may come from another source, not checked) | receipts-ch4-5 §4C.4 | Use the NTSB figure or cite the $22 billion's source |
| 3 | Challenger: engineers had the findings but "nobody coordinated" them with launch-morning temperature | Thiokol's engineers did connect temperature to O-ring performance and recommended against launching below 53°F; the recommendation was reversed and did not reach the deciders. Chapter VI also records the joint's redundancy being formally dropped in 1982 and waived in 1983 | receipts-ch1-3 §3A.4; receipts-d-followup §3A | Rewrite the sentence around "reversed and not passed up" |
| 3 | Feynman's demonstration "proved" this; "a glass of ice water and a piece of rubber" | The ice-water remark is in the Feb 11, 1986 hearing transcript (not Appendix F) and says the seal material showed no resilience at 32°F; the glass comes from a separate remark about a clamp | receipts-ch1-3 §3A.4 | Narrow the claim; check the video before keeping the one-scene image |
| 1 | Facebook: users "saw more positive content" or "increased negative content"; study "proved, unequivocally"; "secretly manipulated"; "in partnership with Cornell University and UCSF" | The manipulation removed posts (positive for one group, negative for another). The paper claims "first experimental evidence" with effects as small as d = 0.001, measured as word percentages. The paper does not say "secretly". UCSF is only one author's later address (PNAS correction, July 3, 2014) | receipts-ch1-3 §1A.4; receipts-d-followup §1A | Rewrite those phrases |
| 1 | Mars Climate Orbiter: pounds-force and newtons | The Board's finding is impulse units: pound-seconds instead of Newton-seconds | slate §5 | Fix the units |
| 8 | Breakthrough Listen "analyzed 1 million stars" | The paper analyzed 820 targets and never mentions a million; Tarter is not in the paper | receipts-ch7-9 §8B.4 | Use 820, or cite where a million comes from |
| 9 | MKUltra "active from 1953 to 1973"; "twenty years"; "hundreds of millions of dollars" | The CIA director's statement dates the program 1953 to 1964; 1973 is when records were destroyed; no program-wide dollar total in the hearing or the Church report | receipts-ch9-x §9C.3 | Use 1953 to 1964; drop or source the dollar figure |
| 9 | MKUltra produced "zero validated intelligence applications" | The director agreed it produced few useful results, but the Church report records operational use abroad | receipts-ch9-x §9C.3 | Soften or cite |
| 6 | Gender Shades: 34.7% on darker-skinned women (Ch. 6); "65% accuracy on Black faces"; training data "overwhelmingly biased toward lighter-skinned males"; "95% accuracy on Black female faces" afterward | 34.7% is IBM only (20.8% to 34.7% across vendors). 65.5% and 65.3% are true-positive rates for darker females. The skew figures describe two public benchmarks, not vendor training data. The paper has no post-fix results; a follow-up reports 4.1%, 1.52% and 16.97% darker-female error for three vendors | receipts-ch5-7 §6C.4 | Rewrite the paragraph from the paper's tables |
| 7 | Fei-Fei Li section: error rates "34% higher for dark-skinned women" | The paper's figure is a 34.7% error rate | receipts-ch5-7 §6C.4 | Fix the phrasing |

## 2. Not found in any source

| Ch | Book says | What I found | Where to look |
|---|---|---|---|
| 9 and X | In 2016 radiologists at Stanford tested an AI that diagnosed pneumonia with 95% accuracy; deployed; shut down six months later (this is the opener of Chapter 9) | Nothing. The nearest items are CheXNet (arXiv, Nov 2017; F1 scores; no deployment) and Zech et al. 2018 | claims-audit claim 1 |
| 1 | Chapter title "$50 Million Algorithm" | No dollar figure in the paper, the Expression of Concern or the correction | claims-audit claim 2 |
| 4 | DR AI: 95% accuracy; "Hospitals deployed it. Many shut it down within months." | Beede et al. (CHI 2020) cites >90% sensitivity and specificity and describes a three-clinic prospective study; nothing on shutdowns. The users were nurses and camera technicians, not doctors; the paper says nothing about EHR transcription or who pays for follow-up | receipts-ch4-5 §4A.4 |
| 4 | Doctoroff: "coordination isn't a blueprint—it's a living system"; the project's end as a "coordination death spiral" | Not in any primary document read; Doctoroff's May 7, 2020 post gives an economic reason | receipts-ch4-5 §4B.4 |
| 5 | Neuralink: "Typing messages"; "Week 1... Week 2... Week 3" learning sequence; "hybrid intelligence emerges"; performance "exceeds what either could do alone" | The May 8, 2024 post lists text entry as future work, has no weekly account, and gives 8.0 bits per second against about 10 for engineers using a mouse | receipts-ch4-5 §5B.4 |
| 7 | Huyen: "70% of ML projects never make it to production" | Not found attributed to Huyen or her book | claims-audit row 9a |
| 7 | Amazon hiring tool penalized resumes with "women's" (stated as fact) | Only Reuters (Oct 2018, anonymous sources); an Amazon statement exists second-hand and disputes part of it; no primary document | receipts-ch5-7 §7A |
| X | A team's AI adoption went from 11% to 74% | Anonymous; no source | slate §5 |
| 9 | MKUltra: "each research team knew only its own results"; failures could not be learned from "because classified" | Not found. The Inspector General says files lacked evaluative statements and the record rested in officers' memories | receipts-ch9-x §9C.3 |

## 3. Goes further than the source

| Ch | Book says | Source says | Where to look |
|---|---|---|---|
| 1 | "Without their informed consent" stated as fact | The paper asserts consent via Facebook's Data Use Policy; PNAS's Expression of Concern calls consent a matter of concern | receipts-ch1-3 §1A.4 |
| 1 | 689,003 people "had their News Feeds manipulated" | 689,003 is the paper's N; about 155,000 per condition posted at least once in the window and entered the analysis | receipts-ch1-3 §1A.4 |
| 7 | Airbus partition "in 2019" using "generative AI" | Unveiled December 2015, announced by Airbus March 2016; the sources say "generative design"; 45% (30 kg) lighter | claims-audit row 3a |
| 3 | Heartbleed, Morris worm and Code Red "trace back to memory management failures"; "most security vulnerabilities in the history of computing" are memory failures | Heartbleed is a missing bounds check, Code Red a buffer overflow, Morris had one of four entry routes as an overflow: memory-safety bugs. The percentages are for specific codebases (Microsoft about 70% of CVEs in 2019; Chromium about 70% of high-severity bugs; Android 76% falling to 24%) | claims-audit rows 6a, 6b |
| 2 | House of Cards: "$100 million", greenlit "almost entirely" on data | The $100 million was a press report disputed at the time; Sarandos named the creative team and source material as the bet | claims-audit row 5a |
| 4 | Bogotá: 80 to 20 per 100,000 (a 75% fall) attributed to Peñalosa "1998 to 2001"; the repo opener credits Mockus and 70% | IDB/World Bank case study: 80 (1993) to 22 (2004); the decline began before either mayor; the repo opener and chapter text disagree with each other | claims-audit row 7 |
| 6 | Parks "spent 10 days in jail... blurry surveillance image" | The Parks complaint alleges the probe was a photo from a fake driver's licence; the pages read do not state "ten days" | receipts-ch5-7 §6B.4 |
| 6 | GPT-3 training: 1,287 MWh, 552 tons CO2, "120 homes", "one person's lifetime" | Patterson et al. give the first two as estimates; the two comparisons are not in that paper | claims-audit row 8a |
| 1 | Meadows: the paradigm is the top leverage point | The top item is the power to transcend paradigms; paradigm is second | claims-audit row 9b |
| 9 | Healthcare IT: hospital systems "don't coordinate" across hospitals | Not wrong as a general statement, but the UK NHS programme (the case an episode would use) was a national programme that stalled; do not present it as the same thing | receipts-ch7-9 §9A.4 |
| 1 | 2008: "these models largely failed" | The FCIC says the crisis was not the work of "computer models gone haywire"; its model passages concern rating agencies | receipts-ch9-x §XA.4 |

## 4. Not checked by anyone

- The Kepler "anomalies... megastructures" sentence (Ch. 8, Tarter section).
- Doctoroff's other quotes, the Hudson Yards line and the "$30 billion" deputy-mayor figure (Ch. 4).
- The Airbus partition's other figures, Burkhart's other details, and the Netflix account beyond what the claims audit covers.
- Any statement in the manuscript outside the ten audited claims and the cases above.

## 5. Items that are fine

For balance, from the claims audit: the GM seat-bracket figures (40% lighter, 20% stronger, 8 parts to 1; May 2018 release), Netflix recommendations saving over $1 billion a year (a company estimate), about 70% of cobalt from the DR Congo, Meadows's twelve leverage points, "all seven crew" lost on Challenger, 689,003 as the study's N, and "99% accuracy on lighter-skinned males" (the paper's error rates for that group are 0.0% to 0.8%).
