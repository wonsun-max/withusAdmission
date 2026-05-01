"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileSearch, Upload, Loader2 } from "lucide-react";
import type { StudentProfile, Locale } from "@/lib/admission-types";

type Props = {
  locale: Locale;
  profile: StudentProfile;
  approved: boolean;
  onApprove: (data?: any) => void;
};

const copy = {
  en: {
    title: "OCR Document Review",
    subtitle: "AI extracts scores from your transcript. You must approve before anything proceeds.",
    docTitle: "Overseas High School Transcript",
    subject: "Subject",
    score: "Score",
    confidence: "AI Confidence",
    approve: "Approve Extracted Data",
    approved: "Data Approved",
    warning: "Needs Approval",
    upload: "Upload New Document",
    processing: "Processing OCR...",
  },
  ko: {
    title: "OCR 서류 검토",
    subtitle: "AI가 성적표에서 점수를 추출합니다. 승인해야 다음 단계로 진행됩니다.",
    docTitle: "해외 고등학교 성적표",
    subject: "과목",
    score: "점수",
    confidence: "AI 확신도",
    approve: "추출 데이터 승인",
    approved: "데이터 승인됨",
    warning: "승인 필요",
    upload: "새 서류 업로드",
    processing: "OCR 분석 중...",
  },
} as const;

export function OcrPanel({ locale, profile, approved, onApprove }: Props) {
  const t = copy[locale];
  const [isUploading, setIsUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

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
        setOcrResult(data.ocrData);
        // 실제로는 여기서 상위 상태를 업데이트해야 함
      } else {
        alert(data.error || "OCR Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const displayData = ocrResult?.elements?.[0]?.table?.rows || profile.gpaData;

  return (
    <div className={`panel pad ${approved ? "accent-glow" : ""}`}>
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileSearch size={16} />
            {t.title}
          </h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className={`badge ${approved ? "success" : "warning"}`}>
          {approved ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
          {approved ? t.approved : t.warning}
        </span>
      </div>

      <div className="doc-preview">
        <div className="doc-preview-header">
          <div>
            <strong style={{ fontSize: 13 }}>{t.docTitle}</strong>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
              {profile.name} · {profile.track}
            </p>
          </div>
          <span className="badge brand">PDF / IMG</span>
        </div>

        <div className="table-wrap">
          <div className="table-row header">
            <span>{t.subject}</span>
            <span>{t.score}</span>
            <span>{t.confidence}</span>
          </div>
          {displayData.map((rec: any, idx: number) => {
            const subject = rec.subject || rec.cells?.[0]?.content || "Unknown";
            const score = rec.score || rec.cells?.[1]?.content || "-";
            const confidence = rec.confidence ?? (rec.cells?.[1]?.confidence || 0.99);
            
            return (
              <div key={idx} className="table-row highlight">
                <span>{subject}</span>
                <span>{score}</span>
                <span>
                  <span className="badge success" style={{ fontSize: 10 }}>
                    {Math.round(confidence * 100)}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <label className="button" style={{ flex: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <input type="file" hidden onChange={handleFileUpload} disabled={isUploading} />
            {isUploading ? <Loader2 className="spin" size={15} /> : <Upload size={15} />}
            {isUploading ? t.processing : t.upload}
          </label>
          {!approved && (
            <button className="button success" style={{ flex: 1 }} onClick={() => onApprove(ocrResult)}>
              <ClipboardCheck size={15} />
              {t.approve}
            </button>
          )}
          {approved && (
            <div className="insight success-bg" style={{ flex: 1, padding: "10px 14px" }}>
              <CheckCircle2 size={15} color="var(--accent)" />
              <strong style={{ fontSize: 13 }}>{t.approved}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
