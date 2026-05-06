import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { OcrParserInput } from "@/lib/agents/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<OcrParserInput>;
  const result = await admissionAgents.ocrParser.run(
    {
      studentId: user.id,
      documentUrl: body.documentUrl,
      documentType: body.documentType ?? "transcript",
      curriculumHint: body.curriculumHint
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
