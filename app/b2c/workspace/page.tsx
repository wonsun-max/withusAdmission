"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  Loader2,
  GraduationCap,
  MessageSquareShare
} from "lucide-react";
import { useWorkspaceState } from "@/lib/workspace-state";
import { getUniversityMeta } from "@/lib/university-meta";

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
  const router = useRouter();
  const { state, ready } = useWorkspaceState();
  const locale = state.locale;

  // Active student profile details including chosen universities
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [launchingChatGid, setLaunchingChatGid] = useState<string | null>(null);

  useEffect(() => {
    async function loadFullProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error("Failed to load dashboard profile", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    if (ready) {
      loadFullProfile();
    }
  }, [ready]);

  const handleLaunchChat = async (guidelineId: string) => {
    setLaunchingChatGid(guidelineId);
    try {
      const res = await fetch(`/api/essays/get-or-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidelineId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/b2c/workspace/essay/${data.essayId}`);
      } else {
        throw new Error("Failed to get or create essay");
      }
    } catch (e) {
      console.error(e);
      alert("AI 워크스페이스 세션 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLaunchingChatGid(null);
    }
  };

  if (!ready) return null;

  const applications = profile?.applications || [];

  return (
    <div className="app-shell bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AppNav mode="student" locale={locale} />
      <main className="main animate-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <header className="page-header mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
              <LayoutGrid size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {locale === "ko" ? "입시 파이프라인 대시보드" : "Admission Workspace Hub"}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-none">
            {locale === "ko" ? "미래를 설계하는 공간" : "Design Your Future"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mt-3 text-base md:text-lg">
            {locale === "ko"
              ? "데이터 기반의 서류 검증부터, 각 대학 인재상 맞춤형 AI 컨설턴트와의 대화를 통한 완벽한 자소서 빌딩 파이프라인입니다."
              : "A sophisticated admission strategy pipeline, matching university guideline requirements with specialized AI agents."}
          </p>
        </header>

        {/* Dynamic Section: Target University Workspaces (Premium Accent Deck) */}
        <section className="mb-14 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="text-indigo-500 w-6 h-6" />
                {locale === "ko" ? "나의 대학별 맞춤 AI 워크스페이스" : "My Custom AI Workspaces"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {locale === "ko" ? "선택하신 대학교의 핵심 인재상(인재상)에 따라 커스텀 훈련된 AI 코치가 배정됩니다." : "Each target school assigns a custom-tuned AI consultant matching their official student persona."}
              </p>
            </div>
            {applications.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-full">
                {applications.length}개교 대기 중
              </span>
            )}
          </div>

          {loadingProfile ? (
            <div className="p-12 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-center max-w-3xl mx-auto transition-all duration-300 hover:border-slate-300">
              <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-1">
                {locale === "ko" ? "설정된 지망 대학교가 없습니다" : "No Target Universities Configured"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                {locale === "ko" ? "성공적인 입시 파이프라인의 가동을 위해 먼저 목표 대학을 1개 이상 추가해 주십시오." : "Add target universities in the Target step to provision dedicated AI workspaces."}
              </p>
              <Link href="/b2c/universities" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm">
                목표 대학 추가하러 가기
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app: any, idx: number) => {
                const schoolMeta = getUniversityMeta(app.guideline.university);
                const isLaunching = launchingChatGid === app.guidelineId;

                return (
                  <article
                    key={app.id}
                    className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md group hover:-translate-y-1 flex flex-col"
                  >
                    {/* Animated background glow sphere matching school brand color on hover */}
                    <div 
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full filter blur-[50px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                      style={{ backgroundColor: schoolMeta.brandColor }}
                    />

                    {/* School Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-2xs border"
                        style={{ 
                          borderColor: `${schoolMeta.brandColor}25`, 
                          backgroundColor: `${schoolMeta.brandColor}10` 
                        }}
                      >
                        {schoolMeta.logoEmoji}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-tight">
                          {schoolMeta.nameKo}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">
                          {app.guideline.major} · {app.guideline.intake === "MARCH" ? "3월 학기" : "9월 학기"}
                        </p>
                      </div>
                    </div>

                    {/* School Persona Details */}
                    <div className="mb-6 flex-1">
                      <div className={`text-[11px] font-extrabold mb-1.5 ${schoolMeta.accentTextClass}`}>
                        {schoolMeta.wantedPersonaKo}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {schoolMeta.wantedPersonaDescKo}
                      </p>
                    </div>

                    {/* School Actions Panel */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <Link
                        href={`/b2c/universities/${app.guidelineId}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl transition-all hover:brightness-110 active:scale-98"
                        style={{ backgroundColor: schoolMeta.brandColor }}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        {locale === "ko" ? "대학 대시보드 열기" : "Open Dashboard"}
                      </Link>
                      <Link
                        href={`/b2c/tailoring?guidelineId=${app.guidelineId}`}
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all active:scale-98 border border-slate-200/50 dark:border-slate-700/40"
                      >
                        {locale === "ko" ? "팩트체크" : "Fact Check"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Global Pipeline Modules */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid size={18} className="text-slate-400" />
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {locale === "ko" ? "공통 입시 검증 파이프라인" : "Global Verification Modules"}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, idx) => {
              const Icon = m.icon;
              const isDone = Array.isArray((state as any)[m.checkKey]) 
                ? (state as any)[m.checkKey].length > 0
                : !!(state as any)[m.checkKey];

              return (
                <Link key={m.href} href={m.href} style={{ textDecoration: "none", color: "inherit" }}>
                  <article
                    className="panel pad hover:shadow-md transition-all duration-300"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      animationDelay: `${idx * 0.05}s`,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "var(--rounded-lg)",
                      border: "1px solid var(--colors-surface-pearl)",
                      background: "var(--colors-surface-white)"
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: `${m.color}10`,
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 20,
                      transition: "transform 0.3s ease"
                    }}>
                      <Icon size={24} color={m.color} />
                    </div>

                    <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 700 }}>
                      {locale === "ko" ? m.titleKo : m.titleEn}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--colors-ink-muted-64)", lineHeight: 1.5, marginBottom: 20 }}>
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
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
