"use client";

import { useState } from "react";
import { Languages, Plus, Search } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { MetricsBar } from "./metrics-bar";
import { StudentCrm } from "./student-crm";
import { RiskQueue } from "./risk-queue";
import { BrandedExport } from "./branded-export";

export function DashboardShell() {
  const [locale, setLocale] = useState<"en" | "ko">("ko");

  return (
    <div className="app-shell">
      <AppNav mode="consultant" locale={locale} />
      <main className="main">
        {/* ── Header ── */}
        <header className="page-header">
          <div>
            <div className="eyebrow">B2B {locale === "ko" ? "컨설턴트 대시보드" : "Consultant Dashboard"}</div>
            <h1>
              {locale === "ko"
                ? "학생 진행 상황과 컨설턴트 편집을 관리합니다"
                : "Manage student progress and consultant edits"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "서류 상태, 잔여 크레딧, 팩트 경고, PDF 리포트를 한 곳에서 관리합니다."
                : "Track document status, remaining credits, fact warnings, and export-ready essays."}
            </p>
          </div>
          <div className="toolbar">
            <button className="button" onClick={() => setLocale(locale === "ko" ? "en" : "ko")}>
              <Languages size={15} />
              {locale === "ko" ? "English" : "한국어"}
            </button>
            <button className="button">
              <Search size={15} />
              {locale === "ko" ? "학생 검색" : "Search"}
            </button>
            <button className="button primary">
              <Plus size={15} />
              {locale === "ko" ? "학생 추가" : "Add Student"}
            </button>
          </div>
        </header>

        {/* ── KPI Metrics ── */}
        <MetricsBar locale={locale} />

        {/* ── CRM + Side Panels ── */}
        <div className="grid auto">
          <StudentCrm locale={locale} />
          <div className="grid">
            <RiskQueue locale={locale} />
            <BrandedExport locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
