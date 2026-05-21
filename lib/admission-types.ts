/**
 * Core domain types for the withus Admission platform (v2).
 * All student spec data flows through these types after AI extraction.
 */

// ─── Enums / Primitives ────────────────────────────────────────────────────

export type AdmissionTrack = "SPECIAL_12YR" | "SPECIAL_3YR";
export type Locale = "en" | "ko";
export type AnalysisStatus = "PENDING" | "ANALYZING" | "DONE" | "ERROR";
export type MessageRole = "user" | "assistant" | "system";
export type ChatMode = "chat" | "essay";

// ─── Student Spec (AI-extracted, comprehensive) ───────────────────────────

/**
 * Represents the full AI-analyzed profile of a student.
 * This is NOT just scores — it's a holistic profile extracted from uploaded documents.
 */
export type SpecAnalysisResult = {
  /** High-level narrative about the student as an applicant */
  persona: {
    title: string;          // e.g. "글로벌 환경에서 성장한 이공계 탐구형 인재"
    summary: string;        // 3-4 sentence narrative
    interests: string[];    // ["AI", "수학올림피아드", "환경공학"]
    strengths: string[];    // Top 3 strengths extracted from documents
  };

  /** Academic record: GPA, subjects, trajectory */
  academic: {
    currentGrade?: string;  // e.g. "12학년" or "Grade 12"
    school?: string;
    curriculum?: string;    // "IB", "AP", "한국 교육과정", etc.
    gpa?: string;
    gpaScale?: string;      // "4.0", "5.0", "100점"
    trajectory?: string;    // AI analysis of grade trend
    subjects: AcademicSubject[];
  };

  /** Extracurricular activities, clubs, volunteering, etc. */
  activities: ActivityRecord[];

  /** Awards and honors */
  awards: AwardRecord[];

  /** Standardized test scores (SAT, ACT, AP, IB, TOEFL, etc.) */
  tests: TestRecord[];

  /**
   * Residency / overseas stay info — critical for 특례 eligibility.
   * Extracted from passport, 출입국사실증명, attendance records.
   */
  residency?: {
    totalYears?: string;
    countries?: string[];
    periods?: ResidencyPeriod[];
    eligibility12yr?: boolean;
    eligibility3yr?: boolean;
    notes?: string;
  };

  /** Personal information extracted from documents */
  personalInfo?: {
    name?: string;
    dateOfBirth?: string;
    nationality?: string;
    currentCountry?: string;
  };
};

export type AcademicSubject = {
  name: string;
  score: string;
  significance?: string;  // AI annotation: why this score matters
  confidence: number;     // 0.0-1.0 extraction confidence
};

export type ActivityRecord = {
  name: string;
  role?: string;
  period?: string;
  impact?: string;  // AI-generated significance statement
};

export type AwardRecord = {
  name: string;
  date?: string;
  significance?: string;
};

export type TestRecord = {
  exam: string;    // "SAT", "TOEFL", "AP Calculus BC", etc.
  score: string;
  date?: string;
};

export type ResidencyPeriod = {
  country: string;
  from: string;
  to: string;
};

// ─── Uploaded Documents ───────────────────────────────────────────────────

export type SpecDocumentMeta = {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  isProcessed: boolean;
  createdAt: string;
};

// ─── University Chat & Essay ───────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type EssaySessionState = {
  id: string;
  universitySlug: string;
  mode: ChatMode;
  messages: ChatMessage[];
  essayDraft?: string;
};

// ─── API Payloads ─────────────────────────────────────────────────────────

export type AnalyzeSpecRequest = {
  /** FormData key = 'files', multipart */
  files: File[];
};

export type AnalyzeSpecResponse = {
  status: AnalysisStatus;
  result?: SpecAnalysisResult;
  error?: string;
};

export type ChatRequest = {
  sessionId?: string;
  message: string;
  mode: ChatMode;
};

export type ChatResponse = {
  sessionId: string;
  /** Streaming: each chunk is a delta string */
  delta?: string;
  essayDraft?: string;
};
