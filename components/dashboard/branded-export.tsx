"use client";

import { Building2, Download, ImagePlus } from "lucide-react";

type Props = { locale: "en" | "ko" };

const copy = {
  en: {
    title: "Branded PDF Export",
    subtitle: "Generate academy-branded student reports. Logo upload maps to the PDF header.",
    academyLabel: "Academy Display Name",
    logoLabel: "Academy Logo",
    reportLabel: "Report Type",
    generate: "Generate PDF",
    logoHint: "Upload logo (PNG/SVG recommended)",
    reports: [
      { value: "portfolio", label: "Student Portfolio Report" },
      { value: "essay",     label: "Final Essay Package" },
      { value: "risk",      label: "OCR & Fact-Check Audit" },
    ],
  },
  ko: {
    title: "브랜드 PDF 출력",
    subtitle: "학원 로고가 적용된 학생 리포트를 생성합니다.",
    academyLabel: "학원 표시 이름",
    logoLabel: "학원 로고",
    reportLabel: "리포트 유형",
    generate: "PDF 생성",
    logoHint: "로고 업로드 (PNG/SVG 권장)",
    reports: [
      { value: "portfolio", label: "학생 포트폴리오 리포트" },
      { value: "essay",     label: "최종 자소서 패키지" },
      { value: "risk",      label: "OCR 및 팩트체크 감사" },
    ],
  },
} as const;

export function BrandedExport({ locale }: Props) {
  const t = copy[locale];

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Building2 size={15} />
            {t.title}
          </h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="academy-name">{t.academyLabel}</label>
          <input id="academy-name" className="input" defaultValue="WithUs Admission Consulting" />
        </div>

        <div className="field">
          <label>{t.logoLabel}</label>
          <button
            className="button"
            style={{
              width: "100%",
              height: 80,
              border: "1px dashed var(--border)",
              flexDirection: "column",
              gap: 6,
              color: "var(--muted)",
              fontSize: 12,
            }}
          >
            <ImagePlus size={20} />
            {t.logoHint}
          </button>
        </div>

        <div className="field">
          <label htmlFor="report-type">{t.reportLabel}</label>
          <select id="report-type" className="select">
            {t.reports.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <button className="button primary">
          <Download size={15} />
          {t.generate}
        </button>
      </div>
    </div>
  );
}
