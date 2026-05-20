"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  GraduationCap,
  Activity,
  TrendingUp,
  Stethoscope,
  MessageCircle,
} from "lucide-react";
import { Logger } from "@/lib/logger";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ProfileData = {
  gpa?: number | null;
  track?: string | null;
  status?: string;
  academicRecords?: Array<{ subject: string; grade: string; credit: number }>;
  activities?: Array<{ title: string; description: string }>;
  applications?: Array<{
    guideline: { university: string; major: string };
  }>;
};

type QuickAction = {
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: TrendingUp,
    label: "나의 강점 분석",
    prompt: "내 스펙에서 가장 돋보이는 강점은 뭐야? 구체적으로 설명해줘.",
    color: "#34c759",
  },
  {
    icon: GraduationCap,
    label: "맞춤 대학 추천",
    prompt:
      "내 현재 스펙으로 지원할 수 있는 최적의 대학과 전공 조합을 추천해줘.",
    color: "#0066cc",
  },
  {
    icon: Activity,
    label: "약점 보완 전략",
    prompt:
      "내 프로필에서 가장 약한 부분은 어디야? 어떻게 보완할 수 있을까?",
    color: "#ff9500",
  },
  {
    icon: Stethoscope,
    label: "의대 지원 가능성",
    prompt:
      "내 스펙으로 의대/치대/약대 지원이 현실적인지 솔직하게 평가해줘.",
    color: "#ff3b30",
  },
];

/**
 * ProfileChat Component.
 * Provides a premium AI 입시 상담 (AI Admission Chatbot) workspace
 * with streaming support, quick action prompts, and spec summaries.
 * 
 * @param {Object} props - Component props.
 * @param {ProfileData} props.profile - The student's academic and activity specifications.
 * @param {"ko" | "en"} [props.locale="ko"] - The internationalization locale setting.
 * @returns {JSX.Element} The rendered premium chat interface.
 */
