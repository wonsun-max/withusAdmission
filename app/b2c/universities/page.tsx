"use client";

import { useState, useEffect, useMemo } from "react";
import { AppNav } from "@/components/app-nav";
import { UniversitySelector } from "@/components/workspace/university-selector";
import { useWorkspaceState } from "@/lib/workspace-state";
import { Target } from "lucide-react";

export default function UniversitiesPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale } = state;

  const profile = useMemo(
    () => ({
      id: state.studentId || "pending",
      name: "Student",
      track: state.track || "SPECIAL_12YR",
      dateOfBirth: "",
      targetMajor: "",
      countryContext: "",
      parentConsent: { status: "not-required", requiredBecause: { en: "", ko: "" } },
      accountLinks: [],
      gpaData: state.evaluationData?.subjects || [],
      standardizedTests: [],
      extracurriculars: [],
      approvedFacts: []
    } as any),
    [state]
  );

  const evaluation = useMemo(() => ({ 
    mode: "general", 
    strengths: [], 
    weaknesses: [], 
    overallSummary: "",
    themes: []
  } as any), []);

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              <Target size={12} style={{ display: "inline", marginRight: 6 }} />
              {locale === "ko" ? "목표 대학" : "Target Universities"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "어디로 가고 싶으신가요?" : "Where do you want to go?"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "목표 대학을 선택하면 해당 학교의 모집요강과 자소서 문항이 자동으로 연동됩니다."
                : "Select your target schools to automatically sync guidelines and essay prompts."}
            </p>
          </div>
        </header>

        <div className="grid" style={{ maxWidth: 980 }}>
          <UniversitySelector
            locale={locale}
            profile={profile}
            evaluation={evaluation}
            targetGuidelineIds={state.targetGuidelineIds}
            onUpdateGuidelines={(ids) => update({ targetGuidelineIds: ids })}
          />
        </div>
      </main>
    </div>
  );
}
