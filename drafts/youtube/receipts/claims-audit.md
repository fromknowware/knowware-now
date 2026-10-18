# Claims audit: ten Knowware claims checked against sources

Written 2026-10-17 by an AI session. *Editor's note (2026-10-17): the PMC identifiers for the Expression of Concern and the Correction were swapped in the first version of this file; corrected after the lead session checked both PMC page titles.* **Nothing here has been checked by a human.** "Read" means the session downloaded the document and searched or read the passage itself. Where a source is only known from a search-result summary, that is stated and no verdict relies on it. Statements marked **(inference)** are the session's own reading, not something a source says. Book text was taken from the `fromknowware/systems-intelligence` chapter files (ch01–ch09, chX) and `src/content/chapters/*.md`.

Quotes are kept to short fragments with a locator. Everything else is paraphrase.

## Verdict table

Claims 3, 4, 5, 6, 8 and 9 contain two separable assertions, so they are split (3a/3b etc.).

| # | Chapter | Claim in short | Verdict | One-line reason |
|---|---|---|---|---|
| 1 | 9, X | 2016 Stanford AI, 95% pneumonia accuracy, deployed, shut down after six months | UNSOURCED | No deployment or shutdown report found. The nearest real item (CheXNet) is a Nov 2017 research paper that reports F1 scores, not 95% accuracy, and no deployment. |
| 2 | 1 (title) | "$50 Million" Algorithm, Facebook emotional-contagion study | UNSOURCED | No $50 million figure appears in the PNAS paper, its correction or its Expression of Concern. |
| 3a | 7 (opener) | 2019 Autodesk generative AI, A320 partition 45% lighter | PARTLY SUPPORTED | Real Airbus/Autodesk "bionic partition", 45% (30 kg) lighter, A320. But unveiled Dec 2015 and Airbus-announced Mar 2016, not 2019; sources say "generative design", not AI. |
| 3b | 7 §7.1 | GM seat bracket 40% lighter, 20% stronger, 8 parts to 1 (2018) | SUPPORTED | GM/Autodesk release, May 2018, states exactly these figures for a proof-of-concept part. "For electric vehicles" is not in the release I read. |
| 4a | 5 (opener) | 2020: Burkhart played Guitar Hero using only his thoughts | CONTRADICTED | First hand movement June 2014; Guitar Hero reported with the Nature paper on 13 Apr 2016. No 2020 event found. |
| 4b | 5 (opener, repo) | "first such demonstration in history" | PARTLY SUPPORTED | Ohio State/Battelle press releases say "first"; the Nature abstract itself lists earlier brain-controlled computer and robot-arm work. The "first" is narrower than the book implies. |
| 5a | 2 | House of Cards: $100M, two seasons, greenlit "almost entirely" on data | PARTLY SUPPORTED | Two seasons / 26 episodes confirmed. $100M was a press report that people close to Netflix disputed at the time. Sarandos named the creative team and source material as the bet. |
| 5b | 2 | Recommendation engine saves Netflix over $1B annually | SUPPORTED | Gomez-Uribe & Hunt §3: "personalization and recommendations" are thought to save more than $1B per year. It is a company estimate. |
| 6a | 3 | Heartbleed, Morris worm, Code Red "trace back to memory management failures" | PARTLY SUPPORTED | Heartbleed: missing bounds check. Code Red: buffer overflow. Morris: one of four entry routes was a buffer overflow. These are memory-safety bugs; "memory management" (malloc/free) is not what the sources describe. |
| 6b | 3 | "Most security vulnerabilities in the history of computing" are memory failures | PARTLY SUPPORTED | Microsoft ~70% of CVEs per year (2019), Chromium ~70% of high-severity bugs (since 2015), Android 76% (2019) falling to 24% (2024). Specific codebases, not "the history of computing". |
| 7 | 4 | Bogotá homicides 80 → 20 per 100,000 by 2004 (−75%); opener says Mockus, −70% | PARTLY SUPPORTED | 80 (1993) → 22 (2004) per IDB/World Bank case study. Both versions are about 2.5 points off that. Decline began in 1993, before either mayor. Chapter chronology is wrong. |
| 8a | 6 | GPT-3 training 1,287 MWh and 552 tons CO2 | PARTLY SUPPORTED | Patterson et al. Table 4: 1,287 MWh, 552.1 tCO2e (estimates). The "120 homes" and "one person's lifetime" comparisons are not in that paper. |
| 8b | 6 | 70% of world cobalt from DR Congo | SUPPORTED | USGS: ~70% (2020), >70% (2021), 74% (2023), 76% (2024), est. 73% (2025). |
| 9a | 7 | Huyen: 70% of ML projects never reach production | UNSOURCED | Could not find this figure attributed to Huyen or her book. |
| 9b | 1 | Meadows 1999 essay, twelve leverage points, ranked | SUPPORTED | Essay dated 19 Oct 1999 lists twelve, "in increasing order of effectiveness". Minor: the top item is "transcend paradigms", with paradigm second. |
| 10 | 9 | Tellers rose from ~300,000 (1970) to ~500,000 (2010) | CONTRADICTED | Autor (JEP 2015) states 500,000 to about 550,000 over 1980–2010. The book's start figure and years do not match. |

