import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { StudentService } from "@/lib/services/student-service";
import { openai } from "@/lib/openai";
import { Logger } from "@/lib/logger";

/**
 * POST /api/chat/profile
 * Profile-aware AI chatbot endpoint.
 * Injects the student's verified spec data into the system prompt
 * and streams GPT-4o responses back to the client.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load the student's full profile from DB
    const profile = await StudentService.getProfile(user.id);

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build spec summary for injection into system prompt
    const academicSummary =
      profile.academicRecords.length > 0
        ? profile.academicRecords
            .map((r) => `${r.subject}: ${r.grade} (${r.credit}학점)`)
            .join("\n")
        : "등록된 성적 없음";

    const activitySummary =
      profile.activities.length > 0
        ? profile.activities
            .map((a) => `• ${a.title}: ${a.description}`)
            .join("\n")
        : "등록된 활동 없음";

    const applicationSummary =
      profile.applications.length > 0
        ? profile.applications
            .map(
              (app) =>
                `• ${app.guideline.university} - ${app.guideline.major}`
            )
            .join("\n")
        : "지원 대학 미설정";

    const approvedDocs = profile.documents
      .filter((d) => d.isApproved)
      .map((d) => d.type)
      .join(", ");

    const systemPrompt = `당신은 "WithUs Admission"의 전문 재외국민 특별전형 입시 컨설턴트입니다.
학생이 자신의 입시 스펙에 대해 자유롭게 질문하면, 아래 검증된 데이터만을 근거로 정확하고 전략적인 조언을 제공하세요.

## 핵심 규칙
1. 아래 데이터에 없는 성적, 활동, 수상 경력을 절대 만들어내지 마세요.
2. 데이터가 부족하면 "해당 정보가 프로필에 등록되어 있지 않습니다. 프로필 페이지에서 추가해 주세요."라고 안내하세요.
3. 의대/치대/약대/수의대 지원인 경우 최고 수준의 엄격한 기준으로 평가하세요.
4. 한국어와 영어를 섞어 답변해도 됩니다. 학생이 사용하는 언어에 맞추세요.
5. 각 답변은 구체적이고 실행 가능한(actionable) 조언을 포함해야 합니다.

## 학생 프로필
- 트랙: ${profile.track || "미설정"}
- GPA: ${profile.gpa ?? "미등록"}
- 현재 상태: ${profile.status}

## 성적 기록
${academicSummary}

## 교내외 활동
${activitySummary}

## 지원 대학
${applicationSummary}

## 승인된 서류 종류
${approvedDocs || "없음"}

이 학생의 강점과 약점을 정확히 파악하고, 전략적 조언을 제공하세요.
답변할 때 마크다운 포맷을 활용하여 가독성을 높이세요.`;

    // Build the messages array for OpenAI
    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Stream response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    });

    // Convert OpenAI stream to ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    Logger.error("[chat/profile] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
