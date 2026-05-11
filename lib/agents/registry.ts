import { agentPrompts } from "./prompts";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { StudentService } from "@/lib/services/student-service";
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

function audit(context: AgentRunContext, provider: "openai" | "upstage" | "mock" = "openai") {
  return {
    provider,
    model: provider === "openai" ? "gpt-4o" : "v1",
    createdAt: new Date().toISOString(),
    requestId: context.requestId
  };
}

export const ocrParserAgent: AdmissionAgent<OcrParserInput, OcrParserOutput> = {
  id: "ocr-parser",
  name: "OCR Parser",
  purpose: "Extract transcript and activity-proof records while preserving original labels and scores.",
  async run(input, context) {
    const docs = await StudentService.getDocuments(input.studentId);
    const approvedDoc = docs.find(d => d.isApproved);

    return {
      agentId: "ocr-parser",
      status: approvedDoc ? "complete" : "needs-human-review",
      payload: {
        classifiedType: approvedDoc?.type || "UNKNOWN",
        records: (approvedDoc?.ocrData as any)?.records || [],
        rawProviderReference: approvedDoc?.id
      },
      warnings: approvedDoc ? [] : ["No approved document found for this student."],
      audit: audit(context, "upstage")
    };
  }
};

export const profileEvaluatorAgent: AdmissionAgent<ProfileEvaluatorInput, any> = {
  id: "profile-evaluator",
  name: "Profile Evaluator",
  purpose: "Evaluate approved facts with separate medical and general branches.",
  async run(input, context) {
    const student = await StudentService.getProfile(input.studentId);
    if (!student) throw new Error("Student not found");

    const SPEC_TYPES = ["TRANSCRIPT", "LANGUAGE", "ACTIVITY", "TEST_SCORE", "SCHOOL_PROFILE"];
    
    const approvedOcr = student.documents
      .filter(d => d.isApproved && SPEC_TYPES.includes(d.type))
      .map(d => ({
        type: d.type,
        data: d.ocrData
      }));

    const guideline = input.guidelineId 
      ? await db.universityGuideline.findUnique({ where: { id: input.guidelineId } })
      : null;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: agentPrompts.profileEvaluator.system,
        },
        {
          role: "user",
          content: `Track: ${student.track}
Major: ${input.targetMajor}
Target University: ${guideline?.university || "General"}
University Selection Criteria: ${JSON.stringify(guideline?.requirements || "None provided")}
Approved Student Data: ${JSON.stringify(approvedOcr)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const payload = JSON.parse(response.choices[0].message.content || "{}");

    return {
      agentId: "profile-evaluator",
      status: "complete",
      payload,
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
    const student = await StudentService.getProfile(input.studentId);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: agentPrompts.storyBuilder.system,
        },
        {
          role: "user",
          content: `Answer: ${input.answer}\nSelected Theme ID: ${input.selectedThemeId}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const payload = JSON.parse(response.choices[0].message.content || "{}");

    return {
      agentId: "story-builder",
      status: input.answer ? "complete" : "needs-human-review",
      payload: {
        themes: payload.themes || [],
        selectedTheme: payload.selectedTheme || payload.themes?.[0],
        masterEssay: payload.masterEssay || ""
      },
      warnings: [],
      audit: audit(context)
    };
  }
};

export const tailoringFactCheckerAgent: AdmissionAgent<TailoringInput, TailoringOutput> = {
  id: "tailoring-fact-checker",
  name: "Tailoring and Fact Checker",
  purpose: "Tailor a master essay to a target university prompt without unsupported claims.",
  async run(input, context) {
    const guideline = await db.universityGuideline.findUnique({
      where: { id: input.guidelineId || "" }
    });

    if (!guideline) throw new Error("Guideline not found");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: agentPrompts.tailoringFactChecker.system,
        },
        {
          role: "user",
          content: `University: ${guideline.university}\nRequirements: ${JSON.stringify(guideline.requirements)}\nMaster Draft: ${input.masterEssay}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const payload = JSON.parse(response.choices[0].message.content || "{}");

    return {
      agentId: "tailoring-fact-checker",
      status: "complete",
      payload: {
        ...payload,
        guideline: {
          id: guideline.id,
          university: guideline.university,
          major: guideline.major,
        }
      },
      warnings: [],
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
