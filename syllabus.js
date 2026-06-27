// MYELOCUS — Syllabus structure
// Papers and subjects are fixed (from UPSC notification structure)
// Subject names are editable — these are defaults
// Bullets and chunks are created by the user

const PAPER_ORDER = ['gs1', 'gs2', 'gs3', 'gs4', 'prelims', 'optional'];

const PAPERS = {
  gs1: {
    label: 'GS 1',
    full: 'Indian Heritage and Culture, History and Geography of the World and Society',
    color: '#818cf8',
    subjects: [
      { id: 'gs1_art',  name: 'Art & Culture' },
      { id: 'gs1_mih',  name: 'Modern Indian History' },
      { id: 'gs1_pi',   name: 'Post Independence' },
      { id: 'gs1_wh',   name: 'World History' },
      { id: 'gs1_soc',  name: 'Indian Society' },
      { id: 'gs1_geo',  name: 'Geography' }
    ]
  },
  gs2: {
    label: 'GS 2',
    full: 'Governance, Constitution, Polity, Social Justice and International Relations',
    color: '#4ade80',
    subjects: [
      { id: 'gs2_pol',  name: 'Polity & Constitution' },
      { id: 'gs2_gov',  name: 'Governance' },
      { id: 'gs2_sj',   name: 'Social Justice' },
      { id: 'gs2_ir',   name: 'International Relations' }
    ]
  },
  gs3: {
    label: 'GS 3',
    full: 'Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management',
    color: '#fbbf24',
    subjects: [
      { id: 'gs3_eco',  name: 'Economy' },
      { id: 'gs3_agri', name: 'Agriculture' },
      { id: 'gs3_st',   name: 'Science & Technology' },
      { id: 'gs3_env',  name: 'Environment & Ecology' },
      { id: 'gs3_dis',  name: 'Disaster Management' },
      { id: 'gs3_sec',  name: 'Internal Security' }
    ]
  },
  gs4: {
    label: 'GS 4',
    full: 'Ethics, Integrity and Aptitude',
    color: '#c084fc',
    subjects: [
      { id: 'gs4_eth',  name: 'Ethics & Human Interface' },
      { id: 'gs4_thinkers', name: 'Moral Thinkers & Philosophers' },
      { id: 'gs4_ig',   name: 'Integrity & Governance' },
      { id: 'gs4_cs',   name: 'Case Studies' }
    ]
  },
  prelims: {
    label: 'Prelims',
    full: 'Civil Services Preliminary Examination',
    color: '#f87171',
    subjects: [
      { id: 'pre_gs',   name: 'General Studies Paper 1' },
      { id: 'pre_csat', name: 'CSAT Paper 2' }
    ]
  },
  optional: {
    label: 'Optional',
    full: 'Economics',
    color: '#22d3ee',
    subjects: [
      { id: 'opt_p1',   name: 'Economics Paper 1 — Theory' },
      { id: 'opt_p2',   name: 'Economics Paper 2 — Indian Economy' }
    ]
  }
};
