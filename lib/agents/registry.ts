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
    // In a real flow, this would be triggered by OCRService. 
    // Here we might just return the existing approved OCR data for the student.
    const docs = await StudentService.getDocuments(input.studentId);
    const approvedDoc = docs.find(d => d.isApproved);

    return {
      agentId: "ocr-parser",
      status: approvedDoc ? "complete" : "needs-human-review",
      payload: {
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

    const approvedOcr = student.documents
      .filter(d => d.isApproved)
      .map(d => d.ocrData);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 입시 컨설턴트입니다. 학생의 OCR 데이터를 분석하여 강점, 약점, 요약을 JSON으로 반환하세요.",
        },
        {
          role: "user",
          content: `학생 트랙: ${student.track}\nOCR 데이터: ${JSON.stringify(approvedOcr)}`,
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
    // This agent would use OpenAI to generate themes if they don't exist, 
    // or to draft the essay if an answer is provided.
    const student = await StudentService.getProfile(input.studentId);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "학생의 스펙을 기반으로 3가지 스토리 테마를 제안하고, 선택된 테마와 답변이 있다면 초안을 작성하세요. JSON 반환.",
        },
        {
          role: "user",
          content: `답변: ${input.answer}\n선택 테마 ID: ${input.selectedThemeId}`,
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
          content: "마스터 자소서를 대학별 문항에 맞춰 변환하고 팩트체크를 진행하세요. JSON 반환.",
        },
        {
          role: "user",
          content: `대학: ${guideline.university}\n문항: ${JSON.stringify(guideline.requirements)}\n초안: ${input.masterEssay}`,
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
