// Knowware / Systems of Intelligence — real content from the book repo
// 9 chapters + ChX capstone, 81 voices (9 per chapter) across 3 tiers

const BOOK = {
  title: 'Systems of Intelligence',
  subtitle: 'The Three-Ware Problem: Ternary Coordination and Consciousness Evolution',
  author: 'Khayyam Wakil',
  thesis: 'Hardware ↔ Software ↔ Knowware',
  tagline: 'Binary thinking produces optimization. Ternary coordination produces emergence.',
  stats: {
    chapters: 9,
    voices: 81,
    proseWords: '~60,000',
    interviewWords: '~500,000',
    diagrams: '~60',
    pages: '~350',
  },
};

// Three tiers, reflected in the interview filenames (A / P / V)
const TIERS = [
  { key: 'A', name: 'Academics',      blurb: 'Researchers and theorists. Published work, documented frameworks.',  varCSS: '--tier-a', ink: '--tier-a-ink' },
  { key: 'P', name: 'Practitioners',  blurb: 'Builders and operators. Making the systems that coordinate the world.', varCSS: '--tier-p', ink: '--tier-p-ink' },
  { key: 'V', name: 'Visionaries',    blurb: 'Elders, artists, wisdom keepers. Consciousness and what is sacred.',     varCSS: '--tier-v', ink: '--tier-v-ink' },
];

// Nine chapters + capstone
const CHAPTERS = [
  { n: '01', part: 'I · Foundation',   title: 'The Coordination Intelligence Revolution', sub: 'How ternary thinking unlocks the future of human–AI partnership.' },
  { n: '02', part: 'I · Foundation',   title: 'The Dawn of Systems Intelligence',         sub: 'From information to coordination.' },
  { n: '03', part: 'I · Foundation',   title: 'Architecture of Systems Intelligence',     sub: 'Three bodies, one coordination space.' },
  { n: '04', part: 'II · Application', title: 'Systems Intelligence in Action',           sub: 'Markets, cities, and the shape of emergence.' },
  { n: '05', part: 'II · Application', title: 'Human–Systems Intelligence Interaction',   sub: 'Interfaces, mutualism, the attention commons.' },
  { n: '06', part: 'II · Application', title: 'Consciousness as Pattern Recognition',     sub: 'What minds are, and what they aren\u2019t.' },
  { n: '07', part: 'III · Engineering', title: 'Engineering Reality',                     sub: 'Hardware, compute, materials, the physical ground.' },
  { n: '08', part: 'III · Engineering', title: 'Beyond Human Intelligence',               sub: 'Alignment, agency, other minds.' },
  { n: '09', part: 'IV · Integration',  title: 'No Way? Know-How',                        sub: 'Coordination as practice, not theory.' },
  { n: 'X',  part: 'Capstone',          title: 'The Grand Coordination',                  sub: 'Synthesis. The author\u2019s voice drawing on all 81.' },
];

