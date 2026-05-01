# Product Decisions

Last updated: 2026-04-30

## Build Priority

Payments are explicitly out of the current build focus. The priority is making the core service work:

1. Student uploads required admission documents.
2. AI extracts and structures usable profile facts.
3. Student confirms low-confidence or important extracted records.
4. AI evaluates the profile by track and major.
5. AI generates bilingual Korean and English master drafts.
6. AI tailors bilingual drafts for each target university.
7. Fact-checking flags unsupported claims. Hallucination tolerance is effectively zero.

## Language

The final service must support both English and Korean.

Current implementation:

- UI language toggle in the student workspace.
- Korean and English master drafts.
- Korean and English tailored drafts.

## User Model

Phase 1 is student self-service. Students enter and upload their own records.

Future account links:

- Verified parent can view and edit a child's account.
- School or academy can connect to a student account with permission.
- Assignment to a specific counselor is deferred.

## Admissions Scope

The MVP focuses on Korean overseas special admission applicants:

- 3-year overseas track
- 12-year overseas track

These are the two primary 재외국민/overseas applicant types for this product, but universities may have additional eligibility details. The data model should stay expandable.

## Top 13 Seed Universities

For Phase 1, use an admissions-market top 13 target list:

1. Seoul National University / 서울대학교
2. Yonsei University / 연세대학교
3. Korea University / 고려대학교
4. Sogang University / 서강대학교
5. Sungkyunkwan University / 성균관대학교
6. Hanyang University / 한양대학교
7. Chung-Ang University / 중앙대학교
8. Kyung Hee University / 경희대학교
9. Hankuk University of Foreign Studies / 한국외국어대학교
10. University of Seoul / 서울시립대학교
11. Ewha Womans University / 이화여자대학교
12. KAIST / 한국과학기술원
13. POSTECH / 포항공과대학교

Reasoning:

- This matches the common domestic admissions target cluster often discussed as SKY, 서성한, and 중경외시.
- KAIST and POSTECH are included, but tagged as STEM/international-style tracks because their admissions structure is not identical to the general 3-year/12-year overseas Korean special admission flow.

## Guideline Year

Use 2026 admissions guidelines.

Current implementation:

- The app has 2026 seed templates.
- Official guideline PDFs still need to be imported and versioned.
- Do not present seed templates as official admission rules.

## Medical Branch

Use the same medical branch for:

- Medicine
- Dentistry
- Pharmacy
- Veterinary medicine
- Nursing
- Closely related clinical or biomedical targets when appropriate

## Documents

Sensitive identity documents are not part of the first spec-focused workflow unless they are required to prove admission eligibility.

Phase 1 document space should focus on:

- Application form
- Transcript
- Graduation or enrollment certificate
- Overseas schooling proof
- Activity proof
- Personal statement

## OCR Confidence

OCR confidence means the parser's estimate of how likely a detected item is correct.

Product rule:

- Low confidence should not block the entire service.
- Low-confidence records should be shown clearly.
- A low-confidence record should not become an approved essay fact until the student confirms it.

## Data and Privacy Direction

Preferred data region: Korea.

Retention:

- Keep uploaded documents until the user deletes the account or requests deletion.
- After deletion, retain only what law or dispute/audit requirements require.
- This needs legal review before launch.

Minor consent:

- Korean law requires legal representative consent when processing personal information of children under 14.
- Product decision: allow under-14 signup only with parent/legal representative consent.

## Essay Safety

- Unsupported student claims should trigger a clear warning.
- The warning should explain that false claims can harm admission outcomes.
- Final submission should be blocked until unsupported claims are removed or verified.
- Consultants or linked reviewers may override warnings later, but overrides must be logged.
- Revision history is desirable and should be implemented before real launch.

## AI Logging

Store AI prompts, model metadata, provider responses, warnings, and generated outputs for audit.

Do not store hidden model reasoning or chain-of-thought.

## Deferred

- Payments
- Counselor assignment
- Community and Q&A
- Academy logo PDF export
- Full B2B subscription model
