// ─── SRS ENGINE (SM-2 simplified) ───────────────────────────────────────────

const SRS = {
  // Default record for a new topic
  newRecord() {
    return {
      interval: 0,       // days until next review
      easiness: 2.5,     // difficulty factor
      repetitions: 0,    // number of successful reviews
      nextReview: null,  // ISO date string
      lastScore: null,   // 1=hard, 2=okay, 3=easy
      firstStudied: null,
      lastStudied: null,
      notes: '',
      studyCount: 0
    };
  },

  // Update record after a review session
  // score: 1 (hard), 2 (okay), 3 (easy)
  review(record, score) {
    const r = { ...record };
    r.lastScore = score;
    r.lastStudied = todayStr();
    r.studyCount = (r.studyCount || 0) + 1;
    if (!r.firstStudied) r.firstStudied = todayStr();

    if (score === 1) {
      // Hard — reset, review tomorrow
      r.repetitions = 0;
      r.interval = 1;
      r.easiness = Math.max(1.3, r.easiness - 0.2);
    } else if (score === 2) {
      // Okay — moderate interval growth
      if (r.repetitions === 0) r.interval = 1;
      else if (r.repetitions === 1) r.interval = 3;
      else r.interval = Math.round(r.interval * 1.8);
      r.repetitions += 1;
    } else {
      // Easy — fast interval growth, easiness increases
      if (r.repetitions === 0) r.interval = 1;
      else if (r.repetitions === 1) r.interval = 4;
      else r.interval = Math.round(r.interval * r.easiness);
      r.easiness = Math.min(4.0, r.easiness + 0.1);
      r.repetitions += 1;
    }

    r.nextReview = addDays(todayStr(), r.interval);
    return r;
  },

  // Strength score 0-100 for display
  strength(record) {
    if (!record || !record.lastStudied) return 0;
    if (!record.nextReview) return 0;
    const daysUntil = daysBetween(todayStr(), record.nextReview);
    const totalInterval = record.interval || 1;
    const pct = Math.max(0, Math.min(100, Math.round((daysUntil / totalInterval) * 100)));
    if (record.lastScore === 1) return Math.min(pct, 40);
    if (record.lastScore === 2) return Math.min(pct, 70);
    return pct;
  },

  // Is topic due today or overdue?
  isDue(record) {
    if (!record || !record.nextReview) return false;
    return record.nextReview <= todayStr();
  },

  // Is topic new (never studied)?
  isNew(record) {
    return !record || !record.firstStudied;
  }
};

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function daysUntil(dateStr) {
  return daysBetween(todayStr(), dateStr);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── DATABASE ─────────────────────────────────────────────────────────────────

const DB = {
  data: {},
  settings: {
    targetYear: 2027,
    theme: 'dark',
    dailyTarget: 6,
    streak: 0,
    lastActiveDate: null,
    examDate2027: '2027-05-25',
    examDate2028: '2028-05-25'
  },
  activityLog: {},  // date -> count of topics reviewed

  load() {
    try {
      const raw = localStorage.getItem('myelocus_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = parsed.data || {};
        this.settings = { ...this.settings, ...(parsed.settings || {}) };
        this.activityLog = parsed.activityLog || {};
      }
    } catch(e) { console.error('DB load error', e); }
    this.updateStreak();
  },

  save() {
    try {
      localStorage.setItem('myelocus_v2', JSON.stringify({
        data: this.data,
        settings: this.settings,
        activityLog: this.activityLog
      }));
    } catch(e) { console.error('DB save error', e); }
  },

  key(paper, si, ti) { return `${paper}_${si}_${ti}`; },

  getRecord(paper, si, ti) {
    return this.data[this.key(paper, si, ti)] || null;
  },

  setRecord(paper, si, ti, record) {
    this.data[this.key(paper, si, ti)] = record;
    // Log activity
    const today = todayStr();
    this.activityLog[today] = (this.activityLog[today] || 0) + 1;
    this.updateStreak();
    this.save();
  },

  updateStreak() {
    const today = todayStr();
    const yesterday = addDays(today, -1);
    if (this.settings.lastActiveDate === today) return;
    if (this.settings.lastActiveDate === yesterday) {
      this.settings.streak = (this.settings.streak || 0) + 1;
    } else if (this.settings.lastActiveDate && this.settings.lastActiveDate < yesterday) {
      this.settings.streak = 0;
    }
    if (this.activityLog[today]) {
      this.settings.lastActiveDate = today;
    }
  },

  getSetting(key) { return this.settings[key]; },
  setSetting(key, val) { this.settings[key] = val; this.save(); },

  export() {
    return JSON.stringify({ data: this.data, settings: this.settings, activityLog: this.activityLog, exportedAt: new Date().toISOString() }, null, 2);
  },

  import(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    this.data = parsed.data || {};
    this.settings = { ...this.settings, ...(parsed.settings || {}) };
    this.activityLog = parsed.activityLog || {};
    this.save();
  }
};

// ─── QUEUE ENGINE ─────────────────────────────────────────────────────────────

const Queue = {
  // Build today's study queue
  build(targetCount) {
    const due = [];
    const newTopics = [];

    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].sections.forEach((sec, si) => {
        sec.topics.forEach((topic, ti) => {
          const rec = DB.getRecord(paper, si, ti);
          if (SRS.isDue(rec)) {
            due.push({ paper, si, ti, topic, rec, type: 'review' });
          } else if (SRS.isNew(rec)) {
            newTopics.push({ paper, si, ti, topic, rec, type: 'new' });
          }
        });
      });
    });

    // Sort due by most overdue first
    due.sort((a, b) => {
      const da = a.rec?.nextReview || '2000-01-01';
      const db2 = b.rec?.nextReview || '2000-01-01';
      return da.localeCompare(db2);
    });

    // Interleave: mix papers to avoid blocked practice
    const queue = this.interleave([...due.slice(0, targetCount), ...newTopics.slice(0, Math.max(0, targetCount - due.length))]);
    return queue.slice(0, targetCount);
  },

  // Interleave topics so same paper doesn't appear consecutively
  interleave(items) {
    const groups = {};
    items.forEach(item => {
      if (!groups[item.paper]) groups[item.paper] = [];
      groups[item.paper].push(item);
    });

    const result = [];
    const keys = Object.keys(groups);
    let i = 0;
    while (result.length < items.length) {
      const key = keys[i % keys.length];
      if (groups[key] && groups[key].length > 0) {
        result.push(groups[key].shift());
      }
      i++;
      if (keys.every(k => !groups[k] || groups[k].length === 0)) break;
    }
    return result;
  },

  // Count stats for display
  stats() {
    let total = 0, studied = 0, dueToday = 0, overdue = 0, strong = 0;
    PAPER_ORDER.forEach(paper => {
      SYLLABUS[paper].sections.forEach((sec, si) => {
        sec.topics.forEach((_, ti) => {
          total++;
          const rec = DB.getRecord(paper, si, ti);
          if (rec?.firstStudied) studied++;
          if (rec?.nextReview) {
            if (rec.nextReview <= todayStr()) dueToday++;
            if (rec.nextReview < todayStr()) overdue++;
            if (SRS.strength(rec) > 70) strong++;
          }
        });
      });
    });
    return { total, studied, dueToday, overdue, strong, unseen: total - studied };
  }
};

