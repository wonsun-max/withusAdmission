import { NextRequest, NextResponse } from "next/server";
import { StudentService } from "@/lib/services/student-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    // 1. Mark document as approved
    await StudentService.approveDocument(documentId);

    // 2. Update student status to move to next step
    await StudentService.updateStatus(user.id, "EVALUATION_PENDING");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("OCR Approval Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
