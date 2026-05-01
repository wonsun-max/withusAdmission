"use client";

import { AlertTriangle, CheckCircle2, Lock, Save, Send, ShieldCheck } from "lucide-react";
import type { Locale, TailoredEssay, UniversityGuideline } from "@/lib/admission-types";

type Props = { locale: Locale; guideline: UniversityGuideline; tailoredEssay: TailoredEssay };

const copy = {
  en: {
    title: "University Tailoring & Fact-Check",
    subtitle: "Master essay reshaped to match the university prompt and character limit.",
    korean: "한국어 메인",
    english: "English Reference",
    constraints: "Submission Constraints",
    finalGate: "Final Submission Gate",
    noWarnings: "No unsupported claims detected",
    finalPass: "The final pre-submit fact check has passed.",
    needsReview: "Needs Review",
    saveDraft: "Save Draft",
    submit: "Final Submit",
  },
  ko: {
    title: "대학별 변환 및 팩트체크",
    subtitle: "마스터 자소서를 해당 대학 문항과 글자수 조건에 맞게 재작성합니다.",
    korean: "한국어 메인",
    english: "영어 참고본",
    constraints: "제출 조건",
    finalGate: "최종 제출 게이트",
    noWarnings: "근거 없는 주장 없음",
    finalPass: "최종 팩트체크를 통과했습니다.",
    needsReview: "검토 필요",
    saveDraft: "초안 저장",
    submit: "최종 제출",
  },
} as const;

export function TailoringPanel({ locale, guideline, tailoredEssay }: Props) {
  const t = copy[locale];
  const passed = tailoredEssay.factCheck.status === "passed";
  const canSubmit = tailoredEssay.submissionGate.canSubmit;

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={15} />
            {t.title}
          </h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className={`badge ${passed ? "success" : "danger"}`}>
          <ShieldCheck size={11} />
          {tailoredEssay.factCheck.status}
        </span>
      </div>

      {/* Prompt */}
      <div
        style={{
          background: "var(--surface-strong)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "12px 14px",
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        <span style={{ color: "var(--brand)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>
          {locale === "ko" ? guideline.universityKo : guideline.university} · 2026 문항
        </span>
        {locale === "ko"
          ? guideline.essayPrompts[0].promptKo
          : tailoredEssay.prompt}
      </div>

      {/* Essays */}
      <div className="grid two" style={{ marginBottom: 16 }}>
        <div>
          <span className="badge brand" style={{ marginBottom: 8, display: "inline-flex" }}>{t.korean}</span>
          <div className="essay-box">{tailoredEssay.essayByLanguage.ko}</div>
        </div>
        <div>
          <span className="badge default" style={{ marginBottom: 8, display: "inline-flex" }}>{t.english}</span>
          <div className="essay-box">{tailoredEssay.essayByLanguage.en}</div>
        </div>
      </div>

      {/* Constraints + Fact Check */}
      <div className="panel pad" style={{ background: "var(--surface-strong)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          {t.constraints}
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          {locale === "ko" ? guideline.universityKo : tailoredEssay.university} · {tailoredEssay.limit}
        </p>

        <div className="insight-list">
          {tailoredEssay.factCheck.warnings.length > 0 ? (
            tailoredEssay.factCheck.warnings.map((w) => (
              <div key={w} className="insight danger-bg">
                <AlertTriangle size={15} color="var(--red)" />
                <div>
                  <strong>{t.needsReview}</strong>
                  <p>{w}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="insight success-bg">
              <CheckCircle2 size={15} color="var(--accent)" />
              <div>
                <strong>{t.noWarnings}</strong>
                <p>{t.finalPass}</p>
              </div>
            </div>
          )}

          <div className={`insight ${canSubmit ? "success-bg" : "danger-bg"}`}>
            {canSubmit ? <CheckCircle2 size={15} color="var(--accent)" /> : <Lock size={15} color="var(--red)" />}
            <div>
              <strong>
                {t.finalGate}: {tailoredEssay.submissionGate.label[locale]}
              </strong>
              <p>
                {tailoredEssay.submissionGate.reasons.length
                  ? tailoredEssay.submissionGate.reasons.join(" ")
                  : locale === "ko"
                  ? "최종 팩트체크 통과."
                  : "Final fact check passed."}
              </p>
            </div>
          </div>
        </div>

        <div className="split-actions">
          <button className="button">
            <Save size={14} />
            {t.saveDraft}
          </button>
          <button className="button primary" disabled={!canSubmit}>
            <Send size={14} />
            {t.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
