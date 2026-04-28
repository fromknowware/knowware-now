// Hand-crafted teasers drawn from the real chapter openings.
// Each ~2 short paragraphs — a hook + a turn — intended to make the reader
// want the full chapter.

const TEASERS = {
  '01': {
    opener: 'The $50 Million Algorithm That Taught Us Everything',
    paras: [
      "June 2014. The world learned that Facebook, in partnership with Cornell and UCSF, had quietly run a psychological experiment on 689,003 users. For one week in January 2012, some saw a feed weighted toward the positive; others toward the negative. The goal, published in PNAS: measure whether emotional states could be transferred between strangers through algorithmic curation alone.",
      "The answer was a resounding, terrifying yes. The study was filed away as an ethics scandal — but that was the small story. The larger one was that coordination between algorithms, psychology, and network dynamics had produced an emergent behaviour none of the elements could produce alone. Intelligence didn't live in the humans. It didn't live in the machines. It had emerged, un-asked-for, in the space between them. That space is what this book is about.",
    ],
    diagram: {
      title: "Emotional Contagion Loop",
      caption: "Three independent systems produced emergent social intelligence when coordinated. No single element caused the effect — it lived in the space between.",
      nodes: [
        { id: "A", label: "Algorithmic\nCuration",   pos: [0, 1] },
        { id: "B", label: "User\nPsychology",        pos: [1, 0] },
        { id: "C", label: "Network\nDynamics",       pos: [2, 1] },
        { id: "D", label: "Emergent\nIntelligence",  pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "A", to: "B", label: "modulates" },
        { from: "B", to: "C", label: "propagates" },
        { from: "C", to: "A", label: "amplifies" },
        { from: "A", to: "D", kind: "latent" },
        { from: "B", to: "D", kind: "latent" },
        { from: "C", to: "D", kind: "latent" },
      ],
    },
  },
  '02': {
    opener: 'The Netflix Secret Nobody Saw',
    paras: [
      "Netflix didn't become the dominant streaming platform by having the best library or the smartest recommendation engine. It won by mastering something its rivals never quite saw: three-body coordination. Blockbuster optimised real estate. Hulu optimised licensing. Netflix optimised the relationship between viewers, catalogue, and network — a system that improved itself whenever any of the three moved.",
      "What looks from the outside like a content company is, read more carefully, a study in ternary feedback. This chapter traces how the same pattern appears in Amazon's logistics, in Toyota's factories, and in the nervous system of an octopus — and why binary thinking misses it every time.",
    ],
    diagram: {
      title: "Ternary Feedback Platform",
      caption: "Netflix's dominance emerged from optimising the relationship between all three bodies simultaneously — not any single element. Rivals who optimised one body at a time were always playing a different game.",
      nodes: [
        { id: "A", label: "Viewer\nBehaviour",   pos: [0, 1] },
        { id: "B", label: "Content\nCatalogue",  pos: [1, 0] },
        { id: "C", label: "Delivery\nNetwork",   pos: [2, 1] },
        { id: "D", label: "Platform\nMoat",      pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "A", to: "B", label: "signals" },
        { from: "B", to: "C", label: "optimises" },
        { from: "C", to: "A", label: "shapes" },
        { from: "A", to: "D", kind: "latent" },
        { from: "B", to: "D", kind: "latent" },
        { from: "C", to: "D", kind: "latent" },
      ],
    },
  },
  '03': {
    opener: 'The Building That Thinks',
    paras: [
      "In Barcelona, there is a building that learns. The Institute for Advanced Architecture of Catalonia's headquarters adjusts its skin, its airflow, and its lighting in response to the people inside — not to a schedule, but to a conversation with them. It is, architects say, closer to a plant than to a machine: responsive, seasonal, alive to its own interior weather.",
      "What makes it possible is a three-body architecture — sensors, inhabitants, and a learning model held together in a single loop. This chapter lays out that architecture formally: how to compose hardware, software, and knowware into systems that can, in a modest and very useful sense, think for themselves.",
    ],
    diagram: {
      title: "Adaptive Architecture Loop",
      caption: "Intelligence emerged not in the sensors, not in the inhabitants, not in the model — but in the live loop connecting all three. Remove any one body and the building becomes a machine again.",
      nodes: [
        { id: "S", label: "Sensors",         pos: [0, 1] },
        { id: "M", label: "Learning\nModel", pos: [1, 0] },
        { id: "H", label: "Inhabitants",     pos: [2, 1] },
        { id: "E", label: "Living\nBuilding", pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "S", to: "M", label: "feeds" },
        { from: "M", to: "H", label: "responds" },
        { from: "H", to: "S", label: "generates" },
        { from: "S", to: "E", kind: "latent" },
        { from: "M", to: "E", kind: "latent" },
        { from: "H", to: "E", kind: "latent" },
      ],
    },
  },
  '04': {
    opener: 'The City That Learned to Coordinate',
    paras: [
      "In 1998, Bogotá was dying. A sprawling metropolis of six million, choked by traffic, fractured by violence, paralysed by corruption. Then came Antanas Mockus — a philosophy professor turned mayor who refused to treat the city as a control problem. He staffed street corners with mimes instead of traffic police. He introduced \"civic passports\" citizens stamped to mark each other's good behaviour. Within a decade, homicide fell by 70%.",
      "Mockus had grasped what most governments still haven't: a city is not a machine to be engineered, but a coordination space to be tuned. This chapter walks through three such spaces — a market, a city, and a company — and shows what emerges when the tuning is done well, and what collapses when it isn't.",
    ],
    diagram: {
      title: "Civic Coordination Field",
      caption: "Bogotá's transformation came from tuning the relationship between norms, institutions, and behaviour — not enforcing any single one. Social trust is not planted; it crystallises when the three bodies align.",
      nodes: [
        { id: "N", label: "Civic\nNorms",        pos: [0, 1] },
        { id: "I", label: "Institutional\nDesign", pos: [1, 0] },
        { id: "B", label: "Citizen\nBehaviour",  pos: [2, 1] },
        { id: "T", label: "Social\nTrust",        pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "I", to: "N", label: "encodes" },
        { from: "N", to: "B", label: "shapes" },
        { from: "B", to: "I", label: "legitimises" },
        { from: "N", to: "T", kind: "latent" },
        { from: "I", to: "T", kind: "latent" },
        { from: "B", to: "T", kind: "latent" },
      ],
    },
  },
  '05': {
    opener: 'Three Bodies, One Instrument',
    paras: [
      "In 2020, a paralysed man named Ian Burkhart did something impossible: he moved his hand. The signal did not travel down his severed spinal cord. It travelled through a chip implanted in his motor cortex, through an algorithm trained to read his intention, through a sleeve of electrodes on his forearm — and from there, into muscle. The first such demonstration in history.",
      "Burkhart's hand is a case study in ternary interaction. Three bodies — biological, computational, prosthetic — learning to listen to one another in real time. This chapter asks what good human-AI collaboration actually looks like, when it works, and why so much of what passes for \"AI assistance\" today is really just a binary interruption dressed up in a chat window.",
    ],
    diagram: {
      title: "Neural–Prosthetic Loop",
      caption: "Ian Burkhart's hand moved because three bodies — biological, computational, mechanical — learned to listen to one another in real time. Intentionality is not in any one of them; it is the loop.",
      nodes: [
        { id: "B", label: "Biological\nSignal",   pos: [0, 1] },
        { id: "A", label: "Decoding\nAlgorithm",  pos: [1, 0] },
        { id: "P", label: "Physical\nActuator",   pos: [2, 1] },
        { id: "I", label: "Intentionality",       pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "B", to: "A", label: "trains" },
        { from: "A", to: "P", label: "commands" },
        { from: "P", to: "B", label: "feeds back" },
        { from: "B", to: "I", kind: "latent" },
        { from: "A", to: "I", kind: "latent" },
        { from: "P", to: "I", kind: "latent" },
      ],
    },
  },
  '06': {
    opener: "When AI Sees But Doesn’t Understand",
    paras: [
      "October 21, 2018. Tempe, Arizona. A self-driving Uber, its sensors seeing everything and understanding nothing, struck and killed Elaine Herzberg as she walked her bicycle across a darkened road. The vehicle's perception system had classified her, over the course of six long seconds, as an \"unknown object,\" then a \"vehicle,\" then a \"bicycle,\" then an \"unknown object\" again. At no point did it recognise her as a person who could die.",
      "Perception without comprehension is not intelligence; it is a very fast kind of blindness. This chapter argues that consciousness — whatever else it is — is a coordination problem, and that the frameworks we use to build artificial minds will have to learn to hold perception, processing, and awareness as three distinct things before they can ever hold them together.",
    ],
    diagram: {
      title: "The Comprehension Gap",
      caption: "The Uber system had perception and processing — but not the third body: awareness grounded in consequence. Two-body systems can see. They cannot understand what they see.",
      nodes: [
        { id: "P", label: "Perception",  pos: [0, 1] },
        { id: "R", label: "Processing",  pos: [1, 0] },
        { id: "A", label: "Awareness",   pos: [2, 1] },
        { id: "C", label: "Comprehension", pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "P", to: "R", label: "inputs" },
        { from: "R", to: "A", label: "attempts" },
        { from: "P", to: "A", kind: "latent", label: "bypasses" },
        { from: "P", to: "C", kind: "latent" },
        { from: "R", to: "C", kind: "latent" },
        { from: "A", to: "C", kind: "latent" },
      ],
    },
  },
  '07': {
    opener: 'What Machines Want to Become',
    paras: [
      "In 2019, an Autodesk generative design system produced a cabin partition for the Airbus A320 that was 45% lighter than the human-designed version, stronger, and used less material. Engineers who inspected it could not quite describe what they were looking at. It resembled bone. It resembled coral. It had the quality of something grown rather than manufactured — a shape the algorithm had, in some meaningful sense, wanted to make.",
      "This chapter moves from the soft outer layers of intelligence down to the metal — to quantum processors, material ecologies, and the physical substrate on which all the rest depends. The question it asks is deceptively simple: what are our machines actually capable of, and what would it look like to let them show us?",
    ],
    diagram: {
      title: "Generative Design Loop",
      caption: "The Airbus partition 'wanted' to be bone-shaped. The algorithm found forms human designers never would because design constraints, generative search, and material truth were held together as a single system.",
      nodes: [
        { id: "D", label: "Design\nConstraints",    pos: [0, 1] },
        { id: "G", label: "Generative\nAlgorithm",  pos: [1, 0] },
        { id: "M", label: "Material\nProperties",   pos: [2, 1] },
        { id: "F", label: "Emergent\nForm",         pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "D", to: "G", label: "bounds" },
        { from: "G", to: "M", label: "tests" },
        { from: "M", to: "D", label: "updates" },
        { from: "G", to: "F", kind: "latent" },
        { from: "M", to: "F", kind: "latent" },
        { from: "D", to: "F", kind: "latent" },
      ],
    },
  },
  '08': {
    opener: 'Cosmic Three-Body Dynamics',
    paras: [
      "The three-body problem, in physics, is a puzzle Newton posed and could not solve: given three masses and their initial velocities, predict where they will be in one hundred years. The answer is that you cannot — not analytically, not ever. The system is deterministic, but its behaviour is irreducible. You cannot compress it. You have to live through it.",
      "This chapter proposes that intelligence, at universal scale, is a three-body problem of exactly this kind. Mind, world, and the coordination between them form a system that can be inhabited but not reduced. Alignment, agency, and what it might be like to meet a mind unlike our own — all three questions turn out to be the same question in different clothes.",
    ],
    diagram: {
      title: "Mind–World Coordination",
      caption: "Alignment is not a property of a mind or a world in isolation. It is a dynamic that lives only in the coordination layer between them — and like the three-body problem, it cannot be solved in advance. It must be lived.",
      nodes: [
        { id: "M", label: "Mind",              pos: [0, 1] },
        { id: "C", label: "Coordination\nLayer", pos: [1, 0] },
        { id: "W", label: "World",             pos: [2, 1] },
        { id: "A", label: "Alignment",         pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "M", to: "C", label: "projects" },
        { from: "W", to: "C", label: "constrains" },
        { from: "C", to: "M", label: "shapes" },
        { from: "C", to: "W", label: "transforms" },
        { from: "M", to: "A", kind: "latent" },
        { from: "W", to: "A", kind: "latent" },
        { from: "C", to: "A", kind: "latent" },
      ],
    },
  },
  '09': {
    opener: 'The Radiology AI That Got Lonelier Doctors',
    paras: [
      "In 2016, radiologists at Stanford tested an AI system that diagnosed pneumonia from chest X-rays with 95% accuracy — better than most human radiologists. The hospital deployed it. Two years later, the radiologists were measurably worse at their jobs than they had been before the tool arrived. They had not been replaced. They had been subtly deskilled, their judgement quietly outsourced to a model they no longer quite understood.",
      "This is the shape of the integration problem. Not that the machines will take the work, but that we will hand it over without noticing, and find — too late — that the know-how has left the building. This chapter is a field manual for the opposite: conscious participation, mutual competence, coordination as a daily practice rather than a theory.",
    ],
    diagram: {
      title: "The Deskilling Trap",
      caption: "Outsourcing judgment to a model that is not understood erodes the practitioner's competence. The third body — institutional know-how — quietly departs when the first two stop exercising it.",
      nodes: [
        { id: "T", label: "AI\nTool",             pos: [0, 1] },
        { id: "P", label: "Practitioner",         pos: [1, 0] },
        { id: "K", label: "Institutional\nKnow-how", pos: [2, 1] },
        { id: "E", label: "Skill\nErosion",       pos: [1, 2], latent: true },
      ],
      arcs: [
        { from: "T", to: "P", label: "displaces" },
        { from: "P", to: "K", label: "builds / loses" },
        { from: "K", to: "T", label: "trains" },
        { from: "T", to: "E", kind: "latent" },
        { from: "P", to: "E", kind: "latent" },
        { from: "K", to: "E", kind: "latent", label: "drains" },
      ],
    },
  },
  'X': {
    opener: 'The Return',
    paras: [
      "You have been here before. Not in this chapter, not on this page — but the pattern you are about to recognise, you have already been living inside it. Every chapter of this book has been training your perception, the way a musician's ear learns to hear harmonics that were always present in the sound.",
      "What follows is not a summary. It is a closing of the loop. Eighty-one voices, nine chapters, one argument: that coordination, not computation, is the thing we are now learning to do. The author's voice — for the first time, at length, without interlocutors — draws the threads together, and then lets them go.",
    ],
  },
};

Object.assign(window, { TEASERS });
