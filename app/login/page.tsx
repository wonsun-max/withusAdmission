"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * 로그인 페이지 — Google OAuth 전용.
 *
 * Why: Supabase OAuth는 세션 토큰을 쿠키로 관리해 SSR/RSC에서도 안전하게
 * 유저 정보를 읽을 수 있고, 별도 비밀번호 관리가 필요 없어 UX가 훨씬 깔끔합니다.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      alert("로그인 중 오류가 발생했습니다: " + error.message);
      setIsLoading(false);
    }
    // 성공 시 Google로 리다이렉트되므로 setIsLoading 불필요
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "var(--colors-surface-pearl)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* 배경 글로우 */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        background: "rgba(0, 102, 204, 0.06)", borderRadius: 999,
        filter: "blur(140px)", top: "-15%", right: "-10%", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500,
        background: "rgba(88, 86, 214, 0.05)", borderRadius: 999,
        filter: "blur(100px)", bottom: "-10%", left: "-10%", zIndex: 0,
      }} />

      <div className="panel animate-in" style={{
        width: "100%", maxWidth: 440, zIndex: 1, position: "relative",
        padding: "48px 40px", borderRadius: 24,
      }}>
        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg, #0066cc, #5856d6)",
            borderRadius: 18, display: "grid", placeItems: "center",
            margin: "0 auto 24px", fontSize: 28, boxShadow: "0 8px 32px rgba(0, 102, 204, 0.25)",
          }}>
            🎓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.02em", color: "var(--colors-ink)" }}>
            WithUs Admission
          </h1>
          <p style={{ color: "var(--colors-ink-muted-64)", fontSize: 15, lineHeight: 1.6 }}>
            재외국민 특례 입시 AI 어드바이저<br />
            <span style={{ fontSize: 13 }}>Google 계정으로 1초 만에 시작하세요</span>
          </p>
        </div>

        {/* 구분선 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--colors-ink-muted-24)" }} />
          <span style={{ fontSize: 12, color: "var(--colors-ink-muted-48)", fontWeight: 500 }}>소셜 로그인</span>
          <div style={{ flex: 1, height: 1, background: "var(--colors-ink-muted-24)" }} />
        </div>

        {/* Google 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          id="google-login-btn"
          style={{
            width: "100%", height: 54, borderRadius: 14,
            border: "1.5px solid var(--colors-ink-muted-24)",
            background: "var(--colors-surface-white)",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12, cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: 15, fontWeight: 600, color: "var(--colors-ink)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = "#4285f4";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(66, 133, 244, 0.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--colors-ink-muted-24)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isLoading ? (
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "2px solid var(--colors-ink-muted-24)",
              borderTopColor: "#4285f4",
              animation: "spin 0.8s linear infinite",
            }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.6-5 7.3v6h8.1c4.8-4.4 7.2-10.9 7.2-17.4z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.2 1.5-5 2.3-7.8 2.3-6 0-11.1-4-12.9-9.5H2.8v6.2C6.8 42.6 14.8 48 24 48z"/>
              <path fill="#FBBC05" d="M11.1 29c-.5-1.5-.8-3-.8-4.5s.3-3.1.8-4.5v-6.2H2.8C1 17.2 0 20.5 0 24s1 6.8 2.8 9.2l8.3-4.2z"/>
              <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.8 30.5.5 24 .5 14.8.5 6.8 5.9 2.8 14l8.3 6.2C12.9 13.5 18 9.5 24 9.5z"/>
            </svg>
          )}
          {isLoading ? "로그인 중..." : "Google로 계속하기"}
        </button>

        {/* 안내문 */}
        <p style={{
          marginTop: 28, textAlign: "center", fontSize: 12,
          color: "var(--colors-ink-muted-48)", lineHeight: 1.7,
        }}>
          로그인 시 <span style={{ textDecoration: "underline", cursor: "pointer" }}>이용약관</span> 및{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>개인정보 처리방침</span>에 동의하게 됩니다.
        </p>

        {/* 기능 미리보기 */}
        <div style={{
          marginTop: 32, padding: "20px", background: "var(--colors-surface-pearl)",
          borderRadius: 14, display: "flex", flexDirection: "column", gap: 10,
        }}>
          {[
            { icon: "🧠", text: "AI 스펙 분석 — 모든 서류를 자동 파싱" },
            { icon: "🏛️", text: "13개 대학 입학사정관 AI 챗봇" },
            { icon: "✍️", text: "2026 모집요강 기반 자소서 자동 생성" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--colors-ink-muted-64)" }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
