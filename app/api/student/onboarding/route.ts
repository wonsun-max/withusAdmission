import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { Track } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, track } = await req.json();

    if (!fullName || !track) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update user's name
    await db.user.update({
      where: { id: user.id },
      data: { fullName },
    });

    // Update student profile track and change status
    const profile = await db.studentProfile.update({
      where: { userId: user.id },
      data: {
        track: track as Track,
        status: "OCR_REVIEW", // Move to next step
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
