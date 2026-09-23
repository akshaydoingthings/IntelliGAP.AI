
import pytest
from app.taxonomy import resolve_skill_name, get_skill_metadata, SKILL_TAXONOMY, ALIAS_INDEX
from app.nlp_extractor import (
    extract_skills_from_text,
    extract_job_posting_details,
    extract_resume_metadata
)
from app.gap_analyzer import analyze_skill_gap, simulate_skill_acquisition
from app.roadmap_generator import generate_personalized_roadmap, export_roadmap_to_markdown


def test_taxonomy_alias_resolution():
    assert resolve_skill_name("py") == "Python"
    assert resolve_skill_name("python") == "Python"
    assert resolve_skill_name("k8s") == "Kubernetes"
    assert resolve_skill_name("reactjs") == "React"
    assert resolve_skill_name("postgres") == "PostgreSQL"
    assert resolve_skill_name("ts") == "TypeScript"
    assert resolve_skill_name("nonexistent_skill_xyz") is None


def test_taxonomy_metadata_integrity():
    for skill_name, data in SKILL_TAXONOMY.items():
        assert "category" in data
        assert "difficulty" in data
        assert "learning_weeks" in data
        assert "resources" in data
        assert isinstance(data["resources"], list)


def test_nlp_extraction_boundary_safety():
    sample_text = "I am a Good programmer and I have experience with Go and Python."
    skills = extract_skills_from_text(sample_text)

    assert "Python" in skills
    assert "Go" in skills

    assert len(skills) == 2


def test_nlp_job_posting_context():
    job_text = """
    Requirements:
    - 3+ years experience with React and TypeScript
    - Strong knowledge of PostgreSQL

    Nice to have:
    - Experience with Docker and AWS
    """
    parsed = extract_job_posting_details(job_text)
    req_names = [s["name"] for s in parsed["required_skills"]]
    pref_names = [s["name"] for s in parsed["preferred_skills"]]

    assert "React" in req_names
    assert "TypeScript" in req_names
    assert "PostgreSQL" in req_names
    assert "Docker" in pref_names
    assert "AWS" in pref_names


def test_gap_analyzer_scoring():
    resume_data = {
        "skills": {
            "React": {"name": "React"},
            "JavaScript": {"name": "JavaScript"}
        }
    }
    job_data = {
        "all_skills": {
            "React": {"name": "React"},
            "TypeScript": {"name": "TypeScript"},
            "Docker": {"name": "Docker"}
        },
        "required_skills": [
            {"name": "React"},
            {"name": "TypeScript"}
        ],
        "preferred_skills": [
            {"name": "Docker"}
        ]
    }

    analysis = analyze_skill_gap(resume_data, job_data)


    assert analysis["overall_match_score"] == 37.5

    matched_names = [s["name"] for s in analysis["matched_skills"]]
    critical_names = [s["name"] for s in analysis["critical_gaps"]]
    secondary_names = [s["name"] for s in analysis["secondary_gaps"]]

    assert "React" in matched_names
    assert "TypeScript" in critical_names
    assert "Docker" in secondary_names


def test_what_if_simulator():
    current_skills = ["React", "JavaScript"]
    acquired_skills = ["TypeScript"]
    job_data = {
        "all_skills": {
            "React": {"name": "React"},
            "TypeScript": {"name": "TypeScript"},
            "Docker": {"name": "Docker"}
        },
        "required_skills": [
            {"name": "React"},
            {"name": "TypeScript"}
        ],
        "preferred_skills": [
            {"name": "Docker"}
        ]
    }

    initial = analyze_skill_gap({"skills": {s: {"name": s} for s in current_skills}}, job_data)
    simulated = simulate_skill_acquisition(current_skills, acquired_skills, job_data)

    assert simulated["overall_match_score"] > initial["overall_match_score"]
    assert "TypeScript" in [s["name"] for s in simulated["matched_skills"]]


def test_roadmap_generator_and_export():
    critical_gaps = [{"name": "TypeScript"}, {"name": "FastAPI"}]
    secondary_gaps = [{"name": "Docker"}]

    roadmap = generate_personalized_roadmap(critical_gaps, secondary_gaps, "Full-Stack Engineer")

    assert roadmap["total_weeks"] == 12
    assert len(roadmap["phases"]) == 4
    assert roadmap["capstone_project"] is not None

    md = export_roadmap_to_markdown(roadmap, "John Doe", "Full-Stack Engineer")
    assert "Personalized Learning Roadmap for John Doe" in md
    assert "Phase 1:" in md
    assert "Phase 2:" in md
    assert "Phase 3:" in md
    assert "Phase 4:" in md
    assert "Capstone Project" in md


def test_skill_demand_trajectory_benchmark_and_custom():
    from app.taxonomy import get_skill_demand_trajectory, YEARS_SPAN

    # Test benchmark skill
    py_traj = get_skill_demand_trajectory("Python")
    assert py_traj["skill"] == "Python"
    assert len(py_traj["years"]) == 19  # 2008 through 2026
    assert py_traj["years"][0] == 2008
    assert py_traj["years"][-1] == 2026
    assert len(py_traj["demand_scores"]) == 19
    assert py_traj["current_2026_demand"] == 100
    assert py_traj["peak_year"] == 2026

    # Test custom unlisted skill
    custom_traj = get_skill_demand_trajectory("DuckDB")
    assert custom_traj["skill"] == "Duckdb" or custom_traj["skill"] == "DuckDB"
    assert len(custom_traj["years"]) == 19
    assert len(custom_traj["demand_scores"]) == 19
    assert custom_traj["current_2026_demand"] > 0
    assert "market_status" in custom_traj
    assert "market_insight" in custom_traj


def test_open_ended_skill_extraction():
    text = "Candidate skills: React, TypeScript, Bun, DuckDB, and Vite."
    skills = extract_skills_from_text(text)

    assert "React" in skills
    assert "TypeScript" in skills
    # Custom unlisted technologies extracted via open-ended engine
    assert "DuckDB" in skills or "Duckdb" in skills
    assert "Bun" in skills
    assert "Vite" in skills


def test_skill_demand_endpoints():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)

    # Test GET /api/skill-demand
    res1 = client.get("/api/skill-demand?skill=React")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["skill"] == "React"
    assert len(data1["demand_scores"]) == 19
    assert data1["current_2026_demand"] == 97

    # Test POST /api/ai-analyze-skill
    res2 = client.post("/api/ai-analyze-skill", json={"skill": "LangChain"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["skill"] == "LangChain"
    assert data2["category"] == "AI/Machine Learning"
    assert "trajectory" in data2
    assert "project_idea" in data2
