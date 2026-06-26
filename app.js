// ─── HELPERS ──────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function addDays(d, n) { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0]; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
function daysUntil(d) { return daysBetween(todayStr(), d); }
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function pyqColor(val) {
  const n = parseInt(val);
  if (!n || n === 0) return 'var(--bg4)';
  if (n < 30) return '#ef4444';
  if (n < 60) return '#f59e0b';
  if (n < 85) return '#86efac';
  return '#22c55e';
}

// ─── SRS ENGINE — SM2 4-point scale ───────────────────────────────────────────
const SRS = {
  newRecord() {
    return {
      interval: 0, easiness: 2.5, repetitions: 0,
      nextReview: null, lastScore: null,
      firstStudied: null, lastStudied: null, studyCount: 0,
      ncert: '', ncertConf: '',
      refBook: '', refSection: '',
      pyqSeen: '', pyqEval: '', pyqThirdParty: 'no',
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
    if (score === 1) {
      r.repetitions = 0; r.interval = 1;
      r.easiness = Math.max(1.3, r.easiness - 0.2);
    } else if (score === 2) {
      r.interval = r.repetitions === 0 ? 1 : r.repetitions === 1 ? 2 : Math.max(1, Math.round(r.interval * 1.3));
      r.repetitions += 1;
    } else if (score === 3) {
      r.interval = r.repetitions === 0 ? 1 : r.repetitions === 1 ? 3 : Math.round(r.interval * r.easiness);
      r.repetitions += 1;
    } else {
      r.interval = r.repetitions === 0 ? 2 : r.repetitions === 1 ? 5 : Math.round(r.interval * r.easiness * 1.2);
      r.easiness = Math.min(4.0, r.easiness + 0.1);
      r.repetitions += 1;
    }
    r.nextReview = addDays(todayStr(), r.interval);
    return r;
  },

  seedFromConf(conf) {
    const r = this.newRecord();
    r.firstStudied = todayStr();
    const map = { again: 1, hard: 2, good: 3, easy: 4 };
    return this.review(r, map[conf] || 3);
  },

  strength(rec) {
    if (!rec?.lastStudied || !rec?.nextReview) return 0;
    const dU = daysBetween(todayStr(), rec.nextReview);
    const total = rec.interval || 1;
    const pct = Math.max(0, Math.min(100, Math.round((dU / total) * 100)));
    if (rec.lastScore === 1) return Math.min(pct, 30);
    if (rec.lastScore === 2) return Math.min(pct, 60);
    return pct;
  },

  isDue(rec) { return !!rec?.nextReview && rec.nextReview <= todayStr(); },
  isNew(rec) { return !rec?.firstStudied; }
};

// ─── DATABASE ──────────────────────────────────────────────────────────────────
const DB = {
  data: {}, coaching: {},
  settings: { targetYear: 2027, theme: 'dark', dailyTarget: 6, streak: 0, lastActiveDate: null },
  activity: {},

  load() {
    try {
      const raw = localStorage.getItem('myelocus_v3');
      if (raw) {
        const p = JSON.parse(raw);
        this.data = p.data || {};
        this.coaching = p.coaching || {};
        this.settings = { ...this.settings, ...(p.settings || {}) };
        this.activity = p.activity || {};
      }
    } catch(e) {}
    this.updateStreak();
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
        settings: this.settings, activity: this.activity
      }));
    } catch(e) {}
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
    if (this.activity[today]) {
      if (this.settings.lastActiveDate === yesterday) {
        this.settings.streak = (this.settings.streak || 0) + 1;
      } else if (!this.settings.lastActiveDate || this.settings.lastActiveDate < yesterday) {
        this.settings.streak = 1;
      }
      this.settings.lastActiveDate = today;
    }
  },

  getCoaching(paper, name) {
    return (this.coaching[paper] || {})[name] || { academy: '', total: 0, completed: 0 };
  },
  setCoaching(paper, name, d) {
    if (!this.coaching[paper]) this.coaching[paper] = {};
    this.coaching[paper][name] = d; this.save();
  },

  export() {
    return JSON.stringify({ data: this.data, coaching: this.coaching, settings: this.settings, activity: this.activity, exportedAt: new Date().toISOString() }, null, 2);
  },
  import(json) {
    const p = JSON.parse(json);
    this.data = p.data || {}; this.coaching = p.coaching || {};
    this.settings = { ...this.settings, ...(p.settings || {}) };
    this.activity = p.activity || {}; this.save();
  }
};