// All 81 voices, from the repo. n = global index, ch = chapter, tier = A/P/V, slug = filename slug.
// Names have been tidied from filename slugs.
const INTERVIEWS_RAW = [
  // Chapter 1 — The Coordination Intelligence Revolution
  { n:  1, ch: '01', tier: 'A', name: 'Paul Pangaro',            affiliation: 'American Society for Cybernetics',       slug: 'dr_paul_pangaro' },
  { n:  2, ch: '01', tier: 'A', name: 'N. Katherine Hayles',     affiliation: 'Duke University',                         slug: 'dr_n_katherine_hayles' },
  { n:  3, ch: '01', tier: 'A', name: 'Donella Meadows',         affiliation: 'The Sustainability Institute',            slug: 'donella_meadows' },
  { n:  4, ch: '01', tier: 'P', name: 'Stewart Brand',           affiliation: 'Whole Earth / Long Now Foundation',       slug: 'stewart_brand' },
  { n:  5, ch: '01', tier: 'P', name: 'Kevin Kelly',             affiliation: 'Wired / the technium',                    slug: 'kevin_kelly' },
  { n:  6, ch: '01', tier: 'P', name: 'Yann Minh',               affiliation: 'Digital shamanism',                       slug: 'yann_minh' },
  { n:  7, ch: '01', tier: 'V', name: 'Terence McKenna',         affiliation: 'Consciousness technology',                slug: 'terence_mckenna' },
  { n:  8, ch: '01', tier: 'V', name: 'Lakota Elder Phillip Deere', affiliation: 'Star Knowledge keeper',                slug: 'lakota_elder_phillip_deere' },
  { n:  9, ch: '01', tier: 'V', name: 'Daniel Schmachtenberger', affiliation: 'Consilience Project',                     slug: 'daniel_schmachtenberger' },

  // Chapter 2 — The Dawn of Systems Intelligence
  { n: 10, ch: '02', tier: 'A', name: 'Judea Pearl',             affiliation: 'UCLA · Causal inference',                 slug: 'dr_judea_pearl' },
  { n: 11, ch: '02', tier: 'A', name: 'Claude Shannon',          affiliation: 'Information theory',                      slug: 'claude_shannon' },
  { n: 12, ch: '02', tier: 'A', name: 'Alan Turing',             affiliation: 'Computation, codes',                      slug: 'alan_turing' },
  { n: 13, ch: '02', tier: 'P', name: 'Hartmut Neven',           affiliation: 'Google Quantum AI',                       slug: 'dr_hartmut_neven' },
  { n: 14, ch: '02', tier: 'P', name: 'Former NSA Technical Director', affiliation: 'Anonymous',                         slug: 'former_nsa_technical_director' },
  { n: 15, ch: '02', tier: 'P', name: 'Palmer Luckey',           affiliation: 'Anduril · Oculus',                        slug: 'palmer_luckey' },
  { n: 16, ch: '02', tier: 'V', name: 'Mo Gawdat',               affiliation: 'Former Google X',                         slug: 'mo_gawdat' },
  { n: 17, ch: '02', tier: 'V', name: 'Hunbatz Men',             affiliation: 'Maya daykeeper',                          slug: 'hunbatz_men' },
  { n: 18, ch: '02', tier: 'V', name: 'Ruqian Lu',               affiliation: 'Chinese Academy of Sciences',             slug: 'ruqian_lu' },

  // Chapter 3 — Architecture of Systems Intelligence
  { n: 19, ch: '03', tier: 'A', name: 'Yann LeCun',              affiliation: 'Meta AI · NYU',                           slug: 'yann_lecun' },
  { n: 20, ch: '03', tier: 'A', name: 'Richard Feynman',         affiliation: 'Caltech',                                 slug: 'feynman' },
  { n: 21, ch: '03', tier: 'A', name: 'James Gosling',           affiliation: 'Father of Java',                          slug: 'james_gosling' },
  { n: 22, ch: '03', tier: 'P', name: 'Dario Amodei',            affiliation: 'Anthropic',                               slug: 'dario_amodei' },
  { n: 23, ch: '03', tier: 'P', name: 'Demis Hassabis',          affiliation: 'Google DeepMind',                         slug: 'demis_hassabis' },
  { n: 24, ch: '03', tier: 'P', name: 'Clément Delangue',        affiliation: 'Hugging Face',                            slug: 'clement_delangue' },
  { n: 25, ch: '03', tier: 'V', name: 'Iain McGilchrist',        affiliation: 'The Master and His Emissary',             slug: 'iain_mcgilchrist' },
  { n: 26, ch: '03', tier: 'V', name: 'Fritjof Capra',           affiliation: 'The Web of Life',                         slug: 'fritjof_capra' },
  { n: 27, ch: '03', tier: 'V', name: 'Ray Kurzweil',            affiliation: 'Singularity University',                  slug: 'ray_kurzweil' },

  // Chapter 4 — Systems Intelligence in Action
  { n: 28, ch: '04', tier: 'A', name: 'Carlo Ratti',             affiliation: 'MIT Senseable City Lab',                  slug: 'carlo_ratti' },
  { n: 29, ch: '04', tier: 'A', name: 'Eric Topol',              affiliation: 'Scripps Research',                        slug: 'eric_topol' },
  { n: 30, ch: '04', tier: 'A', name: 'Andrew Lo',               affiliation: 'MIT Sloan · Adaptive markets',            slug: 'andrew_lo' },
  { n: 31, ch: '04', tier: 'P', name: 'Dan Doctoroff',           affiliation: 'Sidewalk Labs',                           slug: 'dan_doctoroff' },
  { n: 32, ch: '04', tier: 'P', name: 'Linda Raschke',           affiliation: 'Professional trader',                     slug: 'linda_raschke' },
  { n: 33, ch: '04', tier: 'P', name: 'Quant / HFT Savant',      affiliation: 'Anonymous',                               slug: 'quant_hft_savant' },
  { n: 34, ch: '04', tier: 'V', name: 'Sarah Rossbach',          affiliation: 'Feng shui scholar',                       slug: 'sarah_rossbach' },
  { n: 35, ch: '04', tier: 'V', name: 'Caroline Myss',           affiliation: 'Medical intuitive',                       slug: 'caroline_myss' },
  { n: 36, ch: '04', tier: 'V', name: 'Nassim Taleb',            affiliation: 'Antifragile · NYU',                       slug: 'nassim_taleb' },

  // Chapter 5 — Human–Systems Intelligence Interaction
  { n: 37, ch: '05', tier: 'A', name: 'Miguel Nicolelis',        affiliation: 'Duke · BMI pioneer',                      slug: 'dr_miguel_nicolelis' },
  { n: 38, ch: '05', tier: 'A', name: 'Alex Pentland',           affiliation: 'MIT Media Lab',                           slug: 'dr_alex_pentland' },
  { n: 39, ch: '05', tier: 'A', name: 'Shannon Vallor',          affiliation: 'Edinburgh · Technology & the virtues',    slug: 'dr_shannon_vallor' },
  { n: 40, ch: '05', tier: 'P', name: 'Thomas Oxley',            affiliation: 'Synchron',                                slug: 'dr_thomas_oxley' },
  { n: 41, ch: '05', tier: 'P', name: 'Tristan Harris',          affiliation: 'Center for Humane Technology',            slug: 'tristan_harris' },
  { n: 42, ch: '05', tier: 'P', name: 'Jimmy Wales',             affiliation: 'Wikipedia',                               slug: 'jimmy_wales' },
  { n: 43, ch: '05', tier: 'V', name: 'BCI User',                affiliation: 'Anonymous',                               slug: 'bci_user' },
  { n: 44, ch: '05', tier: 'V', name: 'Thich Nhat Hanh Foundation', affiliation: 'Plum Village',                         slug: 'thich_nhat_hanh_foundation' },
  { n: 45, ch: '05', tier: 'V', name: 'Donna Haraway',           affiliation: 'UC Santa Cruz · Cyborg manifesto',        slug: 'donna_haraway' },

  // Chapter 6 — Consciousness as Pattern Recognition
  { n: 46, ch: '06', tier: 'A', name: 'Stuart Russell',          affiliation: 'UC Berkeley · Human-compatible AI',       slug: 'stuart_russell' },
  { n: 47, ch: '06', tier: 'A', name: 'Timnit Gebru',            affiliation: 'DAIR Institute',                          slug: 'timnit_gebru' },
  { n: 48, ch: '06', tier: 'A', name: 'Kate Crawford',           affiliation: 'Atlas of AI',                             slug: 'kate_crawford' },
  { n: 49, ch: '06', tier: 'P', name: 'Norbert Wiener',          affiliation: 'Cybernetics',                             slug: 'norbert_wiener' },
  { n: 50, ch: '06', tier: 'P', name: 'Margaret Mitchell',       affiliation: 'Hugging Face · Ethical AI',               slug: 'margaret_mitchell' },
  { n: 51, ch: '06', tier: 'P', name: 'In-Q-Tel',                affiliation: 'Anonymous',                               slug: 'inqtel' },
  { n: 52, ch: '06', tier: 'V', name: 'Roger Penrose',           affiliation: 'Oxford · Emperor\u2019s New Mind',        slug: 'roger_penrose' },
  { n: 53, ch: '06', tier: 'V', name: 'Antonio Damasio',         affiliation: 'USC · Self Comes to Mind',                slug: 'antonio_damasio' },
  { n: 54, ch: '06', tier: 'V', name: 'Rupert Sheldrake',        affiliation: 'Morphic resonance',                       slug: 'rupert_sheldrake' },

  // Chapter 7 — Engineering Reality
  { n: 55, ch: '07', tier: 'A', name: 'John Preskill',           affiliation: 'Caltech · Quantum',                       slug: 'dr_john_preskill' },
  { n: 56, ch: '07', tier: 'A', name: 'Seth Lloyd',              affiliation: 'MIT · Programming the Universe',          slug: 'seth_lloyd' },
  { n: 57, ch: '07', tier: 'A', name: 'Chip Huyen',              affiliation: 'ML systems',                              slug: 'chip_huyen' },
  { n: 58, ch: '07', tier: 'P', name: 'Jeff Dean',               affiliation: 'Google',                                  slug: 'jeff_dean' },
  { n: 59, ch: '07', tier: 'P', name: 'Lisa Su',                 affiliation: 'AMD',                                     slug: 'dr_lisa_su' },
  { n: 60, ch: '07', tier: 'P', name: 'Wendell Weeks',           affiliation: 'Corning · Gorilla Glass',                 slug: 'wendell_weeks' },
  { n: 61, ch: '07', tier: 'V', name: 'Neri Oxman',              affiliation: 'Material ecology',                        slug: 'neri_oxman' },
  { n: 62, ch: '07', tier: 'V', name: 'DARPA Program Manager',   affiliation: 'Anonymous',                               slug: 'darpa_anonymous' },
  { n: 63, ch: '07', tier: 'V', name: 'Fei-Fei Li',              affiliation: 'Stanford · ImageNet',                     slug: 'dr_fei-fei_li' },

  // Chapter 8 — Beyond Human Intelligence
  { n: 64, ch: '08', tier: 'A', name: 'Max Tegmark',             affiliation: 'MIT · Future of Life Institute',          slug: 'dr_max_tegmark' },
  { n: 65, ch: '08', tier: 'A', name: 'Nick Bostrom',            affiliation: 'Oxford FHI',                              slug: 'dr_nick_bostrom' },
  { n: 66, ch: '08', tier: 'A', name: 'Jill Tarter',             affiliation: 'SETI Institute',                          slug: 'dr_jill_tarter' },
  { n: 67, ch: '08', tier: 'P', name: 'Sara Seager',             affiliation: 'MIT · Exoplanets',                        slug: 'dr_sara_seager' },
  { n: 68, ch: '08', tier: 'P', name: 'David Chalmers',          affiliation: 'NYU · The hard problem',                  slug: 'dr_david_chalmers' },
  { n: 69, ch: '08', tier: 'P', name: 'Anil Seth',               affiliation: 'Sussex · Being You',                      slug: 'anil_seth' },
  { n: 70, ch: '08', tier: 'V', name: 'Liu Cixin',               affiliation: 'Three-Body Problem',                      slug: 'liu_cixin' },
  { n: 71, ch: '08', tier: 'V', name: 'Thomas Nagel',            affiliation: 'NYU · What is it like to be a bat?',      slug: 'dr_thomas_nagel' },
  { n: 72, ch: '08', tier: 'V', name: 'Srinivasa Ramanujan',     affiliation: 'Mathematics from dreams',                 slug: 'ramanujan' },

  // Chapter 9 — No Way? Know-How
  { n: 73, ch: '09', tier: 'A', name: 'David Autor',             affiliation: 'MIT · Labor economics',                   slug: 'david_autor' },
  { n: 74, ch: '09', tier: 'A', name: 'Kate Raworth',            affiliation: 'Doughnut economics',                      slug: 'kate_raworth' },
  { n: 75, ch: '09', tier: 'A', name: 'François Chollet',        affiliation: 'Keras · ARC',                             slug: 'francois_chollet' },
  { n: 76, ch: '09', tier: 'P', name: 'Emad Mostaque',           affiliation: 'Stability AI',                            slug: 'emad_mostaque' },
  { n: 77, ch: '09', tier: 'P', name: 'Fiona Hill',              affiliation: 'Brookings · There Is Nothing For You Here', slug: 'dr_fiona_hill' },
  { n: 78, ch: '09', tier: 'P', name: 'Peter Senge',             affiliation: 'MIT · Fifth Discipline',                  slug: 'peter_senge' },
  { n: 79, ch: '09', tier: 'V', name: 'Charles Eisenstein',      affiliation: 'Sacred Economics',                        slug: 'charles_eisenstein' },
  { n: 80, ch: '09', tier: 'V', name: 'Sherry Turkle',           affiliation: 'MIT · Alone Together',                    slug: 'sherry_turkle' },
  { n: 81, ch: '09', tier: 'V', name: 'MK-Ultra Operator',       affiliation: 'Anonymous',                               slug: 'mkultra_anonymous' },
];

