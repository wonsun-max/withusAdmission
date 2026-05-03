# Global Admission AI (WithUs Admission)

Precision-engineered AI pipeline for Korean special admissions, specifically designed for 12-year and 3-year overseas applicant tracks.

## 🚀 Overview

Global Admission AI is a SaaS platform that streamlines the complex process of applying to top Korean universities for overseas students. Unlike generic AI writing tools, our platform is a **controlled admissions production system** that prioritizes fact-grounded narratives and eliminates hallucinations.

## 🛠️ The Pipeline Workflow

Our proprietary 5-step pipeline ensures every essay is built on a foundation of verified facts.

1.  **OCR Review**: Upload transcripts and activity proofs. Our pipeline (powered by Upstage AI) extracts every grade and achievement into structured data.
2.  **Human Checkpoint**: Students or consultants review and approve extracted data to create **Approved Facts**.
3.  **Branch Evaluation**: Algorithm-driven SWOT analysis tailored for **Medical** or **General (STEM/Humanities)** tracks.
4.  **Story Builder**: Interactive builder (not a chatbot) that uses dynamic forms to select story themes and collect missing proof.
5.  **Master Draft & Tailoring**: Generates bilingual (Korean/English) master essays and tailors them to specific university prompts while enforcing character limits and **blocking unsupported claims**.

## ✨ Key Features

- **Zero Hallucination**: AI is strictly blocked from generating claims not found in the "Approved Fact" inventory.
- **Bilingual Support**: Full English and Korean interface and essay generation.
- **Target Tracking**: Specialized logic for 12-year and 3-year overseas special admission tracks.
- **Consultant Dashboard**: B2B interface for managing students, credits, and exporting branded applications.

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Authentication & Storage**: [Supabase](https://supabase.com/)
- **AI/ML**: [OpenAI](https://openai.com/) (LLM), [Upstage](https://www.upstage.ai/) (OCR)
- **Styling**: Vanilla CSS with Design Tokens & [Framer Motion](https://www.framer.com/motion/)

## 📂 Project Structure

- `app/`: Next.js application routes (B2C workspace, B2B dashboard, API pipeline).
- `components/`: Reusable UI components organized by feature (workspace, dashboard, layout).
- `lib/`: Core business logic, including the AI pipeline orchestration (`ai-pipeline.ts`) and database clients.
- `docs/`: Detailed technical specifications and product decisions.
- `prisma/`: Database schema and migration files.
- `utils/`: Utility functions and third-party service clients.

## 🏃 Local Setup

1.  **Clone and Install**:
    ```bash
    git clone <repo-url>
    cd withusAdmission
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file (refer to `README.md` for required keys):
    ```env
    DATABASE_URL=
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    OPENAI_API_KEY=
    OCR_PROVIDER_API_KEY=
    ```

3.  **Database Setup**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the student workspace at `http://localhost:3000/b2c/workspace`.

## 📖 Deep Dive Documentation

For more detailed information, please refer to the following documents in the `docs/` directory:

- [Product Brief](docs/PRODUCT_BRIEF.md): Mission, core data models, and KPI.
- [AI Agent Spec](docs/AI_AGENT_SPEC.md): Operating principles and logic for each AI agent.
- [API Contracts](docs/API_CONTRACTS.md): Definition of pipeline input/output structures.
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md): Roadmap and phase breakdown.
- [Guideline Ingestion](docs/GUIDELINE_INGESTION.md): Strategy for processing university admission PDFs.

---

© 2026 Global Admission AI. All rights reserved.
