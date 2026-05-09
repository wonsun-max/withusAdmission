/**
 * Workspace state persisted primarily in the Database.
 * sessionStorage is used as a local cache for instant UI feedback.
 */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { AdmissionTrack } from "./admission-types";

export type WorkspaceState = {
  approved: boolean;
  targetGuidelineIds: string[];
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
  targetGuidelineIds: [],
  selectedThemeId: "",
  storyAnswer: "",
  locale: "ko",
  track: "SPECIAL_12YR",
};

const KEY = "ga_workspace_state";

export function useWorkspaceState() {
  const [state, setState] = useState<WorkspaceState>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load: Sync from Database
  const syncWithBackend = useCallback(async () => {
    try {
      const res = await fetch(`/api/student/profile`);
      if (!res.ok) throw new Error("Failed to sync profile");
      const data = await res.json();
      
      const approvedDoc = data.documents?.find((d: any) => d.isApproved);
      
      const patch: WorkspaceState = {
        studentId: data.userId,
        track: data.track,
        approved: !!approvedDoc,
        evaluationData: data.evaluationResult || approvedDoc?.ocrData || null,
        selectedThemeId: data.selectedThemeId || "",
        storyAnswer: data.storyAnswer || "",
        targetGuidelineIds: data.targetGuidelineIds || [],
        locale: data.locale || "ko",
      };
      
      setState(patch);
      sessionStorage.setItem(KEY, JSON.stringify(patch));
      return data;
    } catch (err) {
      console.error("Initial sync error:", err);
    }
  }, []);

  useEffect(() => {
    syncWithBackend().then(() => setReady(true));
  }, [syncWithBackend]);

  // 2. Persist to Database (Debounced)
  const persistToDb = useCallback(async (patch: Partial<WorkspaceState>) => {
    try {
      await fetch("/api/student/update-state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.error("Failed to persist state to DB:", err);
    }
  }, []);

  // 3. Unified Update Function
  const update = useCallback((patch: Partial<WorkspaceState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      
      // Update local cache for instant UI
      sessionStorage.setItem(KEY, JSON.stringify(next));
      
      // Debounced DB sync
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        persistToDb(patch);
      }, 800); // 800ms debounce to avoid spamming the DB during typing

      return next;
    });
  }, [persistToDb]);

  return { state, update, syncWithBackend, ready };
}
