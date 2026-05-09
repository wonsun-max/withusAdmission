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
} from "lucide-react";
import { useWorkspaceState } from "@/lib/workspace-state";

const MODULES = [
  {
    href: "/b2c/profile",
    icon: UserCircle,
    titleKo: "나의 스펙",
    titleEn: "My Profile",
    descKo: "학업 성적과 교내외 활동 기록을 관리합니다.",
    descEn: "Manage your GPA, scores, and activity records.",
    checkKey: "evaluationData",
  },
  {
    href: "/b2c/ocr",
    icon: FileSearch,
    titleKo: "서류 검토",
    titleEn: "OCR Review",
    descKo: "성적표를 업로드하고 AI 추출 데이터를 승인합니다.",
    descEn: "Upload transcripts and approve AI-extracted facts.",
    checkKey: "approved",
  },
  {
    href: "/b2c/universities",
    icon: Target,
    titleKo: "목표 대학",
    titleEn: "Universities",
    descKo: "지망 대학을 선택하고 모집요강을 확인합니다.",
    descEn: "Select target schools and view guidelines.",
    checkKey: "targetGuidelineIds",
  },
  {
    href: "/b2c/evaluation",
    icon: FlaskConical,
    titleKo: "스펙 분석",
    titleEn: "Evaluation",
    descKo: "AI가 분석한 나의 합격 경쟁력을 확인합니다.",
    descEn: "AI-driven analysis of your admission competitiveness.",
    checkKey: "evaluationData",
  },
  {
    href: "/b2c/story",
    icon: Sparkles,
    titleKo: "스토리 설계",
    titleEn: "Story Builder",
    descKo: "자소서의 핵심 테마와 근거를 설계합니다.",
    descEn: "Define core themes and evidence for your essays.",
    checkKey: "storyAnswer",
  },
  {
    href: "/b2c/draft",
    icon: PenLine,
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
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              {locale === "ko" ? "입시 워크스페이스" : "Admission Workspace"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8 }}>
              {locale === "ko" ? "미래를 위한 준비" : "Preparing Your Future"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "모든 데이터는 안전하게 저장됩니다. 각 모듈을 통해 완벽한 입시 서류를 만드세요."
                : "Your data is securely persisted. Build the perfect admission profile across all modules."}
            </p>
          </div>
        </header>

        {/* Module grid — Apple store-utility-card style */}
        <div className="grid three">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isDone = Array.isArray((state as any)[m.checkKey]) 
              ? (state as any)[m.checkKey].length > 0
              : !!(state as any)[m.checkKey];

            return (
              <Link key={m.href} href={m.href} style={{ textDecoration: "none", color: "inherit" }}>
                <article
                  className="store-utility-card"
                  style={{
                    cursor: "pointer",
                    minHeight: 220,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderColor: isDone ? "var(--colors-primary)" : undefined,
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--rounded-md)",
                        background: isDone
                          ? "rgba(0, 102, 204, 0.08)"
                          : "var(--colors-surface-pearl)",
                        display: "grid",
                        placeItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} color="var(--colors-primary)" />
                      ) : (
                        <Icon size={20} color="var(--colors-ink-muted-48)" />
                      )}
                    </div>
                    <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                      {locale === "ko" ? m.titleKo : m.titleEn}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--colors-ink-muted-48)", lineHeight: 1.43 }}>
                      {locale === "ko" ? m.descKo : m.descEn}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      paddingTop: 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDone ? "var(--colors-primary)" : "var(--colors-ink-muted-80)",
                      }}
                    >
                      {isDone 
                        ? (locale === "ko" ? "확인하기" : "Review") 
                        : (locale === "ko" ? "시작하기" : "Get Started")}
                    </span>
                    <ArrowRight size={14} color="var(--colors-ink-muted-48)" />
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
