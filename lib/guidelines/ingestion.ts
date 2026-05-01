import type { DocumentRequirement, GuidelineSource, UniversityGuideline } from "@/lib/admission-types";
import { universityGuidelines } from "@/lib/mock-data";

export type GuidelineIngestionStatus =
  | "queued"
  | "source-confirmed"
  | "pdf-downloaded"
  | "parsed"
  | "human-review"
  | "approved";

export type GuidelineIngestionJob = {
  id: string;
  guidelineId: string;
  university: string;
  universityKo: string;
  source: GuidelineSource;
  status: GuidelineIngestionStatus;
  requiredSections: string[];
  extractedDocumentRequirements: DocumentRequirement[];
  warnings: string[];
};

export const guidelineRequiredSections = [
  "application schedule",
  "eligibility",
  "track rules",
  "required documents",
  "online upload rules",
  "essay prompts",
  "character limits",
  "screening method",
  "disqualification rules"
];

export function createGuidelineIngestionJobs(
  guidelines: UniversityGuideline[] = universityGuidelines
): GuidelineIngestionJob[] {
  return guidelines.map((guideline) => {
    const hasPdf = Boolean(guideline.source.pdfUrl);
    const sourceConfirmed = guideline.source.status !== "needs-official-pdf";

    return {
      id: `ingest-${guideline.id}`,
      guidelineId: guideline.id,
      university: guideline.university,
      universityKo: guideline.universityKo,
      source: guideline.source,
      status: hasPdf ? "pdf-downloaded" : sourceConfirmed ? "source-confirmed" : "queued",
      requiredSections: guidelineRequiredSections,
      extractedDocumentRequirements: guideline.documentRequirements,
      warnings: hasPdf
        ? []
        : ["Direct official PDF URL has not been confirmed yet. Do not mark this guideline as approved."]
    };
  });
}

export function summarizeGuidelineCoverage(jobs: GuidelineIngestionJob[]) {
  const officialPdfCount = jobs.filter((job) => Boolean(job.source.pdfUrl)).length;
  const sourceConfirmedCount = jobs.filter((job) => job.source.status !== "needs-official-pdf").length;

  return {
    total: jobs.length,
    officialPdfCount,
    sourceConfirmedCount,
    needsOfficialPdfCount: jobs.length - sourceConfirmedCount
  };
}
