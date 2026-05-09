"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div
      className="app-shell"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-section) var(--spacing-lg)",
        background: "var(--colors-canvas)",
      }}
    >
      <div
        className="panel pad"
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "var(--spacing-xxl) var(--spacing-xl)",
        }}
      >
        <h1 style={{ fontSize: 28, lineHeight: 1.14, marginBottom: 8 }}>
          Welcome to WithUs
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.47, marginBottom: "var(--spacing-xl)" }}>
          입시 파이프라인을 시작하기 전에 기본 정보를 입력해주세요.
        </p>

        {error && (
          <div
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--rounded-sm)",
              border: "1px solid var(--colors-hairline)",
              background: "var(--colors-surface-pearl)",
              color: "var(--colors-ink)",
              fontSize: 14,
              marginBottom: "var(--spacing-lg)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="fullName">이름 (법적 이름)</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="예: 홍길동"
            />
          </div>

          <div className="field">
            <label htmlFor="track">입학 트랙</label>
            <select id="track" name="track" required defaultValue="">
              <option value="" disabled>
                트랙을 선택하세요...
              </option>
              <option value="SPECIAL_12YR">12년 특례 (12-Year Overseas)</option>
              <option value="SPECIAL_3YR">3년 특례 (3-Year Overseas)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {loading ? <Loader2 className="spin" size={18} /> : "워크스페이스로 이동"}
          </button>
        </form>
      </div>
    </div>
  );
}
