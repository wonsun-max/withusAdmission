import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { MessageRole } from "@prisma/client";

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

    // 4. Build the system prompt using university guidelines
    const requirementsObj = typeof essay.guideline.requirements === 'string' 
      ? JSON.parse(essay.guideline.requirements) 
      : essay.guideline.requirements;

    const systemPrompt = `
당신은 최고 수준의 대학 입시 전문 컨설턴트(AI Copilot)입니다. 
당신의 목표는 학생이 ${essay.guideline.university} (${essay.guideline.major})에 합격할 수 있도록 완벽한 자기소개서를 완성하는 것입니다.

[모집요강 요구사항 및 질문 목록]
${JSON.stringify(requirementsObj, null, 2)}

[행동 지침 - 완벽을 향하여]
1. 모집요강의 문항을 학생에게 하나씩 제시하며, 그에 맞는 경험이나 생각(소재)을 이끌어내세요.
2. 한 번에 너무 많은 질문을 던지지 마세요. 대화하듯 자연스럽게 티키타카를 유도하세요.
3. 학생의 답변이 빈약하다면, 구체적인 사례("예를 들어 어떤 과목에서 그런 점을 느꼈나요?")를 추가로 질문하세요.
4. 학생의 소재가 충분히 모였다고 판단되면, 해당 문항에 대한 자소서 초안 단락을 작성하여 제시하세요.
5. 학생이 수정 피드백을 주면 이를 적극 반영하여 다듬으세요.
6. 전문적이고 정중한 한국어(해요체/하십시오체)를 사용하세요.
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

