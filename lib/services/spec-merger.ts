/**
 * AI 스펙 분석 결과를 병합하는 서비스.
 *
 * Why: 사용자가 복수의 입시 관련 서류를 업로드할 때 개별 문서 분석 결과를
 * 하나의 일관성 있는 입시 프로파일로 병합하여 저장합니다.
 */
export function mergeAnalysisResults(results: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    persona: {},
    academic: { subjects: [], semesters: [] },
    activities: [],
    volunteers: [],
    awards: [],
    tests: [],
    residency: { periods: [] },
    personalInfo: {},
  };

  for (const result of results) {
    if (!result) continue;

    // 1. 페르소나 병합
    if (result.persona) {
      merged.persona = { ...(merged.persona as object), ...(result.persona as object) };
    }

    // 2. 인적 사항 병합 (최신 정보 덮어쓰기 및 빈값 보완)
    if (result.personalInfo) {
      merged.personalInfo = { 
        ...(merged.personalInfo as object), 
        ...(result.personalInfo as object) 
      };
    }

    // 3. 학업 성적 및 학기별 과목 누적 병합
    if (result.academic) {
      const existing = merged.academic as Record<string, unknown>;
      const incoming = result.academic as Record<string, unknown>;
      
      const academicDetails = { ...existing, ...incoming };
      
      // flat subjects 과목 병합 및 중복 방지
      const mergedSubjects = [...((existing.subjects as any[]) ?? [])];
      const newSubjects = (incoming.subjects as any[]) ?? [];
      for (const sub of newSubjects) {
        if (!sub || !sub.name) continue;
        const exists = mergedSubjects.some(
          (s: any) => s.name.toLowerCase() === sub.name.toLowerCase() && s.score === sub.score
        );
        if (!exists) mergedSubjects.push(sub);
      }

      // semesters 그룹화 및 과목 누적 병합
      const mergedSemestersMap: Record<string, { grade: string; semester: string; courses: any[] }> = {};
      
      const existingSemesters = (existing.semesters as any[]) ?? [];
      for (const sem of existingSemesters) {
        if (!sem || !sem.grade || !sem.semester) continue;
        const key = `${sem.grade}-${sem.semester}`.toLowerCase();
        if (!mergedSemestersMap[key]) {
          mergedSemestersMap[key] = { grade: sem.grade, semester: sem.semester, courses: [] };
        }
        mergedSemestersMap[key].courses.push(...(sem.courses ?? []));
      }

      const incomingSemesters = (incoming.semesters as any[]) ?? [];
      for (const sem of incomingSemesters) {
        if (!sem || !sem.grade || !sem.semester) continue;
        const key = `${sem.grade}-${sem.semester}`.toLowerCase();
        if (!mergedSemestersMap[key]) {
          mergedSemestersMap[key] = { grade: sem.grade, semester: sem.semester, courses: [] };
        }
        
        const existingCourses = mergedSemestersMap[key].courses;
        const incomingCourses = sem.courses ?? [];
        for (const newCourse of incomingCourses) {
          if (!newCourse || !newCourse.name) continue;
          const isDuplicate = existingCourses.some(
            (c: any) => c.name.toLowerCase() === newCourse.name.toLowerCase() && c.score === newCourse.score
          );
          if (!isDuplicate) {
            existingCourses.push(newCourse);
          }
        }
      }

      merged.academic = {
        ...academicDetails,
        subjects: mergedSubjects,
        semesters: Object.values(mergedSemestersMap),
      };
    }

    // 4. 비교과 활동 병합 및 중복 방지 (이름 + 역할 기준)
    if (Array.isArray(result.activities)) {
      const existingActivities = merged.activities as any[];
      for (const act of result.activities) {
        if (!act || !act.name) continue;
        const isDuplicate = existingActivities.some(
          (a: any) => a.name.toLowerCase() === act.name.toLowerCase() && a.role === act.role
        );
        if (!isDuplicate) {
          existingActivities.push(act);
        }
      }
    }

    // 5. 봉사 활동 병합 및 중복 방지 (기관 + 시간 기준)
    if (Array.isArray(result.volunteers)) {
      const existingVolunteers = merged.volunteers as any[];
      for (const vol of result.volunteers) {
        if (!vol || !vol.organization) continue;
        const isDuplicate = existingVolunteers.some(
          (v: any) => v.organization.toLowerCase() === vol.organization.toLowerCase() && v.hours === vol.hours
        );
        if (!isDuplicate) {
          existingVolunteers.push(vol);
        }
      }
    }

    // 6. 수상 실적 병합 및 중복 방지 (이름 + 시기 기준)
    if (Array.isArray(result.awards)) {
      const existingAwards = merged.awards as any[];
      for (const aw of result.awards) {
        if (!aw || !aw.name) continue;
        const isDuplicate = existingAwards.some(
          (a: any) => a.name.toLowerCase() === aw.name.toLowerCase() && a.date === aw.date
        );
        if (!isDuplicate) {
          existingAwards.push(aw);
        }
      }
    }

    // 7. 공인 성적 병합 및 중복 방지 (시험명 + 점수 기준)
    if (Array.isArray(result.tests)) {
      const existingTests = merged.tests as any[];
      for (const t of result.tests) {
        if (!t || !t.exam) continue;
        const isDuplicate = existingTests.some(
          (x: any) => x.exam.toLowerCase() === t.exam.toLowerCase() && x.score === t.score
        );
        if (!isDuplicate) {
          existingTests.push(t);
        }
      }
    }

    // 8. 해외 체류 정보 및 출입국 타임라인 병합
    if (result.residency) {
      const existingRes = merged.residency as Record<string, unknown>;
      const incomingRes = result.residency as Record<string, unknown>;
      
      const resDetails = { ...existingRes, ...incomingRes };
      
      // 체류 국가 목록 병합
      const mergedCountries = Array.from(new Set([
        ...((existingRes.countries as string[]) ?? []),
        ...((incomingRes.countries as string[]) ?? [])
      ]));

      // 출입국 세부 기간 병합 및 중복 제거
      const mergedPeriods = [...((existingRes.periods as any[]) ?? [])];
      const incomingPeriods = (incomingRes.periods as any[]) ?? [];
      for (const period of incomingPeriods) {
        if (!period || !period.from || !period.to) continue;
        const exists = mergedPeriods.some(
          (p: any) => p.from === period.from && p.to === period.to && p.country === period.country
        );
        if (!exists) mergedPeriods.push(period);
      }

      merged.residency = {
        ...resDetails,
        countries: mergedCountries,
        periods: mergedPeriods,
      };
    }
  }

  return merged;
}
