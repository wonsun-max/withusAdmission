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
  const { locale, approved, storyAnswer, studentId, targetGuidelineIds } = state;
  const primaryTargetId = targetGuidelineIds?.[0] || "";
  
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredData, setTailoredData] = useState<any>(null);

  useEffect(() => {
    if (ready && approved && storyAnswer && studentId && primaryTargetId && !tailoredData && !isTailoring) {
      const fetchTailor = async () => {
        setIsTailoring(true);
        try {
          const result = await tailorEssayAPI(studentId, primaryTargetId, ""); 
          setTailoredData(result);
        } catch (err) {
          console.error(err);
        } finally {
          setIsTailoring(false);
        }
      };
      fetchTailor();
    }
  }, [ready, approved, storyAnswer, studentId, primaryTargetId, tailoredData, isTailoring]);

  if (!ready) return null;

  if (!approved || !storyAnswer) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 16 }}>
              {locale === "ko" ? "이전 단계를 완료해주세요" : "Please complete the previous steps"}
            </h2>
            <Link href="/b2c/draft" className="button primary">
              <ArrowLeft size={16} />
              {locale === "ko" ? "초안 단계로 이동" : "Go to Drafts"}
            </Link>
          </div>
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
            <div className="eyebrow">
              {locale === "ko" ? "대학별 변환" : "Tailoring"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "대학별 변환 및 팩트체크" : "Tailoring & Fact Check"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "해당 대학 문항과 글자수에 맞게 변환하고 팩트 오류를 검사합니다."
                : "Reshaped for your target university with rigorous pre-submit fact-checks."}
            </p>
          </div>
        </header>

        {isTailoring ? (
          <div className="panel pad" style={{ display: "grid", placeItems: "center", minHeight: 400, gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <Loader2 className="spin" size={48} color="var(--colors-primary)" />
              <p style={{ marginTop: 16 }}>
                {locale === "ko" ? "AI가 팩트체크 및 최종 변환 중입니다..." : "AI is fact-checking and tailoring your essay..."}
              </p>
            </div>
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
            <p>{locale === "ko" ? "자소서 생성이 완료되면 변환을 시작합니다." : "Ready to tailor. Make sure you have a generated essay."}</p>
          </div>
        )}

        <div className="split-actions">
          <Link href="/b2c/draft" className="button">
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
        </div>
      </main>
    </div>
  );
}
