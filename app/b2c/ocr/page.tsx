"use client";

import { useMemo } from "react";
import { AppNav } from "@/components/app-nav";
import { OcrPanel } from "@/components/workspace/ocr-panel";
import { UniversitySelector } from "@/components/workspace/university-selector";
import { DocumentChecklist } from "@/components/workspace/document-checklist";
import { AccountLinks } from "@/components/workspace/account-links";
import { useWorkspaceState } from "@/lib/workspace-state";
import { evaluateProfile } from "@/lib/ai-pipeline";
import { sampleProfile, universityGuidelines } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OcrPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved, targetGuidelineId } = state;

  const guideline = useMemo(
    () => universityGuidelines.find((g) => g.id === targetGuidelineId) || universityGuidelines[0] || {
      id: "",
      university: "Pending Selection",
      universityKo: "선택 대기 중",
      major: "Major",
      track: "SPECIAL_12YR",
      documentRequirements: [],
      source: { status: "needs-official-pdf" }
    },
    [targetGuidelineId]
  );
  const profile = useMemo(
    () => ({ ...sampleProfile, targetMajor: guideline?.major || "", track: guideline?.track || "SPECIAL_12YR" }),
    [guideline]
  );
  const evaluation = useMemo(() => evaluateProfile(profile), [profile]);

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">Step 01 / 05</div>
            <h1 style={{ marginTop: 6 }}>
              {locale === "ko" ? "OCR 서류 검토" : "OCR Document Review"}
            </h1>
            <p className="lead">
              {locale === "ko"
                ? "성적표를 업로드하고 AI가 추출한 데이터를 직접 확인 후 승인합니다. 승인 전까지는 다음 단계를 진행할 수 없습니다."
                : "Upload your transcript and approve AI-extracted records. Nothing proceeds until you approve."}
            </p>
          </div>
        </header>

        <div className="grid auto">
          <OcrPanel
            locale={locale}
            profile={profile}
            approved={approved}
            onApprove={(data) => {
              // 실제 API에서 studentId와 함께 리턴된 정보를 저장
              update({ 
                approved: true,
                studentId: data?.studentId || "test-student-id" 
              });
            }}
          />
          <div className="grid">
            <UniversitySelector
              locale={locale}
              profile={profile}
              evaluation={evaluation}
              guideline={guideline}
              targetGuidelineId={targetGuidelineId}
              onSelectGuideline={(id) => update({ targetGuidelineId: id })}
            />
            <DocumentChecklist locale={locale} guideline={guideline} />
            <AccountLinks locale={locale} profile={profile} />
          </div>
        </div>

        {approved && (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <Link href="/b2c/evaluation" className="button primary" style={{ fontSize: 14, padding: "0 24px", minHeight: 44 }}>
              {locale === "ko" ? "다음: 스펙 평가" : "Next: Profile Evaluation"}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
