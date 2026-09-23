
from typing import Dict, List, Any
from .taxonomy import SKILL_TAXONOMY

def generate_personalized_roadmap(
    critical_gaps: List[Dict[str, Any]], 
    secondary_gaps: List[Dict[str, Any]], 
    job_title: str = "Target Role"
) -> Dict[str, Any]:
    all_gaps = critical_gaps + secondary_gaps

    if not all_gaps:
        return {
            "total_weeks": 2,
            "total_estimated_hours": 20,
            "phases": [
                {
                    "phase_number": 1,
                    "title": "Interview & Portfolio Polish",
                    "weeks": "Weeks 1-2",
                    "goal": "You already have all the core required skills! Focus on interview prep and showcasing your best projects.",
                    "skills": [],
                    "milestones": [
                        "Review key system design and coding interview patterns",
                        "Align resume bullet points to highlight target role achievements",
                        "Conduct 2-3 mock technical interviews"
                    ]
                }
            ],
            "capstone_project": {
                "title": f"{job_title} Showcase Project",
                "description": "Demonstrate your end-to-end expertise by shipping a production-ready application with CI/CD and automated tests.",
                "deliverables": [
                    "Public GitHub repository with comprehensive README and architecture diagram",
                    "Live deployed web demo with monitoring and automated tests"
                ]
            }
        }


    phase1_skills = []
    phase2_skills = []
    phase3_skills = []

    for skill_item in all_gaps:
        name = skill_item["name"]
        meta = SKILL_TAXONOMY.get(name, {})
        difficulty = meta.get("difficulty", "Intermediate")

        skill_payload = {
            "name": name,
            "category": meta.get("category", "General"),
            "difficulty": difficulty,
            "learning_weeks": meta.get("learning_weeks", 2),
            "resources": meta.get("resources", []),
            "project_idea": meta.get("project_idea", f"Build a practical demo showcasing {name}.")
        }

        if difficulty == "Beginner":
            phase1_skills.append(skill_payload)
        elif difficulty == "Advanced":
            phase3_skills.append(skill_payload)
        else:

            if len(phase1_skills) < 2 and skill_payload["category"] in ["Languages", "Frontend"]:
                phase1_skills.append(skill_payload)
            else:
                phase2_skills.append(skill_payload)


    if not phase1_skills and phase2_skills:
        phase1_skills.append(phase2_skills.pop(0))
    if not phase3_skills and phase2_skills and len(phase2_skills) > 2:
        phase3_skills.append(phase2_skills.pop(-1))


    phase1 = {
        "phase_number": 1,
        "title": "Foundations & Core Prerequisites",
        "weeks": "Weeks 1 - 2",
        "estimated_hours_per_week": 12,
        "goal": "Master core syntax, development setup, and foundational principles for missing prerequisite technologies.",
        "skills": phase1_skills,
        "milestones": [
            "Complete interactive tutorials and documentation guides",
            "Set up local development workflow and linting/formatting rules",
            "Build 1 mini-project demonstrating core language/syntax concepts"
        ]
    }


    phase2 = {
        "phase_number": 2,
        "title": "Core Tooling & Specialized Competencies",
        "weeks": "Weeks 3 - 6",
        "estimated_hours_per_week": 15,
        "goal": "Develop production-level proficiency with primary frameworks, backend APIs, or cloud platforms.",
        "skills": phase2_skills,
        "milestones": [
            "Implement key design patterns and idiomatic practices",
            "Integrate database persistence, authentication, and state management",
            "Write comprehensive automated unit and integration tests"
        ]
    }


    phase3 = {
        "phase_number": 3,
        "title": "Advanced Architecture & Capstone Project",
        "weeks": "Weeks 7 - 10",
        "estimated_hours_per_week": 15,
        "goal": "Tackle complex system design, scalability challenges, and integrate all acquired skills into a flagship project.",
        "skills": phase3_skills,
        "milestones": [
            "Architect an end-to-end distributed or full-stack application",
            "Deploy containerized workloads to cloud infrastructure with CI/CD",
            "Benchmark and optimize latency, query execution, and throughput"
        ]
    }


    phase4 = {
        "phase_number": 4,
        "title": "Interview Readiness & Portfolio Showcase",
        "weeks": "Weeks 11 - 12",
        "estimated_hours_per_week": 10,
        "goal": "Translate your newly gained skills into high-converting resume bullets, GitHub artifacts, and interview confidence.",
        "skills": [],
        "milestones": [
            f"Add quantified metrics for newly acquired skills ({', '.join(s['name'] for s in all_gaps[:4])}) to your resume",
            "Publish comprehensive README with architecture diagram and live demo link",
            "Practice technical interview questions and scenario-based system design walkthroughs"
        ]
    }


    featured_skills = [s["name"] for s in all_gaps[:3]]
    capstone = {
        "title": f"Full-Stack {job_title} Capstone Platform",
        "description": f"An end-to-end production-grade application integrating {', '.join(featured_skills) if featured_skills else 'core role competencies'} with full CI/CD, database persistence, and clean documentation.",
        "deliverables": [
            "Clean architecture codebase with modular services and dependency injection",
            "Automated test suite (unit, integration, and E2E) with >85% coverage",
            "Dockerized deployment pipeline with automated GitHub Actions workflow",
            "Interactive documentation with live OpenAPI/Swagger or Storybook specs"
        ]
    }

    total_weeks = 12
    total_hours = (2 * 12) + (4 * 15) + (4 * 15) + (2 * 10)

    return {
        "total_weeks": total_weeks,
        "total_estimated_hours": total_hours,
        "phases": [phase1, phase2, phase3, phase4],
        "capstone_project": capstone
    }


def export_roadmap_to_markdown(roadmap: Dict[str, Any], candidate_name: str, job_title: str) -> str:
    lines = [
        f"# Personalized Learning Roadmap for {candidate_name}",
        f"**Target Role**: {job_title} | **Duration**: {roadmap.get('total_weeks', 12)} Weeks | **Total Effort**: ~{roadmap.get('total_estimated_hours', 160)} Hours\n",
        "---\n"
    ]

    for phase in roadmap.get("phases", []):
        lines.append(f"## Phase {phase.get('phase_number')}: {phase.get('title')} ({phase.get('weeks')})")
        lines.append(f"**Goal**: {phase.get('goal')}\n")

        skills = phase.get("skills", [])
        if skills:
            lines.append("### Skills to Master:")
            for s in skills:
                lines.append(f"- **{s['name']}** ({s['category']} | {s['difficulty']})")
                lines.append(f"  - *Project Exercise*: {s['project_idea']}")
                for r in s.get("resources", []):
                    free_badge = "Free" if r.get("free") else "Paid"
                    lines.append(f"  - [{r['title']}]({r['url']}) ({r['type']} • {free_badge})")
            lines.append("")

        lines.append("### Key Milestones:")
        for m in phase.get("milestones", []):
            lines.append(f"- [ ] {m}")
        lines.append("\n---\n")

    capstone = roadmap.get("capstone_project")
    if capstone:
        lines.append(f"## 🏆 Capstone Project: {capstone.get('title')}")
        lines.append(f"{capstone.get('description')}\n")
        lines.append("### Deliverables:")
        for d in capstone.get("deliverables", []):
            lines.append(f"- [ ] {d}")

    return "\n".join(lines)
