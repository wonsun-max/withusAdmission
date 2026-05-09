"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/b2c/workspace");
    setIsLoading(false);
  };

  return (
    <div className="login-wrapper" style={{ 
      minHeight: "100vh", 
      display: "grid", 
      placeItems: "center", 
      background: "var(--colors-surface-pearl)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Blur Background */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        background: "rgba(0, 102, 204, 0.05)",
        borderRadius: 999,
        filter: "blur(120px)",
        top: "-10%",
        right: "-10%",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        background: "rgba(88, 86, 214, 0.05)",
        borderRadius: 999,
        filter: "blur(80px)",
        bottom: "-5%",
        left: "-5%",
        zIndex: 0
      }} />

      <div className="panel pad animate-in" style={{ width: "100%", maxWidth: 440, zIndex: 1, position: "relative" }}>
        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: "var(--colors-ink)", 
            borderRadius: 16, 
            display: "grid", 
            placeItems: "center", 
            margin: "0 auto 24px" 
          }}>
            <Sparkles size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: "var(--colors-ink-muted-64)", fontSize: 15 }}>WithUs Admission에 오신 것을 환영합니다.</p>
        </header>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="field">
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--colors-ink-muted-80)" }}>Email Address</label>
            <input 
              type="email" 
              className="input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1.5px solid var(--colors-ink-muted-24)",
                fontSize: 15,
                transition: "all 0.2s ease",
                outline: "none"
              }}
            />
          </div>
          <div className="field">
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--colors-ink-muted-80)" }}>Password</label>
            <input 
              type="password" 
              className="input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1.5px solid var(--colors-ink-muted-24)",
                fontSize: 15,
                transition: "all 0.2s ease",
                outline: "none"
              }}
            />
          </div>

          <button className="button primary" disabled={isLoading} style={{ width: "100%", height: 52, marginTop: 12 }}>
            {isLoading ? <Loader2 className="spin" size={18} /> : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <footer style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "var(--colors-ink-muted-48)" }}>
          Don't have an account? <span style={{ color: "var(--colors-primary)", fontWeight: 600, cursor: "pointer" }}>Contact Support</span>
        </footer>
      </div>

      <style jsx>{`
        input:focus {
          border-color: var(--colors-primary) !important;
          box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }
      `}</style>
    </div>
  );
}
