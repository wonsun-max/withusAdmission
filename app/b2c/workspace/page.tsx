"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { ArrowRight, CheckCircle2, FileSearch, FlaskConical, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import { useWorkspaceState } from "@/lib/workspace-state";

const STEPS = [
  {
    step: "01", href: "/b2c/ocr",
    icon: FileSearch, color: "#0066cc",
    titleKo: "OCR 서류 검토", titleEn: "OCR Document Review",
    descKo: "성적표 PDF를 업로드하고 AI가 추출한 데이터를 승인합니다.",
    descEn: "Upload transcript PDFs and approve AI-extracted data.",
    doneKey: "approved" as const,
  },
  {
    step: "02", href: "/b2c/evaluation",
    icon: FlaskConical, color: "#0066cc",
    titleKo: "스펙 평가", titleEn: "Profile Evaluation",
    descKo: "의대/일반 브랜치로 분기해 강점과 약점을 분석합니다.",
    descEn: "Medical/general branch analysis: 2 strengths, 1 critical weakness.",
    doneKey: "approved" as const,
  },
  {
    step: "03", href: "/b2c/story",
    icon: Sparkles, color: "#0066cc",
    titleKo: "스토리 빌더", titleEn: "Story Builder",
    descKo: "A/B/C 스토리 테마 중 하나를 선택하고 근거 질문에 답합니다.",
    descEn: "Pick a story theme and answer the targeted follow-up question.",
    doneKey: "storyAnswer" as const,
  },
  {
    step: "04", href: "/b2c/draft",
    icon: PenLine, color: "#0066cc",
    titleKo: "마스터 자소서", titleEn: "Master Essay Draft",
    descKo: "한/영 마스터 자소서 초안을 확인하고 수정합니다.",
    descEn: "Review and refine your bilingual master essay draft.",
    doneKey: "storyAnswer" as const,
  },
  {
    step: "05", href: "/b2c/tailoring",
    icon: ShieldCheck, color: "#0066cc",
    titleKo: "대학별 변환 + 팩트체크", titleEn: "University Tailoring & Fact-Check",
    descKo: "목표 대학 문항에 맞게 재작성하고 팩트 경고를 해소합니다.",
    descEn: "Reshape for each university's prompt and clear all fact warnings.",
    doneKey: "approved" as const,
  },
];

export default function WorkspaceHubPage() {
  const { state, ready } = useWorkspaceState();
  const locale = state.locale;

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header" style={{ marginBottom: 36 }}>
          <div>
            <div className="eyebrow">{locale === "ko" ? "학생 워크스페이스" : "Student Workspace"}</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "입시 파이프라인 5단계" : "5-Step Admission Pipeline"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "각 단계는 독립된 페이지입니다. 순서대로 진행하면 자동으로 이어집니다."
                : "Each step is a dedicated page. Complete them in order — state is preserved automatically."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`badge ${state.approved ? "success" : "warning"}`}>
              {state.approved
                ? (locale === "ko" ? "OCR 승인됨" : "OCR Approved")
                : (locale === "ko" ? "OCR 미승인" : "OCR Pending")}
            </span>
          </div>
        </header>

        {/* Step grid */}
        <div className="grid" style={{ gap: 12 }}>
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isDone =
              s.doneKey === "approved"
                ? state.approved
                : !!(state as Record<string, unknown>)[s.doneKey];
            const isNext = !isDone && STEPS.slice(0, idx).every((prev) =>
              prev.doneKey === "approved" ? state.approved : !!(state as Record<string, unknown>)[prev.doneKey]
            );
            return (
              <Link
                key={s.href}
                href={s.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr auto",
                    gap: 20, alignItems: "center",
                    border: `1px solid ${isNext ? s.color + "60" : isDone ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
                    borderRadius: 14, padding: "22px 24px",
                    background: isNext ? `${s.color}08` : "var(--surface)",
                    boxShadow: isNext ? `0 0 24px ${s.color}20` : "none",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Left bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                    background: isDone ? "var(--accent)" : isNext ? s.color : "transparent",
                  }} />

                  {/* Icon */}
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: isDone ? "var(--accent-dim)" : `${s.color}18`,
                      border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : s.color + "30"}`,
                      display: "grid", placeItems: "center", flexShrink: 0,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={22} color="var(--accent)" />
                      : <Icon size={22} color={s.color} />}
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.08em", marginBottom: 4 }}>
                      STEP {s.step}
                      {isDone && <span style={{ color: "var(--accent)", marginLeft: 8 }}>✓ {locale === "ko" ? "완료" : "Done"}</span>}
                      {isNext && <span style={{ marginLeft: 8, background: `${s.color}20`, color: s.color, borderRadius: 999, padding: "1px 8px", fontSize: 9 }}>{locale === "ko" ? "다음 단계" : "Next"}</span>}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.01em" }}>
                      {locale === "ko" ? s.titleKo : s.titleEn}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                      {locale === "ko" ? s.descKo : s.descEn}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={18} color={isNext ? s.color : "var(--subtle)"} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
