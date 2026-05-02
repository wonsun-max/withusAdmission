"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 40px" }}>
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 60, marginBottom: 60 }}>
          <div>
            <img src="/img/logo.png" alt="WithUs" style={{ height: 32, marginBottom: 24, borderRadius: 6 }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              세상에서 가장 똑똑한 AI 기반 입시 컨설턴트.<br />
              WithUs Admission은 글로벌 학업 성취를 지원합니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 16 }}>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li><Link href="/features" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>기능 소개</Link></li>
              <li><Link href="/universities" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>지원 대학</Link></li>
              <li><Link href="/pricing" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>가격 정책</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 16 }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li><Link href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>이용약관</Link></li>
              <li><Link href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>개인정보 처리방침</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            © 2026 WithUs Admission. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {/* Social links placeholder */}
          </div>
        </div>
      </div>
    </footer>
  );
}
