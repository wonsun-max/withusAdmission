import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

/**
 * GET/POST /api/essays/get-or-create
 * Retrieves an existing Essay for the student + target guideline,
 * or initializes a new Essay in the database if it does not yet exist.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { guidelineId } = body;

    if (!guidelineId) {
      return NextResponse.json({ error: "Missing guidelineId" }, { status: 400 });
    }

    // 1. Verify that the guideline exists
    const guideline = await db.universityGuideline.findUnique({
      where: { id: guidelineId },
    });

    if (!guideline) {
      return NextResponse.json({ error: "University guideline not found" }, { status: 404 });
    }

    // 2. Fetch or Create the Essay record
    let essay = await db.essay.findFirst({
      where: {
        studentId: user.id,
        guidelineId: guidelineId,
      },
    });

    if (!essay) {
      essay = await db.essay.create({
        data: {
          studentId: user.id,
          guidelineId: guidelineId,
          masterKo: "",
          masterEn: "",
          tailoredResult: "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      essayId: essay.id,
      essay,
    });
  } catch (error: any) {
    console.error("GET-OR-CREATE POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const guidelineId = searchParams.get("guidelineId");

    if (!guidelineId) {
      return NextResponse.json({ error: "Missing guidelineId" }, { status: 400 });
    }

    // 1. Verify guideline
    const guideline = await db.universityGuideline.findUnique({
      where: { id: guidelineId },
    });

    if (!guideline) {
      return NextResponse.json({ error: "University guideline not found" }, { status: 404 });
    }

    // 2. Fetch or Create Essay
    let essay = await db.essay.findFirst({
      where: {
        studentId: user.id,
        guidelineId: guidelineId,
      },
    });

    if (!essay) {
      essay = await db.essay.create({
        data: {
          studentId: user.id,
          guidelineId: guidelineId,
          masterKo: "",
          masterEn: "",
          tailoredResult: "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      essayId: essay.id,
      essay,
    });
  } catch (error: any) {
    console.error("GET-OR-CREATE GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
