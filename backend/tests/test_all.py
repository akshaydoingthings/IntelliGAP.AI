"""
Automated Unit Tests for Intelligent Skill Gap Analyzer
Covers Taxonomy, NLP Extractor, Gap Analyzer, and Roadmap Generator.
"""

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
    """Verify alias mapping and canonical resolution."""
    assert resolve_skill_name("py") == "Python"
    assert resolve_skill_name("python") == "Python"
    assert resolve_skill_name("k8s") == "Kubernetes"
    assert resolve_skill_name("reactjs") == "React"
    assert resolve_skill_name("postgres") == "PostgreSQL"
    assert resolve_skill_name("ts") == "TypeScript"
    assert resolve_skill_name("nonexistent_skill_xyz") is None


def test_taxonomy_metadata_integrity():
    """Ensure all taxonomy entries have valid metadata."""
    for skill_name, data in SKILL_TAXONOMY.items():
        assert "category" in data
        assert "difficulty" in data
        assert "learning_weeks" in data
        assert "resources" in data
        assert isinstance(data["resources"], list)


def test_nlp_extraction_boundary_safety():
    """Ensure substring false positives are prevented (e.g., 'Go' in 'Good')."""
    sample_text = "I am a Good programmer and I have experience with Go and Python."
    skills = extract_skills_from_text(sample_text)
    
    assert "Python" in skills
    assert "Go" in skills
    # 'Good' should not trigger any false skill matches
    assert len(skills) == 2


def test_nlp_job_posting_context():
    """Verify required vs preferred context segregation."""
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
    """Verify score calculation and gap separation."""
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
    
    # Required match: 1/2 = 50%
    # Preferred match: 0/1 = 0%
    # Overall = 0.75 * 50 + 0.25 * 0 = 37.5%
    assert analysis["overall_match_score"] == 37.5
    
    matched_names = [s["name"] for s in analysis["matched_skills"]]
    critical_names = [s["name"] for s in analysis["critical_gaps"]]
    secondary_names = [s["name"] for s in analysis["secondary_gaps"]]

    assert "React" in matched_names
    assert "TypeScript" in critical_names
    assert "Docker" in secondary_names


def test_what_if_simulator():
    """Test what-if simulator increases score when acquiring skills."""
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
    """Test phased roadmap creation and markdown export."""
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
