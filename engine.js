// ── HELPERS ───────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function addDays(d, n) { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0]; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
function daysUntil(d) { return daysBetween(todayStr(), d); }
function fmtDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function fmtMins(m) { if (!m || m === 0) return '—'; if (m < 60) return `${m}m`; return `${Math.floor(m/60)}h${m%60>0?' '+m%60+'m':''}`.trim(); }
function uid() { return `c${Date.now()}${Math.random().toString(36).slice(2,6)}`; }

// ── SRS ENGINE ────────────────────────────────────────────────────────────────
const SRS = {
  newRecord() {
    return { interval:0, easiness:2.5, repetitions:0, nextReview:null, lastScore:null,
      firstStudied:null, lastStudied:null, studyCount:0,
      gap1Done:false, gap2Remaining:'all', gap3Remaining:'all',
      activityLog:[], notes:'', curiousQ:'', curiousAnswered:false };
  },
  review(rec, score) {
    const r = {...rec, activityLog:[...(rec.activityLog||[])]};
    r.lastScore=score; r.lastStudied=todayStr();
    r.studyCount=(r.studyCount||0)+1;
    if (!r.firstStudied) r.firstStudied=todayStr();
    if (score===1) { r.repetitions=0; r.interval=1; r.easiness=Math.max(1.3,(r.easiness||2.5)-0.2); }
    else if (score===2) { r.interval=r.repetitions===0?1:r.repetitions===1?2:Math.max(1,Math.round((r.interval||1)*1.3)); r.repetitions=(r.repetitions||0)+1; }
    else if (score===3) { r.interval=r.repetitions===0?1:r.repetitions===1?3:Math.round((r.interval||1)*(r.easiness||2.5)); r.repetitions=(r.repetitions||0)+1; }
    else { r.interval=r.repetitions===0?2:r.repetitions===1?5:Math.round((r.interval||1)*(r.easiness||2.5)*1.2); r.easiness=Math.min(4.0,(r.easiness||2.5)+0.1); r.repetitions=(r.repetitions||0)+1; }
    r.nextReview=addDays(todayStr(),r.interval);
    return r;
  },
  logActivity(rec, activities) {
    const r={...rec, activityLog:[...(rec.activityLog||[])]};
    const today=todayStr();
    activities.forEach(({medium,mins})=>{
      if (!mins||mins<=0) return;
      r.activityLog.push({date:today,medium,mins:parseInt(mins)});
      if (['lecture','ncert','reference'].includes(medium)) { r.gap1Done=true; if(!r.firstStudied) r.firstStudied=today; }
    });
    return r;
  },
  strength(rec) {
    if (!rec?.lastStudied||!rec?.nextReview) return 0;
    const pct=Math.max(0,Math.min(100,Math.round((daysBetween(todayStr(),rec.nextReview)/(rec.interval||1))*100)));
    if (rec.lastScore===1) return Math.min(pct,30);
    if (rec.lastScore===2) return Math.min(pct,60);
    return pct;
  },
  isDue(rec) { return !!rec?.nextReview && rec.nextReview<=todayStr(); },
  isNew(rec) { return !rec?.firstStudied; },
  gapClass(r) { if (!r||r==='all') return ''; return r==='done'?'done':'partial'; },
  totalMins(rec) {
    const t={lecture:0,ncert:0,'pyq-seen':0,'pyq-attempted':0,reference:0};
    (rec?.activityLog||[]).forEach(({medium,mins})=>{ if(t[medium]!==undefined) t[medium]+=mins; });
    return t;
  },
  totalAllMins(rec) { return Object.values(this.totalMins(rec||{})).reduce((a,b)=>a+b,0); }
};