Count: SUPPORTED 4, PARTLY SUPPORTED 7, CONTRADICTED 2, UNSOURCED 3, CANNOT TELL 0 (16 rows).

---

## Claim 1: Stanford pneumonia AI (Ch. 9 and Ch. X)

**Book:** ch09, section "Ternary Integration Framework", paragraphs 1–2: radiologists at Stanford in 2016 tested an AI with 95% accuracy; "Six months later, they shut it down." chX has the same story in its Chapter 9 summary paragraph (about 5th paragraph of the "three triads" section).

**Verdict: UNSOURCED.**

1. **CheXNet paper (Rajpurkar et al., Stanford ML Group), arXiv:1711.05225.** First submitted 14 Nov 2017 (arXiv "Submission history", v1; read at arxiv.org/abs/1711.05225). Abstract: the model "exceeds average radiologist performance on the F1 metric". Locator: Abstract. This is a research paper, dated 2017 not 2016.
2. **No 95% accuracy figure.** Table 1 gives F1 of 0.435 (95% CI 0.387–0.481) for CheXNet versus 0.387 for the average of four radiologists, on a 420-image test set. Table 2 gives an AUROC of 0.7680 for pneumonia on ChestX-ray14. "95%" appears in the paper only as the confidence-interval level (searched the full text). Locator: §3.2, §4.1, Tables 1–2.
3. **No deployment in the paper.** §4.2 "Limitations" lists limits of the comparison (frontal-only views, no patient history). The paper describes an offline comparison of labels, not a hospital rollout. The project page (stanfordmlgroup.github.io/projects/chexnet) likewise describes a model, a dataset (112,120 images, NIH ChestX-ray14) and a test set of 420 images, and says the authors hope it can improve access. No shutdown is mentioned in either.
4. **Closest real Stanford deployment-style item: CheXpert at Intermountain Healthcare.** ScienceDaily reprint of an Intermountain release, 30 Sep 2019: Intermountain and Stanford researchers studied CheXpert on 461 patients' X-rays from Utah emergency departments. It reports about 10 seconds per read with high agreement with a three-radiologist consensus, and calls it a study. No shutdown is reported there. Locator: paragraphs 1–6 of the release.
5. **A different real finding about pneumonia CNNs failing to generalise.** Zech et al., PLOS Medicine, 6 Nov 2018: pneumonia-screening CNNs "achieved better internal than external performance in 3 out of 5" comparisons across NIH, Mount Sinai and Indiana data. Locator: Abstract, Results. Mount Sinai, not Stanford; a simulated screening task, not a hospital deployment.
6. **What I could not find.** Searches for a Stanford pneumonia AI being deployed and then shut down after six months returned nothing; the search tool reported no such item. I read nothing that supports a hospital deployment or shutdown.

**Inference (low–moderate confidence):** the story may be a blend of CheXNet's "better than radiologists" headline with generic deployment-failure stories (e.g. the Zech generalisation finding, or the Google Health Thailand retinopathy study that the slate lists separately). I found nothing that links them to the book's author.

URLs read: arxiv.org/pdf/1711.05225; arxiv.org/abs/1711.05225; stanfordmlgroup.github.io/projects/chexnet/; sciencedaily.com/releases/2019/09/190930104505.htm; journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002683

---

