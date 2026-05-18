"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, FileText } from "lucide-react";

export default function ChatWorkspaceClient({ essay }: { essay: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat history
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/essays/${essay.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      // Initialize assistant message
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

  const requirementsObj = typeof essay.guideline.requirements === "string" 
    ? JSON.parse(essay.guideline.requirements) 
    : essay.guideline.requirements;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* LEFT PANE: Guidelines & Workspace */}
      <div className="w-1/3 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 overflow-y-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
        
        <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          {essay.guideline.university}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
          {essay.guideline.major} 전공 지원 가이드라인
        </p>

        <div className="space-y-6 relative z-10">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              모집요강 질문
            </h3>
            
            {requirementsObj && Object.entries(requirementsObj).map(([key, val]: any) => (
              <div key={key} className="mb-4 last:mb-0">
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded mb-2">
                  {key}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {typeof val === 'string' ? val : JSON.stringify(val)}
                </p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-indigo-900 dark:text-indigo-200">
              Agent Copilot Tips
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              우측 채팅창에서 AI와 대화하며 답변을 구체화하세요. AI가 모집요강에 맞춘 질문을 던져줄 것입니다.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Chat Interface */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/80 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {loadingHistory && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          <AnimatePresence>
            {!loadingHistory && messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-slate-400"
              >
                <Bot className="w-12 h-12 mb-4 opacity-50" />
                <p>AI 컨설턴트와의 대화를 시작하세요.</p>
              </motion.div>
            )}

            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {m.content}
                </div>

                {m.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="답변이나 질문을 입력하세요..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full py-4 pl-6 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
