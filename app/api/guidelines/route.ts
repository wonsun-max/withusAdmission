import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const guidelines = await db.universityGuideline.findMany({
      where: { isActive: true }
    });
    return NextResponse.json(guidelines);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
