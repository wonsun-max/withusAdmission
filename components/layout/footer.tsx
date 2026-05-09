"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;

  return (
    <footer style={{ 
      background: "var(--colors-surface-pearl)", 
      padding: "80px 40px", 
      borderTop: "1px solid rgba(0,0,0,0.05)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48 }}>
        <div style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: "var(--colors-ink)", borderRadius: 8, display: "grid", placeItems: "center" }}>
              <Sparkles size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "Outfit" }}>WithUs Admission</span>
          </div>
          <p style={{ color: "var(--colors-ink-muted-64)", fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
            세상에서 가장 똑똑한 AI 기반 입시 컨설턴트.<br />
            WithUs Admission은 당신의 글로벌 학업 성취와 성공을 지원합니다.
          </p>
        </div>
        
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "var(--colors-ink)" }}>Product</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            <li><Link href="/#features" style={{ textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 14 }}>Features</Link></li>
            <li><Link href="/universities" style={{ textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 14 }}>Universities</Link></li>
            <li><Link href="/pricing" style={{ textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 14 }}>Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "var(--colors-ink)" }}>Legal</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            <li><Link href="/terms" style={{ textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 14 }}>Terms of Service</Link></li>
            <li><Link href="/privacy" style={{ textDecoration: "none", color: "var(--colors-ink-muted-48)", fontSize: 14 }}>Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div style={{ maxWidth: 1200, margin: "60px auto 0", paddingTop: 40, borderTop: "1px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--colors-ink-muted-24)" }}>
          © 2026 WithUs Admission. All rights reserved. Precision crafted for global academic excellence.
        </p>
      </div>
    </footer>
  );
}
