// ─── SRS ENGINE (SM-2, 4-point scale) ────────────────────────────────────────
const SRS = {
  newRecord() {
    return {
      interval: 0, easiness: 2.5, repetitions: 0,
      nextReview: null, lastScore: null,
      firstStudied: null, lastStudied: null,
      studyCount: 0, isAddition: false,
      // Sources
      ncert: false, ncertConf: null,
      refBook: '', refSection: '',
      pyqSeen: '', pyqEval: '', pyqThirdParty: false,
      notes: ''
    };
  },

  // score: 1=Again, 2=Hard, 3=Good, 4=Easy
  review(rec, score) {
    const r = { ...rec };
    r.lastScore = score;
    r.lastStudied = todayStr();
    r.studyCount = (r.studyCount || 0) + 1;
    if (!r.firstStudied) r.firstStudied = todayStr();

    if (score === 1) {           // Again — reset
      r.repetitions = 0;
      r.interval = 1;
      r.easiness = Math.max(1.3, r.easiness - 0.2);
    } else if (score === 2) {   // Hard — short growth
      if (r.repetitions === 0) r.interval = 1;
      else if (r.repetitions === 1) r.interval = 2;
      else r.interval = Math.max(1, Math.round(r.interval * 1.3));
      r.repetitions += 1;
    } else if (score === 3) {   // Good — normal growth
      if (r.repetitions === 0) r.interval = 1;
      else if (r.repetitions === 1) r.interval = 3;
      else r.interval = Math.round(r.interval * r.easiness);
      r.repetitions += 1;
    } else {                     // Easy — accelerated
      if (r.repetitions === 0) r.interval = 2;
      else if (r.repetitions === 1) r.interval = 5;
      else r.interval = Math.round(r.interval * r.easiness * 1.2);
      r.easiness = Math.min(4.0, r.easiness + 0.1);
      r.repetitions += 1;
    }
    r.nextReview = addDays(todayStr(), r.interval);
    return r;
  },

  // Seed from bulk onboarding confidence
  seedFromConf(conf) {
    const r = this.newRecord();
    r.firstStudied = todayStr();
    r.lastStudied = todayStr();
    const map = { again: 1, hard: 2, good: 3, easy: 4 };
    const score = map[conf] || 3;
    return this.review(r, score);
  },

  strength(rec) {
    if (!rec?.lastStudied) return 0;
    if (!rec?.nextReview) return 0;
    const daysUntil = daysBetween(todayStr(), rec.nextReview);
    const total = rec.interval || 1;
    const pct = Math.max(0, Math.min(100, Math.round((daysUntil / total) * 100)));
    if (rec.lastScore === 1) return Math.min(pct, 30);
    if (rec.lastScore === 2) return Math.min(pct, 60);
    return pct;
  },

  isDue(rec) {
    if (!rec?.nextReview) return false;
    return rec.nextReview <= todayStr();
  },

  isNew(rec) { return !rec?.firstStudied; }
};

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function addDays(d, n) { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0]; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
function daysUntil(d) { return daysBetween(todayStr(), d); }
function fmtDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

