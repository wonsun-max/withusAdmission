# Global Admission AI Agent Handoff

This repo is expected to be edited by multiple coding agents, including Codex and Antigravity. Keep changes small, typed, and tied to the admissions workflow.

## Current Stack

- Next.js App Router
- TypeScript
- Plain CSS design tokens in `app/globals.css`
- Mock AI pipeline in `lib/ai-pipeline.ts`
- Agent contracts and registry in `lib/agents`
- Product decisions in `docs/PRODUCT_DECISIONS.md`

## Run Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm audit --omit=dev
```

## Product Rules

- Interface must support Korean and English.
- Product domain is Korean 12-year and 3-year overseas special admission.
- Never generate unverified student achievements.
- Final submission must be blocked when unsupported claims remain.
- OCR output must be approved by a human before essay generation.
- Medical, dental, pharmacy, veterinary, and related majors use the medical evaluation branch.
- Keep OpenAI and OCR providers behind adapters; do not hard-code a model or provider in UI code.
- Payments are deferred; do not add payment-gating until explicitly requested.
- Top target list is 13 schools: SKY, 서성한, 중경외시, Ewha, KAIST, POSTECH.
- Verified parent links have edit access. Under-14 users require parent/legal representative consent.

## Work Boundaries

- Use `lib/agents` for AI orchestration contracts.
- Use `lib/mock-data.ts` only for demo seed data.
- Use `components/*-shell.tsx` for current screens.
- Add new user-facing screens under `app`.
- Add backend endpoints under `app/api`.
- Prefer structured TypeScript types over loose JSON.

## Next High-Value Tasks

1. Add real profile creation and persistence.
2. Add document upload UI and storage adapter.
3. Replace mock OCR parser with provider interface implementation.
4. Add university guideline admin CRUD.
5. Add payment-gated essay export.
6. Add consultant edit history and PDF export.

## Verification Before Handoff

Run:

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

If a dev server is already running, verify:

```bash
Invoke-WebRequest -Uri http://127.0.0.1:3000/b2c/workspace -UseBasicParsing
Invoke-WebRequest -Uri http://127.0.0.1:3000/b2b/dashboard -UseBasicParsing
```
