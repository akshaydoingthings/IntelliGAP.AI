"""
OpenRouter AI Service for Skill Gap Analyzer.

Provides AI-powered skill extraction, career advice, and roadmap generation
by calling LLMs (GPT-4o, Claude, etc.) through OpenRouter's unified API.
"""

import os
import json
import httpx
from pathlib import Path
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load API key from ~/.env
load_dotenv(Path.home() / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-4o"


async def _call_openrouter(
    messages: List[Dict[str, str]],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 2000,
) -> Optional[str]:
    """Make a request to OpenRouter and return the assistant's reply text."""
    if not OPENROUTER_API_KEY:
        return None

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://skill-gap-analyzer.app",
        "X-Title": "Skill Gap Analyzer",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            OPENROUTER_BASE_URL, headers=headers, json=payload
        )
        response.raise_for_status()
        data = response.json()

    choices = data.get("choices", [])
    if choices:
        return choices[0].get("message", {}).get("content", "")
    return None


def _parse_json_response(text: str) -> Optional[Dict]:
    """Attempt to extract a JSON object from LLM response text."""
    if not text:
        return None
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Try extracting from markdown code fence
    import re
    match = re.search(r"```(?:json)?\s*\n?(.*?)```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass
    return None


async def ai_extract_skills(text: str, context: str = "resume") -> Optional[Dict[str, Any]]:
    """
    Use AI to extract skills from resume or job description text.
    Returns structured skill data with categories and proficiency levels.
    """
    system_prompt = """You are an expert technical recruiter and skill analyst. 
Extract all technical and professional skills from the provided text.

Return a JSON object with this exact structure:
{
  "skills": [
    {
      "name": "Skill Name",
      "category": "Languages|Frontend|Backend|DevOps|Cloud|Data|AI/ML|Testing|Databases|General",
      "proficiency": "Beginner|Intermediate|Advanced|Expert",
      "confidence": 0.95
    }
  ],
  "summary": "Brief 1-2 sentence summary of the candidate's/role's technical profile"
}

Be thorough — catch skills mentioned implicitly (e.g., "built REST APIs" implies REST, API Design).
Only return valid JSON, no other text."""

    user_prompt = f"Extract all skills from this {context}:\n\n{text[:4000]}"

    reply = await _call_openrouter(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=2000,
    )

    return _parse_json_response(reply)


async def ai_career_advice(
    matched_skills: List[str],
    missing_skills: List[str],
    extra_skills: List[str],
    job_title: str,
    match_score: float,
) -> Optional[Dict[str, Any]]:
    """
    Generate personalized AI career advice based on gap analysis results.
    """
    system_prompt = """You are a world-class career coach specializing in tech careers.
Given a candidate's skill gap analysis, provide actionable, personalized career advice.

Return a JSON object with this exact structure:
{
  "executive_summary": "2-3 sentence high-level assessment",
  "strengths_analysis": "Analysis of the candidate's strongest areas and competitive advantages",
  "priority_actions": [
    {
      "action": "Specific action to take",
      "reasoning": "Why this matters",
      "timeline": "Estimated time (e.g., '1-2 weeks')",
      "impact": "High|Medium|Low"
    }
  ],
  "interview_tips": [
    "Specific tip for interviewing for this role"
  ],
  "hidden_advantages": "Skills the candidate has that aren't required but give them an edge",
  "risk_factors": "Potential challenges or areas of concern",
  "salary_positioning": "How to leverage their profile in salary negotiations"
}

Be specific, actionable, and encouraging. Only return valid JSON."""

    user_prompt = f"""Analyze this candidate's fit for **{job_title}**:

- **Match Score**: {match_score}%
- **Matched Skills** ({len(matched_skills)}): {', '.join(matched_skills[:20])}
- **Missing Required Skills** ({len(missing_skills)}): {', '.join(missing_skills[:15])}
- **Extra Skills** ({len(extra_skills)}): {', '.join(extra_skills[:15])}

Provide personalized career advice."""

    reply = await _call_openrouter(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=2500,
    )

    return _parse_json_response(reply)


async def ai_learning_roadmap(
    missing_skills: List[str],
    matched_skills: List[str],
    job_title: str,
) -> Optional[Dict[str, Any]]:
    """
    Generate a detailed, AI-powered personalized learning roadmap.
    """
    system_prompt = """You are an expert learning architect who designs optimal skill acquisition paths.
Create a detailed, personalized learning roadmap for a tech professional.

Return a JSON object with this exact structure:
{
  "title": "Roadmap title",
  "total_duration": "e.g., 8-10 weeks",
  "weekly_commitment": "e.g., 10-15 hours/week",
  "phases": [
    {
      "phase": 1,
      "name": "Phase name",
      "duration": "e.g., Weeks 1-2",
      "focus": "What this phase covers",
      "skills": [
        {
          "name": "Skill name",
          "why": "Why learn this now",
          "best_resource": "Specific course/tutorial name + URL",
          "project": "Hands-on project to build",
          "time_estimate": "e.g., 15-20 hours"
        }
      ],
      "milestone": "What you'll be able to do after this phase"
    }
  ],
  "capstone_project": {
    "title": "Project name",
    "description": "What to build",
    "skills_demonstrated": ["skill1", "skill2"],
    "portfolio_value": "Why this impresses recruiters"
  },
  "daily_routine": "Suggested daily learning routine",
  "motivation_tip": "Encouragement and mindset advice"
}

Make resources specific and real. Prioritize free resources. Only return valid JSON."""

    user_prompt = f"""Create a learning roadmap for someone targeting **{job_title}**.

**Skills they already have**: {', '.join(matched_skills[:20])}
**Skills they need to learn**: {', '.join(missing_skills[:15])}

Design an efficient roadmap that leverages their existing skills to learn the missing ones faster."""

    reply = await _call_openrouter(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=3000,
    )

    return _parse_json_response(reply)


async def ai_skill_deep_dive(skill_name: str, target_role: str) -> Optional[Dict[str, Any]]:
    """
    Get AI-powered deep analysis of a specific skill — market demand,
    learning path, and career impact.
    """
    system_prompt = """You are a tech industry analyst and career advisor.
Provide a comprehensive analysis of the specified skill.

Return a JSON object with this exact structure:
{
  "skill": "Skill name",
  "market_analysis": {
    "demand_level": "Very High|High|Medium|Growing|Niche",
    "trend": "Rising|Stable|Declining|Emerging",
    "avg_salary_impact": "e.g., +15-25% salary premium",
    "top_companies_hiring": ["Company1", "Company2", "Company3"],
    "complementary_skills": ["skill1", "skill2", "skill3"]
  },
  "learning_path": {
    "prerequisites": ["What you should know first"],
    "beginner_resources": [
      {"title": "Resource name", "url": "URL", "type": "Course|Tutorial|Book", "free": true}
    ],
    "intermediate_project": "Project idea for intermediate learners",
    "advanced_mastery": "What advanced mastery looks like",
    "estimated_time_to_proficiency": "e.g., 4-6 weeks"
  },
  "career_impact": "How this skill changes career trajectory for the target role",
  "insider_tip": "Non-obvious advice about this skill from industry perspective"
}

Be specific with real resources and URLs. Only return valid JSON."""

    user_prompt = f"Deep dive analysis of **{skill_name}** for someone targeting **{target_role}**."

    reply = await _call_openrouter(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=2000,
    )

    return _parse_json_response(reply)


def is_ai_available() -> bool:
    """Check if the OpenRouter API key is configured."""
    return bool(OPENROUTER_API_KEY)
