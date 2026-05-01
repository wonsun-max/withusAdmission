import { NextResponse } from "next/server";
import { createGuidelineIngestionJobs, summarizeGuidelineCoverage } from "@/lib/guidelines/ingestion";

export async function GET() {
  const jobs = createGuidelineIngestionJobs();

  return NextResponse.json({
    status: "ok",
    coverage: summarizeGuidelineCoverage(jobs),
    jobs
  });
}
