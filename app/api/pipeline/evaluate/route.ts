import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { ProfileEvaluatorInput } from "@/lib/agents/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<ProfileEvaluatorInput>;

  const result = await admissionAgents.profileEvaluator.run(
    {
      studentId: body.studentId ?? "stu-001",
      targetMajor: body.targetMajor,
      targetUniversity: body.targetUniversity
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
