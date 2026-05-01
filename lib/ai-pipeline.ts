import type { StudentProfile, EvaluationResult, StoryTheme, TailoredEssay } from "./admission-types";

/**
 * 프론트엔드에서 API를 호출하여 프로필을 평가합니다.
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
 * 프론트엔드에서 API를 호출하여 마스터 자소서를 생성합니다.
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
 * 프론트엔드에서 API를 호출하여 팩트체크 및 최적화를 진행합니다.
 */
export async function tailorEssayAPI(essayId: string) {
  const res = await fetch("/api/generate/tailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ essayId }),
  });
  if (!res.ok) throw new Error("Tailoring failed");
  return res.json();
}

// 기존 Mock 함수들은 하위 호환성을 위해 유지하거나 점진적으로 교체합니다.
export function evaluateProfile(profile: StudentProfile): EvaluationResult {
  const result: EvaluationResult = {
    mode: "general",
    strengths: ["Strong academic background in STEM", "Leadership in MUN", "Bilingual proficiency"],
    weaknesses: ["Lack of community service variety"],
    criticalWeakness: "Potential lack of deep clinical exposure for medical tracks.",
    overallSummary: "Highly competitive profile for top-tier Engineering programs.",
    themes: [],
  };
  result.themes = buildStoryThemes(profile, result);
  return result;
}

export function buildStoryThemes(profile: StudentProfile, evaluation: EvaluationResult): StoryTheme[] {
  return [
    {
      id: "theme-1",
      title: "The Humanitarian Engineer",
      angle: "How my love for robotics solved a local irrigation problem.",
      evidence: ["MUN Leadership", "Robotics Club Lead"],
      question: "Describe your most impactful project.",
    },
    {
      id: "theme-2",
      title: "Cross-Cultural Catalyst",
      angle: "Bridging East and West through student council initiatives.",
      evidence: ["Student Council", "Bilingual Debate"],
      question: "Tell us about a leadership challenge.",
    },
  ];
}

export function createMasterEssay(profile: StudentProfile, theme: StoryTheme, answer: string): string {
  return `This is a master essay based on the theme: ${theme.title}. The student says: ${answer}. It focus on engineering excellence and cross-cultural adaptability.`;
}

export function createKoreanMasterEssay(profile: StudentProfile, theme: StoryTheme, answer: string): string {
  return `이것은 ${theme.title} 주제를 기반으로 한 마스터 자소서 초안입니다. 학생의 답변: ${answer}. 공학적 수월성과 다문화 적응력을 강조합니다.`;
}

export function mockParseTranscript() {
  return {
    records: [],
    warnings: ["Mock parsing results."]
  };
}

export function tailorEssay(masterEssay: string, profile: StudentProfile, guideline: any): TailoredEssay {
  return {
    university: guideline.university,
    prompt: guideline.requirements?.questions?.[0] || "Default Prompt",
    limit: guideline.requirements?.limits?.[0] || "1000 characters",
    essay: masterEssay,
    essayByLanguage: {
      ko: masterEssay,
      en: masterEssay,
    },
    factCheck: {
      status: "passed",
      warnings: [],
      blockingReasons: [],
    },
    submissionGate: {
      canSubmit: true,
      label: { ko: "제출 가능", en: "Ready to Submit" },
      reasons: [],
    },
  };
}
