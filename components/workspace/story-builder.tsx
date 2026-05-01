"use client";

import { Sparkles } from "lucide-react";
import type { Locale, StoryTheme } from "@/lib/admission-types";

type Props = {
  locale: Locale;
  themes: StoryTheme[];
  selectedThemeId: string;
  storyAnswer: string;
  onSelectTheme: (id: string) => void;
  onChangeAnswer: (v: string) => void;
};

const LABELS = ["A", "B", "C"];

const copy = {
  en: {
    title: "Dynamic Story Builder",
    subtitle: "AI proposes 3 story directions. Pick one, then answer the targeted follow-up question.",
    answerLabel: "Your Evidence (Answer the question above)",
    answerHint: "Be specific and factual. This answer is the ONLY new material the AI may use.",
  },
  ko: {
    title: "동적 스토리 빌더",
    subtitle: "AI가 3가지 스토리 방향을 제안합니다. 하나를 선택 후, 질문에 답해주세요.",
    answerLabel: "나의 근거 (위 질문에 답변하세요)",
    answerHint: "구체적이고 사실에 근거하세요. 이 답변만이 AI가 사용할 수 있는 유일한 새 정보입니다.",
  },
} as const;

export function StoryBuilder({ locale, themes, selectedThemeId, storyAnswer, onSelectTheme, onChangeAnswer }: Props) {
  const t = copy[locale];
  const selected = themes.find((th) => th.id === selectedThemeId) ?? themes[0];

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={15} />
            {t.title}
          </h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
      </div>

      {/* Theme Cards */}
      <div className="grid three">
        {themes.map((theme, i) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-card ${selectedThemeId === theme.id ? "selected" : ""}`}
            onClick={() => onSelectTheme(theme.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="theme-letter">{LABELS[i] ?? String(i + 1)}</span>
              <h3>{theme.title}</h3>
            </div>
            <p>{theme.angle}</p>
            <div className="tag-row" style={{ marginTop: 0 }}>
              {theme.evidence.map((ev) => (
                <span className="tag" key={ev}>{ev}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Follow-up Question + Answer */}
      <div className="grid two section-gap" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="story-q">{t.answerLabel}</label>
          <div
            style={{
              background: "var(--brand-dim)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 13,
              color: "var(--brand)",
              lineHeight: 1.5,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            💬 {selected.question}
          </div>
          <textarea
            id="story-q"
            className="textarea"
            value={storyAnswer}
            onChange={(e) => onChangeAnswer(e.target.value)}
            placeholder={t.answerHint}
            style={{ minHeight: 160 }}
          />
          <p style={{ fontSize: 11, color: "var(--subtle)", marginTop: 4 }}>
            {storyAnswer.length} / 600
          </p>
        </div>

        {/* Evidence tags from selected theme */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Approved facts being used
          </p>
          <div className="insight-list">
            {selected.evidence.map((ev) => (
              <div key={ev} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}>
                <span style={{ color: "var(--accent)", fontSize: 10 }}>✓</span>
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
