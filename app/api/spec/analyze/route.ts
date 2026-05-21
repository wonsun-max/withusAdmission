import { NextRequest, NextResponse } from "next/server";
import { DocumentParserService } from "@/lib/services/document-parser";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createClient } from "@/utils/supabase/server";

/**
 * POST /api/spec/analyze
 * 파일 업로드 → AI 분석 → StudentSpec DB 저장.
 *
 * Why: 실제 로그인 유저의 세션에서 userId를 추출해 각 학생의 스펙을
 * 완전히 분리 저장합니다. demo-user 하드코딩을 완전히 제거합니다.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const userId = user.id;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "파일을 업로드해주세요." }, { status: 400 });
    }

    // User가 DB에 존재하는지 보장 (콜백에서 생성되지만 방어적으로 처리)
    await db.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: user.email!,
        fullName: user.user_metadata?.full_name || user.email!.split("@")[0],
      },
      update: {},
    });

    // StudentSpec upsert
    await db.studentSpec.upsert({
      where: { userId },
      create: { userId, analysisStatus: "ANALYZING" },
      update: { analysisStatus: "ANALYZING" },
    });

    // 파일 병렬 처리
    const parseResults = await Promise.all(
      files.map(async (file) => {
        try {
          const structured = await DocumentParserService.extractStructuredData(file);

          await db.specDocument.create({
            data: {
              specId: userId,
              fileName: file.name,
              storagePath: `uploads/${userId}/${Date.now()}-${file.name}`,
              mimeType: file.type || "application/octet-stream",
              fileSize: file.size,
              parsedData: structured,
              isProcessed: true,
            },
          });

          return structured;
        } catch (err) {
          logger.error("Document parse failed", { file: file.name, err });
          return null;
        }
      })
    );

    const validResults = parseResults.filter(Boolean);

    if (validResults.length === 0) {
      await db.studentSpec.update({
        where: { userId },
        data: { analysisStatus: "ERROR" },
      });
      return NextResponse.json({ error: "문서 분석에 실패했습니다." }, { status: 500 });
    }

    const mergedResult = mergeAnalysisResults(validResults as Record<string, unknown>[]);

    await db.studentSpec.update({
      where: { userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        analysisResult: mergedResult as any,
        analysisStatus: "DONE",
        lastAnalyzedAt: new Date(),
      },
    });

    return NextResponse.json({ status: "DONE", result: mergedResult });
  } catch (error) {
    logger.error("Spec analysis route error", { error });
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

/**
 * GET /api/spec/analyze
 * 현재 로그인 유저의 스펙 분석 결과 조회.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const spec = await db.studentSpec.findUnique({
      where: { userId: user.id },
      include: { documents: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json(spec ?? { analysisStatus: "PENDING", analysisResult: null });
  } catch (error) {
    logger.error("Spec GET error", { error });
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

function mergeAnalysisResults(results: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    persona: {},
    academic: { subjects: [] },
    activities: [],
    awards: [],
    tests: [],
    residency: {},
    personalInfo: {},
  };

  for (const result of results) {
    if (result.persona) {
      merged.persona = { ...(merged.persona as object), ...(result.persona as object) };
    }
    if (result.academic) {
      const existing = merged.academic as Record<string, unknown>;
      const incoming = result.academic as Record<string, unknown>;
      merged.academic = {
        ...existing,
        ...incoming,
        subjects: [
          ...((existing.subjects as unknown[]) ?? []),
          ...((incoming.subjects as unknown[]) ?? []),
        ],
      };
    }
    if (Array.isArray(result.activities)) (merged.activities as unknown[]).push(...result.activities);
    if (Array.isArray(result.awards)) (merged.awards as unknown[]).push(...result.awards);
    if (Array.isArray(result.tests)) (merged.tests as unknown[]).push(...result.tests);
    if (result.residency) merged.residency = { ...(merged.residency as object), ...(result.residency as object) };
    if (result.personalInfo) merged.personalInfo = { ...(merged.personalInfo as object), ...(result.personalInfo as object) };
  }

  return merged;
}
