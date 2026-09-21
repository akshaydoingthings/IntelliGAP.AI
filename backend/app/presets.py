"""
Curated Presets: Candidate Profiles & Real-World Target Role Postings
Provides instant 1-click presets for demonstration and benchmarking.
"""

from typing import Dict, List, Any

PRESET_PROFILES: Dict[str, Dict[str, Any]] = {
    "frontend_to_fullstack": {
        "id": "frontend_to_fullstack",
        "name": "Alex Chen (Frontend Dev -> Full-Stack Engineer)",
        "summary": "Junior/Mid frontend developer proficient in React, JavaScript, and CSS looking to transition into a Full-Stack Engineer role.",
        "resume_text": """
Alex Chen
Email: alex.chen@example.com | Phone: (555) 234-5678 | GitHub: github.com/alexchen
Summary:
Enthusiastic Frontend Developer with 2 years of experience building modern, responsive user interfaces using React, JavaScript, and Tailwind CSS. Strong foundation in HTML5, CSS3, REST APIs integration, and Git version control. Seeking to expand into full-stack engineering.

Technical Skills:
- Languages: JavaScript (ES6+), HTML5, CSS3, SQL
- Frontend: React, Tailwind CSS, Redux, Responsive Design, WebSockets
- Methodologies: Git/GitHub, Agile/Scrum, Unit Testing

Experience:
Frontend Developer - Horizon Web Labs (2022 - Present)
- Developed and maintained customer-facing web apps in React and Tailwind CSS.
- Integrated backend REST APIs and implemented responsive mobile-first layouts.
- Participated in bi-weekly Agile/Scrum sprints and conducted code reviews on GitHub.
        """,
        "job_title": "Senior Full-Stack Software Engineer",
        "job_text": """
Role: Senior Full-Stack Software Engineer
Company: CloudScale Technologies

Requirements:
- 3+ years of experience with modern frontend technologies including React, Next.js, and TypeScript.
- Strong backend experience with Node.js or FastAPI building scalable REST APIs and microservices.
- Solid experience with relational databases, specifically PostgreSQL.
- Hands-on experience with containerization using Docker and cloud deployment on AWS.
- Proficiency in CI/CD pipelines (GitHub Actions) and Git version control.

Preferred / Nice to Have:
- Familiarity with Kubernetes and Terraform for infrastructure.
- Experience with Redis caching and system design for high-concurrency systems.
- Strong understanding of unit testing and automated QA.
        """
    },

    "analyst_to_ml_engineer": {
        "id": "analyst_to_ml_engineer",
        "name": "Priya Sharma (Data Analyst -> ML/AI Engineer)",
        "summary": "Data Analyst skilled in Python, SQL, and Pandas aiming to level up into Machine Learning, LLMs, and GenAI engineering.",
        "resume_text": """
Priya Sharma
Email: priya.sharma@example.com | Phone: (555) 987-6543
Professional Summary:
Analytical Data Specialist with 3 years of experience in exploratory data analysis, business intelligence, and predictive modeling. Proficient in Python, SQL, Pandas, and Scikit-Learn. Passionate about machine learning, deep learning, and generative AI systems.

Core Competencies:
- Languages: Python, SQL
- Data Science & ML: Pandas, Scikit-Learn, Machine Learning
- Tools: Git/GitHub, Agile/Scrum

Experience:
Data Analyst - Apex Analytics (2021 - Present)
- Built automated reporting dashboards querying PostgreSQL databases using SQL.
- Conducted exploratory data analysis using Python and Pandas on customer behavior data.
- Built predictive churn models using Scikit-Learn with 82% accuracy.
        """,
        "job_title": "Machine Learning & Generative AI Engineer",
        "job_text": """
Position: Machine Learning & Generative AI Engineer
Organization: NeuraMind AI

Required Qualifications:
- Strong programming skills in Python and SQL.
- Deep hands-on experience with Machine Learning and Deep Learning frameworks: PyTorch or TensorFlow.
- Experience building with Large Language Models (LLMs), Prompt Engineering, and RAG (Retrieval-Augmented Generation).
- Familiarity with Vector Databases (such as Pinecone, ChromaDB, or pgvector).
- Experience building and deploying APIs with FastAPI and Docker.

Preferred Qualifications:
- Experience with MLOps and CI/CD pipelines for model retraining.
- Familiarity with cloud platforms (AWS or GCP).
- Experience with distributed computing or Kafka.
        """
    },

    "backend_to_devops": {
        "id": "backend_to_devops",
        "name": "Marcus Vance (Backend Dev -> Cloud DevOps Architect)",
        "summary": "Backend Python/Django developer aiming to become a Cloud DevOps & Site Reliability Engineer.",
        "resume_text": """
Marcus Vance
Email: marcus.vance@example.com | Phone: (555) 456-7890
Summary:
Backend Software Engineer with 3+ years of experience engineering high-performance APIs and microservices in Python, Django, and FastAPI. Deep knowledge of PostgreSQL, Redis, and Linux system administration. Seeking to transition into Cloud DevOps and Infrastructure Architecture.

Technical Skills:
- Languages: Python, SQL, Linux/Bash
- Backend: FastAPI, Django, REST APIs, PostgreSQL, Redis
- Practices: Git/GitHub, Unit Testing, Agile/Scrum

Work History:
Backend Developer - FinCore Systems (2021 - Present)
- Architected RESTful microservices handling 2M+ daily requests in FastAPI.
- Optimized PostgreSQL database queries and managed Redis caching layers.
- Administered Linux servers and author automated shell scripts.
        """,
        "job_title": "Cloud DevOps & Platform Architect",
        "job_text": """
Title: Cloud DevOps & Platform Architect
Company: HyperGrid Cloud Solutions

Requirements:
- Deep expertise in AWS cloud services (EC2, S3, ECS, IAM, VPC).
- Production experience containerizing workloads with Docker and orchestrating with Kubernetes.
- Infrastructure as Code (IaC) using Terraform.
- Advanced CI/CD pipeline automation (GitHub Actions, Jenkins).
- Solid foundation in Linux administration and Bash scripting.
- Understanding of System Design, High Availability, and Microservices.

Nice to Have:
- Experience with Go for custom tooling.
- Knowledge of Apache Kafka or event streaming architectures.
- Experience with Python scripting for cloud automation.
        """
    }
}

def get_all_presets() -> List[Dict[str, Any]]:
    """Returns a list of all preset summaries."""
    return list(PRESET_PROFILES.values())

def get_preset_by_id(preset_id: str) -> Dict[str, Any]:
    """Returns details for a specific preset."""
    return PRESET_PROFILES.get(preset_id, list(PRESET_PROFILES.values())[0])
