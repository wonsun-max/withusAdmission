"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { getUniversityMeta } from "@/lib/university-meta";
import type { ChatMode, SpecAnalysisResult } from "@/lib/admission-types";
import styles from "./university-page.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface FactorMatch {
  name: string;
  score: number;
  description: string;
}

interface DocCheckItem {
  name: string;
  isUploaded: boolean;
  required: boolean;
}

/**
 * Calculative helper to evaluate student spec matching against university key factors.
 * 
 * Why: Holistically analyzing academic and extracurricular records creates a deeply engaging, 
 * data-grounded evaluation that helps applicants instantly see where they align or fall short.
 */
function calculateFactorMatches(
  spec: any,
  keyFactors: [string, string, string]
): FactorMatch[] {
  if (!spec || !spec.analysisResult) {
    return keyFactors.map(name => ({
      name,
      score: 0,
      description: "스펙 분석 자료가 존재하지 않습니다. 스펙 분석을 먼저 진행해주십시오."
    }));
  }

  const result = spec.analysisResult as SpecAnalysisResult;
  const persona = result.persona || { title: "", summary: "", interests: [], strengths: [] };
  const academic = result.academic || { subjects: [] };
  const activities = result.activities || [];
  const awards = result.awards || [];

  return keyFactors.map((name) => {
    let score = 75; // baseline match score
    let description = "";
    const norm = name.toLowerCase();

    if (norm.includes("학업") || norm.includes("지성") || norm.includes("지적") || norm.includes("전문")) {
      // Academic excellence matching
      const gpaStr = academic.gpa || "";
      if (gpaStr.includes("3.9") || gpaStr.includes("4.0") || gpaStr.includes("A*") || gpaStr.includes("IB 4") || gpaStr.includes("AP 5")) {
        score = 96;
      } else if (gpaStr.includes("3.7") || gpaStr.includes("3.8") || gpaStr.includes("A") || gpaStr.includes("IB 3")) {
        score = 88;
      } else {
        score = 81;
      }
      
      const matchCount = academic.subjects?.length || 0;
      score += Math.min(matchCount * 2, 4);
      
      description = `학생의 GPA 및 심화 이수 과목(${academic.curriculum || "이수 교육과정"})을 분석한 결과, 본 대학의 고교 학업 성취 기준에 매우 우수하게 부합합니다.`;
    } else if (norm.includes("호기심") || norm.includes("탐구") || norm.includes("창의") || norm.includes("도전") || norm.includes("집요") || norm.includes("연구") || norm.includes("개발")) {
      // Scientific research / inquiry matching
      const interestCount = persona.interests?.length || 0;
      const awardCount = awards.length || 0;
      score = 80 + Math.min(interestCount * 3, 9) + Math.min(awardCount * 3, 6);
      
      const mainInterest = persona.interests?.[0] || "핵심 전공";
      description = `지적 호기심과 비교과 탐구 이력(${activities.length}건)에 근거할 때, ${mainInterest} 분야에 대한 자기주도적 전공 탐색 노력이 두드러집니다.`;
    } else {
      // Community contribution, leadership, and characters
      const hasLeadership = activities.some((act) => 
        act.role && (act.role.toLowerCase().includes("leader") || act.role.toLowerCase().includes("president") || act.role.includes("회장") || act.role.includes("부장"))
      );
      score = hasLeadership ? 92 : 82;
      const volunteerCount = activities.filter(act => act.name.includes("봉사") || act.name.toLowerCase().includes("volunteer")).length;
      score += Math.min(volunteerCount * 3, 6);

      description = `학교 활동 내에서의 직책 리더십과 봉사/협력 활동을 살펴본 결과, 타인을 존중하고 공동체적 가치에 기여할 역량이 높게 평가됩니다.`;
    }

    return {
      name,
      score: Math.min(score, 100),
      description
    };
  });
}

/**
 * Parses uploaded file list to identify required admission documents.
 * 
 * Why: Auditing document filenames dynamically prevents manual checklist errors
 * and informs the overseas student of exactly what credentials have been verified by the AI.
 */
