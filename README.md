# 🚀 Intelligent Skill Gap Analyzer & AI Career Roadmap Engine

An end-to-end, full-stack application that analyzes resumes and career profiles against target tech roles, calculates precision job-fit scores, identifies missing critical skills, and generates personalized, milestone-driven learning roadmaps with curated resources.

---

## 🌟 Key Features

- **NLP-Powered Skill Extraction**: Automatically parses resumes, user profiles, and job descriptions using custom taxonomy matching, regex, and fuzzy string matching.
- **Precision Gap Analysis**: Categorizes skills into **Proficient**, **In Progress / Foundational**, and **Missing**, weighted by core importance and secondary prerequisites.
- **Interactive Match Scoring**: Dynamic radar & fit gauges showing percentage match against target industry roles.
- **Custom Milestone Roadmaps**: Generates 4-to-12 week structured learning plans with milestone projects, free tutorials, and industry certifications.
- **Industry Role Presets**: Instant comparison against preset benchmark roles (Full Stack Developer, Data Scientist, DevOps / Cloud Engineer, Machine Learning Engineer, Cyber Security Analyst).
- **Modern Glassmorphic UI**: Fast, responsive single-page web interface with real-time feedback, interactive tags, and dark-mode aesthetics.

---

## 🛠️ Architecture & Tech Stack

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **NLP / Text Processing**: RapidFuzz, Regular Expressions, Custom Skill Taxonomy
- **Server**: Uvicorn ASGI
- **Testing**: Pytest

### **Frontend**
- **Core**: Vanilla HTML5, Modern CSS3 (Glassmorphism design tokens, CSS Grid/Flexbox), ES6+ JavaScript
- **Visualization**: Interactive Canvas / SVG visual gauges and roadmap timelines

---

## 📁 Project Structure

```text
skill-gap-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints & static file mount
│   │   ├── nlp_extractor.py     # Skill extraction & text parsing engine
│   │   ├── taxonomy.py          # Curated skill hierarchy & role mappings
│   │   ├── gap_analyzer.py      # Job fit scoring & missing skill detection
│   │   ├── roadmap_generator.py # Milestone & learning roadmap generator
│   │   └── presets.py           # Pre-configured target role templates
│   ├── tests/
│   │   └── test_all.py          # Pytest automated test suite
│   └── requirements.txt         # Python backend dependencies
├── frontend/
│   ├── index.html               # Main UI structure & accessibility tags
│   ├── styles.css               # Design system, glassmorphism & responsive styles
│   └── app.js                   # Client-side reactivity, API integration & rendering
├── .gitignore                   # Ignored files (caches, env, virtualenvs)
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10 or higher
- Git

### 2. Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 3. Accessing the Application

Once the server is running, open your browser and visit:
```
http://127.0.0.1:8000
```
Interactive API documentation is also available at:
```
http://127.0.0.1:8000/docs
```

---

## 🧪 Running Tests

Run the backend test suite with `pytest`:
```bash
cd backend
pytest tests/
```

---

## 📄 License

This project is licensed under the MIT License.
