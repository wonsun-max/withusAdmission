"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Download,
  FileSearch,
  FlaskConical,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type NavMode = "student" | "consultant";

type NavItem = {
  href: string;
  icon: React.ElementType;
  labelKo: string;
  labelEn: string;
  step?: string;
};

const STUDENT_STEPS: NavItem[] = [
  { href: "/b2c/workspace",  icon: GraduationCap, labelKo: "워크스페이스 홈",   labelEn: "Workspace Hub" },
  { href: "/b2c/ocr",        icon: FileSearch,    labelKo: "Step 1 · OCR 검토",  labelEn: "Step 1 · OCR Review",     step: "01" },
  { href: "/b2c/evaluation", icon: FlaskConical,  labelKo: "Step 2 · 스펙 평가", labelEn: "Step 2 · Evaluation",      step: "02" },
  { href: "/b2c/story",      icon: Sparkles,      labelKo: "Step 3 · 스토리",    labelEn: "Step 3 · Story Builder",   step: "03" },
  { href: "/b2c/draft",      icon: PenLine,       labelKo: "Step 4 · 마스터 초안",labelEn: "Step 4 · Master Draft",   step: "04" },
  { href: "/b2c/tailoring",  icon: ShieldCheck,   labelKo: "Step 5 · 대학별 변환",labelEn: "Step 5 · Tailoring",      step: "05" },
];

const CONSULTANT_ITEMS: NavItem[] = [
  { href: "/b2b/dashboard", icon: LayoutDashboard, labelKo: "대시보드",        labelEn: "Dashboard" },
  { href: "/b2b/students",  icon: Users,           labelKo: "학생 CRM",         labelEn: "Student CRM" },
  { href: "/b2b/export",    icon: Download,        labelKo: "PDF 리포트 출력",  labelEn: "PDF Export" },
];

type Props = { mode: NavMode; locale?: "ko" | "en" };

export function AppNav({ mode, locale = "ko" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = mode === "student" ? STUDENT_STEPS : CONSULTANT_ITEMS;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand-block" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <img 
          src="/logo.png" 
          alt="WithUs Admission" 
          style={{ width: "100%", height: "auto", borderRadius: 8 }} 
        />
      </div>

      {/* Back to home */}
      <Link
        href="/"
        style={{
          display: "flex", alignItems: "center", gap: 8,
          color: "var(--subtle)", fontSize: 12, fontWeight: 600,
          padding: "6px 12px", borderRadius: 6,
          transition: "color 0.15s",
        }}
      >
        <ArrowLeft size={13} />
        {locale === "ko" ? "홈으로" : "Back to Home"}
      </Link>

      {/* Section label */}
      <div className="nav-section-label" style={{ marginTop: 12 }}>
        {mode === "student"
          ? (locale === "ko" ? "학생 워크스페이스" : "Student Workspace")
          : (locale === "ko" ? "컨설턴트 도구" : "Consultant Tools")}
      </div>

      {/* Nav items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={15} />
            {locale === "ko" ? item.labelKo : item.labelEn}
          </Link>
        );
      })}

      {/* Cross-section shortcut */}
      <div className="nav-section-label" style={{ marginTop: 12 }}>
        {mode === "student"
          ? (locale === "ko" ? "컨설턴트" : "Consultant")
          : (locale === "ko" ? "학생 (B2C)" : "Student (B2C)")}
      </div>
      {mode === "student" ? (
        <Link href="/b2b/dashboard" className="nav-link">
          <BarChart3 size={15} />
          {locale === "ko" ? "컨설턴트 대시보드" : "Consultant Dashboard"}
        </Link>
      ) : (
        <Link href="/b2c/workspace" className="nav-link">
          <GraduationCap size={15} />
          {locale === "ko" ? "학생 워크스페이스" : "Student Workspace"}
        </Link>
      )}

      <div className="sidebar-footer">
        <button 
          onClick={handleLogout}
          style={{ 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            padding: "8px 12px", 
            fontSize: 12, 
            color: "#ef4444", 
            background: "transparent", 
            border: "none", 
            cursor: "pointer",
            fontWeight: 600,
            marginBottom: 8
          }}
        >
          <LogOut size={13} />
          {locale === "ko" ? "로그아웃" : "Logout"}
        </button>
        <Building2 size={13} style={{ marginBottom: 6 }} />
        <p>Phase 1 MVP</p>
        <p style={{ marginTop: 4 }}>
          <Link href="/" style={{ color: "var(--brand)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Home size={11} />
            {locale === "ko" ? "메인 페이지" : "Main Page"}
          </Link>
        </p>
      </div>
    </aside>
  );
}
