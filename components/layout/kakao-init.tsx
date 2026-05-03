"use client";

import Script from "next/script";

export default function KakaoInit() {
  return (
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
  );
}
