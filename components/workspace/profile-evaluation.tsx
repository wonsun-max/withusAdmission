"use client";

import { AlertTriangle, CheckCircle2, FlaskConical } from "lucide-react";
import type { Locale, StudentProfile, EvaluationResult } from "@/lib/admission-types";

type Props = { locale: Locale; profile: StudentProfile; evaluation: EvaluationResult };

const copy = {
  en: {
    title: "Profile Evaluation",
    medical: "Medical Branch Active — Biology/Chemistry & clinical ECs prioritized.",
    general: "General Branch Active — Major fit & global competency analyzed.",
    strength: "Strength",
    weakness: "Critical Weakness",
    track: "Track",
  },
  ko: {
    title: "스펙 평가",
    medical: "의학계열 브랜치 활성화 — 생물/화학 및 의료 봉사 활동 우선 분석.",
    general: "일반 전공 브랜치 활성화 — 전공 적합성 및 글로벌 역량 분석.",
    strength: "강점",
    weakness: "치명적 약점",
    track: "트랙",
  },
} as const;

export function ProfileEvaluation({ locale, profile, evaluation }: Props) {
  const t = copy[locale];
  const isMedical = evaluation.mode === "medical";

  return (
    <div className={`panel pad ${isMedical ? "" : ""}`}>
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FlaskConical size={15} />
            {t.title}
          </h2>
          <p className="panel-label">
            {isMedical ? t.medical : t.general}
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span className="badge default">{profile.track}</span>
          <span className={`badge ${isMedical ? "danger" : "success"}`}>
            {isMedical ? "🏥 Medical" : "📚 General"}
          </span>
        </div>
      </div>

      <div className="insight-list">
        {evaluation.strengths.map((s) => (
          <div className="insight success-bg" key={s}>
            <CheckCircle2 size={16} color="var(--accent)" />
            <div>
              <strong>{t.strength}</strong>
              <p>{s}</p>
            </div>
          </div>
        ))}
        <div className="insight warning-bg">
          <AlertTriangle size={16} color="var(--amber)" />
          <div>
            <strong>{t.weakness}</strong>
            <p>{evaluation.criticalWeakness}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
