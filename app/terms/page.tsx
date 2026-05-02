"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: "var(--bg)", padding: "80px 24px" }}>
      <div className="mesh-bg" />
      
      <div className="container" style={{ maxWidth: 800 }}>
        <Link href="/login" className="button-modern button-secondary" style={{ marginBottom: 32, padding: "8px 16px" }}>
          <ChevronLeft size={16} />
          로그인으로 돌아가기
        </Link>

        <div className="panel pad accent-glow" style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>서비스 이용약관</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 40 }}>최종 수정일: 2026년 5월 2일</p>

          <div className="terms-content" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>제 1 조 (목적)</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                본 약관은 WithUs Admission(이하 "회사")이 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>제 2 조 (용어의 정의)</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                1. "서비스"라 함은 회사가 제공하는 입시 컨설팅, AI 에세이 가이드, 서류 관리 등의 제반 서비스를 의미합니다.<br />
                2. "이용자"라 함은 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>제 3 조 (약관의 명시와 개정)</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>제 4 조 (서비스의 제공 및 변경)</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                회사는 이용자에게 다음과 같은 서비스를 제공합니다:<br />
                - AI 기반 자기소개서 및 에세이 피드백<br />
                - 대학별 모집요강 데이터 분석 및 맞춤형 가이드<br />
                - 실시간 입시 컨설팅 지원 도구
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>제 5 조 (이용자의 의무)</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                이용자는 다음 행위를 하여서는 안 됩니다:<br />
                - 신청 또는 변경 시 허위내용의 등록<br />
                - 타인의 정보도용<br />
                - 회사가 게시한 정보의 변경<br />
                - 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
