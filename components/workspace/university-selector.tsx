"use client";

import { useState, useEffect, useMemo } from "react";
import { ExternalLink, Search, CheckCircle2, Circle } from "lucide-react";
import type { Locale, StudentProfile, EvaluationResult, UniversityGuideline } from "@/lib/admission-types";

type Props = {
  locale: Locale;
  profile: StudentProfile;
  evaluation: EvaluationResult;
  targetGuidelineIds: string[];
  onUpdateGuidelines: (ids: string[]) => void;
};

const copy = {
  en: {
    title: "Target Universities",
    subtitle: "Select all universities you are planning to apply to.",
    searchPlaceholder: "Search university or major...",
    selectedCount: "Selected",
    noResults: "No universities found.",
  },
  ko: {
    title: "목표 대학 선택",
    subtitle: "지원하고자 하는 모든 대학과 학과를 다중 선택하세요.",
    searchPlaceholder: "대학명 또는 학과 검색...",
    selectedCount: "선택됨",
    noResults: "검색 결과가 없습니다.",
  },
} as const;

export function UniversitySelector({ locale, profile, targetGuidelineIds = [], onUpdateGuidelines }: Props) {
  const [dbGuidelines, setDbGuidelines] = useState<UniversityGuideline[]>([]);
  const [search, setSearch] = useState("");
  const t = copy[locale];

  useEffect(() => {
    fetch("/api/guidelines")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbGuidelines(data);
      })
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return dbGuidelines.filter(g => 
      g.university.toLowerCase().includes(search.toLowerCase()) ||
      g.major.toLowerCase().includes(search.toLowerCase()) ||
      (g.universityKo && g.universityKo.includes(search))
    );
  }, [dbGuidelines, search]);

  const toggleGuideline = (id: string) => {
    const nextIds = targetGuidelineIds.includes(id)
      ? targetGuidelineIds.filter(i => i !== id)
      : [...targetGuidelineIds, id];
    onUpdateGuidelines(nextIds);
  };

  return (
    <div className="panel pad" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="panel-header">
        <div>
          <h2>{t.title}</h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className="badge brand">
          {targetGuidelineIds.length} {t.selectedCount}
        </span>
      </div>

      <div className="search-box" style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--colors-ink-muted-48)" }} />
        <input
          type="text"
          className="input"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 40, width: "100%" }}
        />
      </div>

      <div className="selection-list" style={{ 
        maxHeight: 400, 
        overflowY: "auto", 
        display: "flex", 
        flexDirection: "column", 
        gap: 8,
        padding: "4px"
      }}>
        {filtered.length > 0 ? filtered.map((g) => {
          const isSelected = targetGuidelineIds.includes(g.id);
          return (
            <div 
              key={g.id}
              onClick={() => toggleGuideline(g.id)}
              className={`selectable-card ${isSelected ? "selected" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                borderRadius: "var(--rounded-md)",
                border: isSelected ? "2px solid var(--colors-primary)" : "1px solid var(--colors-surface-pearl)",
                background: isSelected ? "rgba(0, 102, 204, 0.04)" : "var(--colors-surface-white)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {isSelected ? <CheckCircle2 size={20} color="var(--colors-primary)" /> : <Circle size={20} color="var(--colors-ink-muted-24)" />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{locale === "ko" ? (g.universityKo || g.university) : g.university}</div>
                  <div style={{ fontSize: 13, color: "var(--colors-ink-muted-64)" }}>{g.major} · {g.track}</div>
                </div>
              </div>
              <div className="badge violet" style={{ fontSize: 10 }}>2026</div>
            </div>
          );
        }) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--colors-ink-muted-48)" }}>
            {t.noResults}
          </div>
        )}
      </div>
    </div>
  );
}
