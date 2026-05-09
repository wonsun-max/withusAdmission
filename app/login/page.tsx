"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_APP_URL ||
      process?.env?.NEXT_PUBLIC_VERCEL_URL ||
      window.location.origin;
    url = url.includes("http") ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };

  const handleGoogleLogin = async () => {
    const redirectTo = `${getURL()}auth/callback`;
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      console.error("Google login error:", error);
      alert(error.message || "Google 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    const redirectTo = `${getURL()}auth/callback`;
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: { redirectTo },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      console.error("Kakao login error:", error);
      alert(error.message || "카카오 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

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
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          padding: "var(--spacing-xxl) var(--spacing-xl)",
        }}
      >
        {/* Small logo — NOT a product render */}
        <img
          src="/img/logo.png"
          alt="WithUs Admission"
          style={{
            width: 64,
            height: 64,
            margin: "0 auto var(--spacing-xl)",
            borderRadius: "var(--rounded-lg)",
            objectFit: "contain",
          }}
        />

        <h1 style={{ fontSize: 28, lineHeight: 1.14, marginBottom: 8 }}>
          로그인
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.47, marginBottom: "var(--spacing-xl)" }}>
          승인된 사실로 입시 전략을 완성하세요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="button"
            style={{
              width: "100%",
              justifyContent: "center",
              borderColor: "var(--colors-hairline)",
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={{ width: 18, height: 18 }}
            />
            Google로 계속하기
          </button>

          {/* Kakao */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={loading}
            className="button primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C6.477 3 2 6.48 2 10.791C2 13.539 3.738 15.954 6.353 17.388L5.249 21.432C5.19 21.651 5.437 21.821 5.617 21.691L10.384 18.256C10.908 18.328 11.448 18.366 12 18.366C17.523 18.366 22 14.886 22 10.575C22 6.264 17.523 3.195 12 3Z"
                fill="currentColor"
              />
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p style={{ marginTop: "var(--spacing-lg)", fontSize: 12, lineHeight: 1.5 }}>
          로그인 시{" "}
          <Link href="/terms" style={{ textDecoration: "underline", color: "inherit" }}>
            서비스 약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" style={{ textDecoration: "underline", color: "inherit" }}>
            개인정보 처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
