import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { TailoringInput } from "@/lib/agents/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<TailoringInput>;
  const result = await admissionAgents.tailoringFactChecker.run(
    {
      studentId: body.studentId ?? "stu-001",
      guidelineId: body.guidelineId,
      masterEssay: body.masterEssay,
      answer: body.answer
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
