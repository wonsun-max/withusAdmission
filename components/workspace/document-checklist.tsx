"use client";

import { CheckCircle2, Clock, FileText, Upload } from "lucide-react";
import type { Locale, UniversityGuideline } from "@/lib/admission-types";

type Props = { locale: Locale; guideline: UniversityGuideline };

const statusConfig = {
  "not-started": { badge: "default", icon: <Clock size={11} />, en: "Not Started", ko: "미제출" },
  uploaded:      { badge: "brand",   icon: <FileText size={11} />, en: "Uploaded", ko: "업로드됨" },
  "ai-review":   { badge: "warning", icon: <Clock size={11} />, en: "AI Review", ko: "AI 검토 중" },
  complete:      { badge: "success", icon: <CheckCircle2 size={11} />, en: "Complete", ko: "완료" },
} as const;

const copy = {
  en: { title: "Required Documents", subtitle: "Upload each document. AI will review after upload.", upload: "Upload" },
  ko: { title: "필수 서류 제출", subtitle: "서류를 업로드하면 AI가 자동으로 검토합니다.", upload: "업로드" },
} as const;

export function DocumentChecklist({ locale, guideline }: Props) {
  const t = copy[locale];

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{t.title}</h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className="badge default">
          {guideline.documentRequirements.filter((d) => d.status === "complete").length}/
          {guideline.documentRequirements.length}
        </span>
      </div>

      <div className="doc-list">
        {guideline.documentRequirements.map((doc) => {
          const cfg = statusConfig[doc.status];
          return (
            <div className="doc-item" key={doc.id}>
              <div>
                <strong>
                  {doc.label[locale]}
                  {doc.required && (
                    <span style={{ color: "var(--red)", marginLeft: 4, fontSize: 10 }}>*</span>
                  )}
                </strong>
                <p>{doc.helpText[locale]}</p>
              </div>
              <div className="doc-actions">
                <span className={`badge ${cfg.badge}`}>
                  {cfg.icon}
                  {cfg[locale]}
                </span>
                <button className="button icon-only" title={`${t.upload}: ${doc.label[locale]}`} style={{ minHeight: 32, width: 32 }}>
                  <Upload size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
