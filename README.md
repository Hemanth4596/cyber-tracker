# ⬡ CyberTrack — 800-Day Purple Team Mastery Tracker

> A fully static, GitHub Pages-hosted accountability tracker for an 800-day cybersecurity learning roadmap.

**Live:** `https://YOUR_USERNAME.github.io/cyber-tracker/`

---

## What This Is

CyberTrack turns an 800-day Purple Team learning roadmap into a daily accountability system with:

- ✅ Daily task checklists (auto-populated from your roadmap)
- 🔥 Streak tracking with rewards and miss-day penalties
- 📊 Score system (+5 tasks, -8 misses, ×1.5 Sundays)
- 📝 Daily report: what you learned, wasted time, tomorrow's focus
- 🏆 Gamified badges and rank progression
- 🗺️ 800-day activity heatmap
- 🔗 GitHub contribution streak sync
- 📤 Export reports as Markdown / JSON / CSV
- 🔔 Browser push notification reminders

**Zero backend. Zero cost. 100% localStorage.**

---

## Tech Stack

| Layer       | Tech                               |
|-------------|-------------------------------------|
| Framework   | React 18 + Vite                    |
| Routing     | React Router v6 (hash mode)        |
| Animations  | CSS keyframes + Framer Motion      |
| Charts      | Recharts                           |
| Storage     | localStorage (no backend needed)   |
| Export      | jsPDF + marked.js                  |
| CI/CD       | GitHub Actions → GitHub Pages      |
| Fonts       | IBM Plex Mono + Syne               |

---

## Project Structure

```
cyber-tracker/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Topbar, Layout wrapper
│   │   ├── dashboard/       # Stats, heatmap, charts, progress rings
│   │   ├── tracker/         # Daily task checklist
│   │   ├── report/          # Daily report form + habit tracker
│   │   ├── phases/          # Phase timeline
│   │   ├── badges/          # Badge grid + rank progression
│   │   ├── export/          # Export panel
│   │   ├── github/          # GitHub integration
│   │   ├── settings/        # Notifications + preferences
│   │   ├── onboarding/      # First-run setup wizard
│   │   └── shared/          # Button, Card, Modal, Toast
│   ├── data/
│   │   ├── roadmap.json     # All 800 days (auto-generated)
│   │   ├── phases.json      # Phase definitions
│   │   ├── badges.json      # Badge definitions
│   │   └── habits.json      # Default habit list
│   ├── hooks/
│   │   ├── useTracker.js    # Core state management
│   │   ├── useBadges.js     # Badge unlock detection
│   │   ├── useToast.js      # Toast notification state
│   │   └── useNotifications.js  # Web Notifications API
│   ├── utils/
│   │   ├── storage.js       # localStorage helpers
│   │   ├── scoreEngine.js   # Score calculation rules
│   │   ├── dates.js         # Date utilities
│   │   ├── export.js        # MD/JSON/CSV export
│   │   └── github.js        # GitHub API
│   ├── styles/
│   │   ├── tokens.css       # CSS custom properties
│   │   ├── base.css         # Reset + global styles
│   │   └── animations.css   # Keyframe animations
│   ├── App.jsx              # Root router + context
│   └── main.jsx             # Entry point
├── scripts/
│   └── generate-roadmap.js  # Generates src/data/roadmap.json
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons
├── .github/workflows/
│   ├── deploy.yml           # Auto-deploy to GitHub Pages
│   └── daily-backup.yml     # Nightly heartbeat commit
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/cyber-tracker.git
cd cyber-tracker
npm install
```

### 2. Generate the 800-day roadmap

```bash
node scripts/generate-roadmap.js
# → src/data/roadmap.json created (800 days)
```

### 3. Run locally

```bash
npm run dev
# → http://localhost:5173/cyber-tracker/
```

### 4. Deploy to GitHub Pages

```bash
# Push to main — GitHub Actions handles the rest
git add .
git commit -m "init: cyber-tracker setup"
git push origin main
```

Then go to your repo **Settings → Pages → Source: GitHub Actions**.

Your tracker will be live at:
```
https://YOUR_USERNAME.github.io/cyber-tracker/
```

---

## Score System

| Event                      | Points     |
|----------------------------|------------|
| Task completed             | +5         |
| All tasks done (bonus)     | +5         |
| Daily report submitted     | +3         |
| Per habit checked          | +1         |
| GitHub commit today        | +2         |
| 7-day streak milestone     | +10        |
| 30-day streak milestone    | +25        |
| 100-day streak milestone   | +100       |
| Sunday multiplier          | ×1.5       |
| Recovery day (full tasks)  | +5 bonus   |
| **Missed day penalty**     | **−8**     |
| **Streak break penalty**   | **−5**     |

---

## Ranks

| Rank              | XP Range       |
|-------------------|----------------|
| INITIATE          | 0 – 500        |
| ANALYST           | 500 – 1,500    |
| OPERATOR          | 1,500 – 3,000  |
| SPECIALIST        | 3,000 – 6,000  |
| EXPERT            | 6,000 – 12,000 |
| ELITE             | 12,000 – 25,000|
| PURPLE TEAM LEAD  | 25,000+        |

---

## GitHub Integration

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Create a token with `read:user` scope
3. Enter your username + token in CyberTrack → GitHub Integration
4. Click **Sync Now** to fetch your contribution data
5. If your GitHub streak matches your CyberTrack streak → +2 pts/day bonus

---

## Customising Your Roadmap

Edit `scripts/generate-roadmap.js` to modify the `PHASE_CONTENT` array, then re-run:

```bash
node scripts/generate-roadmap.js
```

Each phase block supports:
- `topic` — the study topic name
- `days` — how many days to spend on this topic
- `tasks` — array of task strings (one per day, two on Sundays)

---

## PWA Installation

CyberTrack works as a Progressive Web App:
- **Desktop**: click the install icon in your browser address bar
- **Mobile**: Safari → Share → Add to Home Screen / Chrome → Install App
- Works **offline** after first load

---

## License

MIT — built for personal accountability. Fork it, make it yours.

---

*800 days. 3,300 hours. One goal: hard to replace by 2028.*
