"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  ClipboardCheck, 
  FileSearch, 
  Upload, 
  Loader2, 
  Sparkles, 
  GraduationCap 
} from "lucide-react";
import type { StudentProfile, Locale } from "@/lib/admission-types";

type Props = {
  locale: Locale;
  profile: StudentProfile;
  approved: boolean;
  initialData?: any;
  onApprove: (data?: any) => void;
};

const copy = {
  en: {
    title: "AI Profile Analysis",
    subtitle: "AI has synthesized your persona and achievements from the documents.",
    docTitle: "Synthesized Student Profile",
    subject: "Subject",
    score: "Score",
    significance: "AI Insight",
    approve: "Approve Profile & Persona",
    approved: "Profile Finalized",
    warning: "Verification Required",
    upload: "Upload New Document",
    processing: "Synthesizing Persona...",
    persona: "Admission Persona",
    academic: "Academic Trajectory",
    experience: "Experience & Achievements",
  },
  ko: {
    title: "AI 프로필 분석 리포트",
    subtitle: "AI가 서류를 바탕으로 학생의 페르소나와 성취도를 종합 분석했습니다.",
    docTitle: "종합 입시 프로필",
    subject: "과목",
    score: "점수",
    significance: "AI 해석",
    approve: "분석 결과 및 페르소나 승인",
    approved: "프로필 확정됨",
    warning: "검토 및 승인 필요",
    upload: "새 서류 업로드",
    processing: "페르소나 분석 중...",
    persona: "입시 페르소나",
    academic: "학업 역량 및 궤적",
    experience: "활동 및 수상 내역",
  },
} as const;

export function OcrPanel({ locale, profile, approved, initialData, onApprove }: Props) {
  const t = copy[locale];
  const [isUploading, setIsUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(initialData ? { ocrData: initialData } : null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setOcrResult(data);
        onApprove({ ...data, preventRedirect: true }); 
      } else {
        alert(data.error || "Analysis Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const data = ocrResult?.ocrData;
  const persona = data?.persona;
  const academic = data?.academic;
  const subjects = academic?.subjects || data?.subjects || profile.gpaData || [];
  const activities = data?.activities || [];
  const awards = data?.awards || [];

  return (
    <div className={`panel pad ${approved ? "accent-glow" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div className="panel-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--colors-surface-pearl)", paddingBottom: 24 }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 800 }}>
            <Sparkles size={22} color="var(--colors-primary)" />
            {t.title}
          </h2>
          <p className="panel-label" style={{ color: "var(--colors-ink-muted-48)", marginTop: 4 }}>{t.subtitle}</p>
        </div>
        <span className={`badge ${approved ? "success" : "warning"}`} style={{ 
          padding: "8px 16px", 
          borderRadius: 99, 
          fontSize: 13, 
          fontWeight: 600,
          background: approved ? "rgba(52, 199, 89, 0.1)" : "rgba(255, 149, 0, 0.1)",
          color: approved ? "#248a3d" : "#c27200",
          display: "flex",
          alignItems: "center",
          gap: 6
        }}>
          {approved ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          {approved ? t.approved : t.warning}
        </span>
      </div>

      {persona && (
        <div className="persona-card" style={{ 
          background: "linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(88, 86, 214, 0.05) 100%)", 
          padding: 32, 
          borderRadius: 24, 
          border: "1px solid rgba(0, 102, 204, 0.1)" 
        }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{t.persona}</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>"{persona.title}"</h3>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--colors-ink-muted-80)", marginBottom: 20 }}>{persona.summary}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {persona.interests?.map((interest: string, i: number) => (
              <span key={i} className="badge brand" style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12 }}>#{interest}</span>
            ))}
          </div>
        </div>
      )}

      {academic && (
        <div className="academic-section">
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: 8, background: "var(--colors-surface-pearl)", borderRadius: 10 }}><GraduationCap size={18} /></div>
            {t.academic}
          </div>
          <div className="insight" style={{ marginBottom: 24, padding: 20, background: "var(--colors-surface-pearl)", borderRadius: 16, borderLeft: "4px solid var(--colors-primary)" }}>
             <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--colors-ink-muted-64)" }}>{academic.trajectory}</p>
          </div>
          <div className="table-wrap" style={{ border: "1px solid var(--colors-surface-pearl)", borderRadius: 16, overflow: "hidden" }}>
            <div className="table-row header" style={{ gridTemplateColumns: "1.5fr 0.8fr 2fr", background: "var(--colors-surface-pearl)", padding: "16px 24px", fontWeight: 700, fontSize: 13 }}>
              <span>{t.subject}</span>
              <span>{t.score}</span>
              <span>{t.significance}</span>
            </div>
            {subjects.map((rec: any, idx: number) => (
              <div key={idx} className="table-row" style={{ gridTemplateColumns: "1.5fr 0.8fr 2fr", padding: "20px 24px", borderBottom: "1px solid var(--colors-surface-pearl)", fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>{rec.name || rec.subject}</span>
                <span style={{ fontWeight: 600, color: "var(--colors-primary)" }}>{rec.score}</span>
                <span style={{ color: "var(--colors-ink-muted-64)", fontSize: 13 }}>{rec.significance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <label className="button outline" style={{ flex: 1, height: 56 }}>
            <input type="file" hidden onChange={handleFileUpload} disabled={isUploading} />
            {isUploading ? <Loader2 className="spin" size={18} /> : <Upload size={18} />}
            <span style={{ marginLeft: 8 }}>{isUploading ? t.processing : t.upload}</span>
          </label>
          
          {!approved && data && (
            <button className="button brand" style={{ flex: 1.5, height: 56 }} onClick={() => onApprove(ocrResult)}>
              <CheckCircle2 size={18} />
              <span style={{ marginLeft: 8 }}>{t.approve}</span>
            </button>
          )}
        </div>
        
        {data && !approved && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "rgba(0, 102, 204, 0.05)", borderRadius: 12 }}>
            <CheckCircle2 size={14} color="var(--colors-primary)" />
            <span style={{ fontSize: 13, color: "var(--colors-primary)", fontWeight: 600 }}>
              {locale === "ko" 
                ? "데이터가 안전하게 저장되었습니다. 검토 후 승인 버튼을 눌러주세요." 
                : "Data safely saved. Please review and click Approve."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
