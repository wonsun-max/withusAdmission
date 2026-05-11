import type {
  EvaluationResult,
  GpaRecord,
  StoryTheme,
  TailoredEssay,
  UniversityGuideline
} from "@/lib/admission-types";

export type AgentId =
  | "ocr-parser"
  | "profile-evaluator"
  | "story-builder"
  | "tailoring-fact-checker";

export type AgentStatus = "complete" | "needs-human-review" | "blocked";

export type AgentAudit = {
  provider: "mock" | "openai" | "upstage" | "custom";
  model: string;
  createdAt: string;
  requestId: string;
};

export type AgentRunContext = {
  requestId: string;
  userId?: string;
  userRole?: "STUDENT" | "CONSULTANT" | "COUNSELOR" | "ADMIN";
  strictFactMode: boolean;
  locale: "en" | "ko";
};

export type AgentResult<TPayload> = {
  agentId: AgentId;
  status: AgentStatus;
  payload: TPayload;
  warnings: string[];
  audit: AgentAudit;
};

export type OcrParserInput = {
  studentId: string;
  documentUrl?: string;
  documentType?: string; // Original hint or "auto" for automatic classification
  curriculumHint?: string;
};

export type OcrParserOutput = {
  classifiedType: string;
  records: any[]; // Can be GpaRecord, TestRecord, ActivityRecord, etc.
  rawProviderReference?: string;
};

export type ProfileEvaluatorInput = {
  studentId: string;
  targetMajor?: string;
  targetUniversity?: string;
};

export type StoryBuilderInput = {
  studentId: string;
  selectedThemeId?: string;
  answer?: string;
};

export type StoryBuilderOutput = {
  themes: StoryTheme[];
  selectedTheme: StoryTheme;
  masterEssay: string;
};

export type TailoringInput = {
  studentId: string;
  guidelineId?: string;
  masterEssay?: string;
  answer?: string;
};

export type TailoringOutput = TailoredEssay & {
  guideline: Pick<UniversityGuideline, "id" | "university" | "major" | "track">;
};

export type AdmissionAgent<TInput, TOutput> = {
  id: AgentId;
  name: string;
  purpose: string;
  run: (input: TInput, context: AgentRunContext) => Promise<AgentResult<TOutput>>;
};
