# Global Admission AI

Global Admission AI is an English SaaS MVP for Korean special admission consulting, focused on 12-year and 3-year overseas applicant tracks.

## What is built

- Student workspace at `/b2c/workspace`
- B2B consultant dashboard at `/b2b/dashboard`
- Mock OCR parser, profile evaluator, story builder, and essay tailoring APIs
- English product brief in `docs/PRODUCT_BRIEF.md`
- Coding-agent handoff rules in `AGENTS.md`
- AI agent contracts in `docs/AI_AGENT_SPEC.md`
- API contracts in `docs/API_CONTRACTS.md`
- 2026 top-13 guideline ingestion plan in `docs/GUIDELINE_INGESTION.md`
- Type-safe sample admissions data and deterministic AI pipeline logic

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000/b2c/workspace`.

## Future production services

Configure these only when replacing mock adapters with real integrations:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=
OCR_PROVIDER_API_KEY=
DATABASE_URL=
S3_BUCKET=
PORTONE_API_KEY=
```

The model is intentionally configurable. Do not hard-code a model name in product logic.
