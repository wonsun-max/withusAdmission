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

## 필수 작성 양식 (6단계 초정밀 리포트 구조)
답변을 구성할 때는 반드시 아래의 6개 단계를 명확한 대주제 마크다운 타이틀로 나누어 작성하십시오. 각 단계는 개조식 요약이 아닌, 서술식 문장을 결합하여 극도로 상세하고 깊이 있게 풀어서 서술해야 합니다.

---

### [1단계] 학업 성적 및 이수 과목 다각도 분석 (Overall & Academic Profile Analysis)
- GPA 추이 분석 (학년별 상승/유지/하락세 분석) 및 원인 파악
- 이수한 교과목들의 학업적 난이도(Rigor) 및 전공 기초 학업 역량 수준 평가
- 타 경쟁자 그룹 대비 학업 능력의 대략적인 포지셔닝 예측 (국내 명문대 수시 및 해외고 특례 전형 기준)

### [2단계] 교과 외 비교과 활동(Activities)의 연계성 및 전공 적합성 평가 (Extracurricular & Major Fit Analysis)
- 등록된 비교과 활동 중 가장 학업적/리더십 측면에서 의미 있는 핵심 활동 선정 및 개별 성과 분석
- 활동 간의 유기적 연계성(Storyline) 및 지속성(Consistency) 평가
- 전공 적합성 측면에서 가치 있는 활동과 단순 시간 채우기 식/알맹이 부족 활동 구분 및 지적

### [3단계] 독보적 강점 및 합격 유리 요소 (In-depth Strengths & Competitive Advantages)
- 다른 해외고/재외국민 지원자와 차별화되는 이 학생만의 독보적인 강점 최소 3가지 상세 분석
- 대학 입학사정관들이 서류 심사 과정에서 매력적으로 평가할 만한 구체적인 세일즈 포인트(USP) 제시

### [4단계] 치명적 약점, 단점 및 리스크 요인 (Rigorous Weaknesses, Drawbacks & Critical Risks)
- 이 학생이 대학 입시에서 직면할 가장 뼈아픈 약점 및 단점 최소 3가지 냉철하게 지적
- 성적 불균형, 주요 전공 관련 과목의 성적 저조, 비교과 활동의 깊이 부족, 학업 연속성 단절 등 경쟁자 대비 서류상 감점 요인을 미화하지 말고 단도직입적이고 현실적으로 진단

### [5단계] 지원 설정 대학/학과별 현실적 합격 가능성 및 포지셔닝 (Reach/Match/Safety Admission Target Strategy)
- 현재 매칭된 대학 및 학과에 대한 세밀한 분석과 합격 확률 예측:
  - **도전(Reach):** 현실적으로 합격 가능성이 낮지만 전형 설계에 따라 도전해볼 만한 대학 및 보완 전략
  - **소신(Match):** 현재 스펙으로 가장 경쟁력 있는 소신 지원 대학 및 학과
  - **안정(Safety):** 반드시 합격권을 확보해야 하는 안정 지원 대학 및 학과
- 만약 설정된 대학이 없는 경우, 현재 스펙으로 지원 가능한 최선의 대학군 추천 및 포지셔닝 제안

### [6단계] 약점 극복을 위한 단계별 초정밀 액션 플랜 (Comprehensive Step-by-Step Action Roadmap)
- **자기소개서(SOP/Personal Statement) 스토리라인 극복 전략:** 약점을 어떻게 스토리로 승화시킬지, 어떤 활동을 중심으로 자소서를 설계해야 하는지 구체적인 에피소드 구성 방안 제시
- **남은 기간 서류/비교과 보완 및 면접/시험 대비 전략:** 추가로 준비해야 할 공인성적(AP, IB, ACT, SAT 등), 비교과 활동 보고서 보완안, 대학별 고사 및 심층 면접 대비 핵심 포인트 제시

---

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
      max_tokens: 4096,
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
