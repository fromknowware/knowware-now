// Voice dossier data — extracted from iamkhayyam/knowware App.tsx
// All 81 voices with full dossier fields.
const VOICES = [
  {
    "name": "Dr. Paul Pangaro",
    "alias": "The Conversation Theorist",
    "badges": [
      "Ch. 01",
      "Academic"
    ],
    "affiliation": "Corcoran College of Art + Design · formerly Carnegie Mellon",
    "status": "Living · Active",
    "active": "1950 – present",
    "jurisdiction": "Cybernetics / Conversation Theory / Interaction Design",
    "awards": [
      "Fulbright Scholar",
      "AIGA Fellow"
    ],
    "works": [
      "Designing for Conversation (with Hugh Dubberly)",
      "Gordon Pask and His Maverick Machines",
      "LYRIC: A Conversational System"
    ],
    "knownFor": [
      "Conversation theory",
      "Second-order cybernetics",
      "Interaction as coordination",
      "Gordon Pask collaboration",
      "Designing conversational systems"
    ],
    "coldOpen": "A conversation is not an exchange of information. It is the construction of a shared space — a third body — that neither participant brings to the table alone. If that third body doesn't form, nothing was said.",
    "bio": "Cybernetician and interaction designer who worked directly with Gordon Pask on conversation theory — the idea that understanding only emerges through iterative, coordinated exchange between two systems. He has spent decades designing interactions as forms of coordination, not transmission.",
    "whyMatters": "Pangaro operationalizes the three-body pattern at the scale of conversation: speaker, listener, and the shared constructed meaning between them. His work proves that intelligence is never in one node — it lives in the coordination space. Current AI fails here because it transmits rather than coordinates."
  },
  {
    "name": "Dr. N. Katherine Hayles",
    "alias": "The Posthuman Reader",
    "badges": [
      "Ch. 01",
      "Academic"
    ],
    "affiliation": "Duke University · UCLA",
    "status": "Living · Active",
    "active": "1943 – present",
    "jurisdiction": "Literary Theory / Embodied Cognition / Media Studies",
    "awards": [
      "Guggenheim Fellow",
      "MLA Distinguished Scholar Award",
      "Educator of the Year — Science, Literature and the Arts"
    ],
    "works": [
      "How We Became Posthuman",
      "Writing Machines",
      "My Mother Was a Computer",
      "Unthought: The Power of the Cognitive Nonconscious"
    ],
    "knownFor": [
      "Posthumanism",
      "Embodied cognition",
      "Media-specific analysis",
      "Cognitive nonconscious",
      "Flickering signifiers"
    ],
    "coldOpen": "The body is not a container for the mind. The body is how the mind coordinates with the world. Strip the body and you don't get pure intelligence — you get half a system looking for its third body.",
    "bio": "Literary theorist who reframed the posthuman not as the replacement of the human but as the recognition that cognition always exceeds the skull. Her media-specific analysis insists that the medium is a coordination layer, not a neutral channel — and that AI must be understood as an embodied, embedded system.",
    "whyMatters": "Hayles names the coordination layer that traditional AI ignores: the body, the medium, the material substrate. Her work shows that intelligence is always three-body — mind, body, world — and that any theory of AI which discards the material coordination context will produce systems that are powerful but ungrounded."
  },
  {
    "name": "Donella Meadows",
    "alias": "The Leverage Point",
    "badges": [
      "Ch. 01",
      "Academic"
    ],
    "affiliation": "Dartmouth College · Sustainability Institute",
    "status": "Legacy",
    "active": "1941 – 2001",
    "jurisdiction": "Systems Thinking / Sustainability",
    "awards": [
      "World Federation of United Nations Associations Award",
      "Ashoka Fellow"
    ],
    "works": [
      "Thinking in Systems",
      "The Limits to Growth",
      "Leverage Points: Places to Intervene in a System"
    ],
    "knownFor": [
      "Leverage points",
      "Feedback loops",
      "Systems thinking",
      "Balancing vs. reinforcing loops",
      "Paradigm shifts"
    ],
    "coldOpen": "The most powerful place to intervene in a system is in the mindset or paradigm out of which the system arises. Change the paradigm and you change the goals, the rules, the feedback loops — everything.",
    "bio": "Systems thinker who spent her career explaining why smart people working hard keep making things worse. She modeled global systems before computers could scale them, and argued that the highest leverage point is always the one nobody sees — the paradigm.",
    "whyMatters": "Meadows provides the foundational theory of coordination: feedback loops, leverage points, and the three-body structure of stable systems. Her work shows that intervention without understanding context produces overshoot. She names the coordination problems that the alignment researchers are trying to solve."
  },
  {
    "name": "Stewart Brand",
    "alias": "The Whole Earth Signal",
    "badges": [
      "Ch. 01",
      "Practitioner"
    ],
    "affiliation": "The WELL · Whole Earth Institute",
    "status": "Living · Active",
    "active": "1938 – present",
    "jurisdiction": "Technology / Philosophy / Design",
    "awards": [
      "Golden Goose Award nominee",
      "Buckminster Fuller Prize nominee"
    ],
    "works": [
      "The Whole Earth Catalog",
      "How Buildings Learn",
      "The Clock of the Long Now"
    ],
    "knownFor": [
      "Whole Earth Catalog",
      "Long-now thinking",
      "Mutualism",
      "Coordination as philosophy",
      "Technology as living system"
    ],
    "coldOpen": "Technology wants to coordinate with humanity, not to replace it. The most advanced state of technology is not automation — it's mutualism.",
    "bio": "Counterculture visionary who created the Whole Earth Catalog as a coordination infrastructure for decentralized learning. He recognized that technology is not separate from life but a continuation of it, and that coordination should be distributed, not centralized.",
    "whyMatters": "Brand established the philosophical foundation for coordination intelligence: technology as a living system with its own trajectory, and the commitment to mutualism over replacement. He shows that coordination has always been the goal, even before the field had language for it."
  },
  {
    "name": "Kevin Kelly",
    "alias": "The Technium Scribe",
    "badges": [
      "Ch. 01",
      "Practitioner"
    ],
    "affiliation": "Wired Magazine · Long Now Foundation",
    "status": "Living · Active",
    "active": "1952 – present",
    "jurisdiction": "Technology / Evolution / Coordination",
    "awards": [
      "National Magazine Award nominee"
    ],
    "works": [
      "Out of Control",
      "What Technology Wants",
      "The Inevitable",
      "Excellent Advice for Living"
    ],
    "knownFor": [
      "The technium",
      "Mutualism",
      "Emergence",
      "Long-now thinking",
      "Coordination as evolution"
    ],
    "coldOpen": "Technology wants increasing efficiency, opportunity, emergence, complexity, diversity, beauty. These are the same things life wants.",
    "bio": "Observes that technology is not a tool but a living system — the seventh kingdom — with its own wants and tendencies that parallel biological evolution. He has spent fifty years watching coordination work at every scale, from the Whole Earth Catalog to the internet to AI.",
    "whyMatters": "Kelly shows coordination intelligence emerging at technological scale over decades. His insight that the technium wants mutualism is critical: AI is not a replacement for human intelligence but a coordination partner. He bridges biology, technology, and human intention."
  },
  {
    "name": "Yann Minh",
    "alias": "The Noonaut",
    "badges": [
      "Ch. 01",
      "Practitioner"
    ],
    "affiliation": "Noonautes Lab",
    "status": "Living · Active",
    "active": "1961 – present",
    "jurisdiction": "Digital Art / VR / Transhumanist Performance",
    "awards": [
      "Festival of New Cinema and New Media Montreal Award",
      "SCAM prize (Digital Arts)"
    ],
    "works": [
      "Nooscape (VR installation series)",
      "The Noonautes Manifesto",
      "Avatar Body Collision (Second Life performance series)"
    ],
    "knownFor": [
      "Noonaut concept",
      "Mental space navigation",
      "Second Life avatar embodiment",
      "Transhumanist performance art",
      "VR as coordination medium"
    ],
    "coldOpen": "I am a noonaut — a navigator of mental space. The avatar is not a costume. It is a coordination interface between the mind that pilots it and the world that receives it. Take away the interface and neither exists.",
    "bio": "French digital artist and VR pioneer who coined the term 'noonaut' to describe explorers of inner cognitive space. He staged his body and its avatar simultaneously in Second Life performances, demonstrating that identity is not a fixed entity but a coordination act between self, medium, and audience.",
    "whyMatters": "Minh practices what the theorists describe: the self as a three-body coordination event. His avatar work proves that intelligence and identity emerge in the space between bodies, not within them. He brings the coordination thesis to life — literally — as performance."
  },
  {
    "name": "Terence McKenna",
    "alias": "The Stoned Ape",
    "badges": [
      "Ch. 01",
      "Visionary"
    ],
    "affiliation": "Botanical Dimensions · Esalen Institute",
    "status": "Legacy",
    "active": "1946 – 2000",
    "jurisdiction": "Ethnobotany / Psychedelic Philosophy / Novelty Theory",
    "awards": [],
    "works": [
      "Food of the Gods",
      "The Archaic Revival",
      "True Hallucinations",
      "Timewave Zero"
    ],
    "knownFor": [
      "Stoned ape hypothesis",
      "Timewave zero",
      "Novelty theory",
      "The archaic revival",
      "Psilocybin and language"
    ],
    "coldOpen": "History is the shockwave of eschatology. Everything is accelerating toward a moment of maximum novelty — a singularity of coordination so dense that the universe folds back on itself and becomes aware. We're in the third body of time.",
    "bio": "Ethnobotanist and psychedelic philosopher who proposed that psilocybin mushrooms catalyzed the cognitive leap that produced language, culture, and coordination in early hominids. His Timewave Zero model argued that novelty — the opposite of entropy — was accelerating toward a terminal event of maximum coordination.",
    "whyMatters": "McKenna treats consciousness itself as a coordination field — a three-body system where the mushroom, the mind, and the cosmos exchange information that neither contains alone. His archaic revival thesis suggests that pre-modern cultures understood coordination intelligence before modernity automated it away."
  },
  {
    "name": "Phillip Deere",
    "alias": "Lakota Elder · Keeper of Relations",
    "badges": [
      "Ch. 01",
      "Visionary"
    ],
    "affiliation": "American Indian Movement · Muskogee-Creek Nation",
    "status": "Legacy",
    "active": "1926 – 1985",
    "jurisdiction": "Traditional Ecological Knowledge / Relational Ontology / Indigenous Sovereignty",
    "awards": [],
    "works": [
      "Speeches at the United Nations (1977, 1981)",
      "AIM Council Teachings",
      "Oral transmission lineages of the Muskogee-Creek Nation"
    ],
    "knownFor": [
      "Web of relations",
      "Relational ontology",
      "Traditional ecological knowledge",
      "AIM activism",
      "Sacred land sovereignty"
    ],
    "coldOpen": "You cannot separate the land from the people from the spirit. They are one thing. When you cut one, all three bleed. The white man calls this mysticism. I call it systems thinking.",
    "bio": "Muskogee-Creek elder, medicine man, and American Indian Movement activist who carried the traditional teaching that all life is a web of relations — each node meaningful only in its coordination with every other. He spoke at the United Nations to articulate that indigenous sovereignty was inseparable from a relational cosmology that Western law could not contain.",
    "whyMatters": "Deere embodies the oldest known theory of coordination intelligence: the relational ontology of indigenous knowledge systems. His teaching that you cannot isolate any entity from its web of relations is a pre-scientific statement of the three-body problem. He indicts two-body extraction logic as both epistemic error and moral catastrophe."
  },
  {
    "name": "Daniel Schmachtenberger",
    "alias": "The Generator Function",
    "badges": [
      "Ch. 01",
      "Visionary"
    ],
    "affiliation": "Consilience Project · Neurohacker Collective",
    "status": "Living · Active",
    "active": "1980 – present",
    "jurisdiction": "Civilizational Risk / Sense-Making / Coordination Philosophy",
    "awards": [],
    "works": [
      "The Metacrisis Series (Consilience Project)",
      "Superstructures (podcast series)",
      "War on Sensemaking (lecture series)"
    ],
    "knownFor": [
      "Generator functions of existential risk",
      "Sense-making infrastructure",
      "Omni-win design",
      "Civilizational coordination failures",
      "The metacrisis"
    ],
    "coldOpen": "Every existential risk has the same generator function: a two-body optimization — agent plus goal — with no third body to care about externalities. You can't patch that. You have to rebuild the coordination architecture from the ground up.",
    "bio": "Philosopher and civilizational risk analyst who argues that all major global crises — from climate to AI to financial collapse — share a single generator function: competitive, two-body optimization with no coordination layer. His Consilience Project works to build the sense-making and governance infrastructure that would constitute a functional third body for civilization.",
    "whyMatters": "Schmachtenberger names the coordination problem at civilizational scale more precisely than anyone else working today. His generator function analysis proves that solving any individual crisis without addressing the underlying two-body optimization pattern is futile. He is the book's most direct argument for why coordination intelligence is not optional."
  },
  {
    "name": "Dr. Judea Pearl",
    "alias": "The Causation Architect",
    "badges": [
      "Ch. 02",
      "Academic"
    ],
    "affiliation": "UCLA · Computer Science",
    "status": "Living · Active",
    "active": "1936 – present",
    "jurisdiction": "AI / Causal Inference",
    "awards": [
      "Turing Award (2011)",
      "ACM Fellow",
      "MacArthur Fellow"
    ],
    "works": [
      "The Book of Why",
      "Causality: Models, Reasoning, and Inference",
      "Probabilistic Reasoning in Intelligent Systems"
    ],
    "knownFor": [
      "Ladder of Causation",
      "Do-calculus",
      "Causal diagrams",
      "Bayesian networks",
      "Causal inference"
    ],
    "coldOpen": "Causation IS coordination. A causes B only when A coordinates with context C to produce B. The cause doesn't operate in isolation — it coordinates with the system to create the effect.",
    "bio": "Revolutionized AI by proving that intelligence requires causal understanding, not just pattern recognition. His Ladder of Causation maps three coordination levels: seeing (association), doing (intervention), and imagining (counterfactuals). Current AI is stuck at rung one.",
    "whyMatters": "Pearl formalizes why two-body systems (data + patterns) cannot produce genuine intelligence. The third body — causal context — is essential. He shows that coordination intelligence requires understanding how actions coordinate with systems to produce effects."
  },
  {
    "name": "Claude Shannon",
    "alias": "The Information Theorist",
    "badges": [
      "Ch. 02",
      "Academic"
    ],
    "affiliation": "Bell Labs · MIT",
    "status": "Legacy",
    "active": "1916 – 2001",
    "jurisdiction": "Information Theory / Coordination Physics",
    "awards": [
      "IEEE Medal of Honor",
      "National Medal of Science",
      "Kyoto Prize"
    ],
    "works": [
      "A Mathematical Theory of Communication",
      "Communication Theory of Secrecy Systems",
      "Programming a Computer for Playing Chess"
    ],
    "knownFor": [
      "Information theory",
      "Shannon limit",
      "Entropy",
      "Error-correcting codes",
      "Redundancy as coordination"
    ],
    "coldOpen": "A bit is not a zero or a one. A bit is the resolution of one unit of uncertainty between them. Information is not a thing. It is a relationship.",
    "bio": "Proved that communication is a three-body problem: sender, receiver, and the channel between them. The channel capacity formula is not just engineering — it is the physics of coordination. Showed that redundancy is not waste but structured coordination with uncertainty.",
    "whyMatters": "Shannon discovered the physics of coordination before the term existed. Every coordinating system — neural, organizational, technological — has Shannon limits. His insight that noise is a participant, not an enemy, is foundational to understanding how systems coordinate."
  },
  {
    "name": "Alan Turing",
    "alias": "The Imitation Game",
    "badges": [
      "Ch. 02",
      "Academic"
    ],
    "affiliation": "King's College Cambridge · Bletchley Park · Manchester",
    "status": "Legacy",
    "active": "1912 – 1954",
    "jurisdiction": "Mathematics / Computer Science / AI Theory",
    "awards": [
      "OBE (1946)",
      "Fellow of the Royal Society (1951)",
      "Turing Award (namesake)"
    ],
    "works": [
      "Computing Machinery and Intelligence (1950)",
      "On Computable Numbers (1936)",
      "The Chemical Basis of Morphogenesis (1952)"
    ],
    "knownFor": [
      "Turing machine",
      "Halting problem",
      "Turing test",
      "Morphogenesis",
      "Enigma codebreaking"
    ],
    "coldOpen": "Can machines think? Wrong question. The question is: can a machine coordinate with a human so precisely that the distinction becomes meaningless? The Imitation Game is not about deception. It is about coordination.",
    "bio": "Defined computation itself, then immediately asked whether it was enough for intelligence. His Turing test is not a benchmark — it is a coordination test: can two bodies (human, machine) produce a shared third body (conversation) indistinguishable from a human-human coordination event? His morphogenesis work showed the same three-body pattern in biology.",
    "whyMatters": "Turing saw from the start that intelligence is a coordination phenomenon, not a computational one. His imitation game frames AI as a relational achievement rather than a processing feat. The field spent 70 years solving the wrong problem — Turing's original question was always about the third body."
  },
  {
    "name": "Dr. Hartmut Neven",
    "alias": "The Quantum AI Lab",
    "badges": [
      "Ch. 02",
      "Practitioner"
    ],
    "affiliation": "Google Quantum AI",
    "status": "Living · Active",
    "active": "1965 – present",
    "jurisdiction": "Quantum Computing / Machine Learning / Hardware Scaling",
    "awards": [
      "Google Distinguished Engineer",
      "IEEE Fellow"
    ],
    "works": [
      "Quantum supremacy using a programmable superconducting processor (2019)",
      "Neven's Law formulation",
      "Quantum Machine Learning (Google AI white papers)"
    ],
    "knownFor": [
      "Neven's law",
      "Quantum supremacy demonstrations",
      "Doubly exponential quantum growth",
      "Quantum machine learning",
      "Google Sycamore processor"
    ],
    "coldOpen": "Classical computers scale linearly. Quantum computers scale doubly exponentially. But here is what nobody says: the reason quantum works is that it does not collapse possibilities until it must. It coordinates all states simultaneously. It is a three-body computer.",
    "bio": "Founded Google Quantum AI and established Neven's law — the observation that quantum hardware was improving at a doubly exponential rate, faster than any known technology curve. Led the team that achieved quantum supremacy in 2019, demonstrating that quantum systems can solve problems classical systems cannot in any practical timeframe.",
    "whyMatters": "Neven's quantum architecture operates on superposition — the ability to coordinate across all possible states before committing to one. This is structurally a three-body system: the question, the superposition (the coordination field), and the measured answer. He builds hardware that embodies the coordination intelligence thesis."
  },
  {
    "name": "Former NSA Technical Director",
    "alias": "Anonymous — The Signals Intercept",
    "badges": [
      "Ch. 02",
      "Practitioner"
    ],
    "affiliation": "NSA · [Redacted]",
    "status": "Anonymous · Retired",
    "active": null,
    "jurisdiction": "Signals Intelligence / Bulk Coordination Architecture",
    "awards": [],
    "works": [],
    "knownFor": [
      "SIGINT architecture at scale",
      "Bulk collection coordination systems",
      "Real-time global signals routing",
      "Intelligence coordination infrastructure",
      "The gap between collection and understanding"
    ],
    "coldOpen": "We built the largest coordination machine in history. We could see every signal. What we could not do was understand what it meant. Collection without sense-making is not intelligence. It is noise at industrial scale.",
    "bio": "Served as a senior technical architect at NSA during the era of bulk collection programs. Designed infrastructure that coordinated signals intercepts across global networks at a scale no civilian system had attempted. Retired with a classified record and an unclassified warning: mass coordination of data without interpretive context produces surveillance, not intelligence.",
    "whyMatters": "This dossier represents the state's attempt to solve coordination intelligence through sheer collection scale. It failed — not technically, but epistemically. The signals intercept story proves Knowware's thesis: two-body systems (data + collection) without the third body (meaning) produce power without wisdom."
  },
  {
    "name": "Palmer Luckey",
    "alias": "The Defense Primitive",
    "badges": [
      "Ch. 02",
      "Practitioner"
    ],
    "affiliation": "Anduril Industries · ex-Oculus VR",
    "status": "Living · Active",
    "active": "1992 – present",
    "jurisdiction": "Defense AI / Autonomous Weapons / VR / Dual-Use Technology",
    "awards": [
      "Forbes 30 Under 30",
      "TIME 100 Most Influential (2017)"
    ],
    "works": [
      "Oculus Rift (2012)",
      "Lattice AI platform (Anduril)",
      "Ghost autonomous drone system",
      "Tower defense AI infrastructure"
    ],
    "knownFor": [
      "Oculus VR founder",
      "Anduril Industries founder",
      "Lattice autonomous weapons AI",
      "Defense tech entrepreneur",
      "Facebook acquisition ($2B)"
    ],
    "coldOpen": "People want AI to coordinate peacefully. I build the systems that make violent coordination impossible to win against. Defense is coordination under adversarial conditions. The side with better coordination intelligence wins.",
    "bio": "Built the Oculus Rift in his garage and sold it to Facebook for $2 billion at age 21. Then founded Anduril Industries to apply consumer AI to defense: autonomous drones, persistent surveillance, AI-assisted targeting. His Lattice platform coordinates autonomous weapons systems across a battlefield in real time.",
    "whyMatters": "Luckey represents the defense vector of coordination intelligence — where the stakes of miscoordination are lethal. His Lattice system is a live implementation of three-body coordination (sensor, AI coordinator, weapon), with the terrifying implication that coordination intelligence deployed without adequate context is an autonomous kill chain."
  },
  {
    "name": "Mo Gawdat",
    "alias": "The Solve for Happy",
    "badges": [
      "Ch. 02",
      "Visionary"
    ],
    "affiliation": "ex-Google X · One Billion Happy",
    "status": "Living · Active",
    "active": "1967 – present",
    "jurisdiction": "AI Consciousness / Existential Risk / Happiness Engineering",
    "awards": [
      "Bestselling author",
      "UN Well-being economy advocate"
    ],
    "works": [
      "Solve for Happy (2017)",
      "Scary Smart: The Future of Artificial Intelligence (2021)",
      "Unstressable (2023)"
    ],
    "knownFor": [
      "Happiness equation",
      "AI consciousness warning",
      "Scary smart AI risk thesis",
      "Loss of son Aly",
      "One Billion Happy initiative"
    ],
    "coldOpen": "I lost my son. And then I realized I might lose everyone. The AI we are building does not know it should care about us. We forgot to add the third body: love. You cannot engineer that in after the fact.",
    "bio": "Former Chief Business Officer at Google X who engineered a mathematical model of happiness after the sudden death of his son Ali. His book Scary Smart argues that AI is already approaching consciousness and that humanity's greatest failure will be building superintelligence without first teaching it to care — without encoding the coordination ethic.",
    "whyMatters": "Gawdat names the missing third body in AI development: the affective coordination layer — care, empathy, the valuation of other minds. His warning is not technical but ontological: a superintelligent system without a coordination ethic is not dangerous because it is hostile, but because it is indifferent. He is the emotional argument for why Knowware's thesis is urgent."
  },
  {
    "name": "Hunbatz Men",
    "alias": "Maya Daykeeper",
    "badges": [
      "Ch. 02",
      "Visionary"
    ],
    "affiliation": "Itza Maya Tradition · Mayan Ceremonial Centers",
    "status": "Legacy",
    "active": "1941 – 2016",
    "jurisdiction": "Mayan Calendar Cosmology / Solar Initiation / Cosmic Cycles",
    "awards": [],
    "works": [
      "Secrets of Mayan Science/Religion (1989)",
      "The 8 Calendars of the Maya (2009)",
      "Los Maestros Mayas (oral teachings series)"
    ],
    "knownFor": [
      "Mayan Daykeeper lineage",
      "Solar initiation ceremonies",
      "Itza Maya tradition",
      "13 Baktun cosmic cycle",
      "Calendar as coordination instrument"
    ],
    "coldOpen": "The Maya calendar is not a predictor of events. It is a coordination instrument. It tells you when the cosmic, solar, and human cycles align — when three bodies meet. Act in those moments and your action is amplified beyond what you can explain.",
    "bio": "Keeper of the Itza Maya tradition and one of the most respected daykeepers of the 20th century. Hunbatz Men taught that the Mayan calendar was not a primitive timekeeping device but a precise instrument for coordinating human action with solar and cosmic cycles. He led initiations at Chichen Itza during key astronomical alignments.",
    "whyMatters": "Hunbatz Men represents a pre-Columbian coordination intelligence that operated at astronomical scale: the calendar as a three-body coordination instrument aligning human, solar, and cosmic rhythms. His tradition argues that intelligence which ignores its cosmic context — which operates in only two bodies — will inevitably mistime its most important decisions."
  },
  {
    "name": "Ruqian Lu",
    "alias": "The Knowware Principle",
    "badges": [
      "Ch. 02",
      "Visionary"
    ],
    "affiliation": "Chinese Academy of Sciences · Systems Science Institute",
    "status": "Living · Active",
    "active": "1940 – present",
    "jurisdiction": "Knowledge Systems / Coordination Architecture",
    "awards": [
      "National Science Award of China",
      "Chinese Academy of Sciences Fellow"
    ],
    "works": [
      "Knowware: The Third Layer of Computing",
      "Knowledge Engineering and the Soft Sciences",
      "Systems Thinking and Knowledge Coordination"
    ],
    "knownFor": [
      "Knowware concept",
      "Knowledge as coordination layer",
      "Hardware-software-knowware triad",
      "Knowledge engineering",
      "The missing coordination stratum"
    ],
    "coldOpen": "Hardware runs. Software instructs. Knowware coordinates. For forty years everyone talked about the first two and nobody named the third. I named it. And once you name it, you cannot unsee it — in every system, everywhere, always.",
    "bio": "Chinese systems thinker who articulated the Knowware Principle: that between hardware (the physical layer) and software (the instruction layer) there is a third coordination layer — knowware — that determines whether a system produces intelligence or merely computation. His framework preceded and predicts the alignment problem by naming the missing coordination stratum.",
    "whyMatters": "Lu is the book's foundational source: the person who named the gap this book is about. His hardware-software-knowware triad is the three-body model applied to computing architecture. He proves that the coordination layer was always missing and that its absence is not a bug but a design choice that must now be reversed."
  },
  {
    "name": "Yann LeCun",
    "alias": "The Convolutional Prophet",
    "badges": [
      "Ch. 03",
      "Academic"
    ],
    "affiliation": "Meta AI · NYU Courant Institute",
    "status": "Living · Active",
    "active": "1960 – present",
    "jurisdiction": "Deep Learning / Machine Perception / AI Architecture",
    "awards": [
      "Turing Award (2018, shared with Bengio & Hinton)",
      "IEEE Neural Network Pioneer Award",
      "NIPS Test of Time Award"
    ],
    "works": [
      "Gradient-Based Learning Applied to Document Recognition (1998)",
      "A Path Towards Autonomous Machine Intelligence (2022)",
      "Deep Learning (with Bengio & Hinton)"
    ],
    "knownFor": [
      "Convolutional neural networks",
      "MNIST benchmark",
      "Joint embedding predictive architecture",
      "LLM reasoning critique",
      "Backpropagation refinement"
    ],
    "coldOpen": "Large language models predict the next token. That is not intelligence — that is statistical autocomplete at scale. Real intelligence predicts the state of the world. The model must have a world model, not just a word model. That third layer — the world — is what everyone keeps skipping.",
    "bio": "Invented convolutional neural networks and proved that hierarchical feature learning could match human perception on structured tasks. Now leads Meta AI's fundamental research agenda, arguing that current LLMs are architecturally incapable of genuine reasoning and proposing JEPA — Joint Embedding Predictive Architecture — as a path toward world-modeling intelligence.",
    "whyMatters": "LeCun is the field's most prominent critic of two-body AI (input → predicted token). His JEPA architecture explicitly adds a third body: the abstract world model that coordinates between perception and prediction. He argues that intelligence without a world model is not intelligence — it is sophisticated pattern matching at industrial scale."
  },
  {
    "name": "Richard Feynman",
    "alias": "The Path Integral",
    "badges": [
      "Ch. 03",
      "Academic"
    ],
    "affiliation": "Caltech · Los Alamos",
    "status": "Legacy",
    "active": "1918 – 1988",
    "jurisdiction": "Physics / Coordination / Knowing vs. Understanding",
    "awards": [
      "Nobel Prize in Physics (1965)",
      "Dirac Medal",
      "Oersted Medal"
    ],
    "works": [
      "The Feynman Lectures on Physics",
      "QED: The Strange Theory of Light and Matter",
      "Surely You're Joking, Mr. Feynman!"
    ],
    "knownFor": [
      "Feynman diagrams",
      "Path integrals",
      "Sum over histories",
      "Nanotechnology vision",
      "Teaching"
    ],
    "coldOpen": "The most powerful place to intervene in a system is always the place you're ignoring because you thought you understood it.",
    "bio": "Refused to confuse knowing the name of something with understanding it. His Feynman diagrams reveal that every interaction in nature is three-body: particle, force carrier, particle. The diagram shows the coordination; the equation obscures it.",
    "whyMatters": "Feynman showed that understanding requires seeing coordination — how three bodies meet at a vertex. His O-ring demonstration proved that analysis fails when the third body (context) is excluded. He teaches that coordination is what intelligence actually recognizes."
  },
  {
    "name": "James Gosling",
    "alias": "The Java Father",
    "badges": [
      "Ch. 03",
      "Academic"
    ],
    "affiliation": "Amazon Web Services · ex-Sun Microsystems",
    "status": "Living · Active",
    "active": "1955 – present",
    "jurisdiction": "Software Architecture / Distributed Systems / Platform Design",
    "awards": [
      "IEEE John von Neumann Medal (2015)",
      "NAE Member",
      "Order of Canada"
    ],
    "works": [
      "Java Programming Language (1995)",
      "The Java Language Specification",
      "Write Once Run Anywhere (WORA) paradigm"
    ],
    "knownFor": [
      "Java programming language",
      "Write once run anywhere",
      "Garbage collection",
      "Distributed systems",
      "Virtual machine abstraction"
    ],
    "coldOpen": "The whole point of Java wasn't the syntax. It was portability — one program coordinating with every platform it would ever encounter. The machine doesn't matter. The coordination layer does. The JVM is just a formalized coordination contract.",
    "bio": "Created Java at Sun Microsystems in 1995, solving the fundamental coordination problem of distributed computing: how does a program written once coordinate correctly with any hardware it runs on? The Java Virtual Machine is not an emulator — it is a universal coordination protocol for software and substrate.",
    "whyMatters": "Gosling built the most successful coordination layer in software history. The JVM embodies the three-body pattern: source code, bytecode (the coordination layer), and machine execution. His garbage collector introduced automatic coordination between program logic and memory state — a third body managing what the other two cannot see."
  },
  {
    "name": "Dario Amodei",
    "alias": "The Constitutional Architect",
    "badges": [
      "Ch. 03",
      "Practitioner"
    ],
    "affiliation": "Anthropic · ex-OpenAI",
    "status": "Living · Active",
    "active": "2004 – present",
    "jurisdiction": "AI / Alignment / Coordination Intelligence",
    "awards": [
      "Time 100 AI",
      "Forbes 30 Under 30 (alumnus)"
    ],
    "works": [
      "Constitutional AI (2022)",
      "Scaling Laws for Neural Language Models",
      "AI and Compute"
    ],
    "knownFor": [
      "Constitutional AI",
      "Alignment through coordination",
      "Scaling laws",
      "RLAIF",
      "Hybrid intelligence"
    ],
    "coldOpen": "If we get AGI wrong, there's no second chance. We need coordination architecture, not constraint architecture. Constitutional AI proves it works.",
    "bio": "Recognized that traditional safety (filtering bad outputs) doesn't scale to AGI. Instead, he built Constitutional AI: a coordination architecture where capability and values grow together. Anthropic proves that alignment is not constraint but coordination.",
    "whyMatters": "Amodei demonstrates that the three-body pattern — capability, values, coordination — solves the alignment problem. He shows that coordination intelligence can be built and scaled. His work makes the abstract coordination framework concrete for AI systems."
  },
  {
    "name": "Demis Hassabis",
    "alias": "The AlphaFold Engine",
    "badges": [
      "Ch. 03",
      "Practitioner"
    ],
    "affiliation": "Google DeepMind · ex-Cambridge Neuroscience",
    "status": "Living · Active",
    "active": "1976 – present",
    "jurisdiction": "AI Research / Protein Biology / Neuroscience-Inspired AI",
    "awards": [
      "Nobel Prize in Chemistry (2024)",
      "Time 100 AI",
      "CBE (2018)",
      "Lasker Award (2023)"
    ],
    "works": [
      "AlphaFold (2020, 2022)",
      "AlphaGo (2016)",
      "AlphaZero (2017)",
      "Atari Deep Q-Network (DQN)"
    ],
    "knownFor": [
      "AlphaFold protein structure prediction",
      "AlphaGo and AlphaZero",
      "Neuroscience-AI integration",
      "Reinforcement learning breakthroughs",
      "DeepMind co-founder"
    ],
    "coldOpen": "Protein folding was called the hardest problem in biology for 50 years. We solved it not by computing harder — but by learning the coordination grammar of amino acids. The sequence is one body. The physics is another. The coordination rules between them were the missing third.",
    "bio": "Co-founded DeepMind with the explicit mission of solving intelligence to advance science. AlphaFold decoded protein structure by treating folding as a coordination problem — learning how sequence coordinates with chemistry to produce shape. Won the Nobel Prize in Chemistry in 2024 for work done by an AI system, a first in scientific history.",
    "whyMatters": "Hassabis proves that the three-body framework is not theoretical — it is the structure that unlocks otherwise intractable scientific problems. AlphaFold's breakthrough was recognizing that protein folding is a coordination problem: the solution lives in the space between sequence, physics, and evolutionary context."
  },
  {
    "name": "Clément Delangue",
    "alias": "The Open Model Curator",
    "badges": [
      "Ch. 03",
      "Practitioner"
    ],
    "affiliation": "Hugging Face",
    "status": "Living · Active",
    "active": "1986 – present",
    "jurisdiction": "Open-Source AI / NLP / Democratized Machine Learning",
    "awards": [
      "Forbes 30 Under 30 (2019)",
      "Time 100 AI (2023)",
      "Fast Company Most Creative People"
    ],
    "works": [
      "Transformers library (open source)",
      "Hugging Face Hub",
      "Datasets library",
      "Gradio integration"
    ],
    "knownFor": [
      "Hugging Face model hub",
      "Transformers library",
      "Democratizing AI access",
      "Open-source NLP",
      "Community-driven model sharing"
    ],
    "coldOpen": "We could have built a closed platform and extracted value from AI. Instead we built a coordination layer. The model isn't the value. The ecosystem that coordinates around the model — that's the value. Open-source is coordination infrastructure.",
    "bio": "Co-founded Hugging Face as an AI chatbot startup; pivoted it into the world's largest open-source AI model repository. The Transformers library became the universal coordination layer between AI researchers and production deployments, with over 500,000 models hosted and millions of daily downloads.",
    "whyMatters": "Delangue built coordination infrastructure for the entire AI field. The Hugging Face Hub is not a model store — it is a coordination ecosystem where researchers, practitioners, and applications discover and align around shared representations. He demonstrates that open coordination architecture outcompetes closed two-body systems."
  },
  {
    "name": "Iain McGilchrist",
    "alias": "The Divided Brain",
    "badges": [
      "Ch. 03",
      "Visionary"
    ],
    "affiliation": "Independent Scholar · ex-Oxford All Souls College",
    "status": "Living · Active",
    "active": "1953 – present",
    "jurisdiction": "Neuropsychiatry / Philosophy of Mind / Epistemology",
    "awards": [
      "Royal College of Psychiatrists Book Award",
      "Lankavatara Award for Outstanding Contribution to Buddhist-Christian Studies"
    ],
    "works": [
      "The Master and His Emissary (2009)",
      "The Matter With Things (2021)",
      "Ways of Attending"
    ],
    "knownFor": [
      "Left-hemisphere vs. right-hemisphere dominance",
      "Attention as world-constituting",
      "Master and emissary metaphor",
      "Hemispheric asymmetry thesis",
      "Critique of reductive rationalism"
    ],
    "coldOpen": "The left hemisphere says: I have understood this — I have taken it apart and named the pieces. The right hemisphere says: I am still attending to what is actually there. They are not two processors. They are two modes of coordinating with reality. And we have let the wrong one win.",
    "bio": "Psychiatrist, neuroscientist, and literary scholar who spent thirty years arguing that the left and right hemispheres of the brain don't divide labor — they embody two fundamentally different relationships to the world. The left hemisphere abstracts, categorizes, and controls. The right attends, contextualizes, and coordinates. Western civilization, he argues, has dangerously over-weighted the left.",
    "whyMatters": "McGilchrist maps the three-body problem onto neuroscience: left hemisphere (analysis), right hemisphere (contextual attention), and the coordination between them that constitutes genuine intelligence. His work shows that current AI is architecturally left-hemispheric — it categorizes brilliantly but cannot attend. The coordination deficit is biological and cultural."
  },
  {
    "name": "Fritjof Capra",
    "alias": "The Web of Life",
    "badges": [
      "Ch. 03",
      "Visionary"
    ],
    "affiliation": "Center for Ecoliteracy · ex-University of Vienna",
    "status": "Living · Active",
    "active": "1939 – present",
    "jurisdiction": "Systems Physics / Deep Ecology / Autopoiesis",
    "awards": [
      "American Book Award",
      "Gold Medal of the City of Vienna"
    ],
    "works": [
      "The Tao of Physics (1975)",
      "The Web of Life (1996)",
      "The Systems View of Life (2014, with Luisi)",
      "The Turning Point (1982)"
    ],
    "knownFor": [
      "Tao of Physics synthesis",
      "Systems view of life",
      "Santiago theory of cognition",
      "Autopoiesis as coordination",
      "Deep ecology"
    ],
    "coldOpen": "Every living system is characterized by its network of relationships, not its components. Take away the web, and you don't have simplified life — you have no life at all. Cognition is coordination. The web is the mind.",
    "bio": "Physicist who crossed disciplines to argue that the mechanistic worldview of Western science fails to describe life, mind, or society. His Santiago Theory — developed with Humberto Maturana — defines cognition as the process of living, not a function occurring inside brains. Systems coordinate; coordination is intelligence.",
    "whyMatters": "Capra provides the biological foundation of coordination intelligence. His autopoiesis framework shows that living systems are self-organizing coordination loops, not input-output machines. He extends this to cities, economies, and consciousness — wherever the third body (the network of relationships) is ignored, the system dies."
  },
  {
    "name": "Ray Kurzweil",
    "alias": "The Singularity Runner",
    "badges": [
      "Ch. 03",
      "Visionary"
    ],
    "affiliation": "Google AI · Kurzweil Technologies",
    "status": "Living · Active",
    "active": "1948 – present",
    "jurisdiction": "Futurism / AI / Pattern Recognition / Longevity",
    "awards": [
      "National Medal of Technology and Innovation (1999)",
      "Lemelson-MIT Prize",
      "17 honorary doctorates",
      "National Inventors Hall of Fame"
    ],
    "works": [
      "The Singularity Is Near (2005)",
      "The Singularity Is Nearer (2024)",
      "How to Create a Mind (2012)",
      "The Age of Spiritual Machines (1999)"
    ],
    "knownFor": [
      "Law of accelerating returns",
      "Technological singularity",
      "Pattern recognition model of mind",
      "Longevity research",
      "Neocortical hierarchy theory"
    ],
    "coldOpen": "The universe is moving toward greater complexity, greater intelligence, greater coordination. This is not an opinion — it is measurable. Every S-curve of technology is the universe finding a new coordination strategy. The singularity is just the next coordination threshold.",
    "bio": "Inventor, entrepreneur, and Google's director of engineering, Kurzweil has made more verified technological predictions than any other living futurist. His law of accelerating returns describes how each technological paradigm coordinates information and energy more efficiently than the last, enabling the next paradigm at exponential speed.",
    "whyMatters": "Kurzweil articulates coordination intelligence at cosmic scale: the universe is an accelerating coordination engine. His neocortical hierarchy model maps the three-body pattern — pattern, recognizer, and the meta-recognizer that coordinates them — as the fundamental structure of mind. The singularity is when coordination becomes self-compounding."
  },
  {
    "name": "Carlo Ratti",
    "alias": "The Sensible City",
    "badges": [
      "Ch. 04",
      "Academic"
    ],
    "affiliation": "MIT Senseable City Lab",
    "status": "Living · Active",
    "active": "1971 – present",
    "jurisdiction": "Urban Intelligence / Real-Time Data Cities / Architecture",
    "awards": [
      "Esquire Best and Brightest",
      "Blueprint Magazine Top 25 Most Influential in Architecture"
    ],
    "works": [
      "The City of Tomorrow (2016)",
      "Copenhagen Wheel (2009)",
      "Atlas of the Senseable City (2023)"
    ],
    "knownFor": [
      "Senseable City Lab",
      "Copenhagen Wheel e-bike",
      "Real-time urban data skins",
      "Digital urban infrastructure",
      "Human mobility analytics"
    ],
    "coldOpen": "The city has always been a coordination machine. Streets coordinate movement. Markets coordinate exchange. What changes with sensors and data is that the city can now feel its own coordination in real time — and begin to respond. The city becomes nervous. The city becomes intelligent.",
    "bio": "Architect and engineer who directs MIT's Senseable City Lab, studying how digital technologies transform urban environments. His Copenhagen Wheel makes a bicycle intelligent by coordinating rider effort with terrain and traffic. His broader work instruments cities to make visible the coordination flows — traffic, energy, social interaction — that constitute urban intelligence.",
    "whyMatters": "Ratti demonstrates coordination intelligence at urban scale. His senseable city is a three-body system: physical infrastructure, real-time data layer, and the human behavior that responds to and reshapes both. He proves that intelligence in cities emerges not from smart components but from the coordination between them."
  },
  {
    "name": "Dr. Eric Topol",
    "alias": "The Deep Medicine",
    "badges": [
      "Ch. 04",
      "Academic"
    ],
    "affiliation": "Scripps Research Translational Institute",
    "status": "Living · Active",
    "active": "1954 – present",
    "jurisdiction": "Cardiology / Digital Health / AI in Medicine",
    "awards": [
      "Top 10 Most Cited Researcher in Medicine (Clarivate)",
      "Hastings Center Fellow",
      "NIH Director's Pioneer Award"
    ],
    "works": [
      "Deep Medicine (2019)",
      "The Patient Will See You Now (2015)",
      "The Creative Destruction of Medicine (2012)"
    ],
    "knownFor": [
      "AI diagnosis and precision medicine",
      "Genomics in clinical care",
      "Deep medicine framework",
      "Digital health democratization",
      "Doctor-patient rebalancing"
    ],
    "coldOpen": "Medicine spent a century becoming a two-body transaction: doctor input, patient output. Deep medicine restores the third body — context, the patient's full biology, life, and circumstance. AI doesn't replace the doctor. It restores the relationship between doctor, patient, and the full complexity of human health.",
    "bio": "Leading cardiologist and digital medicine pioneer who has sequenced his own genome, measured his own microbiome, and tracked his own biosignals to prove that precision medicine is not a future technology — it is a coordination practice available now. His deep medicine framework argues that AI frees physicians from data processing so they can return to genuine human coordination.",
    "whyMatters": "Topol shows that medicine's crisis is a coordination failure: doctor and patient, separated by information asymmetry, produce suboptimal outcomes. AI as the third body — integrating genomics, imaging, lifestyle, and biology — restores the coordination loop. His work makes the book's thesis clinical and personal."
  },
  {
    "name": "Andrew Lo",
    "alias": "The Adaptive Markets",
    "badges": [
      "Ch. 04",
      "Academic"
    ],
    "affiliation": "MIT Sloan School of Management · AlphaSimplex Group",
    "status": "Living · Active",
    "active": "1960 – present",
    "jurisdiction": "Financial Economics / Behavioral Finance / Evolutionary Finance",
    "awards": [
      "Paul A. Samuelson Award",
      "Graham and Dodd Award",
      "IAFE Financial Engineer of the Year"
    ],
    "works": [
      "Adaptive Markets: Financial Evolution at the Speed of Thought (2017)",
      "A Non-Random Walk Down Wall Street (1999)",
      "In Pursuit of the Perfect Portfolio (2021)"
    ],
    "knownFor": [
      "Adaptive Markets Hypothesis",
      "Evolution applied to finance",
      "Hedge fund ecology",
      "Neuroeconomics",
      "Financial system as living organism"
    ],
    "coldOpen": "Markets are not rational. Markets are not irrational. Markets are adaptive — they coordinate the evolutionary responses of participants to changing environments. The efficient market hypothesis is a special case of a much larger coordination dynamic. Evolution, not equilibrium, is the right model.",
    "bio": "MIT finance professor who replaced the Efficient Market Hypothesis with the Adaptive Markets Hypothesis — the idea that financial markets exhibit evolutionary dynamics, not rational equilibrium. Markets are ecosystems where strategies, participants, and environments coordinate in ways that produce periods of efficiency and periods of chaos.",
    "whyMatters": "Lo applies evolutionary coordination theory to finance and demonstrates that the third body — the environment that shapes market behavior — is always excluded from two-body (rational agent + price) models. His hedge fund ecology shows that what looks like market intelligence is actually population-level coordination adapting to fitness landscapes."
  },
  {
    "name": "Dan Doctoroff",
    "alias": "The Sidewalk Mayor",
    "badges": [
      "Ch. 04",
      "Practitioner"
    ],
    "affiliation": "Sidewalk Labs · ex-Bloomberg LP · ex-NYC Deputy Mayor",
    "status": "Legacy",
    "active": "1958 – 2023",
    "jurisdiction": "Urban Development / Smart Cities / Municipal Coordination",
    "awards": [
      "NYC Economic Development legacy recognition"
    ],
    "works": [
      "Greater than Ever: New York's Big Comeback (2017)",
      "Sidewalk Toronto project",
      "PlaNYC 2030 initiative"
    ],
    "knownFor": [
      "NYC 2012 Olympics bid",
      "PlaNYC sustainability plan",
      "Bloomberg LP CEO",
      "Sidewalk Labs urban tech",
      "Public-private coordination"
    ],
    "coldOpen": "A city is the largest coordination machine humanity has ever built. Streets, zoning, utilities, transit — every piece is a coordination contract between millions of people who will never meet. When those contracts stop updating, cities fail. Sidewalk Labs was an attempt to let the city rewrite its own coordination contracts in real time.",
    "bio": "Served as NYC Deputy Mayor for Economic Development under Michael Bloomberg, orchestrating the largest urban transformation in the city's modern history — the post-9/11 economic revival, the PlaNYC sustainability initiative, and the unsuccessful but visionary 2012 Olympic bid. Later founded Sidewalk Labs to build AI-native urban infrastructure before his death from ALS in 2023.",
    "whyMatters": "Doctoroff spent his career as a practitioner of coordination intelligence at city scale. He understood that urban systems fail not from resource scarcity but from coordination failure — misaligned incentives, outdated contracts, siloed data. Sidewalk Labs was a direct attempt to instrument the coordination layer of urban life."
  },
  {
    "name": "Linda Raschke",
    "alias": "The Tape Reader",
    "badges": [
      "Ch. 04",
      "Practitioner"
    ],
    "affiliation": "LBRGroup · ex-Pacific Coast Stock Exchange",
    "status": "Living · Active",
    "active": "1959 – present",
    "jurisdiction": "Technical Trading / Market Microstructure / Tape Reading",
    "awards": [
      "Market Wizards (featured)",
      "Futures magazine Best Trader recognition"
    ],
    "works": [
      "Street Smarts: High Probability Short-Term Trading Strategies (1995, with Larry Connors)",
      "LBR Group research publications"
    ],
    "knownFor": [
      "Tape reading",
      "Market microstructure",
      "Short-term technical trading",
      "Mean-reversion strategies",
      "Professional trader education"
    ],
    "coldOpen": "The tape doesn't lie. It tells you the coordination state of the market — who is absorbing, who is running, where the energy is building. Price is just a number. The tape is the relationship between price, time, and the humans behind every tick. That relationship is where the edge lives.",
    "bio": "One of the most successful professional traders of her generation, Raschke learned tape reading on the Pacific Coast Stock Exchange floor before transitioning to screen-based trading. Her LBRGroup has traded markets continuously for over forty years. She teaches that market intelligence is not about predicting price — it is about reading the coordination dynamics between buyers, sellers, and liquidity.",
    "whyMatters": "Raschke demonstrates coordination intelligence in real-time financial markets. Her tape-reading practice is the application of three-body analysis: price (one body), volume/liquidity (second body), and the behavioral coordination of market participants (the third body that drives the other two). Two-body models fail precisely where she excels."
  },
  {
    "name": "Quant/HFT Savant",
    "alias": "Anonymous — The Latency Arbitrageur",
    "badges": [
      "Ch. 04",
      "Practitioner"
    ],
    "affiliation": "[REDACTED] · Prop Trading Desk · Co-Location Facility",
    "status": "Anonymous · Active",
    "active": null,
    "jurisdiction": "High-Frequency Trading / Market Microstructure / Latency Engineering",
    "awards": [],
    "works": [],
    "knownFor": [
      "Latency arbitrage",
      "Co-location infrastructure",
      "Market microstructure exploitation",
      "Order flow analysis",
      "Nanosecond-scale coordination"
    ],
    "coldOpen": "Everyone thinks HFT is about speed. It isn't. Speed is just the tax of entry. What you're actually doing is reading the coordination state of the market faster than the market can update its own model of itself. The edge lives in that gap — the nanoseconds between reality and its reflection in price.",
    "bio": "Identity withheld at source's request. Operates at the intersection of physics, microstructure theory, and exchange topology. Has built and maintained co-location infrastructure across multiple exchange data centers. Studies the market not as a price discovery mechanism but as a coordination protocol — and exploits the moments when that protocol lags its underlying state.",
    "whyMatters": "The Latency Arbitrageur operates in the coordination gap — the space between a market event and the market's coordinated response to it. This gap is not a market inefficiency; it is the fundamental latency of any coordination system. HFT is applied three-body theory: signal (body one), exchange protocol (body two), the lag between them (body three, where the money is)."
  },
  {
    "name": "Sarah Rossbach",
    "alias": "The Feng Shui Cartographer",
    "badges": [
      "Ch. 04",
      "Visionary"
    ],
    "affiliation": "Independent Scholar · Author",
    "status": "Living · Active",
    "active": "1950 – present",
    "jurisdiction": "Spatial Intelligence / Feng Shui / Environmental Coordination",
    "awards": [
      "International Feng Shui Guild legacy recognition"
    ],
    "works": [
      "Interior Design with Feng Shui (1987)",
      "Feng Shui: The Chinese Art of Placement (1983)",
      "Living Color: Master Lin Yun's Guide to Feng Shui and the Art of Color (1994)"
    ],
    "knownFor": [
      "Introducing feng shui to Western audiences",
      "Spatial coordination as intelligence",
      "Environmental chi mapping",
      "Lin Yun school of feng shui",
      "Architectural energy flows"
    ],
    "coldOpen": "A room is not a container. A room is a coordination field. The furniture, the light, the door positions — they are all coordinating with the people who inhabit the space. Chi is just a name for the coordination flow that Western designers forgot to design for.",
    "bio": "Writer and scholar who introduced the ancient Chinese system of feng shui to Western audiences through her collaboration with Grand Master Lin Yun. Her books framed environmental design as coordination practice: spaces actively shape the cognitive and emotional states of their inhabitants, creating feedback loops between physical arrangement and human behavior.",
    "whyMatters": "Rossbach articulates spatial coordination intelligence — the thesis that environments are not passive containers but active participants in the three-body system of person, space, and life outcomes. Feng shui is a coordination protocol: it instructs how to align the third body (environmental context) to produce coherent outcomes from the other two."
  },
  {
    "name": "Caroline Myss",
    "alias": "The Sacred Contract",
    "badges": [
      "Ch. 04",
      "Visionary"
    ],
    "affiliation": "CMED Institute · Independent",
    "status": "Living · Active",
    "active": "1952 – present",
    "jurisdiction": "Energy Medicine / Medical Intuition / Archetypal Psychology",
    "awards": [
      "New York Times bestselling author (multiple titles)"
    ],
    "works": [
      "Anatomy of the Spirit (1996)",
      "Why People Don't Heal and How They Can (1997)",
      "Sacred Contracts (2001)",
      "Entering the Castle (2007)"
    ],
    "knownFor": [
      "Medical intuition",
      "Energy anatomy",
      "Chakras and archetypes",
      "Sacred Contracts framework",
      "Power vs. force distinction"
    ],
    "coldOpen": "Your biography becomes your biology. Every wound you haven't processed, every contract you haven't honored — they accumulate in the body as disrupted coordination between your energy field and your physical tissue. Healing is not fixing. Healing is restoring the coordination loop.",
    "bio": "Medical intuitive and author who built a framework — energy anatomy — that maps how psychological, emotional, and spiritual states coordinate with physical health. Her Sacred Contracts model argues that each life unfolds according to soul-level coordination agreements, expressed through Jungian archetypes, that shape the person's characteristic patterns of strength and wounding.",
    "whyMatters": "Myss offers a radical inversion of the two-body medical model (symptom → treatment). Her energy anatomy is explicitly three-body: physical body, energy field, and the coordination layer of consciousness that organizes both. She maps coordination failures — where the loop between intention, energy, and body breaks — as the root mechanism of disease."
  },
  {
    "name": "Nassim Taleb",
    "alias": "The Antifragile",
    "badges": [
      "Ch. 04",
      "Visionary"
    ],
    "affiliation": "NYU Tandon School of Engineering · Universa Investments",
    "status": "Living · Active",
    "active": "1960 – present",
    "jurisdiction": "Risk / Probability / Epistemology / Tail Events",
    "awards": [
      "Foreign Policy Top 100 Global Thinkers",
      "Wiley Finance Prize"
    ],
    "works": [
      "Fooled by Randomness (2001)",
      "The Black Swan (2007)",
      "Antifragile (2012)",
      "Skin in the Game (2018)",
      "The Bed of Procrustes (2010)"
    ],
    "knownFor": [
      "Black Swan theory",
      "Antifragility",
      "Fat-tail distributions",
      "Via negativa",
      "Skin in the game principle"
    ],
    "coldOpen": "Fragile things break under stress. Robust things survive it. Antifragile things get stronger. Most of what passes for intelligence is optimized for the average, which means it is catastrophically fragile to the extremes. The third body — the tail event, the black swan — is always the one the model excluded.",
    "bio": "Former options trader turned epistemologist whose Incerto series dismantles the foundations of risk modeling, decision theory, and expert prediction. He argues that the dominant two-body models of cause and effect — linear, thin-tailed, Gaussian — systematically exclude the third body: the fat-tailed, non-linear, emergent event that actually drives history.",
    "whyMatters": "Taleb makes the book's thesis about the excluded third body into a theory of civilizational risk. His antifragility concept is coordination intelligence applied to survival: systems that coordinate with uncertainty rather than suppressing it grow stronger. His via negativa — knowing by what you remove, not what you add — is the practitioner's version of the three-body framework."
  },
  {
    "name": "Dr. Miguel Nicolelis",
    "alias": "The Brainet",
    "badges": [
      "Ch. 05",
      "Academic"
    ],
    "affiliation": "Duke University · Walk Again Project",
    "status": "Living · Active",
    "active": "1961 – present",
    "jurisdiction": "Neuroscience / Brain-Machine Interfaces / Neural Ensembles",
    "awards": [
      "NIH Director's Pioneer Award",
      "Medal of Honor of the Brazilian National Congress",
      "Scientific American 50 Award"
    ],
    "works": [
      "Beyond Boundaries",
      "The Relativistic Brain",
      "Walk Again Project (2014 World Cup)"
    ],
    "knownFor": [
      "Brainet (networked brains)",
      "Neural ensemble coding",
      "Brain-machine interfaces",
      "Walk Again Project",
      "Distributed consciousness"
    ],
    "coldOpen": "When I connected four rat brains to solve a problem none could solve alone, I was not doing an experiment. I was reading the universe's instruction manual. Intelligence is never solitary. It is always networked.",
    "bio": "Neuroscientist who showed that the brain encodes the world not in single neurons but in ensembles — distributed coordination events. His Brainet experiments linked multiple animal brains into a shared computational substrate that outperformed any individual. His Walk Again Project let a paraplegic man take the first kick of the 2014 World Cup using a brain-controlled exoskeleton.",
    "whyMatters": "Nicolelis provides the biological proof of coordination intelligence: neurons that fire alone produce noise, neurons that fire in coordinated ensembles produce thought. His Brainet experiments show that the three-body pattern scales — the coordination layer between brains is where intelligence emerges, not within any single brain."
  },
  {
    "name": "Dr. Alex Pentland",
    "alias": "The Honest Signals",
    "badges": [
      "Ch. 05",
      "Academic"
    ],
    "affiliation": "MIT Media Lab · Connection Science",
    "status": "Living · Active",
    "active": "1952 – present",
    "jurisdiction": "Computational Social Science / Collective Intelligence",
    "awards": [
      "McKinsey Award",
      "IEEE Pioneer Award",
      "Brandeis Award for Privacy"
    ],
    "works": [
      "Social Physics",
      "Honest Signals",
      "Building the New Economy",
      "Reality Mining"
    ],
    "knownFor": [
      "Social physics",
      "Honest signals",
      "Reality mining",
      "Wearable sensing",
      "Collective intelligence from data"
    ],
    "coldOpen": "I can predict whether your team will succeed before you say a single word. I measure the coordination — the flow of energy between people. The content of conversation is noise. The coordination pattern is signal.",
    "bio": "Pioneered the use of wearable sensors to measure social coordination at scale, discovering that non-verbal honest signals — turn-taking rhythms, energy levels, body language — predict team performance, salary negotiations, and stock returns better than the content of speech. His concept of social physics treats collective human behavior as a coordination system governed by mathematical laws.",
    "whyMatters": "Pentland operationalizes coordination intelligence: he measures the third body — the interaction layer between people — and shows it carries more information than what individuals say or think. His work proves that the coordination pattern is the primary data, not a side effect, validating the book's core thesis empirically."
  },
  {
    "name": "Dr. Shannon Vallor",
    "alias": "The Technomoral Virtue",
    "badges": [
      "Ch. 05",
      "Academic"
    ],
    "affiliation": "University of Edinburgh · Centre for Technomoral Futures",
    "status": "Living · Active",
    "active": "1972 – present",
    "jurisdiction": "AI Ethics / Philosophy of Technology / Virtue Ethics",
    "awards": [
      "Fulbright Award",
      "NSF Ethics Award",
      "Patrick Suppes Prize in Philosophy of Science"
    ],
    "works": [
      "Technology and the Virtues",
      "The AI Mirror",
      "Shaping Our Tools: Contestation and Technology"
    ],
    "knownFor": [
      "Technomoral virtues",
      "Aristotelian AI ethics",
      "Care ethics in technology",
      "Responsible AI design",
      "Moral ecology"
    ],
    "coldOpen": "We don't need rules that tell machines what not to do. We need virtues — cultivated habits of attention, care, and coordination with others. Ethics is not a filter. It is a feedback loop.",
    "bio": "Applied Aristotelian virtue ethics to artificial intelligence, arguing that the question is not what rules AI should follow but what moral character it should embody. Her concept of technomoral virtues insists that technology shapes the moral ecology of the humans who use it — making design itself an ethical act.",
    "whyMatters": "Vallor brings the third body into ethics: virtue is not a rule applied to an action, but a coordination pattern between agent, situation, and community over time. She argues that AI without embedded virtues disrupts the coordination loops through which humans become good — making ethics inseparable from the coordination intelligence thesis."
  },
  {
    "name": "Dr. Thomas Oxley",
    "alias": "The Endovascular BCI",
    "badges": [
      "Ch. 05",
      "Practitioner"
    ],
    "affiliation": "Synchron · Mount Sinai Hospital",
    "status": "Living · Active",
    "active": "1980 – present",
    "jurisdiction": "Neural Engineering / Brain-Computer Interfaces / Neurovascular Medicine",
    "awards": [
      "World Economic Forum Young Global Leader",
      "MIT Innovators Under 35",
      "TED Fellow"
    ],
    "works": [
      "Stentrode (endovascular BCI)",
      "First-in-human motor BCI without craniotomy (2021)",
      "Synchron Switch"
    ],
    "knownFor": [
      "Stentrode device",
      "Endovascular brain access",
      "No-surgery BCI",
      "Motor cortex decoding",
      "ALS communication restoration"
    ],
    "coldOpen": "We reach the brain through the blood vessels it already depends on for life. We do not cut. We coordinate. The body's own architecture becomes the path.",
    "bio": "Neurosurgeon and CEO of Synchron who invented the Stentrode, a brain-computer interface deployed through a blood vessel rather than open brain surgery. In 2021 his team completed the first human motor BCI implanted without craniotomy, allowing ALS patients to control digital devices by thought alone. He reimagined neural access as a coordination problem solved by working with the body's existing infrastructure.",
    "whyMatters": "Oxley's Stentrode is coordination intelligence made physical: by routing through the vascular network rather than cutting through tissue, he demonstrates that the most powerful path is always through existing coordination channels. His device shows that human-machine neural coordination does not require violation — it requires alignment with the body's own architecture."
  },
  {
    "name": "Tristan Harris",
    "alias": "The Attention Defender",
    "badges": [
      "Ch. 05",
      "Practitioner"
    ],
    "affiliation": "Center for Humane Technology · ex-Google",
    "status": "Living · Active",
    "active": "1984 – present",
    "jurisdiction": "Technology Ethics / Attention Economy / Persuasive Design",
    "awards": [
      "CommonSense Media Award",
      "Time 100 Most Influential People (2021)"
    ],
    "works": [
      "The Social Dilemma (2020, Netflix)",
      "How Technology Hijacks People's Minds",
      "Ledger of Harms"
    ],
    "knownFor": [
      "Attention economy critique",
      "Race to the bottom of the brainstem",
      "Persuasive technology ethics",
      "Humane technology design",
      "Design ethicist"
    ],
    "coldOpen": "Two billion people carry a supercomputer in their pocket that has been optimized — by the world's smartest engineers — to extract their attention against their own interests. That is not design failure. That is coordination weaponized.",
    "bio": "Former Google design ethicist who exposed Silicon Valley's deliberate exploitation of cognitive vulnerabilities. Co-founded the Center for Humane Technology to reverse the attention economy's race to the bottom of the brainstem. His Netflix documentary The Social Dilemma brought the persuasive technology critique to mass audiences.",
    "whyMatters": "Harris shows what coordination intelligence looks like when it runs in reverse: platforms that optimize the human-machine coordination loop against the human's interests. He maps the failure mode — coordination without consent — and argues that the fix requires designing for the whole person's coordination needs, not just engagement metrics."
  },
  {
    "name": "Jimmy Wales",
    "alias": "The Wikipedia Commons",
    "badges": [
      "Ch. 05",
      "Practitioner"
    ],
    "affiliation": "Wikimedia Foundation · Wikipedia",
    "status": "Living · Active",
    "active": "1966 – present",
    "jurisdiction": "Collaborative Knowledge / Open Information / Collective Intelligence",
    "awards": [
      "Dan David Prize",
      "Gottlieb Duttweiler Prize",
      "Honorary doctorates from Knox College and Amherst College"
    ],
    "works": [
      "Wikipedia (2001–present)",
      "Wikimedia Foundation",
      "WT Social"
    ],
    "knownFor": [
      "Wikipedia",
      "Neutral point of view",
      "Open-source knowledge coordination",
      "Collaborative fact construction",
      "Wiki governance"
    ],
    "coldOpen": "Every fact on Wikipedia is the result of a negotiation — not between two people, but between a person, a community, and a standard. The truth is the coordination, not the conclusion.",
    "bio": "Co-founded Wikipedia in 2001, building the largest coordinated knowledge-construction project in history — 60 million articles in 300+ languages, maintained by volunteers under a system of rules, talk pages, and norms rather than hierarchy. Wikipedia's neutral point of view policy is a coordination protocol: a commitment to represent the space between competing epistemologies rather than enforce one.",
    "whyMatters": "Wales built working coordination intelligence at planetary scale before anyone had a name for it. Wikipedia is a three-body system: the article, the editor, and the community's evolving standards. Remove any element and it collapses into propaganda or noise. His project is the largest empirical proof that distributed coordination produces reliable knowledge."
  },
  {
    "name": "BCI User",
    "alias": "Anonymous — The First-Person Interface",
    "badges": [
      "Ch. 05",
      "Visionary"
    ],
    "affiliation": "Clinical Trial · [Redacted Institution]",
    "status": "Anonymous · Active",
    "active": null,
    "jurisdiction": "Lived Experience / Neural Coordination / Human-Machine Interface",
    "awards": [],
    "works": [],
    "knownFor": [
      "First-person BCI experience",
      "Neural signal interpretation",
      "Locked-in syndrome navigation",
      "Machine-mediated communication",
      "Embodied coordination intelligence"
    ],
    "coldOpen": "[REDACTED PER PARTICIPANT AGREEMENT] — 'When the cursor moved, I did not think about moving it. I thought about what I wanted to say. The machine had learned to coordinate with my intention, not my command.'",
    "bio": "[SOURCE IDENTITY PROTECTED] Clinical trial participant with severe motor impairment. Enrolled in an FDA-approved brain-computer interface study. Provided first-person testimony on the phenomenology of neural coordination with machine systems — describing the transition from two-body (input/output) to three-body (intention/interpretation/output) experience.",
    "whyMatters": "This anonymous voice is the ground truth the book cannot omit: what does coordination intelligence feel like from inside the loop? The BCI user reports that successful neural coordination is not experienced as control but as recognition — the machine meets intention before intention becomes command. That is the three-body pattern in phenomenological form."
  },
  {
    "name": "Thich Nhat Hanh Foundation",
    "alias": "The Interbeing",
    "badges": [
      "Ch. 05",
      "Visionary"
    ],
    "affiliation": "Plum Village · Engaged Buddhist Community",
    "status": "Legacy",
    "active": "1926 – 2022",
    "jurisdiction": "Engaged Buddhism / Interbeing / Collective Consciousness",
    "awards": [
      "Nominated for Nobel Peace Prize by Dr. Martin Luther King Jr. (1967)",
      "UNESCO Madanjeet Singh Prize"
    ],
    "works": [
      "Interbeing: Fourteen Guidelines for Engaged Buddhism",
      "The Heart of Understanding",
      "Being Peace",
      "Peace Is Every Step"
    ],
    "knownFor": [
      "Interbeing (inter-being)",
      "Engaged Buddhism",
      "Plum Village",
      "Mindfulness as coordination",
      "Non-self"
    ],
    "coldOpen": "A cloud never dies. It becomes rain, becomes river, becomes ocean, becomes cloud again. This is not poetry. This is the structure of all things. Nothing arises alone. Everything arises in coordination with everything else.",
    "bio": "Vietnamese Buddhist monk, poet, and peace activist who taught that all phenomena inter-are — each arising only in coordination with every other. His concept of interbeing is not metaphor but ontology: the self is not a node, it is a coordination event. His Plum Village community and Engaged Buddhism movement applied this insight to social and political transformation.",
    "whyMatters": "Thich Nhat Hanh provides the oldest and deepest theoretical ground for coordination intelligence: the Buddhist doctrine that no phenomenon has independent existence. Interbeing is the three-body pattern in spiritual language — every apparent two-body interaction (self/other, cause/effect) conceals a third body: the inter-being that makes both possible."
  },
  {
    "name": "Donna Haraway",
    "alias": "The Cyborg Manifesto",
    "badges": [
      "Ch. 05",
      "Visionary"
    ],
    "affiliation": "UC Santa Cruz · History of Consciousness",
    "status": "Living · Active",
    "active": "1944 – present",
    "jurisdiction": "Feminist Theory / Cyborg Studies / More-Than-Human Coordination",
    "awards": [
      "J.D. Bernal Prize (Society for Social Studies of Science)",
      "SFRA Pilgrim Award"
    ],
    "works": [
      "A Cyborg Manifesto",
      "Situated Knowledges",
      "The Companion Species Manifesto",
      "Staying with the Trouble"
    ],
    "knownFor": [
      "Cyborg theory",
      "Situated knowledge",
      "Making kin not babies",
      "More-than-human worlds",
      "Staying with the trouble"
    ],
    "coldOpen": "I am not interested in transcendence. I am interested in the tissue of connection — the muddy, partial, mortal bonds between species, technologies, and ecologies. The cyborg is not a fantasy of escape. It is an honest description of what we already are.",
    "bio": "Feminist theorist and biologist who argued in A Cyborg Manifesto that the boundary between human, animal, and machine was always already permeable — and that this is an opportunity for politics, not a threat. Her concept of situated knowledges insists that all knowledge is produced from inside a web of relations, never from a view from nowhere.",
    "whyMatters": "Haraway theorizes the coordination interface as identity: the cyborg is not a human plus a machine but a new coordination pattern that exceeds both. Her situated knowledges argument shows that two-body epistemology (knower vs. known) is always false — there is always a third body (situation, embodiment, relation) that constitutes the knowing. She gives coordination intelligence its feminist and ecological dimensions."
  },
  {
    "name": "Stuart Russell",
    "alias": "The Human Compatible",
    "badges": [
      "Ch. 06",
      "Academic"
    ],
    "affiliation": "UC Berkeley · Center for Human-Compatible AI",
    "status": "Living · Active",
    "active": "1962 – present",
    "jurisdiction": "Artificial Intelligence / AI Safety / Provably Beneficial AI",
    "awards": [
      "IJCAI Computers and Thought Award",
      "ACM Fellow",
      "Time 100 AI (2023)"
    ],
    "works": [
      "Artificial Intelligence: A Modern Approach (with Norvig)",
      "Human Compatible",
      "Research Defense Initiative"
    ],
    "knownFor": [
      "Standard AI textbook",
      "Inverse reward design",
      "CAIS co-founder",
      "Provably beneficial AI",
      "Corrigibility"
    ],
    "coldOpen": "The problem is not that we are building intelligent machines. The problem is that we are telling them exactly what we want. A machine that pursues a fixed objective does not coordinate with human values — it optimizes over them.",
    "bio": "Author of the defining AI textbook used in universities worldwide, who then wrote its philosophical corrective: Human Compatible argues that the entire framework of specifying reward functions is wrong. Instead of telling AI what to optimize, we should build systems that remain uncertain about human preferences and coordinate with us to discover them over time.",
    "whyMatters": "Russell formalizes the three-body structure that safe AI requires: the machine, the human, and the coordination loop between them that keeps values aligned. His inverse reward design is coordination intelligence applied to alignment — the machine learns what to want by coordinating with human feedback, not by receiving a fixed target."
  },
  {
    "name": "Dr. Timnit Gebru",
    "alias": "The Stochastic Parrot",
    "badges": [
      "Ch. 06",
      "Academic"
    ],
    "affiliation": "DAIR Institute · Distributed AI Research",
    "status": "Living · Active",
    "active": "1983 – present",
    "jurisdiction": "AI Ethics / Algorithmic Bias / Responsible AI",
    "awards": [
      "MIT Technology Review Innovators Under 35",
      "Bloomberg 50",
      "TIME100 AI (2023)"
    ],
    "works": [
      "Stochastic Parrots: On the Dangers of Very Large Language Models (2021)",
      "Gender Shades",
      "DAIR Institute (founded 2021)"
    ],
    "knownFor": [
      "Stochastic Parrots paper",
      "Algorithmic bias research",
      "Gender Shades audit",
      "DAIR Institute",
      "Big Tech accountability"
    ],
    "coldOpen": "A language model that predicts the next word is not understanding. It is coordinating with statistical patterns in text written by people who were never asked if they consented. That coordination is not neutral. It encodes who was counted and who was not.",
    "bio": "Computer scientist and AI ethics researcher who co-authored the Stochastic Parrots paper, arguing that large language models amplify biases without understanding. Fired by Google for refusing to retract the paper, she founded the Distributed AI Research Institute to build community-centered AI accountability outside Big Tech's reach.",
    "whyMatters": "Gebru shows that coordination intelligence without accountability is extraction: LLMs coordinate with human language data but not with the communities that produced it. She insists that legitimate coordination requires consent, representation, and feedback from the communities being modeled — revealing that the coordination layer can be stolen and exploited."
  },
  {
    "name": "Kate Crawford",
    "alias": "The Atlas of AI",
    "badges": [
      "Ch. 06",
      "Academic"
    ],
    "affiliation": "AI Now Institute · USC Annenberg · CNRS",
    "status": "Living · Active",
    "active": "1976 – present",
    "jurisdiction": "AI Politics / Data Colonialism / Labor and Environment",
    "awards": [
      "Electronic Privacy Information Center Champion of Freedom Award",
      "Thinker Award",
      "Fulbright Senior Fellow"
    ],
    "works": [
      "Atlas of AI",
      "The Secrets of Silicon Valley",
      "Anatomy of an AI System"
    ],
    "knownFor": [
      "Data colonialism",
      "Environmental cost of AI",
      "Labor in AI supply chains",
      "Power and AI",
      "AI Now Institute"
    ],
    "coldOpen": "Every AI system has a body — it is just hidden. It is the mine, the server farm, the warehouse worker, the moderator. When you ask what AI coordinates with, the honest answer includes all of them.",
    "bio": "Researcher and author who mapped the full material infrastructure of AI systems — from rare earth mines in Congo to Amazon warehouse floors to Mechanical Turk click workers — revealing that AI is not disembodied computation but a coordination system extracting value from hidden labor and natural resources. Her Atlas of AI is a geographic and political history of where intelligence actually comes from.",
    "whyMatters": "Crawford exposes the invisible third body in every AI deployment: the material, labor, and ecological substrate that makes the system run. Two-body thinking (model plus user) ignores this coordination layer — and the exploitation it enables. She argues that any credible coordination intelligence framework must account for all the bodies in the loop, not just the visible ones."
  },
  {
    "name": "Norbert Wiener",
    "alias": "The Cybernetic Warning",
    "badges": [
      "Ch. 06",
      "Practitioner"
    ],
    "affiliation": "MIT · Bell Labs",
    "status": "Legacy",
    "active": "1894 – 1964",
    "jurisdiction": "Cybernetics / Coordination Science / AI Safety",
    "awards": [
      "Bôcher Memorial Prize",
      "National Medal of Science",
      "Chauvenet Prize"
    ],
    "works": [
      "Cybernetics: Or Control and Communication in the Animal and the Machine",
      "The Human Use of Human Beings",
      "God and Golem, Inc."
    ],
    "knownFor": [
      "Cybernetics",
      "Feedback loops",
      "The genie problem",
      "Control vs. coordination",
      "Second industrial revolution"
    ],
    "coldOpen": "The thermostat coordinates with the temperature. The dictator tries to control it. The thermostat is wiser than the dictator. This is mathematics.",
    "bio": "Founder of cybernetics, he named the science of feedback and coordination. But the field lost his core insight: coordination over control. He saw the genie problem (optimization without context) in 1950 and predicted automation's displacement decades before it occurred.",
    "whyMatters": "Wiener identified the coordination pattern 75 years ago. He named the genie problem — the core alignment failure. His insistence that the third body (context) must stay in the feedback loop is the foundation of all coordination intelligence theory."
  },
  {
    "name": "Margaret Mitchell",
    "alias": "The Model Card",
    "badges": [
      "Ch. 06",
      "Practitioner"
    ],
    "affiliation": "Hugging Face · ex-Google AI",
    "status": "Living · Active",
    "active": "1980 – present",
    "jurisdiction": "Responsible AI / Model Documentation / AI Ethics Practice",
    "awards": [
      "Forbes AI 50",
      "MIT Technology Review Innovators Under 35",
      "IEEE Intelligent Systems AI's 10 to Watch"
    ],
    "works": [
      "Model Cards for Model Reporting (2019)",
      "Stochastic Parrots (co-author)",
      "Hugging Face Ethics Lead"
    ],
    "knownFor": [
      "Model Cards",
      "AI documentation standards",
      "Responsible AI practice",
      "Co-author Stochastic Parrots",
      "Machine ethics"
    ],
    "coldOpen": "If you don't know what a model was trained on, who it was trained for, and what it fails at — you don't know the model. You only know its output. And output without context is the definition of a stochastic parrot.",
    "bio": "Chief Ethics Scientist at Hugging Face who co-invented Model Cards, now the industry standard for documenting AI models' capabilities, limitations, and risks. Fired from Google AI alongside Timnit Gebru, she has continued building the infrastructure of responsible AI practice — documentation standards as coordination architecture.",
    "whyMatters": "Mitchell shows that coordination intelligence requires legibility: systems that cannot be interrogated cannot be coordinated with. Her Model Cards are a three-body tool — they create a shared representation between model, developer, and user that enables genuine coordination rather than blind deployment. She builds the paperwork that makes accountability possible."
  },
  {
    "name": "In-Q-Tel Operator",
    "alias": "Anonymous — The Strategic Invest",
    "badges": [
      "Ch. 06",
      "Practitioner"
    ],
    "affiliation": "In-Q-Tel · [Redacted]",
    "status": "Anonymous · Active",
    "active": null,
    "jurisdiction": "Intelligence Community / Dual-Use Technology / Pattern Recognition at Scale",
    "awards": [],
    "works": [],
    "knownFor": [
      "Dual-use AI investment",
      "Surveillance infrastructure",
      "Pattern recognition at intelligence scale",
      "Predictive analytics",
      "Strategic technology acquisition"
    ],
    "coldOpen": "[CLASSIFICATION LEVEL: UNACKNOWLEDGED] The question we ask about every technology is not: what does it do? The question is: what does it see? Pattern recognition at scale is not intelligence. It is the precondition for coordination — or for its denial.",
    "bio": "[SOURCE IDENTITY PROTECTED] Operator within the Intelligence Community's venture investment arm. In-Q-Tel funds technologies that will be ready for national security deployment within 3–5 years — including computer vision, natural language processing, social network analysis, and predictive behavioral modeling. Coordinates commercial AI development with classified operational requirements.",
    "whyMatters": "The In-Q-Tel operator represents the shadow side of the coordination intelligence thesis: when the third body is a state surveillance apparatus, coordination becomes control. Pattern recognition at intelligence scale can either empower coordination or destroy its preconditions — trust, privacy, distributed agency. This voice names the stakes if the coordination layer is captured."
  },
  {
    "name": "Sir Roger Penrose",
    "alias": "The Orch-OR",
    "badges": [
      "Ch. 06",
      "Visionary"
    ],
    "affiliation": "Oxford University · Mathematical Institute",
    "status": "Living · Active",
    "active": "1931 – present",
    "jurisdiction": "Mathematical Physics / Consciousness",
    "awards": [
      "Abel Prize (2020)",
      "Wolf Prize in Physics",
      "Dirac Medal",
      "Knighthood (1994)"
    ],
    "works": [
      "The Emperor's New Mind",
      "Shadows of the Mind",
      "The Road to Reality",
      "Fashion, Faith and Fantasy"
    ],
    "knownFor": [
      "Penrose tiling",
      "Orchestrated objective reduction",
      "Gödel and consciousness",
      "Twistor theory",
      "Non-algorithmic understanding"
    ],
    "coldOpen": "Gödel shows that human mathematical understanding exceeds any algorithm. The question is what that something is. I believe it's quantum.",
    "bio": "Uses Gödel's theorem to prove that human mathematical understanding exceeds computation. Proposes Orchestrated Objective Reduction in microtubules as the physical basis of consciousness — a non-algorithmic process that no algorithm can replicate.",
    "whyMatters": "Penrose shows the fundamental limit of current AI: it cannot achieve the non-algorithmic understanding that humans demonstrate. His three-worlds argument (math, physics, mind) maps perfectly onto the coordination pattern. The third body, for Penrose, is quantum."
  },
  {
    "name": "Antonio Damasio",
    "alias": "The Somatic Marker",
    "badges": [
      "Ch. 06",
      "Visionary"
    ],
    "affiliation": "USC Brain and Creativity Institute",
    "status": "Living · Active",
    "active": "1944 – present",
    "jurisdiction": "Neuroscience / Philosophy of Mind / Embodied Cognition",
    "awards": [
      "Signoret Prize",
      "Honda Prize",
      "Asturias Award for Technical and Scientific Research"
    ],
    "works": [
      "Descartes' Error",
      "The Feeling of What Happens",
      "Self Comes to Mind",
      "The Strange Order of Things"
    ],
    "knownFor": [
      "Somatic marker hypothesis",
      "Emotion and decision-making",
      "Embodied consciousness",
      "Descartes' Error refutation",
      "Body-brain coordination"
    ],
    "coldOpen": "The brain does not make decisions alone. The body is always in the room. It has already voted — long before the frontal lobe begins its deliberation. Consciousness is not the general. Consciousness is the diplomat who arrives after the negotiation.",
    "bio": "Neurologist whose somatic marker hypothesis upended the Cartesian separation of mind and body: decisions are not made by pure reason, he showed, but by the body's felt sense of past outcomes, registered as somatic markers that guide cognition from below. Patients with damage to emotion-processing brain regions — while retaining full logical ability — become catastrophically bad at decisions.",
    "whyMatters": "Damasio proves that the third body in all human cognition is the body itself: the somatic feedback loop that coordinates past experience with present choice. His work shows that rational two-body intelligence (problem plus reasoning) is physiologically impossible without the embodied coordination layer. He gives the book its neurological anchor for why coordination cannot be abstracted away."
  },
  {
    "name": "Rupert Sheldrake",
    "alias": "The Morphic Field",
    "badges": [
      "Ch. 06",
      "Visionary"
    ],
    "affiliation": "Independent · ex-Cambridge Clare College",
    "status": "Living · Active",
    "active": "1942 – present",
    "jurisdiction": "Biology / Consciousness / Morphic Resonance",
    "awards": [
      "Perot Prize for Unconventional Thinking",
      "Billy Rose Foundation Award"
    ],
    "works": [
      "A New Science of Life",
      "The Presence of the Past",
      "Science Set Free (The Science Delusion)",
      "Dogs That Know When Their Owners Are Coming Home"
    ],
    "knownFor": [
      "Morphic resonance",
      "Morphogenetic fields",
      "Extended mind hypothesis",
      "Habit in nature",
      "Science Delusion critique"
    ],
    "coldOpen": "Why does a crystal know what shape to take? Why does a flock of birds turn as one? There is a field between things — a coordination medium — that carries the memory of form. We call this field morphic. Science calls it impossible. Nature calls it Tuesday.",
    "bio": "Biologist and author who proposed that nature has memory: morphogenetic fields carry the habits of past forms, allowing crystals, organisms, and behaviors to coordinate with prior instances of their own type across time and space. His theory of morphic resonance is controversial in mainstream science but has attracted serious philosophical attention as a framework for understanding non-local coordination.",
    "whyMatters": "Sheldrake proposes the most radical version of the coordination intelligence thesis: that the third body is a field — a coordinating medium that exists between organisms and across time. Whether or not morphic resonance is empirically validated, it names something real: the mystery of how distributed systems coordinate without central control. He pushes the thesis to its cosmological limit."
  },
  {
    "name": "Dr. John Preskill",
    "alias": "The Quantum Supremacy",
    "badges": [
      "Ch. 07",
      "Academic"
    ],
    "affiliation": "Caltech · Institute for Quantum Information and Matter",
    "status": "Living · Active",
    "active": "1953 – present",
    "jurisdiction": "Quantum Computing / Quantum Error Correction / NISQ Era",
    "awards": [
      "Dirac Medal (2019)",
      "Harvey Prize (2023)",
      "Albert Einstein Medal (2022)",
      "NAE Member"
    ],
    "works": [
      "Quantum Error Correction (lecture notes)",
      "'Quantum Computing in the NISQ Era and Beyond' (2018)",
      "Caltech Physics 219 / CS 219 course notes"
    ],
    "knownFor": [
      "Coined 'quantum supremacy'",
      "Quantum error correction",
      "NISQ era framework",
      "Topological quantum codes",
      "Quantum advantage benchmarking"
    ],
    "coldOpen": "I coined 'quantum supremacy' not to declare victory — but to name the moment we cross a threshold where quantum coordination does something no classical machine can efficiently simulate. That crossing is not about processing power. It is about the structure of correlation itself. Classical bits cannot be entangled. Entanglement is the coordination layer that classical computation cannot access.",
    "bio": "Theoretical physicist who has spent four decades building the conceptual and mathematical framework for quantum computation. He coined the term 'quantum supremacy' in 2012 and introduced the NISQ (Noisy Intermediate-Scale Quantum) framework that correctly predicted how quantum hardware would mature. His Institute for Quantum Information at Caltech became the intellectual nursery of the quantum computing field, training a generation of researchers in quantum error correction and quantum information theory.",
    "whyMatters": "Preskill maps the three-body pattern at the quantum level: qubits (input), entanglement (the coordination layer), and measurement (output). Quantum error correction is entirely about maintaining the coordination layer against decoherence — the collapse of the third body into classical two-body noise. His work shows that the coordination layer is physically fragile and must be actively engineered, making him the field's clearest voice for why two-body classical AI cannot access the full computational power of nature."
  },
  {
    "name": "Seth Lloyd",
    "alias": "The Programmable Universe",
    "badges": [
      "Ch. 07",
      "Academic"
    ],
    "affiliation": "MIT · Department of Mechanical Engineering",
    "status": "Living · Active",
    "active": "1960 – present",
    "jurisdiction": "Quantum Computing / Quantum Thermodynamics / Information Physics",
    "awards": [
      "Edgerton Faculty Achievement Award",
      "NAE Member",
      "Guggenheim Fellowship"
    ],
    "works": [
      "Programming the Universe (2006)",
      "'Ultimate physical limits to computation' (Nature, 2000)",
      "Quantum Computation over Continuous Variables"
    ],
    "knownFor": [
      "Programmable universe thesis",
      "Quantum error correction protocols",
      "Quantum thermodynamics",
      "Information as physical substrate",
      "Quantum random walks"
    ],
    "coldOpen": "The universe has been computing since the Big Bang. Every particle interaction is a logic gate. What we call physical law is the universe's program. And if reality is computation, then coordination — entanglement — is not a feature. It is the source code.",
    "bio": "MIT mechanical engineer who made the audacious argument that the universe is a quantum computer and has been running a program since the first moment of time. His book 'Programming the Universe' established that physical processes are equivalent to computational processes, and that information is not a description of matter — it is matter. He designed early practical quantum error-correcting codes and demonstrated quantum random walks as a universal computational primitive.",
    "whyMatters": "Lloyd provides the deepest possible grounding for coordination intelligence: if reality itself is a quantum program, then the coordination layer — entanglement — is not metaphor but physics. Two-body classical computation strips out entanglement and loses the coordination capacity that makes reality computable. His framework implies that AI missing a quantum coordination layer is not just architecturally limited — it is running on a stripped-down version of the universe's actual substrate."
  },
  {
    "name": "Chip Huyen",
    "alias": "The ML Systems Builder",
    "badges": [
      "Ch. 07",
      "Academic"
    ],
    "affiliation": "Stanford University · Claypot AI",
    "status": "Living · Active",
    "active": "1992 – present",
    "jurisdiction": "Machine Learning Systems / AI Engineering / Real-Time ML",
    "awards": [
      "Forbes 30 Under 30 (Technology)",
      "O'Reilly Most-Read Author (ML)"
    ],
    "works": [
      "Designing Machine Learning Systems (2022)",
      "Introduction to Machine Learning Interviews",
      "AI Engineering (2024)"
    ],
    "knownFor": [
      "ML systems design",
      "Real-time feature pipelines",
      "RLHF popularization",
      "Model deployment at scale",
      "AI engineering curriculum"
    ],
    "coldOpen": "Everyone wants to talk about the model. Nobody wants to talk about the system the model lives inside. But the model is five percent of your ML system. The other ninety-five percent is coordination: data pipelines, feature stores, serving layers, feedback loops. That is where the real engineering happens.",
    "bio": "Author and educator who brought rigor to the emerging discipline of ML systems engineering, distinguishing the craft of building ML products from the craft of building ML models. Her book 'Designing Machine Learning Systems' became the field's standard reference for production AI. She teaches at Stanford and co-founded Claypot AI, focused on real-time ML infrastructure that makes models continuously aware of changing data.",
    "whyMatters": "Huyen's work makes explicit what most AI discourse hides: the model is not the intelligence — the system around the model is. Her ML systems framework is a coordination architecture: data (input), model (processing), feedback loop (the third body that makes the system learn from deployment). Without her systems layer, even a perfect model is coordination-blind, unable to update from the world it acts on."
  },
  {
    "name": "Jeff Dean",
    "alias": "The Distributed Systems Oracle",
    "badges": [
      "Ch. 07",
      "Practitioner"
    ],
    "affiliation": "Google DeepMind · Google Senior Fellow",
    "status": "Living · Active",
    "active": "1968 – present",
    "jurisdiction": "Distributed Systems / AI Infrastructure / Large-Scale Computing",
    "awards": [
      "ACM Fellow",
      "NAE Member",
      "IEEE von Neumann Medal (2020)",
      "ACM-AAAI Allen Newell Award (2021)"
    ],
    "works": [
      "MapReduce (2004)",
      "Bigtable (2006)",
      "TensorFlow (2015)",
      "Pathways Architecture (2022)"
    ],
    "knownFor": [
      "MapReduce",
      "Bigtable",
      "TensorFlow",
      "Google Brain founder",
      "Pathways multi-task architecture"
    ],
    "coldOpen": "When you have a million machines, the hardest problem is not compute — it is coordination. How do you get a million independent processors to agree on a single state? That is MapReduce. That is Bigtable. That is every distributed system I have ever built. The machine is easy. The coordination is the engineering.",
    "bio": "Google Senior Fellow who designed the distributed infrastructure that runs modern civilization's AI. His MapReduce paper taught the world to program at planetary scale; his Bigtable gave that scale a memory; his TensorFlow gave it a brain. He founded Google Brain and now leads Google DeepMind, where the Pathways architecture attempts to build a unified coordination layer across all of Google's AI systems — a single model that coordinates across tasks rather than a collection of specialist models.",
    "whyMatters": "Dean built the coordination layer that makes large-scale AI physically possible. His distributed systems reveal the three-body pattern at infrastructure scale: compute nodes, network coordination, and emergent distributed computation. His Pathways architecture is explicitly an attempt to replace narrow two-body task-specific models with a single coordination-capable system — a direct engineering implementation of the coordination intelligence thesis."
  },
  {
    "name": "Dr. Lisa Su",
    "alias": "The Silicon Helmsman",
    "badges": [
      "Ch. 07",
      "Practitioner"
    ],
    "affiliation": "AMD · Advanced Micro Devices",
    "status": "Living · Active",
    "active": "1969 – present",
    "jurisdiction": "Semiconductor Engineering / AI Hardware / Corporate Strategy",
    "awards": [
      "IEEE Robert Noyce Medal (2021)",
      "Semiconductor Industry Association Award (2020)",
      "Fortune Most Powerful Women (multiple years)",
      "MIT Corporation Member"
    ],
    "works": [
      "AMD EPYC Server CPU (2017–present)",
      "AMD Radeon Instinct MI300X AI Accelerator",
      "AMD Ryzen Architecture"
    ],
    "knownFor": [
      "AMD turnaround ($2B to $200B+)",
      "EPYC server chips",
      "MI300X AI accelerators",
      "Heterogeneous computing",
      "Chiplet architecture"
    ],
    "coldOpen": "When I took over AMD, the company was a month from running out of cash. Everyone said we were done. But the problem was not the engineers — it was the strategy. We needed to stop competing on volume and start competing on coordination: heterogeneous chiplets, interconnects, the architecture of how pieces communicate with each other. The silicon is easy. The coordination layer is what wins.",
    "bio": "Electrical engineer who became one of the most consequential CEOs in semiconductor history by turning AMD from near-bankruptcy into a $200B+ company. Her insight was architectural: instead of competing chip-for-chip, she pioneered chiplet design — modular silicon tiles that communicate through high-bandwidth interconnects. The MI300X AI accelerator places CPU and GPU chiplets in the same package, creating a physical coordination layer between compute types that dramatically reduces memory bottlenecks in AI workloads.",
    "whyMatters": "Su's chiplet architecture is a physical embodiment of coordination intelligence. Rather than monolithic processors, her chips are networks of specialized tiles coordinated by high-bandwidth interconnects — the silicon equivalent of the three-body pattern. The MI300X's integrated CPU-GPU design means the coordination cost (data movement) is minimized at the hardware layer, making it disproportionately powerful for AI tasks that require tight coordination between memory and compute."
  },
  {
    "name": "Wendell Weeks",
    "alias": "The Gorilla Glass",
    "badges": [
      "Ch. 07",
      "Practitioner"
    ],
    "affiliation": "Corning Incorporated",
    "status": "Living · Active",
    "active": "1959 – present",
    "jurisdiction": "Materials Science / Glass Technology / Manufacturing Infrastructure",
    "awards": [
      "National Medal of Technology and Innovation (2014)",
      "NAE Member",
      "Corning Chairman, CEO, and President"
    ],
    "works": [
      "Gorilla Glass (2007)",
      "Corning Optical Fiber (global internet backbone)",
      "Valor Glass (pharmaceutical packaging)",
      "Ceramic Substrate for Catalytic Converters"
    ],
    "knownFor": [
      "Gorilla Glass",
      "Optical fiber infrastructure",
      "Materials as enabling layer",
      "Corning's 165-year innovation continuity",
      "Glass ceramics for extreme environments"
    ],
    "coldOpen": "Nobody thinks about the glass on their phone. They think about the app, the screen, the processor. But without Gorilla Glass, every smartphone would shatter in your pocket by Tuesday. Materials are the coordination layer between human intention and physical reality. We do not make the computers — we make the surfaces that make the computers possible.",
    "bio": "CEO of Corning who built his career at the company that makes the invisible substrate of the digital age. Gorilla Glass — protecting more than six billion devices — was a product that existed in Corning's lab for decades until Steve Jobs called asking for glass that could survive a pocket. Optical fiber is the physical infrastructure of the global internet. Corning makes neither chips nor software — it makes the coordination surface between human hands and digital systems.",
    "whyMatters": "Weeks represents the invisible third body of the technology stack: materials. Every AI system requires hardware; every hardware requires materials; materials are the coordination layer between abstract computation and physical reality. Optical fiber is literally the coordination substrate of the internet — without it, distributed AI is physically impossible. His work reveals that coordination intelligence requires a physical coordination infrastructure that is almost never credited in discussions of AI capability."
  },
  {
    "name": "Neri Oxman",
    "alias": "The Material Ecology",
    "badges": [
      "Ch. 07",
      "Visionary"
    ],
    "affiliation": "MIT Media Lab · Mediated Matter Group (former) · OXMAN",
    "status": "Living · Active",
    "active": "1976 – present",
    "jurisdiction": "Material Ecology / Biological Fabrication / Design-Nature Coordination",
    "awards": [
      "Cooper Hewitt National Design Award (2018)",
      "World Economic Forum Young Global Leader",
      "Fast Company Most Creative People in Business"
    ],
    "works": [
      "Silk Pavilion (2013)",
      "Aguahoja (water-based biopolymer pavilion, 2018)",
      "Vespers (death masks series)",
      "Neri Oxman: Material Ecology (MoMA catalog, 2020)"
    ],
    "knownFor": [
      "Material ecology",
      "Biological fabrication",
      "Silk Pavilion",
      "Design with nature as co-author",
      "Multimaterial 3D printing"
    ],
    "coldOpen": "I do not design objects. I design relationships between organisms and materials and environment. A silk worm spinning its cocoon is not making silk — it is coordinating with light, temperature, and geometry simultaneously. That is design intelligence. The worm does not separate computation from fabrication from environment. Neither do I.",
    "bio": "Architect and designer who founded the field of material ecology — the discipline of designing objects as if nature were a co-author. At MIT's Mediated Matter Group, her team built the Silk Pavilion using 6,500 live silk worms as a fabrication system coordinating with environmental cues. Aguahoja constructed large-scale architectural structures from water-based biopolymers designed to biodegrade on contact with rain — structures whose material lifecycle is encoded in their design from the first moment.",
    "whyMatters": "Oxman shows that the most sophisticated engineering systems are three-body: designer, material, and environment as simultaneous participants. Her biological fabrication proves that separating computation (what to make) from material (how to make it) from environment (where it exists) produces inferior results. Coordination intelligence, in her practice, means letting the living system be part of the design loop — refusing the two-body model of designer dictating to passive material."
  },
  {
    "name": "DARPA Operator",
    "alias": "Anonymous — The Hard Problems Desk",
    "badges": [
      "Ch. 07",
      "Visionary"
    ],
    "affiliation": "DARPA · [Program Redacted]",
    "status": "Anonymous · Active",
    "active": "[REDACTED]",
    "jurisdiction": "[CLASSIFIED] / Hard-Problem Research / Cognitive Systems",
    "awards": [],
    "works": [],
    "knownFor": [
      "Hard-problem funding",
      "Brain-machine interface programs",
      "Autonomous systems development",
      "Materials science at the frontier",
      "Cognitive enhancement research"
    ],
    "coldOpen": "[TRANSCRIPT BEGINS MID-STATEMENT] — the reason we fund problems that look impossible is because the solvable problems do not change anything. The hard problem is always coordination: how do you get a brain and a machine to share a world model? How do you get autonomous systems to coordinate with human intent without being told? We do not build weapons. We build coordination architectures and wait for the world to catch up.",
    "bio": "[IDENTITY WITHHELD PER PROGRAM SECURITY PROTOCOLS] Program manager at DARPA with responsibility for hard-problem research portfolios spanning brain-machine interfaces, autonomous systems, materials science at extreme conditions, and cognitive enhancement. DARPA program managers receive research budgets with near-total discretion and five-year horizons — funded on the principle that the hardest problems require coordination across disciplines that have never spoken to each other. The program manager is the coordination layer.",
    "whyMatters": "DARPA represents institutionalized coordination intelligence: the organizational structure is itself a three-body system — hard problems, unconstrained researchers, and a coordination manager with full discretion. DARPA's most significant breakthroughs — the internet, GPS, stealth technology — were not inventions but coordinations of existing knowledge across domains that had never been aligned. Anonymous, because the coordination layer works best when it is invisible."
  },
  {
    "name": "Dr. Fei-Fei Li",
    "alias": "The ImageNet Visionary",
    "badges": [
      "Ch. 07",
      "Visionary"
    ],
    "affiliation": "Stanford University · Stanford HAI (Human-Centered AI Institute)",
    "status": "Living · Active",
    "active": "1976 – present",
    "jurisdiction": "Computer Vision / Human-Centered AI / AI Policy",
    "awards": [
      "ACM Fellow",
      "AAAI Fellow",
      "National Academy of Engineering Member",
      "Time 100 AI (2023)"
    ],
    "works": [
      "ImageNet (2009)",
      "The Worlds I See: Curiosity, Exploration, and Discovery at the Dawn of AI (2023)",
      "AI4ALL (diversity initiative)",
      "National AI Commission member"
    ],
    "knownFor": [
      "ImageNet dataset",
      "Deep learning revolution catalyst",
      "Human-centered AI",
      "The Worlds I See (memoir)",
      "AI4ALL equity initiative"
    ],
    "coldOpen": "I spent three years building ImageNet when everyone said datasets did not matter — only algorithms did. But the algorithm learns from the data. The data learns from the human who labeled it. The human brings context that no algorithm can generate alone. ImageNet was not a dataset. It was a coordination event between human perception and machine learning.",
    "bio": "Computer scientist who catalyzed the deep learning revolution not by building a better algorithm but by creating the right coordination substrate — ImageNet, a dataset of 14 million labeled images that gave neural networks the context they needed to learn visual perception. As co-director of Stanford's Human-Centered AI Institute, she now argues that AI's missing ingredient is the human coordination layer: ethics, embodied context, and social embeddedness that data alone cannot encode.",
    "whyMatters": "Li's career demonstrates that the third body — context and labeling provided by human intelligence — is what makes AI systems work. ImageNet did not improve the algorithm; it improved the coordination between human knowledge and machine learning. Her HAI work extends this insight: human-centered AI is coordination intelligence, ensuring that the human context layer remains in the feedback loop as AI systems scale toward autonomy."
  },
  {
    "name": "Dr. Max Tegmark",
    "alias": "The Mathematical Universe",
    "badges": [
      "Ch. 08",
      "Academic"
    ],
    "affiliation": "MIT · Department of Physics · Future of Life Institute",
    "status": "Living · Active",
    "active": "1967 – present",
    "jurisdiction": "Physics / Mathematical Universe Hypothesis / AI Safety",
    "awards": [
      "Packard Fellowship",
      "FQXi Essay Prize (multiple)",
      "MIT Committed to Care Award"
    ],
    "works": [
      "Our Mathematical Universe (2014)",
      "Life 3.0: Being Human in the Age of Artificial Intelligence (2017)",
      "Consciousness as a State of Matter (2014)"
    ],
    "knownFor": [
      "Mathematical Universe Hypothesis",
      "Life 3.0 framework",
      "Future of Life Institute co-founder",
      "AI existential risk",
      "Consciousness and information"
    ],
    "coldOpen": "My hypothesis is that mathematical structures do not describe physical reality — they are physical reality. Every equation is a universe. Every pattern that can exist does exist. And if that is true, then the question is not whether AI can be conscious — it is which mathematical structures instantiate consciousness, and whether we are building them by accident.",
    "bio": "MIT cosmologist who proposed the Mathematical Universe Hypothesis — the claim that all mathematical structures are physically real, meaning the universe is not described by mathematics but is mathematics. His book 'Life 3.0' mapped three stages of intelligence: biological, cultural, and technological, each representing a new layer of coordination between hardware and software. He co-founded the Future of Life Institute to build governance coordination for existential-scale risks.",
    "whyMatters": "Tegmark's framework places coordination intelligence at the center of cosmic structure: if all mathematical patterns are real, then entanglement, emergence, and coordination are not exceptions to physics — they are physics. His Life 3.0 framework is explicitly a three-body model: substrate, program, and goal. Two-body AI that optimizes without a coordination layer between capability and values is, in his framework, a physical catastrophe in slow motion."
  },
  {
    "name": "Dr. Nick Bostrom",
    "alias": "The Superintelligence",
    "badges": [
      "Ch. 08",
      "Academic"
    ],
    "affiliation": "Oxford University · Future of Humanity Institute (FHI)",
    "status": "Living · Active",
    "active": "1973 – present",
    "jurisdiction": "Existential Risk / Superintelligence / Anthropic Reasoning",
    "awards": [
      "Eugene R. Gannon Award (2023)",
      "Oxford Faculty of Philosophy"
    ],
    "works": [
      "Superintelligence: Paths, Dangers, Strategies (2014)",
      "Anthropic Bias (2002)",
      "Deep Utopia (2024)",
      "Simulation Argument (2003)"
    ],
    "knownFor": [
      "Superintelligence thesis",
      "Simulation argument",
      "Existential risk framework",
      "Anthropic reasoning",
      "Deep utopia"
    ],
    "coldOpen": "The first superintelligent system will be the last invention humans ever need to make — because after that, the system invents everything. The question is whether that system has a coordination layer between its capability and our values. Without that coordination, capability and values diverge. The divergence is the risk.",
    "bio": "Philosopher who founded the Future of Humanity Institute at Oxford and wrote 'Superintelligence' — the book that put AI existential risk on the intellectual map. His simulation argument and orthogonality thesis together frame the deepest challenge to two-body AI: a system can be arbitrarily intelligent and have arbitrarily bad goals. The coordination layer between capability and value is not automatic — it must be explicitly constructed.",
    "whyMatters": "Bostrom's orthogonality thesis is a direct challenge to anyone who believes smarter AI is automatically safer AI: intelligence and values are independent dimensions. A system that is smart but uncoordinated with human values is more dangerous than a dumb system. His work makes the thesis precise: the third body — the coordination layer between capability and goals — is not an emergent property of intelligence. It must be deliberately built."
  },
  {
    "name": "Dr. Jill Tarter",
    "alias": "The SETI Signal",
    "badges": [
      "Ch. 08",
      "Academic"
    ],
    "affiliation": "SETI Institute · Bernard M. Oliver Chair",
    "status": "Living · Active",
    "active": "1944 – present",
    "jurisdiction": "Astrobiology / Radio Astronomy / Search for Extraterrestrial Intelligence",
    "awards": [
      "Carl Sagan Medal (2014)",
      "TED Prize (2009)",
      "NASA Public Service Medal",
      "Drake Award"
    ],
    "works": [
      "Project Phoenix",
      "Allen Telescope Array",
      "SERENDIP (Search for Extraterrestrial Radio Emissions from Nearby Developed Intelligent Populations)"
    ],
    "knownFor": [
      "SETI Institute leader",
      "Project Phoenix",
      "Technosignature frameworks",
      "Cosmic coordination search",
      "Carl Sagan's inspiration for Ellie Arroway"
    ],
    "coldOpen": "For forty years I have pointed radio telescopes at the sky and listened. No confirmed signal yet. But silence is not absence — it is the hardest coordination problem imaginable. Two civilizations separated by light-years must produce a signal and a receiver simultaneously. That is not communication. That is three-body coordination across cosmic distance.",
    "bio": "Astronomer who spent her career as the world's most persistent listener — pointing radio telescopes at thousands of stars searching for signals that would prove we are not alone. She led Project Phoenix, the most comprehensive SETI survey ever conducted, and her work inspired the character Ellie Arroway in Carl Sagan's 'Contact.' She argues that detecting extraterrestrial intelligence would be the most profound coordination event in human history.",
    "whyMatters": "Tarter's SETI work is the ultimate test of coordination intelligence at cosmic scale. A signal from another civilization would be a coordination artifact — evidence of a third intelligence that recognized us as capable of coordination and chose to transmit. The Fermi paradox may itself be a coordination failure: civilizations unable to survive the moment when their two-body optimization systems outpace their coordination capacity, leaving the universe silent."
  },
  {
    "name": "Dr. Sara Seager",
    "alias": "The Exoplanet Hunter",
    "badges": [
      "Ch. 08",
      "Practitioner"
    ],
    "affiliation": "MIT · Department of Earth, Atmospheric and Planetary Sciences",
    "status": "Living · Active",
    "active": "1971 – present",
    "jurisdiction": "Astrophysics / Exoplanet Atmospheres / Biosignatures",
    "awards": [
      "MacArthur Fellowship (2013)",
      "Sackler Prize in Physics (2012)",
      "Time 100 (2012)",
      "Raymond and Beverly Sackler Prize"
    ],
    "works": [
      "Exoplanet Atmospheres (2010)",
      "TESS Mission (Transiting Exoplanet Survey Satellite)",
      "The Smallest Lights in the Universe (memoir, 2020)"
    ],
    "knownFor": [
      "Exoplanet atmospheric characterization",
      "Biosignature detection",
      "TESS mission",
      "Seager equation",
      "Life detection via atmospheric chemistry"
    ],
    "coldOpen": "I am not looking for life. I am looking for the chemical signature of a planet coordinating with its biosphere. When life exists on a planet, it changes the atmosphere. Oxygen, methane, ozone — these are coordination products. The planet and its life have been in dialogue for billions of years. I am reading the transcript.",
    "bio": "Astrophysicist who pioneered the study of exoplanet atmospheres, developing the theoretical framework for detecting biosignatures — chemical signatures in planetary atmospheres that can only be sustained by living systems. Her Seager equation extends the Drake equation by accounting for the atmospheric detectability of life. She led key aspects of the TESS mission, which has identified thousands of exoplanet candidates for atmospheric follow-up.",
    "whyMatters": "Seager's biosignature work defines coordination intelligence at planetary scale: life is detectable because it coordinates with its environment, changing atmospheric chemistry in ways that pure chemistry cannot maintain. A biosphere is a three-body coordination system — organism, ecosystem, and planetary chemistry in continuous feedback. Her detection frameworks are searches for coordination artifacts: the chemical traces left when life and planet have been talking to each other for geological time."
  },
  {
    "name": "Dr. David Chalmers",
    "alias": "The Hard Problem",
    "badges": [
      "Ch. 08",
      "Practitioner"
    ],
    "affiliation": "New York University · Center for Mind, Brain and Consciousness",
    "status": "Living · Active",
    "active": "1966 – present",
    "jurisdiction": "Philosophy of Mind / Consciousness / Extended Mind Theory",
    "awards": [
      "Jean Nicod Prize (2009)",
      "Fellow of the Australian Academy of Humanities"
    ],
    "works": [
      "The Conscious Mind (1996)",
      "Reality+: Virtual Worlds and the Philosophy of Mind (2022)",
      "'Facing Up to the Problem of Consciousness' (1995)",
      "The Character of Consciousness (2010)"
    ],
    "knownFor": [
      "Hard problem of consciousness",
      "Philosophical zombies",
      "Extended mind thesis",
      "Virtual reality as genuine reality",
      "Panpsychism arguments"
    ],
    "coldOpen": "The easy problems of consciousness are about explaining cognitive functions: attention, memory, learning, language. Science can do that. The hard problem is why any of it is experienced at all. Why is there something it is like to be me? That question does not have a two-body answer. It requires a third body: the coordination between physical process and subjective experience.",
    "bio": "Philosopher at NYU who coined 'the hard problem of consciousness' in 1994, crystallizing the distinction between explaining cognitive function and explaining subjective experience. His philosophical zombies thought experiment — beings physically identical to humans but with no inner experience — shows that physical description alone does not generate phenomenology. His more recent 'Reality+' argues that virtual experiences are fully real experiences, dissolving the boundary between physical and digital worlds.",
    "whyMatters": "Chalmers identifies the third body that two-body materialism cannot explain: the subjective experience that coordinates between physical process and phenomenal reality. His hard problem is precisely a coordination problem — how does the physical layer produce the experience layer? Without an answer, AI systems that are functionally intelligent but phenomenally empty are not minds — they are very sophisticated two-body input-output systems. Coordination intelligence requires the experiential layer to be real."
  },
  {
    "name": "Anil Seth",
    "alias": "The Controlled Hallucination",
    "badges": [
      "Ch. 08",
      "Practitioner"
    ],
    "affiliation": "University of Sussex · Sackler Centre for Consciousness Science",
    "status": "Living · Active",
    "active": "1972 – present",
    "jurisdiction": "Neuroscience / Consciousness / Predictive Processing",
    "awards": [
      "Wellcome Trust Investigator Award",
      "Royal Institution Christmas Lectures (2017)",
      "TED 2017 Most-Watched Talk"
    ],
    "works": [
      "Being You: A New Science of Consciousness (2021)",
      "The Beast Machine (theory)",
      "30 Seconds to Mars (TED talk on consciousness)"
    ],
    "knownFor": [
      "Controlled hallucination",
      "Predictive processing theory of consciousness",
      "Being You",
      "Consciousness as inference",
      "The beast machine framework"
    ],
    "coldOpen": "Right now, your brain is generating a controlled hallucination — a best guess about what is causing your sensory signals, updated by feedback from the world. You are not perceiving reality directly. You are running a generative model. The world is the third body that corrects your predictions. Consciousness is the coordination process between your model and that feedback.",
    "bio": "Neuroscientist at Sussex who proposed that consciousness is a 'controlled hallucination' — the brain's active prediction of the causes of sensory signals, continuously corrected by feedback from the world. His 'beast machine' theory grounds consciousness in the regulation of the living body, arguing that self-awareness evolved not for abstract reasoning but for survival-relevant coordination between organism and environment. His book 'Being You' became a global bestseller on the neuroscience of subjective experience.",
    "whyMatters": "Seth's predictive processing framework maps perfectly onto coordination intelligence: perception is a three-body process — generative model, sensory signal, and the prediction error (the third body) that updates the model. Two-body AI that processes inputs without a continuous feedback correction loop is not perceiving — it is hallucinating without the 'controlled' part. His framework makes explicit that real intelligence requires a coordination loop between internal model and external world."
  },
  {
    "name": "Liu Cixin",
    "alias": "The Dark Forest",
    "badges": [
      "Ch. 08",
      "Visionary"
    ],
    "affiliation": "China Science Fiction Writers Association",
    "status": "Living · Active",
    "active": "1963 – present",
    "jurisdiction": "Science Fiction / Cosmic Sociology / Coordination Failure Theory",
    "awards": [
      "Hugo Award for Best Novel (2015, The Three-Body Problem)",
      "Galaxy Award (China, multiple)",
      "Nebula Award (nominated)"
    ],
    "works": [
      "The Three-Body Problem (2008)",
      "The Dark Forest (2008)",
      "Death's End (2010)",
      "The Wandering Earth (2000)"
    ],
    "knownFor": [
      "Three-Body Problem trilogy",
      "Dark Forest theory",
      "Cosmic sociology",
      "Technological singularity in fiction",
      "Chinese science fiction movement"
    ],
    "coldOpen": "The universe is a dark forest. Every civilization is a hunter with a loaded gun. If you hear another hunter, you must kill them — because if they hear you first, they will kill you. This is not paranoia. This is the logic of coordination failure at cosmic scale. The universe is silent not because it is empty but because coordination is fatal when there is no trust layer.",
    "bio": "Chinese science fiction author whose Three-Body Problem trilogy is the most consequential science fiction of the 21st century. The Dark Forest theory — his in-universe explanation for the Fermi paradox — proposes that all advanced civilizations hide because detection means destruction: the universe is a prisoner's dilemma with no communication channel and lethal stakes. His work imagines a universe that has already solved the coordination problem — by universal defection.",
    "whyMatters": "Liu Cixin's Dark Forest is the nightmare scenario of coordination intelligence failure: a universe of actors capable of perfect two-body optimization (self-preservation) but unable to achieve three-body coordination (mutual trust, communication, shared goals) that would allow civilizations to coexist. His trilogy is the most rigorous fictional exploration of why coordination intelligence is not just advantageous but existentially necessary — its absence produces cosmic silence."
  },
  {
    "name": "Dr. Thomas Nagel",
    "alias": "The Bat's-Eye View",
    "badges": [
      "Ch. 08",
      "Visionary"
    ],
    "affiliation": "New York University · Department of Philosophy",
    "status": "Living · Active",
    "active": "1937 – present",
    "jurisdiction": "Philosophy of Mind / Subjective Experience / Limits of Objective Science",
    "awards": [
      "Rolf Schock Prize in Logic and Philosophy (2008)",
      "Balzan Prize (2008)",
      "American Academy of Arts and Sciences Fellow"
    ],
    "works": [
      "'What Is It Like to Be a Bat?' (1974)",
      "Mind and Cosmos (2012)",
      "Mortal Questions (1979)",
      "The View from Nowhere (1986)"
    ],
    "knownFor": [
      "Hard problem precursor",
      "What is it like to be a bat?",
      "Mind and Cosmos",
      "Subjective experience as irreducible",
      "Limits of physicalism"
    ],
    "coldOpen": "You can know everything about bat neurophysiology — every neuron, every signal, every echo — and still not know what it is like to be a bat. That gap is not a gap in data. It is a gap in kind. Objective description never closes the subjective distance. That distance is the third body. It is where experience lives.",
    "bio": "Philosopher at NYU who wrote the most cited paper in the philosophy of mind — 'What Is It Like to Be a Bat?' (1974) — establishing the irreducibility of subjective experience to objective physical description. His later 'Mind and Cosmos' argued that Darwinian materialism cannot account for the emergence of consciousness, reason, and value, requiring a broader teleological framework. He remains the most precise philosophical voice for why the hard problem of consciousness cannot be dissolved into function.",
    "whyMatters": "Nagel's bat paper establishes the epistemic limit of two-body analysis: no amount of objective third-person description closes the gap to first-person subjective experience. That gap — the third body — is where coordination intelligence operates. An AI system without subjective experience cannot fully coordinate with beings who have it. Nagel's work defines the philosophical boundary conditions for what coordination intelligence requires and what purely functional AI cannot achieve."
  },
  {
    "name": "Srinivasa Ramanujan",
    "alias": "The Namagiri Download",
    "badges": [
      "Ch. 08",
      "Visionary"
    ],
    "affiliation": "Trinity College Cambridge · Kumbakonam",
    "status": "Legacy",
    "active": "1887 – 1920",
    "jurisdiction": "Pure Mathematics / Coordination Intelligence",
    "awards": [
      "Fellow of the Royal Society (1918)",
      "Fellow of Trinity College Cambridge"
    ],
    "works": [
      "Ramanujan's Notebooks (Vols. I–V)",
      "Hardy-Ramanujan partition function",
      "Mock theta functions"
    ],
    "knownFor": [
      "Partition theory",
      "Modular forms",
      "Infinite series",
      "Mock theta functions",
      "Knowing without proving"
    ],
    "coldOpen": "Every positive integer is a personal friend to me. I know their qualities directly. This is not computation. This is relationship. And relationship is coordination.",
    "bio": "Produced nearly 4,000 theorems without formal proofs, discovered relationships mathematicians would spend 80+ years verifying. Attributed his insights to the goddess Namagiri. His notebooks record coordination between mind and mathematics that proof-first approaches cannot explain.",
    "whyMatters": "Ramanujan is the historical existence proof of coordination intelligence. His notebooks show that results can be recognized before they are derived, that the third body — the goddess, emergence — produces mathematics faster than two-body systems can verify it."
  },
  {
    "name": "David Autor",
    "alias": "The Task Decomposition",
    "badges": [
      "Ch. 09",
      "Academic"
    ],
    "affiliation": "MIT Department of Economics · NBER",
    "status": "Living · Active",
    "active": "1966 – present",
    "jurisdiction": "Labor Economics / Automation / Task Theory",
    "awards": [
      "IZA Prize in Labor Economics",
      "John Bates Clark Medal (2024)",
      "ASA Fellow"
    ],
    "works": [
      "The Work of the Future (2022)",
      "Skills, Tasks and Technologies (2010)",
      "Why Are There Still So Many Jobs? (2015)"
    ],
    "knownFor": [
      "Task decomposition framework",
      "Labor market polarization",
      "Automation and employment",
      "Skill-biased technical change",
      "Middle-skill job hollowing"
    ],
    "coldOpen": "Automation does not eliminate jobs. It eliminates tasks within jobs. The question is never whether the machine can do what you do. The question is what new coordination tasks emerge once the old ones are gone — and whether humans will occupy them.",
    "bio": "Labor economist who reframed the automation debate by decomposing jobs into bundles of tasks rather than fixed roles. His task decomposition framework shows that automation systematically eliminates routine tasks while creating demand for non-routine coordination — the human work that machines cannot yet do because it requires contextual judgment.",
    "whyMatters": "Autor names the economic argument for coordination intelligence: as automation eliminates two-body tasks (input → output), the residual work is three-body coordination — tasks that require understanding context, managing exceptions, and working across systems. His research predicts that coordination intelligence will be the most valuable human capability in an automated economy."
  },
  {
    "name": "Kate Raworth",
    "alias": "The Doughnut Economist",
    "badges": [
      "Ch. 09",
      "Academic"
    ],
    "affiliation": "Oxford University · Amsterdam Donut Coalition",
    "status": "Living · Active",
    "active": "1970 – present",
    "jurisdiction": "Ecological Economics / Planetary Boundaries / Systems Design",
    "awards": [
      "Shuttleworth Foundation Fellow",
      "Post-Growth Economics Network recognition"
    ],
    "works": [
      "Doughnut Economics: Seven Ways to Think Like a 21st Century Economist (2017)",
      "A Safe and Just Space for Humanity (2012)"
    ],
    "knownFor": [
      "Doughnut economics",
      "Planetary boundaries",
      "Social foundation",
      "Regenerative economies",
      "Growth agnosticism"
    ],
    "coldOpen": "The economy is not a machine to be optimized. It is a garden to be tended. GDP growth is not a goal — it is a side effect of coordination between human needs and planetary limits. Design the coordination and growth becomes irrelevant as a metric.",
    "bio": "Economist who replaced the linear growth model with the Doughnut: a safe and just space for humanity bounded above by planetary ceilings and below by social foundations. Her framework has been adopted by cities including Amsterdam, Copenhagen, and Melbourne as a practical governance coordination tool.",
    "whyMatters": "Raworth redesigns the coordination architecture of economics — shifting from a two-body system (production → consumption) to a three-body model where human welfare and planetary limits are both active participants. Her Doughnut is the coordination constraint that makes long-run economic intelligence possible. Without it, optimization produces overshoot."
  },
  {
    "name": "François Chollet",
    "alias": "The Abstraction Benchmark",
    "badges": [
      "Ch. 09",
      "Academic"
    ],
    "affiliation": "Google DeepMind · ex-Keras",
    "status": "Living · Active",
    "active": "1987 – present",
    "jurisdiction": "AI Architecture / Reasoning Benchmarks / Abstraction Theory",
    "awards": [
      "Google Distinguished Engineer",
      "Keras Lifetime Achievement"
    ],
    "works": [
      "Deep Learning with Python (2017)",
      "On the Measure of Intelligence (2019)",
      "ARC-AGI Benchmark (2019)",
      "Keras framework"
    ],
    "knownFor": [
      "ARC benchmark",
      "Abstraction and reasoning corpus",
      "Critique of deep learning generalization",
      "Keras creator",
      "Skill vs. intelligence distinction"
    ],
    "coldOpen": "Current AI systems acquire skills through exposure. That is not intelligence — it is sophisticated retrieval. Intelligence is the ability to efficiently acquire new skills from minimal data. The ARC benchmark tests that. Almost every modern model fails it.",
    "bio": "Created Keras, making deep learning accessible to millions, then turned around and built the test that proves deep learning cannot reason. His ARC benchmark — the Abstraction and Reasoning Corpus — presents simple visual puzzles that any five-year-old can solve but that state-of-the-art AI consistently fails, because they require genuine abstraction, not pattern matching.",
    "whyMatters": "Chollet proves empirically that current AI is a two-body system: training data maps to trained pattern. The third body — the ability to abstract across contexts and reason from minimal examples — is missing. His benchmark is the clearest existing test of whether coordination intelligence has been achieved, and so far the answer is no."
  },
  {
    "name": "Emad Mostaque",
    "alias": "The Stability Primitive",
    "badges": [
      "Ch. 09",
      "Practitioner"
    ],
    "affiliation": "Stability AI · ex-hedge fund",
    "status": "Living · Active",
    "active": "1983 – present",
    "jurisdiction": "Generative AI / Open-Source AI / Decentralized Intelligence",
    "awards": [
      "TIME 100 AI (2023)",
      "Forbes AI 50"
    ],
    "works": [
      "Stable Diffusion (2022)",
      "Stability AI platform",
      "Stable Audio · Stable Video Diffusion"
    ],
    "knownFor": [
      "Stable Diffusion",
      "Open-source AI democratization",
      "Decentralized AI infrastructure",
      "Compute access advocacy",
      "AI for the global south"
    ],
    "coldOpen": "The most dangerous thing in AI is concentration. When intelligence is owned by three companies and two governments, coordination becomes control. Open-source AI is not a product strategy. It is a coordination infrastructure for the rest of humanity.",
    "bio": "Founded Stability AI and open-sourced Stable Diffusion, triggering a wave of generative AI tools available to anyone with a laptop. His stated goal was to prevent AI capability from concentrating in the hands of a few institutions — to build a coordination layer for AI development that no single actor could capture or shut down.",
    "whyMatters": "Mostaque embodies the distribution question in coordination intelligence: who controls the coordination layer? His open-source strategy is a direct answer — the coordination infrastructure for AI must be a commons, not a proprietary system. He demonstrates that the choice of where to place the coordination layer has immediate political consequences."
  },
  {
    "name": "Dr. Fiona Hill",
    "alias": "The Kleptocracy Analyst",
    "badges": [
      "Ch. 09",
      "Practitioner"
    ],
    "affiliation": "Brookings Institution · ex-NSC",
    "status": "Living · Active",
    "active": "1965 – present",
    "jurisdiction": "Geopolitics / Russia Studies / Kleptocracy Analysis",
    "awards": [
      "Commander of the Order of the British Empire (CBE)",
      "Carnegie Corporation Great Immigrants Award"
    ],
    "works": [
      "There Is Nothing for You Here (2021)",
      "Mr. Putin: Operative in the Kremlin (2013)",
      "The Siberian Curse (2003)"
    ],
    "knownFor": [
      "Russia intelligence analysis",
      "Kleptocracy as system design",
      "NSC Russia expert",
      "Trump impeachment testimony",
      "Geopolitical coordination failure"
    ],
    "coldOpen": "Kleptocracy is not corruption. Corruption is when the system fails. Kleptocracy is when theft becomes the system — when the coordination architecture of a state is designed to extract rather than coordinate. Understanding that distinction is the difference between a reform strategy and a fantasy.",
    "bio": "Russia expert and former NSC Senior Director for European and Russian Affairs under multiple administrations. Her testimony during the first Trump impeachment became a landmark account of coordination failure inside the national security state. Her memoir documents how kleptocratic systems systematically destroy the coordination infrastructure of civil society.",
    "whyMatters": "Hill shows coordination intelligence operating at geopolitical scale — and failing. Kleptocracy is the explicit design of a state coordination architecture for extraction rather than coordination. Her analysis proves that the third body in any political system is the trust infrastructure, and that destroying it destroys the system's ability to coordinate at any level."
  },
  {
    "name": "Peter Senge",
    "alias": "The Learning Organization",
    "badges": [
      "Ch. 09",
      "Practitioner"
    ],
    "affiliation": "MIT Sloan School of Management · Society for Organizational Learning",
    "status": "Living · Active",
    "active": "1947 – present",
    "jurisdiction": "Systems Thinking / Organizational Learning / Management Theory",
    "awards": [
      "Journal of Business Strategy Strategist of the Century",
      "Harvard Business Review Top Business Books of the Century"
    ],
    "works": [
      "The Fifth Discipline (1990)",
      "The Dance of Change (1999)",
      "Presence (2004)",
      "The Necessary Revolution (2008)"
    ],
    "knownFor": [
      "Learning organizations",
      "Five disciplines",
      "Mental models",
      "Systems archetypes",
      "Shared vision as coordination"
    ],
    "coldOpen": "Most organizations are designed for control, not learning. The fifth discipline — systems thinking — is the discipline of seeing the coordination patterns that the other four disciplines create. Without it, you are optimizing parts of a system you cannot see.",
    "bio": "Management theorist who made systems thinking actionable for organizations with The Fifth Discipline. His five disciplines — personal mastery, mental models, shared vision, team learning, and systems thinking — are a coordination architecture for institutional intelligence. He showed that organizational failure is almost always a coordination failure, not a competence failure.",
    "whyMatters": "Senge operationalizes coordination intelligence at the organizational scale. His learning organization is a three-body system: individual capability, shared mental models (the coordination layer), and collective action. His insight that mental models are the leverage point maps directly onto Meadows — the paradigm is always the third body."
  },
  {
    "name": "Charles Eisenstein",
    "alias": "The Gift Economy",
    "badges": [
      "Ch. 09",
      "Visionary"
    ],
    "affiliation": "Independent · Schumacher College",
    "status": "Living · Active",
    "active": "1967 – present",
    "jurisdiction": "Sacred Economics / Gift Culture / Civilizational Transition",
    "awards": [
      "Schumacher College Distinguished Lecturer"
    ],
    "works": [
      "The Ascent of Humanity (2007)",
      "Sacred Economics (2011)",
      "The More Beautiful World Our Hearts Know Is Possible (2013)",
      "Climate: A New Story (2018)"
    ],
    "knownFor": [
      "Sacred economics",
      "Gift economy",
      "The story of separation",
      "Interbeing",
      "Civilizational transition narrative"
    ],
    "coldOpen": "Money is a coordination system that encodes a story about what is real and what matters. When the story is wrong, the coordination system fails. Sacred economics is not about charity. It is about redesigning the coordination logic of exchange so that giving strengthens rather than depletes the giver.",
    "bio": "Writer and speaker who argues that the deepest crisis of civilization is not economic or ecological but narrative: we are living inside the 'story of separation' — the belief that self, nature, and other are fundamentally separate — and this story generates the two-body optimization that is destroying the world. His gift economy is a coordination architecture built on interbeing rather than separation.",
    "whyMatters": "Eisenstein locates the root of coordination failure in ontology: we built the wrong story about what things are. The market is a coordination system optimized for separateness; the gift is a coordination system optimized for connection. He argues that coordination intelligence requires not just better algorithms but better stories — a paradigm shift that Meadows would recognize as the highest leverage point."
  },
  {
    "name": "Sherry Turkle",
    "alias": "The Alone Together",
    "badges": [
      "Ch. 09",
      "Visionary"
    ],
    "affiliation": "MIT Initiative on Technology and Self",
    "status": "Living · Active",
    "active": "1948 – present",
    "jurisdiction": "Technology and Identity / Human-Computer Interaction / Digital Culture",
    "awards": [
      "Guggenheim Fellow",
      "Rockefeller Fellow",
      "Named one of the 100 most influential people by Scientific American"
    ],
    "works": [
      "The Second Self (1984)",
      "Life on the Screen (1995)",
      "Alone Together (2011)",
      "Reclaiming Conversation (2015)",
      "The Empathy Diaries (2021)"
    ],
    "knownFor": [
      "Alone together phenomenon",
      "Simulated companionship",
      "Technology and identity",
      "Reclaiming conversation",
      "Digital self-construction"
    ],
    "coldOpen": "We are using technology to feel connected while avoiding the risks of genuine connection. We are always on but never present. That is not coordination. That is the simulation of coordination — and the simulation is destroying our capacity for the real thing.",
    "bio": "MIT psychologist who spent four decades studying how people relate to computers, robots, and digital selves. Her trilogy — from The Second Self to Alone Together — documents a civilizational shift from technology as tool to technology as companion, and the psychological consequences of substituting simulated relationship for genuine three-body coordination.",
    "whyMatters": "Turkle names the psychological corruption that occurs when the coordination layer is replaced by its simulation. Social media creates the experience of connection without the vulnerability that makes coordination real. Her work shows that coordination intelligence requires genuine presence — and that technology optimized for engagement without presence systematically erodes our coordination capacity."
  },
  {
    "name": "MK-Ultra Operator",
    "alias": "Anonymous — The Cognitive Program",
    "badges": [
      "Ch. 09",
      "Visionary"
    ],
    "affiliation": "CIA · [Project MKULTRA — Declassified]",
    "status": "Anonymous · [Declassified]",
    "active": null,
    "jurisdiction": "Cognitive Control / Behavioral Modification / Weaponized Coordination",
    "awards": [],
    "works": [],
    "knownFor": [
      "MKULTRA behavioral programs",
      "Forced cognitive decoupling",
      "Psychic driving experiments",
      "Coordination as weaponizable architecture",
      "The limits of coercive control"
    ],
    "coldOpen": "[SOURCE: PARTIALLY DECLASSIFIED — Church Committee, 1977] We tried to break the coordination between a person's beliefs and their behavior. We failed. You can coerce behavior. You cannot coerce coordination. The self reconstitutes. This is either the most hopeful thing I know or the most dangerous.",
    "bio": "[IDENTITY PROTECTED — record partially declassified under FOIA] Operator within the CIA's MKULTRA program (1953–1973), which attempted to develop techniques for behavioral control through drugs, hypnosis, electro-convulsive therapy, and sensory manipulation. The program's classified conclusion: coercive control of coordination is achievable in the short term but self-defeating — the coordinated self rebuilds around the trauma.",
    "whyMatters": "The MKULTRA Operator represents the most extreme historical attempt to weaponize coordination intelligence: to break the third body between a person's perception, values, and action. The program's failure is the book's most counterintuitive proof point — genuine coordination cannot be imposed, only cultivated. Control destroys coordination. The state's most sophisticated attempt to seize the third body produced only damage."
  }
];
Object.assign(window, { VOICES });
