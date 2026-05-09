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
      <Link href="/" className="app-nav-brand">
        <img src="/img/logo.png" alt="WithUs Admission" />
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
