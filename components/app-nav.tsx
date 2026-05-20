"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  BarChart3,
  Download,
  FileSearch,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
  Target,
  UserCircle,
} from "lucide-react";

type NavMode = "student" | "consultant";

type NavItem = {
  href: string;
  icon: React.ElementType;
  labelKo: string;
  labelEn: string;
};

const STUDENT_NAV: NavItem[] = [
  { href: "/b2c/workspace",   icon: LayoutDashboard, labelKo: "대시보드",     labelEn: "Dashboard" },
  { href: "/b2c/profile",     icon: UserCircle,      labelKo: "나의 스펙",     labelEn: "My Profile" },
  { href: "/b2c/chat",        icon: MessageCircle,   labelKo: "AI 상담",      labelEn: "AI Chat" },
  { href: "/b2c/ocr",         icon: FileSearch,      labelKo: "서류 검토",     labelEn: "OCR Review" },
  { href: "/b2c/universities",icon: Target,          labelKo: "목표 대학",     labelEn: "Universities" },
  { href: "/b2c/evaluation",  icon: FlaskConical,    labelKo: "스펙 분석",     labelEn: "Evaluation" },
  { href: "/b2c/story",       icon: Sparkles,        labelKo: "스토리",       labelEn: "Story" },
  { href: "/b2c/draft",       icon: PenLine,         labelKo: "자소서 초안",   labelEn: "Master Draft" },
  { href: "/b2c/tailoring",   icon: ShieldCheck,     labelKo: "대학별 변환",   labelEn: "Tailoring" },
];

const CONSULTANT_NAV: NavItem[] = [
  { href: "/b2b/dashboard", icon: LayoutDashboard, labelKo: "대시보드",       labelEn: "Dashboard" },
  { href: "/b2b/students",  icon: Users,           labelKo: "학생 CRM",      labelEn: "Student CRM" },
  { href: "/b2b/export",    icon: Download,        labelKo: "PDF 리포트",    labelEn: "PDF Export" },
];

type Props = { mode: NavMode; locale?: "ko" | "en" };

/**
 * AppNav Component.
 * The persistent side navigation bar for the WithUs Admission system.
 * Supports both Student (B2C) and Consultant (B2B) modes with localizable navigation links.
 * 
 * @param {Props} props - Component props.
 * @param {"student" | "consultant"} props.mode - The navigation mode dashboard context.
 * @param {"ko" | "en"} [props.locale="ko"] - The preferred language locale for rendering labels.
 * @returns {JSX.Element} The rendered navigation sidebar.
 */
export function AppNav({ mode, locale = "ko" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = mode === "student" ? STUDENT_NAV : CONSULTANT_NAV;

  return (
    <aside className="sidebar">
      <Link href="/" className="app-nav-brand" style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        padding: "0 12px", 
        marginBottom: 48, 
        textDecoration: "none",
        color: "var(--colors-ink)"
      }}>
        <div style={{ width: 34, height: 34, background: "var(--colors-ink)", borderRadius: 8, display: "grid", placeItems: "center" }}>
          <Sparkles size={20} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "Outfit" }}>WithUs</span>
      </Link>

      <nav className="app-nav-links" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: "var(--rounded-md)",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--colors-primary)" : "var(--colors-ink-muted-64)",
                background: isActive ? "rgba(0, 102, 204, 0.06)" : "transparent",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={18} />
              {locale === "ko" ? item.labelKo : item.labelEn}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "0 12px" }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 24, marginBottom: 24 }}>
          {mode === "student" ? (
            <Link href="/b2b/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 13 }}>
              <BarChart3 size={16} />
              {locale === "ko" ? "컨설턴트 모드" : "Consultant Mode"}
            </Link>
          ) : (
            <Link href="/b2c/workspace" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 13 }}>
              <GraduationCap size={16} />
              {locale === "ko" ? "학생 모드" : "Student Mode"}
            </Link>
          )}
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            background: "transparent", 
            border: "none", 
            color: "#ff3b30", 
            cursor: "pointer", 
            fontSize: 14,
            fontWeight: 600,
            padding: "8px 4px"
          }}
        >
          <LogOut size={18} />
          {locale === "ko" ? "로그아웃" : "Logout"}
        </button>
      </div>

      <style jsx>{`
        .nav-link:hover {
          background: rgba(0, 0, 0, 0.03);
          color: var(--colors-ink) !important;
        }
      `}</style>
    </aside>
  );
}
