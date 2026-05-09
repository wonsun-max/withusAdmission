"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { ProfileEvaluation } from "@/components/workspace/profile-evaluation";
import { useWorkspaceState } from "@/lib/workspace-state";
import { evaluateProfileAPI } from "@/lib/ai-pipeline";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

export default function EvaluationPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved, studentId, evaluationData } = state;
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(evaluationData || null);

  useEffect(() => {
    if (ready && approved && studentId && !evaluation && !isEvaluating) {
      const fetchEval = async () => {
        setIsEvaluating(true);
        try {
          const result = await evaluateProfileAPI(studentId);
          setEvaluation(result);
          update({ evaluationData: result });
        } catch (err) {
          console.error(err);
        } finally {
          setIsEvaluating(false);
        }
      };
      fetchEval();
    }
  }, [ready, approved, studentId, evaluation, isEvaluating, update]);

  if (!ready) return null;

  if (!approved) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 16 }}>
              {locale === "ko" ? "서류 검토를 먼저 완료해주세요" : "Please complete document review first"}
            </h2>
            <p style={{ marginBottom: 24 }}>
              {locale === "ko" ? "OCR 검토 및 승인이 필요합니다." : "OCR review and approval are required."}
            </p>
            <Link href="/b2c/ocr" className="button primary">
              <ArrowLeft size={16} />
              {locale === "ko" ? "서류 검토로 이동" : "Go to Document Review"}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              {locale === "ko" ? "스펙 분석" : "Profile Evaluation"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "AI 스펙 분석" : "AI Profile Evaluation"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "승인된 데이터를 바탕으로 강점과 치명적 약점을 분석합니다."
                : "Analyzes strengths and critical weaknesses based on your approved data."}
            </p>
          </div>
        </header>

        {isEvaluating ? (
          <div className="panel pad" style={{ display: "grid", placeItems: "center", minHeight: 300, gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <Loader2 className="spin" size={48} color="var(--colors-primary)" />
              <p style={{ marginTop: 16 }}>
                {locale === "ko" ? "AI가 스펙을 분석 중입니다..." : "AI is analyzing your profile..."}
              </p>
            </div>
          </div>
        ) : evaluation ? (
          <ProfileEvaluation 
            locale={locale} 
            profile={{ 
              id: studentId || "", 
              name: "Student", 
              track: state.track || "SPECIAL_12YR",
              dateOfBirth: "",
              targetMajor: "",
              countryContext: "",
              parentConsent: { status: "not-required", requiredBecause: { en: "", ko: "" } },
              accountLinks: [],
              gpaData: [],
              standardizedTests: [],
              extracurriculars: [],
              approvedFacts: []
            }} 
            evaluation={evaluation} 
          />
        ) : (
          <div className="panel pad">
            <p>Failed to load evaluation.</p>
          </div>
        )}

        <div className="split-actions" style={{ justifyContent: "space-between" }}>
          <Link href="/b2c/ocr" className="button">
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          <Link href="/b2c/story" className="button primary">
            {locale === "ko" ? "다음: 스토리 빌더" : "Next: Story Builder"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