// ── DATABASE ──────────────────────────────────────────────────────────────────
const DB = {
  records:{}, userSyllabus:{}, coaching:{}, subjects:{},
  settings:{targetYear:2027,theme:'dark',palette:'cool',dailyTarget:6,streak:0,lastActiveDate:null},
  activity:{},

  load() {
    try {
      const raw=localStorage.getItem('myelocus_v4');
      if (raw) { const p=JSON.parse(raw); this.records=p.records||{}; this.userSyllabus=p.userSyllabus||{}; this.coaching=p.coaching||{}; this.subjects=p.subjects||{}; this.settings={...this.settings,...(p.settings||{})}; this.activity=p.activity||{}; }
    } catch(e) {}
    // Seed DEFAULT_SYLLABUS on first run if syllabus is empty
    if (typeof DEFAULT_SYLLABUS !== 'undefined' && Object.keys(this.userSyllabus).length === 0) {
      this.userSyllabus = JSON.parse(JSON.stringify(DEFAULT_SYLLABUS));
      this.save();
    }
    // Seed editable subjects list from fixed PAPERS structure on first run / per paper
    this.seedSubjects();
    this.updateStreak();
  },
  // Subjects are user-editable and persisted here, seeded once from PAPERS.
  seedSubjects() {
    let changed=false;
    PAPER_ORDER.forEach(paperId=>{
      if (!Array.isArray(this.subjects[paperId])) {
        this.subjects[paperId]=(PAPERS[paperId].subjects||[]).map(s=>({id:s.id,name:s.name}));
        changed=true;
      }
    });
    if (changed) this.save();
  },
  save() {
    try { localStorage.setItem('myelocus_v4',JSON.stringify({records:this.records,userSyllabus:this.userSyllabus,coaching:this.coaching,subjects:this.subjects,settings:this.settings,activity:this.activity})); } catch(e) {}
  },

  // ── SUBJECTS (editable) ──
  getSubjects(paperId) { return this.subjects[paperId]||[]; },
  addSubject(paperId,name) {
    if (!Array.isArray(this.subjects[paperId])) this.subjects[paperId]=[];
    const s={id:uid(),name}; this.subjects[paperId].push(s);
    if (!this.userSyllabus[paperId]) this.userSyllabus[paperId]={};
    if (!this.userSyllabus[paperId][s.id]) this.userSyllabus[paperId][s.id]={bullets:[]};
    this.save(); return s;
  },
  updateSubjectName(paperId,subjId,name) {
    const s=(this.subjects[paperId]||[]).find(s=>s.id===subjId);
    if (s) { s.name=name; this.save(); }
  },
  deleteSubject(paperId,subjId) {
    // remove all chunk records under this subject
    const subj=(this.userSyllabus[paperId]||{})[subjId];
    if (subj && Array.isArray(subj.bullets)) {
      subj.bullets.forEach(b=>(b.chunks||[]).forEach(c=>{ delete this.records[c.id]; }));
    }
    if (this.userSyllabus[paperId]) delete this.userSyllabus[paperId][subjId];
    if (this.coaching[paperId]) delete this.coaching[paperId][subjId];
    this.subjects[paperId]=(this.subjects[paperId]||[]).filter(s=>s.id!==subjId);
    this.save();
  },

  getRecord(id) { return this.records[id]||null; },
  setRecord(id,rec) { this.records[id]=rec; const t=todayStr(); this.activity[t]=(this.activity[t]||0)+1; this.updateStreak(); this.save(); },

  updateStreak() {
    const today=todayStr(), yest=addDays(today,-1);
    if (this.activity[today]) {
      if (this.settings.lastActiveDate===yest) this.settings.streak=(this.settings.streak||0)+1;
      else if (!this.settings.lastActiveDate||this.settings.lastActiveDate<yest) this.settings.streak=1;
      this.settings.lastActiveDate=today;
    }
  },

  getBullets(paperId,subjId) { return ((this.userSyllabus[paperId]||{})[subjId]||{}).bullets||[]; },
  addBullet(paperId,subjId,official) {
    if (!this.userSyllabus[paperId]) this.userSyllabus[paperId]={};
    if (!this.userSyllabus[paperId][subjId]) this.userSyllabus[paperId][subjId]={bullets:[]};
    const b={id:uid(),official,label:official,chunks:[]};
    this.userSyllabus[paperId][subjId].bullets.push(b); this.save(); return b;
  },
  updateBulletLabel(paperId,subjId,bulletId,label) {
    const b=this.getBullets(paperId,subjId).find(b=>b.id===bulletId);
    if (b) { b.label=label; this.save(); }
  },
  updateBulletOfficial(paperId,subjId,bulletId,official) {
    const b=this.getBullets(paperId,subjId).find(b=>b.id===bulletId);
    if (b) { b.official=official; this.save(); }
  },
  deleteBullet(paperId,subjId,bulletId) {
    const subj=(this.userSyllabus[paperId]||{})[subjId]; if (!subj) return;
    subj.bullets=subj.bullets.filter(b=>b.id!==bulletId); this.save();
  },

  addChunk(paperId,subjId,bulletId,name) {
    const b=this.getBullets(paperId,subjId).find(b=>b.id===bulletId); if (!b) return null;
    const c={id:uid(),name}; b.chunks.push(c); this.save(); return c;
  },
  updateChunkName(paperId,subjId,bulletId,chunkId,name) {
    const b=this.getBullets(paperId,subjId).find(b=>b.id===bulletId); if (!b) return;
    const c=b.chunks.find(c=>c.id===chunkId); if (c) { c.name=name; this.save(); }
  },
  deleteChunk(paperId,subjId,bulletId,chunkId) {
    const b=this.getBullets(paperId,subjId).find(b=>b.id===bulletId); if (!b) return;
    b.chunks=b.chunks.filter(c=>c.id!==chunkId); delete this.records[chunkId]; this.save();
  },

  getCoaching(paperId,subjId) { return ((this.coaching[paperId]||{})[subjId])||{academy:'',total:0,completed:0}; },
  setCoaching(paperId,subjId,d) { if (!this.coaching[paperId]) this.coaching[paperId]={}; this.coaching[paperId][subjId]=d; this.save(); },

  getAllChunks() {
    const all=[];
    PAPER_ORDER.forEach(paperId=>{
      this.getSubjects(paperId).forEach(subj=>{
        this.getBullets(paperId,subj.id).forEach(bullet=>{
          bullet.chunks.forEach(chunk=>all.push({paperId,subjId:subj.id,bulletId:bullet.id,chunk}));
        });
      });
    });
    return all;
  },

  export() { return JSON.stringify({records:this.records,userSyllabus:this.userSyllabus,coaching:this.coaching,subjects:this.subjects,settings:this.settings,activity:this.activity,exportedAt:new Date().toISOString()},null,2); },
  import(json) { const p=JSON.parse(json); this.records=p.records||{}; this.userSyllabus=p.userSyllabus||{}; this.coaching=p.coaching||{}; this.subjects=p.subjects||{}; this.settings={...this.settings,...(p.settings||{})}; this.activity=p.activity||{}; this.seedSubjects(); this.save(); }
};

