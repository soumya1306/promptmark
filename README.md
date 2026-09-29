# PromptMark 🖋️

> **A modern, collaborative WYSIWYG document editor built for editorial craft, real-time collaboration, and Word-grade layout tooling.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

PromptMark reimagines document editing by blending the rich formatting power of desktop publishing (Microsoft Word) with the fluidity of modern collaborative web workspaces (Google Docs, Notion). Designed with a tactile, earth-toned editorial aesthetic, PromptMark provides deep typographical control, multiplayer presence, inline track changes, and flexible page modes.

---

## ✨ Key Features

### 🎀 1. Word-Grade Ribbon Toolbar
A full-featured tabbed ribbon modeled after professional document processors:
- **Home Tab**: Undo/Redo, clipboard actions, font family selection, font size, bold/italic/underline/strikethrough, text color, highlight color, paragraph alignment, bullet/numbered checklists, line spacing, and heading style presets.
- **Insert Tab**: Page breaks, tables, callout blocks, images, link embedding, comment insertion, headers & footers, and decorative symbols.
- **Layout Tab**: Margins (Normal, Narrow, Moderate, Wide), orientation (Portrait/Landscape), paper sizes (Letter, A4, Legal, Executive), columns, and paragraph indentation.
- **Review Tab**: Proofing tools, track changes toggle, comment thread management, and change review actions (Accept, Reject, Previous, Next).

### 👥 2. Real-Time Collaborative Presence
- Live multiplayer carets with distinct participant colors and initials.
- Dynamic selection highlighting indicating what collaborators are currently editing.
- Active collaborator presence bar with status tooltips and quick share controls.

### 📝 3. Track Changes & Editorial Review
- First-class diff visualization with green insertions and red strikethrough deletions.
- Interactive inline change cards allowing granular **Accept** or **Reject** decisions per revision.
- Dedicated **Review Sidebar** to batch accept/reject changes or filter by collaborator.

### 📄 4. Dual View Engine: Paginated & Pageless
- **Paginated Mode**: Realistic physical page cards with margins, paper shadow elevation, and interactive horizontal/vertical rulers.
- **Pageless Mode**: Continuous, fluid writing canvas ideal for long-form digital publishing and wide tables.
- **Zoom Engine**: Scalable canvas zoom from 50% to 200% with smooth slider and step buttons.

### 🧭 5. Outline Navigation & Sidebars
- Collapsible **Document Outline** sidebar indexing sections for instantaneous jumping.
- Collapsible **Right Inspector Panel** housing active comment threads, threaded replies, and revision cards.

### 💾 6. Multi-Format Export & Document Dialogs
- Export modal supporting **PDF, DOCX, Markdown, Plain Text, HTML, and JSON**.
- Comprehensive **Page Setup** dialog for margins, gutter, and orientation.
- **Collaborator Share** modal with granular view/comment/edit role permissions.
- **Version History** inspector for auditing document revisions.

### 🎨 7. Warm Editorial Design System
- Warm paper palette (`#faf6f0`, `#f5f1ea`) paired with deep forest greens (`#4a7c59`) and earth neutrals.
- Typography pairing: **Literata** (editorial serif headlines), **Nunito Sans** (body reading text), and **Material Symbols**.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router with Turbopack |
| **UI Library** | [React 19](https://react.dev/) | Client Components with dynamic hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | `@tailwindcss/postcss` with CSS variables |
| **Icons** | [Lucide React](https://lucide.dev/) + Google Material Symbols | High-fidelity iconography |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type definitions |

---

## 📁 Project Structure

```text
promptmark/
├── AGENTS.md                  # Multi-agent operating system & specialist workflows
├── README.md                  # Project documentation & overview
├── public/                    # Static assets and icons
│   └── stitch-source/         # Static prototypes and reference screens
├── src/
│   ├── app/
│   │   ├── globals.css        # Design tokens, color system, typography rules
│   │   ├── layout.tsx         # Root layout with Google Web Fonts injection
│   │   └── page.tsx           # Document editor orchestration page
│   └── components/
│       ├── DocumentSheet.tsx      # Paginated/pageless canvas, rulers & carets
│       ├── LeftOutlineSidebar.tsx # Document outline section navigation
│       ├── Modals.tsx             # Export, Share, Page Setup & History modals
│       ├── RightSidebar.tsx       # Review changes & comments panel
│       ├── StatusBar.tsx          # Word count, page info & zoom controls
│       ├── TopAppBar.tsx          # Document header, preset switcher & actions
│       ├── WordRibbon.tsx         # Multi-tab ribbon toolbar (Home, Insert, Layout, Review)
│       └── types.ts               # Shared TypeScript domain models
└── stitch-source/             # Stitch prototypes and reference screens
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/soumya1306/promptmark.git
   cd promptmark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start editing.

### Production Build
To verify type correctness and generate the optimized production bundle:
```bash
npm run build
npm run start
```

---

## 🤖 Multi-Agent Architecture

This repository is governed by an automated multi-agent operating framework defined in [AGENTS.md](AGENTS.md). The system orchestrates five specialized roles:

1. **`@ui-ux-designer`**: Stitch design extraction, visual aesthetics, micro-interactions, and component modularity.
2. **`@architect`**: System design, state management trade-offs, and governance of `architecture.md`.
3. **`@backend-dev`**: API Route Handlers, Server Actions, persistence, and Zod data validation.
4. **`@security-auditor`**: XSS prevention, rich-text sanitization (DOMPurify), OWASP checks, and secrets auditing.
5. **`@github-expert`**: Clean atomic commits, branch hygiene, and Conventional Commits enforcement.

---

## 🤝 Git Commit Guidelines

All contributions adhere to the **Conventional Commits** specification:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | A new user-facing feature | `feat(ribbon): add custom font size dropdown` |
| `fix:` / `bug:` | A bug fix | `fix(sheet): resolve ruler offset during zoom` |
| `docs:` | Documentation updates | `docs(readme): add installation guide` |
| `style:` | Code style or formatting | `style(status-bar): adjust zoom slider padding` |
| `refactor:` | Code restructuring | `refactor(modals): extract reusable dialog primitive` |
| `chore:` | Tooling, dependencies | `chore(deps): update lucide-react` |
| `security:` | Security patches | `security(sanitize): add HTML input sanitization` |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
