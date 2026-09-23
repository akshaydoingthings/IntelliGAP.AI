import os
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from .nlp_extractor import (
    extract_text_from_bytes,
    extract_resume_metadata,
    extract_job_posting_details,
    extract_skills_from_text
)
from .gap_analyzer import analyze_skill_gap, simulate_skill_acquisition
from .roadmap_generator import generate_personalized_roadmap, export_roadmap_to_markdown
from .presets import get_all_presets, get_preset_by_id
from .taxonomy import get_skill_demand_trajectory, infer_skill_metadata, resolve_skill_name

app = FastAPI(
    title="Intelligent Skill Gap Analyzer API",
    description="NLP-powered skill gap analyzer, match scorer, and personalized roadmap generator.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_text: str
    job_title: Optional[str] = "Target Role"

class SimulateRequest(BaseModel):
    current_skills: List[str]
    acquired_skills: List[str]
    job_text: str

class AiAnalyzeSkillRequest(BaseModel):
    skill: str
    target_role: Optional[str] = "Target Role"


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Intelligent Skill Gap Analyzer"}


@app.get("/api/presets")
def list_presets():
    return get_all_presets()


@app.get("/api/presets/{preset_id}")
def get_preset(preset_id: str):
    return get_preset_by_id(preset_id)


@app.get("/api/skill-demand")
def get_skill_demand(skill: str = "Python"):
    if not skill or not skill.strip():
        raise HTTPException(status_code=400, detail="Skill name cannot be empty.")
    return get_skill_demand_trajectory(skill.strip())


@app.post("/api/ai-analyze-skill")
def ai_analyze_skill(payload: AiAnalyzeSkillRequest):
    skill_name = payload.skill.strip()
    if not skill_name:
        raise HTTPException(status_code=400, detail="Skill cannot be empty.")
    trajectory = get_skill_demand_trajectory(skill_name)
    meta = infer_skill_metadata(skill_name)
    return {
        "skill": trajectory["skill"],
        "category": trajectory["category"],
        "trajectory": trajectory,
        "difficulty": meta.get("difficulty", "Intermediate"),
        "learning_weeks": meta.get("learning_weeks", 2),
        "project_idea": meta.get("project_idea", f"Build an end-to-end production solution with {skill_name}."),
        "resources": meta.get("resources", []),
        "market_status": trajectory["market_status"],
        "market_insight": trajectory["market_insight"]
    }


@app.post("/api/parse-resume-file")
async def parse_resume_file(file: UploadFile = File(...)):
    contents = await file.read()
    raw_text = extract_text_from_bytes(contents, file.filename)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the uploaded file.")

    metadata = extract_resume_metadata(raw_text)
    metadata["raw_text"] = raw_text
    return metadata


@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not payload.job_text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")

    resume_data = extract_resume_metadata(payload.resume_text)
    job_data = extract_job_posting_details(payload.job_text)

    gap_analysis = analyze_skill_gap(resume_data, job_data)

    roadmap = generate_personalized_roadmap(
        critical_gaps=gap_analysis["critical_gaps"],
        secondary_gaps=gap_analysis["secondary_gaps"],
        job_title=payload.job_title or "Target Role"
    )

    markdown_roadmap = export_roadmap_to_markdown(
        roadmap=roadmap,
        candidate_name=resume_data.get("candidate_name", "Candidate"),
        job_title=payload.job_title or "Target Role"
    )

    # Pre-calculate 2008-2026 demand trajectories for top matched and gap skills
    key_skills = []
    for s in gap_analysis.get("matched_skills", [])[:4]:
        key_skills.append(s["name"])
    for s in gap_analysis.get("critical_gaps", [])[:4]:
        if s["name"] not in key_skills:
            key_skills.append(s["name"])
    for s in gap_analysis.get("secondary_gaps", [])[:2]:
        if s["name"] not in key_skills:
            key_skills.append(s["name"])

    demand_trajectories = {
        s_name: get_skill_demand_trajectory(s_name) for s_name in key_skills
    }

    return {
        "candidate": resume_data,
        "job": {
            "title": payload.job_title,
            "total_skills": job_data["total_skills_count"],
            "required_count": len(job_data["required_skills"]),
            "preferred_count": len(job_data["preferred_skills"]),
            "all_skills": job_data["all_skills"],
            "required_skills": job_data["required_skills"],
            "preferred_skills": job_data["preferred_skills"]
        },
        "gap_analysis": gap_analysis,
        "roadmap": roadmap,
        "markdown_roadmap": markdown_roadmap,
        "demand_trajectories": demand_trajectories
    }


@app.post("/api/simulate")
def simulate(payload: SimulateRequest):
    job_data = extract_job_posting_details(payload.job_text)
    simulated_result = simulate_skill_acquisition(
        current_candidate_skills=payload.current_skills,
        acquired_skills=payload.acquired_skills,
        job_data=job_data
    )
    return simulated_result


FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

    @app.get("/")
    def serve_frontend_root():
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return {"message": "Frontend index.html not found"}
