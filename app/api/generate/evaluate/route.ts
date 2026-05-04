import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "No studentId provided" }, { status: 400 });
    }

    // 1. 학생 데이터 및 OCR 데이터 조회
    console.log("Evaluating studentId:", studentId);
    const student = await db.studentProfile.findUnique({
      where: { userId: studentId },
      include: { documents: true },
    });

    if (!student) {
      console.error("Student not found for ID:", studentId);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // OCR 데이터 취합 (최근 성적표 중심)
    const recentOcrData = student.documents
      .filter((d: any) => d.type === "TRANSCRIPT")
      .map((d: any) => d.ocrData)
      .filter(Boolean);

    // 2. OpenAI 프롬프트 구성
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `당신은 대한민국 재외국민 특별전형(12년/3년 특례) 전문 입시 컨설턴트입니다. 
          학생의 성적표(OCR)와 활동 내역을 분석하여 다음 기준에 따라 JSON 결과를 반환하세요:
          
          1. mode 결정: 지망 전공이 의예, 치의예, 약학, 수의예 등 보건의료 계열이면 'medical', 아니면 'general'.
          2. 분석 지침:
             - 'medical' 모드: 매우 엄격한 잣대로 분석하며, 반드시 1개의 '치명적 결격 사유(Critical Weakness)'를 찾아내고 이를 상쇄할 전략을 포함하세요.
             - 'general' 모드: 전공 적합성과 학업 역량 중심의 '전략적 테마'를 도출하세요.
          3. 결과 구조: { mode, strengths: string[], weaknesses: string[], overallSummary, themes: [{ id, title, description, prompt }] }`,
        },
        {
          role: "user",
          content: `학생 트랙: ${student.track}\n성적 데이터 요약: ${JSON.stringify(recentOcrData)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // 3. (옵션) 결과를 DB에 캐싱하거나 업데이트할 수 있음
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
