import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { essayId } = await req.json();

    if (!essayId) {
      return NextResponse.json({ error: "Missing essayId" }, { status: 400 });
    }

    // 1. 에세이 및 학생 OCR 데이터 조회 (팩트체크용)
    const essay = await db.essay.findUnique({
      where: { id: essayId },
      include: { 
        student: {
          include: { documents: true }
        }
      },
    });

    if (!essay || essay.studentId !== user.id) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 });
    }

    const ocrData = essay.student.documents.map((d: any) => d.ocrData);

    // 2. OpenAI 호출 (Fact Check & Tailoring)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 입시 서류의 진위 여부를 판별하고 내용을 최적화하는 전문가입니다. 성적표 데이터와 자소서 내용을 비교하여 사실과 다른 내용(허위 스펙)이 있는지 찾아내고, 대학별 문항에 맞춰 최종 다듬기를 진행하세요.",
        },
        {
          role: "user",
          content: `성적표 데이터: ${JSON.stringify(ocrData)}\n자소서 초안: ${essay.masterKo}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    // 예상 구조: { "tailoredResult": "...", "factWarnings": [...] }

    // 3. DB 업데이트
    await db.essay.update({
      where: { id: essayId },
      data: {
        tailoredResult: result.tailoredResult,
        factWarnings: result.factWarnings,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Tailoring Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
