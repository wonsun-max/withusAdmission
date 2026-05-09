"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isInternalPage = pathname === "/login" || pathname?.startsWith("/b2c") || pathname?.startsWith("/b2b");

  if (isInternalPage) return null;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <img src="/img/logo.png" alt="WithUs" />
            <p>
              세상에서 가장 똑똑한 AI 기반 입시 컨설턴트.<br />
              WithUs Admission은 글로벌 학업 성취를 지원합니다.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/features">기능 소개</Link></li>
              <li><Link href="/universities">지원 대학</Link></li>
              <li><Link href="/pricing">가격 정책</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">이용약관</Link></li>
              <li><Link href="/privacy">개인정보 처리방침</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-legal">
          <p>
            © 2026 WithUs Admission. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
