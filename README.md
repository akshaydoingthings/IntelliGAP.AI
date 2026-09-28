<h1 align="center">Hi 👋, I'm Akshay</h1>
<h3 align="center">Student Developer · Building AI-powered career tools 🚀</h3>

<br/>

<div align="right">
  <h3>Profile Views :-</h3>
  <img src="https://komarev.com/ghpvc/?username=akshaydoingthings&label=Profile%20views&color=0e75b6&style=flat" alt="akshaydoingthings" />
</div>

<br/>

<p><img align="right" src="https://github.com/Adam-pw/Adam-pw/blob/main/animation_500_kxa883sd.gif" alt="coding animation" width="380"/></p>

<ul>
  <li>
    <p>🌱 I'm currently learning <strong>Full-Stack Development, AI/ML integrations, and developer tooling</strong></p>
  </li>
  <li>
    <p>🔭 I'm currently working on <a href="https://github.com/akshaydoingthings/IntelliGAP.AI"><strong>IntelliGAP.AI</strong></a> — an AI-powered career skill-gap analyzer &amp; roadmap engine</p>
  </li>
  <li>
    <p>💬 Ask me about <strong>Python, FastAPI, Vanilla JS, NLP, and resume parsing</strong></p>
  </li>
  <li>
    <p>📫 How to reach me: open an issue or discussion on this repo!</p>
  </li>
  <li>
    <p>⚡ Fun fact: I built a full AI career tool with <strong>zero frontend frameworks</strong> — just semantic HTML, Vanilla CSS &amp; JS.</p>
  </li>
</ul>

<br clear="both"/>

---

# 🚀 IntelliGAP.AI — Intelligent Skill Gap Analyzer & Career Roadmap Engine

> An end-to-end AI developer tool that analyzes technical resumes against target job postings, computes role-fit match scores, isolates critical competency gaps, and builds actionable **12-week personalized learning roadmaps**.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js"/>
  <img src="https://img.shields.io/badge/OpenRouter-AI-8B5CF6?style=flat-square" alt="OpenRouter"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"/>
</p>

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 📄 **Resume Intake** | Upload `.pdf`, `.docx`, `.txt` or paste raw text |
| 🎯 **Match Scoring** | Role-fit percentage with matched vs. gap breakdown |
| 🔍 **5-Stage Analysis Stepper** | *Reading → Comparing → Mapping → Gaps → Roadmap* |
| 🧪 **"What-If" Simulator** | Live skill toggle showing projected match score gains |
| 📡 **Domain Radar Chart** | Multi-axis technical proficiency vs. job requirements |
| 🗺️ **12-Week Roadmap** | Phased milestones: Foundations → Core → Applied → Interview |
| 📈 **Market Demand Insights** | Historical & projected tech skill trajectories (2008–2026) |
| 🏗️ **Capstone Blueprint** | Production-grade project spec with skills & deliverables |
| 🌙 **Dark / Light Theme** | High-contrast dark mode & paper light mode |

---

## 🛠️ Architecture & Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **NLP & Taxonomy**: RapidFuzz fuzzy matching + curated 500+ skill taxonomy
- **AI Integration**: OpenRouter / GPT-4o async client for deep career analysis
- **Server**: Uvicorn ASGI with hot reload

### Frontend
- **Core**: Semantic HTML5 + Vanilla ES6+ JavaScript *(zero framework bloat)*
- **Styling**: Vanilla CSS3 with custom properties, inspired by Linear / Vercel
- **Typography**: Inter & JetBrains Mono (Google Fonts)
- **Charts**: Chart.js for radar & demand curve visualizations

---

## 📁 Repository Structure

```text
skill-gap-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints & static file serving
│   │   ├── nlp_extractor.py     # Resume extraction & skill parser
│   │   ├── taxonomy.py          # 500+ skill taxonomy & demand trajectories
│   │   ├── gap_analyzer.py      # Match scoring & gap categorization
│   │   ├── roadmap_generator.py # 12-week roadmap & capstone generator
│   │   ├── presets.py           # Benchmark role profiles & personas
│   │   └── ai_service.py        # OpenRouter AI career intelligence
│   ├── tests/
│   │   └── test_all.py          # Pytest test suite
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── index.html               # Semantic UI — 5-stage stepper & results dashboard
│   ├── styles.css               # Developer-focused CSS design system
│   ├── app.js                   # Reactive UI logic, Chart.js & API calls
│   └── package.json
├── package.json                 # Root npm scripts
└── README.md
```

---

## 🚀 Quickstart

### Prerequisites
- Python 3.10+
- Git

### Run the App

```bash
# Clone the repo
git clone https://github.com/akshaydoingthings/IntelliGAP.AI.git
cd IntelliGAP.AI

# Create & activate virtualenv
python -m venv backend/venv
backend\venv\Scripts\activate       # Windows
# source backend/venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

Or with npm:
```bash
npm run dev
```

### Open in Browser

- **App** → [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Docs** → [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🤝 Connect

<p align="left">
  <!-- GitHub (kept as-is) -->
  <a href="https://github.com/akshaydoingthings" target="_blank">
    <img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg" alt="GitHub" height="30" width="40" />
  </a>
  &nbsp;
  <!-- LinkedIn -->
  <a href="https://linkedin.com/in/akshaydoingthings" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg" alt="LinkedIn" height="30" width="40" style="filter: invert(29%) sepia(97%) saturate(1100%) hue-rotate(181deg) brightness(90%) contrast(97%);" />
  </a>
  &nbsp;
  <!-- Twitter / X -->
  <a href="https://twitter.com/akshaydoingthings" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" alt="Twitter / X" height="30" width="40" style="filter: invert(0%) sepia(0%) saturate(0%) brightness(0%) contrast(100%);" />
  </a>
  &nbsp;
  <!-- Dev.to -->
  <a href="https://dev.to/akshaydoingthings" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/devdotto.svg" alt="Dev.to" height="30" width="40" style="filter: invert(0%) sepia(0%) saturate(0%) brightness(0%) contrast(100%);" />
  </a>
  &nbsp;
  <!-- LeetCode -->
  <a href="https://leetcode.com/akshaydoingthings" target="_blank">
    <img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg" alt="LeetCode" height="30" width="40" style="filter: invert(63%) sepia(81%) saturate(500%) hue-rotate(2deg) brightness(103%) contrast(101%);" />
  </a>
</p>

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/akshaydoingthings"><strong>Akshay</strong></a>
</p>
