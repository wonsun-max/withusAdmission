import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { ProfileEvaluatorInput } from "@/lib/agents/types";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<ProfileEvaluatorInput>;

  const result = await admissionAgents.profileEvaluator.run(
    {
      studentId: user.id,
      targetMajor: body.targetMajor,
      targetUniversity: body.targetUniversity,
      guidelineId: body.guidelineId
    },
    createAgentContext()
  );

  // Persist the evaluation result to the specific university application slot
  await db.universityApplication.upsert({
    where: {
      studentId_guidelineId: {
        studentId: user.id,
        guidelineId: body.guidelineId || ""
      }
    },
    update: {
      evaluationResult: result.payload as any,
      status: "READY"
    },
    create: {
      studentId: user.id,
      guidelineId: body.guidelineId || "",
      evaluationResult: result.payload as any,
      status: "READY"
    }
  });

  return NextResponse.json(result);
}