## Claim 2: "The $50 Million Algorithm" (Ch. 1 title)

**Book:** ch01 heading "The $50 Million Algorithm That Taught Us Everything" (also `src/content/chapters/01.md` frontmatter `opener`). The section describes the Facebook, Cornell and UCSF study.

**Verdict: UNSOURCED.**

1. **PNAS paper (Kramer, Guillory, Hancock, PNAS 111(24):8788–8790), PMC4066473.** Read in full. No dollar figure of any kind appears in the body, Acknowledgments or Footnotes. Acknowledgments thank Facebook staff; the footnote says the authors declare no conflict of interest. There is no funding statement.
2. **PNAS Expression of Concern (3 Jul 2014, 111(29):10779, PMC4115552).** Read. It discusses informed consent and opt-out under the Common Rule. It gives no dollar amount.
3. **PNAS Correction (PMC4115523).** Read. It corrects affiliations only. It says Guillory was a Cornell graduate student at the time and that UCSF is her *present* address.
4. **Search for "$50 million" with the study** returned only coverage of the study; none of the summaries mentioned that figure. I did not read those articles in full, so this is a weaker negative than items 1–3.

**Side findings on the same chapter section (read in the same sources):**
- Study size and dates match the book: N = 689,003, one week, 11–18 January 2012 (PNAS Methods).
- The book says "in partnership with Cornell University and UCSF". PNAS lists Facebook's Core Data Science Team and Cornell; UCSF appears only as a later address for one author.
- The book says the study "proved, unequivocally" contagion. The paper's own discussion says the effect sizes were small, "as small as d = 0.001" (PNAS Discussion).

URLs read: pmc.ncbi.nlm.nih.gov/articles/PMC4066473/; …/PMC4115552 (Expression of Concern); …/PMC4115523 (Correction)

---

## Claim 3: Autodesk/Airbus partition and GM bracket (Ch. 7)

**Book:** ch07 opener (under "Three-Body Engineering Patterns"): in 2019 Autodesk's generative AI designed an A320 partition 45% lighter. ch07 §7.1 "Case Study: General Motors Seat Bracket" and its "The Result" paragraph: 40% lighter, 20% stronger, 8 parts to 1.

### 3a: Airbus partition. PARTLY SUPPORTED

