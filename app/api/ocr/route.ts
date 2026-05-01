import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseDocumentWithUpstage } from "@/lib/upstage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Upstage OCR 파싱
    const ocrResult = await parseDocumentWithUpstage(file);

    // 2. 가공 (실제 프로덕션에서는 더 정교한 매핑 필요)
    // Upstage 응답 구조에 따라 데이터를 가공합니다.
    
    // 3. DB 저장 (테스트를 위해 더미 유저 생성 또는 기존 유저 사용)
    // 실제로는 auth session에서 유저 ID를 가져와야 합니다.
    let student = await db.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      student = await db.user.create({
        data: {
          email: "test-student@example.com",
          fullName: "테스트 학생",
          role: "STUDENT",
          studentProfile: {
            create: {
              track: "SPECIAL_12YR",
              status: "OCR_REVIEW",
            },
          },
        },
      });
    }

    const doc = await db.document.create({
      data: {
        studentId: student.id,
        uploaderId: student.id,
        type: "TRANSCRIPT",
        storagePath: `transcripts/${Date.now()}_${file.name}`,
        ocrData: ocrResult,
        isApproved: false,
      },
    });

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      ocrData: ocrResult,
    });
  } catch (error: any) {
    console.error("OCR Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
