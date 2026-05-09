import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { StudentService } from "@/lib/services/student-service";

/**
 * PATCH /api/student/update-state
 * Persists any workspace state change to the database.
 */
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedProfile = await StudentService.updateWorkspaceState(user.id, {
      selectedThemeId: body.selectedThemeId,
      storyAnswer: body.storyAnswer,
      targetGuidelineIds: body.targetGuidelineIds,
      evaluationResult: body.evaluationResult,
      track: body.track,
      status: body.status,
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Update Workspace State Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
