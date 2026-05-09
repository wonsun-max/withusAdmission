"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_APP_URL || // Set this to your site URL in production
      process?.env?.NEXT_PUBLIC_VERCEL_URL || // Automatically set by Vercel
      window.location.origin;
    
    // Make sure to include `https://` when not localhost
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to include a trailing slash
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };

  const handleGoogleLogin = async () => {
    const redirectTo = `${getURL()}auth/callback`;
    console.log("Google login initiated, redirecting to:", redirectTo);
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        console.log("Redirecting to Google Auth URL...");
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      alert(error.message || "Google 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    const redirectTo = `${getURL()}auth/callback`;
    console.log("Kakao login initiated, redirecting to:", redirectTo);
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo,
        },
      });

      if (error) throw error;

      if (data?.url) {
        console.log("Redirecting to Kakao Auth URL...");
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Kakao login error:", error);
      alert(error.message || "카카오 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div className="panel pad" style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <img
          src="/img/logo.png"
          alt="WithUs Admission"
          style={{ width: 92, height: 92, margin: "0 auto 32px", borderRadius: 18, filter: "drop-shadow(var(--shadow-product))" }}
        />
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>WithUs Admission</h1>
        <p className="lead" style={{ fontSize: 17, lineHeight: 1.47, margin: "0 auto 32px" }}>
          승인된 사실만으로 입시 서류와 자소서를 만드는 워크스페이스입니다.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button 
            type="button"
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="button"
            style={{ 
              width: "100%", 
              minHeight: 44,
              color: "var(--colors-ink)",
              borderColor: "var(--colors-hairline)"
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
            Google로 계속하기
          </button>

          <button 
            type="button"
            onClick={handleKakaoLogin} 
            disabled={loading}
            className="button primary"
            style={{ 
              width: "100%", 
              minHeight: 44
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C6.477 3 2 6.48 2 10.791C2 13.539 3.738 15.954 6.353 17.388L5.249 21.432C5.19 21.651 5.437 21.821 5.617 21.691L10.384 18.256C10.908 18.328 11.448 18.366 12 18.366C17.523 18.366 22 14.886 22 10.575C22 6.264 17.523 3.195 12 3Z" fill="currentColor"/>
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p style={{ marginTop: 24, fontSize: 12, lineHeight: 1.5 }}>
          로그인 시 <Link href="/terms" style={{ textDecoration: "underline", color: "inherit" }}>서비스 약관</Link> 및 <Link href="/privacy" style={{ textDecoration: "underline", color: "inherit" }}>개인정보 처리방침</Link>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
