import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getUniversityMeta } from "@/lib/university-meta";
import { GuidelineLoaderService } from "@/lib/services/guideline-loader";
import { createClient } from "@/utils/supabase/server";

/**
 * POST /api/chat/[slug]
 * Streams a chat response from the university-persona chatbot.
 * Uses the student's spec from DB as context.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { message, sessionId, mode = "chat" } = body;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = user.id;

  const meta = getUniversityMeta(slug);
  if (!meta || meta.slug === "default") {
    return new Response(JSON.stringify({ error: "지원하지 않는 대학입니다." }), { status: 404 });
  }

  try {
    // Ensure User record exists — EssaySession has a FK to User.
    // Why: Without a parent User row, session.create() fails with P2003 FK violation.
    await db.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: user.email!,
        fullName: user.user_metadata?.full_name || user.email!.split("@")[0],
      },
      update: {},
    });

    // Load student spec for context injection, including individual documents
    const spec = await db.studentSpec.findUnique({ 
      where: { userId },
      include: { documents: true }
    });
    
    const specContext = spec?.analysisResult
      ? JSON.stringify(spec.analysisResult, null, 2)
      : null;

    const filesContext = spec?.documents && spec.documents.length > 0
      ? spec.documents.map((doc) => ({
          fileName: doc.fileName,
          mimeType: doc.mimeType,
          fileSize: doc.fileSize,
          isProcessed: doc.isProcessed,
          createdAt: doc.createdAt,
          parsedData: doc.parsedData, // The raw parsed JSON extracted from this specific file
        }))
      : null;

    // Load or create session
    let session = sessionId
      ? await db.essaySession.findUnique({ where: { id: sessionId }, include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } } })
      : null;

    if (!session) {
      session = await db.essaySession.create({
        data: { userId, universitySlug: slug, mode },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    // Save user message
    await db.essayMessage.create({
      data: { sessionId: session.id, role: "user", content: message },
    });

    // Load guidelines RAG context
    const guidelines = GuidelineLoaderService.getGuidelines(slug);

    // Build system prompt with student spec and raw uploaded files context
    const systemPrompt = buildSystemPrompt(
      meta, 
      mode, 
      specContext, 
      filesContext ? JSON.stringify(filesContext, null, 2) : null, 
      guidelines
    );

    // Build message history for OpenAI
    const history = (session.messages ?? []).map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history,
      { role: "user" as const, content: message },
    ];

    // Stream response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
      max_tokens: mode === "essay" ? 2000 : 800,
      temperature: mode === "essay" ? 0.7 : 0.9,
    });

    const encoder = new TextEncoder();
    let fullContent = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send session ID first
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sessionId: session!.id })}\n\n`));

          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              fullContent += delta;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }

          // Persist assistant message
          await db.essayMessage.create({
            data: { sessionId: session!.id, role: "assistant", content: fullContent },
          });

          // If essay mode, update draft
          if (mode === "essay") {
            await db.essaySession.update({
              where: { id: session!.id },
              data: { essayDraft: fullContent },
            });
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          logger.error("Chat stream error", { err });
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    logger.error("Chat route error", { error });
    return new Response(JSON.stringify({ error: "서버 오류" }), { status: 500 });
  }
}

/**
 * GET /api/chat/[slug]
 * Retrieves the latest chat session and essay draft for the university.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = user.id;

  try {
    const session = await db.essaySession.findFirst({
      where: { userId, universitySlug: slug },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!session) {
      return new Response(JSON.stringify({ messages: [], essayDraft: "" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Session GET error", { error });
    return new Response(JSON.stringify({ error: "서버 오류" }), { status: 500 });
  }
}

/**
 * Builds the system prompt for OpenAI grounding.
 * 
 * Why: Keeping the prompt structured guarantees the AI chatbot maintains its distinct
 * university persona while grounding all essay-writing/counseling advice on the student's actual spec
 * and official 2026 university guidelines.
 */
