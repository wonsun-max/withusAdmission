"use client";

import { useState } from "react";
import { AppNav } from "@/components/app-nav";
import { StudentCrm } from "@/components/dashboard/student-crm";
import { RiskQueue } from "@/components/dashboard/risk-queue";
import { Languages, Search, Users } from "lucide-react";

export default function StudentsCrmPage() {
  const [locale, setLocale] = useState<"en" | "ko">("ko");

  return (
    <div className="app-shell">
      <AppNav mode="consultant" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">{locale === "ko" ? "컨설턴트 도구" : "Consultant Tools"}</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "학생 CRM" : "Student CRM"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "소속 학생들의 서류 진행도와 자소서 작성 단계를 추적합니다."
                : "Track document progress and essay generation stages for all your students."}
            </p>
          </div>
          <div className="toolbar">
            <button className="button" onClick={() => setLocale(locale === "ko" ? "en" : "ko")}>
              <Languages size={15} />
              {locale === "ko" ? "English" : "한국어"}
            </button>
            <button className="button">
              <Search size={15} />
              {locale === "ko" ? "학생 검색" : "Search Students"}
            </button>
          </div>
        </header>

        <div className="grid two">
          <StudentCrm locale={locale} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <RiskQueue locale={locale} />
            <div className="panel pad" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, color: "var(--muted)", textAlign: "center" }}>
              <Users size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>{locale === "ko" ? "추가 컨설팅 기능(직접 첨삭 등)은 다음 업데이트에 제공됩니다." : "Additional consulting features (e.g. direct editing) will be available in the next update."}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
