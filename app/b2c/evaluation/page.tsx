"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { ProfileEvaluation } from "@/components/workspace/profile-evaluation";
import { useWorkspaceState } from "@/lib/workspace-state";
import { evaluateProfileAPI } from "@/lib/ai-pipeline";
import { sampleProfile } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

export default function EvaluationPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved, studentId } = state;
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

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
        <main className="main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <h2 style={{ marginBottom: 16 }}>{locale === "ko" ? "이전 단계를 완료해주세요" : "Please complete the previous step"}</h2>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>{locale === "ko" ? "OCR 검토 및 승인이 필요합니다." : "OCR review and approval are required."}</p>
          <Link href="/b2c/ocr" className="button primary">
            <ArrowLeft size={16} />
            {locale === "ko" ? "Step 1으로 이동" : "Go to Step 1"}
          </Link>
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
            <div className="eyebrow">Step 02 / 05</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "스펙 평가" : "Profile Evaluation"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "승인된 데이터를 바탕으로 강점과 치명적 약점을 분석합니다."
                : "Analyzes strengths and critical weaknesses based on your approved data."}
            </p>
          </div>
        </header>

        {isEvaluating ? (
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16 }}>
            <Loader2 className="spin" size={48} color="var(--brand)" />
            <p>{locale === "ko" ? "AI가 스펙을 분석 중입니다..." : "AI is analyzing your profile..."}</p>
          </div>
        ) : evaluation ? (
          <ProfileEvaluation locale={locale} profile={{ ...sampleProfile, track: "SPECIAL_12YR" }} evaluation={evaluation} />
        ) : (
          <div className="panel pad">
            <p>Failed to load evaluation.</p>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          <Link href="/b2c/ocr" className="button" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          <Link href="/b2c/story" className="button primary" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            {locale === "ko" ? "다음: 스토리 빌더" : "Next: Story Builder"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
