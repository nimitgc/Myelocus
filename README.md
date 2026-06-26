# Myelocus — UPSC Civil Services Tracker

> "The locus where myelin forms — where disciplined study builds permanent neural pathways."

**Myelocus** is a Progressive Web App (PWA) for UPSC Civil Services preparation.
Inspired by two neuroscience principles: *myelin* (the sheath that strengthens neural pathways through repetition) and *locus coeruleus* (the brain's focus centre).

Works offline. Installable on phone. No login required. Your data never leaves your device.

---

## Files

```
myelocus/
├── index.html       ← The entire app
├── manifest.json    ← PWA manifest
├── sw.js            ← Service worker (offline support)
├── icon-192.svg     ← App icon
├── icon-512.svg     ← App icon (large)
└── README.md        ← This file
```

---

## Option A — GitHub Pages (recommended)

1. Go to github.com → New repository → name it `myelocus` (public)
2. Upload all files from this folder
3. Settings → Pages → Source: main branch, folder: / (root) → Save
4. Live at: `https://YOUR-USERNAME.github.io/myelocus`
5. On phone: open URL in Chrome → Add to Home Screen

---

## Option B — Netlify Drop (fastest)

1. Go to https://app.netlify.com/drop
2. Drag the entire `myelocus` folder
3. Instant live URL — open on phone → Add to Home Screen

---

## Option C — Local use

Open `index.html` in Chrome directly. Data saves to browser localStorage.
Full PWA features (offline, installable) require hosting over HTTPS (Options A or B).

---

## AI Features

Uses Anthropic API directly from your browser.
- Get API key at https://console.anthropic.com
- Enter in app under AI Assistant (✦ icon)
- Stored only on your device, never transmitted to any server

---

## Features

- GS 1, 2, 3, 4 · Prelims · Economics Optional — full syllabus
- Status tracking: Pending → Started → Done → Needs Revision
- Spaced repetition: revision alerts at 7 and 14 days
- Mock score + notes per topic
- AI: Mains questions, Prelims MCQ, topic explanations, current affairs links
- Export / import JSON backup
- Offline capable · Installable · Dark mode

---

## The name

**Myelin** — the fatty sheath that wraps around neural pathways you use repeatedly,
making signals faster and more automatic with every revision session.

**Locus** — from *locus coeruleus*, the brain's attention and focus centre.
Also Latin for "the place" — your fixed point of preparation.

Together: *the place where pathways strengthen through disciplined practice.*