1. **Airbus news page, "Pioneering bionic 3D printing", dated 03 March 2016.** The partition weighs "45% (30 kg) less than current designs" (Airbus wording). It is for the A320. Airbus estimates up to 465,000 metric tonnes CO2 per year across the A320 backlog. Partners named: Autodesk, Airbus, APWorks (Airbus subsidiary), and The Living (an Autodesk studio). Material: Scalmalloy.
2. **Date.** The 3dprint.com article dated 4 December 2015 reports the unveiling "this week" at Autodesk University 2015 in Las Vegas. The Airframer reprint of the release is dated 16/12/2015 and says a first test phase was complete and further testing, including a flight test, would come "next year". Both are secondary copies; the Airbus page is the primary one. I found no 2019 event for this partition.
3. **Autodesk Research project page, "Bionic Partition".** Says "almost 50% lighter" than current designs and stronger, and that it was undergoing 16G crash testing for certification. Locator: Overview paragraph. The 45% is the Airbus figure; Autodesk's page rounds differently.
4. **"Generative AI".** The Airbus page body, the Autodesk page, the Airframer release and the 3dprint.com article call this "generative design", "algorithms" or "bionic" design. I found no use of the phrase artificial intelligence in any article body (the one hit was in Airbus's site menu). The book's wording is the book's own.
5. **"Human-designed version … while using less material."** Airbus says the structure dispenses with much of the material, weight and bulk of traditional design. It does not describe a human-designed counterpart, only current designs.

### 3b: GM bracket. SUPPORTED

1. **GM release, "Advanced Software Design Technology Leads GM to Lighter, More Efficient Vehicles"** (read as reprinted by Sustainable Brands, shown "Published May 18, 2018"). GM and Autodesk engineers produced a proof-of-concept seat bracket that is 40 percent lighter and 20 percent stronger, and it consolidates "eight different components into one 3D-printed part". Locator: 4th paragraph. Other dates for the same release (4, 18 and 22 May 2018) appeared in search summaries; I read only the Sustainable Brands copy, so treat "May 2018" as the safe reading.
2. **Not in the release:** "for electric vehicles" (the word "electric" does not occur in the text I read). The release says "proof-of-concept", which the book does not.

URLs read: airbus.com/en/newsroom/news/2016-03-pioneering-bionic-3d-printing; research.autodesk.com/projects/bionic-partition/; airframer.com/news/release/32217; 3dprint.com/109310/airbus-autodesk-dividing-wall/; sustainablebrands.com/read/press-release/advanced-software-design-technology-leads-gm-to-lighter-more-efficient-vehicles

---

## Claim 4: Ian Burkhart and Guitar Hero (Ch. 5)

**Book:** ch05 opener under "Three-Body Interaction Principles": in 2020 Burkhart played Guitar Hero "using only his thoughts". `src/content/chapters/05.md` opener (line 43) says that in 2020 he moved his hand, and calls it "The first such demonstration in history."

### 4a: the 2020 date. CONTRADICTED

1. **Ohio State release of 25 June 2014** (ScienceDaily reprint): Burkhart, 23, was the first patient to use the Neurobridge device; the chip was implanted in a three-hour surgery on 22 April (2014). No guitar game is mentioned.
2. **Ohio State release of 13 April 2016** (ScienceDaily reprint): he first demonstrated the neural bypass in June 2014, opening and closing his hand. The same release says that in clinical sessions he could swipe a credit card or play a guitar video game. Locator: paragraphs 1 and 4 of the 2016 release.
3. **Nature paper:** Bouton et al., "Restoring cortical control of functional movement in a human with quadriplegia", Nature, published online 13 April 2016 (received 19 Aug 2015, accepted 15 Feb 2016). I could read only the abstract, the Nature summary and the references; the full text is paywalled. The Nature summary says six volitional wrist and hand motions. I could not read the paper's own mention of Guitar Hero, if any.
4. **Press coverage on 13 April 2016** (Gizmodo, PopSci) reports the Guitar Hero demonstration alongside the paper. I found no source giving the date of the Guitar Hero session itself, only that it was reported in April 2016. I found no 2020 Guitar Hero event.
5. **"Using only his thoughts".** The sources describe thoughts decoded by an implant, which drive a forearm sleeve of electrodes, which moves his own fingers. The 2016 release says he plays with his own fingers and hand.

### 4b: "first such demonstration in history". PARTLY SUPPORTED

1. The 2014 release opens by saying that, for the first time ever, a paralyzed man can move his fingers and hand with his own thoughts. The 2016 release has Dr. Ali Rezai saying it is the first time a quadriplegic patient is shown improving his motor function. These are the institutions' own claims.
2. The Nature abstract says earlier work had already decoded intracortical signals so that paralysed people could control computers and robotic arms. Its own claim is narrower: linking cortical signals in real time to muscle activation in a paralysed person. Locator: Nature abstract, first sentences.

URLs read: sciencedaily.com/releases/2014/06/140625130137.htm; sciencedaily.com/releases/2016/04/160413140118.htm; nature.com/articles/nature17435 (abstract and summary only); gizmodo.com/brain-implant-enables-quadriplegic-man-to-play-guitar-h-1770566874; popsci.com/for-first-time-scientists-restore-finger-movements-in-paralyzed-man. I did not find or read Burkhart's own later interviews.

---

## Claim 5: Netflix (Ch. 2)

**Book:** ch02, "House of Cards" passage: Netflix greenlit two full seasons on a $100 million budget, based almost entirely on data about the British original, Spacey and Fincher; a later paragraph says the recommendation engine saves over $1 billion annually.

### 5a: House of Cards. PARTLY SUPPORTED

1. **Peter Kafka, AllThingsD, 18 Mar 2011, Q&A with Ted Sarandos (primary interview).** Netflix finalised a deal for two seasons. Sarandos would not discuss terms, and people familiar with the company had already knocked down the $100 million-plus figure Deadline first reported. Netflix would not cover the full production cost, since Media Rights Capital produces and owns the show.
2. **Same interview, Sarandos on what the bet was:** the creative team and the source material (BBC version, Fincher, Spacey) were what Netflix was betting on. He also said Netflix had long used algorithms to predict audience size for DVDs and had high confidence the same methods would work here. So data was part of his stated reasoning, but the "almost entirely" is the book's.
3. **Netflix press release, 18 Mar 2011** (reprinted in the same page and by Deadline): a minimum of 26 episodes, with Fincher directing the pilot. Deadline's report says the first episode would be evaluated like a pilot before the rest were produced. This sits awkwardly with the book's statement that Netflix skipped a pilot, though what counts as a pilot is a matter of wording.
4. **The $100M number.** I read only the AllThingsD description of it. I did not read Deadline's original report of the figure. Netflix never disclosed it (per AllThingsD). In 2011 the book's story was therefore a reported, disputed number, not a Netflix statement.
5. **Gomez-Uribe & Hunt (ACM TMIS 6(4), Art. 13, Dec 2015)** mention "House of Cards" only as an example of video-similarity A/B results (§2.5 text and Fig. 5; §5.2 language example). It says nothing about the greenlight decision.

### 5b: $1B. SUPPORTED

1. Gomez-Uribe & Hunt, §3 "Business Value": over years of work, personalization and recommendations have reduced churn by several percentage points, and the authors write that the combined effect would "save us more than $1B per year".
2. Same §3: monthly churn is in the low single digits and much of it is due to payment failure. The paper frames the $1B as a belief (it begins "We think"), covering personalization *and* recommendations, not the recommendation engine alone.
3. §2.8: the recommender influences choice for about 80% of hours streamed. The book says only that a significant portion of viewing comes from recommendations, which is consistent.

URLs read: allthingsd.com/20110318/netflix-bets-big-on-house-of-cards-but-swears-its-not-a-radical-departure-qa-with-content-boss-ted-sarandos/; deadline.com/2011/03/its-official-netflix-picks-up-david-fincher-kevin-spacey-series-house-of-cards; thedrum.com/news/2012/08/24/… (Sarandos at Edinburgh 2012: "taste-based algorithms"); gwern.net/doc/reinforcement-learning/exploration/2015-gomezuribe.pdf (copy of the ACM paper, doi 10.1145/2843948).

---

## Claim 6: Memory failures in Heartbleed, Morris worm, Code Red (Ch. 3)

**Book:** ch03, section on the JVM and garbage collection: the claim that most security vulnerabilities in the history of computing, naming Heartbleed, the Morris Worm and Code Red, "trace back to memory management failures". The paragraph is about malloc/free, leaks, dangling pointers and double frees.

### 6a: the three named cases. PARTLY SUPPORTED

1. **Heartbleed.** OpenSSL Security Advisory, 07 Apr 2014, CVE-2014-0160, titled "TLS heartbeat read overrun": a missing bounds check in the heartbeat handling can reveal up to 64k of memory. Discovered by Neel Mehta of Google Security. This is an out-of-bounds read (memory safety), not an allocation or free error. **(Inference, moderate confidence):** a bounds-checked language would have stopped it; a garbage collector alone would not have.
2. **Code Red.** CERT Advisory CA-2001-19 (19 Jul 2001): the worm sends a crafted HTTP GET to exploit a buffer overflow in the IIS Indexing Service, described in CA-2001-13 (a remotely exploitable overflow in IDQ.DLL; found by eEye). A buffer overflow is a memory-safety bug. I did not read eEye's own analysis.
3. **Morris worm.** Eichin & Rochlis, "With Microscope and Tweezers" (MIT, 9 Feb 1989), §1.4.1 and §2.1: the worm used four routes: sendmail debug mode (a feature that let mail run a program), a fingerd stack buffer overflow (§2.1.2), rexec/rsh trust, and password guessing (dictionary of 432 words). Only one of the four was a memory bug (§2.1.2: a library function with no range checking). That attack worked only on 4.3BSD VAX machines. I did not read Spafford's 1988 report.
4. **Net:** Heartbleed and Code Red are memory-safety errors; the Morris worm is mixed. "Memory management failures" fits none exactly. The accurate umbrella term is memory-safety or bounds errors.

### 6b: "most … in the history of computing". PARTLY SUPPORTED

1. **Microsoft:** MSRC blog, 16 Jul 2019, "A proactive approach to more secure code" (read): the Figure 1 caption says about 70% of the vulnerabilities Microsoft assigns a CVE each year are memory-safety issues, citing Matt Miller's 2019 BlueHat IL talk. Microsoft products only; the blog says MSRC has triaged every report since 2004. I did not see the figure's year range.
2. **Chromium:** chromium.org/Home/chromium-security/memory-safety (read): "around 70% of our high severity security bugs" are memory-unsafety problems, based on 912 high or critical bugs since 2015. Chrome only.
3. **Google/Android:** Google Online Security Blog, 25 Sep 2024 (read): memory-safety issues were 76% of Android vulnerabilities in 2019 and 24% in 2024, as new code moved to memory-safe languages. The post itself calls 70% the industry norm.
4. **Gap:** these are large codebases written mostly in C and C++ over about the last 10–20 years. None speaks for "the history of computing", and Android shows the share can fall. The 70% figure is the strongest primary support for "most"; the book gives no citation.

URLs read: openssl-library.org/news/secadv/20140407.txt; sunsite.icm.edu.pl/pub/security/cert/cert_advisories/CA-2001-19.txt and …/CA-2001-13.txt (mirrors of the CERT advisories); people.eecs.berkeley.edu/~daw/teaching/cs261-f98/papers/internet_worm.txt (text of Eichin & Rochlis); microsoft.com/en-us/msrc/blog/2019/07/a-proactive-approach-to-more-secure-code; chromium.org/Home/chromium-security/memory-safety/; security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html

---

## Claim 7: Bogotá (Ch. 4)

**Book:** ch04 full text, opening and the paragraph on safety: Bogotá is dying in 1998, homicides peaked at 80 per 100,000 in the early 1990s, Peñalosa's first term is given as 1998–2001, and homicides fell to 20 by 2004, "a 75% reduction". The repo opener (`src/content/chapters/04.md`, line 43) instead says that after 1998 came Antanas Mockus and that homicide fell by 70% "within a decade".

**Verdict: PARTLY SUPPORTED.**

1. **World Bank/IDB case study** (Llorente & Rivas, "La caída del crimen en Bogotá", adapted by the World Bank from the IDB document; read), §II: homicide fell from about 80 per 100,000 at its 1993 peak to 22 in 2004 (my translation from the Spanish). Source stated on Gráfica 1: CIC-Policía Nacional and DANE.
2. **Mayors, same study §III:** Castro 1992–94; Mockus 1995–97; Peñalosa 1998–2000; Mockus again, which this study dates 2000–2003 (see item 4).
3. **CERAC working paper** (Aguirre et al., Dec 2009; read), Introduction: Bogotá's peak was 1993 (about 4,500 homicides); the 2009 figure of 1,327 was about 70% below 1993; a current rate of 18 per 100,000 against 80 in 1993.
4. **Casas Dupuy & González (Fundación Seguridad y Democracia; read):** footnote 1 gives Mockus 1995–1997, Peñalosa 1998–2000, Mockus 2001–2003. It says the rate returned to about 25 in 1999 (the pre-1984 average) and that the decline begins in 1993, before the Mockus–Peñalosa era; it reports that the policies' promoters cite a fall from 80 in 1993 to under 20 in 2002 (my translation). This is a critique by a think tank, using Policía Nacional data. The two sources differ on the start of Mockus's second term (2000 vs 2001); I did not find a primary city source that settles it.
5. **Arithmetic:** 80 → 22 is −72.5%. The chapter's 20 (−75%) and the opener's 70% are each about 2.5 points away. Neither version is cleaner on the numbers.
6. **Which version is closer?** On who: both sources split the period between two mayors, and the decline began before either took office (item 4). The chapter's "In 1998 … dying" and "Mockus … Then came" cannot both be right, since Mockus's first term began in 1995. The full chapter's term dates "1998-2001" differ from the sources (1998–2000). On numbers the opener is no better. On attribution, the full chapter's credit to Peñalosa alone and the opener's credit to Mockus alone each leave out the other and the pre-1995 decline.

URLs read: humanas.unal.edu.co/colantropos/files/5314/7415/7787/la_caida_del_crimen_en_Bogota.pdf; cerac.org.co/assets/pdf/Other%20publications/CERAC_WP_14_DemandBogotaFinal.pdf; pdba.georgetown.edu/Security/citizensecurity/Colombia/evaluaciones/politicasBogota.pdf. I did not find Bogotá city or Policía Nacional tables directly.

---

## Claim 8: GPT-3 energy and cobalt (Ch. 6)

**Book:** ch06: training GPT-3 used 1,287 MWh of electricity, said to power 120 US homes for a year, and produced 552 tons of CO2, said to equal one person's lifetime footprint; and "Seventy percent of the world's cobalt comes from the Democratic Republic of Congo".

### 8a: GPT-3. PARTLY SUPPORTED

1. **Patterson et al., "Carbon Emissions and Large Neural Network Training" (arXiv:2104.10350, 2021), Table 4:** GPT-3 energy 1,287 MWh; gross and net 552.1 tCO2e; 10,000 V100 chips; 14.8 days; datacenter PUE 1.10.
2. **Text, §3 bullet on GPT-3:** The text gives the same two figures as estimates (the paper explains the method in Appendix A), in metric tonnes of CO2-equivalent.
3. **Comparisons in the paper itself:** §4.8 says GPT-3 is about 305% of a whole-jet SF–NY round trip (180 tCO2e) and a single passenger round trip is about 1.2 tCO2e. The "120 homes" and "lifetime carbon footprint" comparisons are not in the paper (searched). I did not check other sources for them.

### 8b: cobalt. SUPPORTED

USGS Mineral Commodity Summaries, Cobalt chapters (each read), "Events, Trends, and Issues" and World Mine Production table:
1. **MCS 2021 (for 2020):** Congo (Kinshasa) supplied "approximately 70%" of world cobalt mine production.
2. **MCS 2022 (for 2021):** "more than 70%"; Congo 120,000 t of 170,000 t.
3. **MCS 2024 (for 2023):** 74%; Congo 170,000 t of 230,000 t.
4. **MCS 2025 (for 2024):** an estimated 76%; Congo 220,000 t of 290,000 t.
5. **MCS 2026 (for 2025):** an estimated 73%; the same chapter notes a Congo export ban announced in February.
The book's 70% matches 2020–2021 and has been at or above that since. The book does not give a year. I did not check the claim about workers digging by hand. USGS 2022 only notes "artisanally mined cobalt in Congo".

URLs read: arxiv.org/pdf/2104.10350; pubs.usgs.gov/periodicals/mcs{2021,2022,2024,2025,2026}/mcs{year}-cobalt.pdf

---

## Claim 9: Huyen and Meadows (Chs. 7 and 1)

### 9a: Huyen's 70%. UNSOURCED

1. **Book:** ch07, expert section on Chip Huyen: "Huyen points out that 70% of ML projects never make it to production". The same chapter says its expert voices are synthesised from published work (a disclosure note appears at the start of the chapter).
2. A web search for the figure with Huyen's book *Designing Machine Learning Systems* (O'Reilly 2022) found no statistic, and no attribution to her. The results were publisher pages and interviews in which she speaks about why models fail to reach production but gives no percentage. I did not have the book's text. The figure may be in it; I could not tell.

