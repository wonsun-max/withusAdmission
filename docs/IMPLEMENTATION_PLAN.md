# Implementation Plan

## Phase 1A: Product Skeleton

Status: started.

- English student workspace
- Korean/English workspace language toggle
- Required document submission space
- Parent edit link and under-14 consent policy surface
- Top 13 university source registry
- English B2B dashboard
- Mock agent pipeline
- Agent specifications
- API contracts

## Phase 1B: Real Data Backbone

Build next:

- PostgreSQL schema with users, organizations, students, documents, approved facts, guidelines, essays, and audit logs
- Authentication and role-based route protection
- Student profile create/edit flow
- University guideline seed loader
- Parent and school account-link model
- Official guideline ingestion jobs

Acceptance criteria:

- A student can create a profile.
- A consultant can view only assigned students.
- OCR-approved facts are stored separately from raw extracted data.

## Phase 1C: Document and OCR Flow

Build:

- Upload UI
- S3-compatible storage adapter
- OCR provider adapter
- Human approval screen
- Confidence and warning display

Acceptance criteria:

- Uploaded transcript creates a document record.
- Parser output can be edited and approved.
- Approved records become available to the essay agents.

## Phase 1D: Essay Production

Build:

- Real story theme generation
- Master essay save and revision history
- Tailored essay generation per university prompt
- Fact-check blocking and warning UI

Acceptance criteria:

- Final essay cannot include unsupported claims without a warning.
- Final submission is blocked while unsupported claims remain.
- Consultant edits are tracked.
- Character limits are visible and enforced.
- Korean and English drafts are generated and stored together.

## Phase 1E: Export

Build:

- PDF export
- Revision history
- AI audit log viewer

Acceptance criteria:

- PDF includes source facts and warning status.

Payments are deferred until after the workflow works.

## Phase 2: Scale

- Admin guideline ingestion
- Multi-year guideline versions
- Consultant CRM filters
- Team roles
- Bulk student import
- Analytics on OCR approval and essay warnings
