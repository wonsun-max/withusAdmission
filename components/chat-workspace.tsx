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
    <div className="flex flex-1 h-full overflow-hidden bg-transparent font-sans">

      {/* RIGHT PANE: Customized Interactive AI Chat Workspace */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/40 relative h-full overflow-hidden">
        
        {/* Dynamic Mobile/Tablet Header */}
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <span>{schoolMeta.logoEmoji}</span>
                {schoolMeta.nameKo} AI 전담 컨설턴트
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">자유롭게 학교 관련 정보를 질문하거나 자소서 작성을 시작해보세요.</p>
            </div>
          </div>
          <span 
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${schoolMeta.brandColor}15`, color: schoolMeta.brandColor }}
          >
            {schoolMeta.wantedPersonaKo.slice(0, 15)}...
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