// Enrich: symbol (initials), pseudo-stable metadata.
function initials(name) {
  // Drop titles
  const clean = name.replace(/^(Dr\.|Sir|Lakota Elder|Former|Srinivasa|Professor)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0] || 'X';
  const b = parts[parts.length - 1][0] || 'X';
  return (a + b).toUpperCase();
}

function tierObj(key) { return TIERS.find(t => t.key === key); }

// City + year pool — deterministic-ish assignment so the UI has flavor
const CITIES = ['New York','London','Berlin','Tokyo','Santa Fe','Cambridge MA','San Francisco','Oxford','Hong Kong','Brooklyn','Mumbai','Amsterdam','Boulder','Los Angeles','Kyoto','Paris','Cape Town','Edinburgh','Stanford','Madison','Princeton','Seattle','Toronto','Austin','Montréal','Dublin','Chennai','Taipei','Shanghai','Reykjavík'];

const INTERVIEWS = INTERVIEWS_RAW.map(v => ({
  ...v,
  sym: initials(v.name),
  tierInfo: tierObj(v.tier),
  // Each interview is ~40+ min by repo convention
  minutes: 40 + ((v.n * 7) % 35),
  city: CITIES[(v.n * 11) % CITIES.length],
  year: 2023 + (v.n % 3),
  themes: [
    v.ch === '01' ? 'coordination' : v.ch === '02' ? 'information' : v.ch === '03' ? 'architecture' : v.ch === '04' ? 'markets' : v.ch === '05' ? 'interfaces' : v.ch === '06' ? 'consciousness' : v.ch === '07' ? 'hardware' : v.ch === '08' ? 'alignment' : 'practice',
    v.tier === 'A' ? 'theory' : v.tier === 'P' ? 'build' : 'wisdom',
    'knowware',
  ],
}));

