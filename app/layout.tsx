import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Admission AI — 12특·3특 특례 입시 SaaS",
  description:
    "AI 기반 해외 특례 입시 플랫폼. OCR 성적 추출, 스펙 평가, 자기소개서 생성까지. 없는 스펙은 만들지 않습니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
