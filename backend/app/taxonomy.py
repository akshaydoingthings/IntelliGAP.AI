"""
Comprehensive Skill Taxonomy & Knowledge Base
Defines hierarchical skill categories, synonyms/aliases, difficulty tiers,
and curated educational resources.
"""

from typing import Dict, List, Optional, Any

# Primary skill taxonomy organized by functional domains
SKILL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    # -------------------------------------------------------------
    # Programming Languages
    # -------------------------------------------------------------
    "Python": {
        "category": "Languages",
        "difficulty": "Beginner",
        "learning_weeks": 3,
        "aliases": ["py", "python3", "python 3", "cpython"],
        "resources": [
            {"title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "Docs", "free": True},
            {"title": "Automate the Boring Stuff with Python", "url": "https://automatetheboringstuff.com/", "type": "Book", "free": True},
            {"title": "Complete Python Bootcamp (Udemy/Coursera)", "url": "https://www.coursera.org/specializations/python", "type": "Course", "free": False}
        ],
        "project_idea": "Build a CLI expense tracker with SQLite persistence and data export."
    },
    "JavaScript": {
        "category": "Languages",
        "difficulty": "Beginner",
        "learning_weeks": 3,
        "aliases": ["js", "es6", "es2020", "vanilla js", "modern javascript"],
        "resources": [
            {"title": "MDN Web Docs - JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "type": "Docs", "free": True},
            {"title": "JavaScript.info - The Modern JavaScript Tutorial", "url": "https://javascript.info/", "type": "Interactive", "free": True},
            {"title": "Eloquent JavaScript", "url": "https://eloquentjavascript.net/", "type": "Book", "free": True}
        ],
        "project_idea": "Build an interactive Kanban board with drag-and-drop and local storage."
    },
    "TypeScript": {
        "category": "Languages",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["ts", "typescript 5"],
        "resources": [
            {"title": "TypeScript Official Handbook", "url": "https://www.typescriptlang.org/docs/handbook/intro.html", "type": "Docs", "free": True},
            {"title": "Total TypeScript by Matt Pocock", "url": "https://www.totaltypescript.com/tutorials", "type": "Interactive", "free": True}
        ],
        "project_idea": "Refactor a vanilla JS state manager into strongly-typed generic interfaces."
    },
    "Go": {
        "category": "Languages",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["golang", "go lang"],
        "resources": [
            {"title": "A Tour of Go", "url": "https://go.dev/tour/welcome/1", "type": "Interactive", "free": True},
            {"title": "Go by Example", "url": "https://gobyexample.com/", "type": "Docs", "free": True}
        ],
        "project_idea": "Develop a concurrent URL health checker using goroutines and channels."
    },
    "Java": {
        "category": "Languages",
        "difficulty": "Intermediate",
        "learning_weeks": 4,
        "aliases": ["java 17", "java 21", "core java", "jdk"],
        "resources": [
            {"title": "Oracle Java Tutorials", "url": "https://docs.oracle.com/javase/tutorial/", "type": "Docs", "free": True},
            {"title": "Hyperskill / JetBrains Java Track", "url": "https://hyperskill.org/tracks/1", "type": "Course", "free": False}
        ],
        "project_idea": "Build a multi-threaded banking transaction simulator with unit tests."
    },
    "Rust": {
        "category": "Languages",
        "difficulty": "Advanced",
        "learning_weeks": 5,
        "aliases": ["rust-lang", "rustlang"],
        "resources": [
            {"title": "The Rust Programming Language (The Book)", "url": "https://doc.rust-lang.org/book/", "type": "Book", "free": True},
            {"title": "Rustlings Course", "url": "https://github.com/rust-lang/rustlings", "type": "Interactive", "free": True}
        ],
        "project_idea": "Create a high-speed CLI file search utility replicating `grep`."
    },
    "SQL": {
        "category": "Languages",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["structured query language", "ansi sql", "relational queries"],
        "resources": [
            {"title": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "Interactive", "free": True},
            {"title": "SQLBolt - Interactive Lessons", "url": "https://sqlbolt.com/", "type": "Interactive", "free": True}
        ],
        "project_idea": "Design an e-commerce database schema with complex analytical window functions."
    },
    "HTML/CSS": {
        "category": "Languages",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["html5", "css3", "html", "css", "semantic html"],
        "resources": [
            {"title": "MDN Learn Web Development", "url": "https://developer.mozilla.org/en-US/docs/Learn", "type": "Docs", "free": True},
            {"title": "web.dev by Google", "url": "https://web.dev/learn/css", "type": "Course", "free": True}
        ],
        "project_idea": "Code an accessible, responsive landing page with custom CSS animations and zero frameworks."
    },

    # -------------------------------------------------------------
    # Frontend & Web Technologies
    # -------------------------------------------------------------
    "React": {
        "category": "Frontend",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["reactjs", "react.js", "react hooks"],
        "resources": [
            {"title": "React Official Documentation", "url": "https://react.dev/", "type": "Docs", "free": True},
            {"title": "Scrimba - Learn React", "url": "https://scrimba.com/learn/learnreact", "type": "Interactive", "free": True}
        ],
        "project_idea": "Build a SaaS analytics dashboard with custom hooks, filters, and dark mode."
    },
    "Next.js": {
        "category": "Frontend",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["nextjs", "next.js 14", "app router", "next"],
        "resources": [
            {"title": "Next.js Learn Course", "url": "https://nextjs.org/learn", "type": "Course", "free": True},
            {"title": "Next.js Official Docs", "url": "https://nextjs.org/docs", "type": "Docs", "free": True}
        ],
        "project_idea": "Build a full-stack blog with Server Components, SSR, and dynamic SEO metadata."
    },
    "Vue.js": {
        "category": "Frontend",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["vue", "vuejs", "vue 3", "composition api"],
        "resources": [
            {"title": "Vue.js Official Guide", "url": "https://vuejs.org/guide/introduction.html", "type": "Docs", "free": True}
        ],
        "project_idea": "Build a real-time collaborative note-taking app with Pinia state store."
    },
    "Tailwind CSS": {
        "category": "Frontend",
        "difficulty": "Beginner",
        "learning_weeks": 1,
        "aliases": ["tailwind", "tailwindcss", "utility-first css"],
        "resources": [
            {"title": "Tailwind CSS Official Docs", "url": "https://tailwindcss.com/docs", "type": "Docs", "free": True}
        ],
        "project_idea": "Recreate a polished Dribbble dashboard mockup using Tailwind utility classes."
    },
    "Redux": {
        "category": "Frontend",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["redux toolkit", "rtk", "redux-saga", "state management"],
        "resources": [
            {"title": "Redux Essentials Tutorial", "url": "https://redux.js.org/tutorials/essentials/part-1-overview-concepts", "type": "Docs", "free": True}
        ],
        "project_idea": "Manage complex cart, checkout, and auth states in an e-commerce web app."
    },
    "WebSockets": {
        "category": "Frontend",
        "difficulty": "Intermediate",
        "learning_weeks": 1,
        "aliases": ["socket.io", "websocket", "real-time communication"],
        "resources": [
            {"title": "MDN WebSockets API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", "type": "Docs", "free": True}
        ],
        "project_idea": "Implement a real-time multi-room chat with typing indicators and online badges."
    },

    # -------------------------------------------------------------
    # Backend & APIs
    # -------------------------------------------------------------
    "FastAPI": {
        "category": "Backend",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["fast api", "fastapi framework", "starlette pydantic"],
        "resources": [
            {"title": "FastAPI Official Documentation", "url": "https://fastapi.tiangolo.com/tutorial/", "type": "Docs", "free": True},
            {"title": "TestDriven.io FastAPI Guide", "url": "https://testdriven.io/guides/fastapi/", "type": "Tutorial", "free": True}
        ],
        "project_idea": "Build an asynchronous RESTful API with OAuth2 JWT auth and automatic Swagger specs."
    },
    "Node.js": {
        "category": "Backend",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["node", "nodejs", "express", "express.js", "expressjs"],
        "resources": [
            {"title": "Node.js Official Guides", "url": "https://nodejs.org/en/learn", "type": "Docs", "free": True},
            {"title": "The Odin Project - NodeJS Path", "url": "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", "type": "Course", "free": True}
        ],
        "project_idea": "Build an Express-based microservice with rate limiting, helmet security, and MongoDB."
    },
    "Django": {
        "category": "Backend",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["django rest framework", "drf", "python django"],
        "resources": [
            {"title": "Django Official Tutorial", "url": "https://docs.djangoproject.com/en/stable/intro/tutorial01/", "type": "Docs", "free": True}
        ],
        "project_idea": "Develop a multi-tenant customer portal with Django ORM, migrations, and DRF APIs."
    },
    "REST APIs": {
        "category": "Backend",
        "difficulty": "Beginner",
        "learning_weeks": 1,
        "aliases": ["restful", "rest api", "restful apis", "restful web services"],
        "resources": [
            {"title": "RESTful API Design Best Practices", "url": "https://restfulapi.net/", "type": "Guide", "free": True}
        ],
        "project_idea": "Design an OpenAPI 3.0 spec for a ride-sharing dispatch service."
    },
    "GraphQL": {
        "category": "Backend",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["apollo", "apollo client", "apollo server", "graphql api"],
        "resources": [
            {"title": "GraphQL Official Guide", "url": "https://graphql.org/learn/", "type": "Docs", "free": True},
            {"title": "How to GraphQL", "url": "https://www.howtographql.com/", "type": "Interactive", "free": True}
        ],
        "project_idea": "Build a federated GraphQL gateway aggregating user and order microservices."
    },
    "Microservices": {
        "category": "Backend",
        "difficulty": "Advanced",
        "learning_weeks": 4,
        "aliases": ["microservice architecture", "distributed systems", "service-oriented architecture", "soa"],
        "resources": [
            {"title": "Microservices.io Patterns", "url": "https://microservices.io/", "type": "Guide", "free": True},
            {"title": "Building Microservices by Sam Newman", "url": "https://samnewman.io/books/building_microservices/", "type": "Book", "free": False}
        ],
        "project_idea": "Design an event-driven order processing architecture with saga orchestrators."
    },
    "Kafka": {
        "category": "Backend",
        "difficulty": "Advanced",
        "learning_weeks": 3,
        "aliases": ["apache kafka", "kafka streams", "event streaming"],
        "resources": [
            {"title": "Apache Kafka Documentation", "url": "https://kafka.apache.org/documentation/", "type": "Docs", "free": True},
            {"title": "Confluent Kafka 101", "url": "https://developer.confluent.io/courses/apache-kafka/overview/", "type": "Course", "free": True}
        ],
        "project_idea": "Construct an event pipeline streaming telemetry events with consumer groups and dead-letter queues."
    },

    # -------------------------------------------------------------
    # Cloud & DevOps
    # -------------------------------------------------------------
    "AWS": {
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "learning_weeks": 4,
        "aliases": ["amazon web services", "ec2", "s3", "lambda", "aws cloud"],
        "resources": [
            {"title": "AWS Skill Builder & Cloud Practitioner", "url": "https://explore.skillbuilder.aws/", "type": "Course", "free": True},
            {"title": "AWS Hands-on Tutorials", "url": "https://aws.amazon.com/getting-started/hands-on/", "type": "Tutorial", "free": True}
        ],
        "project_idea": "Deploy a containerized web service with ECS Fargate, ALB, S3, and RDS PostgreSQL."
    },
    "Docker": {
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["docker containers", "containerization", "docker-compose", "dockerfile"],
        "resources": [
            {"title": "Docker Getting Started", "url": "https://docs.docker.com/get-started/", "type": "Docs", "free": True},
            {"title": "Play with Docker Classroom", "url": "https://labs.play-with-docker.com/", "type": "Interactive", "free": True}
        ],
        "project_idea": "Containerize a multi-service app (frontend, backend, Redis, DB) using multi-stage builds."
    },
    "Kubernetes": {
        "category": "Cloud & DevOps",
        "difficulty": "Advanced",
        "learning_weeks": 4,
        "aliases": ["k8s", "kube", "kubectl", "k8s cluster", "helm"],
        "resources": [
            {"title": "Kubernetes Official Tutorials", "url": "https://kubernetes.io/docs/tutorials/", "type": "Docs", "free": True},
            {"title": "Kubernetes the Hard Way", "url": "https://github.com/kelseyhightower/kubernetes-the-hard-way", "type": "Guide", "free": True}
        ],
        "project_idea": "Deploy an auto-scaling application with ingress controller, ConfigMaps, secrets, and liveness probes."
    },
    "CI/CD": {
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"],
        "resources": [
            {"title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions", "type": "Docs", "free": True}
        ],
        "project_idea": "Automate linting, unit testing, docker building, and staging deployment on every pull request."
    },
    "Terraform": {
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["infrastructure as code", "iac", "hashicorp terraform"],
        "resources": [
            {"title": "HashiCorp Learn Terraform", "url": "https://developer.hashicorp.com/terraform/tutorials", "type": "Interactive", "free": True}
        ],
        "project_idea": "Provision a secure VPC, subnets, security groups, and cloud instances using Terraform modules."
    },
    "Linux": {
        "category": "Cloud & DevOps",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["bash", "shell scripting", "unix", "ubuntu", "command line"],
        "resources": [
            {"title": "Linux Journey", "url": "https://linuxjourney.com/", "type": "Interactive", "free": True},
            {"title": "The Linux Command Line by William Shotts", "url": "http://linuxcommand.org/tlcl.php", "type": "Book", "free": True}
        ],
        "project_idea": "Author automated Bash backup and log rotation scripts triggered via systemd/cron."
    },

    # -------------------------------------------------------------
    # Data & AI/ML
    # -------------------------------------------------------------
    "Machine Learning": {
        "category": "Data & AI/ML",
        "difficulty": "Intermediate",
        "learning_weeks": 5,
        "aliases": ["ml", "supervised learning", "unsupervised learning", "machine learning algorithms"],
        "resources": [
            {"title": "Andrew Ng - Machine Learning Specialization", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "type": "Course", "free": False},
            {"title": "Google Machine Learning Crash Course", "url": "https://developers.google.com/machine-learning/crash-course", "type": "Course", "free": True}
        ],
        "project_idea": "Train and evaluate an end-to-end customer churn prediction pipeline with cross-validation."
    },
    "Deep Learning": {
        "category": "Data & AI/ML",
        "difficulty": "Advanced",
        "learning_weeks": 5,
        "aliases": ["neural networks", "cnn", "rnn", "transformers", "deep neural networks"],
        "resources": [
            {"title": "Deep Learning Specialization by deeplearning.ai", "url": "https://www.deeplearning.ai/courses/deep-learning-specialization/", "type": "Course", "free": False},
            {"title": "Fast.ai Practical Deep Learning for Coders", "url": "https://course.fast.ai/", "type": "Course", "free": True}
        ],
        "project_idea": "Build and fine-tune a Convolutional Neural Network on a custom medical imaging dataset."
    },
    "PyTorch": {
        "category": "Data & AI/ML",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["torch", "pytorch lightning"],
        "resources": [
            {"title": "PyTorch Official Tutorials", "url": "https://pytorch.org/tutorials/", "type": "Docs", "free": True}
        ],
        "project_idea": "Train a Transformer model from scratch for sequence-to-sequence translation in PyTorch."
    },
    "TensorFlow": {
        "category": "Data & AI/ML",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["tf", "keras", "tf 2"],
        "resources": [
            {"title": "TensorFlow Official Tutorials", "url": "https://www.tensorflow.org/tutorials", "type": "Docs", "free": True}
        ],
        "project_idea": "Deploy a Keras sentiment classifier with TensorFlow Serving and Docker."
    },
    "Large Language Models": {
        "category": "Data & AI/ML",
        "difficulty": "Intermediate",
        "learning_weeks": 3,
        "aliases": ["llms", "llm", "generative ai", "genai", "prompt engineering", "gpt-4", "claude", "gemini"],
        "resources": [
            {"title": "DeepLearning.AI Generative AI courses", "url": "https://www.deeplearning.ai/short-courses/", "type": "Course", "free": True},
            {"title": "Prompt Engineering Guide", "url": "https://www.promptingguide.ai/", "type": "Guide", "free": True}
        ],
        "project_idea": "Build a structured AI agent with tool-calling, memory persistence, and schema validation."
    },
    "RAG (Retrieval-Augmented Generation)": {
        "category": "Data & AI/ML",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["rag", "retrieval augmented generation", "vector search", "langchain", "llamaindex"],
        "resources": [
            {"title": "LangChain Official Docs", "url": "https://python.langchain.com/docs/get_started/introduction", "type": "Docs", "free": True},
            {"title": "LlamaIndex Documentation", "url": "https://docs.llamaindex.ai/en/stable/", "type": "Docs", "free": True}
        ],
        "project_idea": "Construct a question-answering assistant over custom enterprise PDF documents using embeddings."
    },
    "Pandas": {
        "category": "Data & AI/ML",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["pandas dataframe", "numpy", "data analysis with python"],
        "resources": [
            {"title": "Pandas Getting Started", "url": "https://pandas.pydata.org/docs/getting_started/index.html", "type": "Docs", "free": True}
        ],
        "project_idea": "Perform exploratory data analysis and cleaning on a real-world multi-million row sales dataset."
    },
    "Scikit-Learn": {
        "category": "Data & AI/ML",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["sklearn", "scikit learn"],
        "resources": [
            {"title": "Scikit-Learn User Guide", "url": "https://scikit-learn.org/stable/user_guide.html", "type": "Docs", "free": True}
        ],
        "project_idea": "Create an automated feature engineering and hyperparameter tuning pipeline."
    },

    # -------------------------------------------------------------
    # Databases & Storage
    # -------------------------------------------------------------
    "PostgreSQL": {
        "category": "Databases",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["postgres", "postgresql 16", "psql", "relational database"],
        "resources": [
            {"title": "PostgreSQL Official Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial.html", "type": "Docs", "free": True},
            {"title": "Use The Index, Luke!", "url": "https://use-the-index-luke.com/", "type": "Guide", "free": True}
        ],
        "project_idea": "Benchmark index performance (B-tree, GIN) and query plans (`EXPLAIN ANALYZE`) on large datasets."
    },
    "MongoDB": {
        "category": "Databases",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["mongo", "nosql", "document database", "mongoose"],
        "resources": [
            {"title": "MongoDB University", "url": "https://learn.mongodb.com/", "type": "Course", "free": True}
        ],
        "project_idea": "Model dynamic hierarchical catalog schemas and implement aggregation pipelines."
    },
    "Redis": {
        "category": "Databases",
        "difficulty": "Intermediate",
        "learning_weeks": 1,
        "aliases": ["in-memory cache", "redis cache", "redis pub/sub"],
        "resources": [
            {"title": "Redis University", "url": "https://university.redis.com/", "type": "Course", "free": True}
        ],
        "project_idea": "Implement distributed session caching, rate limiting tokens, and pub/sub notifications."
    },
    "Vector Databases": {
        "category": "Databases",
        "difficulty": "Intermediate",
        "learning_weeks": 2,
        "aliases": ["pinecone", "chromadb", "weaviate", "qdrant", "milvus", "pgvector"],
        "resources": [
            {"title": "Pinecone Learning Center", "url": "https://www.pinecone.io/learn/", "type": "Guide", "free": True}
        ],
        "project_idea": "Set up a pgvector index to perform cosine similarity searches across 100k semantic embeddings."
    },

    # -------------------------------------------------------------
    # Soft Skills & Engineering Practices
    # -------------------------------------------------------------
    "System Design": {
        "category": "Methodologies",
        "difficulty": "Advanced",
        "learning_weeks": 4,
        "aliases": ["software architecture", "high level design", "hld", "distributed architecture"],
        "resources": [
            {"title": "System Design Primer by Donne Martin", "url": "https://github.com/donnemartin/system-design-primer", "type": "Guide", "free": True},
            {"title": "Designing Data-Intensive Applications", "url": "https://dataintensive.net/", "type": "Book", "free": False}
        ],
        "project_idea": "Draft an end-to-end architecture diagram & technical spec for a real-time collaborative streaming platform."
    },
    "Agile/Scrum": {
        "category": "Methodologies",
        "difficulty": "Beginner",
        "learning_weeks": 1,
        "aliases": ["agile", "scrum", "sprints", "jira", "kanban methodology"],
        "resources": [
            {"title": "Scrum Guide", "url": "https://scrumguides.org/", "type": "Guide", "free": True}
        ],
        "project_idea": "Simulate a sprint planning cycle with backlog grooming and story point poker estimations."
    },
    "Unit Testing": {
        "category": "Methodologies",
        "difficulty": "Beginner",
        "learning_weeks": 2,
        "aliases": ["tdd", "test driven development", "pytest", "jest", "mocking", "integration testing"],
        "resources": [
            {"title": "Test-Driven Development by Example", "url": "https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530", "type": "Book", "free": False}
        ],
        "project_idea": "Write 95%+ test coverage suite with mocks, fixtures, and parameterized test cases."
    },
    "Git/GitHub": {
        "category": "Methodologies",
        "difficulty": "Beginner",
        "learning_weeks": 1,
        "aliases": ["git", "github", "version control", "git rebase", "pull requests"],
        "resources": [
            {"title": "Pro Git Book", "url": "https://git-scm.com/book/en/v2", "type": "Book", "free": True}
        ],
        "project_idea": "Configure branch protection rules, semantic commit hooks, and merge conflict resolution."
    }
}

# Inverted index for fast O(1) synonym/alias resolution
ALIAS_INDEX: Dict[str, str] = {}

def _build_alias_index():
    for canonical_name, data in SKILL_TAXONOMY.items():
        # Map lowercased canonical name
        ALIAS_INDEX[canonical_name.lower()] = canonical_name
        # Map lowercased aliases
        for alias in data.get("aliases", []):
            ALIAS_INDEX[alias.lower()] = canonical_name

_build_alias_index()

def resolve_skill_name(raw_term: str) -> Optional[str]:
    """Returns canonical skill name if recognized in taxonomy, else None."""
    cleaned = raw_term.strip().lower()
    return ALIAS_INDEX.get(cleaned)

def get_skill_metadata(canonical_name: str) -> Optional[Dict[str, Any]]:
    """Returns full metadata for a canonical skill name."""
    return SKILL_TAXONOMY.get(canonical_name)

def get_all_canonical_skills() -> List[str]:
    """Returns list of all canonical skill names in taxonomy."""
    return list(SKILL_TAXONOMY.keys())

def get_categories() -> List[str]:
    """Returns unique category names."""
    cats = set(data["category"] for data in SKILL_TAXONOMY.values())
    return sorted(list(cats))
