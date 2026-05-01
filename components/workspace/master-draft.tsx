"use client";

import { Copy } from "lucide-react";
import type { Locale } from "@/lib/admission-types";

type Props = { locale: Locale; masterEssayKo: string; masterEssayEn: string };

const copy = {
  en: {
    title: "Master Essay Drafts",
    subtitle: "Generated only from approved facts + your bounded answer. No invented claims.",
    korean: "한국어 메인",
    english: "English Reference",
    copy: "Copy",
    chars: "chars",
  },
  ko: {
    title: "마스터 자소서 초안",
    subtitle: "승인된 사실과 학생 답변만 사용합니다. 없는 스펙은 만들지 않습니다.",
    korean: "한국어 메인",
    english: "영어 참고본",
    copy: "복사",
    chars: "자",
  },
} as const;

function Draft({ label, content, copyLabel }: { label: string; content: string; copyLabel: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="badge brand">{label}</span>
        <button
          className="button"
          style={{ fontSize: 11, minHeight: 28, padding: "0 10px", gap: 5 }}
          onClick={() => navigator.clipboard.writeText(content)}
        >
          <Copy size={12} />
          {copyLabel}
        </button>
      </div>
      <div className="essay-box">{content}</div>
      <p style={{ fontSize: 11, color: "var(--subtle)", marginTop: 4, textAlign: "right" }}>
        {content.length.toLocaleString()} chars
      </p>
    </div>
  );
}

export function MasterDraft({ locale, masterEssayKo, masterEssayEn }: Props) {
  const t = copy[locale];

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{t.title}</h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
      </div>
      <div className="grid two">
        <Draft label={t.korean} content={masterEssayKo} copyLabel={t.copy} />
        <Draft label={t.english} content={masterEssayEn} copyLabel={t.copy} />
      </div>
    </div>
  );
}
