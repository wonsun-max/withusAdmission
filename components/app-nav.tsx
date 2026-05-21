"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User as UserIcon } from "lucide-react";
import styles from "./app-nav.module.css";

const NAV_ITEMS = [
  { href: "/spec", icon: "🧬", label: "나의 스펙" },
  { href: "/universities", icon: "🎓", label: "목표 대학" },
] as const;

/**
 * 🎓 WithUs Admission 통합 내비게이션 바.
 *
 * Why: 사용자가 현재 어떤 계정으로 로그인되어 있는지 직관적으로 보여주고,
 * 언제든지 안전하게 로그아웃(세션 만료)할 수 있도록 하단에 프로필 섹션을 제공합니다.
 */
export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();

    // 실시간 세션 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // 이름 첫 글자로 프로필 아바타 생성
  const getAvatarChar = () => {
    if (!user) return "👤";
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
    return typeof name === "string" ? name.charAt(0).toUpperCase() : "👤";
  };

  const getDisplayName = () => {
    if (!user) return "학생";
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "학생";
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>W</div>
        <span className={styles.logoText}>withus</span>
      </div>

      <div className={styles.navItems}>
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${active ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
              {active && <div className={styles.activeBar} />}
            </Link>
          );
        })}
      </div>

      {/* 하단 사용자 프로필 & 로그아웃 섹션 */}
      {user && !isLoading && (
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>{getAvatarChar()}</div>
            <div className={styles.info}>
              <span className={styles.name}>{getDisplayName()}</span>
              <span className={styles.email}>{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className={styles.logoutButton}
            title="Sign Out"
          >
            <LogOut size={15} />
            <span>로그아웃</span>
          </button>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.footerText}>Powered by AI</div>
      </div>
    </nav>
  );
}
