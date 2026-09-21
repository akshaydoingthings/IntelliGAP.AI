"""
Intelligent Skill Gap Analyzer - FastAPI Application
Main entry point for API endpoints, file uploads, analysis workflows,
and static frontend serving.
"""

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

app = FastAPI(
    title="Intelligent Skill Gap Analyzer API",
    description="NLP-powered skill gap analyzer, match scorer, and personalized roadmap generator.",
    version="1.0.0"
)

# Enable CORS for local development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schemas
class AnalyzeRequest(BaseModel):
    resume_text: str
    job_text: str
    job_title: Optional[str] = "Target Role"

class SimulateRequest(BaseModel):
    current_skills: List[str]
    acquired_skills: List[str]
    job_text: str


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Intelligent Skill Gap Analyzer"}


@app.get("/api/presets")
def list_presets():
    """Returns curated demonstration presets."""
    return get_all_presets()


@app.get("/api/presets/{preset_id}")
def get_preset(preset_id: str):
    """Returns a specific preset by ID."""
    return get_preset_by_id(preset_id)


@app.post("/api/parse-resume-file")
async def parse_resume_file(file: UploadFile = File(...)):
    """Extracts text and skills from an uploaded resume file (.pdf, .docx, .txt)."""
    contents = await file.read()
    raw_text = extract_text_from_bytes(contents, file.filename)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the uploaded file.")
    
    metadata = extract_resume_metadata(raw_text)
    metadata["raw_text"] = raw_text
    return metadata


@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    """
    Core analysis endpoint:
    - Parses resume and job text
    - Identifies candidate skills & job required/preferred skills
    - Computes match percentage, category proficiencies, and gaps
    - Generates personalized 12-week learning roadmap with curated resources
    """
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
        "markdown_roadmap": markdown_roadmap
    }


@app.post("/api/simulate")
def simulate(payload: SimulateRequest):
    """
    Simulates match score changes when candidate acquires additional skills.
    """
    job_data = extract_job_posting_details(payload.job_text)
    simulated_result = simulate_skill_acquisition(
        current_candidate_skills=payload.current_skills,
        acquired_skills=payload.acquired_skills,
        job_data=job_data
    )
    return simulated_result


# Mount frontend static files
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

    @app.get("/")
    def serve_frontend_root():
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return {"message": "Frontend index.html not found"}
