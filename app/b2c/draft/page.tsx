"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { MasterDraft } from "@/components/workspace/master-draft";
import { useWorkspaceState } from "@/lib/workspace-state";
import { createMasterEssayAPI } from "@/lib/ai-pipeline";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

export default function DraftPage() {
  const { state, ready } = useWorkspaceState();
  const { locale, approved, targetGuidelineId, storyAnswer, studentId } = state;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [essays, setEssays] = useState<{ masterKo: string; masterEn: string } | null>(null);

  useEffect(() => {
    if (ready && approved && storyAnswer && targetGuidelineId && !essays && !isGenerating) {
      const fetchDraft = async () => {
        setIsGenerating(true);
        try {
          // 실제로는 studentId가 state에 있어야 함 (없으면 더미 사용)
          const sid = studentId || "test-student-id"; 
          const result = await createMasterEssayAPI(sid, targetGuidelineId, { q1: storyAnswer });
          setEssays({
            masterKo: result.content.masterKo,
            masterEn: result.content.masterEn,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setIsGenerating(false);
        }
      };
      fetchDraft();
    }
  }, [ready, approved, storyAnswer, targetGuidelineId, essays, isGenerating, studentId]);

  if (!ready) return null;

  if (!approved || !storyAnswer) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <h2 style={{ marginBottom: 16 }}>{locale === "ko" ? "이전 단계를 완료해주세요" : "Please complete the previous steps"}</h2>
          <Link href="/b2c/story" className="button primary">
            <ArrowLeft size={16} />
            {locale === "ko" ? "스토리 빌더로 이동" : "Go to Story Builder"}
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
            <div className="eyebrow">Step 04 / 05</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "마스터 자소서 초안" : "Master Essay Drafts"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "승인된 사실과 답변만을 조합해 완성된 한/영 초안입니다."
                : "Your bilingual master drafts generated from facts and your answer."}
            </p>
          </div>
        </header>

        {isGenerating ? (
          <div className="panel pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
            <Loader2 className="spin" size={48} color="var(--brand)" />
            <p className="lead" style={{ textAlign: "center" }}>
              {locale === "ko" ? "AI가 자소서를 집필 중입니다..." : "AI is writing your essays..."}
            </p>
          </div>
        ) : essays ? (
          <MasterDraft locale={locale} masterEssayKo={essays.masterKo} masterEssayEn={essays.masterEn} />
        ) : (
          <div className="panel pad" style={{ textAlign: "center" }}>
            <p>Something went wrong.</p>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          <Link href="/b2c/story" className="button" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          <Link href="/b2c/tailoring" className="button primary" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            {locale === "ko" ? "다음: 대학별 변환" : "Next: Tailoring"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
