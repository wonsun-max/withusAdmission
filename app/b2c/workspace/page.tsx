"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  FlaskConical,
  PenLine,
  ShieldCheck,
  Sparkles,
  Target,
  UserCircle,
  LayoutGrid,
} from "lucide-react";
import { useWorkspaceState } from "@/lib/workspace-state";

const MODULES = [
  {
    href: "/b2c/profile",
    icon: UserCircle,
    color: "#0066cc",
    titleKo: "나의 스펙",
    titleEn: "My Profile",
    descKo: "학업 성적과 교내외 활동 기록을 관리합니다.",
    descEn: "Manage your GPA, scores, and activity records.",
    checkKey: "evaluationData",
  },
  {
    href: "/b2c/ocr",
    icon: FileSearch,
    color: "#5856d6",
    titleKo: "서류 검토",
    titleEn: "OCR Review",
    descKo: "성적표를 업로드하고 AI 추출 데이터를 승인합니다.",
    descEn: "Upload transcripts and approve AI-extracted facts.",
    checkKey: "approved",
  },
  {
    href: "/b2c/universities",
    icon: Target,
    color: "#ff3b30",
    titleKo: "목표 대학",
    titleEn: "Universities",
    descKo: "지망 대학을 선택하고 모집요강을 확인합니다.",
    descEn: "Select target schools and view guidelines.",
    checkKey: "targetGuidelineIds",
  },
  {
    href: "/b2c/evaluation",
    icon: FlaskConical,
    color: "#34c759",
    titleKo: "스펙 분석",
    titleEn: "Evaluation",
    descKo: "AI가 분석한 나의 합격 경쟁력을 확인합니다.",
    descEn: "AI-driven analysis of your admission competitiveness.",
    checkKey: "evaluationData",
  },
  {
    href: "/b2c/story",
    icon: Sparkles,
    color: "#ff9500",
    titleKo: "스토리 설계",
    titleEn: "Story Builder",
    descKo: "자소서의 핵심 테마와 근거를 설계합니다.",
    descEn: "Define core themes and evidence for your essays.",
    checkKey: "storyAnswer",
  },
  {
    href: "/b2c/draft",
    icon: PenLine,
    color: "#af52de",
    titleKo: "자소서 초안",
    titleEn: "Master Draft",
    descKo: "완성된 한/영 마스터 자소서를 확인합니다.",
    descEn: "Review your bilingual master essay drafts.",
    checkKey: "storyAnswer",
  },
];

export default function WorkspaceHubPage() {
  const { state, ready } = useWorkspaceState();
  const locale = state.locale;

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main animate-in">
        <header className="page-header" style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 8, background: "rgba(0,102,204,0.1)", borderRadius: 10 }}>
              <LayoutGrid size={20} color="var(--colors-primary)" />
            </div>
            <div className="eyebrow" style={{ marginBottom: 0 }}>
              {locale === "ko" ? "입시 워크스페이스" : "Admission Workspace"}
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {locale === "ko" ? "미래를 설계하는 공간" : "Design Your Future"}
          </h1>
          <p className="lead" style={{ marginTop: 8 }}>
            {locale === "ko"
              ? "데이터로 증명하고, AI로 완성하는 완벽한 입시 전략 파이프라인입니다."
              : "A sophisticated pipeline for admission success, powered by data and AI."}
          </p>
        </header>

        <div className="grid three">
          {MODULES.map((m, idx) => {
            const Icon = m.icon;
            const isDone = Array.isArray((state as any)[m.checkKey]) 
              ? (state as any)[m.checkKey].length > 0
              : !!(state as any)[m.checkKey];

            return (
              <Link key={m.href} href={m.href} style={{ textDecoration: "none", color: "inherit" }}>
                <article
                  className="panel pad"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    animationDelay: `${idx * 0.05}s`,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${m.color}10`,
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 24,
                    transition: "transform 0.3s ease"
                  }}>
                    <Icon size={24} color={m.color} />
                  </div>

                  <h3 style={{ fontSize: 20, marginBottom: 12, fontWeight: 700 }}>
                    {locale === "ko" ? m.titleKo : m.titleEn}
                  </h3>
                  <p style={{ fontSize: 15, color: "var(--colors-ink-muted-64)", lineHeight: 1.5, marginBottom: 24 }}>
                    {locale === "ko" ? m.descKo : m.descEn}
                  </p>

                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isDone ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--colors-primary)", fontWeight: 600, fontSize: 13 }}>
                          <CheckCircle2 size={14} />
                          {locale === "ko" ? "완료" : "Complete"}
                        </div>
                      ) : (
                        <div style={{ color: "var(--colors-ink-muted-48)", fontWeight: 500, fontSize: 13 }}>
                          {locale === "ko" ? "진행 대기" : "Pending"}
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 99, 
                      background: "var(--colors-surface-pearl)", 
                      display: "grid", 
                      placeItems: "center",
                      transition: "all 0.3s ease"
                    }} className="arrow-container">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>

      <style jsx>{`
        article:hover .arrow-container {
          background: var(--colors-ink);
          color: white;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