// ── QUEUE ─────────────────────────────────────────────────────────────────────
const Queue = {
  current:[], cardStates:{},
  build(target) {
    const all=DB.getAllChunks(), due=[], newC=[];
    all.forEach(item=>{ const rec=DB.getRecord(item.chunk.id); if(SRS.isDue(rec)) due.push({...item,rec,type:'review'}); else if(SRS.isNew(rec)) newC.push({...item,rec,type:'new'}); });
    due.sort((a,b)=>(a.rec?.nextReview||'2000').localeCompare(b.rec?.nextReview||'2000'));
    const combined=[...due.slice(0,target),...newC.slice(0,Math.max(0,target-due.length))];
    this.current=this.interleave(combined).slice(0,target); this.initStates(); this.saveState(); return this.current;
  },
  interleave(items) {
    const g={}; items.forEach(i=>{ if(!g[i.paperId]) g[i.paperId]=[]; g[i.paperId].push(i); });
    const res=[],keys=Object.keys(g); let i=0;
    while(res.length<items.length){ const k=keys[i%keys.length]; if(g[k]?.length>0) res.push(g[k].shift()); i++; if(keys.every(k2=>!g[k2]?.length)) break; }
    return res;
  },
  restore() {
    try { const raw=localStorage.getItem('myelocus_queue_v4'); if(!raw) return false; const p=JSON.parse(raw); if(p.date!==todayStr()) return false; this.current=p.queue||[]; this.cardStates=p.states||{}; return this.current.length>0; } catch(e) { return false; }
  },
  saveState() { try { localStorage.setItem('myelocus_queue_v4',JSON.stringify({date:todayStr(),queue:this.current,states:this.cardStates})); } catch(e) {} },
  initStates() { this.cardStates={}; this.current.forEach((_,i)=>{ this.cardStates[i]={done:false,score:null,open:false}; }); },
  doneCount() { return Object.values(this.cardStates).filter(s=>s.done).length; },
  toggleCard(idx) { const was=this.cardStates[idx]?.open; Object.keys(this.cardStates).forEach(k=>{this.cardStates[k].open=false;}); if(this.cardStates[idx]) this.cardStates[idx].open=!was; this.saveState(); },
  rateCard(idx,score) { const item=this.current[idx]; if(!item) return; const rec=DB.getRecord(item.chunk.id)||SRS.newRecord(); DB.setRecord(item.chunk.id,SRS.review(rec,score)); this.cardStates[idx]={done:true,score,open:false}; this.saveState(); },
  markStudied(idx) { const item=this.current[idx]; if(!item) return; const rec=DB.getRecord(item.chunk.id)||SRS.newRecord(); DB.setRecord(item.chunk.id,SRS.review({...rec,firstStudied:rec.firstStudied||todayStr()},3)); this.cardStates[idx]={done:true,score:3,open:false}; this.saveState(); },
  logActivity(idx,activities) { const item=this.current[idx]; if(!item) return; const rec=DB.getRecord(item.chunk.id)||SRS.newRecord(); DB.setRecord(item.chunk.id,SRS.logActivity(rec,activities)); this.saveState(); }
};

