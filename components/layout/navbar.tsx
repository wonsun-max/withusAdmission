"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;

  return (
    <nav 
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100, 
        height: 72, 
        display: "flex", 
        alignItems: "center", 
        padding: "0 40px",
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/img/logo.png" alt="WithUs" style={{ height: 32, borderRadius: 6 }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>WithUs Admission</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/features" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>서비스 소개</Link>
          <Link href="/pricing" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>요금제</Link>
          <Link href="/login" className="button-modern button-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            시작하기
          </Link>
        </div>
      </div>
    </nav>
  );
}
