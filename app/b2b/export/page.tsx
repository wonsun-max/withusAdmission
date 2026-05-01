"use client";

import { useState } from "react";
import { AppNav } from "@/components/app-nav";
import { BrandedExport } from "@/components/dashboard/branded-export";
import { Languages } from "lucide-react";

export default function ExportPage() {
  const [locale, setLocale] = useState<"en" | "ko">("ko");

  return (
    <div className="app-shell">
      <AppNav mode="consultant" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">{locale === "ko" ? "컨설턴트 도구" : "Consultant Tools"}</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "PDF 리포트 출력" : "PDF Report Export"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "학원 및 기관의 로고를 적용하여 학생별 리포트와 최종 자소서 패키지를 생성합니다."
                : "Generate student reports and final essay packages branded with your academy's logo."}
            </p>
          </div>
          <div className="toolbar">
            <button className="button" onClick={() => setLocale(locale === "ko" ? "en" : "ko")}>
              <Languages size={15} />
              {locale === "ko" ? "English" : "한국어"}
            </button>
          </div>
        </header>

        <div style={{ maxWidth: 640 }}>
          <BrandedExport locale={locale} />
        </div>
      </main>
    </div>
  );
}
