export type UserRole = "STUDENT" | "CONSULTANT" | "COUNSELOR";

export type SubscriptionPlan = "FREE" | "B2C_PASS" | "B2B_BASIC" | "B2B_PRO";

export type AdmissionTrack = "SPECIAL_12YR" | "SPECIAL_3YR";

export type AdmissionFamily = "overseas-special" | "international-stem";

export type Locale = "en" | "ko";

export type AccessRole = "OWNER" | "PARENT" | "SCHOOL" | "CONSULTANT";

export type AccessLevel = "view" | "edit";

export type ConsentStatus = "not-required" | "required" | "granted" | "blocked";

export type GuidelineSourceStatus = "official-imported" | "official-page-found" | "needs-official-pdf";

export type BilingualText = {
  en: string;
  ko: string;
};

export type GpaRecord = {
  subject: string;
  score: string;
  scale?: string;
  confidence: number;
};

export type TestRecord = {
  exam: string;
  score: string;
};

export type ActivityRecord = {
  name: string;
  period: string;
  role: string;
  summary: string;
};

export type DocumentRequirement = {
  id: string;
  label: BilingualText;
  helpText: BilingualText;
  category: "identity" | "academic" | "activity" | "application" | "eligibility";
  required: boolean;
  status: "not-started" | "uploaded" | "ai-review" | "complete";
};

export type AccountLink = {
  id: string;
  name: string;
  role: AccessRole;
  accessLevel: AccessLevel;
  verified: boolean;
};

export type ParentConsent = {
  status: ConsentStatus;
  requiredBecause: BilingualText;
  grantedBy?: string;
  grantedAt?: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  dateOfBirth: string;
  track: AdmissionTrack;
  targetMajor: string;
  countryContext: string;
  parentConsent: ParentConsent;
  accountLinks: AccountLink[];
  gpaData: GpaRecord[];
  standardizedTests: TestRecord[];
  extracurriculars: ActivityRecord[];
  approvedFacts: string[];
};

export type GuidelineSource = {
  sourcePageUrl: string;
  pdfUrl?: string;
  status: GuidelineSourceStatus;
  checkedAt: string;
  notes: string;
};

export type UniversityGuideline = {
  id: string;
  university: string;
  universityKo: string;
  major: string;
  track: AdmissionTrack;
  admissionFamily: AdmissionFamily;
  applicationYear: "2026";
  sourceStatus: GuidelineSourceStatus;
  source: GuidelineSource;
  requiredDocs: string[];
  documentRequirements: DocumentRequirement[];
  essayPrompts: {
    id: string;
    prompt: string;
    promptKo: string;
    limit: string;
  }[];
};



export type EvaluationResult = {
  mode: "medical" | "general";
  strengths: string[];
  weaknesses: string[];
  criticalWeakness?: string;
  overallSummary: string;
  themes: StoryTheme[];
};

export type StoryTheme = {
  id: string;
  title: string;
  angle: string;
  evidence: string[];
  question: string;
};

export type TailoredEssay = {
  university: string;
  prompt: string;
  limit: string;
  essay: string;
  essayByLanguage: BilingualText;
  factCheck: {
    status: "passed" | "needs-review";
    warnings: string[];
    blockingReasons: string[];
  };
  submissionGate: {
    canSubmit: boolean;
    label: BilingualText;
    reasons: string[];
  };
};
