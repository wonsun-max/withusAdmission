import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { ProfileEvaluatorInput } from "@/lib/agents/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<ProfileEvaluatorInput>;

  const result = await admissionAgents.profileEvaluator.run(
    {
      studentId: user.id,
      targetMajor: body.targetMajor,
      targetUniversity: body.targetUniversity
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
