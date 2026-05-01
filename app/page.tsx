"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  FlaskConical,
  Languages,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const UNIVERSITIES = [
  "서울대학교", "연세대학교", "고려대학교", "서강대학교",
  "성균관대학교", "한양대학교", "중앙대학교", "경희대학교",
  "한국외국어대학교", "이화여자대학교", "KAIST", "POSTECH", "서울시립대학교",
];

const AGENTS = [
  {
    step: "01",
    icon: FileSearch,
    color: "#3b82f6",
    titleKo: "OCR 서류 분석",
    titleEn: "OCR Document Parser",
    descKo: "성적표 PDF를 업로드하면 AI가 원본 과목명과 점수를 자동 추출합니다. 낮은 확신도 항목은 반드시 사람이 최종 승인합니다.",
    descEn: "Upload your transcript PDF and AI extracts original subject names and scores. Low-confidence records require human approval before use.",
  },
  {
    step: "02",
    icon: FlaskConical,
    color: "#8b5cf6",
    titleKo: "스펙 평가 (의대/일반 분리)",
    titleEn: "Profile Evaluator (Medical/General)",
    descKo: "의예과·치의예·약학·수의학이 타겟이면 의대 모드, 그 외는 일반 모드로 자동 분기합니다. 강점 2개·치명적 약점 1개를 도출합니다.",
    descEn: "Auto-switches to medical mode for medical/pharmacy targets, general mode otherwise. Returns 2 strengths and 1 critical weakness.",
  },
  {
    step: "03",
    icon: Sparkles,
    color: "#10b981",
    titleKo: "동적 스토리 빌더",
    titleEn: "Interactive Story Builder",
    descKo: "AI가 3가지 스토리 테마(A/B/C)를 제안합니다. 학생이 하나를 선택하면 AI가 부족한 근거만 짧게 질문하고, 답변을 취합해 2,000자 마스터 자소서를 생성합니다.",
    descEn: "AI proposes 3 story themes. Pick one, answer the targeted follow-up, and the AI assembles a 2,000-character master essay from approved facts only.",
  },
  {
    step: "04",
    icon: ShieldCheck,
    color: "#f59e0b",
    titleKo: "대학별 맞춤 변환 + 팩트체크",
    titleEn: "University Tailoring & Fact-Check",
    descKo: "마스터 자소서를 각 대학 문항·글자수 조건에 맞게 재작성합니다. 없는 스펙을 추가했는지 자동으로 검사하며, 팩트 경고가 있으면 최종 제출이 차단됩니다.",
    descEn: "Reshapes the master essay to each university's prompt and character limit. Automatically detects invented claims. Final submit is blocked until cleared.",
  },
];

const STATS = [
  { value: "13", label: "Top SKY 목표 대학", labelEn: "Target Universities" },
  { value: "0", label: "허위 스펙 허용", labelEn: "Hallucinations Allowed" },
  { value: "2", label: "지원 언어 (한/EN)", labelEn: "Languages Supported" },
  { value: "100%", label: "팩트 기반 생성", labelEn: "Fact-Based Generation" },
];

