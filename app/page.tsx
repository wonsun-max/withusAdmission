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
        {/* ── Hero: white tile, text-only (Apple services style) ── */}
        <section className="product-tile light">
          <div className="tile-inner">
            <span className="tile-kicker">
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
              2026 특례입학 시즌
            </span>
            <h1>
              승인된 사실로<br />완성하는 입시 전략.
            </h1>
            <p className="tile-tagline">
              WithUs Admission은 OCR 검증, 스펙 분석, 자소서 생성까지<br />
              하나의 워크스페이스에서 관리하는 AI 입시 파이프라인입니다.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                무료로 시작하기
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="button-modern button-secondary">
                데모 보기
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="trust-strip">
          <span>서울대</span>
          <span>연세대</span>
          <span>고려대</span>
          <span>KAIST</span>
          <span>POSTECH</span>
          <span>이화여대</span>
          <span>서강대</span>
          <span>성균관대</span>
          <span>한양대</span>
        </section>

        {/* ── Dark tile: core promise ── */}
        <section className="product-tile dark">
          <div className="tile-inner">
            <span className="tile-kicker" style={{ color: "var(--colors-primary-on-dark)" }}>
              Zero Hallucination Engine
            </span>
            <h2>AI가 만들되,<br />사실만 씁니다.</h2>
            <p className="tile-tagline">
              OCR로 추출된 데이터는 사람이 승인하기 전까지 자소서에 반영되지 않습니다.<br />
              검증되지 않은 주장이 남아있으면 최종 제출이 차단됩니다.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                워크스페이스 열기
              </Link>
              <Link href="/privacy" className="button-modern button-secondary">
                개인정보 원칙
              </Link>
            </div>
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section className="feature-grid" aria-label="Core workflow">
          {[
            {
              icon: FileCheck,
              title: "서류 → 검증된 프로필",
              desc: "성적표, 활동증빙을 업로드하면 AI가 구조화합니다. 신뢰도 낮은 항목은 사람이 승인할 때까지 에세이에 포함되지 않습니다.",
            },
            {
              icon: Shield,
              title: "팩트 기반 자소서",
              desc: "승인된 사실과 학생 답변만으로 초안을 생성합니다. 근거 없는 주장이 있으면 제출 게이트가 차단합니다.",
            },
            {
              icon: Globe,
              title: "12년 · 3년 특례 전용",
              desc: "대한민국 재외국민 특별전형 규정에 맞춘 워크스페이스. 13개 주요 대학의 요구사항을 지원합니다.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <div>
                  <Icon size={28} color="var(--colors-primary)" style={{ marginBottom: 24 }} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <Link href="/login" className="text-link" style={{ marginTop: 16 }}>
                  자세히 보기 →
                </Link>
              </article>
            );
          })}
        </section>

        {/* ── Parchment CTA tile ── */}
        <section className="product-tile parchment">
          <div className="tile-inner">
            <span className="tile-kicker">
              Target Universities
            </span>
            <h2>SKY, 서성한, 중경외시,<br />Ewha, KAIST, POSTECH.</h2>
            <p className="tile-tagline">
              프로필과 독립적으로 목표 대학을 선택하세요.<br />
              대학별 요구사항과 자소서 문항이 자동으로 연결됩니다.
            </p>
            <div className="tile-actions">
              <Link href="/login" className="button-modern button-primary">
                지금 시작하기
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
