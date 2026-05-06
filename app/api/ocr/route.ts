import { NextRequest, NextResponse } from "next/server";
import { OCRService } from "@/lib/services/ocr-service";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real production app, we would get the studentId from the auth session.
    // For now, we'll try to find an existing student or create a dummy one for the demo.
    let student = await db.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      student = await db.user.create({
        data: {
          email: "student@withus.example",
          fullName: "Demo Student",
          role: "STUDENT",
          studentProfile: {
            create: {
              track: "SPECIAL_12YR",
              status: "ONBOARDING",
            },
          },
        },
      });
    }

    const result = await OCRService.processUpload(student.id, file);

    return NextResponse.json({
      success: true,
      ...result,
      studentId: student.id,
    });
  } catch (error: any) {
    console.error("OCR Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
