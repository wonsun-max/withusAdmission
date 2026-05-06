"use client";

import { FilePenLine, Users } from "lucide-react";

// TODO: Fetch from /api/b2b/students
const consultantStudents: any[] = [];

type Props = { locale: "en" | "ko" };

const statusColors: Record<string, string> = {
  "Master essay ready": "success",
  "OCR review": "warning",
  "Evaluation complete": "brand",
};

export function StudentCrm({ locale }: Props) {
  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{locale === "ko" ? "학생 CRM" : "Student CRM"}</h2>
          <p className="panel-label">
            {locale === "ko"
              ? "각 학생의 입시 진행 상태와 자소서 단계를 확인합니다."
              : "Track each student's document status and essay production stage."}
          </p>
        </div>
        <span className="badge success">
          <Users size={11} />
          B2B Pro
        </span>
      </div>

      <div className="student-list">
        {consultantStudents.map((student) => {
          const statusBadge = statusColors[student.status] ?? "default";
          return (
            <article className="student-row" key={student.id}>
              <div>
                <h3>{student.name}</h3>
                <p>
                  {student.track} · {student.target}
                </p>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span className={`badge ${statusBadge}`} style={{ fontSize: 10 }}>
                    {student.status}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>
                    {student.progress}%
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                </div>
              </div>
              <button className="button" style={{ fontSize: 12, minHeight: 34 }}>
                <FilePenLine size={13} />
                {locale === "ko" ? "열기" : "Open"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
