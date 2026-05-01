import { NextResponse } from "next/server";
import { admissionAgents, createAgentContext } from "@/lib/agents/registry";
import type { OcrParserInput } from "@/lib/agents/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<OcrParserInput>;
  const result = await admissionAgents.ocrParser.run(
    {
      studentId: body.studentId ?? "stu-001",
      documentUrl: body.documentUrl,
      documentType: body.documentType ?? "transcript",
      curriculumHint: body.curriculumHint
    },
    createAgentContext()
  );

  return NextResponse.json(result);
}
