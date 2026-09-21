"""
NLP Skill Extraction Engine
Extracts skills, context (required vs nice-to-have), experience mentions,
and document text from resumes and job postings.
"""

import re
import io
from typing import Dict, List, Set, Tuple, Optional, Any
from .taxonomy import SKILL_TAXONOMY, ALIAS_INDEX, resolve_skill_name

# Regular expressions for text extraction and document sections
REQUIRED_SECTION_PATTERNS = [
    r"(?:required|requirements|must\s+have|minimum\s+qualifications|basic\s+qualifications|what\s+you(?:'ll|\s+will)\s+need|what\s+we(?:'re|\s+are)\s+looking\s+for)",
]

PREFERRED_SECTION_PATTERNS = [
    r"(?:preferred|nice\s+to\s+have|bonus|plus|desired\s+qualifications|optional|good\s+to\s+have)",
]

YEARS_EXP_PATTERN = re.compile(
    r"(\d+(?:\.\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\b)\+?\s*(?:-\s*\d+\s*)?(?:years?|yrs?)(?:\s+of)?\s+experience(?:\s+with|\s+in)?\s+([A-Za-z0-9#\+\.\s/]+)",
    re.IGNORECASE
)

EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b")
PHONE_PATTERN = re.compile(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")


def extract_text_from_bytes(content: bytes, filename: str) -> str:
    """Extracts plain text from raw file bytes (.txt, .pdf, .docx)."""
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n".join(pages)
        except Exception as e:
            # Fallback text decoding if pypdf fails
            return content.decode("utf-8", errors="ignore")
    elif lower_name.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(io.BytesIO(content))
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            return content.decode("utf-8", errors="ignore")
    else:
        # Assume plain text / markdown
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            return content.decode("latin-1", errors="ignore")


def normalize_text(text: str) -> str:
    """Cleans up text for tokenization while preserving skill punctuation."""
    # Replace non-breaking spaces and redundant line breaks
    text = text.replace("\u00a0", " ").replace("\r\n", "\n")
    return text


def extract_skills_from_text(text: str) -> Dict[str, Dict[str, Any]]:
    """
    Scans text for all canonical skills and aliases.
    Returns dictionary of canonical_skill -> {frequency, count, sample_contexts}.
    Uses regex token boundary checking to avoid false positives (e.g. 'Go' in 'Good').
    """
    found_skills: Dict[str, Dict[str, Any]] = {}
    cleaned_text = normalize_text(text)

    # Sort aliases by length descending so multi-word terms match before single tokens
    # e.g., "Large Language Models" before "Models", "Machine Learning" before "Learning"
    sorted_terms = sorted(ALIAS_INDEX.keys(), key=lambda t: len(t), reverse=True)

    # Track matched character spans to prevent overlapping matches
    matched_spans: List[Tuple[int, int]] = []

    for term in sorted_terms:
        # Create boundary-safe regex pattern
        escaped_term = re.escape(term)
        
        # Special cases for terms like 'c++', 'c#', '.net'
        if term in ["c++", "c#", ".net", "r"]:
            pattern = re.compile(rf"(?<![A-Za-z0-9]){escaped_term}(?![A-Za-z0-9])", re.IGNORECASE)
        elif term == "go":
            # For short word 'go', ensure it's capitalized as 'Go' or clearly distinct
            pattern = re.compile(r"(?<![A-Za-z0-9])(?:Go|Golang)(?![A-Za-z0-9])")
        else:
            pattern = re.compile(rf"\b{escaped_term}\b", re.IGNORECASE)

        for match in pattern.finditer(cleaned_text):
            start, end = match.span()
            
            # Check for overlap with already matched longer phrases
            overlaps = any(s <= start < e or s < end <= e for s, e in matched_spans)
            if overlaps:
                continue

            matched_spans.append((start, end))
            canonical = ALIAS_INDEX[term]

            if canonical not in found_skills:
                metadata = SKILL_TAXONOMY.get(canonical, {})
                found_skills[canonical] = {
                    "name": canonical,
                    "category": metadata.get("category", "General"),
                    "difficulty": metadata.get("difficulty", "Intermediate"),
                    "occurrences": 0,
                    "aliases_matched": set(),
                }

            found_skills[canonical]["occurrences"] += 1
            found_skills[canonical]["aliases_matched"].add(term)

    # Convert sets to lists for JSON serialization
    for skill in found_skills.values():
        skill["aliases_matched"] = list(skill["aliases_matched"])

    return found_skills


def extract_job_posting_details(text: str) -> Dict[str, Any]:
    """
    Parses a job posting and segregates extracted skills into:
    - required_skills
    - preferred_skills
    - general_skills
    """
    all_skills = extract_skills_from_text(text)
    
    # Split text into sections or lines to assess required vs preferred context
    lines = text.split("\n")
    current_context = "required"  # Default assumption for standard job specs
    
    required_skills: Set[str] = set()
    preferred_skills: Set[str] = set()

    for line in lines:
        line_lower = line.lower()
        if any(re.search(p, line_lower) for p in PREFERRED_SECTION_PATTERNS):
            current_context = "preferred"
        elif any(re.search(p, line_lower) for p in REQUIRED_SECTION_PATTERNS):
            current_context = "required"
        
        # Check which skills exist in this line
        line_skills = extract_skills_from_text(line)
        for skill_name in line_skills:
            if current_context == "preferred":
                preferred_skills.add(skill_name)
            else:
                required_skills.add(skill_name)

    # Any skill in preferred that is not explicitly in required is classified as preferred
    pure_preferred = preferred_skills - required_skills
    pure_required = required_skills | (set(all_skills.keys()) - preferred_skills)

    # Build structured output
    result = {
        "all_skills": all_skills,
        "required_skills": [all_skills[s] for s in pure_required if s in all_skills],
        "preferred_skills": [all_skills[s] for s in pure_preferred if s in all_skills],
        "total_skills_count": len(all_skills)
    }
    return result


def extract_resume_metadata(text: str) -> Dict[str, Any]:
    """Extracts candidate contact/summary info and extracted skill inventory."""
    skills = extract_skills_from_text(text)

    email_match = EMAIL_PATTERN.search(text)
    phone_match = PHONE_PATTERN.search(text)

    # Attempt to extract candidate name from the first non-empty lines
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    candidate_name = lines[0] if lines and len(lines[0]) < 50 and not email_match else "Job Candidate"

    # Group skills by category
    categorized: Dict[str, List[str]] = {}
    for skill_name, data in skills.items():
        cat = data.get("category", "Other")
        categorized.setdefault(cat, []).append(skill_name)

    return {
        "candidate_name": candidate_name,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "skills": skills,
        "skills_by_category": categorized,
        "total_skills_count": len(skills)
    }
