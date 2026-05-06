import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = user.id;

    const result = await AIService.evaluateProfile(studentId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
