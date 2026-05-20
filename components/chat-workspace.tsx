"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, FileText, ArrowLeft, GraduationCap, CheckCircle } from "lucide-react";
import { getUniversityMeta } from "@/lib/university-meta";
import Link from "next/link";

interface ChatWorkspaceProps {
  essay: {
    id: string;
    studentId: string;
    guidelineId: string;
    masterKo?: string | null;
    masterEn?: string | null;
    tailoredResult?: string | null;
    guideline: {
      university: string;
      major: string;
      requirements: any;
    };
  };
}

export default function ChatWorkspaceClient({ essay }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch University-specific branding and agent persona metadata
  const schoolMeta = getUniversityMeta(essay.guideline.university);

  // 2. Fetch initial chat history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/essays/${essay.id}/chat`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [essay.id]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 4. Inject Dynamic AI Welcome Message when chat has no history
  const welcomeMessage = {
    id: "welcome-system-init",
    role: "assistant",
    content: schoolMeta.welcomeMessage,
  };
  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    
    // For the POST payload, we send the actual history. If history is empty, we can prefix it
    // with the simulated welcome message to maintain proper conversation context for the LLM.
    const historyPayload = messages.length === 0 ? [welcomeMessage, userMessage] : [...messages, userMessage];
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/essays/${essay.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      // Initialize assistant message in user UI
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantContent;
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Safe requirements object parsing
  const requirementsObj = typeof essay.guideline.requirements === "string" 
    ? JSON.parse(essay.guideline.requirements) 
    : essay.guideline.requirements;

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* LEFT PANE: Guidelines & Workspace Details */}
      <div className="w-1/3 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto relative shrink-0">
        
        {/* Dynamic School Glow Sphere (Premium Glassmorphism Effect) */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full filter blur-[110px] opacity-20 pointer-events-none transition-all duration-700 animate-pulse"
          style={{ backgroundColor: schoolMeta.brandColor }}
        />

        {/* Back Link */}
        <div className="mb-6 relative z-10">
          <Link 
            href="/b2c/workspace" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            워크스페이스 대시보드로 돌아가기
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border"
            style={{ 
              borderColor: `${schoolMeta.brandColor}30`, 
              backgroundColor: `${schoolMeta.brandColor}10` 
            }}
          >
            {schoolMeta.logoEmoji}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              {schoolMeta.nameKo}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {essay.guideline.major} 전공
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 relative z-10">
          {/* Target Student Persona Banner (School specific) */}
          <div 
            className="p-5 rounded-2xl border backdrop-blur-xl shadow-sm transition-all duration-300"
            style={{ 
              borderColor: `${schoolMeta.brandColor}25`, 
              background: `linear-gradient(135deg, ${schoolMeta.brandColor}06, rgba(255,255,255,0.8))` 
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5" style={{ color: schoolMeta.brandColor }} />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                대학 인재상 매칭 가이드
              </h4>
            </div>
            <div className={`text-xs font-bold mb-1.5 ${schoolMeta.accentTextClass}`}>
              {schoolMeta.wantedPersonaKo}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {schoolMeta.wantedPersonaDescKo}
            </p>
          </div>

          {/* Guideline Requirements */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
              모집요강 질문 및 규정
            </h3>
            
            {requirementsObj && requirementsObj.prompts ? (
              <div className="space-y-4">
                {requirementsObj.prompts.map((p: any) => (
                  <div key={p.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${schoolMeta.brandColor}15`, color: schoolMeta.brandColor }}>
                        문항 {p.id}
                      </span>
                      {p.limit && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          최대 {p.limit}자
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                      {p.title || p.question}
                    </p>
                  </div>
                ))}
              </div>
            ) : requirementsObj && Object.entries(requirementsObj).map(([key, val]: any) => (
              <div key={key} className="mb-4 last:mb-0">
                <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded mb-1.5">
                  {key}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {typeof val === 'string' ? val : JSON.stringify(val)}
                </p>
              </div>
            ))}
          </div>

          <div 
            className="p-4 rounded-xl border flex items-start gap-2.5"
            style={{ 
              borderColor: `${schoolMeta.brandColor}15`, 
              backgroundColor: `${schoolMeta.brandColor}03` 
            }}
          >
            <Sparkles className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              우측 AI 채팅창은 **{schoolMeta.nameKo} 전담 에이전트**로 세팅되어 작동합니다. 인재상 규격을 완벽히 녹여낼 수 있도록 대화를 편하게 주도해 가십시오.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Customized Interactive AI Chat Workspace */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/40 relative h-full overflow-hidden">
        
        {/* Dynamic Mobile/Tablet Header */}
        <header className="lg:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Link href="/b2c/workspace" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <span>{schoolMeta.logoEmoji}</span>
                {schoolMeta.nameKo}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">AI Consultant Chat</p>
            </div>
          </div>
          <span 
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${schoolMeta.brandColor}15`, color: schoolMeta.brandColor }}
          >
            {schoolMeta.wantedPersonaKo.slice(0, 10)}...
          </span>
        </header>

        {/* Dynamic Ambient Background Sphere behind messages */}
        <div 
          className="absolute top-1/3 right-10 w-96 h-96 rounded-full filter blur-[150px] opacity-10 pointer-events-none"
          style={{ backgroundColor: schoolMeta.brandColor }}
        />

        {/* Message Thread container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10">
          {loadingHistory && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: schoolMeta.brandColor }} />
            </div>
          )}

          <AnimatePresence initial={false}>
            {!loadingHistory && displayMessages.map((m) => {
              const isUser = m.role === "user";
              const isInitWelcome = m.id === "welcome-system-init";
              
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                      style={{ 
                        borderColor: `${schoolMeta.brandColor}25`, 
                        backgroundColor: `${schoolMeta.brandColor}12` 
                      }}
                    >
                      <Bot className="w-5 h-5" style={{ color: schoolMeta.brandColor }} />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[78%] p-4 rounded-2xl shadow-xs leading-relaxed text-sm whitespace-pre-wrap backdrop-blur-md transition-all duration-300 ${
                      isUser 
                        ? "text-white rounded-tr-xs" 
                        : "bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-tl-xs text-slate-800 dark:text-slate-200"
                    }`}
                    style={isUser ? { backgroundColor: schoolMeta.brandColor } : {}}
                  >
                    {isInitWelcome && (
                      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/50">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          {schoolMeta.nameKo} AI 전담 컨설팅 시작
                        </span>
                      </div>
                    )}
                    {m.content}
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/40 flex items-center justify-center shrink-0">
                      <User className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Premium Glassmorphic Chat Input Bar */}
        <div className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 relative z-20">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={`${schoolMeta.nameKo} 지원 관련 답변을 자유롭게 나누세요...`}
              className="w-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full py-4 pl-6 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
              style={{ backgroundColor: schoolMeta.brandColor }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4.5 h-4.5" />
              )}
            </button>
          </form>
          <div className="max-w-4xl mx-auto mt-2 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              모든 대화 내용은 실시간으로 해당 대학 자소서 초안에 자동 누적 동기화됩니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
