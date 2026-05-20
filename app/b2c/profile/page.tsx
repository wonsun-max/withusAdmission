"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { useWorkspaceState } from "@/lib/workspace-state";
import { GraduationCap, ClipboardList, Activity, Edit2, Save, X, Loader2, Plus, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { state, ready } = useWorkspaceState();
  const { locale } = state;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [gpa, setGpa] = useState<string>("0");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const data = await res.json();
          setGpa(data.gpa?.toString() || "0");
          setSubjects(data.academicRecords || []);
          setActivities(data.activities || []);
        }
      } finally {
        setLoading(false);
      }
    }
    if (ready) loadProfile();
  }, [ready]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/student/spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpa: parseFloat(gpa),
          academicRecords: subjects,
          activities: activities
        })
      });
      if (res.ok) {
        setIsEditing(false);
      } else {
        alert("Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!ready || loading) {
    return (
      <div className="app-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main className="main animate-in">
        <header className="page-header mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <div className="eyebrow flex items-center gap-1 mb-2">
              <GraduationCap size={14} />
              {locale === "ko" ? "나의 스펙" : "My Profile Spec"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {locale === "ko" ? "검증된 나의 학업 기록" : "Verified Academic Facts"}
            </h1>
            <p className="lead mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
              {locale === "ko"
                ? "승인된 서류에서 추출된 데이터입니다. 이 정보들이 자소서의 근거가 됩니다."
                : "Data extracted from approved documents. These facts form the core of your essays."}
            </p>
          </div>
          <div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="button outline text-sm shadow-sm">
                <Edit2 size={16} />
                {locale === "ko" ? "수정하기" : "Edit Profile"}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="button outline text-sm" disabled={saving}>
                  <X size={16} />
                  {locale === "ko" ? "취소" : "Cancel"}
                </button>
                <button onClick={handleSave} className="button brand text-sm shadow-sm" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {locale === "ko" ? "저장" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* GPA Section */}
          <section className="panel pad h-full">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <ClipboardList size={20} className="text-blue-500" />
                {locale === "ko" ? "학업 성적 (GPA)" : "Academic Performance"}
              </h3>
              {isEditing ? (
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500">GPA</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={gpa} 
                    onChange={e => setGpa(e.target.value)}
                    className="bg-transparent border-none outline-none w-16 text-sm font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
              ) : (
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">
                  GPA {gpa}
                </span>
              )}
            </div>
            
            <div className="w-full">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                <div className="col-span-6">Subject</div>
                <div className="col-span-3">Grade</div>
                <div className="col-span-2">Credit</div>
                {isEditing && <div className="col-span-1"></div>}
              </div>
              
              <div className="flex flex-col gap-2">
                {subjects.length > 0 ? subjects.map((s, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 text-sm items-center px-2 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="col-span-6">
                      {isEditing ? (
                        <input value={s.subject} onChange={e => { const ns = [...subjects]; ns[i].subject = e.target.value; setSubjects(ns); }} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 text-slate-800 dark:text-slate-100" placeholder="e.g. Mathematics" />
                      ) : (
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{s.subject}</span>
                      )}
                    </div>
                    <div className="col-span-3">
                      {isEditing ? (
                        <input value={s.grade} onChange={e => { const ns = [...subjects]; ns[i].grade = e.target.value; setSubjects(ns); }} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 text-slate-800 dark:text-slate-100" placeholder="A+" />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-300">{s.grade}</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      {isEditing ? (
                        <input type="number" value={s.credit} onChange={e => { const ns = [...subjects]; ns[i].credit = parseInt(e.target.value)||1; setSubjects(ns); }} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 text-slate-800 dark:text-slate-100" />
                      ) : (
                        <span className="text-slate-500">{s.credit || 1}</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-md transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-8 text-center text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    {locale === "ko" ? "기록된 성적이 없습니다." : "No academic records."}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <button onClick={() => setSubjects([...subjects, { subject: "", grade: "", credit: 1 }])} className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex justify-center items-center gap-1.5">
                  <Plus size={16} /> Add Subject
                </button>
              )}
            </div>
          </section>

          {/* Activities Section */}
          <section className="panel pad h-full">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Activity size={20} className="text-purple-500" />
                {locale === "ko" ? "교내외 활동" : "Activities"}
              </h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {activities.length > 0 ? activities.map((a, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 relative group">
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <input 
                        value={a.title} 
                        onChange={e => { const na = [...activities]; na[i].title = e.target.value; setActivities(na); }} 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 font-bold text-slate-800 dark:text-slate-100" 
                        placeholder="Activity Title (e.g., Debate Club President)" 
                      />
                      <textarea 
                        value={a.description} 
                        onChange={e => { const na = [...activities]; na[i].description = e.target.value; setActivities(na); }} 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-600 dark:text-slate-300 h-24 resize-none" 
                        placeholder="Describe your role and impact..." 
                      />
                      <button onClick={() => setActivities(activities.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ) : (
                    <>
                      <strong className="block mb-1.5 text-slate-800 dark:text-slate-100 font-bold">{a.title}</strong>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{a.description}</p>
                    </>
                  )}
                </div>
              )) : (
                <div className="py-8 text-center text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  {locale === "ko" ? "등록된 활동이 없습니다." : "No activities recorded."}
                </div>
              )}
              
              {isEditing && (
                <button onClick={() => setActivities([...activities, { title: "", description: "" }])} className="mt-1 w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex justify-center items-center gap-1.5">
                  <Plus size={16} /> Add Activity
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
