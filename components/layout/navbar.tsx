"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  // Internal dashboard/login pages use their own specialized nav (AppNav)
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      zIndex: 1000,
      padding: "0 24px"
    }}>
      <div style={{ width: "100%", maxWidth: 1200, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--colors-ink)" }}>
          <div style={{ width: 32, height: 32, background: "var(--colors-ink)", borderRadius: 8, display: "grid", placeItems: "center" }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "Outfit" }}>WithUs Admission</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/#features" style={{ fontSize: 14, fontWeight: 500, color: "var(--colors-ink-muted-64)", textDecoration: "none" }}>Features</Link>
          <Link href="/login" className="button primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
