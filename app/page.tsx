"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-wrapper" style={{ 
      background: "var(--colors-surface-white)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Hero Section */}

      {/* Hero Section */}
      <section style={{ 
        paddingTop: 200, 
        paddingBottom: 120, 
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Decorative Background Mesh */}
        <div style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          height: 800,
          background: "radial-gradient(circle at 50% 50%, rgba(0, 102, 204, 0.08) 0%, transparent 60%)",
          zIndex: 0
        }} />

        <div className="animate-in" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,102,204,0.08)", padding: "8px 20px", borderRadius: 99, marginBottom: 32 }}>
            <Zap size={14} /> 2026 Admission Season
          </div>
          <h1 style={{ 
            fontSize: "clamp(42px, 6vw, 84px)", 
            lineHeight: 1.1, 
            marginBottom: 32,
            background: "linear-gradient(180deg, #1d1d1f 0%, #434343 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800
          }}>
            Crafting the Future <br /> of Global Admissions.
          </h1>
          <p className="lead" style={{ margin: "0 auto 56px", fontSize: "clamp(18px, 2vw, 22px)", color: "var(--colors-ink-muted-64)", lineHeight: 1.6 }}>
            WithUs Admission은 AI 기술과 입시 전문성을 결합하여 <br />
            당신의 꿈을 가장 정교한 데이터로 증명합니다.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/login" className="button primary" style={{ padding: "18px 48px", fontSize: 18 }}>
              무료로 시작하기 <ArrowRight size={20} />
            </Link>
            <button className="button outline" style={{ padding: "18px 48px", fontSize: 18 }}>
              데모 시청하기
            </button>
          </div>
        </div>
      </section>

      {/* Feature Tiles */}
      <section id="features" style={{ padding: "120px 24px", width: "100%", maxWidth: 1248, margin: "0 auto" }}>
        <div className="grid three">
          <div className="panel pad animate-in" style={{ animationDelay: "0.1s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(0,102,204,0.1)", borderRadius: 14, display: "grid", placeItems: "center", marginBottom: 28 }}>
              <ShieldCheck size={26} color="var(--colors-primary)" />
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 14 }}>Proven Facts Only</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.7, fontSize: 15 }}>
              OCR 검증을 통과한 성적과 활동만을 사용하여 자소서를 생성합니다. 신뢰할 수 없는 허위 데이터는 배제됩니다.
            </p>
          </div>
          
          <div className="panel pad animate-in" style={{ animationDelay: "0.2s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(88,86,214,0.1)", borderRadius: 14, display: "grid", placeItems: "center", marginBottom: 28 }}>
              <Zap size={26} color="var(--colors-secondary)" />
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 14 }}>AI Tailoring Engine</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.7, fontSize: 15 }}>
              단 하나의 마스터 자소서를 기반으로, 각 대학의 문항과 인재상에 완벽하게 부합하는 대학별 에세이를 자동 생성합니다.
            </p>
          </div>

          <div className="panel pad animate-in" style={{ animationDelay: "0.3s" }}>
            <div style={{ width: 48, height: 48, background: "rgba(0,0,0,0.05)", borderRadius: 14, display: "grid", placeItems: "center", marginBottom: 28 }}>
              <Globe size={26} color="var(--colors-ink)" />
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 14 }}>Bilingual Support</h3>
            <p style={{ color: "var(--colors-ink-muted-64)", lineHeight: 1.7, fontSize: 15 }}>
              한국어와 영어를 동시에 지원하는 지능형 엔진을 통해 글로벌 경쟁력을 극대화합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ 
        padding: "140px 24px", 
        textAlign: "center", 
        background: "var(--colors-surface-pearl)", 
        borderRadius: "80px 80px 0 0",
        marginTop: "auto"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 28 }}>Ready to start your journey?</h2>
          <p style={{ marginBottom: 48, color: "var(--colors-ink-muted-64)", fontSize: 18 }}>1%의 디테일이 합격을 결정합니다.</p>
          <Link href="/login" className="button primary" style={{ padding: "18px 64px", fontSize: 18 }}>
            Join WithUs Now
          </Link>
        </div>
      </section>
    </div>
  );
}