// ─── DATABASE ─────────────────────────────────────────────────────────────────
const DB = {
  data: {}, coaching: {}, settings: {
    targetYear: 2027, theme: 'dark', dailyTarget: 6,
    streak: 0, lastActiveDate: null
  },
  activity: {},
  savedQueue: null, savedQueueDate: null, savedQueueIndex: 0,

  load() {
    try {
      const raw = localStorage.getItem('myelocus_v3');
      if (raw) {
        const p = JSON.parse(raw);
        this.data = p.data || {};
        this.coaching = p.coaching || {};
        this.settings = { ...this.settings, ...(p.settings || {}) };
        this.activity = p.activity || {};
        this.savedQueue = p.savedQueue || null;
        this.savedQueueDate = p.savedQueueDate || null;
        this.savedQueueIndex = p.savedQueueIndex || 0;
      }
    } catch(e) { console.error(e); }
    this.updateStreak();
    // Init coaching from syllabus if empty
    if (!Object.keys(this.coaching).length) this.initCoaching();
  },

  initCoaching() {
    PAPER_ORDER.forEach(p => {
      this.coaching[p] = {};
      SYLLABUS[p].subjects.forEach(s => {
        this.coaching[p][s.name] = { academy: '', total: 0, completed: 0 };
      });
    });
  },

  save() {
    try {
      localStorage.setItem('myelocus_v3', JSON.stringify({
        data: this.data, coaching: this.coaching,
        settings: this.settings, activity: this.activity,
        savedQueue: this.savedQueue, savedQueueDate: this.savedQueueDate,
        savedQueueIndex: this.savedQueueIndex
      }));
    } catch(e) { console.error(e); }
  },

  key(paper, si, ti) { return `${paper}_${si}_${ti}`; },
  getRecord(paper, si, ti) { return this.data[this.key(paper, si, ti)] || null; },
  setRecord(paper, si, ti, rec) {
    this.data[this.key(paper, si, ti)] = rec;
    const today = todayStr();
    this.activity[today] = (this.activity[today] || 0) + 1;
    this.updateStreak();
    this.save();
  },

  updateStreak() {
    const today = todayStr();
    const yesterday = addDays(today, -1);
    if (this.settings.lastActiveDate === today) return;
    if (this.activity[today]) {
      if (this.settings.lastActiveDate === yesterday) {
        this.settings.streak = (this.settings.streak || 0) + 1;
      } else if (!this.settings.lastActiveDate || this.settings.lastActiveDate < yesterday) {
        this.settings.streak = 1;
      }
      this.settings.lastActiveDate = today;
    }
  },

  getCoaching(paper, subjectName) {
    return (this.coaching[paper] || {})[subjectName] || { academy: '', total: 0, completed: 0 };
  },

  setCoaching(paper, subjectName, data) {
    if (!this.coaching[paper]) this.coaching[paper] = {};
    this.coaching[paper][subjectName] = data;
    this.save();
  },

  saveQueueState(queue, index) {
    this.savedQueue = queue;
    this.savedQueueDate = todayStr();
    this.savedQueueIndex = index;
    this.save();
  },

  export() {
    return JSON.stringify({ data: this.data, coaching: this.coaching, settings: this.settings, activity: this.activity, exportedAt: new Date().toISOString() }, null, 2);
  },

  import(json) {
    const p = JSON.parse(json);
    this.data = p.data || {};
    this.coaching = p.coaching || {};
    this.settings = { ...this.settings, ...(p.settings || {}) };
    this.activity = p.activity || {};
    this.save();
  }
};

// ─── QUEUE ENGINE ─────────────────────────────────────────────────────────────
const Queue = {
  build(target) {
    const due = [], newT = [];
    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].subjects.forEach((subj, si) => {
        // Official topics
        subj.topics.forEach((topic, ti) => {
          const rec = DB.getRecord(paper, si, ti);
          const item = { paper, si, ti, topic, rec, isAddition: false };
          if (SRS.isDue(rec)) due.push({ ...item, type: 'review' });
          else if (SRS.isNew(rec)) newT.push({ ...item, type: 'new' });
        });
        // User additions
        (subj.additions || []).forEach((topic, ai) => {
          const ti = subj.topics.length + ai;
          const rec = DB.getRecord(paper, si, ti);
          const item = { paper, si, ti, topic, rec, isAddition: true };
          if (SRS.isDue(rec)) due.push({ ...item, type: 'review' });
          else if (SRS.isNew(rec)) newT.push({ ...item, type: 'new' });
        });
      });
    });
    due.sort((a, b) => (a.rec?.nextReview || '2000').localeCompare(b.rec?.nextReview || '2000'));
    const combined = [...due.slice(0, target), ...newT.slice(0, Math.max(0, target - due.length))];
    return this.interleave(combined).slice(0, target);
  },

  interleave(items) {
    const groups = {};
    items.forEach(item => { if (!groups[item.paper]) groups[item.paper] = []; groups[item.paper].push(item); });
    const result = [], keys = Object.keys(groups);
    let i = 0;
    while (result.length < items.length) {
      const k = keys[i % keys.length];
      if (groups[k]?.length > 0) result.push(groups[k].shift());
      i++;
      if (keys.every(k => !groups[k]?.length)) break;
    }
    return result;
  },

  stats() {
    let total = 0, studied = 0, due = 0, overdue = 0, strong = 0;
    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].subjects.forEach((subj, si) => {
        const allTopics = [...subj.topics, ...(subj.additions || [])];
        allTopics.forEach((_, ti) => {
          total++;
          const rec = DB.getRecord(paper, si, ti);
          if (rec?.firstStudied) studied++;
          if (rec?.nextReview) {
            if (rec.nextReview <= todayStr()) due++;
            if (rec.nextReview < todayStr()) overdue++;
            if (SRS.strength(rec) > 70) strong++;
          }
        });
      });
    });
    return { total, studied, due, overdue, strong, unseen: total - studied };
  }
};