### 9b: Meadows. SUPPORTED

1. **Donella Meadows, "Leverage Points: Places to Intervene in a System"** (read at donellameadows.org). The page was posted 19 October 1999 (archive footer). I did not confirm the "Sustainability Institute" publication from this page.
2. The essay shows a first list of nine, then a revised list "in increasing order of effectiveness" with twelve items. Item 12 is constants, parameters and numbers (subsidies, taxes, standards). Item 2 is the mindset or paradigm. Item 1 is "The power to transcend paradigms".
3. **Imprecision in the book:** it puts "the paradigm" at the top. The top item is the power to transcend paradigms; the paradigm is second.

URLs read: donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/

---

## Claim 10: ATMs and bank tellers (Ch. 9)

**Book:** ch09, Autor passage: tellers "rose—from roughly 300,000 in 1970 to nearly 500,000 by 2010".

**Verdict: CONTRADICTED** (on the figures and years).

1. **Autor, "Why Are There Still So Many Jobs?", Journal of Economic Perspectives 29(3), Summer 2015, pp. 3–30** (read, MIT-hosted PDF), the ATM paragraph on about pp. 6–7: ATMs "quadrupled from approximately 100,000 to 400,000 between 1995 and 2010"; US bank teller employment rose "modestly from 500,000 to approximately 550,000" over 1980 to 2010; the paper notes tellers still fell as a share of employment.
2. **Mechanism in the same passage:** tellers per branch fell by more than a third between 1988 and 2004, while urban bank branches rose by more than 40 percent; tellers moved toward relationship banking. The book's explanation matches this.
3. **Source:** Autor attributes the data to Bessen (2015), "Toil and Technology", Finance & Development 52(1). I could not download that article, so I did not read Bessen directly.
4. **The 300,000 in 1970 figure:** not in Autor's paper. A search summary suggested Autor's TEDxCambridge talk says tellers went from about a quarter of a million to half a million; I could not read the transcript, so this is unverified. I found no source for 300,000 in 1970.

