"use client";

import { useState, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { useWorkspaceState } from "@/lib/workspace-state";
import ProfileChat from "@/components/profile-chat";
import { Loader2 } from "lucide-react";
import { Logger } from "@/lib/logger";

/**
 * ChatPage Component.
 * B2C Student Chat workspace page. Loads the student's profile from /api/student/profile
 * and renders the premium ProfileChat component inside the student AppNav shell.
 * Redesigned fully with custom Tailwind CSS utility classes and clean dark mode layout.
 * 
 * @returns {JSX.Element} The rendered student chat workspace page.
 */
export default function ChatPage() {
  const { state, ready } = useWorkspaceState();
  const locale = state.locale;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        Logger.error("Failed to load profile for chat:", e);
      } finally {
        setLoading(false);
      }
    }
    if (ready) loadProfile();
  }, [ready]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <AppNav mode="student" locale="ko" />
        <div className="flex-1 grid place-items-center bg-white dark:bg-slate-900 h-screen">
          <div className="text-center">
            <Loader2 
              size={32} 
              className="animate-spin mb-3 text-blue-600 dark:text-blue-400 mx-auto" 
            />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              프로필 로딩 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppNav mode="student" locale={locale} />
      <main className="flex-1 bg-white dark:bg-slate-900 overflow-hidden">
        <ProfileChat 
          profile={{
            gpa: profile?.gpa,
            track: profile?.track,
            status: profile?.status,
            academicRecords: profile?.academicRecords || [],
            activities: profile?.activities || [],
            applications: profile?.applications || [],
          }} 
          locale={locale} 
        />
      </main>
    </div>
  );
}