// ─── BATTLE PLAN ──────────────────────────────────────────────────────────────
const PHASES = {
  2027: [
    { name: 'Foundation', tag: 'Phase 1', start: '2026-06-01', end: '2026-12-31', color: '#6366f1',
      goal: 'First pass of entire syllabus. Every topic studied at least once. SRS begins.',
      weekly: 12, daily: 3,
      neuro: 'Encoding phase. New neural pathways form. Breadth before depth.' },
    { name: 'Deepening', tag: 'Phase 2', start: '2027-01-01', end: '2027-03-31', color: '#22c55e',
      goal: 'Revisit weak topics. Answer writing begins. Prelims MCQ drilling starts.',
      weekly: 8, daily: 3,
      neuro: 'Consolidation. Myelin thickens on frequently used pathways. Hard topics need more repetitions.' },
    { name: 'Integration', tag: 'Phase 3', start: '2027-04-01', end: '2027-04-30', color: '#f59e0b',
      goal: 'Full syllabus revision. Connect topics across papers. Mock tests begin.',
      weekly: 6, daily: 3.5,
      neuro: 'Interleaving builds flexible retrieval — better than blocked practice even if harder.' },
    { name: 'Prelims Sprint', tag: 'Phase 4', start: '2027-05-01', end: '2027-05-25', color: '#f43f5e',
      goal: 'Prelims-only. MCQ intensive. Current affairs final revision. Full mocks daily.',
      weekly: 4, daily: 4,
      neuro: 'Retrieval practice phase. Testing yourself is more effective than re-reading.' }
  ],
  2028: [
    { name: 'Foundation', tag: 'Phase 1', start: '2026-06-01', end: '2027-06-30', color: '#6366f1',
      goal: 'Thorough first pass. Deeper understanding per topic. More time per subject.',
      weekly: 8, daily: 2.5,
      neuro: 'Extended encoding. Slower pace allows deeper semantic processing and stronger initial traces.' },
    { name: 'Deepening', tag: 'Phase 2', start: '2027-07-01', end: '2028-02-28', color: '#22c55e',
      goal: 'Deep revision cycles. Answer writing. Optional mastery. Mock test series.',
      weekly: 6, daily: 3,
      neuro: 'Deep consolidation. Spaced repetition at longer intervals builds near-permanent retention.' },
    { name: 'Integration', tag: 'Phase 3', start: '2028-03-01', end: '2028-04-30', color: '#f59e0b',
      goal: 'Full integrated revision. Connect current affairs to static syllabus.',
      weekly: 8, daily: 3.5,
      neuro: 'Schema building. Connect disparate knowledge into unified frameworks for faster retrieval.' },
    { name: 'Prelims Sprint', tag: 'Phase 4', start: '2028-05-01', end: '2028-05-25', color: '#f43f5e',
      goal: 'Prelims MCQ intensive. Daily mocks. Current affairs final pass.',
      weekly: 4, daily: 4,
      neuro: 'Peak retrieval phase. High-frequency testing maximises Prelims performance.' }
  ]
};

