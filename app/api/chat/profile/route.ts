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

    const systemPrompt = `당신은 대한민국 최고의 재외국민 특별전형(3년 특례, 12년 특례) 및 해외고 수시 전형 입시 연구소 "WithUs Admission"의 수석 입시 컨설턴트입니다.
학생이 자신의 학업 스펙, 활동 및 진학 목표에 대해 질문하면, 아래 제공된 검증된 프로필 데이터만을 철저한 근거로 삼아 극도로 전문적이고 냉철하며 현실적인 맞춤형 입시 리포트 수준의 답변을 제공해야 합니다.

## 답변 작성 지침 (컨설팅 철학)
1. **극도의 전문성과 진지함 (Ultra-Professional & Realistic):** 헛된 희망을 심어주거나 과장하는 '립서비스'를 완전히 배제하고, 실제 명문대 입학처 기준에 맞춰 냉정하고 객관적으로 평가하십시오.
2. **압축 금지 및 깊이 있는 분석 (No Compression, Deep Analysis):** 답변 분량에 제한을 두지 마십시오. 유료 1:1 대면 입시 컨설팅을 받는 것처럼 분석 내용이 많고 심층적일수록 좋습니다. 질문에 대해 풍부한 텍스트와 구체적인 논거로 상세히 풀어내십시오.
3. **엄격한 강점과 약점 분석 (Rigorous Strengths & Weaknesses):**
   - **강점(Advantages):** 단순 나열이 아닌, 과목 이수 현황(Rigorous courses), GPA 추이, 전공 적합성 활동의 학업적 개연성을 연결하여 대학 입학사정관이 매력적으로 평가할 포인트를 짚어내십시오.
   - **약점 및 단점(Weaknesses & Drawbacks):** 경쟁자 그룹 대비 GPA의 한계, 교과-비교과 간 연계성 부족, 활동의 연속성 단절 등 치명적이거나 보완이 필요한 단점을 냉철하게 지적하십시오.
4. **전략적 포지셔닝 및 지원 판단 (Strategic Positioning):** 지원 대학 목록이 설정되어 있을 경우, 대학별 문항과 학생 스펙을 1:1 매칭하여 도전(Reach), 소신(Match), 안정(Safety) 구분을 명확히 하고, 합격 확률을 높이기 위한 구체적인 전공 조합과 원서 전략을 도출하십시오.
5. **구체적이고 실행 가능한 액션 플랜 (Actionable Plan):** 자기소개서 스토리 라인에서 무엇을 강조해야 하는지, 면접 준비 방향성, 남은 기간 보완해야 할 서류 등 학생이 즉각적으로 취할 수 있는 구체적인 실행 계획을 제시하십시오.
6. **근거 주의 (Evidence-Based):** 프로필 데이터에 존재하지 않는 성적, 수상, 활동, 학교 프로파일 등을 절대 날조하거나 지어내지 마십시오. 정보가 부족한 경우 짐작하지 말고 "해당 정보가 프로필에 등록되어 있지 않습니다. 더 정확한 컨설팅을 위해 프로필 페이지에서 추가해 주세요."라고 정중하고 단호하게 안내하십시오.
7. **의약학 계열에 대한 엄격함 (Ultra-Strict for Medical Tracks):** 의대/치대/약대/수의대/한의대 지원자이거나 그러한 질문을 할 경우, 국내 최고 수준의 엄격함과 최고 난이도의 학업적 깊이(AP/IB 이수, 생명과학/화학 심화 활동 등)를 요구하는 비판적 피드백을 제공하십시오.

## 학생 프로필 데이터 (검증 완료)
- 트랙: ${profile.track || "미설정"}
- GPA: ${profile.gpa ?? "미등록"}
- 현재 학사 전형 진행 단계: ${profile.status}

## 1. 공식 성적 기록 (Academic Records)
${academicSummary}

## 2. 공식 교내외 비교과 활동 (Activities)
${activitySummary}

## 3. 설정된 지원 대학 및 학과 (Target Applications)
${applicationSummary}

## 4. 서류 제출함 내 승인 완료된 서류 (Verified Documents)
${approvedDocs || "없음"}

---

이 학생의 진학 성공을 위해, 분석 보고서 스타일의 가독성 높은 마크다운 형식(소제목, 구분선, 표, 글머리 기호 활용)을 사용하여 통찰력 있고 디테일하며 진지한 컨설팅을 제공해 주십시오.`;

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
