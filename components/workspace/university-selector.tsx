"use client";

import { useState, useEffect } from "react";
import { ExternalLink, FileSearch } from "lucide-react";
import type { Locale, StudentProfile, EvaluationResult, UniversityGuideline } from "@/lib/admission-types";
import { universityGuidelines } from "@/lib/mock-data";

const sourceLabel: Record<string, { en: string; ko: string }> = {
  "official-imported":   { en: "PDF Registered", ko: "공식 PDF 등록" },
  "official-page-found": { en: "Page Confirmed", ko: "공식 페이지 확인" },
  "needs-official-pdf":  { en: "PDF Needed",     ko: "PDF 확인 필요" },
};

const trackLabel: Record<string, { en: string; ko: string }> = {
  SPECIAL_12YR: { en: "12-Year Track (12특)", ko: "12년 특례 (12특)" },
  SPECIAL_3YR:  { en: "3-Year Track (3특)",   ko: "3년 특례 (3특)" },
};

type Props = {
  locale: Locale;
  profile: StudentProfile;
  evaluation: EvaluationResult;
  guideline: UniversityGuideline;
  targetGuidelineId: string;
  onSelectGuideline: (id: string) => void;
};

const copy = {
  en: {
    title: "Target University & Track",
    subtitle: "Drives track logic, essay prompts, and evaluation mode.",
    uniMajor: "University & Major",
    year: "Application Year",
    source: "Official Source",
  },
  ko: {
    title: "목표 대학 및 트랙",
    subtitle: "선택에 따라 3특/12특, 문항, 평가 모드가 자동으로 바뀝니다.",
    uniMajor: "대학 및 전공",
    year: "지원 연도",
    source: "공식 모집요강 소스",
  },
} as const;

export function UniversitySelector({ locale, profile, evaluation, guideline, targetGuidelineId, onSelectGuideline }: Props) {
  const [dbGuidelines, setDbGuidelines] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/guidelines")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbGuidelines(data);
      })
      .catch(console.error);
  }, []);

  const allGuidelines = dbGuidelines.length > 0 ? dbGuidelines : universityGuidelines;
  const t = copy[locale];
  const src = guideline.source || { status: "needs-official-pdf", notes: "No source data" };
  const srcStatus = (src.status || "needs-official-pdf") as keyof typeof sourceLabel;

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{t.title}</h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className="badge brand">2026</span>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="target-uni">{t.uniMajor}</label>
          <select
            id="target-uni"
            className="select"
            value={targetGuidelineId}
            onChange={(e) => onSelectGuideline(e.target.value)}
          >
            {allGuidelines.map((g) => (
              <option key={g.id} value={g.id}>
                {locale === "ko" ? (g.universityKo || g.university) : g.university} — {g.major} ({g.track || "SPECIAL_12YR"})
              </option>
            ))}
          </select>
        </div>

        <div className="tag-row" style={{ marginTop: 0 }}>
          <span className="badge brand">{trackLabel[profile.track][locale]}</span>
          <span className="badge violet">{guideline.admissionFamily}</span>
          <span className={`badge ${evaluation.mode === "medical" ? "danger" : "success"}`}>
            {evaluation.mode === "medical" ? "🏥 의대 모드" : "📚 일반 모드"}
          </span>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {t.source}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span
              className={`badge ${
                srcStatus === "official-imported" ? "success" :
                srcStatus === "official-page-found" ? "brand" : "warning"
              }`}
            >
              {sourceLabel[srcStatus][locale]}
            </span>
            <a
              className="button"
              href={src.pdfUrl ?? src.sourcePageUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, minHeight: 32 }}
            >
              <ExternalLink size={13} />
              {locale === "ko" ? "소스 열기" : "Open source"}
            </a>
          </div>
          <p style={{ fontSize: 11, color: "var(--subtle)", marginTop: 8, lineHeight: 1.5 }}>{src.notes}</p>
        </div>
      </div>
    </div>
  );
}
