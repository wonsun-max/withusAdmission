# AI Agent Specification

## Operating Principle

Global Admission AI is not an open-ended writing bot. It is a controlled admissions production system. Every agent must preserve provenance: where a fact came from, whether it was approved, and whether it can be used in an essay.

## Shared Safety Rules

- Use only approved facts for final essays.
- If evidence is missing, ask a bounded follow-up question instead of inventing.
- Keep original transcript labels and scores. Do not convert foreign grades into Korean grades unless a separate approved conversion policy exists.
- Always return warnings when confidence is low.
- Every output should be reviewable by a student or consultant.

## Agent 1: OCR Parser

Purpose: convert uploaded transcripts and activity proof documents into structured profile data.

Input:

- Document URL
- Document type
- Student ID
- Locale or curriculum hint, if available

Output:

- Extracted GPA records
- Standardized test records
- Activities
- Confidence per extracted item
- Warnings
- Raw provider reference ID

Human checkpoint:

- A student or consultant must approve extracted records before those records become approved facts.

Prompt behavior:

- Preserve original subject names.
- Preserve original score scale.
- Do not infer missing scores.
- Mark ambiguous rows as warnings.

## Agent 2: Profile Evaluator

Purpose: evaluate a confirmed student profile for a selected university and major.

Branch logic:

- Medical mode: medicine, dental, pharmacy, veterinary, nursing, biomedical-adjacent targets when clinical proof is expected.
- General mode: all other majors.

Medical mode checks:

- Biology and chemistry strength
- Math or research strength
- Clinical, patient-facing, medical research, or care evidence
- Weakness that could hurt interview or essay credibility

General mode checks:

- Major fit
- Global or language strength
- Leadership or project evidence
- Weakness in specificity or proof

Output:

- Mode
- Two strengths
- One critical weakness
- Evidence references

## Agent 3: Story Interactive Builder

Purpose: generate structured essay story options and collect missing proof through dynamic forms.

It must not behave like a free chat window. It should render:

- Three story themes
- Evidence tags under each theme
- One bounded follow-up question
- A short-answer field

Output:

- Selected theme
- User answer
- Master essay draft
- Missing evidence warnings

## Agent 4: Tailoring and Fact Checker

Purpose: adapt the master essay to each university prompt without hallucination.

Input:

- Master essay
- Approved facts
- Target university prompt
- Character limit
- Required document context

Output:

- Tailored essay
- Character count
- Fact-check status
- Unsupported-claim warnings
- Revision notes for consultant review

Hard rule:

- If a claim is not present in the approved fact inventory or user-approved story answer, it must be removed or flagged.

## Future Agent 5: Guideline Ingestion

Purpose: parse university admission PDFs into searchable guideline records.

This should be added before scaling beyond manually seeded universities.

Output:

- Required documents
- Track eligibility rules
- Essay prompts
- Character limits
- Year/version metadata
- Source page references
