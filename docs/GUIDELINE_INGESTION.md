# 2026 Guideline Ingestion Plan

## Decision

Top 13 target schools are:

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

KAIST and POSTECH are marked as STEM/international-style tracks because their undergraduate admissions structure is not identical to the general 3-year/12-year overseas Korean special admission flow.

## Ingestion Pipeline

1. Confirm official source page.
2. Download official PDF when directly available.
3. Parse PDF into sections.
4. Extract eligibility, required documents, essay prompts, schedule, and disqualification rules.
5. Store source page, PDF URL, parsed text, and extraction metadata.
6. Human review before marking the guideline as approved.
7. Use approved guideline records for RAG and UI document slots.

## Current Source Registry

The code source of truth is `lib/mock-data.ts`, exposed through `/api/guidelines/sources`.

Current status categories:

- `official-imported`: official page and PDF URL are registered.
- `official-page-found`: official admissions page is registered, but direct PDF URL needs a downloader/parser pass.
- `needs-official-pdf`: official domain is known, but the exact official 2026 PDF URL still needs confirmation.

## Product Rule

Seed templates are not official admission rules. A guideline must not be treated as production-approved until a human review confirms the official 2026 source.
