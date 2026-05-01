"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileSearch, FlaskConical, Languages, RefreshCw, Save, ShieldCheck, Sparkles } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { OcrPanel } from "./ocr-panel";
import { UniversitySelector } from "./university-selector";
import { DocumentChecklist } from "./document-checklist";
import { AccountLinks } from "./account-links";
import { ProfileEvaluation } from "./profile-evaluation";
import { StoryBuilder } from "./story-builder";
import { MasterDraft } from "./master-draft";
import { TailoringPanel } from "./tailoring-panel";
import {
  buildStoryThemes,
  createKoreanMasterEssay,
  createMasterEssay,
  evaluateProfile,
  tailorEssay,
} from "@/lib/ai-pipeline";
import type { Locale } from "@/lib/admission-types";
import { sampleProfile, universityGuidelines } from "@/lib/mock-data";

type Step = "ocr" | "eval" | "story" | "tailor";

const stepDefs = [
  { id: "ocr" as Step,    icon: FileSearch,    en: "OCR Review",    ko: "OCR 검토" },
  { id: "eval" as Step,   icon: FlaskConical,  en: "Evaluation",    ko: "스펙 평가" },
  { id: "story" as Step,  icon: Sparkles,      en: "Story Builder", ko: "스토리 빌더" },
  { id: "tailor" as Step, icon: ShieldCheck,   en: "Tailoring",     ko: "대학별 변환" },
];

export function WorkspaceShell() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [approved, setApproved] = useState(false);
  const [targetGuidelineId, setTargetGuidelineId] = useState(universityGuidelines[0].id);
  const [selectedThemeId, setSelectedThemeId] = useState("theme-a");
  const [storyAnswer, setStoryAnswer] = useState(
    "During our bioinformatics club project, I noticed that a clean dataset changed the quality of every conclusion. I rebuilt the spreadsheet, checked missing labels, and learned that scientific confidence depends on disciplined preparation before analysis."
  );

  const guideline = useMemo(
    () => universityGuidelines.find((g) => g.id === targetGuidelineId) ?? universityGuidelines[0],
    [targetGuidelineId]
  );
  const profile = useMemo(
    () => ({ ...sampleProfile, targetMajor: guideline.major, track: guideline.track }),
    [guideline]
  );
  const evaluation = useMemo(() => evaluateProfile(profile), [profile]);
  const themes = useMemo(() => buildStoryThemes(profile, evaluation), [profile, evaluation]);
  const masterEssayEn = useMemo(
    () => createMasterEssay(profile, themes.find((t) => t.id === selectedThemeId) ?? themes[0], storyAnswer),
    [profile, selectedThemeId, themes, storyAnswer]
  );
  const masterEssayKo = useMemo(
    () => createKoreanMasterEssay(profile, themes.find((t) => t.id === selectedThemeId) ?? themes[0], storyAnswer),
    [profile, selectedThemeId, themes, storyAnswer]
  );
  const tailored = useMemo(
    () => tailorEssay(masterEssayEn, profile, guideline),
    [masterEssayEn, profile, guideline]
  );

  // Determine active step
  const activeStep: Step = !approved ? "ocr" : selectedThemeId && storyAnswer ? "story" : "eval";

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        {/* ── Header ── */}
        <header className="page-header">
          <div>
            <div className="eyebrow">{locale === "ko" ? "학생 워크스페이스" : "Student Workspace"}</div>
            <h1>
              {locale === "ko"
                ? "한/영 특례 입시 자소서를 사실 기반으로 만듭니다"
                : "Build a bilingual, fact-safe special admission application"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "OCR 승인 → 스펙 평가 → 스토리 빌더 → 대학별 변환. 없는 스펙은 만들지 않습니다."
                : "OCR approval → Profile eval → Story builder → University tailoring. No hallucination."}
            </p>
          </div>
          <div className="toolbar">
            <button
              className="button"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            >
              <Languages size={15} />
              {locale === "ko" ? "English" : "한국어"}
            </button>
            <button className="button">
              <RefreshCw size={15} />
              {locale === "ko" ? "새로고침" : "Refresh"}
            </button>
            <button className="button primary">
              <Save size={15} />
              {locale === "ko" ? "저장" : "Save"}
            </button>
          </div>
        </header>

        {/* ── Step Stepper ── */}
        <nav className="stepper" aria-label="Admission workflow">
          {stepDefs.map((s) => {
            const Icon = s.icon;
            const isDone =
              (s.id === "ocr" && approved) ||
              (s.id === "eval" && approved) ||
              (s.id === "story" && approved && !!storyAnswer) ||
              (s.id === "tailor" && tailored.factCheck.status === "passed");
            const isActive = s.id === activeStep;
            return (
              <div key={s.id} className={`step ${isDone ? "done" : isActive ? "active" : ""}`}>
                <div className="step-icon">
                  {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <div>
                  <strong>{locale === "ko" ? s.ko : s.en}</strong>
                  <span>
                    {s.id === "ocr" && (approved ? (locale === "ko" ? "승인됨" : "Approved") : (locale === "ko" ? "확인 필요" : "Needs approval"))}
                    {s.id === "eval" && evaluation.mode}
                    {s.id === "story" && (themes.find((t) => t.id === selectedThemeId)?.title ?? "")}
                    {s.id === "tailor" && tailored.factCheck.status}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Step 1: OCR + Sidebar Panels ── */}
        <div className="grid auto">
          <OcrPanel locale={locale} profile={profile} approved={approved} onApprove={() => setApproved(true)} />

          <div className="grid">
            <UniversitySelector
              locale={locale}
              profile={profile}
              evaluation={evaluation}
              guideline={guideline}
              targetGuidelineId={targetGuidelineId}
              onSelectGuideline={setTargetGuidelineId}
            />
            <DocumentChecklist locale={locale} guideline={guideline} />
            <AccountLinks locale={locale} profile={profile} />
          </div>
        </div>

        {/* ── Step 2: Profile Evaluation ── */}
        <div className="section-gap">
          <ProfileEvaluation locale={locale} profile={profile} evaluation={evaluation} />
        </div>

        {/* ── Step 3: Story Builder ── */}
        <div className="section-gap">
          <StoryBuilder
            locale={locale}
            themes={themes}
            selectedThemeId={selectedThemeId}
            storyAnswer={storyAnswer}
            onSelectTheme={setSelectedThemeId}
            onChangeAnswer={setStoryAnswer}
          />
        </div>

        {/* ── Master Draft ── */}
        <div className="section-gap">
          <MasterDraft locale={locale} masterEssayKo={masterEssayKo} masterEssayEn={masterEssayEn} />
        </div>

        {/* ── Step 4: Tailoring + Fact Check ── */}
        <div className="section-gap">
          <TailoringPanel locale={locale} guideline={guideline} tailoredEssay={tailored} />
        </div>
      </main>
    </div>
  );
}
