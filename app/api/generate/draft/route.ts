import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = user.id;
    const { guidelineId, answers } = await req.json();

    if (!guidelineId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. 가이드라인 조회
    const guideline = await db.universityGuideline.findUnique({
      where: { id: guidelineId },
    });

    if (!guideline) {
      return NextResponse.json({ error: "Guideline not found" }, { status: 404 });
    }

    // 2. OpenAI 호출 (Master Draft 생성)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 세계 최고의 대학 입시 컨설턴트입니다. 학생의 답변과 대학 모집요강을 바탕으로 합격 가능성이 가장 높은 자소서 초안을 작성하십시오. 한국어와 영어 두 버전을 모두 작성해야 합니다.",
        },
        {
          role: "user",
          content: `대학/전공: ${guideline.university} / ${guideline.major}\n요구사항: ${JSON.stringify(guideline.requirements)}\n학생 답변: ${JSON.stringify(answers)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    // 예상 구조: { "masterKo": "...", "masterEn": "..." }

    // 3. DB 저장
    const essay = await db.essay.create({
      data: {
        studentId,
        guidelineId,
        masterKo: result.masterKo,
        masterEn: result.masterEn,
      },
    });

    return NextResponse.json({
      success: true,
      essayId: essay.id,
      content: result,
    });
  } catch (error: any) {
    console.error("Draft Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
