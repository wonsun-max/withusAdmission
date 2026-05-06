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

    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await db.user.findUnique({ where: { id: user.id } });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
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
