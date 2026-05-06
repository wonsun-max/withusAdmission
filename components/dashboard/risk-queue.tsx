"use client";

import { ShieldAlert } from "lucide-react";

// TODO: Fetch from /api/b2b/students
const consultantStudents: any[] = [];

type Props = { locale: "en" | "ko" };

export function RiskQueue({ locale }: Props) {
  const risks = consultantStudents.filter((s) => s.risk);

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{locale === "ko" ? "위험 큐" : "Risk Queue"}</h2>
          <p className="panel-label">
            {locale === "ko"
              ? "결제 또는 최종 제출 전에 해결해야 할 항목입니다."
              : "Consultants should resolve these before payment or final export."}
          </p>
        </div>
        <span className="badge warning">
          <ShieldAlert size={11} />
          {risks.length} {locale === "ko" ? "건" : "items"}
        </span>
      </div>

      <div className="insight-list">
        {risks.map((s) => (
          <div key={s.id} className="insight warning-bg">
            <ShieldAlert size={15} color="var(--amber)" />
            <div>
              <strong>{s.name}</strong>
              <p>{s.risk}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
