"use client";

import { createClient } from "@/utils/supabase/client";
import { LogIn } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent)" }}>
      <div className="panel pad accent-glow" style={{ maxWidth: 400, width: "90%", textAlign: "center", padding: "48px 32px", borderColor: "var(--gold-glow)" }}>
        <img src="/logo.png" alt="WithUs Admission" style={{ width: "100%", marginBottom: 32, borderRadius: 12 }} />
        <p className="lead" style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 32 }}>
          세상에서 가장 똑똑한 입시 컨설턴트,<br />WithUs Admission에 로그인하세요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="button primary" 
            style={{ 
              width: "100%", 
              height: 52, 
              fontSize: 15, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 12,
              background: "#fff",
              color: "#111",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              fontWeight: 600
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
            Google로 계속하기
          </button>

          <button 
            onClick={handleKakaoLogin} 
            disabled={loading}
            style={{ 
              width: "100%", 
              height: 52, 
              fontSize: 15, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 12,
              background: "#FEE500",
              color: "#191919",
              border: "none",
              borderRadius: 8,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C6.477 3 2 6.48 2 10.791C2 13.539 3.738 15.954 6.353 17.388L5.249 21.432C5.19 21.651 5.437 21.821 5.617 21.691L10.384 18.256C10.908 18.328 11.448 18.366 12 18.366C17.523 18.366 22 14.886 22 10.575C22 6.264 17.523 3.195 12 3Z" fill="#191919"/>
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: "var(--subtle)" }}>
          로그인 시 <a href="#" style={{ textDecoration: "underline" }}>서비스 약관</a> 및 <a href="#" style={{ textDecoration: "underline" }}>개인정보 처리방침</a>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
