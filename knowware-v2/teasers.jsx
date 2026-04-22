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
  },
  '02': {
    opener: 'The Netflix Secret Nobody Saw',
    paras: [
      "Netflix didn't become the dominant streaming platform by having the best library or the smartest recommendation engine. It won by mastering something its rivals never quite saw: three-body coordination. Blockbuster optimised real estate. Hulu optimised licensing. Netflix optimised the relationship between viewers, catalogue, and network — a system that improved itself whenever any of the three moved.",
      "What looks from the outside like a content company is, read more carefully, a study in ternary feedback. This chapter traces how the same pattern appears in Amazon's logistics, in Toyota's factories, and in the nervous system of an octopus — and why binary thinking misses it every time.",
    ],
  },
  '03': {
    opener: 'The Building That Thinks',
    paras: [
      "In Barcelona, there is a building that learns. The Institute for Advanced Architecture of Catalonia's headquarters adjusts its skin, its airflow, and its lighting in response to the people inside — not to a schedule, but to a conversation with them. It is, architects say, closer to a plant than to a machine: responsive, seasonal, alive to its own interior weather.",
      "What makes it possible is a three-body architecture — sensors, inhabitants, and a learning model held together in a single loop. This chapter lays out that architecture formally: how to compose hardware, software, and knowware into systems that can, in a modest and very useful sense, think for themselves.",
    ],
  },
  '04': {
    opener: 'The City That Learned to Coordinate',
    paras: [
      "In 1998, Bogotá was dying. A sprawling metropolis of six million, choked by traffic, fractured by violence, paralysed by corruption. Then came Antanas Mockus — a philosophy professor turned mayor who refused to treat the city as a control problem. He staffed street corners with mimes instead of traffic police. He introduced \"civic passports\" citizens stamped to mark each other's good behaviour. Within a decade, homicide fell by 70%.",
      "Mockus had grasped what most governments still haven't: a city is not a machine to be engineered, but a coordination space to be tuned. This chapter walks through three such spaces — a market, a city, and a company — and shows what emerges when the tuning is done well, and what collapses when it isn't.",
    ],
  },
  '05': {
    opener: 'Three Bodies, One Instrument',
    paras: [
      "In 2020, a paralysed man named Ian Burkhart did something impossible: he moved his hand. The signal did not travel down his severed spinal cord. It travelled through a chip implanted in his motor cortex, through an algorithm trained to read his intention, through a sleeve of electrodes on his forearm — and from there, into muscle. The first such demonstration in history.",
      "Burkhart's hand is a case study in ternary interaction. Three bodies — biological, computational, prosthetic — learning to listen to one another in real time. This chapter asks what good human-AI collaboration actually looks like, when it works, and why so much of what passes for \"AI assistance\" today is really just a binary interruption dressed up in a chat window.",
    ],
  },
  '06': {
    opener: 'When AI Sees But Doesn\u2019t Understand',
    paras: [
      "October 21, 2018. Tempe, Arizona. A self-driving Uber, its sensors seeing everything and understanding nothing, struck and killed Elaine Herzberg as she walked her bicycle across a darkened road. The vehicle's perception system had classified her, over the course of six long seconds, as an \"unknown object,\" then a \"vehicle,\" then a \"bicycle,\" then an \"unknown object\" again. At no point did it recognise her as a person who could die.",
      "Perception without comprehension is not intelligence; it is a very fast kind of blindness. This chapter argues that consciousness — whatever else it is — is a coordination problem, and that the frameworks we use to build artificial minds will have to learn to hold perception, processing, and awareness as three distinct things before they can ever hold them together.",
    ],
  },
  '07': {
    opener: 'What Machines Want to Become',
    paras: [
      "In 2019, an Autodesk generative design system produced a cabin partition for the Airbus A320 that was 45% lighter than the human-designed version, stronger, and used less material. Engineers who inspected it could not quite describe what they were looking at. It resembled bone. It resembled coral. It had the quality of something grown rather than manufactured — a shape the algorithm had, in some meaningful sense, wanted to make.",
      "This chapter moves from the soft outer layers of intelligence down to the metal — to quantum processors, material ecologies, and the physical substrate on which all the rest depends. The question it asks is deceptively simple: what are our machines actually capable of, and what would it look like to let them show us?",
    ],
  },
  '08': {
    opener: 'Cosmic Three-Body Dynamics',
    paras: [
      "The three-body problem, in physics, is a puzzle Newton posed and could not solve: given three masses and their initial velocities, predict where they will be in one hundred years. The answer is that you cannot — not analytically, not ever. The system is deterministic, but its behaviour is irreducible. You cannot compress it. You have to live through it.",
      "This chapter proposes that intelligence, at universal scale, is a three-body problem of exactly this kind. Mind, world, and the coordination between them form a system that can be inhabited but not reduced. Alignment, agency, and what it might be like to meet a mind unlike our own — all three questions turn out to be the same question in different clothes.",
    ],
  },
  '09': {
    opener: 'The Radiology AI That Got Lonelier Doctors',
    paras: [
      "In 2016, radiologists at Stanford tested an AI system that diagnosed pneumonia from chest X-rays with 95% accuracy — better than most human radiologists. The hospital deployed it. Two years later, the radiologists were measurably worse at their jobs than they had been before the tool arrived. They had not been replaced. They had been subtly deskilled, their judgement quietly outsourced to a model they no longer quite understood.",
      "This is the shape of the integration problem. Not that the machines will take the work, but that we will hand it over without noticing, and find — too late — that the know-how has left the building. This chapter is a field manual for the opposite: conscious participation, mutual competence, coordination as a daily practice rather than a theory.",
    ],
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
