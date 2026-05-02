"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, Globe, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle accidental redirects to root with auth code
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("Auth code detected on landing page, redirecting to callback...");
      const next = searchParams.get("next") || "/b2c/workspace";
      router.push(`/auth/callback?code=${code}&next=${next}`);
    }
  }, [searchParams, router]);

  return (
    <div className="landing-wrapper">
      <div className="mesh-bg" />
      
      <main className="container" style={{ paddingTop: 160 }}>
        {/* ── HERO SECTION ── */}
        <section className="hero-section" style={{ paddingBottom: 120 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="badge">
              <Sparkles size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />
              2026 Admissions Season Live
            </div>
            <h1 className="gradient-text" style={{ fontSize: "clamp(48px, 10vw, 96px)", marginBottom: 24 }}>
              Precision-Engineered<br />for Global Academic Success.
            </h1>
            <p style={{ marginTop: 24, fontSize: 20, maxWidth: 720, marginInline: "auto", color: "var(--text-muted)", lineHeight: 1.6 }}>
              The most advanced AI pipeline for Korean special admissions. <br />
              Eliminating hallucinations, verifying facts, and building winning narratives.
            </p>
            
            <div style={{ marginTop: 56, display: "flex", gap: 20, justifyContent: "center" }}>
              <Link href="/login" className="button-modern button-primary" style={{ padding: "20px 40px", fontSize: 16 }}>
                Get Started Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="button-modern button-secondary" style={{ padding: "20px 40px", fontSize: 16 }}>
                View Demo
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── TRUST SECTION ── */}
        <section style={{ 
          padding: "48px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
          textAlign: "center", display: "flex", justifyContent: "center", gap: 64, opacity: 0.5, fontSize: 14, fontWeight: 700, letterSpacing: "0.2em"
        }}>
          <span>SNU</span>
          <span>YONSEI</span>
          <span>KOREA</span>
          <span>KAIST</span>
          <span>POSTECH</span>
          <span>EWHA</span>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "160px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>The Pipeline</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 18 }}>From raw transcripts to finalized submissions in 5 steps.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "OCR Review", desc: "Upload PDFs. Our Upstage AI extracts every grade and achievement with 99.9% accuracy." },
              { step: "02", title: "Branch Evaluation", desc: "Algorithm-driven SWOT analysis tailored for Medical or STEM/Humanities tracks." },
              { step: "03", title: "Story Builder", desc: "Select from curated themes. Answer deep-dive questions to generate unique evidence." },
              { step: "04", title: "Master Draft", desc: "AI generates a bilingual master essay that flows naturally and remains fact-checked." },
              { step: "05", title: "Tailoring", desc: "Final adjustment for specific university prompts with real-time fact warning resolution." }
            ].map((s, i) => (
              <div key={i} style={{ padding: 32, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 20 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.05)", marginBottom: -20 }}>{s.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <div className="feature-grid" style={{ marginBottom: 160 }}>
          {[
            {
              icon: Zap,
              title: "Proprietary AI Pipeline",
              desc: "Not just a wrapper. We use a multi-stage orchestration that separates facts from creative narrative."
            },
            {
              icon: Shield,
              title: "Zero Hallucination",
              desc: "Our engine is blocked from generating unsupported claims. Everything is cross-referenced with your OCR data."
            },
            {
              icon: Globe,
              title: "Global Compliance",
              desc: "Supports 12-year and 3-year overseas special admission tracks for Korea's top 13 universities."
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card"
              style={{ padding: 48 }}
            >
              <f.icon size={32} color="var(--brand)" style={{ marginBottom: 32 }} />
              <h3 style={{ fontSize: 24, marginBottom: 16 }}>{f.title}</h3>
              <p style={{ fontSize: 16, color: "var(--text-muted)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <section style={{ paddingBottom: 160, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              padding: "100px 40px", background: "radial-gradient(circle at center, #111, #000)", 
              border: "1px solid var(--border)", borderRadius: 32, position: "relative", overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--brand), transparent)" }} />
            <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 32 }}>Ready to secure your future?</h2>
            <Link href="/login" className="button-modern button-primary" style={{ padding: "20px 64px", fontSize: 18 }}>
              Enter Workspace
              <ChevronRight size={20} style={{ marginLeft: 8 }} />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
