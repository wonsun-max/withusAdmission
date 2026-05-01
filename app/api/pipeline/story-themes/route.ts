import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { StoryBuilderInput } from "@/lib/agents/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<StoryBuilderInput>;
  const result = await admissionAgents.storyBuilder.run(
    {
      studentId: body.studentId ?? "stu-001",
      selectedThemeId: body.selectedThemeId,
      answer: body.answer
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