// Parts of the book (for the table of contents structure)
const PARTS = [
  { key: 'I',   name: 'Part I · Foundation',    chapters: ['01','02','03'] },
  { key: 'II',  name: 'Part II · Application',  chapters: ['04','05','06'] },
  { key: 'III', name: 'Part III · Engineering', chapters: ['07','08'] },
  { key: 'IV',  name: 'Part IV · Integration',  chapters: ['09'] },
  { key: 'X',   name: 'Capstone',                chapters: ['X'] },
];

// Counts
const TIER_COUNTS = TIERS.map(t => ({
  ...t,
  count: INTERVIEWS.filter(v => v.tier === t.key).length,
}));

// For backwards compatibility with v2 code referring to GROUPS/SECTIONS
// GROUPS → TIERS (3 instead of 11); SECTIONS → CHAPTERS
const GROUPS = TIERS.map((t, i) => ({
  id: i + 1,
  key: t.key,
  name: t.name,
  blurb: t.blurb,
  varCSS: t.varCSS,
  ink: t.ink,
}));

const SECTIONS = CHAPTERS.map(c => ({
  n: c.n,
  title: c.title,
  sub: c.sub,
  part: c.part,
}));

// Patch INTERVIEWS to also carry a groupId (1/2/3) so legacy code still works
INTERVIEWS.forEach(v => {
  v.groupId = TIERS.findIndex(t => t.key === v.tier) + 1;
  v.group = GROUPS[v.groupId - 1];
});

Object.assign(window, {
  BOOK, TIERS, CHAPTERS, INTERVIEWS, PARTS, TIER_COUNTS,
  // legacy aliases
  GROUPS, SECTIONS,
});
