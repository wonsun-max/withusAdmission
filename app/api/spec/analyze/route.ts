import { NextRequest, NextResponse } from "next/server";
import { DocumentParserService } from "@/lib/services/document-parser";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * POST /api/spec/analyze
 * Accepts multipart/form-data with one or more files.
 * Parses each file, runs AI structured extraction, merges results,
 * and persists to StudentSpec.analysisResult.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "파일을 업로드해주세요." }, { status: 400 });
    }

    // TODO: Replace with real auth. Using a demo userId for now.
    const userId = formData.get("userId") as string ?? "demo-user";

    // Ensure StudentSpec record exists
    await db.studentSpec.upsert({
      where: { userId },
      create: { userId, analysisStatus: "ANALYZING" },
      update: { analysisStatus: "ANALYZING" },
    });

    // Process files concurrently
    const parseResults = await Promise.all(
      files.map(async (file) => {
        try {
          const structured = await DocumentParserService.extractStructuredData(file);

          // Persist individual document record
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

    // Merge multiple document results into one unified spec profile
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
 * Merges analysis results from multiple documents into a single unified profile.
 * Later documents override earlier ones for scalar fields; arrays are concatenated.
 */
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
    if (Array.isArray(result.activities)) {
      (merged.activities as unknown[]).push(...result.activities);
    }
    if (Array.isArray(result.awards)) {
      (merged.awards as unknown[]).push(...result.awards);
    }
    if (Array.isArray(result.tests)) {
      (merged.tests as unknown[]).push(...result.tests);
    }
    if (result.residency) {
      merged.residency = { ...(merged.residency as object), ...(result.residency as object) };
    }
    if (result.personalInfo) {
      merged.personalInfo = { ...(merged.personalInfo as object), ...(result.personalInfo as object) };
    }
  }

  return merged;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? "demo-user";

  try {
    const spec = await db.studentSpec.findUnique({
      where: { userId },
      include: { documents: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json(spec ?? { analysisStatus: "PENDING", analysisResult: null });
  } catch (error) {
    logger.error("Spec GET error", { error });
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
