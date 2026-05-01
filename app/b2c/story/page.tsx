"use client";

import { useMemo } from "react";
import { AppNav } from "@/components/app-nav";
import { StoryBuilder } from "@/components/workspace/story-builder";
import { useWorkspaceState } from "@/lib/workspace-state";
import { buildStoryThemes, evaluateProfile } from "@/lib/ai-pipeline";
import { sampleProfile, universityGuidelines } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function StoryPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved, targetGuidelineId, selectedThemeId, storyAnswer, evaluationData } = state;

  const themes = evaluationData?.themes || [];

  if (!ready) return null;

  if (!approved) {
    return (
      <div className="app-shell">
        <AppNav mode="student" locale={locale} />
        <main className="main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <h2 style={{ marginBottom: 16 }}>{locale === "ko" ? "이전 단계를 완료해주세요" : "Please complete the previous step"}</h2>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>{locale === "ko" ? "OCR 검토 및 승인이 필요합니다." : "OCR review and approval are required."}</p>
          <Link href="/b2c/ocr" className="button primary">
            <ArrowLeft size={16} />
            {locale === "ko" ? "Step 1으로 이동" : "Go to Step 1"}
          </Link>
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
            <div className="eyebrow">Step 03 / 05</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "동적 스토리 빌더" : "Interactive Story Builder"}
            </h1>
            <p className="lead">
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

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          <Link href="/b2c/evaluation" className="button" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
            <ArrowLeft size={16} />
            {locale === "ko" ? "이전" : "Back"}
          </Link>
          <Link 
            href={isComplete ? "/b2c/draft" : "#"} 
            className={`button primary ${!isComplete ? "disabled" : ""}`} 
            style={{ fontSize: 14, padding: "0 24px", minHeight: 44, opacity: isComplete ? 1 : 0.5, pointerEvents: isComplete ? "auto" : "none" }}
          >
            {locale === "ko" ? "다음: 마스터 초안" : "Next: Master Draft"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
