# Global Admission AI Product Brief

## Product Decision

Build a focused Phase 1 SaaS MVP for students handling Korean special admission applications for the 12-year and 3-year overseas tracks. The first release should prove three things: reliable document extraction, strict fact-grounded bilingual essay generation, and a self-service workflow students can complete without payment friction.

## Recommended Stack

- Frontend and BFF: Next.js with TypeScript
- Styling: responsive CSS with design tokens, ready to migrate to Tailwind if the team standardizes on it
- Production API layer: FastAPI when OCR, vector search, background jobs, and AI orchestration become heavy enough to split out
- Database: PostgreSQL first, with pgvector or a managed vector database once guideline retrieval grows
- File storage: S3-compatible object storage
- OCR adapter: Upstage Document Parse or a vision model behind the same parser interface
- LLM adapter: configurable OpenAI model through `OPENAI_MODEL`, with fact-checking constraints enforced before generation
- Payments: PortOne or Stripe depending on market and billing entity

Payment is deferred until the service workflow works end to end.

## Core Data Model

- Users: role, plan, organization, credits
- Student Profiles: track, GPA data, standardized tests, extracurriculars, approved facts
- University Guidelines: university, major, track, required documents, essay prompts, character limits
- Essays: Korean and English master essays, Korean and English tailored essays, fact-check status, revision history
- Documents: file URL, parser output, confidence, approval status
- Account links: parent, school, academy, or reviewer access granted by the student

## AI Pipeline

1. OCR Parser
   - Input: uploaded transcript or activity proof document
   - Output: structured subjects, scores, activities, and confidence signals
   - Human checkpoint: student or consultant must approve extracted data

2. Profile Evaluator
   - Input: approved profile and target university major
   - Medical branch: prioritizes biology, chemistry, clinical exposure, research, and care-related activities
   - General branch: prioritizes major fit, language strength, global context, and leadership
   - Output: two strengths and one critical weakness

3. Story Builder
   - Uses dynamic forms, not an open chatbot
- Shows three story themes
   - Collects short answers for missing proof
- Produces Korean and English master essays based only on approved facts and user answers

4. Tailoring and Fact Checker
   - Retrieves the target university prompt and limit
- Rewrites the master essay to fit the prompt in Korean and English
   - Blocks invented awards, scores, activities, or schools
   - Shows fact coverage and warning states in the UI

## MVP Scope

- 12-year and 3-year track support
- English and Korean product interface
- Student self-service workspace with required document upload slots, upload review, evaluation, story form, and tailored essay preview
- Consultant dashboard with student status, credits, and export entry point
- Mock pipeline endpoints that can later be swapped for real OCR and LLM providers
- Guideline seed data for the top 13 target schools

Payments, B2B subscriptions, and academy-branded exports are deferred.

## KPI

- OCR approval rate by document type and country
- Number of hallucination warnings per essay
- Time from document upload to first usable master essay
- Consultant correction rate after AI tailoring
- Number of complete bilingual tailored drafts generated from approved facts
