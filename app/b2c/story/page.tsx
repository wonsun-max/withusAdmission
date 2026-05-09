"use client";

import { AppNav } from "@/components/app-nav";
import { StoryBuilder } from "@/components/workspace/story-builder";
import { useWorkspaceState } from "@/lib/workspace-state";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function StoryPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved, selectedThemeId, storyAnswer, evaluationData } = state;

  const themes = evaluationData?.themes || [];

  if (!ready) return null;

  if (!approved) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 16 }}>
              {locale === "ko" ? "서류 검토를 먼저 완료해주세요" : "Please complete document review first"}
            </h2>
            <p style={{ marginBottom: 24 }}>
              {locale === "ko" ? "OCR 검토 및 승인이 필요합니다." : "OCR review and approval are required."}
            </p>
            <Link href="/b2c/ocr" className="button primary">
              <ArrowLeft size={16} />
              {locale === "ko" ? "서류 검토로 이동" : "Go to Document Review"}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isComplete = selectedThemeId && storyAnswer.trim().length > 0;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              {locale === "ko" ? "스토리 빌더" : "Story Builder"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "나만의 스토리 설계" : "Build Your Story"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "스토리 방향을 선택하고 필요한 근거만 질문에 맞게 짧게 작성하세요."
                : "Select a story direction and answer the targeted follow-up question with facts."}
            </p>
          </div>
        </header>

        <StoryBuilder
          locale={locale}
          themes={themes}
          selectedThemeId={selectedThemeId}
          storyAnswer={storyAnswer}
          onSelectTheme={(id) => update({ selectedThemeId: id })}
          onChangeAnswer={(text) => update({ storyAnswer: text })}
        />

        <div className="split-actions" style={{ justifyContent: "space-between" }}>
          <Link href="/b2c/evaluation" className="button">
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          {isComplete ? (
            <Link href="/b2c/draft" className="button primary">
              {locale === "ko" ? "다음: 자소서 초안" : "Next: Master Draft"}
              <ArrowRight size={16} />
            </Link>
          ) : (
            <span className="button" style={{ opacity: 0.4, cursor: "not-allowed" }}>
              {locale === "ko" ? "다음: 자소서 초안" : "Next: Master Draft"}
              <ArrowRight size={16} />
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
