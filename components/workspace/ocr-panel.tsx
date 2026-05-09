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
        // Automatically update workspace state with the new data
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
    <div className={`panel pad ${approved ? "accent-glow" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} color="var(--brand)" />
            {t.title}
          </h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className={`badge ${approved ? "success" : "warning"}`}>
          {approved ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
          {approved ? t.approved : t.warning}
        </span>
      </div>

      {persona && (
        <div className="persona-card" style={{ background: "rgba(47, 128, 237, 0.05)", padding: 20, borderRadius: 16, border: "1px solid rgba(47, 128, 237, 0.1)" }}>
          <div className="eyebrow" style={{ color: "var(--brand)", marginBottom: 8 }}>{t.persona}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>"{persona.title}"</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", marginBottom: 16 }}>{persona.summary}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {persona.interests?.map((interest: string, i: number) => (
              <span key={i} className="badge brand" style={{ padding: "4px 10px" }}>#{interest}</span>
            ))}
          </div>
        </div>
      )}

      {academic && (
        <div className="academic-section">
          <div className="section-label" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <GraduationCap size={16} />
            {t.academic}
          </div>
          <div className="insight info-bg" style={{ marginBottom: 16 }}>
             <p style={{ fontSize: 13, lineHeight: 1.5 }}>{academic.trajectory}</p>
          </div>
          <div className="table-wrap">
            <div className="table-row header" style={{ gridTemplateColumns: "1.5fr 0.8fr 2fr" }}>
              <span>{t.subject}</span>
              <span>{t.score}</span>
              <span>{t.significance}</span>
            </div>
            {subjects.map((rec: any, idx: number) => (
              <div key={idx} className="table-row highlight" style={{ gridTemplateColumns: "1.5fr 0.8fr 2fr" }}>
                <span style={{ fontWeight: 600 }}>{rec.name || rec.subject}</span>
                <span>{rec.score}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{rec.significance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activities.length > 0 || awards.length > 0) && (
        <div className="experience-section">
          <div className="section-label" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <ClipboardCheck size={16} />
            {t.experience}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {activities.map((act: any, i: number) => (
              <div key={i} className="panel pad" style={{ padding: 16, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", marginBottom: 4 }}>ACTIVITY</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{act.name}</div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{act.impact}</p>
              </div>
            ))}
            {awards.map((awd: any, i: number) => (
              <div key={i} className="panel pad" style={{ padding: 16, background: "rgba(16, 185, 129, 0.03)", borderColor: "rgba(16, 185, 129, 0.1)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>AWARD</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{awd.name}</div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{awd.significance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <label className="button" style={{ flex: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48 }}>
            <input type="file" hidden onChange={handleFileUpload} disabled={isUploading} />
            {isUploading ? <Loader2 className="spin" size={16} /> : <Upload size={16} />}
            <span style={{ marginLeft: 8 }}>{isUploading ? t.processing : t.upload}</span>
          </label>
          
          {!approved && data && (
            <button className="button primary" style={{ flex: 1.5, minHeight: 48 }} onClick={() => onApprove(ocrResult)}>
              <CheckCircle2 size={16} />
              <span style={{ marginLeft: 8 }}>{t.approve}</span>
            </button>
          )}
        </div>
        
        {data && !approved && (
          <p style={{ fontSize: 12, color: "var(--colors-primary)", textAlign: "center", fontWeight: 500 }}>
            {locale === "ko" 
              ? "✓ 데이터가 서버에 안전하게 저장되었습니다. 검토 후 승인 버튼을 눌러주세요." 
              : "✓ Data safely saved to server. Please review and click Approve."}
          </p>
        )}
      </div>
    </div>
  );
}
