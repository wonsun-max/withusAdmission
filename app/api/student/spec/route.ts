import { NextRequest, NextResponse } from "next/server";
import { StudentService } from "@/lib/services/student-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gpa, academicRecords, activities } = body;

    const profile = await StudentService.updateSpec(user.id, {
      gpa: gpa ? parseFloat(gpa) : undefined,
      academicRecords,
      activities
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Failed to update spec:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
