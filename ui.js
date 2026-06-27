// ── UI CONTROLLER ─────────────────────────────────────────────────────────────
const UI = {
  currentPage: 'today',
  currentPaper: 'gs1',
  currentYear: 2027,
  selectedChunkId: null,
  expandedPapers: {},
  panelSplit: 55, // left panel %

  async init() {
    DB.load();
    await loadSyllabus();
    this.currentYear = DB.settings.targetYear || 2027;
    this.applyTheme();
    this.initSplitPane();
    this.updateHeader();
    this.updateNavPcts();

    // Restore or build queue
    if (!Queue.restore()) {
      Queue.build(DB.settings.dailyTarget || 6);
    }

    this.renderToday();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  },

  applyTheme() {
    const th = DB.settings.theme || 'dark';
    const pa = DB.settings.palette || 'cool';
    document.documentElement.setAttribute('data-theme', th);
    document.documentElement.setAttribute('data-palette', pa);
    document.getElementById('theme-icon').textContent = th === 'dark' ? '☀' : '☾';
  },

  // ── SPLIT PANE ──────────────────────────────────────────────────────────────
  initSplitPane() {
    const saved = localStorage.getItem('myelocus_split');
    this.panelSplit = saved ? parseFloat(saved) : 55;
    this.applySplit();

    const divider = document.getElementById('divider');
    if (!divider) return;
    let dragging = false, startX = 0, startSplit = 0;

    divider.addEventListener('mousedown', e => {
      dragging = true; startX = e.clientX; startSplit = this.panelSplit;
      divider.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const container = document.getElementById('main-area');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      this.panelSplit = Math.max(30, Math.min(75, pct));
      this.applySplit();
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      divider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem('myelocus_split', this.panelSplit);
    });
  },

  applySplit() {
    const lp = document.getElementById('left-pane');
    if (lp) lp.style.width = `${this.panelSplit}%`;
  },

  // ── NAVIGATION ──────────────────────────────────────────────────────────────
  go(page) {
    document.querySelectorAll('.page, .page-full').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.bni').forEach(n => n.classList.remove('active'));

    const pel = document.getElementById(`page-${page}`);
    if (pel) pel.classList.add('active');
    document.getElementById(`nav-${page}`)?.classList.add('active');
    document.getElementById(`bnav-${page}`)?.classList.add('active');

    // Show/hide split pane vs full width
    const mainArea = document.getElementById('main-area');
    const fullPages = ['pace','settings'];
    if (mainArea) {
      if (fullPages.includes(page)) {
        mainArea.style.display = 'none';
        document.getElementById(`page-${page}`).classList.add('active');
      } else {
        mainArea.style.display = 'flex';
      }
    }

    this.currentPage = page;
    const leftPane = document.getElementById('left-pane');
    if (leftPane) leftPane.scrollTop = 0;

    if (page === 'today') this.renderToday();
    else if (page === 'pace') this.renderPace();
    else if (page === 'settings') this.renderSettings();
  },

  goPaper(paperId) {
    this.currentPaper = paperId;
    document.querySelectorAll('.page, .page-full').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.bni').forEach(n => n.classList.remove('active'));

    const mainArea = document.getElementById('main-area');
    if (mainArea) mainArea.style.display = 'flex';

    document.getElementById('page-syllabus')?.classList.add('active');
    document.getElementById(`nav-${paperId}`)?.classList.add('active');
    document.getElementById('bnav-syllabus')?.classList.add('active');

    this.currentPage = 'syllabus';
    this.selectedChunkId = null;
    this.renderRightPanel();
    this.renderSyllabus();
  },

  updateHeader() {
    const year = this.currentYear;
    const pace = Plan.pace(year);
    const days = Plan.daysLeft(year);
    const streak = DB.settings.streak || 0;

    const cdown = document.getElementById('cdown-text');
    if (cdown) cdown.innerHTML = `<strong>${days}</strong> days to Prelims ${year}`;
    const pdot = document.getElementById('pace-dot');
    if (pdot) pdot.className = `pace-dot ${pace.status}`;
    const sch = document.getElementById('streak-chip');
    if (sch) sch.textContent = `🔥 ${streak} day${streak !== 1 ? 's' : ''}`;

    const due = Analytics.globalStats().due;
    const badge = document.getElementById('nav-due-badge');
    if (badge) { badge.textContent = due > 0 ? due : ''; badge.style.display = due > 0 ? '' : 'none'; }
  },

  updateNavPcts() {
    PAPER_ORDER.forEach(p => {
      const stats = Analytics.paperStats(p);
      const el = document.getElementById(`np-${p}`);
      if (el) el.textContent = stats.cov + '%';
    });
  },

  toggleTheme() {
    const cur = DB.settings.theme || 'dark';
    DB.settings.theme = cur === 'dark' ? 'light' : 'dark';
    DB.save(); this.applyTheme();
  },

  toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  },

  // ── TODAY ────────────────────────────────────────────────────────────────────
  renderToday() {
    const target = DB.settings.dailyTarget || 6;
    const total = Queue.current.length;
    const done = Queue.doneCount();
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    const circ = 2 * Math.PI * 18;
    const offset = circ - (pct / 100) * circ;
    const phase = Plan.currentPhase(this.currentYear);
    const pace = Plan.pace(this.currentYear);
    const wd = Plan.weekDone();
    const stats = Analytics.globalStats();
    const SC = ['','#f87171','#fbbf24','#3b82f6','#4ade80'];
    const SL = ['','Again','Hard','Good','Easy'];

    let qH = '';
    if (total === 0) {
      qH = `<div style="text-align:center;padding:40px 20px;color:var(--text3)">
        <div style="font-size:28px;margin-bottom:10px">◎</div>
        <div class="t-section" style="margin-bottom:6px">No chunks due today</div>
        <div class="t-meta">SRS schedule is clear. Browse the syllabus to study new chunks.</div>
      </div>`;
    } else {
      if (done >= total) {
        qH += `<div class="done-scr">
          <div class="done-icon">◎</div>
          <div class="done-t">Session complete</div>
          <div class="done-s">All ${done} chunks done. The pathways strengthen.</div>
          <div class="done-stats">
            <div class="ds"><div class="dsv" style="color:var(--accent)">${done}</div><div class="dsl">Today</div></div>
            <div class="ds"><div class="dsv" style="color:var(--c-amber)">🔥${DB.settings.streak||0}</div><div class="dsl">Streak</div></div>
            <div class="ds"><div class="dsv" style="color:var(--c-green)">${stats.strong}</div><div class="dsl">Strong</div></div>
          </div>
          <button class="btn btn-ghost" onclick="Queue.build(${target});UI.renderToday();">Load more chunks</button>
        </div>`;
      }

      Queue.current.forEach((item, idx) => {
        const st = Queue.cardStates[idx] || { done: false, score: null, open: false };
        const isNew = SRS.isNew(item.rec) && !st.done;
        const rec = DB.getRecord(item.chunk.id) || {};
        const paper = SYLLABUS[item.paperId];
        const gap2class = SRS.gapClass(rec.gap2Remaining);
        const gap3class = SRS.gapClass(rec.gap3Remaining);
        const bstyle = st.done ? 'done' : st.open ? 'open' : '';

        qH += `<div class="qcard ${bstyle}" id="qc${idx}">
          <div class="qcard-head" onclick="UI.toggleCard(${idx})">
            <div class="qnum" style="${st.done?'background:var(--c-green-bg);color:var(--c-green)':st.open?'background:var(--accent-bg);color:var(--accent)':''}">${st.done?'✓':idx+1}</div>
            <div class="qchunk">${item.chunk.name}${item.chunk.isUser?` <span style="font-size:10px;color:var(--c-cyan)">[+]</span>`:''}</div>
            <div class="gap-dots">
              <div class="gdot ${rec.gap1Done?'done':''}" title="Lecture/NCERT seen"></div>
              <div class="gdot ${gap2class}" title="PYQ seen"></div>
              <div class="gdot ${gap3class}" title="PYQ attempted"></div>
            </div>
            <span class="qpaper-badge" style="background:${paper.color}20;color:${paper.color}">${paper.label}</span>
            ${st.done && st.score ? `<span class="qscore-badge" style="color:${SC[st.score]}">${SL[st.score]}</span>` : `<span class="qtype-badge">${isNew?'New':'Review'}</span>`}
            <span class="qarr">${st.open?'▴':'▾'}</span>
          </div>

          ${st.open ? `<div class="qbody">

            ${isNew ? `<div class="study-prompt">
              <div class="study-msg">First time seeing this chunk. Go study it — coaching notes, NCERT, or any source. Come back when done.</div>
              <button class="study-btn" onclick="UI.markStudied(${idx})">✓ Done — I have studied this</button>
            </div>` : `<div class="recall-section">
              <div class="recall-label">Attempt to recall without notes — how well did you remember?</div>
              <div class="recall-btns">
                <button class="rbtn ag ${st.score===1?'sel':''}" onclick="UI.rateCard(${idx},1)">Again<span class="rsub">Blank</span></button>
                <button class="rbtn hd ${st.score===2?'sel':''}" onclick="UI.rateCard(${idx},2)">Hard<span class="rsub">Gaps</span></button>
                <button class="rbtn gd ${st.score===3?'sel':''}" onclick="UI.rateCard(${idx},3)">Good<span class="rsub">Effort</span></button>
                <button class="rbtn ez ${st.score===4?'sel':''}" onclick="UI.rateCard(${idx},4)">Easy<span class="rsub">Instant</span></button>
              </div>
            </div>`}

            <div class="activity-section">
              <div class="activity-label">Log today's activity on this chunk</div>
              <div class="activity-rows">
                ${[
                  ['lecture','Lecture'],
                  ['ncert','NCERT'],
                  ['pyq-seen','PYQ seen'],
                  ['pyq-attempted','PYQ attempted'],
                  ['reference','Reference/Internet']
                ].map(([key, label]) => `
                <div class="activity-row">
                  <label class="activity-check">
                    <input type="checkbox" id="act-${idx}-${key}" onchange="UI.toggleActMins(${idx},'${key}')">
                    <span class="alabel">${label}</span>
                  </label>
                  <div class="activity-mins" id="act-mins-${idx}-${key}" style="display:none">
                    <input class="mins-input" type="number" id="mins-${idx}-${key}" min="1" max="300" placeholder="0">
                    <span class="mins-label">min</span>
                  </div>
                </div>`).join('')}
              </div>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm" onclick="UI.saveActivity(${idx})">Save activity</button>
                <button class="btn btn-ghost btn-sm" onclick="UI.openChunkDetail('${item.chunk.id}')">Full detail →</button>
              </div>
            </div>

          </div>` : ''}
        </div>`;
      });
    }

    const leftContent = `
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:16px">
      <div class="t-page">Today</div>
      <div class="t-meta">${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
    </div>

    <div class="session-ring-wrap">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg3)" stroke-width="4"/>
        <circle cx="22" cy="22" r="18" fill="none" stroke="var(--accent)" stroke-width="4"
          stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 22 22)"
          style="transition:stroke-dashoffset 0.5s ease"/>
      </svg>
      <div class="ring-info">
        <h3>${done} / ${total} done</h3>
        <p>Interleaved · target ${target}</p>
      </div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="Queue.build(${target});UI.renderToday();">↺ Refresh</button>
    </div>
    ${qH}`;

    const rightContent = `<div class="today-side">
      <div class="scard">
        <div class="scard-t">Current phase</div>
        <div class="t-section" style="margin-bottom:4px">${phase?.name||'—'}</div>
        <div class="t-meta" style="color:var(--text2)">${phase?.goal||''}</div>
        <div class="phase-note">⚡ ${phase?.note||''}</div>
      </div>
      <div class="scard">
        <div class="scard-t">This week</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <span style="font-size:18px;font-weight:600">${wd}</span>
          <span class="t-meta">target: ${phase?.weekly||6}</span>
        </div>
        <div class="btrack"><div class="bfill" style="width:${Math.min(100,Math.round(wd/Math.max(phase?.weekly||6,1)*100))}%;background:var(--accent)"></div></div>
      </div>
      <div class="scard">
        <div class="scard-t">Pace</div>
        <div class="pace-row"><span class="lbl">Days to exam</span><span class="val">${pace.days}</span></div>
        <div class="pace-row"><span class="lbl">Unseen chunks</span><span class="val">${pace.unseen}</span></div>
        <div class="pace-row"><span class="lbl">Status</span><span class="val ${pace.status}">${pace.status.replace('-',' ')}</span></div>
        <div class="t-meta" style="margin-top:6px;font-style:italic">${pace.msg}</div>
      </div>
      <div class="scard">
        <div class="scard-t">Queue</div>
        <div style="display:flex;gap:12px">
          <div style="text-align:center"><div style="font-size:18px;font-weight:600;color:var(--c-red)">${stats.overdue}</div><div class="t-meta">overdue</div></div>
          <div style="text-align:center"><div style="font-size:18px;font-weight:600;color:var(--c-amber)">${Math.max(0,stats.due-stats.overdue)}</div><div class="t-meta">due</div></div>
          <div style="text-align:center"><div style="font-size:18px;font-weight:600;color:var(--c-green)">${stats.strong}</div><div class="t-meta">strong</div></div>
          <div style="text-align:center"><div style="font-size:18px;font-weight:600;color:var(--text3)">${stats.unseen}</div><div class="t-meta">unseen</div></div>
        </div>
      </div>
    </div>`;

    const lp = document.getElementById('today-left');
    const rp = document.getElementById('today-right');
    if (lp) lp.innerHTML = leftContent;
    if (rp) rp.innerHTML = rightContent;
  },

  toggleCard(idx) {
    Queue.toggleCard(idx);
    this.renderToday();
  },

  markStudied(idx) {
    Queue.markStudied(idx);
    this.updateHeader(); this.updateNavPcts(); this.renderToday();
    this.toast('Studied ✓');
  },

  rateCard(idx, score) {
    Queue.rateCard(idx, score);
    this.updateHeader(); this.updateNavPcts(); this.renderToday();
    const L = ['','Again — see you tomorrow','Hard — short interval','Good — interval grows','Easy — accelerated'];
    this.toast(L[score]);
  },

  toggleActMins(idx, key) {
    const cb = document.getElementById(`act-${idx}-${key}`);
    const mw = document.getElementById(`act-mins-${idx}-${key}`);
    if (mw) mw.style.display = cb?.checked ? 'flex' : 'none';
  },

  saveActivity(idx) {
    const activities = [];
    ['lecture','ncert','pyq-seen','pyq-attempted','reference'].forEach(key => {
      const cb = document.getElementById(`act-${idx}-${key}`);
      const mi = document.getElementById(`mins-${idx}-${key}`);
      if (cb?.checked && mi?.value) {
        activities.push({ medium: key, mins: parseInt(mi.value) || 0 });
      }
    });
    if (activities.length === 0) { this.toast('Nothing to save'); return; }
    Queue.logActivity(idx, activities);
    // Refresh queue item rec
    const item = Queue.current[idx];
    if (item) item.rec = DB.getRecord(item.chunk.id);
    this.updateHeader(); this.renderToday();
    this.toast(`Activity saved — ${activities.reduce((s,a) => s+a.mins, 0)} mins logged`);
  },

  // ── SYLLABUS ─────────────────────────────────────────────────────────────────
  renderSyllabus() {
    const paperId = this.currentPaper;
    const paper = SYLLABUS[paperId];
    const pStats = Analytics.paperStats(paperId);

    let h = `
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px">
      <div class="t-page">${paper.label}</div>
      <div class="t-meta">${paper.full}</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <div class="t-meta">${pStats.cov}% covered</div>
      <div class="btrack" style="flex:1;max-width:120px"><div class="bfill" style="width:${pStats.cov}%;background:${paper.color}"></div></div>
      <div class="t-meta">${fmtMins(pStats.totalMins)} invested</div>
    </div>
    <div class="paper-tabs">
      ${PAPER_ORDER.map(p => {
        const ps = Analytics.paperStats(p);
        return `<button class="ptab ${p===paperId?'active':''}" style="${p===paperId?'background:'+SYLLABUS[p].color+';border-color:'+SYLLABUS[p].color:''}" onclick="UI.goPaper('${p}')">${SYLLABUS[p].label}</button>`;
      }).join('')}
    </div>
    <div class="t-meta" style="margin-bottom:12px">
      <span style="color:var(--c-cyan)">●</span> cyan = your addition &nbsp;·&nbsp;
      ○ ◑ ● = lecture / PYQ seen / PYQ attempted &nbsp;·&nbsp;
      Click chunk to open detail
    </div>`;

    paper.subjects.forEach((subj, si) => {
      const sStats = Analytics.subjectStats(paperId, subj.name);
      const coaching = DB.getCoaching(paperId, subj.name);
      const cpct = coaching.total > 0 ? Math.round(coaching.completed/coaching.total*100) : 0;
      const subKey = `sub-${paperId}-${si}`;
      const isOpen = this.expandedPapers[subKey];

      h += `<div class="subject-block">
        <div class="subject-hdr" onclick="UI.toggleSubject('${subKey}')">
          <span class="subject-name">${subj.name}</span>
          <div class="subject-meta">
            <div class="btrack" style="width:64px"><div class="bfill" style="width:${sStats.cov}%;background:${paper.color}"></div></div>
            <span class="subject-pct" style="color:${paper.color}">${sStats.cov}%</span>
            <span class="subject-arr">${isOpen?'▴':'▾'}</span>
          </div>
        </div>

        ${isOpen ? `
        <div class="coaching-row">
          <span class="coaching-label">🎓 Coaching lectures</span>
          <div class="coaching-inputs">
            <input class="cinp cinp-wide" type="text" placeholder="Academy name" value="${coaching.academy||''}"
              onchange="UI.saveCoaching('${paperId}','${subj.name.replace(/'/g,"\\'")}',this,'academy')">
            <input class="cinp cinp-num" type="number" min="0" placeholder="Total" value="${coaching.total||''}"
              onchange="UI.saveCoaching('${paperId}','${subj.name.replace(/'/g,"\\'")}',this,'total')">
            <span style="font-size:11px;color:var(--text3)">/</span>
            <input class="cinp cinp-num" type="number" min="0" placeholder="Done" value="${coaching.completed||''}"
              onchange="UI.saveCoaching('${paperId}','${subj.name.replace(/'/g,"\\'")}',this,'completed')">
            ${coaching.total > 0 ? `<span class="coaching-pct">${cpct}%</span>` : ''}
          </div>
        </div>

        ${subj.bullets.map((bullet, bi) => {
          const bulletKey = `bul-${paperId}-${si}-${bi}`;
          const isBulletOpen = this.expandedPapers[bulletKey];
          const userChunks = DB.userChunks[bullet.id] || [];
          const allChunks = [...bullet.chunks, ...userChunks];
          const covCount = allChunks.filter(c => DB.getRecord(c.id)?.firstStudied).length;
          const bulletLabel = DB.getBulletLabel(bullet.id, bullet.label);

          return `<div class="bullet-block">
            <div class="bullet-hdr" onclick="UI.toggleBullet('${bulletKey}')">
              <div style="flex:1">
                <input class="bullet-label-input" type="text" value="${bulletLabel}"
                  onclick="event.stopPropagation()"
                  onchange="UI.saveBulletLabel('${bullet.id}',this.value)"
                  title="Click to edit label">
                <div class="bullet-official">${bullet.official}</div>
              </div>
              <span class="t-meta" style="flex-shrink:0;margin:0 8px">${covCount}/${allChunks.length}</span>
              <span class="bullet-arr">${isBulletOpen?'▴':'▾'}</span>
            </div>

            ${isBulletOpen ? `
            ${allChunks.map(chunk => {
              const rec = DB.getRecord(chunk.id) || {};
              const str = SRS.strength(rec);
              const isSelected = this.selectedChunkId === chunk.id;
              let statusClass = 'unseen';
              if (rec.firstStudied) {
                if (rec.nextReview && rec.nextReview < todayStr()) statusClass = 'due';
                else if (rec.repetitions < 2) statusClass = 'studying';
                else if (rec.lastScore <= 2) statusClass = 'fragile';
                else statusClass = 'strong';
              }
              const gap2c = SRS.gapClass(rec.gap2Remaining);
              const gap3c = SRS.gapClass(rec.gap3Remaining);
              const totalM = SRS.totalAllMins(rec);

              return `<div class="chunk-row ${isSelected?'selected':''}" onclick="UI.selectChunk('${paperId}','${bullet.id}','${chunk.id}')">
                <div class="chunk-status ${statusClass}"></div>
                <div class="chunk-name ${chunk.isUser?'user-added':''}">${chunk.name}</div>
                <div class="gap-dots">
                  <div class="gdot ${rec.gap1Done?'done':''}" title="First exposure"></div>
                  <div class="gdot ${gap2c}" title="PYQ seen"></div>
                  <div class="gdot ${gap3c}" title="PYQ attempted"></div>
                </div>
                ${totalM > 0 ? `<span class="chunk-time">${fmtMins(totalM)}</span>` : ''}
                <div class="str-mini"><div class="str-fill" style="width:${str}%;background:${paper.color}"></div></div>
              </div>`;
            }).join('')}
            <div class="add-chunk-row">
              <div class="add-chunk-form">
                <input class="field" type="text" id="add-${bullet.id}" placeholder="Add your own chunk under this bullet..."
                  onkeydown="if(event.key==='Enter')UI.addChunk('${bullet.id}','${paperId}')">
                <button class="btn btn-ghost btn-sm" onclick="UI.addChunk('${bullet.id}','${paperId}')">+</button>
              </div>
            </div>` : ''}
          </div>`;
        }).join('')}` : ''}
      </div>`;
    });

    const lp = document.getElementById('left-pane');
    if (lp) lp.innerHTML = h;
  },

  toggleSubject(key) {
    this.expandedPapers[key] = !this.expandedPapers[key];
    this.renderSyllabus();
  },

  toggleBullet(key) {
    this.expandedPapers[key] = !this.expandedPapers[key];
    this.renderSyllabus();
  },

  saveBulletLabel(bulletId, label) {
    DB.setBulletLabel(bulletId, label);
  },

  saveCoaching(paperId, subjName, el, field) {
    const c = DB.getCoaching(paperId, subjName);
    c[field] = field === 'academy' ? el.value : parseInt(el.value) || 0;
    DB.setCoaching(paperId, subjName, c);
  },

  addChunk(bulletId, paperId) {
    const inp = document.getElementById(`add-${bulletId}`);
    const name = inp?.value?.trim();
    if (!name) return;
    DB.addUserChunk(bulletId, name);
    inp.value = '';
    this.renderSyllabus();
    this.toast('Chunk added ✓');
  },

  selectChunk(paperId, bulletId, chunkId) {
    this.selectedChunkId = chunkId;
    this.openChunkDetail(chunkId);
    this.renderSyllabus();
  },

  // ── RIGHT PANEL ───────────────────────────────────────────────────────────────
  renderRightPanel() {
    const rp = document.getElementById('right-pane');
    if (!rp) return;
    if (!this.selectedChunkId) {
      rp.innerHTML = `<div class="right-pane-empty">
        <div class="icon">◎</div>
        <div class="t-section">No chunk selected</div>
        <div class="t-meta" style="margin-top:4px">Click any chunk in the syllabus to see its detail here</div>
      </div>`;
      return;
    }
    rp.innerHTML = `<div id="chunk-detail-content"></div>`;
    this.renderChunkDetail(this.selectedChunkId);
  },

  openChunkDetail(chunkId) {
    this.selectedChunkId = chunkId;
    const rp = document.getElementById('right-pane');
    if (rp) {
      rp.innerHTML = `<div id="chunk-detail-content"></div>`;
      this.renderChunkDetail(chunkId);
    }
  },

  renderChunkDetail(chunkId) {
    const el = document.getElementById('chunk-detail-content');
    if (!el) return;

    // Find chunk in syllabus
    let foundChunk = null, foundBullet = null, foundPaper = null;
    for (const paperId of PAPER_ORDER) {
      const paper = SYLLABUS[paperId];
      for (const subj of paper.subjects) {
        for (const bullet of subj.bullets) {
          const allC = [...bullet.chunks, ...(DB.userChunks[bullet.id]||[])];
          const c = allC.find(ch => ch.id === chunkId);
          if (c) { foundChunk = c; foundBullet = bullet; foundPaper = paper; break; }
        }
        if (foundChunk) break;
      }
      if (foundChunk) break;
    }
    if (!foundChunk) { el.innerHTML = '<div class="t-meta">Chunk not found</div>'; return; }

    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    const totalM = SRS.totalMins(rec);
    const gap2c = SRS.gapClass(rec.gap2Remaining);
    const gap3c = SRS.gapClass(rec.gap3Remaining);
    const recentLog = (rec.activityLog || []).slice(-5).reverse();

    const mediumLabels = { lecture:'Lecture', ncert:'NCERT', 'pyq-seen':'PYQ seen', 'pyq-attempted':'PYQ attempted', reference:'Reference/Internet' };

    el.innerHTML = `
    <div class="chunk-detail-paper" style="color:${foundPaper.color}">${foundPaper.label}</div>
    <div class="chunk-detail-name">${foundChunk.name}${foundChunk.isUser?` <span style="font-size:11px;color:var(--c-cyan)">[your addition]</span>`:''}</div>
    <div class="chunk-detail-official">${foundBullet.official}</div>

    <!-- Three gaps -->
    <div class="detail-section">
      <div class="detail-label">Learning pipeline</div>
      <div class="gaps-row">
        <div class="gap-item ${rec.gap1Done?'done':''}" onclick="UI.toggleGap1('${chunkId}')">
          <div class="gap-circle">${rec.gap1Done?'✓':''}</div>
          <div class="gap-title">First exposure</div>
          <div class="t-meta" style="margin-top:3px">${rec.gap1Done?'Lecture/NCERT/Ref done':'Not yet'}</div>
        </div>
        <div class="gap-item ${gap2c}">
          <div class="gap-circle">${rec.gap2Remaining==='done'?'✓':rec.gap2Remaining==='little'?'◑':''}</div>
          <div class="gap-title">PYQ seen</div>
          <div class="t-meta" style="margin-top:3px">
            <select class="pyq-remaining-select" onchange="UI.updateGap2('${chunkId}',this.value)">
              <option value="all" ${(rec.gap2Remaining||'all')==='all'?'selected':''}>All left (0%)</option>
              <option value="most" ${rec.gap2Remaining==='most'?'selected':''}>Most left</option>
              <option value="some" ${rec.gap2Remaining==='some'?'selected':''}>Some left</option>
              <option value="little" ${rec.gap2Remaining==='little'?'selected':''}>A little left</option>
              <option value="done" ${rec.gap2Remaining==='done'?'selected':''}>Done ✓</option>
            </select>
          </div>
        </div>
        <div class="gap-item ${gap3c}">
          <div class="gap-circle">${rec.gap3Remaining==='done'?'✓':rec.gap3Remaining==='little'?'◑':''}</div>
          <div class="gap-title">PYQ attempted</div>
          <div class="t-meta" style="margin-top:3px">
            <select class="pyq-remaining-select" onchange="UI.updateGap3('${chunkId}',this.value)">
              <option value="all" ${(rec.gap3Remaining||'all')==='all'?'selected':''}>All left (0%)</option>
              <option value="most" ${rec.gap3Remaining==='most'?'selected':''}>Most left</option>
              <option value="some" ${rec.gap3Remaining==='some'?'selected':''}>Some left</option>
              <option value="little" ${rec.gap3Remaining==='little'?'selected':''}>A little left</option>
              <option value="done" ${rec.gap3Remaining==='done'?'selected':''}>Done ✓</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Time invested -->
    <div class="detail-section">
      <div class="detail-label">Time invested</div>
      <div class="time-summary">
        ${Object.entries(mediumLabels).map(([key, label]) => {
          const m = totalM[key] || 0;
          return m > 0 ? `<div class="time-row"><span class="time-medium">${label}</span><span class="time-val">${fmtMins(m)}</span></div>` : '';
        }).join('')}
        ${SRS.totalAllMins(rec) === 0 ? `<div class="t-meta">No activity logged yet</div>` : ''}
      </div>
    </div>

    <!-- Recent activity -->
    ${recentLog.length > 0 ? `
    <div class="detail-section">
      <div class="detail-label">Recent activity</div>
      <div class="activity-hist">
        ${recentLog.map(e => `
        <div class="hist-entry">
          <span class="hist-date">${e.date}</span>
          <span class="hist-medium">${mediumLabels[e.medium]||e.medium}</span>
          <span class="hist-mins">${fmtMins(e.mins)}</span>
        </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- SRS history -->
    <div class="detail-section">
      <div class="detail-label">SRS history</div>
      <div class="srs-hist">
        ${rec.firstStudied ? `First studied: ${fmtDate(rec.firstStudied)}<br>` : '<span style="color:var(--text3)">Not yet studied</span>'}
        ${rec.lastStudied ? `Last studied: ${fmtDate(rec.lastStudied)}<br>` : ''}
        ${rec.nextReview ? `Next review: ${fmtDate(rec.nextReview)} (${rec.interval}d interval)<br>` : ''}
        ${rec.repetitions ? `Repetitions: ${rec.repetitions}<br>` : ''}
        ${rec.lastScore ? `Last recall: ${['','Again','Hard','Good','Easy'][rec.lastScore]}<br>` : ''}
        ${rec.firstStudied ? `Strength: ${SRS.strength(rec)}%` : ''}
      </div>
    </div>

    <!-- Curious question -->
    <div class="detail-section">
      <div class="detail-label">Your curious question</div>
      <textarea class="field" id="cq-${chunkId}" rows="2"
        placeholder="Why does this matter? What would happen if...? How does this connect to...?"
        onchange="UI.saveCuriousQ('${chunkId}')">${rec.curiousQ||''}</textarea>
      ${rec.curiousQ ? `<label style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;cursor:pointer">
        <input type="checkbox" ${rec.curiousAnswered?'checked':''} onchange="UI.toggleCuriousAnswered('${chunkId}',this.checked)" style="accent-color:var(--accent)">
        <span style="color:var(--text2)">Answered</span>
      </label>` : ''}
    </div>

    <!-- Notes -->
    <div class="detail-section">
      <div class="detail-label">Notes</div>
      <textarea class="field" id="notes-${chunkId}" rows="4"
        placeholder="Key points, connections, things to remember, sources used..."
        onchange="UI.saveNotes('${chunkId}')">${rec.notes||''}</textarea>
    </div>

    <!-- AI hooks -->
    <div class="detail-section">
      <div class="detail-label">AI features <span class="t-meta">(coming soon)</span></div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <button style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg3);border:1px dashed var(--border2);border-radius:var(--radius);font-size:12px;color:var(--text3);width:100%;cursor:not-allowed" disabled>
          Explain this chunk for UPSC Mains <span style="margin-left:auto;font-size:10px;background:var(--bg4);padding:2px 5px;border-radius:4px">AI</span>
        </button>
        <button style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg3);border:1px dashed var(--border2);border-radius:var(--radius);font-size:12px;color:var(--text3);width:100%;cursor:not-allowed" disabled>
          Generate 5 probable questions <span style="margin-left:auto;font-size:10px;background:var(--bg4);padding:2px 5px;border-radius:4px">AI</span>
        </button>
        <button style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg3);border:1px dashed var(--border2);border-radius:var(--radius);font-size:12px;color:var(--text3);width:100%;cursor:not-allowed" disabled>
          Link to recent current affairs <span style="margin-left:auto;font-size:10px;background:var(--bg4);padding:2px 5px;border-radius:4px">AI</span>
        </button>
      </div>
    </div>`;
  },

  toggleGap1(chunkId) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.gap1Done = !rec.gap1Done;
    DB.setRecord(chunkId, rec);
    this.renderChunkDetail(chunkId);
    if (this.currentPage === 'syllabus') this.renderSyllabus();
    this.toast(rec.gap1Done ? 'Gap 1 closed ✓' : 'Gap 1 reopened');
  },

  updateGap2(chunkId, val) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.gap2Remaining = val;
    DB.setRecord(chunkId, rec);
    if (this.currentPage === 'syllabus') this.renderSyllabus();
  },

  updateGap3(chunkId, val) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.gap3Remaining = val;
    DB.setRecord(chunkId, rec);
    if (this.currentPage === 'syllabus') this.renderSyllabus();
  },

  saveCuriousQ(chunkId) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.curiousQ = document.getElementById(`cq-${chunkId}`)?.value || '';
    DB.setRecord(chunkId, rec);
    this.toast('Question saved ✓');
  },

  toggleCuriousAnswered(chunkId, val) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.curiousAnswered = val;
    DB.setRecord(chunkId, rec);
  },

  saveNotes(chunkId) {
    const rec = DB.getRecord(chunkId) || SRS.newRecord();
    rec.notes = document.getElementById(`notes-${chunkId}`)?.value || '';
    DB.setRecord(chunkId, rec);
    this.toast('Notes saved ✓');
  },

  // ── PACE ──────────────────────────────────────────────────────────────────────
  renderPace() {
    const year = this.currentYear;
    const pace = Plan.pace(year);
    const ph = Analytics.pipelineHealth();
    const stats = Analytics.globalStats();

    let tableH = `<table class="pace-table">
      <thead><tr>
        <th>Paper</th><th>Coverage</th><th>Chunks</th>
        <th>Gap 1</th><th>Gap 2</th><th>Gap 3</th><th>Time</th>
      </tr></thead><tbody>`;

    PAPER_ORDER.forEach(paperId => {
      const paper = SYLLABUS[paperId];
      const ps = Analytics.paperStats(paperId);
      const isExp = this.expandedPapers[`pace-${paperId}`];

      tableH += `<tr onclick="UI.togglePacePaper('${paperId}')" class="${isExp?'expanded':''}">
        <td class="paper-name-cell">
          <div class="nav-dot" style="background:${paper.color}"></div>
          ${paper.label}
          <span style="font-size:10px;color:var(--text3);margin-left:4px">${isExp?'▴':'▾'}</span>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="btrack" style="width:48px"><div class="bfill" style="width:${ps.cov}%;background:${paper.color}"></div></div>
            <span>${ps.cov}%</span>
          </div>
        </td>
        <td>${ps.studied}/${ps.total}</td>
        <td style="color:${ps.gap1===ps.total?'var(--c-green)':'var(--text2)'}">${ps.gap1}/${ps.total}</td>
        <td style="color:${ps.gap2===ps.total?'var(--c-green)':'var(--text2)'}">${ps.gap2}/${ps.total}</td>
        <td style="color:${ps.gap3===ps.total?'var(--c-green)':'var(--text2)'}">${ps.gap3}/${ps.total}</td>
        <td>${fmtMins(ps.totalMins)}</td>
      </tr>`;

      if (isExp) {
        SYLLABUS[paperId].subjects.forEach(subj => {
          const ss = Analytics.subjectStats(paperId, subj.name);
          tableH += `<tr class="subj-expand-row">
            <td colspan="7">
              <div class="subj-row-inner">
                <span class="subj-name-s">↳ ${subj.name}</span>
                <span>${ss.cov}% covered</span>
                <span>G1: ${ss.gap1}/${ss.total}</span>
                <span>G2: ${ss.gap2}/${ss.total}</span>
                <span>G3: ${ss.gap3}/${ss.total}</span>
                <span>${fmtMins(ss.totalMins)}</span>
              </div>
            </td>
          </tr>`;
        });
      }
    });

    tableH += '</tbody></table>';

    const el = document.getElementById('c-pace');
    if (!el) return;

    el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div class="t-page">Pace</div>
      <div class="year-toggle">
        <button class="ytbtn ${year===2027?'active':''}" onclick="UI.setYear(2027)">CSE 2027</button>
        <button class="ytbtn ${year===2028?'active':''}" onclick="UI.setYear(2028)">CSE 2028</button>
      </div>
    </div>

    <div class="pace-numbers">
      <div class="pnum">
        <div class="pnum-label">Days to Prelims</div>
        <div class="pnum-val" style="color:var(--accent)">${pace.days}</div>
        <div class="pnum-sub">Prelims ${year}</div>
      </div>
      <div class="pnum">
        <div class="pnum-label">Status</div>
        <div class="pnum-val" style="font-size:16px;color:var(--${pace.status==='on-track'?'c-green':pace.status==='watch'?'c-amber':'c-red'})">${pace.status.replace('-',' ')}</div>
        <div class="pnum-sub">${pace.msg}</div>
      </div>
      <div class="pnum">
        <div class="pnum-label">Daily target</div>
        <div class="pnum-val">${pace.target}</div>
        <div class="pnum-sub">chunks/day · ${pace.unseen} unseen</div>
      </div>
    </div>

    <div style="margin-bottom:12px">
      <div class="detail-label" style="margin-bottom:8px">Pipeline health — all three gaps</div>
      <div class="pipeline-row">
        <div class="pipe-item">
          <div class="pipe-val" style="color:var(--c-green)">${ph.allGapsClosed}</div>
          <div class="pipe-label">All gaps closed</div>
        </div>
        <div class="pipe-item">
          <div class="pipe-val" style="color:var(--c-amber)">${stats.gap1Done - stats.gap2Done}</div>
          <div class="pipe-label">Lecture only</div>
        </div>
        <div class="pipe-item">
          <div class="pipe-val" style="color:var(--c-red)">${stats.unseen}</div>
          <div class="pipe-label">Untouched</div>
        </div>
        <div class="pipe-item">
          <div class="pipe-val" style="color:var(--text2)">${fmtMins(stats.totalMins)}</div>
          <div class="pipe-label">Total invested</div>
        </div>
      </div>
    </div>

    <div class="detail-label" style="margin-bottom:8px">Paper breakdown — click to expand subjects</div>
    ${tableH}`;
  },

  togglePacePaper(paperId) {
    this.expandedPapers[`pace-${paperId}`] = !this.expandedPapers[`pace-${paperId}`];
    this.renderPace();
  },

  setYear(year) {
    this.currentYear = year;
    DB.settings.targetYear = year;
    DB.save();
    this.updateHeader();
    if (this.currentPage === 'pace') this.renderPace();
  },

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  renderSettings() {
    const target = DB.settings.dailyTarget || 6;
    const th = DB.settings.theme || 'dark';
    const pa = DB.settings.palette || 'cool';

    const el = document.getElementById('c-settings');
    if (!el) return;
    el.innerHTML = `
    <div class="t-page" style="margin-bottom:16px">Settings</div>

    <div class="settings-section">
      <div class="settings-title">Appearance</div>
      <div class="setting-row">
        <div><div class="setting-label">Theme</div><div class="setting-sub">Light or dark background</div></div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Colour palette</div><div class="setting-sub">Cool = indigo · Warm = amber</div></div>
      </div>
      <div class="theme-grid" style="margin-top:8px">
        <button class="theme-btn ${th==='dark'&&pa==='cool'?'active':''}" onclick="UI.setAppearance('dark','cool')">
          🌙 Dark · Cool
        </button>
        <button class="theme-btn ${th==='dark'&&pa==='warm'?'active':''}" onclick="UI.setAppearance('dark','warm')">
          🌙 Dark · Warm
        </button>
        <button class="theme-btn ${th==='light'&&pa==='cool'?'active':''}" onclick="UI.setAppearance('light','cool')">
          ☀ Light · Cool
        </button>
        <button class="theme-btn ${th==='light'&&pa==='warm'?'active':''}" onclick="UI.setAppearance('light','warm')">
          ☀ Light · Warm
        </button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-title">Study preferences</div>
      <div class="setting-row">
        <div><div class="setting-label">Daily chunk target: <strong id="td-disp">${target}</strong></div>
        <div class="setting-sub">How many chunks the algorithm shows per session</div></div>
      </div>
      <input type="range" min="3" max="15" step="1" value="${target}" style="width:100%;margin:8px 0;accent-color:var(--accent)"
        oninput="document.getElementById('td-disp').textContent=this.value"
        onchange="DB.settings.dailyTarget=parseInt(this.value);DB.save();Queue.build(parseInt(this.value));UI.renderToday();">
      <div style="display:flex;justify-content:space-between" class="t-meta"><span>3 light</span><span>6 balanced</span><span>15 intensive</span></div>
      <div class="setting-row" style="margin-top:12px">
        <div><div class="setting-label">Target exam year</div></div>
        <div class="year-toggle">
          <button class="ytbtn ${this.currentYear===2027?'active':''}" onclick="UI.setYear(2027)">2027</button>
          <button class="ytbtn ${this.currentYear===2028?'active':''}" onclick="UI.setYear(2028)">2028</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-title">Data</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="UI.exportData()">Export backup</button>
        <label class="btn btn-ghost" style="cursor:pointer">Import backup<input type="file" accept=".json" style="display:none" onchange="UI.importData(event)"></label>
        <button class="btn btn-danger" onclick="UI.resetAll()">Reset all progress</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-title">About</div>
      <div class="t-meta" style="line-height:1.8">
        Myelocus v4 · Official UPSC syllabus spine · SM-2 SRS (4-point) ·
        Three-gap pipeline · Chunk-level activity logging · Resizable split pane<br>
        <span style="font-style:italic">"The locus where myelin forms."</span>
      </div>
    </div>`;
  },

  setAppearance(theme, palette) {
    DB.settings.theme = theme;
    DB.settings.palette = palette;
    DB.save();
    this.applyTheme();
    this.renderSettings();
  },

  exportData() {
    const b = new Blob([DB.export()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `myelocus_backup_${todayStr()}.json`;
    a.click();
  },

  importData(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        DB.import(ev.target.result);
        this.init();
        this.toast('Imported ✓');
      } catch { this.toast('Invalid file'); }
    };
    r.readAsText(f);
  },

  resetAll() {
    if (!confirm('Reset all progress? Cannot be undone.')) return;
    localStorage.removeItem('myelocus_v4');
    localStorage.removeItem('myelocus_queue');
    DB.load();
    Queue.build(6);
    this.init();
    this.toast('Progress reset');
  }
};
