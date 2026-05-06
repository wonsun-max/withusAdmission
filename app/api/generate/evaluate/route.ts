import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai-service";

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "No studentId provided" }, { status: 400 });
    }

    const result = await AIService.evaluateProfile(studentId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