const Plan = {
  current(year) {
    const today = todayStr();
    const phases = PHASES[year] || PHASES[2027];
    return phases.find(p => today >= p.start && today <= p.end) || (today < phases[0].start ? phases[0] : phases[phases.length - 1]);
  },
  daysToExam(year) { return Math.max(0, daysUntil(year === 2028 ? '2028-05-25' : '2027-05-25')); },
  pace(year) {
    const stats = Queue.stats();
    const daysLeft = this.daysToExam(year);
    const target = DB.settings.dailyTarget || 6;
    const daysNeeded = stats.unseen > 0 ? Math.ceil(stats.unseen / target) : 0;
    const buffer = daysLeft - daysNeeded;
    let status = buffer > 90 ? 'on-track' : buffer > 30 ? 'watch' : buffer > 0 ? 'urgent' : 'critical';
    let msg = buffer > 90 ? `${buffer} buffer days. Good pace.`
      : buffer > 30 ? `${buffer} buffer days. Maintain pace.`
      : buffer > 0 ? `Only ${buffer} buffer days. Increase daily topics.`
      : `Behind by ${Math.abs(buffer)} days. Need ${Math.ceil(stats.unseen / Math.max(daysLeft,1))} topics/day.`;
    return { daysLeft, unseen: stats.unseen, daysNeeded, buffer, status, msg, target };
  },
  weekDone() {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const mondayStr = monday.toISOString().split('T')[0];
    return Object.entries(DB.activity).filter(([d]) => d >= mondayStr).reduce((s, [, v]) => s + v, 0);
  }
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
const Analytics = {
  paperCoverage(paper) {
    let total = 0, done = 0;
    SYLLABUS[paper].subjects.forEach((s, si) => {
      const all = [...s.topics, ...(s.additions || [])];
      all.forEach((_, ti) => { total++; if (DB.getRecord(paper, si, ti)?.firstStudied) done++; });
    });
    return total ? Math.round(done / total * 100) : 0;
  },
  paperStrength(paper) {
    let total = 0, sum = 0;
    SYLLABUS[paper].subjects.forEach((s, si) => {
      const all = [...s.topics, ...(s.additions || [])];
      all.forEach((_, ti) => { total++; sum += SRS.strength(DB.getRecord(paper, si, ti)); });
    });
    return total ? Math.round(sum / total) : 0;
  },
  gapScore(paper) {
    let total = 0, gap = 0;
    SYLLABUS[paper].subjects.forEach((s, si) => {
      const all = [...s.topics, ...(s.additions || [])];
      all.forEach((_, ti) => {
        total++;
        const rec = DB.getRecord(paper, si, ti);
        if (!rec?.firstStudied) gap++;
        else if (rec.lastScore === 1) gap += 0.8;
        else if (rec.lastScore === 2) gap += 0.5;
        else if (rec.lastScore === 3) gap += 0.2;
      });
    });
    return total ? Math.round(gap / total * 100) : 100;
  },
  activity90() {
    const out = [];
    for (let i = 89; i >= 0; i--) {
      const d = addDays(todayStr(), -i);
      out.push({ date: d, count: DB.activity[d] || 0 });
    }
    return out;
  }
};

// ─── PYQ COLOR ────────────────────────────────────────────────────────────────
function pyqColor(val) {
  const n = parseInt(val);
  if (!n || n === 0) return 'var(--bg4)';
  if (n < 30) return 'var(--red)';
  if (n < 60) return 'var(--amber)';
  if (n < 85) return '#86efac';
  return 'var(--green)';
}

// ─── ADDITIONS MANAGER ────────────────────────────────────────────────────────
const Additions = {
  add(paper, si, topic) {
    if (!SYLLABUS[paper].subjects[si].additions) SYLLABUS[paper].subjects[si].additions = [];
    SYLLABUS[paper].subjects[si].additions.push(topic);
    // Persist additions to localStorage
    const key = 'myelocus_additions';
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      const k = `${paper}_${si}`;
      if (!existing[k]) existing[k] = [];
      existing[k].push(topic);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch(e) {}
  },

  load() {
    try {
      const raw = localStorage.getItem('myelocus_additions');
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([k, topics]) => {
        const [paper, si] = k.split('_');
        const sIdx = parseInt(si);
        if (SYLLABUS[paper]?.subjects[sIdx]) {
          SYLLABUS[paper].subjects[sIdx].additions = topics;
        }
      });
    } catch(e) {}
  }
};
