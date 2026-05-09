"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;

  return (
    <nav className="global-nav">
      <div className="global-nav-inner">
        <Link href="/" className="global-nav-brand">
          <img src="/img/logo.png" alt="WithUs" />
          <span>WithUs Admission</span>
        </Link>

        <div className="global-nav-links">
          <Link href="/features">서비스 소개</Link>
          <Link href="/pricing">요금제</Link>
          <Link href="/login" className="button-modern button-primary" style={{ minHeight: 28, padding: "0 14px", fontSize: 12 }}>
            시작하기
          </Link>
        </div>
      </div>
    </nav>
  );
}
