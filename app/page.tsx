"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, FileCheck, Globe, Shield, Sparkles } from "lucide-react";

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("Auth code detected on landing page, redirecting to callback...");
      const next = searchParams.get("next") || "/b2c/workspace";
      router.push(`/auth/callback?code=${code}&next=${next}`);
    }
  }, [searchParams, router]);

  return null;
}

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <Suspense fallback={null}>
        <AuthHandler />
      </Suspense>

      <main>
        <section className="product-tile light">
          <div className="tile-inner">
            <span className="tile-kicker">2026 Admissions Season</span>
            <h1>
              WithUs Admission
            </h1>
            <p className="tile-tagline">
              Korean overseas special admission, built around approved facts.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                시작하기
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="button-modern button-secondary">
                데모 보기
              </Link>
            </div>
            <img className="product-render" src="/img/logo.png" alt="WithUs Admission" />
          </div>
        </section>

        <section className="trust-strip">
          <span>SNU</span>
          <span>YONSEI</span>
          <span>KOREA</span>
          <span>KAIST</span>
          <span>POSTECH</span>
          <span>EWHA</span>
        </section>

        <section className="product-tile dark">
          <div className="tile-inner">
            <span className="tile-kicker">Human-approved OCR</span>
            <h2>Documents become verified profile facts.</h2>
            <p className="tile-tagline">
              OCR output is reviewed before it can power evaluation, story building, or essay generation.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                서류 검토 시작
              </Link>
              <Link href="/privacy" className="button-modern button-secondary">
                개인정보 원칙
              </Link>
            </div>
          </div>
        </section>

        <section className="feature-grid" aria-label="Core workflow">
          {[
            {
              icon: FileCheck,
              title: "OCR Review",
              desc: "Upload transcripts and activity proof. Low-confidence records stay out of essays until a human approves them.",
            },
            {
              icon: Shield,
              title: "Fact-Grounded Essays",
              desc: "Drafts are generated from approved facts and bounded student answers. Unsupported claims block final submission.",
            },
            {
              icon: Globe,
              title: "3-Year and 12-Year Tracks",
              desc: "The workspace supports Korean overseas special admission rules, target schools, and medical branch evaluation.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <div>
                  <Icon size={28} color="var(--brand)" style={{ marginBottom: 24 }} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <Link href="/login" className="text-link">
                  Learn more
                </Link>
              </article>
            );
          })}
        </section>

        <section className="product-tile parchment">
          <div className="tile-inner">
            <span className="tile-kicker">
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
              Target universities
            </span>
            <h2>SKY, 서성한, 중경외시, Ewha, KAIST, POSTECH.</h2>
            <p className="tile-tagline">
              Pick schools separately from your profile. Requirements and essays should follow the selected target, not a fixed step wizard.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                워크스페이스 열기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
