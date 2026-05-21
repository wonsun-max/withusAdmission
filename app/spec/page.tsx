"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SpecAnalysisResult, AnalysisStatus } from "@/lib/admission-types";
import SpecProfileCard from "@/components/spec/spec-profile-card";
import { Sparkles, Trash2, FileText, Upload, Plus } from "lucide-react";
import styles from "./spec.module.css";

interface DBDocument {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

/**
 * 🧬 나의 스펙 (AI 입시 프로파일링 대시보드)
 *
 * Why: 사용자가 복수의 성적표/활동증명 서류를 무제한 업로드할 수 있으며,
 * 업로드된 서류들은 DB에 영구 보존됩니다. 개별 서류 삭제나 추가 업로드 시
 * AI가 모든 문서를 통합 병합하여 최종 입시 프로파일을 실시간 재구성합니다.
 */
export default function SpecPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dbDocuments, setDbDocuments] = useState<DBDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>("PENDING");
  const [result, setResult] = useState<SpecAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const miniInputRef = useRef<HTMLInputElement>(null);

  // 1. 마운트 시 기존에 저장되어 있는 스펙 프로파일 및 문서들 로드
  useEffect(() => {
    async function loadSpec() {
      try {
        const res = await fetch("/api/spec/analyze");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setDbDocuments(data.documents || []);
            if (data.analysisResult) {
              setResult(data.analysisResult);
              setStatus("DONE");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load initial spec data:", err);
      } finally {
        setIsPageLoading(false);
      }
    }
    loadSpec();
  }, []);

  // 2. 신규 파일 선택 핸들러
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

  // 3. AI 통합 분석 실행 (새 파일들을 업로드하여 DB와 병합)
  const analyze = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setStatus("ANALYZING");
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/spec/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "분석 실패");

      setStatus("DONE");
      setResult(data.result);
      setFiles([]); // 선택된 임시 파일 대기열 초기화

      // DB의 최신 파일 목록 동기화
      const specRes = await fetch("/api/spec/analyze");
      if (specRes.ok) {
        const specData = await specRes.json();
        setDbDocuments(specData.documents || []);
      }
    } catch (err) {
      setStatus("ERROR");
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  // 4. 개별 문서 삭제 핸들러 (삭제 후 DB에서 재병합된 프로파일 자동 반영)
  const deleteDocument = async (id: string) => {
    if (deletingId) return;
    if (!confirm("이 서류를 삭제하시겠습니까? 관련 데이터가 입시 분석에서 즉시 제외됩니다.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/spec/document/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "삭제 실패");

      // UI 상태 즉시 업데이트
      setDbDocuments((prev) => prev.filter((doc) => doc.id !== id));
      if (data.result) {
        setResult(data.result);
      } else {
        // 남은 문서가 없으면 초기화
        setResult(null);
        setStatus("PENDING");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "문서 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // 페이지 최초 로딩 중
  if (isPageLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <div className={styles.loadingSpinner} style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>My Profile</div>
        <h1 className={styles.title}>나의 스펙</h1>
        <p className={styles.subtitle}>
          성적표, 활동 증명, 여권, 시험 성적 등 모든 서류를 업로드하세요.
          <br />
          AI가 실시간으로 분석해 종합 입시 프로파일을 만들어드립니다. (언제든지 서류를 추가하거나 삭제할 수 있습니다)
        </p>
      </header>

      {/* ─── 대시보드 미완성 상태 (최초 업로드 대기) ─── */}
      {status !== "DONE" && status !== "ANALYZING" && (
        <>
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
              PDF, DOCX, JPG, PNG — 최대 20MB / 파일 (무제한 다중 파일 추가 지원)
            </div>
          </section>

          {/* 파일 임시 선택 목록 및 분석 시작 버튼 */}
          {files.length > 0 && (
            <section className={styles.fileList}>
              <div className={styles.fileListHeader}>
                <span className={styles.fileCount}>{files.length}개 파일 선택됨</span>
                <button className={styles.analyzeBtn} onClick={() => analyze(files)}>
                  <Sparkles size={16} />
                  AI 분석 시작 →
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
        </>
      )}

      {/* ─── AI 로딩 상태 ─── */}
      {status === "ANALYZING" && (
        <div className={styles.analyzingState}>
          <div className={styles.pulseRing} />
          <div className={styles.analyzingText}>
            <div className={styles.analyzingTitle}>AI 입시 문서 분석 진행 중</div>
            <div className={styles.analyzingSteps}>
              {ANALYSIS_STEPS.map((step, i) => (
                <div key={i} className={styles.analyzingStep} style={{ animationDelay: `${i * 0.7}s` }}>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 에러 메시지 ─── */}
      {status === "ERROR" && (
        <div className={styles.errorBox}>
          <span>⚠️</span> {error}
          <button className={styles.retryBtn} onClick={() => setStatus("PENDING")}>다시 시도</button>
        </div>
      )}

      {/* ─── 완성된 대시보드 레이아웃 (스펙 & 서류 리스트 양방향 바인딩) ─── */}
      {status === "DONE" && result && (
        <div className={styles.dashboardGrid}>
          {/* 왼쪽: 입시 프로파일 요약 카드 */}
          <div className={styles.profileCol}>
            <div className={styles.resultHeader}>
              <div className={styles.resultBadge}>✓ AI 분석 결과 자동 동기화됨</div>
            </div>
            <SpecProfileCard result={result} />
          </div>

          {/* 오른쪽: 제출 서류 관리 & 실시간 추가 업로드 */}
          <div className={styles.filesCol}>
            <div className={styles.documentPanel}>
              <h3 className={styles.panelTitle}>
                <FileText size={18} color="var(--colors-primary)" />
                제출한 입시 서류
              </h3>
              <p className={styles.panelSubtitle}>
                분석에 반영된 원본 파일 목록입니다 ({dbDocuments.length}개)
              </p>

              {/* 저장된 파일 리스트 */}
              <div className={styles.dbFileList}>
                {dbDocuments.map((doc) => (
                  <div key={doc.id} className={styles.dbFileItem}>
                    <span className={styles.dbFileIcon}>{getFileIcon(doc.mimeType)}</span>
                    <div className={styles.dbFileInfo}>
                      <div className={styles.dbFileName} title={doc.fileName}>{doc.fileName}</div>
                      <div className={styles.dbFileSize}>{formatSize(doc.fileSize)}</div>
                    </div>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className={styles.dbDeleteBtn}
                      disabled={deletingId !== null}
                      title="이 문서 삭제"
                    >
                      {deletingId === doc.id ? (
                        <div className={styles.loadingSpinner} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* 미니 Dropzone (자유롭게 추가 업로드) */}
              <div
                className={styles.miniDropzone}
                onClick={() => miniInputRef.current?.click()}
              >
                <input
                  ref={miniInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.txt"
                  className={styles.hiddenInput}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      analyze(Array.from(e.target.files));
                    }
                  }}
                />
                <Upload size={20} color="var(--colors-primary)" style={{ marginBottom: 6 }} />
                <div className={styles.miniDropzoneText}>+ 새로운 입시 서류 추가</div>
                <div className={styles.miniDropzoneHint}>클릭하거나 파일 드래그앤드롭</div>
              </div>
            </div>
          </div>
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
  "🧠 종합 입시 프로파일 누적 병합 중...",
];

function getFileIcon(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes("pdf")) return "📑";
  if (m.includes("word") || m.includes("docx") || m.includes("doc")) return "📝";
  if (m.startsWith("image/")) return "🖼️";
  return "📄";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
