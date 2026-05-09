"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-wrapper" style={{ background: "var(--colors-surface-white)" }}>
      {/* Premium Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        zIndex: 1000
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--colors-ink)", borderRadius: 8, display: "grid", placeItems: "center" }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "Outfit" }}>WithUs Admission</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="#features" style={{ fontSize: 14, fontWeight: 500, color: "var(--colors-ink-muted-64)", textDecoration: "none" }}>Features</Link>
          <Link href="/login" className="button primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        paddingTop: 160, 
        paddingBottom: 100, 
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Background Mesh */}
        <div style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120%",
          height: 600,
          background: "radial-gradient(circle at 50% 50%, rgba(0, 102, 204, 0.05) 0%, transparent 70%)",
          zIndex: -1
        }} />

        <div className="animate-in" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,102,204,0.08)", padding: "6px 16px", borderRadius: 99, marginBottom: 24 }}>
            <Zap size={14} /> 2026 Admission Season
          </div>
          <h1 style={{ 
            fontSize: "clamp(48px, 6vw, 84px)", 
            lineHeight: 1.05, 
            marginBottom: 32,
            background: "linear-gradient(180deg, #1d1d1f 0%, #434343 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Crafting the Future <br /> of Global Admissions.
          </h1>
          <p className="lead" style={{ margin: "0 auto 48px", fontSize: 22 }}>
            WithUs Admission은 AI 기술과 입시 전문성을 결합하여 <br />
            당신의 꿈을 가장 정교한 데이터로 증명합니다.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Link href="/login" className="button primary" style={{ padding: "16px 40px", fontSize: 17 }}>
              무료로 시작하기 <ArrowRight size={18} />
            </Link>
            <button className="button outline" style={{ padding: "16px 40px", fontSize: 17 }}>
              데모 시청하기
            </button>
          </div>
        </div>
      </section>

      {/* Feature Tiles */}
      <section id="features" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="grid three">
          <div className="panel pad animate-in" style={{ animationDelay: "0.1s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(0,102,204,0.1)", borderRadius: 12, display: "grid", placeItems: "center", marginBottom: 24 }}>
              <ShieldCheck size={24} color="var(--colors-primary)" />
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>Proven Facts Only</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.6 }}>
              OCR 검증을 통과한 성적과 활동만을 사용하여 자소서를 생성합니다. 신뢰할 수 없는 허위 데이터는 배제됩니다.
            </p>
          </div>
          
          <div className="panel pad animate-in" style={{ animationDelay: "0.2s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(88,86,214,0.1)", borderRadius: 12, display: "grid", placeItems: "center", marginBottom: 24 }}>
              <Zap size={24} color="var(--colors-secondary)" />
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>AI Tailoring Engine</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.6 }}>
              단 하나의 마스터 자소서를 기반으로, 각 대학의 문항과 인재상에 완벽하게 부합하는 13개 대학별 에세이를 자동 생성합니다.
            </p>
          </div>

          <div className="panel pad animate-in" style={{ animationDelay: "0.3s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(0,0,0,0.05)", borderRadius: 12, display: "grid", placeItems: "center", marginBottom: 24 }}>
              <Globe size={24} color="var(--colors-ink)" />
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>Bilingual Support</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.6 }}>
              한국어와 영어를 동시에 지원하는 지능형 번역 및 감수 엔진을 통해 글로벌 경쟁력을 극대화합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer-like bottom area */}
      <section style={{ padding: "100px 40px", textAlign: "center", background: "var(--colors-surface-pearl)", borderRadius: "64px 64px 0 0" }}>
        <h2 style={{ fontSize: 40, marginBottom: 24 }}>Ready to start your journey?</h2>
        <p style={{ marginBottom: 40, color: "var(--colors-ink-muted-64)" }}>1%의 디테일이 합격을 결정합니다.</p>
        <Link href="/login" className="button primary" style={{ padding: "16px 48px" }}>
          Join WithUs Now
        </Link>
      </section>
    </div>
  );
}
