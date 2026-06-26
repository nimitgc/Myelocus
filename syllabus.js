// UPSC Civil Services Mains — Official Syllabus
// Language taken verbatim from official UPSC notification
// User additions stored separately per subject via localStorage

const SYLLABUS = {
  gs1: {
    label: 'GS 1', full: 'Indian Heritage and Culture, History and Geography of the World and Society', color: '#6366f1',
    subjects: [
      { name: 'Art & Culture', topics: [
        'Indian Culture — salient aspects of Art Forms, Literature and Architecture from ancient to modern times'
      ], additions: [] },
      { name: 'Modern Indian History', topics: [
        'Modern Indian History from about the middle of the eighteenth century until the present — significant events, personalities, issues',
        'The Freedom Struggle — its various stages and important contributors/contributions from different parts of the country',
        'Post-independence consolidation and reorganization within the country'
      ], additions: [] },
      { name: 'World History', topics: [
        'History of the World — events from 18th century: Industrial Revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies like Communism, Capitalism, Socialism — their forms and effect on the society'
      ], additions: [] },
      { name: 'Indian Society', topics: [
        'Salient features of Indian Society, Diversity of India',
        'Role of Women and Women\'s Organization, Population and Associated Issues, Poverty and Developmental issues, Urbanization — their problems and remedies',
        'Effects of Globalization on Indian society',
        'Social Empowerment, Communalism, Regionalism & Secularism'
      ], additions: [] },
      { name: 'Geography', topics: [
        'Salient features of World\'s Physical Geography',
        'Distribution of Key Natural Resources across the world — factors responsible for location of primary, secondary, and tertiary sector industries',
        'Important Geophysical Phenomena — earthquakes, Tsunami, Volcanic activity, cyclone; geographical features and their location; changes in critical geographical features and effects of such changes'
      ], additions: [] }
    ]
  },
  gs2: {
    label: 'GS 2', full: 'Governance, Constitution, Polity, Social Justice and International Relations', color: '#22c55e',
    subjects: [
      { name: 'Indian Constitution & Polity', topics: [
        'Indian Constitution — Historical Underpinnings, Evolution, Features, Amendments, Significant Provisions and Basic Structure',
        'Functions and Responsibilities of the Union and the States, Issues and Challenges Pertaining to the Federal Structure, Devolution of Powers and Finances up to Local Levels and Challenges Therein',
        'Separation of Powers between various organs, Dispute Redressal Mechanisms and Institutions',
        'Comparison of the Indian Constitutional Scheme with that of Other Countries',
        'Parliament and State Legislatures — Structure, Functioning, Conduct of Business, Powers & Privileges and Issues Arising out of these',
        'Structure, Organization and Functioning of the Executive and the Judiciary — Ministries and Departments of the Government; Pressure Groups and Formal/Informal Associations and their Role in the Polity',
        'Salient Features of the Representation of People\'s Act',
        'Appointment to various Constitutional Posts, Powers, Functions and Responsibilities of various Constitutional Bodies',
        'Statutory, Regulatory and various Quasi-judicial Bodies'
      ], additions: [] },
      { name: 'Governance', topics: [
        'Government Policies and Interventions for Development in various sectors and Issues arising out of their Design and Implementation',
        'Development Processes and the Development Industry — Role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders',
        'Welfare Schemes for Vulnerable Sections of the population by the Centre and States and the Performance of these Schemes; Mechanisms, Laws, Institutions and Bodies constituted for the Protection and Betterment of these Vulnerable Sections',
        'Issues relating to development and management of Social Sector or Services relating to Health, Education, Human Resources',
        'Issues relating to Poverty and Hunger',
        'Important Aspects of Governance, Transparency and Accountability, e-Governance — applications, models, successes, limitations, and potential; Citizens Charters, Transparency & Accountability and institutional and other measures',
        'Role of Civil Services in a Democracy'
      ], additions: [] },
      { name: 'Social Justice', topics: [
        'Welfare Schemes for Vulnerable Sections of the population by the Centre and States — Performance of these Schemes',
        'Issues relating to development and management of Social Sector or Services relating to Health, Education, Human Resources',
        'Issues relating to Poverty and Hunger'
      ], additions: [] },
      { name: 'International Relations', topics: [
        'India and its Neighbourhood — Relations',
        'Bilateral, Regional and Global Groupings and Agreements involving India and/or affecting India\'s interests',
        'Effect of Policies and Politics of Developed and Developing Countries on India\'s interests, Indian Diaspora',
        'Important International Institutions, agencies and fora — their Structure, Mandate'
      ], additions: [] }
    ]
  },
  gs3: {
    label: 'GS 3', full: 'Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management', color: '#f59e0b',
    subjects: [
      { name: 'Indian Economy', topics: [
        'Indian Economy and issues relating to Planning, Mobilization of Resources, Growth, Development and Employment',
        'Inclusive Growth and issues arising from it',
        'Government Budgeting',
        'Major crops — cropping patterns in various parts of the country, different types of irrigation and irrigation systems, storage, transport and marketing of agricultural produce and issues and related constraints; e-technology in the aid of farmers',
        'Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System — objectives, functioning, limitations, revamping; issues of buffer stocks and food security; Technology missions; economics of animal-rearing',
        'Food processing and related industries in India — scope and significance, location, upstream and downstream requirements, supply chain management',
        'Land reforms in India',
        'Effects of Liberalization on the Economy, changes in industrial policy and their effects on industrial growth',
        'Infrastructure — Energy, Ports, Roads, Airports, Railways etc.',
        'Investment models'
      ], additions: [] },
      { name: 'Science & Technology', topics: [
        'Science and Technology — developments and their applications and effects in everyday life',
        'Achievements of Indians in Science & Technology; indigenization of technology and developing new technology',
        'Awareness in the fields of IT, Space, Computers, Robotics, Nano-technology, Bio-technology and issues relating to Intellectual Property Rights'
      ], additions: [] },
      { name: 'Environment & Ecology', topics: [
        'Conservation, Environmental Pollution and Degradation, Environmental Impact Assessment',
        'Disaster and Disaster Management'
      ], additions: [] },
      { name: 'Internal Security', topics: [
        'Linkages between development and spread of extremism',
        'Role of external state and non-state actors in creating challenges to internal security',
        'Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security; money-laundering and its prevention',
        'Security challenges and their management in border areas — linkages of organized crime with terrorism',
        'Various Security forces and agencies and their mandate'
      ], additions: [] }
    ]
  },
  gs4: {
    label: 'GS 4', full: 'Ethics, Integrity and Aptitude', color: '#a78bfa',
    subjects: [
      { name: 'Ethics & Human Interface', topics: [
        'Ethics and Human Interface — Essence, determinants and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships',
        'Human Values — lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions in inculcating values',
        'Attitude — content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion',
        'Aptitude and foundational values for Civil Service — integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker sections',
        'Emotional Intelligence — concepts, and their utilities and application in administration and governance',
        'Contributions of moral thinkers and philosophers from India and world'
      ], additions: [] },
      { name: 'Integrity & Governance', topics: [
        'Public/Civil service values and Ethics in Public administration — Status and problems; ethical concerns and dilemmas in government and private institutions; laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; strengthening of ethical and moral values in governance; ethical issues in international relations and funding; corporate governance',
        'Probity in Governance — Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government; Right to Information; Codes of Ethics, Codes of Conduct, Citizen\'s Charter, Work Culture, Quality of service delivery, Utilization of public funds, challenges of corruption',
        'Case Studies on above issues'
      ], additions: [] }
    ]
  },
  prelims: {
    label: 'Prelims', full: 'Civil Services Preliminary Examination', color: '#f43f5e',
    subjects: [
      { name: 'General Studies Paper 1', topics: [
        'Current events of national and international importance',
        'History of India and Indian National Movement',
        'Indian and World Geography — Physical, Social, Economic Geography of India and the World',
        'Indian Polity and Governance — Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues etc.',
        'Economic and Social Development — Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives etc.',
        'General issues on Environmental Ecology, Biodiversity and Climate Change — that do not require subject specialization',
        'General Science'
      ], additions: [] },
      { name: 'General Studies Paper 2 (CSAT)', topics: [
        'Comprehension',
        'Interpersonal skills including communication skills',
        'Logical reasoning and analytical ability',
        'Decision-making and problem-solving',
        'General mental ability',
        'Basic numeracy — numbers and their relations, orders of magnitude etc. (Class X level)',
        'Data interpretation — charts, graphs, tables, data sufficiency etc. (Class X level)'
      ], additions: [] }
    ]
  },
  optional: {
    label: 'Optional', full: 'Economics (Optional Subject)', color: '#06b6d4',
    subjects: [
      { name: 'Economics Paper 1 — Advanced Economic Theory', topics: [
        'Micro-Economic Analysis — Demand and Supply, Theory of Consumer Behaviour, Production and Cost, Market Structure and Pricing',
        'Macro-Economic Analysis — National Income, Employment, Money and Banking, Inflation',
        'International Economics — Theories of Trade, Balance of Payments, Exchange Rate',
        'Growth and Development — Theories of Growth, Indicators of Development, Poverty and Inequality',
        'Public Finance — Government Revenue and Expenditure, Fiscal Policy, Public Debt'
      ], additions: [] },
      { name: 'Economics Paper 2 — Indian Economic Problems', topics: [
        'Evolution of the Indian Economy — Pre and Post-Independence',
        'Economic Planning in India',
        'Agriculture — Land reforms, Green Revolution, Agricultural Finance and Marketing',
        'Industry — Industrial Policy, Small-Scale Industries, Industrial Finance',
        'Foreign Trade — Trade Policy, Balance of Payments, External Debt',
        'Economic Reforms since 1991 — Liberalisation, Privatisation, Globalisation',
        'Money and Banking — RBI, Commercial Banks, Monetary Policy',
        'Public Finance in India — Union Budget, Fiscal Federalism, Taxation',
        'Poverty, Unemployment and Regional Imbalances',
        'Environmental Issues in India'
      ], additions: [] }
    ]
  }
};