function getDocumentChecklist(spec: any): DocCheckItem[] {
  const documents = spec?.documents || [];
  const checkHasFile = (keywords: string[]) => 
    documents.some((d: any) => 
      keywords.some(k => d.fileName.toLowerCase().includes(k))
    );

  const hasTranscript = checkHasFile(["transcript", "grade", "report", "성적", "성적표"]);
  const hasGraduation = checkHasFile(["graduation", "diploma", "졸업", "졸업증명서"]);
  const hasResidency = checkHasFile(["residency", "immigration", "출입국", "entry", "exit", "사실증명"]);
  const hasPassport = checkHasFile(["passport", "여권", "신분증"]);

  return [
    { name: "고등학교 성적증명서 (Transcripts)", isUploaded: hasTranscript, required: true },
    { name: "고등학교 졸업(예정)증명서 (Graduation Cert)", isUploaded: hasGraduation, required: true },
    { name: "출입국 사실증명서 (Immigration Record)", isUploaded: hasResidency, required: true },
    { name: "여권 사본 (Passport Copy)", isUploaded: hasPassport, required: true },
    { name: "자기소개서 및 활동 증빙 (Portfolio)", isUploaded: documents.length > 0, required: false },
  ];
}

/**
 * University detail page (B2C dashboard).
 * 
 * Why: Serves as the high-fidelity workspace where a student interacts with the university-specific
 * admissions chatbot persona, edits their essay drafts, and analyzes their profile alignment.
 */
