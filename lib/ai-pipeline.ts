import type { StudentProfile, EvaluationResult, StoryTheme, TailoredEssay } from "./admission-types";

/**
 * Calls the API to evaluate a student's profile.
 */
export async function evaluateProfileAPI(studentId: string): Promise<EvaluationResult> {
  const res = await fetch("/api/generate/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) throw new Error("Evaluation failed");
  return res.json();
}

/**
 * Calls the API to generate story themes based on the evaluation.
 */
export async function getStoryThemesAPI(studentId: string): Promise<any> {
  const res = await fetch("/api/pipeline/story-themes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) throw new Error("Failed to fetch story themes");
  return res.json();
}

/**
 * Calls the API to generate a master essay draft.
 */
export async function createMasterEssayAPI(
  studentId: string,
  guidelineId: string,
  answers: Record<string, string>
) {
  const res = await fetch("/api/generate/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, guidelineId, answers }),
  });
  if (!res.ok) throw new Error("Draft generation failed");
  return res.json();
}

/**
 * Calls the API to tailor an essay for a specific university and prompt.
 */
export async function tailorEssayAPI(studentId: string, guidelineId: string, masterEssay: string) {
  const res = await fetch("/api/pipeline/tailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, guidelineId, masterEssay }),
  });
  if (!res.ok) throw new Error("Tailoring failed");
  return res.json();
}