// ── PLAN ──────────────────────────────────────────────────────────────────────
const Plan = {
  daysLeft(year) { return Math.max(0,daysUntil(year===2028?'2028-05-25':'2027-05-25')); },
  pace(year) {
    const all=DB.getAllChunks(), total=all.length, studied=all.filter(({chunk})=>DB.getRecord(chunk.id)?.firstStudied).length, unseen=total-studied;
    const days=this.daysLeft(year), target=DB.settings.dailyTarget||6;
    const daysNeeded=unseen>0?Math.ceil(unseen/target):0, buffer=days-daysNeeded;
    const status=buffer>90?'on-track':buffer>30?'watch':buffer>0?'urgent':'critical';
    const msg=total===0?'Add chunks to begin tracking.':buffer>90?`${buffer} buffer days. Good pace.`:buffer>30?`${buffer} buffer days. Maintain pace.`:buffer>0?`Only ${buffer} buffer days.`:`Behind by ${Math.abs(buffer)} days.`;
    return {days,unseen,total,studied,buffer,status,msg,target};
  },
  weekDone() {
    const today=new Date(),dow=today.getDay(),monday=new Date(today);
    monday.setDate(today.getDate()-(dow===0?6:dow-1));
    const ms=monday.toISOString().split('T')[0];
    return Object.entries(DB.activity).filter(([d])=>d>=ms).reduce((s,[,v])=>s+v,0);
  },
  currentPhase(year) {
    const today=todayStr();
    const phases={
      2027:[
        {name:'Foundation',   start:'2026-06-01',end:'2026-12-31',weekly:12,daily:3,  note:'Encoding phase. Breadth before depth. Do not skip chunks to go deep early.'},
        {name:'Deepening',    start:'2027-01-01',end:'2027-03-31',weekly:8, daily:3,  note:'Consolidation. Myelin thickens on pathways you revisit. Hard chunks need more repetitions.'},
        {name:'Integration',  start:'2027-04-01',end:'2027-04-30',weekly:6, daily:3.5,note:'Interleaving across subjects builds flexible retrieval — better than blocked practice.'},
        {name:'Prelims Sprint',start:'2027-05-01',end:'2027-05-25',weekly:4,daily:4,  note:'Retrieval practice. Testing yourself is 2× more effective than re-reading.'}
      ],
      2028:[
        {name:'Foundation',   start:'2026-06-01',end:'2027-06-30',weekly:8, daily:2.5,note:'Extended encoding. Slower pace builds stronger initial memory traces.'},
        {name:'Deepening',    start:'2027-07-01',end:'2028-02-28',weekly:6, daily:3,  note:'Deep consolidation. Longer intervals build near-permanent retention.'},
        {name:'Integration',  start:'2028-03-01',end:'2028-04-30',weekly:8, daily:3.5,note:'Schema building. Connect knowledge into unified frameworks for faster retrieval.'},
        {name:'Prelims Sprint',start:'2028-05-01',end:'2028-05-25',weekly:4,daily:4,  note:'Peak retrieval. High-frequency testing maximises Prelims performance.'}
      ]
    };
    const list=phases[year]||phases[2027];
    return list.find(p=>today>=p.start&&today<=p.end)||(today<list[0].start?list[0]:list[list.length-1]);
  }
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
const Analytics = {
  paperStats(paperId) {
    let total=0,studied=0,due=0,strong=0,gap1=0,gap2=0,gap3=0,totalMins=0;
    DB.getSubjects(paperId).forEach(subj=>{
      DB.getBullets(paperId,subj.id).forEach(bullet=>{
        bullet.chunks.forEach(chunk=>{
          total++; const rec=DB.getRecord(chunk.id);
          if(rec?.firstStudied) studied++;
          if(rec?.nextReview&&rec.nextReview<=todayStr()) due++;
          if(SRS.strength(rec)>70) strong++;
          if(rec?.gap1Done) gap1++;
          if(rec?.gap2Remaining==='done') gap2++;
          if(rec?.gap3Remaining==='done') gap3++;
          totalMins+=SRS.totalAllMins(rec);
        });
      });
    });
    return {total,studied,due,strong,gap1,gap2,gap3,totalMins,cov:total?Math.round(studied/total*100):0};
  },
  subjectStats(paperId,subjId) {
    let total=0,studied=0,gap1=0,gap2=0,gap3=0,totalMins=0;
    DB.getBullets(paperId,subjId).forEach(bullet=>{
      bullet.chunks.forEach(chunk=>{
        total++; const rec=DB.getRecord(chunk.id);
        if(rec?.firstStudied) studied++;
        if(rec?.gap1Done) gap1++;
        if(rec?.gap2Remaining==='done') gap2++;
        if(rec?.gap3Remaining==='done') gap3++;
        totalMins+=SRS.totalAllMins(rec);
      });
    });
    return {total,studied,gap1,gap2,gap3,totalMins,cov:total?Math.round(studied/total*100):0};
  },
  globalStats() {
    let total=0,studied=0,due=0,overdue=0,strong=0,gap1=0,gap2=0,gap3=0,totalMins=0;
    DB.getAllChunks().forEach(({chunk})=>{
      total++; const rec=DB.getRecord(chunk.id);
      if(rec?.firstStudied) studied++;
      if(rec?.nextReview){ if(rec.nextReview<=todayStr()) due++; if(rec.nextReview<todayStr()) overdue++; if(SRS.strength(rec)>70) strong++; }
      if(rec?.gap1Done) gap1++;
      if(rec?.gap2Remaining==='done') gap2++;
      if(rec?.gap3Remaining==='done') gap3++;
      totalMins+=SRS.totalAllMins(rec);
    });
    return {total,studied,due,overdue,strong,gap1,gap2,gap3,totalMins,unseen:total-studied};
  }
};
