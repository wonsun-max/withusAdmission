import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "WithUs Admission | Global Academic Prestige",
  description: "The most advanced AI pipeline for Korean special admissions. Fact-based, prestige-driven.",
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  verification: {
    google: "HUk7Ra7LRQgPqTzTVvG-_RkpXnAnDUjsGDHPwSrBITs",
  },
};

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
          integrity="sha384-l69vYvYm7Kst7C9kZInU8pS7T1E/19g0uS1fTq/Oq2mU2qKqK8q5p1K5p2K4k5p1"
          crossOrigin="anonymous"
          onLoad={() => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
              console.log("Kakao SDK Initialized");
            }
          }}
        />
      </body>
    </html>
  );
}

declare global {
  interface Window {
    Kakao: any;
  }
}
