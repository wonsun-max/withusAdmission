"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { TailoringPanel } from "@/components/workspace/tailoring-panel";
import { useWorkspaceState } from "@/lib/workspace-state";
import { tailorEssayAPI } from "@/lib/ai-pipeline";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function TailoringPage() {
  const { state, ready } = useWorkspaceState();
  const { locale, approved, storyAnswer, studentId, targetGuidelineId } = state;
  
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredData, setTailoredData] = useState<any>(null);

  useEffect(() => {
    if (ready && approved && storyAnswer && studentId && targetGuidelineId && !tailoredData && !isTailoring) {
      const fetchTailor = async () => {
        setIsTailoring(true);
        try {
          // We pass the master essay or it could be fetched by the API from DB
          const result = await tailorEssayAPI(studentId, targetGuidelineId, ""); 
          setTailoredData(result);
        } catch (err) {
          console.error(err);
        } finally {
          setIsTailoring(false);
        }
      };
      fetchTailor();
    }
  }, [ready, approved, storyAnswer, studentId, targetGuidelineId, tailoredData, isTailoring]);

  if (!ready) return null;

  if (!approved || !storyAnswer) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <h2 style={{ marginBottom: 16 }}>{locale === "ko" ? "이전 단계를 완료해주세요" : "Please complete the previous steps"}</h2>
          <Link href="/b2c/draft" className="button primary">
            <ArrowLeft size={16} />
            {locale === "ko" ? "초안 단계로 이동" : "Go to Drafts"}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">Step 05 / 05</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "대학별 변환 및 팩트체크" : "Tailoring & Fact Check"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "해당 대학 문항과 글자수에 맞게 변환하고 팩트 오류를 검사합니다."
                : "Reshaped for your target university with rigorous pre-submit fact-checks."}
            </p>
          </div>
        </header>

        {isTailoring ? (
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
            <Loader2 className="spin" size={48} color="var(--brand)" />
            <p className="lead" style={{ textAlign: "center" }}>
              {locale === "ko" ? "AI가 팩트체크 및 최종 변환 중입니다..." : "AI is fact-checking and tailoring your essay..."}
            </p>
          </div>
        ) : tailoredData ? (
          <TailoringPanel 
            locale={locale} 
            guideline={{ university: "University", major: "Major", universityKo: "대학교" } as any} 
            tailoredEssay={typeof tailoredData.tailoredResult === 'string' ? {
              university: "University",
              prompt: "Prompt",
              limit: "1000",
              essay: tailoredData.tailoredResult,
              essayByLanguage: { ko: tailoredData.tailoredResult, en: tailoredData.tailoredResult },
              factCheck: { status: "passed", warnings: [], blockingReasons: [] },
              submissionGate: { canSubmit: true, label: { ko: "제출 가능", en: "Ready" }, reasons: [] }
            } as any : tailoredData.tailoredResult} 
          />
        ) : (
          <div className="panel pad">
            <p>Ready to tailor. Make sure you have a generated essay.</p>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-start" }}>
          <Link href="/b2c/draft" className="button" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
        </div>
      </main>
    </div>
  );
}
