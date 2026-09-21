"""
Skill Gap Analysis Engine
Computes match scores, categorizes gaps into critical vs secondary,
calculates category-level proficiencies, and generates radar chart datasets.
"""

from typing import Dict, List, Set, Any
from .taxonomy import SKILL_TAXONOMY, get_categories

def analyze_skill_gap(resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs comprehensive gap analysis between candidate skills and job requirements.
    """
    candidate_skills: Set[str] = set(resume_data.get("skills", {}).keys())
    
    # Extract required vs preferred job skills
    required_skills_list = job_data.get("required_skills", [])
    preferred_skills_list = job_data.get("preferred_skills", [])
    
    required_names: Set[str] = set(s["name"] for s in required_skills_list)
    preferred_names: Set[str] = set(s["name"] for s in preferred_skills_list)
    
    all_job_skills: Set[str] = set(job_data.get("all_skills", {}).keys())
    
    # If job data didn't separate them, treat all as required
    if not required_names and not preferred_names and all_job_skills:
        required_names = all_job_skills

    # 1. Matches and Gaps
    matched_skills = sorted(list(candidate_skills.intersection(all_job_skills)))
    missing_required = sorted(list(required_names - candidate_skills))
    missing_preferred = sorted(list(preferred_names - candidate_skills))
    extra_candidate_skills = sorted(list(candidate_skills - all_job_skills))

    # 2. Match Score Computation
    # Weight: 75% for required skills, 25% for preferred skills
    req_match_pct = 100.0
    if required_names:
        req_match_pct = (len(required_names - set(missing_required)) / len(required_names)) * 100.0

    pref_match_pct = 100.0
    if preferred_names:
        pref_match_pct = (len(preferred_names - set(missing_preferred)) / len(preferred_names)) * 100.0

    if required_names and preferred_names:
        overall_match_score = round(0.75 * req_match_pct + 0.25 * pref_match_pct, 1)
    elif required_names:
        overall_match_score = round(req_match_pct, 1)
    elif all_job_skills:
        overall_match_score = round((len(matched_skills) / len(all_job_skills)) * 100.0, 1)
    else:
        overall_match_score = 0.0

    # 3. Category Breakdown and Radar Chart Data
    categories = get_categories()
    category_breakdown = []
    radar_labels = []
    radar_candidate_scores = []
    radar_required_scores = []

    for cat in categories:
        # Skills in this category for job
        job_skills_in_cat = [s for s in all_job_skills if SKILL_TAXONOMY.get(s, {}).get("category") == cat]
        cand_skills_in_cat = [s for s in candidate_skills if SKILL_TAXONOMY.get(s, {}).get("category") == cat]
        
        # Only include category in radar if job requires it or candidate has skills in it
        if job_skills_in_cat or cand_skills_in_cat:
            matched_in_cat = [s for s in cand_skills_in_cat if s in job_skills_in_cat]
            if job_skills_in_cat:
                cand_pct = round((len(matched_in_cat) / len(job_skills_in_cat)) * 100.0, 1)
                req_pct = 100.0
            else:
                cand_pct = 100.0
                req_pct = 0.0

            radar_labels.append(cat)
            radar_candidate_scores.append(cand_pct)
            radar_required_scores.append(req_pct)

            category_breakdown.append({
                "category": cat,
                "job_skills": job_skills_in_cat,
                "candidate_skills": cand_skills_in_cat,
                "matched_skills": matched_in_cat,
                "missing_skills": [s for s in job_skills_in_cat if s not in cand_skills_in_cat],
                "score_pct": cand_pct
            })

    # 4. Readiness Rating and Strategic Advice
    if overall_match_score >= 85:
        readiness = "Ready to Apply (High Fit)"
        readiness_badge = "success"
        advice = "Your profile is a strong match for this role! Focus on articulating your project achievements and preparing for behavioral/system design interviews."
    elif overall_match_score >= 65:
        readiness = "Competitive Match (Targeted Upskilling: 2-3 Weeks)"
        readiness_badge = "primary"
        advice = "You possess the core foundational skills. Bridging the critical missing skills below will significantly boost interview conversion."
    elif overall_match_score >= 45:
        readiness = "Moderate Fit (Structured Upskilling: 1-2 Months)"
        readiness_badge = "warning"
        advice = "You have relevant transferable skills, but key technical requirements are missing. Follow the personalized roadmap to build required competencies."
    else:
        readiness = "Foundational Transition (2-3 Months)"
        readiness_badge = "danger"
        advice = "This role requires substantial new tooling and domain competencies. Focus first on Phase 1 foundational prerequisites."

    # 5. Build enriched skill objects with metadata
    def enrich_skills(skill_names: List[str]) -> List[Dict[str, Any]]:
        enriched = []
        for name in skill_names:
            meta = SKILL_TAXONOMY.get(name, {})
            enriched.append({
                "name": name,
                "category": meta.get("category", "General"),
                "difficulty": meta.get("difficulty", "Intermediate"),
                "learning_weeks": meta.get("learning_weeks", 2),
                "project_idea": meta.get("project_idea", "")
            })
        return enriched

    return {
        "overall_match_score": overall_match_score,
        "readiness": readiness,
        "readiness_badge": readiness_badge,
        "advice": advice,
        "matched_skills": enrich_skills(matched_skills),
        "critical_gaps": enrich_skills(missing_required),
        "secondary_gaps": enrich_skills(missing_preferred),
        "extra_candidate_skills": enrich_skills(extra_candidate_skills),
        "total_required_count": len(required_names),
        "total_matched_count": len(matched_skills),
        "total_missing_count": len(missing_required) + len(missing_preferred),
        "category_breakdown": category_breakdown,
        "radar_chart_data": {
            "labels": radar_labels,
            "candidate": radar_candidate_scores,
            "required": radar_required_scores
        }
    }


def simulate_skill_acquisition(current_candidate_skills: List[str], acquired_skills: List[str], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates what happens to the match score if the candidate learns specified missing skills.
    """
    simulated_skills_set = set(current_candidate_skills).union(set(acquired_skills))
    
    simulated_resume_data = {
        "skills": {s: {"name": s} for s in simulated_skills_set}
    }
    
    return analyze_skill_gap(simulated_resume_data, job_data)
