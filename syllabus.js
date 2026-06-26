const SYLLABUS = {
  gs1: {
    label: 'GS 1', color: '#6366f1', short: 'History · Culture · Geography',
    sections: [
      { name: 'Indian heritage & culture', topics: [
        'Art forms — classical dance, music, theatre',
        'Architecture — temple styles, cave art, medieval',
        'Painting traditions — Mughal, Rajput, folk',
        'Literature — ancient to modern',
        'Philosophy & religion — schools of thought',
        'UNESCO heritage & intangible cultural heritage'
      ]},
      { name: 'Modern Indian history', topics: [
        '1857 revolt & its aftermath',
        'Rise of nationalism — INC phases',
        'Gandhian era & mass movements',
        'Revolutionary movements — Bhagat Singh, Bose',
        'Partition & independence',
        'Post-independence — integration of princely states'
      ]},
      { name: 'World history', topics: [
        'Industrial Revolution & global impact',
        'World War I — causes & consequences',
        'World War II — causes & consequences',
        'Colonialism & decolonisation',
        'Cold War & its end',
        'Reunification — Germany, Korean question'
      ]},
      { name: 'Indian society', topics: [
        'Diversity — caste, religion, language, region',
        'Women & gender issues',
        'Urbanisation trends & challenges',
        'Globalisation & social change',
        'Population & associated issues',
        'Social empowerment — salient features'
      ]},
      { name: 'Geography', topics: [
        'Physical geography — geomorphology & landforms',
        'Climatology & Indian monsoon',
        'Oceanography — currents, tides, resources',
        'World economic geography',
        'Indian geography — physical features',
        'Indian geography — resources & distribution'
      ]}
    ]
  },
  gs2: {
    label: 'GS 2', color: '#22c55e', short: 'Polity · Governance · IR',
    sections: [
      { name: 'Indian polity & constitution', topics: [
        'Historical underpinnings & making of Constitution',
        'Preamble, salient features, basic structure',
        'Union & state executives',
        'Parliament & state legislatures',
        'Judiciary — SC, HCs, judicial review',
        'Federalism & centre-state relations',
        'Local governance — 73rd & 74th amendments',
        'Constitutional bodies',
        'Statutory & quasi-judicial bodies'
      ]},
      { name: 'Governance', topics: [
        'Government policies & interventions',
        'Welfare schemes — social sector',
        'e-Governance & technology in governance',
        'Civil services in democracy',
        'Citizens charters & RTI',
        'Role of NGOs, SHGs & civil society',
        'Transparency & accountability mechanisms'
      ]},
      { name: 'Social justice', topics: [
        'Mechanisms for vulnerable sections',
        'Issues relating to women & children',
        'Issues relating to SC/ST/OBC',
        'Poverty & hunger — data & schemes',
        'Health — NHM, PMJAY, Ayushman Bharat',
        'Education — NEP 2020, RTE, higher education'
      ]},
      { name: 'International relations', topics: [
        'India & its neighbourhood',
        'Bilateral groupings & agreements',
        'Effect of foreign policies on India',
        'Indian diaspora & soft power',
        'International organisations — UN, WTO, IMF',
        'Important groupings — G20, SCO, BRICS, QUAD'
      ]}
    ]
  },
  gs3: {
    label: 'GS 3', color: '#f59e0b', short: 'Economy · S&T · Environment',
    sections: [
      { name: 'Indian economy', topics: [
        'Planning & economic development post-1947',
        'Inclusive growth — issues & indicators',
        'Government budgeting & fiscal federalism',
        'Land reforms & land records digitisation',
        'Effects of liberalisation 1991',
        'Infrastructure — energy, ports, roads',
        'Investment models — PPP, hybrid annuity',
        'Agriculture — MSP, subsidies, APMC reforms'
      ]},
      { name: 'Science & technology', topics: [
        'Developments in IT & digital India',
        'Space — ISRO missions & applications',
        'Biotechnology — CRISPR, GMO, vaccines',
        'Indigenisation of technology & IPR',
        'Nanotechnology applications',
        'Robotics & AI — policy implications'
      ]},
      { name: 'Environment & ecology', topics: [
        'Conservation — biodiversity, wetlands, forests',
        'Environment impact assessment',
        'Pollution — air, water, soil, noise',
        'Climate change — UNFCCC, Paris Agreement',
        'Disaster management — NDMA, Sendai Framework',
        'Environmental degradation & sustainable development'
      ]},
      { name: 'Security', topics: [
        'Internal security challenges — LWE, insurgency',
        'Role of external actors in internal disturbances',
        'Cyber security — threats, policy, CERT-In',
        'Money laundering — PMLA, FATF',
        'Border management — challenges & technology',
        'Organised crime, terrorism, radicalisation'
      ]}
    ]
  },
  gs4: {
    label: 'GS 4', color: '#a78bfa', short: 'Ethics · Integrity · Aptitude',
    sections: [
      { name: 'Ethics & moral philosophy', topics: [
        'Essence & determinants of ethics',
        'Ethics in public & private life',
        'Human values — lessons from great lives',
        'Attitude — structure, function, formation',
        'Aptitude & foundational values for civil services',
        'Emotional intelligence — concepts & application'
      ]},
      { name: 'Integrity & governance', topics: [
        'Contributions of moral thinkers — East & West',
        'Laws, rules, conscience as guidance sources',
        'Accountability & ethical governance',
        'Codes of ethics & conduct — AIS rules',
        'Citizens charter & work culture',
        'Corporate governance & business ethics'
      ]},
      { name: 'Case studies', topics: [
        'Probity in governance',
        'Philosophical basis of governance & integrity',
        'Information sharing & transparency',
        'Ethics in international relations',
        'Utilitarian vs deontological dilemmas',
        'Case study practice — minimum 20 sets'
      ]}
    ]
  },
  prelims: {
    label: 'Prelims', color: '#f43f5e', short: 'GS Paper 1 + CSAT',
    sections: [
      { name: 'GS Prelims Paper 1', topics: [
        'Ancient & medieval history MCQs',
        'Modern history & freedom struggle MCQs',
        'Indian polity MCQs',
        'Indian & world geography MCQs',
        'Indian economy MCQs',
        'Environment & ecology MCQs',
        'Science & technology MCQs',
        'Current affairs — last 18 months'
      ]},
      { name: 'CSAT Paper 2', topics: [
        'Reading comprehension — passage types',
        'Logical reasoning & analytical ability',
        'Decision making & problem solving',
        'General mental ability — analogies, series',
        'Basic numeracy — percentages, ratios',
        'Data interpretation — tables, charts, graphs'
      ]}
    ]
  },
  optional: {
    label: 'Optional', color: '#06b6d4', short: 'Economics',
    sections: [
      { name: 'Economics Paper 1', topics: [
        'Advanced microeconomics — consumer & producer theory',
        'Advanced macroeconomics — IS-LM, AD-AS',
        'International economics — trade theory, BOP',
        'Public finance — incidence, fiscal policy',
        'Money, banking & finance — monetary policy',
        'Growth & development — theories & indicators'
      ]},
      { name: 'Economics Paper 2', topics: [
        'Indian economy — planning & structural change',
        'Agriculture — land reform, green revolution, WTO',
        'Industry & trade policy — liberalisation',
        'Economic reforms post-1991 — LPG impact',
        'Monetary & fiscal policy — RBI & budget',
        'Current economic issues — inflation, GST, unemployment'
      ]}
    ]
  }
};