URLs read: economics.mit.edu/sites/default/files/inline-files/Why%20Are%20there%20Still%20So%20Many%20Jobs_0.pdf

---

## Short lists for the author

### Claims the author should correct in the book
- **Ch. 5 (Burkhart):** change "2020". First hand movement was June 2014 and the Guitar Hero demonstration was reported with the Nature paper in April 2016. Say that thoughts are decoded and drive a stimulation sleeve, rather than "only his thoughts". Soften "first such demonstration in history" to the institutions' wording or attribute it.
- **Ch. 7 (Airbus partition):** change "2019" to 2015 (unveiled) and 2016 (Airbus announcement). Say "generative design", and "45% (30 kg) lighter than current designs".
- **Ch. 9 (tellers):** replace 300,000 → 500,000 (1970–2010) with Autor's 500,000 → about 550,000 (1980–2010), cite Autor 2015 and Bessen 2015.
- **Ch. 4 (Bogotá):** fix chronology ("In 1998 … Then came Mockus"), mayors' terms (Peñalosa 1998–2000), and say the decline began in 1993 before either mayor. Pick one set of figures (80 → 22, 1993 → 2004) and cite them. Reconcile the opener (70%, Mockus) with the full chapter (75%, Peñalosa).
- **Ch. 3 (memory):** "memory management failures" does not describe Heartbleed (bounds check) or Code Red (buffer overflow); use "memory-safety bugs". Morris used four routes, one a buffer overflow. Replace "history of computing" with the Microsoft, Chromium and Android figures and years.
- **Ch. 2 (House of Cards):** the $100M was a press report disputed at the time; "almost entirely on data" goes beyond what Sarandos said.
- **Ch. 6 (GPT-3):** "120 homes" and "one person's lifetime footprint" are not in Patterson et al.; remove or source separately.
- **Ch. 1:** "partnership with … UCSF" does not match the PNAS affiliations (Facebook and Cornell).