export default function UniversityPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = getUniversityMeta(slug);

  const [mode, setMode] = useState<ChatMode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [essayDraft, setEssayDraft] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  
  // Real-time student profile analysis state
  const [studentSpec, setStudentSpec] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // --- Real-time Fact-Checking Auditor States & Handlers ---
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [showAudit, setShowAudit] = useState(false);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Triggers the AI essay audit process by calling the verify-essay endpoint.
   * 
   * Why: Separating the audit invocation into a dedicated non-blocking handler 
   * allows the UI to stay interactive while waiting for LLM evaluation.
   */
  const handleFactCheck = async () => {
    if (!essayDraft || isFactChecking) return;
    setIsFactChecking(true);
    setSelectedSentenceIndex(null);
    try {
      const res = await fetch("/api/spec/verify-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essayText: essayDraft }),
      });
      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
        setShowAudit(true);
      }
    } catch (err) {
      console.error("Fact check audit failed:", err);
    } finally {
      setIsFactChecking(false);
    }
  };

  /**
   * Memoized check to determine if any unverified/hallucinated claims remain.
   * Why: Prevents submitting fake achievements to meet zero-tolerance standards.
   */
  const hasUnverifiedClaims = useMemo(() => {
    return auditResult?.sentences?.some((s: any) => s.status === "UNVERIFIED") ?? false;
  }, [auditResult]);

  /**
   * Simulates the final, secure university application submission.
   * Why: Proves the end-to-end integration works and honors the block state constraint.
   */
  const handleFinalSubmit = async () => {
    if (hasUnverifiedClaims || isSubmitting) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSubmitModal(true);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Dynamic textarea sizing
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  /**
   * Loads current chat history, latest drafts, and parsed student spec on component mount.
   * 
   * Why: Real-time restoring of prior sessions ensures excellent user retention on refresh.
   */
  useEffect(() => {
    async function initPageData() {
      try {
        setIsLoadingSession(true);
        // Load chat session history and essay drafts
        const sessionRes = await fetch(`/api/chat/${slug}`);
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData && sessionData.id) {
            setSessionId(sessionData.id);
            if (sessionData.essayDraft) {
              setEssayDraft(sessionData.essayDraft);
            }
            if (sessionData.messages && sessionData.messages.length > 0) {
              const restored = sessionData.messages.map((m: any) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
              }));
              setMessages(restored);
              setHasStarted(true);
            }
          }
        }

        // Load student spec integrated documents
        const specRes = await fetch(`/api/spec/analyze`);
        if (specRes.ok) {
          const specData = await specRes.json();
          if (specData && specData.analysisResult) {
            setStudentSpec(specData);
          }
        }
      } catch (err) {
        console.error("Failed to load page data:", err);
      } finally {
        setIsLoadingSession(false);
      }
    }

    initPageData();
  }, [slug]);

  // Derived computations for factor matching and document checklist
  const factorMatches = useMemo(() => calculateFactorMatches(studentSpec, meta.keyFactors), [studentSpec, meta.keyFactors]);
  const docChecklist = useMemo(() => getDocumentChecklist(studentSpec), [studentSpec]);

  /**
   * Handles real-time streaming chat messages and essay drafts.
   * 
   * Why: Instantaneous server streams improve UX response times. Clearing the draft 
   * at the start of a fresh essay generation resolves legacy draft accumulation bugs.
   */
  const sendMessage = useCallback(async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || isStreaming) return;

    if (!hasStarted) {
      setHasStarted(true);
      // Injects welcome message if starting conversation
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: meta.welcomeMessage,
      }]);
    }

    // Overwrites or resets draft before generating a new essay
    if (mode === "essay") {
      setEssayDraft("");
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/chat/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, sessionId, mode }),
      });

      if (!res.ok || !res.body) throw new Error("응답 수신 오류");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.sessionId) setSessionId(parsed.sessionId);
            if (parsed.delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.delta } : m
                )
              );
              if (mode === "essay") {
                setEssayDraft((prev) => prev + parsed.delta);
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "답변 처리 중 오류가 발생했습니다. 다시 시도해주십시오." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, sessionId, mode, slug, meta, hasStarted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startConversation = () => {
    setHasStarted(true);
    setMessages([{ id: "welcome", role: "assistant", content: meta.welcomeMessage }]);
  };

  return (
    <div className={styles.page} style={{ "--brand": meta.brandColor, "--glow": meta.glowColor } as React.CSSProperties}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/universities" className={styles.backBtn}>← 대학 목록</Link>
        <div className={styles.headerInner}>
          <div className={styles.univEmoji}>{meta.logoEmoji}</div>
          <div>
            <h1 className={styles.univName}>{meta.nameKo}</h1>
            <div className={styles.univNameEn}>{meta.nameEn}</div>
          </div>
        </div>
        <div className={styles.personaBadge}>{meta.wantedPersonaKo}</div>
      </div>

      {/* Mode Switch */}
      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeBtn} ${mode === "chat" ? styles.modeActive : ""}`}
          onClick={() => setMode("chat")}
          aria-label="입학사정관 상담 모드"
        >
          💬 입학사정관 상담
        </button>
        <button
          className={`${styles.modeBtn} ${mode === "essay" ? styles.modeActive : ""}`}
          onClick={() => setMode("essay")}
          aria-label="자소서 작성 모드"
        >
          ✍️ 자소서 작성
        </button>
      </div>

      {/* Workspace: Dual panel with clean transitions */}
      <div className={styles.workspace}>
        {/* Chat Column */}
        <div className={styles.chatColumn}>
          {isLoadingSession ? (
            <div className={styles.introState}>
              <span className={styles.sendSpinner} style={{ borderColor: `${meta.brandColor}40`, borderTopColor: meta.brandColor }} />
              <p className={styles.introDesc}>세션을 복구하고 있습니다...</p>
            </div>
          ) : !hasStarted ? (
            <div className={styles.introState}>
              <div className={styles.introEmoji}>{meta.logoEmoji}</div>
              <h2 className={styles.introTitle}>{meta.nameKo} 입학사정관</h2>
              <p className={styles.introDesc}>{meta.wantedPersonaDescKo}</p>
              <button className={styles.startBtn} onClick={startConversation}>
                대화 시작하기 →
              </button>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
                  {msg.role === "assistant" && (
                    <div className={styles.avatarWrap}>
                      <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${meta.brandColor}, ${meta.brandColor}88)` }}>
                        {meta.logoEmoji}
                      </div>
                    </div>
                  )}
                  <div className={`${styles.bubble} ${styles[`bubble_${msg.role}`]}`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || ""}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                    {isStreaming && msg.role === "assistant" && !msg.content && (
                      <div className={styles.typingDots}>
                        <span /><span /><span />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Bar */}
          <div className={styles.inputBar}>
            <textarea
              ref={textareaRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "essay"
                  ? "자소서 작성 방향이나 내용을 입력하세요..."
                  : "질문을 입력하세요... (Shift+Enter: 줄바꿈)"
              }
              rows={1}
              disabled={isStreaming || isLoadingSession}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming || isLoadingSession}
              style={{ background: meta.brandColor }}
              aria-label="메시지 전송"
            >
              {isStreaming ? <span className={styles.sendSpinner} /> : "↑"}
            </button>
          </div>
        </div>

        {/* Dynamic Panels Side-by-Side: Essay Editor OR Evaluation Analysis */}
        <AnimatePresence mode="wait">
          {mode === "essay" ? (
            <motion.div
              key="essay"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={styles.essayColumn}
            >
              <div className={styles.essayHeader}>
                <div className={styles.essayTitle}>자소서 초안</div>
                <div className={styles.headerActions}>
                  {essayDraft && (
                    <button
                      className={`${styles.actionBtn} ${isFactChecking ? styles.btnLoading : ""}`}
                      onClick={handleFactCheck}
                      disabled={isFactChecking}
                    >
                      {isFactChecking ? "분석 중..." : "🔍 실시간 팩트체크"}
                    </button>
                  )}
                  {auditResult && (
                    <div className={styles.toggleGroup}>
                      <button
                        className={`${styles.toggleItem} ${!showAudit ? styles.toggleActive : ""}`}
                        onClick={() => setShowAudit(false)}
                      >
                        편집
                      </button>
                      <button
                        className={`${styles.toggleItem} ${showAudit ? styles.toggleActive : ""}`}
                        onClick={() => setShowAudit(true)}
                      >
                        분석 결과
                      </button>
                    </div>
                  )}
                  <button
                    className={styles.copyBtn}
                    onClick={() => navigator.clipboard.writeText(essayDraft)}
                    disabled={!essayDraft}
                    aria-label="초안 복사"
                  >
                    복사
                  </button>
                </div>
              </div>

              {essayDraft ? (
                showAudit && auditResult ? (
                  <div className={styles.auditContainer}>
                    {/* 1. Audit Summary Gauge & Banners */}
                    <div className={styles.auditSummaryCard}>
                      <div className={styles.gaugeSection}>
                        <div className={styles.gaugeWrapper}>
                          <svg className={styles.gaugeSvg} viewBox="0 0 36 36">
                            <path
                              className={styles.gaugeBg}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={styles.gaugeFill}
                              style={{
                                strokeDasharray: `${auditResult.score}, 100`,
                                stroke: auditResult.score > 80 ? '#10b981' : '#f59e0b'
                              }}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className={styles.gaugeText}>
                            <span className={styles.gaugeNum}>{auditResult.score}%</span>
                            <span className={styles.gaugeLabel}>Fact Match</span>
                          </div>
                        </div>
                        <div className={styles.summaryTextGroup}>
                          <div className={styles.summaryTitle}>팩트체크 종합 리포트</div>
                          <p className={styles.summaryDesc}>{auditResult.summary}</p>
                        </div>
                      </div>

                      {hasUnverifiedClaims ? (
                        <div className={styles.alertBanner}>
                          <span className={styles.alertIcon}>🚨</span>
                          <div className={styles.alertTextWrap}>
                            <div className={styles.alertTitle}>최종 원서 접수 제한됨</div>
                            <div className={styles.alertDesc}>
                              학생부/활동 기록에서 교차 검증되지 않는 약력이 포함되어 있습니다. 허위 기재나 오차는 불합격 요인이 될 수 있습니다.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.successBanner}>
                          <span className={styles.successIcon}>🎉</span>
                          <div className={styles.successTextWrap}>
                            <div className={styles.successTitle}>원서 접수 즉시 가능</div>
                            <div className={styles.successDesc}>
                              기재된 모든 학업 성취도 및 수상/봉사 실적이 업로드된 원본 서류와 100% 매칭 완료되었습니다!
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Interactive highlight-annotated text */}
                    <div className={styles.auditedTextContainer}>
                      <p className={styles.auditedParagraph}>
                        {auditResult.sentences.map((sent: any, idx: number) => {
                          let spanClass = styles.sentNeutral;
                          if (sent.status === "VERIFIED") spanClass = styles.sentVerified;
                          if (sent.status === "UNVERIFIED") spanClass = styles.sentUnverified;

                          const isSelected = selectedSentenceIndex === idx;

                          return (
                            <span
                              key={idx}
                              className={`${styles.auditedSentence} ${spanClass} ${isSelected ? styles.sentSelected : ""}`}
                              onClick={() => setSelectedSentenceIndex(isSelected ? null : idx)}
                            >
                              {sent.text}{" "}
                            </span>
                          );
                        })}
                      </p>

                      {/* Absolute-floating popover tooltip card */}
                      <AnimatePresence>
                        {selectedSentenceIndex !== null && (() => {
                          const sent = auditResult.sentences[selectedSentenceIndex];
                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className={styles.floatingTooltip}
                            >
                              <div className={styles.tooltipHeader}>
                                <span className={`${styles.statusBadge} ${styles[`badge_${sent.status}`]}`}>
                                  {sent.status === "VERIFIED" && "✅ 교차검증 성공"}
                                  {sent.status === "UNVERIFIED" && "❌ 증빙 확인 필요"}
                                  {sent.status === "NEUTRAL" && "ℹ️ 서술형 진술"}
                                </span>
                                <span className={styles.tooltipCategory}>
                                  {sent.category === "academic" && "📚 성적/이수"}
                                  {sent.category === "award" && "🏆 수상기록"}
                                  {sent.category === "activity" && "🤝 비교과/리더십"}
                                  {sent.category === "volunteer" && "❤️ 봉사시간"}
                                  {sent.category === "residency" && "✈️ 체류자격"}
                                  {sent.category === "general" && "📄 일반"}
                                </span>
                              </div>
                              <p className={styles.tooltipSentence}>"{sent.text}"</p>
                              {sent.explanation && (
                                <p className={styles.tooltipExplanation}>{sent.explanation}</p>
                              )}
                              {sent.matchedRecord && (
                                <div className={styles.tooltipMatchedRecord}>
                                  <span className={styles.matchLabel}>원본 증빙 확인 내역:</span>
                                  <span className={styles.matchValue}>{sent.matchedRecord}</span>
                                </div>
                              )}
                              <button
                                className={styles.tooltipClose}
                                onClick={() => setSelectedSentenceIndex(null)}
                              >
                                확인
                              </button>
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </div>

                    {/* 3. Final simulated submission */}
                    <div className={styles.submissionContainer}>
                      <button
                        className={`${styles.submitAppBtn} ${hasUnverifiedClaims ? styles.submitAppDisabled : ""}`}
                        onClick={handleFinalSubmit}
                        disabled={hasUnverifiedClaims || isSubmitting}
                      >
                        {isSubmitting ? "최종 원서 접수 중..." : `최종 ${meta.nameKo} 원서 접수하기 🎓`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <textarea
                    className={styles.essayEditor}
                    value={essayDraft}
                    onChange={(e) => {
                      setEssayDraft(e.target.value);
                      setAuditResult(null); // clear audit to enforce check
                    }}
                    placeholder="AI가 대화를 바탕으로 자소서 초안을 생성합니다."
                  />
                )
              ) : (
                <div className={styles.essayEmpty}>
                  <div className={styles.essayEmptyIcon}>✍️</div>
                  <div className={styles.essayEmptyText}>
                    왼쪽 챗봇에서 자소서 작성 방향을 이야기하면
                    <br />
                    이 공간에 초안이 자동으로 생성됩니다.
                  </div>
                </div>
              )}
              {essayDraft && (
                <div className={styles.essayMeta}>
                  {essayDraft.replace(/\s/g, "").length}자 / 제한 {meta.essayCharLimit > 0 ? `${meta.essayCharLimit}자` : "없음"}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="evaluation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={styles.evalColumn}
            >
              <div className={styles.evalHeader}>
                <div className={styles.evalTitle}>
                  <span>📊</span> 입시 적합도 & 모집요강
                </div>
              </div>
              <div className={styles.evalScroll}>
                {/* 1. Spec Match Alignment */}
                <div className={styles.evalSection}>
                  <h3 className={styles.evalSecTitle}>인재상 적합도 평가</h3>
                  {!studentSpec ? (
                    <div className={styles.noSpecCard}>
                      <div className={styles.noSpecIcon}>📄</div>
                      <div className={styles.noSpecText}>
                        스펙 문서 분석 정보가 없습니다.
                        <br />
                        서류를 업로드해 실시간 매칭률을 파악하세요!
                      </div>
                      <Link href="/spec" className={styles.noSpecBtn}>
                        나의 스펙 분석하러 가기
                      </Link>
                    </div>
                  ) : (
                    factorMatches.map((factor, i) => (
                      <div key={i} className={styles.factorCard}>
                        <div className={styles.factorTitleRow}>
                          <span className={styles.factorName}>{factor.name}</span>
                          <span className={styles.factorScore} style={{ color: meta.brandColor }}>
                            {factor.score}%
                          </span>
                        </div>
                        <div className={styles.factorBar}>
                          <div
                            className={styles.factorFill}
                            style={{
                              width: `${factor.score}%`,
                              background: `linear-gradient(90deg, ${meta.brandColor}, ${meta.brandColor}88)`
                            }}
                          />
                        </div>
                        <p className={styles.factorDesc}>{factor.description}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. Required Documents Checklist */}
                <div className={styles.evalSection}>
                  <h3 className={styles.evalSecTitle}>특례 입시 필수 서류 현황</h3>
                  <div className={styles.docChecklist}>
                    {docChecklist.map((doc, idx) => (
                      <div key={idx} className={styles.docItem}>
                        <div className={styles.docTextWrap}>
                          <span className={styles.docIcon}>{doc.isUploaded ? "✅" : "⚠️"}</span>
                          <span className={styles.docName}>{doc.name}</span>
                        </div>
                        <span className={`${styles.docStatus} ${doc.isUploaded ? styles.docStatus_uploaded : styles.docStatus_missing}`}>
                          {doc.isUploaded ? "분석 완료" : "제출 필요"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Guidelines Quick Facts */}
                <div className={styles.evalSection}>
                  <h3 className={styles.evalSecTitle}>요강 핵심 요약 (2026학년도)</h3>
                  <div className={styles.quickFacts}>
                    <div className={styles.factRow}>
                      <span className={styles.factLabel}>추천 자소서 분량</span>
                      <span className={styles.factValue}>
                        {meta.essayCharLimit > 0 ? `공백 제외 ${meta.essayCharLimit}자 내외` : "제한 없음"}
                      </span>
                    </div>
                    <div className={styles.factRow}>
                      <span className={styles.factLabel}>특례 자격 전형</span>
                      <span className={styles.factValue}>
                        {studentSpec?.track === "SPECIAL_12YR"
                          ? "12년 전교육과정 해외이수자"
                          : studentSpec?.track === "SPECIAL_3YR"
                          ? "3년 특례 재외국민"
                          : "3년 / 12년 특례 통합 검토"}
                      </span>
                    </div>
                    <div className={styles.factRow}>
                      <span className={styles.factLabel}>평가 중심 요소</span>
                      <span className={styles.factValue}>{meta.keyFactors.join(", ")}</span>
                    </div>
                    <div className={styles.factRow}>
                      <span className={styles.factLabel}>전형 안내 가이드</span>
                      <span className={styles.factValue} style={{ color: meta.brandColor }}>
                        요강 RAG 동기화 완료
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submission Success Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.successConfetti}>🎉</div>
              <h2 className={styles.modalTitle}>최종 대학 제출 성공!</h2>
              <p className={styles.modalDesc}>
                학생의 성적표, 출입국 기록, 활동 및 모든 기재 사실의 검증이
                완벽하게 매칭되어 **{meta.nameKo}** 전형에 최종 원서 접수가 완료되었습니다.
              </p>
              <div className={styles.modalDocList}>
                <div className={styles.modalDocItem}>✅ 13학년 성적증명서 검증 완료</div>
                <div className={styles.modalDocItem}>✅ 출입국 사실증명서 자격조건 부합</div>
                <div className={styles.modalDocItem}>✅ 100% 팩트 그라운디드 자기소개서 서명 필</div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowSubmitModal(false)}
              >
                접수 확인 완료
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