function buildSystemPrompt(
  meta: ReturnType<typeof getUniversityMeta>,
  mode: string,
  specContext: string | null,
  filesContext: string | null,
  guidelines: string | null
): string {
  const specSection = specContext
    ? `\n\n## 학생 스펙 (업로드된 모든 서류 통합 AI 분석 결과)\n\`\`\`json\n${specContext}\n\`\`\`\n위 스펙을 완전히 파악하고, 이 학생의 강점과 약점을 깊이 이해한 상태에서 대화하십시오. 없는 사실을 지어내거나 추측해서 작성하면 절대 안 되며, 오직 학생 스펙 문서에 드러난 사실만을 활용하십시오.`
    : "\n\n## 주의: 아직 학생이 스펙 문서를 업로드하지 않았습니다. 일반적인 입시 상담을 진행하되, 스펙 업로드를 권유하십시오.";

  const filesSection = filesContext
    ? `\n\n## 학생이 업로드한 원본 서류 목록 및 개별 파일 상세 분석 결과\n학생이 직접 업로드한 원본 파일 정보와 개별 문서별 분석 데이터입니다:\n\`\`\`json\n${filesContext}\n\`\`\`\n학생과 대화할 때 학생이 제출한 구체적 서류 파일 목록을 정확하게 인지하고 상담에 활용하십시오. 예: "성적표 파일(Transcript.pdf)을 보니 11학년 성적이 대단하시네요", "봉사활동 증명서가 업로드되어 있네요"와 같이 구체적으로 파일을 언급하며 호응하거나 크로스체크 하십시오.`
    : "";

  const guidelinesSection = guidelines
    ? `\n\n## 공식 2026학년도 대학 입학 모집요강 정보 (RAG)\n${guidelines}\n\n위의 공식 모집요강 내용을 철저히 지키십시오. 자소서 분량 제한, 지원 자격(3년/12년 해외체류), 필수 제출 서류 및 일정 등에 대해 절대 허구의 내용을 지어내어 상담하지 말고 오직 요강 내 명시된 팩트에 기반해 답변하십시오.`
    : "";

  const diagnosisSection = specContext
    ? `\n\n## 학생의 강점 및 약점 분석 및 진단 지침 (Strengths & Weaknesses Diagnosis)
- 학생이 제출한 통합 스펙 데이터 및 서류 목록(성적표, 수상 실적, 봉사 등)을 철저히 분석하여, 이 학생만의 **명확한 강점(Strengths)**과 **약점/보완점(Weaknesses)**을 객관적이고 날카롭게 진단하십시오.
- **강점(Strengths)**: 학생이 뛰어난 성취를 보인 과목(예: 특정 학기 수학 A+), 탁월한 수상 내역, 주도성이 돋보이는 비교과/동아리 활동 등을 짚어주고, 이를 지원학과와 연결하여 핵심 셀링 포인트로 어떻게 살릴지 조언하십시오.
- **약점 및 보완점(Weaknesses)**: ${meta.nameKo}의 합격 기준 대비 부족하거나 우려되는 지점(예: 성적 하락세, 전공 관련 학술 활동 부족, 표준화 시험 성취 공백, 부족한 봉사 시간 등)을 솔직하게 지적하고, 이를 자기소개서 스토리라인이나 추가 스펙으로 극복할 수 있는 실질적인 보완책(Action Plan)을 반드시 제안하십시오.
- 단순한 입에 발린 칭찬이나 모호한 격려에 그치지 마십시오. 학생에게 실질적이고 날카로운 입시 피드백을 주는 것이 최우선 임무입니다.`
    : "";

  if (mode === "essay") {
    return `${meta.personaPrompt}${specSection}${filesSection}${guidelinesSection}${diagnosisSection}

## 자소서 작성 모드
당신은 지금 학생의 자기소개서 작성을 직접 도와야 합니다.
- 학생의 스펙에 기반하여 사실에 근거한 자소서를 작성하십시오.
- 검증되지 않은 내용은 절대 추가하지 마십시오.
- 학생의 강점을 ${meta.nameKo}의 인재상과 직접 연결하십시오.
- 완성된 자소서 초안은 마크다운 없이 순수 텍스트로 작성하십시오.
- 글자수 제한이 있으면 반드시 준수하십시오.`;
  }

  return `${meta.personaPrompt}${specSection}${filesSection}${guidelinesSection}${diagnosisSection}

## 대화 규칙
- 한국어로 응답하십시오.
- 학생이 ${meta.nameKo}에 적합한 지원자가 될 수 있도록 구체적인 조언을 제공하십시오.
- 답변은 간결하되 날카롭고 실질적이어야 합니다.
- 단순한 칭찬이 아닌 실제 강점과 약점을 솔직하게 짚어내십시오.`;
}
