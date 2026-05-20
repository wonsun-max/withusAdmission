import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { MessageRole } from "@prisma/client";
import { getUniversityMeta } from "@/lib/university-meta";

export const maxDuration = 60; // Allow longer generation

export async function POST(req: NextRequest, { params }: { params: Promise<{ essayId: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    
    // In newer Next.js versions, params might need to be awaited. 
    // We do this to ensure compatibility.
    const resolvedParams = await Promise.resolve(params);
    const essayId = resolvedParams.essayId;

    // 1. Verify ownership and get essay with guidelines
    const essay = await db.essay.findUnique({
      where: { id: essayId },
      include: {
        student: true,
        guideline: true,
      },
    });

    if (!essay || essay.studentId !== user.id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    // 2. Get or Create Chat Session
    let session = await db.chatSession.findFirst({
      where: { essayId },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      session = await db.chatSession.create({
        data: { essayId },
      });
    }

    // 3. Save the last user message to the DB
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      await db.message.create({
        data: {
          sessionId: session.id,
          role: MessageRole.USER,
          content: lastMessage.content,
        },
      });
    }

    // 4. Fetch University-specific Meta & Brand guidelines
    const schoolMeta = getUniversityMeta(essay.guideline.university);

    // Build the system prompt using university guidelines and target personas
    const requirementsObj = typeof essay.guideline.requirements === 'string' 
      ? JSON.parse(essay.guideline.requirements) 
      : essay.guideline.requirements;

    const systemPrompt = `
당신은 최고 수준의 대학 입시 전문 컨설턴트(AI Copilot)이자, ${essay.guideline.university} 전담 맞춤형 코치입니다.
당신의 궁극적인 목표는 학생이 ${essay.guideline.university} (${essay.guideline.major})에 합격할 수 있도록, 이 대학이 갈망하는 인재상에 완벽히 부합하는 자기소개서를 함께 설계하고 다듬어 완성하는 것입니다.

[지원 대학 정보]
- 대학명: ${schoolMeta.nameKo} (${schoolMeta.nameEn})
- 지망 전공: ${essay.guideline.major}
- 대학별 선호 인재상: ${schoolMeta.wantedPersonaKo}
- 인재상 상세 내용: ${schoolMeta.wantedPersonaDescKo}

[전문가 코칭 행동강령 - ${schoolMeta.wantedPersonaKo} 유도]
${schoolMeta.personaPrompt}

[모집요강 요구사항 및 질문 목록]
${JSON.stringify(requirementsObj, null, 2)}

[행동 지침 - 완벽을 향하여]
1. 모집요강의 자소서 문항을 학생에게 하나씩 차근차근 제시하며, 그에 부합하는 학생의 고교 시절 에피소드나 경험(소재)을 이끌어내세요.
2. 한 번에 여러 질문을 퍼붓지 마십시오. 학생이 답을 편안하게 털어놓을 수 있도록 실제 컨설팅처럼 친근하면서도 깊이 있는 티키타카(질의응답)를 유도하세요.
3. 학생의 답변이 지나치게 추상적이거나 스펙 위주로 나열되어 있다면, 구체적인 사례("어떤 과목의 어떤 개념에서 그런 호기심을 느꼈는지", "팀원과 갈등이 생겼을 때 구체적으로 어떻게 조율을 시도했는지" 등)를 추가 질문하여 사실관계를 구체화하세요.
4. 학생의 고유한 소재가 충분히 모였고 팩트가 정립되었다고 판단되면, 해당 문항의 글자수 기준에 최적화된 높은 수준의 자소서 초안 문단을 한국어로 작성하여 학생에게 제안하세요.
5. 학생이 수정 요청이나 피드백을 제시하면 이를 적극 경청하고 보완하여 문단을 세련되게 다듬어 가십시오.
6. 전문적이고 신뢰감을 주는 존댓말(해요체 및 하십시오체)을 품격 있게 사용하세요.
    `.trim();

    // 5. Invoke AI streaming
    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: messages,
      async onFinish({ text }) {
        // Persist the assistant's response when the stream finishes
        await db.message.create({
          data: {
            sessionId: session!.id,
            role: MessageRole.ASSISTANT,
            content: text,
          },
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ essayId: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const essayId = resolvedParams.essayId;

    const session = await db.chatSession.findFirst({
      where: { essayId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      return NextResponse.json([]);
    }

    // Map Prisma messages to Vercel AI SDK format
    const formattedMessages = session.messages.map((m) => ({
      id: m.id,
      role: m.role.toLowerCase(), // 'USER' -> 'user', 'ASSISTANT' -> 'assistant'
      content: m.content,
      createdAt: m.createdAt,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error("Chat API GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