const PAPER_ORDER = ['gs1', 'gs2', 'gs3', 'gs4', 'prelims', 'optional'];

const PHASE_PLAN = {
  2027: [
    { name: 'Foundation', label: 'Phase 1', start: '2026-06-01', end: '2026-12-31', color: '#6366f1',
      goal: 'First pass of entire syllabus. Every topic studied at least once. SRS begins.',
      weeklyTopics: 12, dailyHours: 3,
      focus: ['gs1','gs2','gs3','gs4','optional'],
      neuroscience: 'Encoding phase. New neural pathways form. Spacing begins. Do not skip — breadth before depth.'
    },
    { name: 'Deepening', label: 'Phase 2', start: '2027-01-01', end: '2027-03-31', color: '#22c55e',
      goal: 'Revisit weak topics. Answer writing practice begins. Prelims MCQ drilling starts.',
      weeklyTopics: 8, dailyHours: 3,
      focus: ['prelims','gs2','gs3'],
      neuroscience: 'Consolidation phase. Myelin thickens on frequently used pathways. Hard topics need more repetitions — do not avoid them.'
    },
    { name: 'Integration', label: 'Phase 3', start: '2027-04-01', end: '2027-04-30', color: '#f59e0b',
      goal: 'Full syllabus revision. Connect topics across papers. Mock tests begin.',
      weeklyTopics: 6, dailyHours: 3.5,
      focus: ['prelims','gs1','gs2','gs3','gs4'],
      neuroscience: 'Interleaving phase. Mixing subjects builds flexible retrieval. Avoid blocked practice — it feels easier but builds weaker memory.'
    },
    { name: 'Prelims sprint', label: 'Phase 4', start: '2027-05-01', end: '2027-05-25', color: '#f43f5e',
      goal: 'Prelims-only. MCQ intensive. Current affairs final revision. Full mocks daily.',
      weeklyTopics: 4, dailyHours: 4,
      focus: ['prelims'],
      neuroscience: 'Retrieval practice phase. Testing yourself is more effective than re-reading. Every mock test strengthens recall pathways.'
    }
  ],
  2028: [
    { name: 'Foundation', label: 'Phase 1', start: '2026-06-01', end: '2027-03-31', color: '#6366f1',
      goal: 'Thorough first pass with deeper understanding. More time per topic.',
      weeklyTopics: 8, dailyHours: 2.5,
      focus: ['gs1','gs2','gs3','gs4','optional'],
      neuroscience: 'Extended encoding. Slower pace allows deeper semantic processing and stronger initial memory traces.'
    },
    { name: 'Deepening', label: 'Phase 2', start: '2027-04-01', end: '2027-12-31', color: '#22c55e',
      goal: 'Deep revision cycles. Answer writing. Optional mastery. Mock test series.',
      weeklyTopics: 6, dailyHours: 3,
      focus: ['optional','gs2','gs3','gs4'],
      neuroscience: 'Deep consolidation. Spaced repetition at longer intervals builds near-permanent retention.'
    },
    { name: 'Integration', label: 'Phase 3', start: '2028-01-01', end: '2028-04-30', color: '#f59e0b',
      goal: 'Full integrated revision. Connect current affairs to static syllabus.',
      weeklyTopics: 8, dailyHours: 3.5,
      focus: ['prelims','gs1','gs2','gs3','gs4'],
      neuroscience: 'Schema building phase. Connect disparate knowledge into unified frameworks for faster retrieval.'
    },
    { name: 'Prelims sprint', label: 'Phase 4', start: '2028-05-01', end: '2028-05-25', color: '#f43f5e',
      goal: 'Prelims MCQ intensive. Daily mocks. Current affairs final pass.',
      weeklyTopics: 4, dailyHours: 4,
      focus: ['prelims'],
      neuroscience: 'Peak retrieval phase. High-frequency low-stakes testing maximises Prelims performance.'
    }
  ]
};