export default function ProfileChat({
  profile,
  locale = "ko",
}: {
  profile: ProfileData;
  locale?: "ko" | "en";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowQuickActions(false);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = `assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: assistantContent,
          };
          return updated;
        });
      }
    } catch (err) {
      Logger.error("[ProfileChat] Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "죄송합니다, 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Spec summary chips
  const specChips = [
    profile.track && {
      label: profile.track === "SPECIAL_12YR" ? "12년 특례" : "3년 특례",
      color: "#5856d6",
    },
    profile.gpa != null && {
      label: `GPA ${profile.gpa}`,
      color: "#0066cc",
    },
    profile.academicRecords &&
      profile.academicRecords.length > 0 && {
        label: `${profile.academicRecords.length}개 과목`,
        color: "#34c759",
      },
    profile.activities &&
      profile.activities.length > 0 && {
        label: `${profile.activities.length}개 활동`,
        color: "#ff9500",
      },
    profile.applications &&
      profile.applications.length > 0 && {
        label: `${profile.applications.length}개교 지원`,
        color: "#ff3b30",
      },
  ].filter(Boolean) as Array<{ label: string; color: string }>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 40px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,102,204,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(88,86,214,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header with spec chips */}
      <header
        style={{
          padding: "20px 32px",
          borderBottom: "var(--border-hairline)",
          background: "var(--colors-surface-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0066cc 0%, #5856d6 100%)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 12px rgba(0,102,204,0.25)",
            }}
          >
            <MessageCircle size={20} color="white" />
          </div>
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                fontFamily: "Outfit, sans-serif",
                color: "var(--colors-ink)",
                lineHeight: 1.2,
              }}
            >
              {locale === "ko" ? "AI 입시 상담" : "AI Admission Counselor"}
            </h2>
            <p
              style={{
                fontSize: 11,
                color: "var(--colors-ink-muted-48)",
                fontWeight: 500,
              }}
            >
              {locale === "ko"
                ? "나의 검증된 스펙 기반 맞춤 상담"
                : "Personalized advice based on your verified specs"}
            </p>
          </div>
        </div>

        {/* Spec chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {specChips.map((chip, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 99,
                background: `${chip.color}10`,
                color: chip.color,
                border: `1px solid ${chip.color}20`,
                whiteSpace: "nowrap",
              }}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </header>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 32px 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Welcome state with quick actions */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 32,
            }}
          >
            {/* Hero icon */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, #0066cc 0%, #5856d6 100%)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 12px 40px rgba(0,102,204,0.2)",
              }}
            >
              <Sparkles size={36} color="white" />
            </div>

            <div style={{ textAlign: "center", maxWidth: 480 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: "Outfit, sans-serif",
                  color: "var(--colors-ink)",
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {locale === "ko"
                  ? "무엇이든 물어보세요"
                  : "Ask me anything"}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--colors-ink-muted-64)",
                  lineHeight: 1.6,
                }}
              >
                {locale === "ko"
                  ? "나의 성적, 활동, 지원 전략에 대해 AI 입시 전문가와 자유롭게 대화하세요. 검증된 스펙 데이터를 기반으로 정확한 조언을 드립니다."
                  : "Chat freely about your grades, activities, and application strategy. I provide accurate advice based on your verified spec data."}
              </p>
            </div>

            {/* Quick action grid */}
            {showQuickActions && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                  width: "100%",
                  maxWidth: 520,
                }}
              >
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                      onClick={() => sendMessage(action.prompt)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "14px 16px",
                        borderRadius: "var(--rounded-md)",
                        border: "var(--border-hairline)",
                        background: "var(--colors-surface-white)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        boxShadow: "var(--shadow-premium)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "var(--shadow-premium)";
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${action.color}10`,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={action.color} />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--colors-ink)",
                        }}
                      >
                        {action.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 24,
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}
              >
                {/* Bot avatar */}
                {!isUser && (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, #0066cc 0%, #5856d6 100%)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,102,204,0.2)",
                    }}
                  >
                    <Bot size={18} color="white" />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "14px 18px",
                    borderRadius: isUser
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background: isUser
                      ? "var(--colors-ink)"
                      : "var(--colors-surface-white)",
                    color: isUser ? "white" : "var(--colors-ink)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    border: isUser ? "none" : "var(--border-hairline)",
                    boxShadow: isUser
                      ? "0 4px 12px rgba(0,0,0,0.1)"
                      : "var(--shadow-premium)",
                  }}
                >
                  {m.content || (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--colors-ink-muted-48)",
                      }}
                    >
                      <Loader2
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      생각 중...
                    </span>
                  )}
                </div>

                {/* User avatar */}
                {isUser && (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "var(--colors-surface-pearl)",
                      border: "var(--border-hairline)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={16} color="var(--colors-ink-muted-64)" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: "16px 32px 24px",
          background: "var(--colors-surface-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "var(--border-hairline)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 800,
            margin: "0 auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              locale === "ko"
                ? "나의 스펙에 대해 무엇이든 물어보세요..."
                : "Ask anything about your specs..."
            }
            disabled={isLoading}
            style={{
              width: "100%",
              background: "var(--colors-surface-white)",
              border: "var(--border-hairline)",
              color: "var(--colors-ink)",
              borderRadius: 99,
              padding: "16px 56px 16px 24px",
              fontSize: 15,
              outline: "none",
              boxShadow: "var(--shadow-premium)",
              transition: "box-shadow 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(0,102,204,0.2), var(--shadow-premium)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-premium)";
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              position: "absolute",
              right: 6,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background:
                isLoading || !input.trim()
                  ? "var(--colors-ink-muted-24)"
                  : "linear-gradient(135deg, #0066cc 0%, #5856d6 100%)",
              color: "white",
              cursor:
                isLoading || !input.trim() ? "not-allowed" : "pointer",
              display: "grid",
              placeItems: "center",
              transition: "all 0.2s ease",
              boxShadow:
                isLoading || !input.trim()
                  ? "none"
                  : "0 4px 12px rgba(0,102,204,0.3)",
            }}
          >
            {isLoading ? (
              <Loader2
                size={18}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--colors-ink-muted-24)",
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          {locale === "ko"
            ? "AI는 프로필에 등록된 검증된 데이터만을 기반으로 답변합니다."
            : "AI responses are based solely on your verified profile data."}
        </p>
      </div>

      {/* Keyframe for spinner */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
