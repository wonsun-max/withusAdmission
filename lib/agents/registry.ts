import {
  buildStoryThemes,
  createMasterEssay,
  evaluateProfile,
  mockParseTranscript,
  tailorEssay
} from "@/lib/ai-pipeline";
import { sampleProfile, universityGuidelines } from "@/lib/mock-data";
import type {
  AdmissionAgent,
  AgentRunContext,
  OcrParserInput,
  OcrParserOutput,
  ProfileEvaluatorInput,
  StoryBuilderInput,
  StoryBuilderOutput,
  TailoringInput,
  TailoringOutput
} from "./types";

function audit(context: AgentRunContext) {
  return {
    provider: "mock" as const,
    model: "deterministic-local",
    createdAt: new Date().toISOString(),
    requestId: context.requestId
  };
}

export const ocrParserAgent: AdmissionAgent<OcrParserInput, OcrParserOutput> = {
  id: "ocr-parser",
  name: "OCR Parser",
  purpose: "Extract transcript and activity-proof records while preserving original labels and scores.",
  async run(_input, context) {
    const parsed = mockParseTranscript();

    return {
      agentId: "ocr-parser",
      status: "needs-human-review",
      payload: {
        records: parsed.records,
        rawProviderReference: "mock-document-parse-001"
      },
      warnings: parsed.warnings,
      audit: audit(context)
    };
  }
};

export const profileEvaluatorAgent: AdmissionAgent<ProfileEvaluatorInput, ReturnType<typeof evaluateProfile>> = {
  id: "profile-evaluator",
  name: "Profile Evaluator",
  purpose: "Evaluate approved facts with separate medical and general branches.",
  async run(input, context) {
    const profile = {
      ...sampleProfile,
      targetMajor: input.targetMajor ?? sampleProfile.targetMajor
    };

    return {
      agentId: "profile-evaluator",
      status: "complete",
      payload: evaluateProfile(profile),
      warnings: [],
      audit: audit(context)
    };
  }
};

export const storyBuilderAgent: AdmissionAgent<StoryBuilderInput, StoryBuilderOutput> = {
  id: "story-builder",
  name: "Story Interactive Builder",
  purpose: "Create story themes, ask bounded follow-up questions, and draft a master essay.",
  async run(input, context) {
    const evaluation = evaluateProfile(sampleProfile);
    const themes = buildStoryThemes(sampleProfile, evaluation);
    const selectedTheme =
      themes.find((theme) => theme.id === input.selectedThemeId) ?? themes[0];
    const masterEssay = createMasterEssay(sampleProfile, selectedTheme, input.answer ?? "");

    return {
      agentId: "story-builder",
      status: input.answer ? "complete" : "needs-human-review",
      payload: {
        themes,
        selectedTheme,
        masterEssay
      },
      warnings: input.answer ? [] : ["A student-approved story answer is needed before final tailoring."],
      audit: audit(context)
    };
  }
};

export const tailoringFactCheckerAgent: AdmissionAgent<TailoringInput, TailoringOutput> = {
  id: "tailoring-fact-checker",
  name: "Tailoring and Fact Checker",
  purpose: "Tailor a master essay to a target university prompt without unsupported claims.",
  async run(input, context) {
    const guideline =
      universityGuidelines.find((item) => item.id === input.guidelineId) ?? universityGuidelines[0];
    const profile = {
      ...sampleProfile,
      targetMajor: guideline.major,
      track: guideline.track
    };
    const themes = buildStoryThemes(profile, evaluateProfile(profile));
    const masterEssay =
      input.masterEssay ?? createMasterEssay(profile, themes[0], input.answer ?? "");
    const tailored = tailorEssay(masterEssay, profile, guideline);

    return {
      agentId: "tailoring-fact-checker",
      status: tailored.factCheck.status === "passed" ? "complete" : "needs-human-review",
      payload: {
        ...tailored,
        guideline: {
          id: guideline.id,
          university: guideline.university,
          major: guideline.major,
          track: guideline.track
        }
      },
      warnings: tailored.factCheck.warnings,
      audit: audit(context)
    };
  }
};

export const admissionAgents = {
  ocrParser: ocrParserAgent,
  profileEvaluator: profileEvaluatorAgent,
  storyBuilder: storyBuilderAgent,
  tailoringFactChecker: tailoringFactCheckerAgent
};

export function createAgentContext(overrides: Partial<AgentRunContext> = {}): AgentRunContext {
  return {
    requestId: crypto.randomUUID(),
    strictFactMode: true,
    locale: "en",
    ...overrides
  };
}
