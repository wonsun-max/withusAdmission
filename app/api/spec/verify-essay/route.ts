import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createClient } from "@/utils/supabase/server";

/**
 * Interface representing the audit outcome of a single sentence.
 * Why: Having strong types ensures high-fidelity payload serialization and reliable parsing.
 */
export interface AuditedSentence {
  text: string;
  status: "VERIFIED" | "UNVERIFIED" | "NEUTRAL";
  category: "academic" | "award" | "activity" | "volunteer" | "residency" | "general";
  explanation?: string;
  matchedRecord?: string;
}

/**
 * Interface representing the unified essay audit report response.
 */
export interface EssayAuditResponse {
  score: number;
  summary: string;
  sentences: AuditedSentence[];
}

/**
 * POST /api/spec/verify-essay
 * Audits the student's essay draft against their verified spec records.
 * 
 * Why: Enforces zero-tolerance for unverified claims and hallucinations in admissions.
 * Splits the essay draft into consecutive sentences, classifies claims, and returns structured feedback.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const userId = user.id;
    const { essayText } = await req.json();

    if (!essayText || !essayText.trim()) {
      return NextResponse.json({ error: "검증할 자소서 본문이 비어 있습니다." }, { status: 400 });
    }

    // Load student spec integrated documents to match claims
    const spec = await db.studentSpec.findUnique({
      where: { userId },
      include: { documents: true }
    });

    if (!spec || !spec.analysisResult) {
      return NextResponse.json({
        score: 0,
        summary: "업로드되어 분석된 스펙 정보가 없습니다. 필수 서류 성적표 및 활동 증빙을 먼저 업로드하십시오.",
        sentences: [
          {
            text: essayText,
            status: "UNVERIFIED",
            category: "general",
            explanation: "서류 업로드 및 스펙 분석이 완료되지 않아 기재된 사실들의 진위 확인이 불가능합니다.",
          }
        ]
      } as EssayAuditResponse);
    }

    const specContext = JSON.stringify(spec.analysisResult, null, 2);
    const filesContext = spec.documents && spec.documents.length > 0
      ? JSON.stringify(spec.documents.map(d => ({ fileName: d.fileName, parsedData: d.parsedData })), null, 2)
      : "No files uploaded";

    const systemPrompt = `You are a strict, top-tier college admissions counselor auditing an applicant's essay for factual truthfulness against their official uploaded files and verified records.

Your goal is to parse the essay text into individual sentences, evaluate whether each sentence contains factual claims (such as course names, grades, GPAs, award names, rankings, club leadership positions, volunteer hours, test scores, study periods), and audit them against the student's verified spec database.

## Rules for Sentences Array:
1. Every single sentence from the input essay text MUST be represented exactly in the returned array.
2. The joined text of the returned sentences MUST equal the original essay text (ignoring minor whitespace changes). Do NOT drop, rephrase, or rearrange any sentence.
3. Every sentence must have exactly one classification:
   - "VERIFIED": If the sentence contains a factual claim that matches a record in the student's spec or uploaded documents.
   - "UNVERIFIED": If the sentence contains a specific academic or extracurricular claim that is NOT supported by the spec/files, or contradicts them.
   - "NEUTRAL": If the sentence is a general transition, reflection, personal philosophy, or contains no checkable concrete claims.

## Rules for Verification Strictness:
- Be honest and rigorous. Do not let unverified claims pass.
- If a student claims they got a certain grade (e.g., "A", "AP 5", "GPA 3.9"), but no such grade or test score is found in their transcript, mark it as "UNVERIFIED".
- If they claim they did a volunteer activity (e.g., "100 hours of nursing home care"), but the volunteer records show "10 hours", mark it as "UNVERIFIED" and explain the discrepancy.
- For neutral sentences, always return "NEUTRAL".

## Extracted Student Spec Context (Truth Source):
\`\`\`json
${specContext}
\`\`\`

## Original Uploaded Files & OCR Parsed Data Context:
\`\`\`json
${filesContext}
\`\`\`

You must respond with a strictly formatted JSON object matching this schema:
{
  "score": number (0 to 100 representing the percentage of verified/neutral sentences vs unverified claims. All VERIFIED or NEUTRAL gives 100),
  "summary": "Brief summary in Korean of the fact-check audit results, noting specific unverified items or validating overall match quality.",
  "sentences": [
    {
      "text": "original sentence string exactly as written in the draft",
      "status": "VERIFIED" | "UNVERIFIED" | "NEUTRAL",
      "category": "academic" | "award" | "activity" | "volunteer" | "residency" | "general",
      "explanation": "Detailed explanation in Korean of why it is unverified or how it matches.",
      "matchedRecord": "Name or key detail of the matching database record if verified, else null"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please audit this essay draft:\n\n${essayText}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // low temperature to ensure precise structured output
    });

    const resultText = completion.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("OpenAI verification response was empty.");
    }

    const report = JSON.parse(resultText) as EssayAuditResponse;
    logger.info("Essay audit completed successfully", { userId, score: report.score });

    return NextResponse.json(report);
  } catch (error) {
    logger.error("Essay audit route error", { error });
    return NextResponse.json({ error: "팩트체크 처리 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
