"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, Globe, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <div className="mesh-bg" />
      
      {/* ── MINIMAL NAV ── */}
      <nav style={{ 
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        display: "flex", justifyContent: "center", padding: "24px 0"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#fff", borderRadius: 6 }} />
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>WithUs</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="/login" className="button-modern button-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="container">
        {/* ── HERO SECTION ── */}
        <section className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge">
              <Sparkles size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Next-Gen Admission Engine
            </div>
            <h1 className="gradient-text">
              Precision built for<br />global admission.
            </h1>
            <p style={{ marginTop: 32, maxWidth: 640, marginInline: "auto" }}>
              The most advanced AI pipeline for Korean special admissions. 
              Built on verified facts, engineered for success.
            </p>
            
            <div style={{ marginTop: 48, display: "flex", gap: 16, justifyContent: "center" }}>
              <Link href="/login" className="button-modern button-primary">
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link href="/b2b/dashboard" className="button-modern button-secondary">
                Consultant View
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── TRUST SECTION ── */}
        <section style={{ 
          padding: "40px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
          textAlign: "center", display: "flex", justifyContent: "center", gap: 48, opacity: 0.4, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em"
        }}>
          <span>SNU</span>
          <span>YONSEI</span>
          <span>KOREA</span>
          <span>KAIST</span>
          <span>POSTECH</span>
        </section>

        {/* ── FEATURES ── */}
        <div className="feature-grid">
          {[
            {
              icon: Zap,
              title: "Instant OCR Extraction",
              desc: "Automated transcript parsing with industrial-grade accuracy using Upstage AI."
            },
            {
              icon: Shield,
              title: "Fact-Safe Engine",
              desc: "Zero hallucination. Every sentence is cross-referenced with your approved records."
            },
            {
              icon: Globe,
              title: "Multi-Track Logic",
              desc: "Specialized logic for Medical, STEM, and Humanities across 12-year and 3-year tracks."
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <f.icon size={24} color="#fff" style={{ marginBottom: 24 }} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <section style={{ padding: "160px 0", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              padding: "80px 40px", background: "linear-gradient(to bottom, #111, #000)", 
              border: "1px solid var(--border)", borderRadius: 24 
            }}
          >
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 24 }}>Ready to build your narrative?</h2>
            <Link href="/login" className="button-modern button-primary" style={{ padding: "16px 48px", fontSize: 16 }}>
              Enter Workspace
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </section>
      </main>

      <footer style={{ padding: "64px 0", textAlign: "center", borderTop: "1px solid var(--border)", opacity: 0.5 }}>
        <p style={{ fontSize: 12, letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} WITHUS ADMISSION. PURE PERFORMANCE.
        </p>
      </footer>
    </div>
  );
}
