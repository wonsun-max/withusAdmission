import { NextRequest, NextResponse } from "next/server";
import { DocumentParserService } from "@/lib/services/document-parser";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createClient } from "@/utils/supabase/server";
import { mergeAnalysisResults } from "@/lib/services/spec-merger";

/**
 * POST /api/spec/analyze
 * 파일 업로드 → AI 분석 → 기존 문서들과 통합 병합 → StudentSpec DB 저장.
 *
 * Why: 사용자가 복수의 서류를 자유롭게 나눠서 업로드해도 모든 문서가 유실되지 않고
 * 전체 스펙이 누적 병합(Incremental Merging)되도록 개선하여, "they could add files like howmuch want" 요구를 실현합니다.
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

    // User가 DB에 존재하는지 보장
    await db.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: user.email!,
        fullName: user.user_metadata?.full_name || user.email!.split("@")[0],
      },
      update: {},
    });

    // StudentSpec 분석 중 상태로 설정
    await db.studentSpec.upsert({
      where: { userId },
      create: { userId, analysisStatus: "ANALYZING" },
      update: { analysisStatus: "ANALYZING" },
    });

    // 파일 병렬 처리 및 파싱 결과 DB 개별 문서로 임시 저장
    await Promise.all(
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
        } catch (err) {
          logger.error("Document parse failed", { file: file.name, err });
        }
      })
    );

    // 사용자의 모든 처리 완료된 파일(기존 파일 + 새 파일)들을 DB에서 조회
    // Why: 기존 파일 데이터의 누락을 완벽히 방지합니다.
    const allDocs = await db.specDocument.findMany({
      where: { specId: userId, isProcessed: true },
    });

    if (allDocs.length === 0) {
      await db.studentSpec.update({
        where: { userId },
        data: { analysisStatus: "ERROR" },
      });
      return NextResponse.json({ error: "문서 분석에 실패했습니다." }, { status: 500 });
    }

    // 모든 문서의 parsedData를 취합해 일괄 병합
    const allParsed = allDocs
      .map((doc) => doc.parsedData)
      .filter(Boolean) as Record<string, unknown>[];

    const mergedResult = mergeAnalysisResults(allParsed);

    // 최종 누적 병합 결과를 StudentSpec에 저장
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
 * 현재 로그인 유저의 모든 스펙 문서 정보와 통합 분석 결과를 조회.
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
