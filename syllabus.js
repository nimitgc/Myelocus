// MYELOCUS — Syllabus structure
// Papers and subjects: fixed structure
// Default bullets and chunks: seeded from official UPSC notification
// User can edit, delete, add via the app — stored in localStorage

const PAPER_ORDER = ['gs1', 'gs2', 'gs3', 'gs4', 'prelims', 'optional'];

const PAPERS = {
  gs1: {
    label: 'GS 1',
    full: 'Indian Heritage and Culture, History and Geography of the World and Society',
    color: '#818cf8',
    subjects: [
      { id: 'gs1_art', name: 'Art & Culture' },
      { id: 'gs1_mih', name: 'Modern Indian History' },
      { id: 'gs1_pi',  name: 'Post Independence' },
      { id: 'gs1_wh',  name: 'World History' },
      { id: 'gs1_soc', name: 'Indian Society' },
      { id: 'gs1_geo', name: 'Geography' }
    ]
  },
  gs2: {
    label: 'GS 2',
    full: 'Governance, Constitution, Polity, Social Justice and International Relations',
    color: '#4ade80',
    subjects: [
      { id: 'gs2_pol', name: 'Polity & Constitution' },
      { id: 'gs2_gov', name: 'Governance' },
      { id: 'gs2_sj',  name: 'Social Justice' },
      { id: 'gs2_ir',  name: 'International Relations' }
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
      { id: 'gs4_eth',      name: 'Ethics & Human Interface' },
      { id: 'gs4_thinkers', name: 'Moral Thinkers & Philosophers' },
      { id: 'gs4_ig',       name: 'Integrity & Governance' },
      { id: 'gs4_cs',       name: 'Case Studies' }
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
      { id: 'opt_p1', name: 'Economics Paper 1 — Theory' },
      { id: 'opt_p2', name: 'Economics Paper 2 — Indian Economy' }
    ]
  }
};

