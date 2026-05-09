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

/** Module-based navigation — fully decoupled and modular. */
const STUDENT_NAV: NavItem[] = [
  { href: "/b2c/workspace",   icon: LayoutDashboard, labelKo: "대시보드",     labelEn: "Dashboard" },
  { href: "/b2c/profile",     icon: UserCircle,      labelKo: "나의 스펙",     labelEn: "My Profile" },
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
      <Link href="/" className="app-nav-brand">
        <img src="/img/logo.png" alt="WithUs" />
        <span>WithUs</span>
      </Link>

      <nav className="app-nav-links" aria-label={mode === "student" ? "Student workspace" : "Consultant workspace"}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={14} />
              {locale === "ko" ? item.labelKo : item.labelEn}
            </Link>
          );
        })}

        {/* Cross-section shortcut */}
        {mode === "student" ? (
          <Link href="/b2b/dashboard" className="nav-link">
            <BarChart3 size={14} />
            {locale === "ko" ? "컨설턴트" : "Consultant"}
          </Link>
        ) : (
          <Link href="/b2c/workspace" className="nav-link">
            <GraduationCap size={14} />
            {locale === "ko" ? "학생" : "Student"}
          </Link>
        )}
      </nav>

      <button className="app-nav-logout" onClick={handleLogout}>
        <LogOut size={13} />
        {locale === "ko" ? "로그아웃" : "Logout"}
      </button>
    </aside>
  );
}
