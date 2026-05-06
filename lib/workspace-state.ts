/**
 * Workspace state persisted in sessionStorage so each step page can read/write it.
 * All pages share this single source of truth without a global context provider.
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { universityGuidelines } from "@/lib/mock-data";
import type { AdmissionTrack } from "./admission-types";

export type WorkspaceState = {
  approved: boolean;
  targetGuidelineId: string;
  selectedThemeId: string;
  storyAnswer: string;
  locale: "ko" | "en";
  studentId?: string;
  track?: AdmissionTrack;
  essayId?: string;
  evaluationData?: any;
};

const DEFAULTS: WorkspaceState = {
  approved: false,
  targetGuidelineId: universityGuidelines[0]?.id || "",
  selectedThemeId: "theme-a",
  storyAnswer:
    "During our bioinformatics club project, I noticed that a clean dataset changed the quality of every conclusion. I rebuilt the spreadsheet, checked missing labels, and learned that scientific confidence depends on disciplined preparation before analysis.",
  locale: "ko",
  track: "SPECIAL_12YR",
};

const KEY = "ga_workspace_state";

function read(): WorkspaceState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function write(state: WorkspaceState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

/** Hook for individual step pages to read and update shared workspace state. */
export function useWorkspaceState() {
  const [state, setState] = useState<WorkspaceState>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<WorkspaceState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const syncWithBackend = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/student/profile?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to sync profile");
      const data = await res.json();
      
      const patch: Partial<WorkspaceState> = {
        studentId: data.userId,
        track: data.track,
        approved: data.documents?.some((d: any) => d.isApproved) || false,
        // Map other fields as necessary
      };
      
      update(patch);
      return data;
    } catch (err) {
      console.error("Sync error:", err);
    }
  }, [update]);

  return { state, update, syncWithBackend, ready };
}
