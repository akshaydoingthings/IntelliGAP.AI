
import re
import io
from typing import Dict, List, Set, Tuple, Optional, Any
from .taxonomy import SKILL_TAXONOMY, ALIAS_INDEX, resolve_skill_name, infer_skill_metadata, get_skill_metadata

COMMON_NON_SKILL_WORDS: Set[str] = {
    "a", "about", "above", "across", "after", "again", "against", "all", "almost", "alone", "along",
    "already", "also", "although", "always", "among", "an", "and", "another", "any", "are", "as",
    "at", "be", "because", "been", "before", "being", "both", "but", "by", "can", "could", "did",
    "do", "does", "doing", "done", "down", "during", "each", "few", "for", "from", "further",
    "good", "great", "had", "has", "have", "having", "he", "her", "here", "him", "his", "how",
    "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my",
    "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other",
    "our", "ours", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than",
    "that", "the", "their", "theirs", "them", "then", "there", "these", "they", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when",
    "where", "which", "while", "who", "whom", "why", "will", "with", "would", "you", "your",
    # Resume boilerplate
    "experience", "candidate", "responsibilities", "requirements", "qualifications", "education",
    "degree", "bachelor", "master", "phd", "university", "college", "school", "summary",
    "overview", "management", "communication", "collaborate", "teamwork", "leadership",
    "working", "years", "year", "months", "month", "strong", "ability", "solutions",
    "knowledge", "including", "proficient", "role", "team", "company", "project", "projects",
    "work", "worked", "programmer", "developer", "engineer", "lead", "senior", "junior",
    "intern", "director", "manager", "staff", "principal", "profile", "contact", "email",
    "phone", "address", "city", "state", "country", "remote", "hybrid", "onsite", "full-time"
}

SKILLS_BLOCK_PATTERN = re.compile(
    r"(?:skills|tech\s+stack|technologies|tools|proficiencies|technical\s+expertise|competencies)\s*[:\-]\s*([^\n\r]+)",
    re.IGNORECASE
)

CAMEL_TECH_PATTERN = re.compile(r"\b[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]*\b")
FRAMEWORK_FILE_PATTERN = re.compile(r"\b[A-Za-z0-9\-_]{2,20}(?:\.js|\.py|DB)\b", re.IGNORECASE)


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
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n".join(pages)
        except Exception as e:
            return content.decode("utf-8", errors="ignore")
    elif lower_name.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(io.BytesIO(content))
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            return content.decode("utf-8", errors="ignore")
    else:
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            return content.decode("latin-1", errors="ignore")


def normalize_text(text: str) -> str:
    text = text.replace("\u00a0", " ").replace("\r\n", "\n")
    return text


