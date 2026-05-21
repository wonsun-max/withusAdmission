"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app-nav.module.css";

const NAV_ITEMS = [
  { href: "/spec", icon: "🧬", label: "나의 스펙" },
  { href: "/universities", icon: "🎓", label: "목표 대학" },
] as const;

/** 단순화된 앱 네비게이션 — 스펙 / 목표 대학 2개만 */
export default function AppNav() {
  const pathname = usePathname();

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

      <div className={styles.footer}>
        <div className={styles.footerText}>Powered by AI</div>
      </div>
    </nav>
  );
}
