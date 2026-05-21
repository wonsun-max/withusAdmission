import type { Metadata } from "next";
import "./globals.css";
import AppNav from "@/components/app-nav";

export const metadata: Metadata = {
  title: "withus Admission",
  description: "AI 기반 한국 특례입시 자소서 & 스펙 분석 플랫폼",
  icons: { icon: "/img/logo.png", apple: "/img/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <AppNav />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
