import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import KakaoInit from "@/components/layout/kakao-init";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <KakaoInit />
      </body>
    </html>
  );
}

declare global {
  interface Window {
    Kakao: any;
  }
}
