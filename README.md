# 💎 Crystal People — Performance Management Tool

> Crystal Group Hiring Assignment · React · Google Sheets API · Claude AI

A full-stack performance management tool for a team of 20 employees. Managers score team members monthly across three dimensions, add written feedback, and get AI-powered insights. Employees view their score history and feedback in a clean timeline.

---

## ✨ Features

### Two User Roles
| Role | Capabilities |
|------|-------------|
| **Manager** | Score employees 1–5 across Output Quality, Attendance & Teamwork · Add written comments · Submit monthly reviews |
| **Employee** | View full review timeline · Score history charts (line + radar) · AI trend summary |

### 5 AI Features (Claude-powered)
1. **🛡️ Consistency Check** — Flags when scores don't match the written comment
2. **✨ Improve Feedback** — Rewrites vague comments into specific, actionable feedback
3. **💡 Improvement Actions** — Suggests concrete steps for low-scoring dimensions
4. **📈 Performance Trend Summary** — Plain-English summary of an employee's 3–6 month arc
5. **🤖 HR Assistant** — Natural-language chat: "Who hasn't been reviewed this month?" / "Who is the top performer?"

### Data Persistence
- **Google Sheets** as the database (one row per monthly review)
- **Demo Mode** with localStorage when no Sheets URL is set — works offline with pre-seeded data

---

## 🚀 How to Run — Free, No Money Needed

### Prerequisites (all free)
- [Node.js 18+](https://nodejs.org/) — download and install
- A free [Anthropic account](https://console.anthropic.com/) — for the Claude API key
- A free [Google account](https://accounts.google.com/) — for Google Sheets

---

### Step 1 — Get your FREE Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up for a free account
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

> 💡 New accounts get free API credits — enough to run this project extensively.

---

### Step 2 — Set up Google Sheets (free database)

#### 2a. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) → Create a new blank spreadsheet
2. Name it **"Crystal People"**
3. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_ID/edit
   ```

#### 2b. Deploy the Apps Script Web App
1. In your Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy the entire contents of `google-apps-script/Code.gs` from this project
4. Paste it into the Apps Script editor
5. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
6. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** → Authorise when prompted
8. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

> 💡 If you skip this step, the app runs in **Demo Mode** using localStorage — still fully functional for testing!

---

### Step 3 — Configure environment variables

```bash
# In the project root (crystal-people/)
cp .env.example .env
```

Open `.env` and fill in:
```
CLAUDE_API_KEY=sk-ant-your-actual-key-here
VITE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

---

### Step 4 — Install and Run

```bash
# From the crystal-people/ root folder

# Install all dependencies
npm run install:all

# Start both the API proxy + React dev server
npm run dev
```

Open your browser at **http://localhost:5173** 🎉

---

## 🔑 Login Credentials

### Manager
| Email | Password |
|-------|----------|
| manager@crystal.com | manager123 |

### Employees (20 total)
| Email | Password |
|-------|----------|
| alice.johnson@crystal.com | emp123 |
| bob.williams@crystal.com | emp123 |
| carol.chen@crystal.com | emp123 |
| david.patel@crystal.com | emp123 |
| eva.martinez@crystal.com | emp123 |
| ... (16 more) | emp123 |

> All employees share the password `emp123`. The email format is `firstname.lastname@crystal.com`.

---

## 🗂️ Project Structure

```
crystal-people/
├── server.js                    # Express proxy for Claude API (avoids CORS)
├── package.json                 # Root — runs both server and client
├── .env.example                 # Environment variable template
├── google-apps-script/
│   └── Code.gs                  # Google Apps Script → paste into Apps Script editor
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx            # Login page (hardcoded users)
    │   │   ├── Navbar.jsx           # Top navigation bar
    │   │   ├── ManagerDashboard.jsx # Manager: review form + tabs
    │   │   ├── TeamOverview.jsx     # Manager: full team table view
    │   │   ├── HRAssistant.jsx      # Manager: AI chat interface
    │   │   ├── EmployeeDashboard.jsx# Employee: timeline + charts
    │   │   ├── ScoreSlider.jsx      # Reusable 1–5 score slider
    │   │   └── AIPanel.jsx          # Reusable Claude response panel
    │   ├── contexts/
    │   │   └── AuthContext.jsx      # Login/logout state
    │   ├── services/
    │   │   ├── sheetsService.js     # Google Sheets API + demo mode
    │   │   └── claudeService.js     # All 5 Claude AI features
    │   ├── config/
    │   │   └── users.js             # 21 hardcoded users
    │   └── utils/
    │       └── helpers.js           # Score colors, stats, date utils
    └── vite.config.js               # Vite config + API proxy
```

---

## 🏗️ Architecture

```
Browser (React + Vite :5173)
        │
        ├─── /api/claude ──► Express Proxy (:3001) ──► Anthropic Claude API
        │                    (hides API key from browser)
        │
        └─── VITE_SHEETS_API_URL ──► Google Apps Script ──► Google Sheets
```

- The **Express proxy** keeps your Claude API key out of the browser bundle
- **Google Apps Script** acts as a free serverless API for Google Sheets
- **Demo Mode** automatically activates when no Sheets URL is configured

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts (Line, Radar) |
| Icons | Lucide React |
| AI | Claude claude-sonnet-4-20250514 API |
| Database | Google Sheets via Apps Script |
| Proxy Server | Node.js + Express |
| Auth | Hardcoded users + sessionStorage |

---

## 📝 Notes

- **No money required** — Anthropic free tier + Google Sheets (completely free) + Node.js (free)
- **Demo Mode** works without any API keys — great for initial testing
- All 20 employee accounts use password `emp123`
- Reviews are stored one per employee per month (submitting again updates the existing row)
- The AI features gracefully degrade if the API key is missing
