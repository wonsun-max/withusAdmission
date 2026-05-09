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
  const { locale, approved, targetGuidelineIds, storyAnswer, studentId } = state;
  const primaryTargetId = targetGuidelineIds?.[0] || "";
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [essays, setEssays] = useState<{ masterKo: string; masterEn: string } | null>(null);

  useEffect(() => {
    if (ready && approved && storyAnswer && primaryTargetId && !essays && !isGenerating) {
      const fetchDraft = async () => {
        setIsGenerating(true);
        try {
          const sid = studentId || "test-student-id"; 
          const result = await createMasterEssayAPI(sid, primaryTargetId, { q1: storyAnswer });
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
  }, [ready, approved, storyAnswer, primaryTargetId, essays, isGenerating, studentId]);

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
            <Link href="/b2c/story" className="button primary">
              <ArrowLeft size={16} />
              {locale === "ko" ? "스토리 빌더로 이동" : "Go to Story Builder"}
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
              {locale === "ko" ? "자소서 초안" : "Master Draft"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "마스터 자소서 초안" : "Master Essay Drafts"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "승인된 사실과 답변만을 조합해 완성된 한/영 초안입니다."
                : "Your bilingual master drafts generated from facts and your answer."}
            </p>
          </div>
        </header>

        {isGenerating ? (
          <div className="panel pad" style={{ display: "grid", placeItems: "center", minHeight: 400, gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <Loader2 className="spin" size={48} color="var(--colors-primary)" />
              <p style={{ marginTop: 16 }}>
                {locale === "ko" ? "AI가 자소서를 집필 중입니다..." : "AI is writing your essays..."}
              </p>
            </div>
          </div>
        ) : essays ? (
          <MasterDraft locale={locale} masterEssayKo={essays.masterKo} masterEssayEn={essays.masterEn} />
        ) : (
          <div className="panel pad" style={{ textAlign: "center" }}>
            <p>Something went wrong.</p>
          </div>
        )}

        <div className="split-actions" style={{ justifyContent: "space-between" }}>
          <Link href="/b2c/story" className="button">
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          <Link href="/b2c/tailoring" className="button primary">
            {locale === "ko" ? "다음: 대학별 변환" : "Next: Tailoring"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
