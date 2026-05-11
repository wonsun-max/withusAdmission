import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { StudentService } from "@/lib/services/student-service";

/**
 * GET /api/pipeline/submission-checklist?applicationId=xxx
 * Returns the university-specific checklist mapping for a given application.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const checklist = await StudentService.getSubmissionChecklist(applicationId);

    return NextResponse.json({ success: true, checklist });
  } catch (error: any) {
    console.error("Submission Checklist Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