// ─── ADDITIONS ────────────────────────────────────────────────────────────────
const Additions = {
  load() {
    try {
      const raw = localStorage.getItem('myelocus_additions');
      if (!raw) return;
      const d = JSON.parse(raw);
      Object.entries(d).forEach(([k, topics]) => {
        const [paper, si] = k.split('_');
        const sIdx = parseInt(si);
        if (SYLLABUS[paper]?.subjects[sIdx]) SYLLABUS[paper].subjects[sIdx].additions = topics;
      });
    } catch(e) {}
  },
  add(paper, si, topic) {
    if (!SYLLABUS[paper].subjects[si].additions) SYLLABUS[paper].subjects[si].additions = [];
    SYLLABUS[paper].subjects[si].additions.push(topic);
    try {
      const raw = JSON.parse(localStorage.getItem('myelocus_additions') || '{}');
      const k = `${paper}_${si}`;
      if (!raw[k]) raw[k] = [];
      raw[k].push(topic);
      localStorage.setItem('myelocus_additions', JSON.stringify(raw));
    } catch(e) {}
  }
};

// ─── QUEUE ENGINE ─────────────────────────────────────────────────────────────
const Queue = {
  build(target) {
    const due = [], newT = [];
    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].subjects.forEach((subj, si) => {
        const all = [...subj.topics, ...(subj.additions || [])];
        all.forEach((topic, ti) => {
          const rec = DB.getRecord(paper, si, ti);
          const item = { paper, si, ti, topic, rec, isAddition: ti >= subj.topics.length };
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
      if (keys.every(k2 => !groups[k2]?.length)) break;
    }
    return result;
  },

  stats() {
    let total = 0, studied = 0, due = 0, overdue = 0, strong = 0;
    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].subjects.forEach((subj, si) => {
        const all = [...subj.topics, ...(subj.additions || [])];
        all.forEach((_, ti) => {
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

// ─── PLAN ENGINE ──────────────────────────────────────────────────────────────
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
    const status = buffer > 90 ? 'on-track' : buffer > 30 ? 'watch' : buffer > 0 ? 'urgent' : 'critical';
    const msg = buffer > 90 ? `${buffer} buffer days. Good pace.`
      : buffer > 30 ? `${buffer} buffer days. Maintain pace.`
      : buffer > 0 ? `Only ${buffer} buffer days. Increase daily topics.`
      : `Behind by ${Math.abs(buffer)} days. Need ${Math.ceil(stats.unseen / Math.max(daysLeft, 1))} topics/day.`;
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
      [...s.topics, ...(s.additions || [])].forEach((_, ti) => {
        total++;
        if (DB.getRecord(paper, si, ti)?.firstStudied) done++;
      });
    });
    return total ? Math.round(done / total * 100) : 0;
  },
  paperStrength(paper) {
    let total = 0, sum = 0;
    SYLLABUS[paper].subjects.forEach((s, si) => {
      [...s.topics, ...(s.additions || [])].forEach((_, ti) => {
        total++; sum += SRS.strength(DB.getRecord(paper, si, ti));
      });
    });
    return total ? Math.round(sum / total) : 0;
  },
  gapScore(paper) {
    let total = 0, gap = 0;
    SYLLABUS[paper].subjects.forEach((s, si) => {
      [...s.topics, ...(s.additions || [])].forEach((_, ti) => {
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