// ─── BATTLE PLAN ENGINE ───────────────────────────────────────────────────────

const Plan = {
  currentPhase(year) {
    const today = todayStr();
    const phases = PHASE_PLAN[year] || PHASE_PLAN[2027];
    for (const phase of phases) {
      if (today >= phase.start && today <= phase.end) return phase;
    }
    if (today < phases[0].start) return phases[0];
    return phases[phases.length - 1];
  },

  daysToExam(year) {
    const examDate = year === 2028 ? '2028-05-25' : '2027-05-25';
    return Math.max(0, daysUntil(examDate));
  },

  paceAnalysis(year) {
    const stats = Queue.stats();
    const daysLeft = this.daysToExam(year);
    const topicsLeft = stats.total - stats.studied;
    const dailyTarget = DB.getSetting('dailyTarget') || 6;

    // How many days needed at current target pace
    const daysNeeded = topicsLeft > 0 ? Math.ceil(topicsLeft / dailyTarget) : 0;

    // Buffer days (days left minus days needed)
    const buffer = daysLeft - daysNeeded;

    let status, message;
    if (buffer > 90) {
      status = 'on-track';
      message = `You have ${buffer} buffer days. Comfortable pace.`;
    } else if (buffer > 30) {
      status = 'watch';
      message = `${buffer} buffer days. Maintain current pace.`;
    } else if (buffer > 0) {
      status = 'urgent';
      message = `Only ${buffer} buffer days. Increase daily topics.`;
    } else {
      status = 'critical';
      message = `Behind schedule by ${Math.abs(buffer)} days. Increase to ${Math.ceil(topicsLeft / daysLeft)} topics/day.`;
    }

    return { daysLeft, topicsLeft, daysNeeded, buffer, status, message, dailyTarget };
  },

  weeklyTarget(year) {
    const phase = this.currentPhase(year);
    return phase ? phase.weeklyTopics : 6;
  },

  progressThisWeek() {
    let count = 0;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const mondayStr = monday.toISOString().split('T')[0];

    Object.entries(DB.activityLog).forEach(([date, cnt]) => {
      if (date >= mondayStr) count += cnt;
    });
    return count;
  }
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

const Analytics = {
  paperStrength(paper) {
    let total = 0, strengthSum = 0;
    SYLLABUS[paper].sections.forEach((sec, si) => {
      sec.topics.forEach((_, ti) => {
        total++;
        strengthSum += SRS.strength(DB.getRecord(paper, si, ti));
      });
    });
    return total ? Math.round(strengthSum / total) : 0;
  },

  paperCoverage(paper) {
    let total = 0, studied = 0;
    SYLLABUS[paper].sections.forEach((sec, si) => {
      sec.topics.forEach((_, ti) => {
        total++;
        if (DB.getRecord(paper, si, ti)?.firstStudied) studied++;
      });
    });
    return total ? Math.round(studied / total * 100) : 0;
  },

  activityLast90Days() {
    const result = [];
    for (let i = 89; i >= 0; i--) {
      const date = addDays(todayStr(), -i);
      result.push({ date, count: DB.activityLog[date] || 0 });
    }
    return result;
  },

  gapScore(paper) {
    let total = 0, gaps = 0;
    SYLLABUS[paper].sections.forEach((sec, si) => {
      sec.topics.forEach((_, ti) => {
        total++;
        const rec = DB.getRecord(paper, si, ti);
        if (!rec?.firstStudied) gaps++;
        else if (rec.lastScore === 1) gaps += 0.7;
        else if (rec.lastScore === 2) gaps += 0.3;
      });
    });
    return total ? Math.round((gaps / total) * 100) : 100;
  }
};
