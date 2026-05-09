"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { UniversitySelector } from "@/components/workspace/university-selector";
import { useWorkspaceState } from "@/lib/workspace-state";
import { Target } from "lucide-react";

export default function UniversitiesPage() {
  const { state, update, ready } = useWorkspaceState();
  const { locale, targetGuidelineId } = state;
  const [guidelines, setGuidelines] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/guidelines")
      .then((res) => res.json())
      .then((data) => setGuidelines(data))
      .catch((err) => console.error("Failed to fetch guidelines", err));
  }, []);

  const guideline = guidelines.find((g) => g.id === targetGuidelineId) || guidelines[0] || {
    id: "",
    university: "Pending Selection",
    universityKo: "선택 대기 중",
    major: "Major",
    track: "SPECIAL_12YR",
    documentRequirements: [],
    source: { status: "needs-official-pdf" }
  };

  if (!ready) return null;

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              <Target size={12} style={{ display: "inline", marginRight: 6 }} />
              {locale === "ko" ? "목표 대학" : "Target Universities"}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 6 }}>
              {locale === "ko" ? "어디로 가고 싶으신가요?" : "Where do you want to go?"}
            </h1>
            <p className="lead" style={{ fontSize: 17 }}>
              {locale === "ko"
                ? "목표 대학을 선택하면 해당 학교의 모집요강과 자소서 문항이 자동으로 연동됩니다."
                : "Select your target schools to automatically sync guidelines and essay prompts."}
            </p>
          </div>
        </header>

        <div className="grid" style={{ maxWidth: 980 }}>
          <UniversitySelector
            locale={locale}
            profile={{ track: state.track }}
            evaluation={{}}
            guideline={guideline}
            targetGuidelineId={targetGuidelineId}
            onSelectGuideline={(id) => update({ targetGuidelineId: id })}
          />
        </div>
      </main>
    </div>
  );
}
