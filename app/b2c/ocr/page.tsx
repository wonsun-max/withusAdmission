"use client";

import { useMemo } from "react";
import { AppNav } from "@/components/app-nav";
import { OcrPanel } from "@/components/workspace/ocr-panel";
import { useWorkspaceState } from "@/lib/workspace-state";
import Link from "next/link";
import { ArrowRight, FileSearch } from "lucide-react";

export default function OcrPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, approved } = state;

  const profile = useMemo(
    () => ({
      id: state.studentId || "pending",
      name: "Student",
      track: state.track || "SPECIAL_12YR",
      gpaData: state.evaluationData?.subjects || [],
      approvedFacts: []
    } as any),
    [state]
  );

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              <FileSearch size={12} style={{ display: "inline", marginRight: 6 }} />
              {locale === "ko" ? "서류 검토" : "Document Review"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "학업 서류 승인" : "Approve Academic Docs"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "성적표를 업로드하고 AI가 추출한 데이터를 승인하세요. 이 데이터가 모든 자소서의 근거가 됩니다."
                : "Upload transcripts and approve AI-extracted data. These facts are the foundation of your essays."}
            </p>
          </div>
        </header>

        <div className="grid" style={{ maxWidth: 980 }}>
          <OcrPanel
            locale={locale}
            profile={profile}
            approved={approved}
            initialData={state.evaluationData}
            onApprove={async (data) => {
              if (!data?.documentId) return;
              
              try {
                const res = await fetch("/api/ocr/approve", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ documentId: data.documentId }),
                });

                if (res.ok) {
                  update({ 
                    approved: true,
                    studentId: data.studentId || state.studentId
                  });
                } else {
                  const err = await res.json();
                  alert(err.error || "Approval failed");
                }
              } catch (err) {
                console.error("Approval error:", err);
                alert("Failed to approve document");
              }
            }}
          />
        </div>

        {approved && (
          <div className="split-actions">
            <Link href="/b2c/profile" className="button primary">
              {locale === "ko" ? "나의 스펙 확인하기" : "View My Profile Spec"}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