### Claims that need a source added
- Ch. 9 and X: the Stanford pneumonia AI story (nothing found).
- Ch. 1 title: "$50 Million" (nothing found).
- Ch. 7: Huyen's 70% (nothing found).
- Ch. 6: the equivalences for GPT-3 energy and CO2; the year behind the cobalt figure.
- Ch. 3: a citation for the memory-safety share.

### Claims I could not resolve
- Date of the Guitar Hero session itself (only that it was reported in April 2016); Burkhart's later interviews not found; Nature paper full text not read.
- Whether Huyen's book contains the 70% statement (book text not available).
- The original Deadline report of the $100M figure (not read).
- Exact start date of Mockus's second term (sources differ: 2000 vs 2001); city and police tables not read directly.
- Autor's TEDxCambridge numbers and Bessen's own article (not read).
- Spafford's 1988 report and eEye's Code Red analysis (not read).
- Whether the GM release was 4, 18 or 22 May 2018 (copies differ in search summaries; only one copy read).

---

## Note added 2026-10-17: other sessions' findings

Five other research sessions wrote `receipts-ch1-3.md`, `receipts-ch4-5.md`, `receipts-ch5-7.md`, `receipts-ch7-9.md` and `receipts-ch9-x.md` in this folder, covering cases beyond the ten claims above. Their book-versus-source differences are summarised, unverified by me, in the last section of `correction-plan.md` (items R1–R12). This audit's ten claims were not changed by them. Where the sessions overlap with this file (Facebook, Bogotá, Airbus, GPT-3, tellers), their findings agree with the verdicts here as far as I could tell from their reports; I did not compare the receipts line by line.
