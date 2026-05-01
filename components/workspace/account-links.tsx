"use client";

import { CheckCircle2, Link as LinkIcon, ShieldCheck } from "lucide-react";
import type { Locale, StudentProfile } from "@/lib/admission-types";

type Props = { locale: Locale; profile: StudentProfile };

const copy = {
  en: {
    title: "Account Links & Consent",
    subtitle: "Verified parents have edit access. School links added with student permission.",
    canEdit: "Can edit",
    canView: "Can view",
    approved: "Verified",
    pending: "Pending",
    consentReady: "Under-14 consent policy ready",
    manage: "Manage",
  },
  ko: {
    title: "계정 연결 및 동의",
    subtitle: "검증된 부모는 수정 가능. 학교 연결은 학생 권한으로 추가됩니다.",
    canEdit: "수정 가능",
    canView: "보기 가능",
    approved: "검증됨",
    pending: "대기 중",
    consentReady: "만 14세 미만 부모동의 정책 준비됨",
    manage: "관리",
  },
} as const;

export function AccountLinks({ locale, profile }: Props) {
  const t = copy[locale];

  return (
    <div className="panel pad">
      <div className="panel-header">
        <div>
          <h2>{t.title}</h2>
          <p className="panel-label">{t.subtitle}</p>
        </div>
        <span className="badge success">
          <ShieldCheck size={11} />
          {t.consentReady}
        </span>
      </div>

      <div className="doc-list">
        {profile.accountLinks.map((link) => (
          <div className="doc-item" key={link.id}>
            <div>
              <strong>{link.name}</strong>
              <p>
                {link.role} · {link.accessLevel === "edit" ? t.canEdit : t.canView}
              </p>
            </div>
            <div className="doc-actions">
              <span className={`badge ${link.verified ? "success" : "warning"}`}>
                {link.verified ? <CheckCircle2 size={11} /> : null}
                {link.verified ? t.approved : t.pending}
              </span>
              <button className="button icon-only" title={t.manage} style={{ minHeight: 32, width: 32 }}>
                <LinkIcon size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="insight" style={{ marginTop: 10 }}>
        <ShieldCheck size={15} color="var(--accent)" />
        <div>
          <strong>{profile.parentConsent.status}</strong>
          <p>{profile.parentConsent.requiredBecause[locale]}</p>
        </div>
      </div>
    </div>
  );
}