// DEFAULT SYLLABUS — seeded on first run if localStorage is empty
// Official UPSC bullets with pre-defined chunks
// User can edit labels, delete, or add their own chunks via the app
const DEFAULT_SYLLABUS = {
  gs1: {
    gs1_art: { bullets: [
      { id: 'b_gs1_art_1', official: 'Indian Culture — salient aspects of Art Forms, Literature and Architecture from ancient to modern times', label: 'Art Forms, Literature & Architecture', chunks: [
        { id: 'c_gs1_art_1_1', name: 'Ancient Art Forms — sculpture, pottery, terracotta, numismatics' },
        { id: 'c_gs1_art_1_2', name: 'Ancient Literature — Vedic, Sanskrit, Pali, Prakrit texts' },
        { id: 'c_gs1_art_1_3', name: 'Ancient Architecture — Stupa, rock-cut caves, temple styles' },
        { id: 'c_gs1_art_1_4', name: 'Medieval Performing Arts — classical dance forms (Bharatanatyam, Kathak, Odissi, Manipuri, Kuchipudi, Mohiniyattam, Sattriya, Kathakali)' },
        { id: 'c_gs1_art_1_5', name: 'Medieval Music — Hindustani & Carnatic traditions, Gharanas' },
        { id: 'c_gs1_art_1_6', name: 'Medieval Literature — Bhakti, Sufi, regional language literature' },
        { id: 'c_gs1_art_1_7', name: 'Medieval Architecture — Indo-Islamic, Mughal, Rajput, temple styles (Nagara, Dravida, Vesara)' },
        { id: 'c_gs1_art_1_8', name: 'Painting traditions — Mughal, Rajput, Pahari, Madhubani, Warli, folk arts' },
        { id: 'c_gs1_art_1_9', name: 'Modern Art & Literature — colonial period, nationalist art, post-independence' },
        { id: 'c_gs1_art_1_10', name: 'Intangible heritage — puppetry, martial arts, crafts, UNESCO recognition' }
      ]}
    ]},
    gs1_mih: { bullets: [
      { id: 'b_gs1_mih_1', official: 'Modern Indian History from about the middle of the eighteenth century until the present — significant events, personalities, issues', label: 'Modern Indian History 1750–present', chunks: [
        { id: 'c_gs1_mih_1_1', name: 'European arrival — Portuguese, Dutch, British, French trading companies' },
        { id: 'c_gs1_mih_1_2', name: 'British expansion — Plassey, Buxar, Subsidiary Alliance, Doctrine of Lapse' },
        { id: 'c_gs1_mih_1_3', name: 'Economic impact of British rule — drain of wealth, deindustrialisation' },
        { id: 'c_gs1_mih_1_4', name: 'Social & religious reform movements — Raja Ram Mohan Roy, Brahmo Samaj, Arya Samaj, Aligarh' },
        { id: 'c_gs1_mih_1_5', name: 'Revolt of 1857 — causes, nature, consequences' },
        { id: 'c_gs1_mih_1_6', name: 'Rise of nationalism — INC founding, Moderates & Extremists' },
        { id: 'c_gs1_mih_1_7', name: 'Partition of Bengal & Swadeshi Movement' },
        { id: 'c_gs1_mih_1_8', name: 'Constitutional developments — Morley-Minto, Montagu-Chelmsford, Government of India Acts' }
      ]},
      { id: 'b_gs1_mih_2', official: 'The Freedom Struggle — its various stages and important contributors/contributions from different parts of the country', label: 'Freedom Struggle — stages & contributors', chunks: [
        { id: 'c_gs1_mih_2_1', name: 'Gandhian era — Non-cooperation, Civil Disobedience, Quit India movements' },
        { id: 'c_gs1_mih_2_2', name: 'Revolutionary movements — Bhagat Singh, INA, Subhas Chandra Bose' },
        { id: 'c_gs1_mih_2_3', name: 'Women in freedom struggle — Sarojini Naidu, Kasturba, Annie Besant' },
        { id: 'c_gs1_mih_2_4', name: 'Regional contributions — Bengal, Maharashtra, Punjab, South India' },
        { id: 'c_gs1_mih_2_5', name: 'Dalit & tribal movements — Ambedkar, tribal uprisings' },
        { id: 'c_gs1_mih_2_6', name: 'Communalism, partition negotiations & independence 1947' }
      ]}
    ]},
    gs1_pi: { bullets: [
      { id: 'b_gs1_pi_1', official: 'Post-independence consolidation and reorganization within the country', label: 'Post-independence consolidation', chunks: [
        { id: 'c_gs1_pi_1_1', name: 'Integration of princely states — Sardar Patel, Hyderabad, Kashmir, Junagadh' },
        { id: 'c_gs1_pi_1_2', name: 'Partition & refugee rehabilitation' },
        { id: 'c_gs1_pi_1_3', name: 'Linguistic reorganisation of states — States Reorganisation Act 1956' },
        { id: 'c_gs1_pi_1_4', name: 'Nehruvian economic model — planning, PSUs, mixed economy' },
        { id: 'c_gs1_pi_1_5', name: 'Early foreign policy — Non-alignment, Panchsheel' }
      ]}
    ]},
    gs1_wh: { bullets: [
      { id: 'b_gs1_wh_1', official: 'History of the World — events from 18th century: Industrial Revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies like Communism, Capitalism, Socialism — their forms and effect on the society', label: 'World History 18th century onwards', chunks: [
        { id: 'c_gs1_wh_1_1', name: 'Industrial Revolution — causes, spread, social & economic impact' },
        { id: 'c_gs1_wh_1_2', name: 'World War I — causes, course, Treaty of Versailles, consequences' },
        { id: 'c_gs1_wh_1_3', name: 'World War II — causes, Holocaust, atomic bombs, consequences' },
        { id: 'c_gs1_wh_1_4', name: 'Colonisation & Decolonisation — Asia, Africa, Latin America' },
        { id: 'c_gs1_wh_1_5', name: 'Redrawal of national boundaries — post WWI & WWII settlements' },
        { id: 'c_gs1_wh_1_6', name: 'Communism — Marx, Lenin, USSR, Chinese revolution, forms & effects' },
        { id: 'c_gs1_wh_1_7', name: 'Capitalism & Socialism — forms, welfare state, neoliberalism, effects' },
        { id: 'c_gs1_wh_1_8', name: 'Cold War — bipolar world, proxy wars, détente, collapse of USSR' }
      ]}
    ]},
    gs1_soc: { bullets: [
      { id: 'b_gs1_soc_1', official: 'Salient features of Indian Society, Diversity of India', label: 'Indian Society & Diversity', chunks: [
        { id: 'c_gs1_soc_1_1', name: 'Features of Indian society — unity in diversity, pluralism, syncretism' },
        { id: 'c_gs1_soc_1_2', name: 'Caste system — origin, features, contemporary issues, changes' },
        { id: 'c_gs1_soc_1_3', name: 'Religious diversity — major religions, minority rights, secularism' },
        { id: 'c_gs1_soc_1_4', name: 'Linguistic diversity — Eighth Schedule, linguistic identity' },
        { id: 'c_gs1_soc_1_5', name: 'Tribal communities — features, issues, constitutional provisions' }
      ]},
      { id: 'b_gs1_soc_2', official: "Role of Women and Women's Organization, Population and Associated Issues, Poverty and Developmental issues, Urbanization — their problems and remedies", label: 'Women, Population, Poverty & Urbanisation', chunks: [
        { id: 'c_gs1_soc_2_1', name: "Women — status, gender inequality, women's organisations & movements" },
        { id: 'c_gs1_soc_2_2', name: 'Population — growth, demographic dividend, age structure, NPC' },
        { id: 'c_gs1_soc_2_3', name: 'Poverty — measurement, causes, poverty alleviation programmes' },
        { id: 'c_gs1_soc_2_4', name: 'Urbanisation — trends, smart cities, urban poverty, slums' }
      ]},
      { id: 'b_gs1_soc_3', official: 'Effects of Globalization on Indian society', label: 'Globalisation & Indian Society', chunks: [
        { id: 'c_gs1_soc_3_1', name: 'Cultural globalisation — westernisation, homogenisation vs diversity' },
        { id: 'c_gs1_soc_3_2', name: 'Economic globalisation — impact on agriculture, industry, labour' },
        { id: 'c_gs1_soc_3_3', name: 'Technology & social change — digital divide, social media, family structure' }
      ]},
      { id: 'b_gs1_soc_4', official: 'Social Empowerment, Communalism, Regionalism & Secularism', label: 'Social Empowerment, Communalism & Secularism', chunks: [
        { id: 'c_gs1_soc_4_1', name: 'Social empowerment — SC/ST/OBC policies, reservation debate' },
        { id: 'c_gs1_soc_4_2', name: 'Communalism — causes, manifestations, role of state' },
        { id: 'c_gs1_soc_4_3', name: 'Regionalism — linguistic, ethnic, economic regionalism' },
        { id: 'c_gs1_soc_4_4', name: 'Secularism — Indian model vs Western, threats & challenges' }
      ]}
    ]},
    gs1_geo: { bullets: [
      { id: 'b_gs1_geo_1', official: "Salient features of World's Physical Geography", label: 'World Physical Geography', chunks: [
        { id: 'c_gs1_geo_1_1', name: 'Geomorphology — plate tectonics, landforms, rock cycle, erosion' },
        { id: 'c_gs1_geo_1_2', name: 'Climatology — atmospheric circulation, pressure belts, wind systems, climatic types' },
        { id: 'c_gs1_geo_1_3', name: 'Oceanography — ocean currents, tides, marine resources, coral reefs' },
        { id: 'c_gs1_geo_1_4', name: 'Biogeography — biomes, vegetation zones, soil types' }
      ]},
      { id: 'b_gs1_geo_2', official: 'Distribution of Key Natural Resources across the world — factors responsible for location of primary, secondary, and tertiary sector industries', label: 'Natural Resources & Industrial Location', chunks: [
        { id: 'c_gs1_geo_2_1', name: 'World distribution of minerals — coal, iron, petroleum, uranium' },
        { id: 'c_gs1_geo_2_2', name: 'Agricultural resources — world agriculture patterns, food security geography' },
        { id: 'c_gs1_geo_2_3', name: 'Industrial location factors — raw material, energy, labour, market, transport' },
        { id: 'c_gs1_geo_2_4', name: "India's natural resources — distribution of minerals, forests, water" }
      ]},
      { id: 'b_gs1_geo_3', official: 'Important Geophysical Phenomena — earthquakes, Tsunami, Volcanic activity, cyclone; geographical features and their location; changes in critical geographical features', label: 'Geophysical Phenomena & Critical Features', chunks: [
        { id: 'c_gs1_geo_3_1', name: 'Earthquakes — causes, seismic zones, measurement, impact' },
        { id: 'c_gs1_geo_3_2', name: 'Volcanoes & Tsunamis — Ring of Fire, formation, impact' },
        { id: 'c_gs1_geo_3_3', name: 'Cyclones & tropical storms — formation, tracks, India specific' },
        { id: 'c_gs1_geo_3_4', name: 'Critical geographical features — glaciers, rivers, wetlands & their changes' }
      ]}
    ]}
  },
  gs2: {
    gs2_pol: { bullets: [
      { id: 'b_gs2_pol_1', official: 'Indian Constitution — Historical Underpinnings, Evolution, Features, Amendments, Significant Provisions and Basic Structure', label: 'Constitution — features, amendments, basic structure', chunks: [
        { id: 'c_gs2_pol_1_1', name: 'Historical underpinnings — GoI Acts, Constituent Assembly debates' },
        { id: 'c_gs2_pol_1_2', name: 'Preamble — significance, keywords, amendments' },
        { id: 'c_gs2_pol_1_3', name: 'Salient features — federal with unitary bias, parliamentary, secular, socialist' },
        { id: 'c_gs2_pol_1_4', name: 'Fundamental Rights — Articles 12-35, exceptions, landmark cases' },
        { id: 'c_gs2_pol_1_5', name: 'Directive Principles & Fundamental Duties — Articles 36-51A' },
        { id: 'c_gs2_pol_1_6', name: 'Major constitutional amendments — 42nd, 44th, 73rd, 74th, 86th, 101st' },
        { id: 'c_gs2_pol_1_7', name: 'Basic Structure doctrine — Kesavananda Bharati, evolution, scope' }
      ]},
      { id: 'b_gs2_pol_2', official: 'Functions and Responsibilities of the Union and the States, Issues and Challenges Pertaining to the Federal Structure, Devolution of Powers and Finances up to Local Levels', label: 'Federalism & Centre-State Relations', chunks: [
        { id: 'c_gs2_pol_2_1', name: 'Legislative relations — Union, State, Concurrent lists, residuary powers' },
        { id: 'c_gs2_pol_2_2', name: 'Administrative relations — All India Services, directions to states' },
        { id: 'c_gs2_pol_2_3', name: 'Financial relations — Finance Commission, grants, tax devolution' },
        { id: 'c_gs2_pol_2_4', name: 'Local self-government — 73rd & 74th amendments, Panchayati Raj, ULBs' },
        { id: 'c_gs2_pol_2_5', name: 'Inter-state disputes — river water, boundaries, coordinating bodies' }
      ]},
      { id: 'b_gs2_pol_3', official: 'Parliament and State Legislatures — Structure, Functioning, Conduct of Business, Powers & Privileges', label: 'Parliament & State Legislatures', chunks: [
        { id: 'c_gs2_pol_3_1', name: 'Lok Sabha & Rajya Sabha — composition, powers, differences' },
        { id: 'c_gs2_pol_3_2', name: 'Legislative process — ordinary bills, money bills, constitutional amendments' },
        { id: 'c_gs2_pol_3_3', name: 'Parliamentary committees — standing, select, joint committees' },
        { id: 'c_gs2_pol_3_4', name: 'Parliamentary privileges, anti-defection law, reforms' }
      ]},
      { id: 'b_gs2_pol_4', official: 'Structure, Organization and Functioning of the Executive and the Judiciary', label: 'Executive & Judiciary', chunks: [
        { id: 'c_gs2_pol_4_1', name: 'President — powers, election, role in parliamentary system' },
        { id: 'c_gs2_pol_4_2', name: 'Prime Minister & Council of Ministers — collective responsibility, cabinet' },
        { id: 'c_gs2_pol_4_3', name: 'Governor — powers, role, controversies' },
        { id: 'c_gs2_pol_4_4', name: 'Supreme Court — jurisdiction, judicial review, PIL, independence' },
        { id: 'c_gs2_pol_4_5', name: 'Judicial appointments — collegium, NJAC debate' }
      ]},
      { id: 'b_gs2_pol_5', official: 'Statutory, Regulatory and various Quasi-judicial Bodies', label: 'Constitutional, Statutory & Regulatory Bodies', chunks: [
        { id: 'c_gs2_pol_5_1', name: 'Constitutional bodies — Election Commission, CAG, UPSC, Finance Commission' },
        { id: 'c_gs2_pol_5_2', name: 'Statutory bodies — NHRC, CIC, CVC, Lokpal, CBI' },
        { id: 'c_gs2_pol_5_3', name: 'Regulatory bodies — SEBI, RBI, TRAI, CCI, IRDAI' },
        { id: 'c_gs2_pol_5_4', name: 'Tribunals — NGT, NCLT, CAT — role & independence' }
      ]}
    ]},
    gs2_gov: { bullets: [
      { id: 'b_gs2_gov_1', official: 'Government Policies and Interventions for Development in various sectors and Issues arising out of their Design and Implementation', label: 'Government Policies & Implementation', chunks: [
        { id: 'c_gs2_gov_1_1', name: 'Policy design issues — targeting, identification, leakages' },
        { id: 'c_gs2_gov_1_2', name: 'Implementation challenges — last mile delivery, bureaucratic capacity' },
        { id: 'c_gs2_gov_1_3', name: 'Major flagship schemes — PM-KISAN, MGNREGS, Ayushman Bharat, PM Awas' }
      ]},
      { id: 'b_gs2_gov_2', official: 'Important Aspects of Governance, Transparency and Accountability, e-Governance — applications, models, successes, limitations; Citizens Charters', label: 'Transparency, e-Governance & Accountability', chunks: [
        { id: 'c_gs2_gov_2_1', name: 'RTI Act — provisions, implementation, challenges, amendments' },
        { id: 'c_gs2_gov_2_2', name: 'e-Governance — models (G2C, G2B, G2G), DigiLocker, UMANG, successes & limits' },
        { id: 'c_gs2_gov_2_3', name: 'Citizens charter — concept, implementation, limitations' },
        { id: 'c_gs2_gov_2_4', name: 'Accountability mechanisms — social audit, grievance redressal, CPGRAMS' }
      ]},
      { id: 'b_gs2_gov_3', official: 'Role of Civil Services in a Democracy', label: 'Civil Services in Democracy', chunks: [
        { id: 'c_gs2_gov_3_1', name: 'Role — permanence, neutrality, accountability, expertise' },
        { id: 'c_gs2_gov_3_2', name: 'Civil service reforms — lateral entry, performance management, iGOT' },
        { id: 'c_gs2_gov_3_3', name: 'Political-administrative interface — minister-bureaucrat relations' }
      ]},
      { id: 'b_gs2_gov_4', official: 'Development Processes and the Development Industry — Role of NGOs, SHGs, various groups and associations', label: 'NGOs, SHGs & Development Stakeholders', chunks: [
        { id: 'c_gs2_gov_4_1', name: 'NGOs — role, regulation, FCRA, challenges' },
        { id: 'c_gs2_gov_4_2', name: 'Self-Help Groups — microfinance, women empowerment, SHG-bank linkage' },
        { id: 'c_gs2_gov_4_3', name: 'Civil society & pressure groups — role in governance' }
      ]}
    ]},
    gs2_sj: { bullets: [
      { id: 'b_gs2_sj_1', official: 'Welfare Schemes for Vulnerable Sections of the population by the Centre and States — Performance of these Schemes', label: 'Welfare Schemes for Vulnerable Sections', chunks: [
        { id: 'c_gs2_sj_1_1', name: 'Schemes for SC/ST — scholarships, reservation, post-matric' },
        { id: 'c_gs2_sj_1_2', name: 'Schemes for women — Beti Bachao, maternity benefits, WCD' },
        { id: 'c_gs2_sj_1_3', name: 'Schemes for children — ICDS, PM Poshan, child labour laws' },
        { id: 'c_gs2_sj_1_4', name: 'Schemes for elderly & disabled — NSAP, RPWD Act' }
      ]},
      { id: 'b_gs2_sj_2', official: 'Issues relating to development and management of Social Sector or Services relating to Health, Education, Human Resources', label: 'Health, Education & Human Resources', chunks: [
        { id: 'c_gs2_sj_2_1', name: 'Health — NHM, PMJAY, public health infrastructure, disease burden' },
        { id: 'c_gs2_sj_2_2', name: 'Education — NEP 2020, RTE, higher education reforms, GER' },
        { id: 'c_gs2_sj_2_3', name: 'Human development — HDI, gender inequality index, India ranking' }
      ]},
      { id: 'b_gs2_sj_3', official: 'Issues relating to Poverty and Hunger', label: 'Poverty & Hunger', chunks: [
        { id: 'c_gs2_sj_3_1', name: 'Poverty measurement — Tendulkar, Rangarajan, multidimensional poverty' },
        { id: 'c_gs2_sj_3_2', name: 'Food security — PDS, National Food Security Act, hunger indices' },
        { id: 'c_gs2_sj_3_3', name: 'Malnutrition — POSHAN Abhiyan, stunting, wasting, India performance' }
      ]}
    ]},
    gs2_ir: { bullets: [
      { id: 'b_gs2_ir_1', official: 'India and its Neighbourhood — Relations', label: 'India & Neighbourhood', chunks: [
        { id: 'c_gs2_ir_1_1', name: 'India-Pakistan — Kashmir, terrorism, trade, diplomatic relations' },
        { id: 'c_gs2_ir_1_2', name: 'India-China — border disputes, LAC, trade, competition' },
        { id: 'c_gs2_ir_1_3', name: 'India-Bangladesh — connectivity, Teesta, Rohingya, trade' },
        { id: 'c_gs2_ir_1_4', name: 'India-Nepal, Bhutan, Sri Lanka, Maldives — strategic importance' },
        { id: 'c_gs2_ir_1_5', name: 'SAARC & BIMSTEC — relevance, challenges, India role' }
      ]},
      { id: 'b_gs2_ir_2', official: "Bilateral, Regional and Global Groupings and Agreements involving India and/or affecting India's interests", label: 'Groupings & Agreements', chunks: [
        { id: 'c_gs2_ir_2_1', name: 'QUAD, SCO, BRICS — India role, strategic significance' },
        { id: 'c_gs2_ir_2_2', name: 'G20 — India presidency, priorities, outcomes' },
        { id: 'c_gs2_ir_2_3', name: 'India-US, India-Russia — defence, trade, technology' },
        { id: 'c_gs2_ir_2_4', name: 'India-EU, India-UK — trade agreements, strategic partnership' }
      ]},
      { id: 'b_gs2_ir_3', official: "Effect of Policies and Politics of Developed and Developing Countries on India's interests, Indian Diaspora", label: "Foreign Policies affecting India & Diaspora", chunks: [
        { id: 'c_gs2_ir_3_1', name: "US & Chinese foreign policy impact on India's interests" },
        { id: 'c_gs2_ir_3_2', name: 'Indian diaspora — PIO, OCI, remittances, soft power' }
      ]},
      { id: 'b_gs2_ir_4', official: 'Important International Institutions, agencies and fora — their Structure, Mandate', label: 'International Institutions & Forums', chunks: [
        { id: 'c_gs2_ir_4_1', name: 'UN system — UNSC, UNGA, UNHRC, reform debates, India bid' },
        { id: 'c_gs2_ir_4_2', name: 'WTO — structure, dispute settlement, India positions' },
        { id: 'c_gs2_ir_4_3', name: 'IMF & World Bank — mandate, conditionalities, India role' },
        { id: 'c_gs2_ir_4_4', name: 'Other — IAEA, ICC, WHO, UNESCO, INTERPOL' }
      ]}
    ]}
  },
  gs3: {
    gs3_eco: { bullets: [
      { id: 'b_gs3_eco_1', official: 'Indian Economy and issues relating to Planning, Mobilization of Resources, Growth, Development and Employment', label: 'Planning, Growth & Employment', chunks: [
        { id: 'c_gs3_eco_1_1', name: 'Economic planning — Five Year Plans, NITI Aayog, development strategy' },
        { id: 'c_gs3_eco_1_2', name: 'Mobilisation of resources — taxation, borrowings, disinvestment' },
        { id: 'c_gs3_eco_1_3', name: 'Growth vs development — GDP, HDI, inclusive growth indicators' },
        { id: 'c_gs3_eco_1_4', name: 'Employment — PLFS data, informal sector, jobless growth debate' }
      ]},
      { id: 'b_gs3_eco_2', official: 'Government Budgeting', label: 'Government Budgeting', chunks: [
        { id: 'c_gs3_eco_2_1', name: 'Budget structure — revenue & capital accounts, fiscal deficit, FRBM' },
        { id: 'c_gs3_eco_2_2', name: 'GST — structure, Council, input tax credit, revenue sharing' },
        { id: 'c_gs3_eco_2_3', name: 'Direct taxes — income tax, corporate tax, reforms' }
      ]},
      { id: 'b_gs3_eco_3', official: 'Effects of Liberalization on the Economy, changes in industrial policy and their effects on industrial growth', label: 'Liberalisation & Industrial Policy', chunks: [
        { id: 'c_gs3_eco_3_1', name: '1991 reforms — LPG, BoP crisis, structural adjustment' },
        { id: 'c_gs3_eco_3_2', name: 'Industrial policy evolution — licensing raj to Make in India, PLI schemes' },
        { id: 'c_gs3_eco_3_3', name: 'Demonetisation & GST — impact on economy and informal sector' }
      ]},
      { id: 'b_gs3_eco_4', official: 'Infrastructure — Energy, Ports, Roads, Airports, Railways etc.', label: 'Infrastructure', chunks: [
        { id: 'c_gs3_eco_4_1', name: 'Energy infrastructure — power sector, renewable energy, coal dependence' },
        { id: 'c_gs3_eco_4_2', name: 'Transport infrastructure — roads, railways modernisation, ports' },
        { id: 'c_gs3_eco_4_3', name: 'Investment models — PPP, hybrid annuity, NIP, InvITs' }
      ]},
      { id: 'b_gs3_eco_5', official: 'Inclusive Growth and issues arising from it', label: 'Inclusive Growth', chunks: [
        { id: 'c_gs3_eco_5_1', name: 'Inclusive growth — concept, indicators, challenges in India' },
        { id: 'c_gs3_eco_5_2', name: 'Financial inclusion — Jan Dhan, payment banks, digital payments' },
        { id: 'c_gs3_eco_5_3', name: 'Regional inequality — inter-state disparities, backward districts' }
      ]}
    ]},
    gs3_agri: { bullets: [
      { id: 'b_gs3_agri_1', official: 'Major crops — cropping patterns in various parts of the country, different types of irrigation and irrigation systems, storage, transport and marketing of agricultural produce, e-technology in the aid of farmers', label: 'Cropping Patterns, Irrigation & Marketing', chunks: [
        { id: 'c_gs3_agri_1_1', name: 'Cropping patterns — Kharif, Rabi, Zaid; crop geography of India' },
        { id: 'c_gs3_agri_1_2', name: 'Irrigation — sources, watershed development, water use efficiency' },
        { id: 'c_gs3_agri_1_3', name: 'Agricultural marketing — APMC, eNAM, FPOs, supply chain' },
        { id: 'c_gs3_agri_1_4', name: 'e-Technology in agriculture — Kisan portal, precision farming, AGRI STACK' }
      ]},
      { id: 'b_gs3_agri_2', official: 'Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System; issues of buffer stocks and food security', label: 'MSP, Subsidies, PDS & Food Security', chunks: [
        { id: 'c_gs3_agri_2_1', name: 'MSP — rationale, C2+50% formula, legal guarantee debate' },
        { id: 'c_gs3_agri_2_2', name: 'Farm subsidies — fertiliser, power, water — fiscal impact & reforms' },
        { id: 'c_gs3_agri_2_3', name: 'PDS — NFSA, One Nation One Ration Card, leakages, revamping' },
        { id: 'c_gs3_agri_2_4', name: 'Buffer stocks — FCI, decentralised procurement, food security' }
      ]},
      { id: 'b_gs3_agri_3', official: 'Land reforms in India', label: 'Land Reforms', chunks: [
        { id: 'c_gs3_agri_3_1', name: 'Land reforms — zamindari abolition, land ceiling, tenancy reforms' },
        { id: 'c_gs3_agri_3_2', name: 'Land records digitisation — DILRMP, Svamitva scheme' },
        { id: 'c_gs3_agri_3_3', name: 'Land acquisition — LARR Act, compensation, rehabilitation' }
      ]},
      { id: 'b_gs3_agri_4', official: 'Food processing and related industries in India — scope and significance, location, upstream and downstream requirements, supply chain management', label: 'Food Processing Industry', chunks: [
        { id: 'c_gs3_agri_4_1', name: 'Food processing — scope, significance, PM Kisan SAMPADA' },
        { id: 'c_gs3_agri_4_2', name: 'Supply chain — cold chain, warehousing, logistics, wastage' }
      ]}
    ]},
    gs3_st: { bullets: [
      { id: 'b_gs3_st_1', official: 'Science and Technology — developments and their applications and effects in everyday life', label: 'S&T developments & applications', chunks: [
        { id: 'c_gs3_st_1_1', name: 'Artificial Intelligence — applications, regulation, India AI mission' },
        { id: 'c_gs3_st_1_2', name: 'Blockchain & cryptocurrency — technology, RBI stance, CBDC' },
        { id: 'c_gs3_st_1_3', name: 'Quantum computing — basics, applications, India quantum mission' },
        { id: 'c_gs3_st_1_4', name: 'Internet of Things & 5G — applications, security concerns' }
      ]},
      { id: 'b_gs3_st_2', official: 'Achievements of Indians in Science & Technology; indigenization of technology and developing new technology', label: 'Indian S&T achievements & indigenisation', chunks: [
        { id: 'c_gs3_st_2_1', name: 'ISRO — Chandrayaan, Mangalyaan, Gaganyaan, commercial launches' },
        { id: 'c_gs3_st_2_2', name: 'Defence indigenisation — LCA Tejas, Arjun tank, DRDO achievements' },
        { id: 'c_gs3_st_2_3', name: 'Nuclear programme — civilian use, safeguards, NSG membership' },
        { id: 'c_gs3_st_2_4', name: 'IPR — Patents Act, TRIPS, compulsory licensing, India positions' }
      ]},
      { id: 'b_gs3_st_3', official: 'Awareness in the fields of IT, Space, Computers, Robotics, Nano-technology, Bio-technology and issues relating to Intellectual Property Rights', label: 'IT, Biotech, Nanotech & IPR', chunks: [
        { id: 'c_gs3_st_3_1', name: 'Biotechnology — CRISPR, GM crops, mRNA vaccines, biosafety' },
        { id: 'c_gs3_st_3_2', name: 'Nanotechnology — applications in medicine, material science' },
        { id: 'c_gs3_st_3_3', name: 'Cybersecurity — threats, CERT-In, data protection, IT Act' },
        { id: 'c_gs3_st_3_4', name: 'Robotics & automation — impact on employment, India position' }
      ]}
    ]},
    gs3_env: { bullets: [
      { id: 'b_gs3_env_1', official: 'Conservation, Environmental Pollution and Degradation, Environmental Impact Assessment', label: 'Conservation, Pollution & EIA', chunks: [
        { id: 'c_gs3_env_1_1', name: 'Biodiversity conservation — hotspots, protected areas, IUCN categories' },
        { id: 'c_gs3_env_1_2', name: 'Air pollution — sources, AQI, NCAP, health impacts' },
        { id: 'c_gs3_env_1_3', name: 'Water pollution — rivers, groundwater, Namami Gange' },
        { id: 'c_gs3_env_1_4', name: 'Environmental Impact Assessment — process, public hearing, amendments' },
        { id: 'c_gs3_env_1_5', name: 'Wetlands, mangroves, forests — Ramsar, legal protection, degradation' }
      ]},
      { id: 'b_gs3_env_2', official: 'Climate Change — International Agreements and their impact', label: 'Climate Change & International Agreements', chunks: [
        { id: 'c_gs3_env_2_1', name: 'UNFCCC — COP process, Kyoto Protocol, Paris Agreement' },
        { id: 'c_gs3_env_2_2', name: "India's NDC — targets, progress, renewable energy push" },
        { id: 'c_gs3_env_2_3', name: 'Carbon markets — Article 6, carbon credits, India position' },
        { id: 'c_gs3_env_2_4', name: 'International conventions — CBD, CITES, Basel, Ramsar, Montreal Protocol' }
      ]}
    ]},
    gs3_dis: { bullets: [
      { id: 'b_gs3_dis_1', official: 'Disaster and Disaster Management', label: 'Disaster Management', chunks: [
        { id: 'c_gs3_dis_1_1', name: 'Disaster types — natural (flood, earthquake, cyclone) & man-made' },
        { id: 'c_gs3_dis_1_2', name: 'Disaster Management Act, NDMA, SDMA — institutional framework' },
        { id: 'c_gs3_dis_1_3', name: 'Sendai Framework — priorities, targets, India implementation' },
        { id: 'c_gs3_dis_1_4', name: 'Climate change & disasters — increasing frequency, IPCC findings' }
      ]}
    ]},
    gs3_sec: { bullets: [
      { id: 'b_gs3_sec_1', official: 'Linkages between development and spread of extremism; Role of external state and non-state actors in creating challenges to internal security', label: 'Extremism & External Actors', chunks: [
        { id: 'c_gs3_sec_1_1', name: 'Left Wing Extremism — causes, spread, government response' },
        { id: 'c_gs3_sec_1_2', name: 'North-East insurgency — causes, peace accords, remaining challenges' },
        { id: 'c_gs3_sec_1_3', name: "Jammu & Kashmir — Article 370 abrogation, security situation" },
        { id: 'c_gs3_sec_1_4', name: "External actors — Pakistan ISI, China's role in internal disturbances" }
      ]},
      { id: 'b_gs3_sec_2', official: 'Challenges to internal security through communication networks, role of media and social networking sites, basics of cyber security; money-laundering and its prevention', label: 'Cyber Security, Media & Money Laundering', chunks: [
        { id: 'c_gs3_sec_2_1', name: 'Cyber threats — state-sponsored attacks, ransomware, critical infrastructure' },
        { id: 'c_gs3_sec_2_2', name: 'Social media & internal security — fake news, radicalisation' },
        { id: 'c_gs3_sec_2_3', name: 'Money laundering — PMLA, FATF, hawala, benami transactions' }
      ]},
      { id: 'b_gs3_sec_3', official: 'Security challenges and their management in border areas; Various Security forces and agencies and their mandate', label: 'Border Management & Security Forces', chunks: [
        { id: 'c_gs3_sec_3_1', name: 'Border management — India-Pakistan, India-China, smart fencing' },
        { id: 'c_gs3_sec_3_2', name: 'Central Armed Police Forces — BSF, CRPF, CISF, SSB, ITBP mandates' },
        { id: 'c_gs3_sec_3_3', name: 'Intelligence agencies — IB, RAW, structure, oversight' }
      ]}
    ]}
  },
  gs4: {
    gs4_eth: { bullets: [
      { id: 'b_gs4_eth_1', official: 'Ethics and Human Interface — Essence, determinants and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships', label: 'Ethics — essence, dimensions & relationships', chunks: [
        { id: 'c_gs4_eth_1_1', name: 'Essence of ethics — morality, values, virtues, distinction from law' },
        { id: 'c_gs4_eth_1_2', name: 'Determinants of ethics — family, society, education, religion, culture' },
        { id: 'c_gs4_eth_1_3', name: 'Ethical theories — consequentialism, deontology, virtue ethics, care ethics' },
        { id: 'c_gs4_eth_1_4', name: 'Ethics in private vs public life — double standards, conflicts of interest' }
      ]},
      { id: 'b_gs4_eth_2', official: 'Human Values — lessons from the lives and teachings of great leaders, reformers and administrators', label: 'Human Values & Great Lives', chunks: [
        { id: 'c_gs4_eth_2_1', name: 'Gandhi — truth, non-violence, trusteeship, relevance today' },
        { id: 'c_gs4_eth_2_2', name: 'Ambedkar — social justice, equality, constitutional morality' },
        { id: 'c_gs4_eth_2_3', name: 'Role of family, society & educational institutions in inculcating values' }
      ]},
      { id: 'b_gs4_eth_3', official: 'Attitude — content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion', label: 'Attitude & Social Influence', chunks: [
        { id: 'c_gs4_eth_3_1', name: 'Attitude — components (cognitive, affective, behavioural), formation, change' },
        { id: 'c_gs4_eth_3_2', name: 'Persuasion & social influence — propaganda, peer pressure, nudge theory' },
        { id: 'c_gs4_eth_3_3', name: 'Moral & political attitudes — prejudice, tolerance, moral courage' }
      ]},
      { id: 'b_gs4_eth_4', official: 'Aptitude and foundational values for Civil Service — integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion', label: 'Civil Service Values & Aptitude', chunks: [
        { id: 'c_gs4_eth_4_1', name: 'Integrity & probity — meaning, importance, examples in civil service' },
        { id: 'c_gs4_eth_4_2', name: 'Impartiality & objectivity — political neutrality, rule-based decisions' },
        { id: 'c_gs4_eth_4_3', name: 'Empathy & compassion — dealing with vulnerable sections, public service ethos' }
      ]},
      { id: 'b_gs4_eth_5', official: 'Emotional Intelligence — concepts, and their utilities and application in administration and governance', label: 'Emotional Intelligence', chunks: [
        { id: 'c_gs4_eth_5_1', name: "EI concepts — Goleman's model, self-awareness, self-regulation, motivation" },
        { id: 'c_gs4_eth_5_2', name: 'EI in administration — conflict resolution, team management, public dealing' }
      ]}
    ]},
    gs4_thinkers: { bullets: [
      { id: 'b_gs4_thinkers_1', official: 'Contributions of moral thinkers and philosophers from India and world', label: 'Moral Thinkers & Philosophers', chunks: [
        { id: 'c_gs4_thinkers_1_1', name: 'Indian moral philosophy — Dharma, Karma, Kautilya, Niti Shastra' },
        { id: 'c_gs4_thinkers_1_2', name: 'Western thinkers — Plato, Aristotle, Kant, Mill, Bentham, Rawls' },
        { id: 'c_gs4_thinkers_1_3', name: 'Contemporary thinkers — Peter Singer, Amartya Sen, John Rawls' }
      ]}
    ]},
    gs4_ig: { bullets: [
      { id: 'b_gs4_ig_1', official: "Public/Civil service values and Ethics in Public administration — ethical concerns and dilemmas in government; laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; corporate governance", label: 'Ethics in Public Administration', chunks: [
        { id: 'c_gs4_ig_1_1', name: 'Ethical dilemmas in civil service — whistle-blowing, political pressure' },
        { id: 'c_gs4_ig_1_2', name: 'Laws vs conscience — when rules conflict with ethics' },
        { id: 'c_gs4_ig_1_3', name: 'Corporate governance — board accountability, CSR, ethical business' }
      ]},
      { id: 'b_gs4_ig_2', official: "Probity in Governance — Concept of public service; Information sharing and transparency in government; Right to Information; Codes of Ethics, Codes of Conduct, Citizen's Charter, Work Culture, challenges of corruption", label: 'Probity, Transparency & Anti-corruption', chunks: [
        { id: 'c_gs4_ig_2_1', name: 'Probity & public service — philosophical basis, Nolan principles' },
        { id: 'c_gs4_ig_2_2', name: 'Codes of ethics & conduct — AIS rules, CCS rules, service conduct' },
        { id: 'c_gs4_ig_2_3', name: 'Corruption — causes, types, impact, anti-corruption measures (Lokpal, CVC)' }
      ]}
    ]},
    gs4_cs: { bullets: [
      { id: 'b_gs4_cs_1', official: 'Case Studies on above issues', label: 'Case Studies', chunks: [
        { id: 'c_gs4_cs_1_1', name: 'Case study framework — identifying stakeholders, ethical issues, options' },
        { id: 'c_gs4_cs_1_2', name: 'Whistleblower cases — Satyendra Dubey, Shanmugam Manjunath' },
        { id: 'c_gs4_cs_1_3', name: 'Corruption dilemma cases — superior pressure, public interest conflict' },
        { id: 'c_gs4_cs_1_4', name: 'Policy implementation cases — balancing efficiency with equity' },
        { id: 'c_gs4_cs_1_5', name: 'Disaster management cases — ethical decisions under pressure' }
      ]}
    ]}
  },
  prelims: {
    pre_gs: { bullets: [
      { id: 'b_pre_gs_1', official: 'Current events of national and international importance', label: 'Current Affairs', chunks: [
        { id: 'c_pre_gs_1_1', name: 'National current affairs — last 18 months, major events, policies' },
        { id: 'c_pre_gs_1_2', name: 'International current affairs — summits, conflicts, treaties, awards' }
      ]},
      { id: 'b_pre_gs_2', official: 'History of India and Indian National Movement', label: 'History for Prelims', chunks: [
        { id: 'c_pre_gs_2_1', name: 'Ancient India MCQs — Indus Valley, Vedic, Maurya, Gupta' },
        { id: 'c_pre_gs_2_2', name: 'Medieval India MCQs — Delhi Sultanate, Mughals, regional kingdoms' },
        { id: 'c_pre_gs_2_3', name: 'Modern India MCQs — colonial period, freedom struggle' }
      ]},
      { id: 'b_pre_gs_3', official: 'Indian and World Geography — Physical, Social, Economic Geography of India and the World', label: 'Geography for Prelims', chunks: [
        { id: 'c_pre_gs_3_1', name: 'Physical geography MCQs — landforms, climate, soils, rivers' },
        { id: 'c_pre_gs_3_2', name: 'Human & economic geography MCQs — population, industries, trade' },
        { id: 'c_pre_gs_3_3', name: 'India-specific geography MCQs — states, resources, mapping' }
      ]},
      { id: 'b_pre_gs_4', official: 'Indian Polity and Governance — Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues', label: 'Polity for Prelims', chunks: [
        { id: 'c_pre_gs_4_1', name: 'Constitution MCQs — articles, schedules, amendments' },
        { id: 'c_pre_gs_4_2', name: 'Governance MCQs — bodies, schemes, policies' }
      ]},
      { id: 'b_pre_gs_5', official: 'Economic and Social Development — Sustainable Development, Poverty, Inclusion, Demographics, Social Sector', label: 'Economy & Social for Prelims', chunks: [
        { id: 'c_pre_gs_5_1', name: 'Economy MCQs — banking, inflation, GDP, schemes' },
        { id: 'c_pre_gs_5_2', name: 'Social development MCQs — poverty, HDI, welfare schemes' }
      ]},
      { id: 'b_pre_gs_6', official: 'General issues on Environmental Ecology, Biodiversity and Climate Change', label: 'Environment for Prelims', chunks: [
        { id: 'c_pre_gs_6_1', name: 'Ecology & biodiversity MCQs — species, habitats, conventions' },
        { id: 'c_pre_gs_6_2', name: 'Climate change MCQs — agreements, terms, India commitments' }
      ]},
      { id: 'b_pre_gs_7', official: 'General Science', label: 'General Science for Prelims', chunks: [
        { id: 'c_pre_gs_7_1', name: 'Physics & chemistry basics — everyday applications' },
        { id: 'c_pre_gs_7_2', name: 'Biology — human body, diseases, nutrition' },
        { id: 'c_pre_gs_7_3', name: 'Science & technology current developments' }
      ]}
    ]},
    pre_csat: { bullets: [
      { id: 'b_pre_csat_1', official: 'Comprehension', label: 'Reading Comprehension', chunks: [
        { id: 'c_pre_csat_1_1', name: 'Passage types — factual, analytical, literary' },
        { id: 'c_pre_csat_1_2', name: 'Question types — main idea, inference, vocabulary, tone' }
      ]},
      { id: 'b_pre_csat_2', official: 'Logical reasoning and analytical ability', label: 'Logical Reasoning', chunks: [
        { id: 'c_pre_csat_2_1', name: 'Syllogisms, assumptions, conclusions, arguments' },
        { id: 'c_pre_csat_2_2', name: 'Analytical puzzles — seating, ordering, blood relations' }
      ]},
      { id: 'b_pre_csat_3', official: 'Decision-making and problem-solving', label: 'Decision Making', chunks: [
        { id: 'c_pre_csat_3_1', name: 'Decision making scenarios — administrative, ethical dimensions' },
        { id: 'c_pre_csat_3_2', name: 'Problem solving — pattern recognition, logical sequences' }
      ]},
      { id: 'b_pre_csat_4', official: 'Basic numeracy and Data interpretation', label: 'Numeracy & Data Interpretation', chunks: [
        { id: 'c_pre_csat_4_1', name: 'Number systems, percentages, ratios, averages, profit-loss' },
        { id: 'c_pre_csat_4_2', name: 'Data interpretation — tables, bar graphs, pie charts, line graphs' }
      ]}
    ]}
  },
  optional: {
    opt_p1: { bullets: [
      { id: 'b_opt_p1_1', official: 'Micro-Economic Analysis — Demand and Supply, Theory of Consumer Behaviour, Production and Cost, Market Structure and Pricing', label: 'Microeconomics', chunks: [
        { id: 'c_opt_p1_1_1', name: 'Demand theory — consumer equilibrium, indifference curves, revealed preference' },
        { id: 'c_opt_p1_1_2', name: 'Supply theory — production function, cost curves, economies of scale' },
        { id: 'c_opt_p1_1_3', name: 'Market structures — perfect competition, monopoly, oligopoly, monopolistic competition' },
        { id: 'c_opt_p1_1_4', name: 'Factor pricing — wages, rent, interest, profit theories' }
      ]},
      { id: 'b_opt_p1_2', official: 'Macro-Economic Analysis — National Income, Employment, Money and Banking, Inflation', label: 'Macroeconomics', chunks: [
        { id: 'c_opt_p1_2_1', name: 'National income — concepts, measurement methods, CSO data' },
        { id: 'c_opt_p1_2_2', name: 'Employment theories — classical, Keynesian, IS-LM model' },
        { id: 'c_opt_p1_2_3', name: 'Money & banking — money supply, credit creation, RBI instruments' },
        { id: 'c_opt_p1_2_4', name: 'Inflation — theories, measurement, Phillips curve, stagflation' }
      ]},
      { id: 'b_opt_p1_3', official: 'International Economics — Theories of Trade, Balance of Payments, Exchange Rate', label: 'International Economics', chunks: [
        { id: 'c_opt_p1_3_1', name: 'Trade theories — comparative advantage, Heckscher-Ohlin, new trade theory' },
        { id: 'c_opt_p1_3_2', name: "Balance of Payments — current account, capital account, India's BoP" },
        { id: 'c_opt_p1_3_3', name: 'Exchange rate — determination, PPP, managed float, currency crises' }
      ]},
      { id: 'b_opt_p1_4', official: 'Growth and Development — Theories of Growth, Indicators of Development, Poverty and Inequality', label: 'Growth & Development Theories', chunks: [
        { id: 'c_opt_p1_4_1', name: 'Growth theories — Harrod-Domar, Solow, endogenous growth' },
        { id: 'c_opt_p1_4_2', name: 'Development indicators — HDI, GNH, MPI, sustainable development' },
        { id: 'c_opt_p1_4_3', name: 'Poverty & inequality — Lorenz curve, Gini coefficient, poverty traps' }
      ]},
      { id: 'b_opt_p1_5', official: 'Public Finance — Government Revenue and Expenditure, Fiscal Policy, Public Debt', label: 'Public Finance', chunks: [
        { id: 'c_opt_p1_5_1', name: 'Public revenue — tax & non-tax, direct & indirect, optimal taxation' },
        { id: 'c_opt_p1_5_2', name: "Public expenditure — Wagner's law, multiplier, crowding out" },
        { id: 'c_opt_p1_5_3', name: 'Fiscal policy — deficit types, FRBM, fiscal consolidation' },
        { id: 'c_opt_p1_5_4', name: "Public debt — internal vs external, debt sustainability, India's profile" }
      ]}
    ]},
    opt_p2: { bullets: [
      { id: 'b_opt_p2_1', official: 'Evolution of the Indian Economy and Economic Planning in India', label: 'Indian Economy — Evolution & Planning', chunks: [
        { id: 'c_opt_p2_1_1', name: 'Pre-independence economy — colonial exploitation, drain theory' },
        { id: 'c_opt_p2_1_2', name: 'Five Year Plans — objectives, achievements, failures, NITI Aayog' },
        { id: 'c_opt_p2_1_3', name: 'Structural change — sectoral composition, employment shifts' }
      ]},
      { id: 'b_opt_p2_2', official: 'Agriculture — Land reforms, Green Revolution, Agricultural Finance and Marketing', label: 'Indian Agriculture', chunks: [
        { id: 'c_opt_p2_2_1', name: 'Land reforms — zamindari abolition, ceiling laws, tenancy, outcomes' },
        { id: 'c_opt_p2_2_2', name: 'Green Revolution — technology, spread, impact, second green revolution' },
        { id: 'c_opt_p2_2_3', name: 'Agricultural finance — institutional credit, NABARD, Kisan Credit Card' }
      ]},
      { id: 'b_opt_p2_3', official: 'Industry — Industrial Policy, Small-Scale Industries, Industrial Finance and Foreign Trade', label: 'Industry & Trade Policy', chunks: [
        { id: 'c_opt_p2_3_1', name: 'Industrial policy evolution — IPR 1956, 1991 reforms, Make in India' },
        { id: 'c_opt_p2_3_2', name: 'MSME sector — importance, problems, policy support' },
        { id: 'c_opt_p2_3_3', name: 'Foreign trade policy — export promotion, import substitution, FTAs' }
      ]},
      { id: 'b_opt_p2_4', official: 'Economic Reforms since 1991 — Liberalisation, Privatisation, Globalisation', label: 'Economic Reforms 1991 onwards', chunks: [
        { id: 'c_opt_p2_4_1', name: '1991 crisis & reforms — BoP crisis, IMF conditionalities, LPG' },
        { id: 'c_opt_p2_4_2', name: 'Financial sector reforms — banking, capital markets, insurance' },
        { id: 'c_opt_p2_4_3', name: 'Second generation reforms — labour, land, power sector' }
      ]},
      { id: 'b_opt_p2_5', official: 'Money and Banking — RBI, Commercial Banks, Monetary Policy', label: 'Money, Banking & Monetary Policy', chunks: [
        { id: 'c_opt_p2_5_1', name: 'RBI — functions, instruments, monetary policy framework, MPC' },
        { id: 'c_opt_p2_5_2', name: 'Commercial banking — NPA crisis, IBC, bank recapitalisation' },
        { id: 'c_opt_p2_5_3', name: 'Financial inclusion — Jan Dhan, payment banks, digital payments' }
      ]},
      { id: 'b_opt_p2_6', official: 'Public Finance in India — Union Budget, Fiscal Federalism, Taxation', label: 'Public Finance in India', chunks: [
        { id: 'c_opt_p2_6_1', name: 'Union Budget — structure, fiscal deficit trends, expenditure composition' },
        { id: 'c_opt_p2_6_2', name: 'Fiscal federalism — Finance Commission, GST, centre-state relations' },
        { id: 'c_opt_p2_6_3', name: 'Taxation reforms — direct tax code, GST implementation, compliance' }
      ]},
      { id: 'b_opt_p2_7', official: 'Poverty, Unemployment and Regional Imbalances and Environmental Issues in India', label: 'Poverty, Unemployment & Regional Issues', chunks: [
        { id: 'c_opt_p2_7_1', name: 'Poverty trends — measurement changes, state-wise variation, recent data' },
        { id: 'c_opt_p2_7_2', name: 'Unemployment — types, measurement (PLFS), structural unemployment' },
        { id: 'c_opt_p2_7_3', name: 'Regional imbalances — inter-state disparities, backward districts' },
        { id: 'c_opt_p2_7_4', name: 'Environmental economics — externalities, green GDP, SDGs' }
      ]}
    ]}
  }
};