const PAPER_ORDER = ['gs1', 'gs2', 'gs3', 'gs4', 'prelims', 'optional'];

const PHASES = {
  2027: [
    { name: 'Foundation', tag: 'Phase 1', start: '2026-06-01', end: '2026-12-31', color: '#6366f1', weekly: 12, daily: 3,
      goal: 'First pass of entire syllabus. Every topic studied at least once. SRS begins.',
      neuro: 'Encoding phase. New neural pathways form. Breadth before depth — do not skip topics.' },
    { name: 'Deepening', tag: 'Phase 2', start: '2027-01-01', end: '2027-03-31', color: '#22c55e', weekly: 8, daily: 3,
      goal: 'Revisit weak topics. Answer writing begins. Prelims MCQ drilling starts.',
      neuro: 'Consolidation phase. Myelin thickens on frequently used pathways. Hard topics need more repetitions.' },
    { name: 'Integration', tag: 'Phase 3', start: '2027-04-01', end: '2027-04-30', color: '#f59e0b', weekly: 6, daily: 3.5,
      goal: 'Full syllabus revision. Connect topics across papers. Mock tests begin.',
      neuro: 'Interleaving phase. Mixing subjects builds flexible retrieval — better than blocked practice.' },
    { name: 'Prelims Sprint', tag: 'Phase 4', start: '2027-05-01', end: '2027-05-25', color: '#f43f5e', weekly: 4, daily: 4,
      goal: 'Prelims-only. MCQ intensive. Current affairs final revision. Full mocks daily.',
      neuro: 'Retrieval practice phase. Testing yourself is more effective than re-reading.' }
  ],
  2028: [
    { name: 'Foundation', tag: 'Phase 1', start: '2026-06-01', end: '2027-06-30', color: '#6366f1', weekly: 8, daily: 2.5,
      goal: 'Thorough first pass. Deeper understanding per topic. More time per subject.',
      neuro: 'Extended encoding. Slower pace allows deeper semantic processing and stronger initial memory traces.' },
    { name: 'Deepening', tag: 'Phase 2', start: '2027-07-01', end: '2028-02-28', color: '#22c55e', weekly: 6, daily: 3,
      goal: 'Deep revision cycles. Answer writing. Optional mastery. Mock test series.',
      neuro: 'Deep consolidation. Spaced repetition at longer intervals builds near-permanent retention.' },
    { name: 'Integration', tag: 'Phase 3', start: '2028-03-01', end: '2028-04-30', color: '#f59e0b', weekly: 8, daily: 3.5,
      goal: 'Full integrated revision. Connect current affairs to static syllabus.',
      neuro: 'Schema building phase. Connect disparate knowledge into unified frameworks for faster retrieval.' },
    { name: 'Prelims Sprint', tag: 'Phase 4', start: '2028-05-01', end: '2028-05-25', color: '#f43f5e', weekly: 4, daily: 4,
      goal: 'Prelims MCQ intensive. Daily mocks. Current affairs final pass.',
      neuro: 'Peak retrieval phase. High-frequency testing maximises Prelims performance.' }
  ]
};
