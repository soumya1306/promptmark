# 🖊️ PromptMark

> An AI-powered document analysis workspace. Upload a file, describe what you're looking for, and let the AI highlight the relevant passages — then build rich research notes directly from the source.

![Status](https://img.shields.io/badge/status-in%20progress-yellow)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20FastAPI%20%7C%20PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 📁 **Document Upload** — Support for PDF and DOCX files
- 👁️ **Live Preview** — Extracted, readable document preview with page structure
- 🤖 **AI Highlighting** — Enter a natural language prompt and the AI highlights relevant spans across the document
- 📝 **Rich Text Notes** — Copy highlighted passages into a Tiptap-powered rich text editor
- 🔗 **Source-linked Notes** — Every copied snippet carries its source (page, document name)
- 💾 **Persistent Notes** — Save, update, and manage notes per document
- 🔐 **Auth** — User accounts with per-user document and note isolation

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Rich Text | Tiptap (ProseMirror) |
| Backend | FastAPI (Python) |
| AI | Gemini 2.0 Flash (Google AI Studio) |
| AI Framework | LangChain (`langchain-google-genai`) |
| File Parsing | pypdf, python-docx |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Storage | Supabase Storage |
| Deployment | Vercel + Railway |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐
│        Next.js Frontend      │
│  Upload → Preview → Notes    │
└────────────┬────────────────┘
             │ REST API
┌────────────▼────────────────┐
│        FastAPI Backend       │
│  /upload  /highlight  /notes │
└────────────┬────────────────┘
      ┌──────┴──────┐
      ▼             ▼
 PostgreSQL    Gemini 2.0 Flash
 (Notes, Docs)  (Highlighting)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Google AI Studio API Key (free at aistudio.google.com)

### Frontend

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Environment Variables

```bash
# server/.env
GOOGLE_API_KEY=your_google_ai_studio_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/promptmark

# client/.env.local
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload and parse a document |
| POST | `/highlight` | Run AI highlighting on document with a prompt |
| GET | `/documents/:id` | Get document with extracted blocks |
| POST | `/notes` | Save a note |
| GET | `/notes/:documentId` | Get all notes for a document |

---

## 🧠 Technical Decisions

- **Next.js App Router** — Server components for document preview, route handlers for secure API proxying
- **FastAPI over Express** — Python-first for AI/NLP workloads; cleaner integration with LangChain and file parsers
- **Gemini 2.0 Flash** — Free tier via Google AI Studio (1,500 req/day), no credit card required, fast inference
- **LangChain (`langchain-google-genai`)** — Structured output parsing and prompt chaining on top of Gemini
- **Tiptap** — Most extensible ProseMirror wrapper; supports custom extensions for source metadata on copied blocks
- **Block-level parsing** — Document text is chunked into paragraph blocks with stable IDs, making it easy to map AI highlight responses back to the exact UI element

---

## 📋 Roadmap

- [x] README and architecture
- [ ] Next.js scaffold + UI shell
- [ ] File upload UI + FastAPI parser
- [ ] Document preview panel
- [ ] AI prompt input + highlighting
- [ ] Tiptap notes editor
- [ ] Copy-to-notes interaction
- [ ] Notes persistence (CRUD)
- [ ] Authentication
- [ ] Deployment

---

## 🔮 Future Improvements

- Semantic search over saved notes using pgvector
- Multi-document comparison prompts
- Streaming highlight results via SSE
- Export notes as Markdown or PDF
- Highlight history per document

---

## 📸 Screenshots

> Coming soon

---

## 🤝 Related Projects

- [ai-notes-hub](https://github.com/soumya1306/ai-notes-hub) — AI-powered general notes workspace

---

<!-- ============================================================
  🚧 BUILD LOG — REMOVE THIS ENTIRE SECTION BEFORE FINAL DEPLOY
  ============================================================ -->

## 🚧 Build Log *(remove before launch)*

> Day-by-day progress tracked here during development. This section will be deleted before the final README is published.

| Day | Date | Focus | Status |
|-----|------|-------|--------|
| 1 | 18 Mar 2026 | Repo setup, README first draft | ✅ |
| 2 | | User flows, architecture diagram | ⬜ |
| 3 | | Next.js scaffold, UI shell, routing | ⬜ |
| 4 | | FastAPI setup, routes, DB schema | ⬜ |
| 5 | | File upload UI + document parser | ⬜ |
| 6 | | Document preview panel | ⬜ |
| 7 | | README update + screenshots | ⬜ |
| 8 | | AI highlight contract + prompt design | ⬜ |
| 9 | | Gemini 2.0 Flash highlight endpoint (live) | ⬜ |
| 10 | | Render highlights in preview UI | ⬜ |
| 11 | | Prompt tuning + chunking strategy | ⬜ |
| 12 | | Tiptap notes editor integration | ⬜ |
| 13 | | Copy-to-notes interaction | ⬜ |
| 14 | | Notes persistence (CRUD) | ⬜ |
| 15 | | Authentication + route protection | ⬜ |
| 16 | | Dashboard UX + document history | ⬜ |
| 17 | | Search + filtering | ⬜ |
| 18 | | Export notes + sharing | ⬜ |
| 19 | | Input validation, rate limiting, polish | ⬜ |
| 20 | | Deploy frontend + backend | ⬜ |
| 21 | | Final README, screenshots, live demo | ⬜ |

### Status Key
- ✅ Done
- 🔄 In Progress
- ⬜ Not Started
- ⏸️ Blocked

### Notes & Decisions Log

#### Day 1 — *18 Mar 2026*
- Initialized repo
- Created README with full architecture and roadmap
- Stack confirmed: Next.js 14 + FastAPI + PostgreSQL + Tiptap + Gemini 2.0 Flash
- Using Google AI Studio free tier — no credit card needed
- Name confirmed: PromptMark (trademark clear ✅)

<!-- END BUILD LOG -->

---

## 📄 License

MIT
