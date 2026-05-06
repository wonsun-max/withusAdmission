import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { StoryBuilderInput } from "@/lib/agents/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<StoryBuilderInput>;
  const result = await admissionAgents.storyBuilder.run(
    {
      studentId: user.id,
      selectedThemeId: body.selectedThemeId,
      answer: body.answer
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
