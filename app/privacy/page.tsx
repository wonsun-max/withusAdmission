"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: "var(--bg)", padding: "80px 24px" }}>
      <div className="mesh-bg" />
      
      <div className="container" style={{ maxWidth: 800 }}>
        <Link href="/login" className="button-modern button-secondary" style={{ marginBottom: 32, padding: "8px 16px" }}>
          <ChevronLeft size={16} />
          로그인으로 돌아가기
        </Link>

        <div className="panel pad accent-glow" style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>개인정보 처리방침</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 40 }}>최종 수정일: 2026년 5월 2일</p>

          <div className="terms-content" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>1. 개인정보의 수집 및 이용 목적</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                WithUs Admission은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul style={{ fontSize: 15, lineHeight: 1.8, marginLeft: 20, marginTop: 10 }}>
                <li>회원 가입 및 관리</li>
                <li>서비스 제공 및 계약 이행 (입시 컨설팅, AI 에세이 가이드 등)</li>
                <li>마케팅 및 광고에의 활용 (선택 동의 시)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>2. 수집하는 개인정보의 항목</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다:<br />
                - 필수항목: 이름, 이메일 주소, 학력 사항, 성적 데이터<br />
                - 선택항목: 전화번호, 관심 대학 리스트, 부모님 연락처 (만 14세 미만인 경우 필수)
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>3. 개인정보의 보유 및 이용기간</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>4. 이용자의 권리 및 의무</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다. 만 14세 미만 아동의 경우, 법정대리인이 아동의 개인정보를 조회하거나 수정할 권리, 수집 및 이용 동의를 철회할 권리를 가집니다.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>5. 개인정보의 기술적/관리적 보호 대책</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>
                회사는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 최선을 다하고 있습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
