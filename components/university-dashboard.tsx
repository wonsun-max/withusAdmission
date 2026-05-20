"use client";

import React, { useState } from "react";
import { AppNav } from "@/components/app-nav";
import { getUniversityMeta } from "@/lib/university-meta";
import ChatWorkspaceClient from "@/components/chat-workspace";
import { 
  ArrowLeft, FileText, FlaskConical, MessageSquareShare, Upload, 
  CheckCircle2, FileSearch, Sparkles, UserCircle 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UniversityDashboardClient({ application, guideline, essay, profile }: any) {
  const [activeTab, setActiveTab] = useState<"overview" | "spec" | "chat">("overview");
  const schoolMeta = getUniversityMeta(guideline.university);

  // Safe requirements parsing
  let requirementsObj: any = {};
  try {
    requirementsObj = typeof guideline.requirements === "string"
      ? JSON.parse(guideline.requirements)
      : guideline.requirements;
  } catch (e) {
    console.error("Failed to parse requirements", e);
  }

  const renderFallbackRequirements = () => {
    if (!requirementsObj) return null;
    return Object.entries(requirementsObj).map(([key, val]: any) => (
      <div key={key} className="mb-4 last:mb-0 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{key}</h4>
        <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
          {typeof val === 'string' ? val : JSON.stringify(val, null, 2).replace(/[\{\}\[\]"]/g, '')}
        </div>
      </div>
    ));
  };

  return (
    <div className="app-shell min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <AppNav mode="student" locale="ko" />
      
      {/* Dashboard Header */}
      <div 
        className="relative pt-12 pb-6 px-6 md:px-12 border-b border-slate-200 dark:border-slate-800 overflow-hidden shrink-0"
        style={{ backgroundColor: `${schoolMeta.brandColor}08` }}
      >
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full filter blur-[100px] opacity-30 pointer-events-none"
          style={{ backgroundColor: schoolMeta.brandColor }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/b2c/workspace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            워크스페이스 대시보드로 돌아가기
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border bg-white dark:bg-slate-900" style={{ borderColor: `${schoolMeta.brandColor}30` }}>
              {schoolMeta.logoEmoji}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {schoolMeta.nameKo} <span className="text-xl md:text-2xl font-bold text-slate-500 font-normal">지원 대시보드</span>
              </h1>
              <p className="text-sm font-semibold mt-1" style={{ color: schoolMeta.brandColor }}>
                {guideline.major} 전공 · {guideline.intake === "MARCH" ? "3월 학기" : "9월 학기"}
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto hide-scrollbar">
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={FileText} label="제출 서류 및 문항" color={schoolMeta.brandColor} />
            <TabButton active={activeTab === "spec"} onClick={() => setActiveTab("spec")} icon={FlaskConical} label="스펙 진단 (어디까지)" color={schoolMeta.brandColor} />
            <TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")} icon={MessageSquareShare} label="자소서 챗봇 (AI)" color={schoolMeta.brandColor} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 h-full flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
              
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: schoolMeta.brandColor }} />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">대학 인재상 (Persona)</h2>
                </div>
                <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: `${schoolMeta.brandColor}20` }}>
                  <div className={`text-sm font-extrabold mb-2 ${schoolMeta.accentTextClass}`}>{schoolMeta.wantedPersonaKo}</div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{schoolMeta.wantedPersonaDescKo}</p>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Documents Upload Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-slate-500" />
                      제출 필수 서류
                    </h2>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                    {["성적증명서 (Transcript)", "어학증명서 (Language)", "비교과 활동 (Activities)"].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{doc}</span>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" /> 업로드
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Essay Prompts Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">자소서 문항 (Prompts)</h2>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    {requirementsObj.prompts ? (
                      <div className="space-y-4">
                        {requirementsObj.prompts.map((p: any, i: number) => (
                          <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xs">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md" style={{ backgroundColor: `${schoolMeta.brandColor}15`, color: schoolMeta.brandColor }}>
                                문항 {p.id || i+1}
                              </span>
                              {p.limit && <span className="text-[11px] text-slate-400 font-bold">최대 {p.limit}자</span>}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                              {p.title || p.question}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">{renderFallbackRequirements()}</div>
                    )}
                  </div>
                </section>
              </div>

            </motion.div>
          )}

          {/* TAB 2: SPEC EVALUATION */}
          {activeTab === "spec" && (
            <motion.div key="spec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1">
               <div className="text-center py-20">
                 <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                   <UserCircle className="w-10 h-10 text-slate-400" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{schoolMeta.nameKo} 합격 가능성 진단</h2>
                 <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                   현재 입력된 나의 스펙(GPA, 어학, 비교과)을 기반으로 {schoolMeta.nameKo} {guideline.major} 전공에 지원했을 때의 경쟁력을 AI가 진단합니다.
                 </p>
                 <button className="px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: schoolMeta.brandColor }}>
                   AI 스펙 진단 시작하기
                 </button>
               </div>
            </motion.div>
          )}

          {/* TAB 3: AI CONSULTANT (CHAT) */}
          {activeTab === "chat" && (
            <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 h-[70vh] -mx-6 md:-mx-12 -mb-6 md:-mb-12 border-t border-slate-200 dark:border-slate-800">
               <ChatWorkspaceClient essay={essay} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// Helper component for tabs
function TabButton({ active, onClick, icon: Icon, label, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
        active 
          ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700" 
          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
      }`}
    >
      <Icon className="w-4 h-4" style={active ? { color } : {}} />
      {label}
    </button>
  );
}