def extract_skills_from_text(text: str) -> Dict[str, Dict[str, Any]]:
    found_skills: Dict[str, Dict[str, Any]] = {}
    cleaned_text = normalize_text(text)

    # 1. Match curated canonical taxonomy & known aliases
    sorted_terms = sorted(ALIAS_INDEX.keys(), key=lambda t: len(t), reverse=True)
    matched_spans: List[Tuple[int, int]] = []

    for term in sorted_terms:
        escaped_term = re.escape(term)
        if term in ["c++", "c#", ".net", "r"]:
            pattern = re.compile(rf"(?<![A-Za-z0-9]){escaped_term}(?![A-Za-z0-9])", re.IGNORECASE)
        elif term == "go":
            pattern = re.compile(r"(?<![A-Za-z0-9])(?:Go|Golang)(?![A-Za-z0-9])")
        else:
            pattern = re.compile(rf"\b{escaped_term}\b", re.IGNORECASE)

        for match in pattern.finditer(cleaned_text):
            start, end = match.span()
            overlaps = any(s <= start < e or s < end <= e for s, e in matched_spans)
            if overlaps:
                continue

            matched_spans.append((start, end))
            canonical = ALIAS_INDEX[term]

            if canonical not in found_skills:
                metadata = SKILL_TAXONOMY.get(canonical, infer_skill_metadata(canonical))
                found_skills[canonical] = {
                    "name": canonical,
                    "category": metadata.get("category", "General"),
                    "difficulty": metadata.get("difficulty", "Intermediate"),
                    "occurrences": 0,
                    "aliases_matched": set(),
                }

            found_skills[canonical]["occurrences"] += 1
            found_skills[canonical]["aliases_matched"].add(term)

    # 2. Open-Ended Detection: Parse explicit skills blocks (e.g. 'Skills: React, Bun, DuckDB, Vite')
    for block_match in SKILLS_BLOCK_PATTERN.finditer(cleaned_text):
        raw_block = block_match.group(1)
        tokens = re.split(r"[,|•/;\t]", raw_block)
        for tok in tokens:
            cand = tok.strip().strip("-*•· ")
            if not cand or len(cand) < 2 or len(cand) > 30:
                continue
            cand_clean = re.sub(r"[^\w\+\#\.\s\-]", "", cand).strip()
            cand_clean = re.sub(r"^(?:and|or|&)\s+", "", cand_clean, flags=re.IGNORECASE).strip().strip(".")
            if not cand_clean or cand_clean.lower() in COMMON_NON_SKILL_WORDS:
                continue
            # If already canonicalized or mapped
            canon = resolve_skill_name(cand_clean)
            final_name = canon if canon else (cand_clean.title() if cand_clean.islower() else cand_clean)
            if final_name not in found_skills:
                meta = get_skill_metadata(final_name)
                found_skills[final_name] = {
                    "name": final_name,
                    "category": meta.get("category", "Technologies & Tools"),
                    "difficulty": meta.get("difficulty", "Intermediate"),
                    "occurrences": 1,
                    "aliases_matched": {cand_clean.lower()}
                }

    # 3. Open-Ended Detection: CamelCase technical identifiers & file-style frameworks (e.g. ChromaDB, Next.js, LangChain)
    for pattern in [CAMEL_TECH_PATTERN, FRAMEWORK_FILE_PATTERN]:
        for match in pattern.finditer(cleaned_text):
            start, end = match.span()
            overlaps = any(s <= start < e or s < end <= e for s, e in matched_spans)
            if overlaps:
                continue

            word = match.group(0).strip()
            if len(word) < 3 or word.lower() in COMMON_NON_SKILL_WORDS:
                continue

            canon = resolve_skill_name(word)
            final_name = canon if canon else word
            if final_name not in found_skills:
                matched_spans.append((start, end))
                meta = get_skill_metadata(final_name)
                found_skills[final_name] = {
                    "name": final_name,
                    "category": meta.get("category", "Technologies & Tools"),
                    "difficulty": meta.get("difficulty", "Intermediate"),
                    "occurrences": 1,
                    "aliases_matched": {word.lower()}
                }

    for skill in found_skills.values():
        skill["aliases_matched"] = list(skill["aliases_matched"])

    return found_skills


def extract_job_posting_details(text: str) -> Dict[str, Any]:
    all_skills = extract_skills_from_text(text)


    lines = text.split("\n")
    current_context = "required"

    required_skills: Set[str] = set()
    preferred_skills: Set[str] = set()

    for line in lines:
        line_lower = line.lower()
        if any(re.search(p, line_lower) for p in PREFERRED_SECTION_PATTERNS):
            current_context = "preferred"
        elif any(re.search(p, line_lower) for p in REQUIRED_SECTION_PATTERNS):
            current_context = "required"


        line_skills = extract_skills_from_text(line)
        for skill_name in line_skills:
            if current_context == "preferred":
                preferred_skills.add(skill_name)
            else:
                required_skills.add(skill_name)


    pure_preferred = preferred_skills - required_skills
    pure_required = required_skills | (set(all_skills.keys()) - preferred_skills)


    result = {
        "all_skills": all_skills,
        "required_skills": [all_skills[s] for s in pure_required if s in all_skills],
        "preferred_skills": [all_skills[s] for s in pure_preferred if s in all_skills],
        "total_skills_count": len(all_skills)
    }
    return result


def extract_resume_metadata(text: str) -> Dict[str, Any]:
    skills = extract_skills_from_text(text)

    email_match = EMAIL_PATTERN.search(text)
    phone_match = PHONE_PATTERN.search(text)


    lines = [l.strip() for l in text.split("\n") if l.strip()]
    candidate_name = lines[0] if lines and len(lines[0]) < 50 and not email_match else "Job Candidate"


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
