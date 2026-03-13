# ReadScope 📖

A backend-driven reading analytics platform that evaluates reading performance by comparing an expected passage against a spoken transcript — calculating accuracy, fluency, and detailed error feedback.

---

## What It Does

ReadScope takes what a user was *supposed* to read and compares it to what they *actually* said. The system tokenizes both texts, finds matches and mismatches, and returns a scored analysis with feedback — all tied to authenticated user accounts with full session history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy ORM |
| Auth | JWT (bcrypt password hashing) |
| Validation | Pydantic |
| Server | Uvicorn |
| Frontend | React + Vite *(scaffolded)* |

---

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL (via Homebrew or system install)
- Node.js *(for frontend, optional)*

### 1. Clone the repo

```bash
git clone https://github.com/The1keyy/readscope.git
cd readscope
```

### 2. Set up the Python environment

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost/readscope
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Set up the database

```bash
# Create the database
createdb readscope

# Run migrations (or let SQLAlchemy auto-create tables on startup)
python -c "from app.db.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
```

### 5. Start the server

```bash
uvicorn app.main:app --reload
```

API is now running at `http://localhost:8000`

Interactive docs available at `http://localhost:8000/docs`

---

## API Overview

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Log in and receive a JWT token |
| GET | `/auth/me` | Get current authenticated user |

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Reading Sessions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/sessions/` | Create a new reading session |
| GET | `/sessions/` | List all sessions for current user |
| GET | `/sessions/{session_id}` | Get a specific session |
| DELETE | `/sessions/{session_id}` | Delete a session |

**Example — create a session:**

```json
POST /sessions/

{
  "title": "French Practice",
  "language": "French",
  "difficulty": "Beginner",
  "source_text": "Bonjour je m'appelle Keyshawn et j'aime apprendre le français.",
  "transcript_text": "Bonjour je m'appelle Keyshawn et j'aime apprendre français."
}
```

### Analysis

| Method | Endpoint | Description |
|---|---|---|
| POST | `/analysis/run/{session_id}` | Run analysis on a session |
| GET | `/analysis/{session_id}` | Retrieve stored analysis result |

**Example response:**

```json
{
  "session_id": 2,
  "word_count": 10,
  "accuracy_score": 90.91,
  "fluency_score": 90.91,
  "comprehension_score": 0,
  "feedback_summary": "Excellent reading accuracy. Matched words: 10. Missing words: 1. Extra words: 0."
}
```

---

## How the Analysis Works

The analysis engine (`services/analysis_service.py`) compares the expected and spoken texts word by word:

1. Both texts are normalized and tokenized using regex
2. Word frequencies are counted for each
3. Matched, missing, and extra words are identified

**Scoring:**

- **Accuracy** — `(matched_words / expected_words) × 100`
- **Fluency** — `accuracy_score - (extra_words × 2)` *(heuristic, subject to improvement)*
- **Comprehension** — Placeholder (`0`), reserved for future NLP integration

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── sessions.py
│   │   │   └── analysis.py
│   │   └── deps.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── models/
│   │       ├── user.py
│   │       ├── reading_session.py
│   │       └── analysis_result.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── session.py
│   │   └── analysis.py
│   ├── services/
│   │   └── analysis_service.py
│   └── main.py
└── requirements.txt
```

---

## Security

All session and analysis endpoints are user-scoped — users can only access their own data. Queries are filtered by `user_id` at the database level.

---

## Roadmap

- [ ] **Audio upload + transcription** — Integrate Whisper or Vosk for automatic speech-to-text
- [ ] **Pronunciation scoring** — Word-level alignment and phonetic analysis
- [ ] **NLP comprehension scoring** — Semantic similarity for deeper reading evaluation
- [ ] **React frontend** — Full UI for login, session creation, audio upload, and results dashboard
- [ ] **Teacher dashboard** — Student progress tracking, reading graphs, and error heatmaps

---

## License

MIT
