"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Languages
} from "lucide-react";

const UNIVERSITIES = [
  "SNU", "Yonsei", "Korea", "Sogang", "SKKU", "Hanyang", "CAU", "Kyung Hee", "HUFS", "Ewha", "KAIST", "POSTECH"
];

const STAGES = [
  {
    id: "01",
    titleKo: "정밀 서류 추출",
    titleEn: "Precision Extraction",
    descKo: "Upstage Document AI 기술을 활용하여 성적표의 오차 없는 데이터를 확보합니다.",
    descEn: "Zero-error transcript parsing via Upstage Document AI.",
  },
  {
    id: "02",
    titleKo: "심층 역량 평가",
    titleEn: "Deep Evaluation",
    descKo: "의대 지망생을 위한 전용 로직을 포함하여, 학생의 경쟁 우위를 입체적으로 분석합니다.",
    descEn: "Multi-dimensional analysis with specialized medical branch logic.",
  },
  {
    id: "03",
    titleKo: "스토리 아키텍처",
    titleEn: "Story Architecture",
    descKo: "검증된 사실만을 재료로 하여, 합격 가능성이 가장 높은 3가지 서사를 제안합니다.",
    descEn: "Architecting 3 high-impact narratives using only verified facts.",
  },
  {
    id: "04",
    titleKo: "대학별 최적화",
    titleEn: "University Tailoring",
    descKo: "각 대학의 평가 기준에 맞춰 문장을 정제하며, 허위 기재를 원천 차단합니다.",
    descEn: "Refining tone for each university while blocking unsupported claims.",
  }
];

export default function LandingPage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  return (
    <div className="landing-root">
      <div className="hero-bg" />
      
      {/* ── PRESTIGE NAV ── */}
      <nav className="landing-nav" style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 48px",
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="brand-mark">GA</div>
          <span className="heading-premium" style={{ fontSize: 18, fontWeight: 700 }}>WithUs Admission</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <button
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            className="btn-premium btn-secondary"
            style={{ padding: "8px 16px" }}
          >
            <Languages size={14} />
            {locale === "ko" ? "EN" : "KO"}
          </button>
          <Link href="/login" className="btn-premium btn-primary">
            {locale === "ko" ? "시작하기" : "Get Started"}
          </Link>
        </div>
      </nav>

      <main className="landing-container">
        {/* ── CINEMATIC HERO ── */}
        <section className="landing-hero" style={{ 
          paddingTop: 180, paddingBottom: 100, textAlign: "center"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 16 }}>
              The Future of Global Admission
            </div>
            <h1 className="heading-premium gradient-text" style={{ 
              fontSize: "clamp(48px, 8vw, 92px)", 
              lineHeight: 1, 
              marginBottom: 32 
            }}>
              {locale === "ko" ? "당신의 사실이\n최고의 서사가 되도록" : "Your Truth,\nOur Masterpiece"}
            </h1>
            <p className="lead" style={{ margin: "0 auto 48px", fontSize: 18, opacity: 0.8 }}>
              {locale === "ko" 
                ? "없는 스펙을 만들지 않습니다. 검증된 사실만을 바탕으로 가장 권위 있는 입시 지원서를 설계합니다." 
                : "We don't invent achievements. We architect the most prestigious applications using only verified truths."}
            </p>
            
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <Link href="/login" className="btn-premium btn-primary" style={{ padding: "18px 40px", fontSize: 16 }}>
                {locale === "ko" ? "워크스페이스 입장" : "Enter Workspace"}
                <ChevronRight size={18} />
              </Link>
              <Link href="/b2b/dashboard" className="btn-premium btn-secondary" style={{ padding: "18px 40px", fontSize: 16 }}>
                {locale === "ko" ? "컨설턴트용 대시보드" : "Consultant Access"}
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── TRUST BAR ── */}
        <section style={{ padding: "40px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, opacity: 0.5 }}>
            {UNIVERSITIES.map(uni => (
              <span key={uni} className="heading-premium" style={{ fontSize: 14, fontWeight: 600 }}>{uni}</span>
            ))}
          </div>
        </section>

        {/* ── CORE PILLARS ── */}
        <section style={{ padding: "120px 0" }}>
          <div className="grid two" style={{ gap: 80, alignItems: "center" }}>
            <div>
              <h2 className="heading-premium" style={{ fontSize: 48, marginBottom: 24 }}>
                {locale === "ko" ? "AI가 설계하고\n인간이 신뢰하는 시스템" : "Engineered by AI,\nTrusted by Humans"}
              </h2>
              <div className="insight-list">
                <div className="insight">
                  <Lock size={18} color="var(--gold)" />
                  <div>
                    <strong>{locale === "ko" ? "할루시네이션 원천 차단" : "Zero Hallucination"}</strong>
                    <p>{locale === "ko" ? "입시 서류에 없는 내용은 단 한 문장도 생성하지 않습니다." : "Not a single sentence is generated without factual evidence."}</p>
                  </div>
                </div>
                <div className="insight">
                  <Globe size={18} color="var(--brand)" />
                  <div>
                    <strong>{locale === "ko" ? "글로벌 스탠다드" : "Global Standard"}</strong>
                    <p>{locale === "ko" ? "12년 특례 및 3년 특례 입시의 모든 복잡한 규정을 준수합니다." : "Full compliance with all complex special admission regulations."}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid two" style={{ gap: 20 }}>
              {STAGES.map((stage, i) => (
                <motion.div 
                  key={stage.id}
                  whileHover={{ y: -5 }}
                  className="feature-card" 
                  style={{ padding: 32 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>PHASE {stage.id}</div>
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>{locale === "ko" ? stage.titleKo : stage.titleEn}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{locale === "ko" ? stage.descKo : stage.descEn}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ padding: "100px 0", textAlign: "center" }}>
          <div className="glass-panel" style={{ padding: "80px 40px", borderRadius: 40, border: "1px solid var(--gold-glow)" }}>
            <Sparkles size={40} color="var(--gold)" style={{ margin: "0 auto 24px" }} />
            <h2 className="heading-premium" style={{ fontSize: 42, marginBottom: 24 }}>
              {locale === "ko" ? "입시의 새로운 기준을 만나보세요" : "Set a New Standard for Your Future"}
            </h2>
            <Link href="/login" className="btn-premium btn-primary" style={{ padding: "20px 60px", fontSize: 18 }}>
              {locale === "ko" ? "지금 무료로 시작하기" : "Start for Free"}
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: "60px 24px", textAlign: "center", borderTop: "1px solid var(--border)", marginTop: 100 }}>
        <p style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} WITHUS ADMISSION. ALL RIGHTS RESERVED. ACADEMIC INTEGRITY FIRST.
        </p>
      </footer>

      <style jsx>{`
        .landing-root {
          color: var(--text-main);
        }
        .brand-mark {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: var(--gold);
          color: var(--bg-core);
          display: grid; place-items: center;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