export default function LandingPage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── TOP NAV ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          borderBottom: "1px solid var(--border)",
          background: "rgba(7,12,24,0.85)",
          backdropFilter: "blur(20px)",
          padding: "0 40px",
          height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "grid", placeItems: "center",
              fontWeight: 800, fontSize: 14, color: "#fff",
              boxShadow: "0 0 16px rgba(59,130,246,0.4)",
            }}
          >GA</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>
            Global Admission AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            style={{
              border: "1px solid var(--border)", background: "var(--surface)",
              color: "var(--muted)", borderRadius: 8, padding: "6px 12px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Languages size={14} />
            {locale === "ko" ? "English" : "한국어"}
          </button>
          <Link
            href="/b2c/workspace"
            style={{
              background: "var(--brand)", color: "#fff", borderRadius: 8,
              padding: "7px 16px", fontSize: 13, fontWeight: 700,
              boxShadow: "0 2px 12px rgba(59,130,246,0.4)",
            }}
          >
            {locale === "ko" ? "시작하기" : "Get Started"}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "15%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          border: "1px solid rgba(59,130,246,0.3)",
          background: "rgba(59,130,246,0.08)",
          borderRadius: 999, padding: "5px 14px",
          fontSize: 12, fontWeight: 700, color: "#60a5fa",
          marginBottom: 28, letterSpacing: "0.04em",
        }}>
          <Zap size={12} />
          {locale === "ko" ? "Phase 1 MVP — 12특·3특 특례 입시 SaaS" : "Phase 1 MVP — Korean Special Admission SaaS"}
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 76px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            maxWidth: 900,
            background: "linear-gradient(135deg, #f1f5f9 30%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 20,
          }}
        >
          {locale === "ko"
            ? "없는 스펙은\n만들지 않습니다"
            : "Fact-Safe\nSpecial Admission AI"}
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--muted)",
            maxWidth: 620,
            lineHeight: 1.7,
            marginBottom: 44,
          }}
        >
          {locale === "ko"
            ? "OCR 성적 추출부터 대학별 자기소개서 생성까지. AI가 4단계 파이프라인으로 사실에 근거한 특례 입시 지원서를 만들어 드립니다."
            : "From OCR transcript extraction to per-university essay generation. A 4-stage AI pipeline builds your special admission application on verified facts only."}
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/b2c/workspace"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--brand)", color: "#fff",
              borderRadius: 10, padding: "13px 28px",
              fontSize: 15, fontWeight: 700,
              boxShadow: "0 4px 24px rgba(59,130,246,0.5)",
              transition: "box-shadow 0.2s",
            }}
          >
            {locale === "ko" ? "학생 워크스페이스 시작" : "Student Workspace"}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/b2b/dashboard"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)", color: "var(--text)",
              borderRadius: 10, padding: "13px 28px",
              fontSize: 15, fontWeight: 700,
            }}
          >
            {locale === "ko" ? "컨설턴트 대시보드" : "Consultant Dashboard"}
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1,
            border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden",
            background: "var(--border)",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.value}
              style={{
                background: "var(--bg-2)",
                padding: "32px 24px", textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(36px,4vw,56px)", fontWeight: 900,
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", letterSpacing: "-0.04em", lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                {locale === "ko" ? s.label : s.labelEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI AGENT PIPELINE ── */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--brand)", textTransform: "uppercase", marginBottom: 12 }}>
            {locale === "ko" ? "AI 에이전트 파이프라인" : "AI Agent Pipeline"}
          </div>
          <h2
            style={{
              fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)",
            }}
          >
            {locale === "ko" ? "4단계로 완성되는\n특례 입시 지원서" : "4-Stage Special\nAdmission Application"}
          </h2>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.step}
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "auto 1fr" : "1fr auto",
                  gap: 32, alignItems: "center",
                  border: "1px solid var(--border)",
                  borderRadius: 16, padding: "32px 36px",
                  background: "var(--surface)",
                  backdropFilter: "blur(12px)",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at ${i % 2 === 0 ? "left" : "right"} center, ${agent.color}08 0%, transparent 60%)`,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: `${agent.color}18`,
                        border: `1px solid ${agent.color}40`,
                        display: "grid", placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} color={agent.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: agent.color, letterSpacing: "0.08em", marginBottom: 3 }}>
                        STEP {agent.step}
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" }}>
                        {locale === "ko" ? agent.titleKo : agent.titleEn}
                      </h3>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, maxWidth: 560 }}>
                    {locale === "ko" ? agent.descKo : agent.descEn}
                  </p>
                </div>
                <div
                  style={{
                    order: i % 2 === 0 ? 1 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(64px,8vw,96px)", fontWeight: 900,
                      color: `${agent.color}18`, letterSpacing: "-0.05em", lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {agent.step}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TARGET UNIVERSITIES ── */}
      <section
        style={{
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>
              {locale === "ko" ? "목표 대학 13곳" : "13 Target Universities"}
            </div>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
              {locale === "ko" ? "SKY·서성한·중경외시·이화·KAIST·POSTECH" : "SKY, 서성한, 중경외시, Ewha, KAIST, POSTECH"}
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {UNIVERSITIES.map((uni) => (
              <div
                key={uni}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 10, padding: "10px 18px",
                  fontSize: 14, fontWeight: 600, color: "var(--muted)",
                  background: "var(--surface)",
                  display: "flex", alignItems: "center", gap: 7,
                }}
              >
                <Star size={12} color="var(--brand)" fill="var(--brand)" />
                {uni}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2C vs B2B ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {locale === "ko" ? "누구를 위한 서비스인가요?" : "Who is this for?"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            {
              badge: "B2C", badgeColor: "var(--brand)",
              titleKo: "학생 개인", titleEn: "Individual Students",
              href: "/b2c/workspace",
              ctaKo: "워크스페이스 시작", ctaEn: "Start Workspace",
              features: locale === "ko"
                ? ["OCR 서류 업로드 및 검토", "스펙 평가 리포트", "A/B/C 스토리 선택", "한/영 마스터 자소서 생성", "대학별 자소서 변환"]
                : ["OCR document upload & review", "Profile evaluation report", "A/B/C story theme selection", "KO/EN master essay generation", "Per-university essay tailoring"],
            },
            {
              badge: "B2B", badgeColor: "var(--accent)",
              titleKo: "학원·국제학교 카운슬러", titleEn: "Academies & School Counselors",
              href: "/b2b/dashboard",
              ctaKo: "대시보드 보기", ctaEn: "View Dashboard",
              features: locale === "ko"
                ? ["학생 CRM 통합 관리", "팩트 경고 위험 큐", "컨설턴트 직접 첨삭", "잔여 크레딧 확인", "학원 로고 브랜드 PDF 출력"]
                : ["Student CRM management", "Fact-warning risk queue", "Consultant direct editing", "Remaining credit tracking", "Academy-branded PDF export"],
            },
          ].map((plan) => (
            <div
              key={plan.badge}
              style={{
                border: "1px solid var(--border)", borderRadius: 16,
                padding: "36px 32px", background: "var(--surface)",
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ display: "inline-flex", marginBottom: 20 }}>
                <span
                  style={{
                    background: `${plan.badgeColor}18`,
                    border: `1px solid ${plan.badgeColor}40`,
                    color: plan.badgeColor,
                    borderRadius: 999, padding: "4px 12px",
                    fontSize: 12, fontWeight: 800, letterSpacing: "0.06em",
                  }}
                >
                  {plan.badge}
                </span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {locale === "ko" ? plan.titleKo : plan.titleEn}
              </h3>
              <div style={{ display: "grid", gap: 8, margin: "20px 0", flex: 1 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--muted)" }}>
                    <CheckCircle2 size={14} color={plan.badgeColor} />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={plan.href}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: plan.badgeColor, color: "#fff",
                  borderRadius: 10, padding: "12px 20px",
                  fontSize: 14, fontWeight: 700, marginTop: 8,
                  boxShadow: `0 2px 16px ${plan.badgeColor}40`,
                }}
              >
                {locale === "ko" ? plan.ctaKo : plan.ctaEn}
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--subtle)",
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 24, height: 24, borderRadius: 6,
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "grid", placeItems: "center",
              fontWeight: 800, fontSize: 10, color: "#fff",
            }}
          >GA</div>
          <span style={{ fontWeight: 700, color: "var(--muted)" }}>Global Admission AI</span>
        </div>
        <p>Phase 1 MVP · 12특·3특 특례 입시 SaaS · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
