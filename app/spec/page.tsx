"use client";

import { useState, useCallback, useRef } from "react";
import type { SpecAnalysisResult, AnalysisStatus } from "@/lib/admission-types";
import SpecProfileCard from "@/components/spec/spec-profile-card";
import styles from "./spec.module.css";

/** 나의 스펙 페이지 — 문서 업로드 → AI 실시간 분석 → 종합 프로파일 */
export default function SpecPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>("PENDING");
  const [result, setResult] = useState<SpecAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const analyze = async () => {
    if (files.length === 0) return;
    setStatus("ANALYZING");
    setError(null);
    setResult(null);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("userId", "demo-user");

    try {
      const res = await fetch("/api/spec/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "분석 실패");
      setStatus("DONE");
      setResult(data.result);
    } catch (err) {
      setStatus("ERROR");
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>My Profile</div>
        <h1 className={styles.title}>나의 스펙</h1>
        <p className={styles.subtitle}>
          성적표, 활동 증명, 여권, 시험 성적 등 모든 서류를 업로드하세요.
          <br />
          AI가 실시간으로 분석해 종합 입시 프로파일을 만들어드립니다.
        </p>
      </header>

      {/* Upload Zone */}
      {status !== "DONE" && (
        <section
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.txt"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
          <div className={styles.dropzoneIcon}>📄</div>
          <div className={styles.dropzoneText}>
            파일을 드래그하거나 클릭해서 업로드
          </div>
          <div className={styles.dropzoneHint}>
            PDF, DOCX, JPG, PNG — 최대 20MB / 파일
          </div>
        </section>
      )}

      {/* File List */}
      {files.length > 0 && status !== "DONE" && (
        <section className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <span className={styles.fileCount}>{files.length}개 파일 선택됨</span>
            <button className={styles.analyzeBtn} onClick={analyze} disabled={status === "ANALYZING"}>
              {status === "ANALYZING" ? (
                <span className={styles.analyzing}>
                  <span className={styles.spinner} />
                  AI 분석 중...
                </span>
              ) : "AI 분석 시작 →"}
            </button>
          </div>
          {files.map((f, i) => (
            <div key={i} className={styles.fileItem}>
              <span className={styles.fileIcon}>{getFileIcon(f.type)}</span>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{f.name}</div>
                <div className={styles.fileSize}>{formatSize(f.size)}</div>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFile(i)}>✕</button>
            </div>
          ))}
        </section>
      )}

      {/* Analyzing State */}
      {status === "ANALYZING" && (
        <div className={styles.analyzingState}>
          <div className={styles.pulseRing} />
          <div className={styles.analyzingText}>
            <div className={styles.analyzingTitle}>AI 분석 진행 중</div>
            <div className={styles.analyzingSteps}>
              {ANALYSIS_STEPS.map((step, i) => (
                <div key={i} className={styles.analyzingStep} style={{ animationDelay: `${i * 0.6}s` }}>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "ERROR" && (
        <div className={styles.errorBox}>
          <span>⚠️</span> {error}
          <button className={styles.retryBtn} onClick={() => setStatus("PENDING")}>다시 시도</button>
        </div>
      )}

      {/* Result Profile */}
      {status === "DONE" && result && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <div className={styles.resultBadge}>✓ 분석 완료</div>
            <button className={styles.reuploadBtn} onClick={() => { setStatus("PENDING"); setFiles([]); setResult(null); }}>
              + 서류 추가 업로드
            </button>
          </div>
          <SpecProfileCard result={result} />
        </div>
      )}
    </div>
  );
}

const ANALYSIS_STEPS = [
  "📄 문서 텍스트 추출 중...",
  "🔍 학업 성적 데이터 파싱...",
  "🏆 비교과 활동 및 수상 분석...",
  "✈️ 체류기간 및 특례 자격 검토...",
  "🧠 종합 입시 프로파일 생성 중...",
];

function getFileIcon(mime: string): string {
  if (mime.includes("pdf")) return "📑";
  if (mime.includes("word") || mime.includes("docx")) return "📝";
  if (mime.startsWith("image/")) return "🖼️";
  return "📄";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
