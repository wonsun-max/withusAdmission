import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createClient } from "@/utils/supabase/server";
import { mergeAnalysisResults } from "@/lib/services/spec-merger";

/**
 * DELETE /api/spec/document/[id]
 * 특정 스펙 문서를 삭제하고 전체 스펙 프로파일을 실시간 재구성합니다.
 *
 * Why: 사용자가 잘못 올린 서류를 입시설계에서 제외하고 싶을 때 문서를 제거하면,
 * 전체 병합 결과(StudentSpec.analysisResult)도 해당 문서 없이 깨끗하게 재병합하여 업데이트합니다.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;
    const userId = user.id;

    // 문서 및 소유권 확인
    const document = await db.specDocument.findUnique({
      where: { id },
    });

    if (!document || document.specId !== userId) {
      return NextResponse.json({ error: "문서를 찾을 수 없거나 권한이 없습니다." }, { status: 404 });
    }

    // 문서 데이터 삭제
    await db.specDocument.delete({
      where: { id },
    });

    // 남은 문서들 조회
    const remainingDocs = await db.specDocument.findMany({
      where: { specId: userId, isProcessed: true },
    });

    if (remainingDocs.length === 0) {
      // 남은 서류가 전혀 없으면 스펙 분석 상태를 초기화
      await db.studentSpec.update({
        where: { userId },
        data: {
          analysisResult: null as any,
          analysisStatus: "PENDING",
        },
      });

      return NextResponse.json({ status: "SUCCESS", result: null });
    }

    // 남아있는 파일의 파싱 데이터를 수집해 다시 병합
    const allParsed = remainingDocs
      .map((doc) => doc.parsedData)
      .filter(Boolean) as Record<string, unknown>[];

    const mergedResult = mergeAnalysisResults(allParsed);

    // 재병합 결과 업데이트
    await db.studentSpec.update({
      where: { userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        analysisResult: mergedResult as any,
        analysisStatus: "DONE",
        lastAnalyzedAt: new Date(),
      },
    });

    return NextResponse.json({ status: "SUCCESS", result: mergedResult });
  } catch (error) {
    logger.error("Failed to delete document", { error });
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
