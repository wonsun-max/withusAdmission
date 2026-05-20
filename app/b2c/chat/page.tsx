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
      <div className="app-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <AppNav mode="student" locale="ko" />
        <div style={{ 
          flex: 1, 
          display: "grid", 
          placeItems: "center",
          background: "var(--colors-surface-white)"
        }}>
          <div style={{ textAlign: "center" }}>
            <Loader2 
              size={32} 
              color="var(--colors-primary)" 
              style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} 
            />
            <p style={{ fontSize: 14, color: "var(--colors-ink-muted-48)", fontWeight: 500 }}>
              프로필 로딩 중...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav mode="student" locale={locale} />
      <main style={{ 
        flex: 1, 
        background: "var(--colors-surface-white)",
        overflow: "hidden"
      }}>
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
