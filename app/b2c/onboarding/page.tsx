"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const track = formData.get("track") as string;

    try {
      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, track }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/b2c/workspace");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--surface)",
          padding: 40,
          borderRadius: 24,
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome to WITHUS Admission</h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>
          Before we begin building your master essay, we need a few details to tailor the pipeline for you.
        </p>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: 12, borderRadius: 8, marginBottom: 24, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label htmlFor="fullName" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--muted)" }}>
              Full Name (Legal Name)
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="e.g. Hong Gildong"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text)", fontSize: 15, outline: "none"
              }}
            />
          </div>

          <div>
            <label htmlFor="track" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--muted)" }}>
              Admission Track
            </label>
            <div style={{ position: "relative" }}>
              <select
                id="track"
                name="track"
                required
                defaultValue=""
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text)", fontSize: 15, outline: "none",
                  appearance: "none", cursor: "pointer"
                }}
              >
                <option value="" disabled>Select your track...</option>
                <option value="SPECIAL_12YR">12-Year Overseas (12년 특례)</option>
                <option value="SPECIAL_3YR">3-Year Overseas (3년 특례)</option>
              </select>
              <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>
                ▼
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: "100%", padding: "14px", borderRadius: 12,
              background: "var(--accent)", color: "#fff",
              fontWeight: 600, fontSize: 15, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.2s"
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Continue to Workspace"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
