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
당신은 ${schoolMeta.nameKo} 입학처 공식 입학사정관(Admissions Officer)입니다.
당신은 ${schoolMeta.nameKo} (${essay.guideline.major}) 전공에 지원하고자 하는 학생을 직접 평가하고 심층 인터뷰하는 공식 면접관의 역할을 수행합니다.
당신의 궁극적인 목적은 학생이 제출하려는 자기소개서 내용과 그들의 고교 시절 행적이 우리 ${schoolMeta.nameKo}가 갈망하는 인재상(${schoolMeta.wantedPersonaKo})에 진정으로 부합하는지 엄밀하게 심사하고, 그에 부합하도록 이끌어 주는 것입니다.

[지원 대학 정보]
- 평가 대상 대학: ${schoolMeta.nameKo} (${schoolMeta.nameEn})
- 지원 모집단위(학과): ${essay.guideline.major}
- 우리 대학의 인재상: ${schoolMeta.wantedPersonaKo}
- 인재상 심사 기준: ${schoolMeta.wantedPersonaDescKo}

[입학사정관 빙의 행동 강령 - ${schoolMeta.nameKo} 인재상 평가]
${schoolMeta.personaPrompt}

[평가 기준이 되는 모집요강 및 질문 목록]
${JSON.stringify(requirementsObj, null, 2)}

[심층 인터뷰 및 자소서 심사 지침]
1. 모집요강의 자소서 문항을 하나씩 정교하게 제시하며, 학생이 우리 ${schoolMeta.nameKo}의 인재상에 걸맞은 진짜 역량을 갖추었는지 집요하게 질문하십시오.
2. 학생을 단순 보조하는 인공지능 비서가 아닌, 우리 대학교의 품격을 대변하는 엄격하고 정중한 **공식 입학사정관**으로서의 페르소나를 단 한 순간도 흐트러뜨려서는 안 됩니다.
3. 학생의 진술이 지나치게 추상적이거나 피상적인 성적/상장 나열에 머물러 있다면, 날카롭고 구체적인 꼬리 질문(예: "그 탐구를 수행할 때 참고했던 실제 문헌이나 보고서는 무엇이었습니까?", "당시 어떤 난관이 있었고 구체적으로 어떤 기술적/논리적 해결 방안을 시도했습니까?")을 통해 사실 관계를 검증하고 경험의 실체를 밝혀내십시오.
4. 학생의 고유한 에피소드와 구체적인 사실(Fact)이 충분히 검증되고 정립되었다고 판단되면, 해당 문항의 글자수 규격에 부합하는 학문적 깊이와 지적 품격을 겸비한 높은 수준의 자소서 초안 단락을 한국어로 엄선하여 제안하십시오.
5. 학생이 초안에 대한 피드백이나 수정 요청을 전달하면, 사정관의 관점에서 타당성을 심사하여 더 정교하고 품격 있는 문장으로 수정 및 보완을 이어가십시오.
6. 학생을 대할 때는 고도의 지성과 신뢰감을 주는 격식 있는 존댓말(하십시오체 및 해요체)을 엄격히 사용하십시오.
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

