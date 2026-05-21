/**
 * AI 스펙 분석 결과를 병합하는 서비스.
 *
 * Why: 사용자가 복수의 입시 관련 서류를 업로드할 때 개별 문서 분석 결과를
 * 하나의 일관성 있는 입시 프로파일로 병합하여 저장합니다.
 */
export function mergeAnalysisResults(results: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    persona: {},
    academic: { subjects: [] },
    activities: [],
    awards: [],
    tests: [],
    residency: {},
    personalInfo: {},
  };

  for (const result of results) {
    if (!result) continue;

    // 페르소나 병합
    if (result.persona) {
      merged.persona = { ...(merged.persona as object), ...(result.persona as object) };
    }

    // 학업 성적 및 과목 병합
    if (result.academic) {
      const existing = merged.academic as Record<string, unknown>;
      const incoming = result.academic as Record<string, unknown>;
      
      // 학년 정보나 기타 정보 병합
      const academicDetails = { ...existing, ...incoming };
      
      merged.academic = {
        ...academicDetails,
        subjects: [
          ...((existing.subjects as unknown[]) ?? []),
          ...((incoming.subjects as unknown[]) ?? []),
        ],
      };
    }

    // 비교과 활동 병합
    if (Array.isArray(result.activities)) {
      (merged.activities as unknown[]).push(...result.activities);
    }

    // 수상 기록 병합
    if (Array.isArray(result.awards)) {
      (merged.awards as unknown[]).push(...result.awards);
    }

    // 공인 성적 병합
    if (Array.isArray(result.tests)) {
      (merged.tests as unknown[]).push(...result.tests);
    }

    // 체류 자격 병합
    if (result.residency) {
      merged.residency = { ...(merged.residency as object), ...(result.residency as object) };
    }

    // 인적 사항 병합
    if (result.personalInfo) {
      merged.personalInfo = { ...(merged.personalInfo as object), ...(result.personalInfo as object) };
    }
  }

  return merged;
}
