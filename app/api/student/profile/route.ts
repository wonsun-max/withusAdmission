import { NextRequest, NextResponse } from "next/server";
import { StudentService } from "@/lib/services/student-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "No userId provided" }, { status: 400 });
  }

  try {
    const profile = await StudentService.getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
