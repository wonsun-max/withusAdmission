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
  colorClass: string;
  bgClass: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: TrendingUp,
    label: "나의 강점 분석",
    prompt: "내 스펙에서 가장 돋보이는 강점은 뭐야? 구체적으로 설명해줘.",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30",
  },
  {
    icon: GraduationCap,
    label: "맞춤 대학 추천",
    prompt: "내 현재 스펙으로 지원할 수 있는 최적의 대학과 전공 조합을 추천해줘.",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30",
  },
  {
    icon: Activity,
    label: "약점 보완 전략",
    prompt: "내 프로필에서 가장 약한 부분은 어디야? 어떻게 보완할 수 있을까?",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30",
  },
  {
    icon: Stethoscope,
    label: "의대 지원 가능성",
    prompt: "내 스펙으로 의대/치대/약대 지원이 현실적인지 솔직하게 평가해줘.",
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30",
  },
];

/**
 * ProfileChat Component.
 * Provides a premium AI 입시 상담 (AI Admission Chatbot) workspace
 * redesigned fully with custom Tailwind CSS utility classes, glassmorphic layout elements,
 * support for live OpenAI stream tokens, and robust internationalization.
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
      styleClass: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/50",
    },
    profile.gpa != null && {
      label: `GPA ${profile.gpa}`,
      styleClass: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50",
    },
    profile.academicRecords &&
      profile.academicRecords.length > 0 && {
        label: `${profile.academicRecords.length}개 과목`,
        styleClass: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50",
      },
    profile.activities &&
      profile.activities.length > 0 && {
        label: `${profile.activities.length}개 활동`,
        styleClass: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
      },
    profile.applications &&
      profile.applications.length > 0 && {
        label: `${profile.applications.length}개교 지원`,
        styleClass: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50",
      },
  ].filter(Boolean) as Array<{ label: string; styleClass: string }>;

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[20%] -right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.05)_0%,_transparent_70%)] blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.04)_0%,_transparent_70%)] blur-[80px] pointer-events-none z-0" />

      {/* Header with spec chips */}
      <header className="px-8 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-50 font-outfit">
              {locale === "ko" ? "AI 입시 상담" : "AI Admission Counselor"}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {locale === "ko"
                ? "나의 검증된 스펙 기반 맞춤 상담"
                : "Personalized advice based on your verified specs"}
            </p>
          </div>
        </div>

        {/* Spec chips */}
        <div className="flex gap-2 flex-wrap justify-end">
          {specChips.map((chip, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border ${chip.styleClass} white-space-nowrap`}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 relative z-1">
        {/* Welcome state with quick actions */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[85%] gap-8 text-center max-w-2xl mx-auto"
          >
            {/* Hero icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Sparkles size={28} className="text-white" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-slate-50 font-outfit tracking-tight">
                {locale === "ko" ? "무엇이든 물어보세요" : "Ask me anything"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                {locale === "ko"
                  ? "나의 성적, 활동, 지원 전략에 대해 AI 입시 전문가와 자유롭게 대화하세요. 검증된 스펙 데이터를 기반으로 정확한 조언을 드립니다."
                  : "Chat freely about your grades, activities, and application strategy. I provide accurate advice based on your verified spec data."}
              </p>
            </div>

            {/* Quick action grid */}
            {showQuickActions && (
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-2">
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                      onClick={() => sendMessage(action.prompt)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${action.bgClass}`}>
                        <Icon size={18} className={action.colorClass} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-100 transition-colors">
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
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* Bot avatar */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Bot size={18} className="text-white" />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm font-medium ${
                    isUser
                      ? "rounded-[18px_18px_4px_18px] bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "rounded-[18px_18px_18px_4px] bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Loader2 size={14} className="animate-spin" />
                      생각 중...
                    </span>
                  )}
                </div>

                {/* User avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <User size={16} className="text-slate-400 dark:text-slate-500" />
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
      <footer className="px-8 py-5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shrink-0 z-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
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
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 rounded-full py-4 pl-6 pr-16 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
          {locale === "ko"
            ? "AI는 프로필에 등록된 검증된 데이터만을 기반으로 답변합니다."
            : "AI responses are based solely on your verified profile data."}
        </p>
      </footer>
    </div>
  );
}
