# API Contracts

These contracts describe the intended production shape. Current endpoints return deterministic mock data but should preserve these envelopes as providers are added.

## POST `/api/ocr/parse`

Request:

```json
{
  "studentId": "stu_123",
  "documentUrl": "s3://bucket/transcript.pdf",
  "documentType": "transcript",
  "curriculumHint": "IB Diploma"
}
```

Response:

```json
{
  "agentId": "ocr-parser",
  "status": "needs-human-review",
  "payload": {
    "records": [
      {
        "subject": "IB Biology HL",
        "score": "7",
        "scale": "1-7",
        "confidence": 0.96
      }
    ]
  },
  "warnings": [],
  "audit": {
    "provider": "mock",
    "model": "none",
    "createdAt": "2026-04-30T00:00:00.000Z",
    "requestId": "req_123"
  }
}
```

## POST `/api/pipeline/evaluate`

Request:

```json
{
  "studentId": "stu_123",
  "targetMajor": "Medicine",
  "targetUniversity": "Yonsei University"
}
```

Response payload:

```json
{
  "mode": "medical",
  "strengths": ["..."],
  "criticalWeakness": "..."
}
```

## POST `/api/pipeline/story-themes`

Request:

```json
{
  "studentId": "stu_123",
  "evaluationId": "eval_123"
}
```

Response payload:

```json
[
  {
    "id": "theme-a",
    "title": "Evidence-led academic growth",
    "angle": "...",
    "evidence": ["IB Biology HL (7)"],
    "question": "Describe one hard academic problem..."
  }
]
```

## POST `/api/pipeline/tailor`

Request:

```json
{
  "studentId": "stu_123",
  "guidelineId": "snu-biomed-12",
  "answer": "Student-approved story answer"
}
```

Response payload:

```json
{
  "university": "Seoul National University",
  "prompt": "...",
  "limit": "1,000 characters including spaces",
  "essay": "...",
  "essayByLanguage": {
    "en": "...",
    "ko": "..."
  },
  "factCheck": {
    "status": "passed",
    "warnings": [],
    "blockingReasons": []
  },
  "submissionGate": {
    "canSubmit": true,
    "label": {
      "en": "Ready for final review",
      "ko": "최종 검토 가능"
    },
    "reasons": []
  }
}
```

## Production Notes

- Auth and role checks should wrap every student-specific endpoint.
- B2B users may access only students mapped to their organization.
- Essay generation should be blocked until OCR records are approved.
- Store request and response metadata for audit, but avoid storing raw model chain-of-thought.
- Payments are deferred; do not payment-gate Phase 1 API behavior.
- Final submission should be blocked when `submissionGate.canSubmit` is false.

## GET `/api/guidelines/sources`

Returns the current 2026 top-13 guideline source registry and ingestion jobs.
