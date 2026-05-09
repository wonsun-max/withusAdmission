"use client";

import { AppNav } from "@/components/app-nav";
import { useWorkspaceState } from "@/lib/workspace-state";
import { GraduationCap, Trophy, Activity, ClipboardList } from "lucide-react";

export default function ProfilePage() {
  const { state, ready } = useWorkspaceState();
  const { locale, evaluationData } = state;

  if (!ready) return null;

  // Mocking structured data from evaluationData for demonstration
  const gpa = evaluationData?.gpa || "N/A";
  const subjects = evaluationData?.subjects || [];
  const activities = evaluationData?.activities || [];

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              <GraduationCap size={12} style={{ display: "inline", marginRight: 6 }} />
              {locale === "ko" ? "나의 스펙" : "My Profile Spec"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "검증된 나의 학업 기록" : "Verified Academic Facts"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "승인된 서류에서 추출된 데이터입니다. 이 정보들이 자소서의 근거가 됩니다."
                : "Data extracted from approved documents. These facts form the core of your essays."}
            </p>
          </div>
        </header>

        <div className="grid two">
          {/* GPA Section */}
          <section className="panel pad">
            <div className="panel-header">
              <h3>
                <ClipboardList size={18} style={{ display: "inline", marginRight: 8, verticalAlign: "-3px" }} />
                {locale === "ko" ? "학업 성적 (GPA)" : "Academic Performance"}
              </h3>
              <span className="badge brand">GPA {gpa}</span>
            </div>
            <div className="table-wrap" style={{ marginTop: 16 }}>
              <div className="table-row header">
                <div>Subject</div>
                <div>Grade</div>
                <div>Credit</div>
              </div>
              {subjects.length > 0 ? subjects.map((s: any, i: number) => (
                <div key={i} className="table-row">
                  <div style={{ color: "var(--colors-ink)" }}>{s.subject}</div>
                  <div>{s.grade}</div>
                  <div>{s.credit || 1}</div>
                </div>
              )) : (
                <div className="pad" style={{ textAlign: "center", color: "var(--colors-ink-muted-48)" }}>
                  {locale === "ko" ? "데이터가 없습니다." : "No data available."}
                </div>
              )}
            </div>
          </section>

          {/* Activities Section */}
          <section className="panel pad">
            <div className="panel-header">
              <h3>
                <Activity size={18} style={{ display: "inline", marginRight: 8, verticalAlign: "-3px" }} />
                {locale === "ko" ? "교내외 활동" : "Activities"}
              </h3>
            </div>
            <div className="insight-list" style={{ marginTop: 16 }}>
              {activities.length > 0 ? activities.map((a: any, i: number) => (
                <div key={i} className="insight">
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                </div>
              )) : (
                <div className="pad" style={{ textAlign: "center", color: "var(--colors-ink-muted-48)" }}>
                  {locale === "ko" ? "등록된 활동이 없습니다." : "No activities recorded."}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
