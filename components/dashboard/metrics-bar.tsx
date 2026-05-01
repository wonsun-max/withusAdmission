"use client";

import { AlertTriangle, BrainCircuit, FileCheck, Users } from "lucide-react";

type Metric = { label: string; labelKo: string; value: string; delta?: string; icon: React.ReactNode; color: string };

const metrics: Metric[] = [
  { label: "Active Students",  labelKo: "활성 학생",   value: "38", delta: "+3 this week", icon: <Users size={18} />,        color: "var(--brand)" },
  { label: "AI Credits Left",  labelKo: "AI 크레딧",   value: "124", delta: "B2B Pro",     icon: <BrainCircuit size={18} />,  color: "var(--violet)" },
  { label: "OCR Approved",     labelKo: "OCR 승인율",  value: "81%", delta: "+2% vs last", icon: <FileCheck size={18} />,     color: "var(--accent)" },
  { label: "Fact Warnings",    labelKo: "팩트 경고",   value: "7",   delta: "Need review",  icon: <AlertTriangle size={18} />, color: "var(--amber)" },
];

type Props = { locale: "en" | "ko" };

export function MetricsBar({ locale }: Props) {
  return (
    <div className="metric-grid">
      {metrics.map((m) => (
        <div className="metric" key={m.label} style={{ borderTopColor: m.color }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span>{locale === "ko" ? m.labelKo : m.label}</span>
            <span style={{ color: m.color, opacity: 0.8 }}>{m.icon}</span>
          </div>
          <strong style={{ color: m.color }}>{m.value}</strong>
          {m.delta && <p className="metric-delta">{m.delta}</p>}
        </div>
      ))}
    </div>
  );
}
