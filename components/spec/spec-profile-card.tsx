"use client";

import type { SpecAnalysisResult } from "@/lib/admission-types";
import styles from "./spec-profile-card.module.css";

interface Props {
  result: SpecAnalysisResult;
}

/** Renders the full AI-analyzed student profile after document upload. */
export default function SpecProfileCard({ result }: Props) {
  const { persona, academic, activities, awards, tests, residency, personalInfo } = result;

  return (
    <div className={styles.root}>
      {/* ── Hero: Persona ── */}
      <div className={styles.hero}>
        <div className={styles.personaBadge}>입시 페르소나</div>
        <h2 className={styles.personaTitle}>{persona?.title ?? "종합 분석 완료"}</h2>
        <p className={styles.personaSummary}>{persona?.summary}</p>
        <div className={styles.tags}>
          {persona?.interests?.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {/* ── Academic ── */}
        <Section title="🎓 학업 성적" className={styles.wide}>
          <div className={styles.academicMeta}>
            {academic?.school && <MetaItem label="학교" value={academic.school} />}
            {academic?.curriculum && <MetaItem label="교육과정" value={academic.curriculum} />}
            {academic?.currentGrade && <MetaItem label="학년" value={academic.currentGrade} />}
            {academic?.gpa && <MetaItem label="GPA" value={`${academic.gpa}${academic.gpaScale ? ` / ${academic.gpaScale}` : ""}`} />}
          </div>
          {academic?.trajectory && (
            <p className={styles.trajectory}>{academic.trajectory}</p>
          )}
          {(academic?.subjects?.length ?? 0) > 0 && (
            <div className={styles.subjectGrid}>
              {academic.subjects.map((s, i) => (
                <div key={i} className={styles.subjectItem}>
                  <div className={styles.subjectName}>{s.name}</div>
                  <div className={styles.subjectScore}>{s.score}</div>
                  {s.significance && <div className={styles.subjectNote}>{s.significance}</div>}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── Tests ── */}
        {(tests?.length ?? 0) > 0 && (
          <Section title="📊 표준화 시험">
            <div className={styles.testList}>
              {tests.map((t, i) => (
                <div key={i} className={styles.testItem}>
                  <div className={styles.testName}>{t.exam}</div>
                  <div className={styles.testScore}>{t.score}</div>
                  {t.date && <div className={styles.testDate}>{t.date}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Residency ── */}
        {residency && (
          <Section title="✈️ 해외 체류">
            <div className={styles.residencyInfo}>
              {residency.totalYears && <MetaItem label="총 체류 기간" value={residency.totalYears} />}
              {residency.countries && <MetaItem label="체류 국가" value={residency.countries.join(", ")} />}
              <div className={styles.eligibilityRow}>
                <EligBadge label="12년 특례" ok={residency.eligibility12yr} />
                <EligBadge label="3년 특례" ok={residency.eligibility3yr} />
              </div>
              {residency.notes && <p className={styles.residencyNote}>{residency.notes}</p>}
            </div>
          </Section>
        )}

        {/* ── Activities ── */}
        {(activities?.length ?? 0) > 0 && (
          <Section title="🏃 비교과 활동" className={styles.wide}>
            <div className={styles.activityList}>
              {activities.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityName}>{a.name}</span>
                    {a.role && <span className={styles.activityRole}>{a.role}</span>}
                    {a.period && <span className={styles.activityPeriod}>{a.period}</span>}
                  </div>
                  {a.impact && <p className={styles.activityImpact}>{a.impact}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Awards ── */}
        {(awards?.length ?? 0) > 0 && (
          <Section title="🏆 수상 내역">
            <div className={styles.awardList}>
              {awards.map((a, i) => (
                <div key={i} className={styles.awardItem}>
                  <div className={styles.awardName}>{a.name}</div>
                  {a.date && <div className={styles.awardDate}>{a.date}</div>}
                  {a.significance && <div className={styles.awardNote}>{a.significance}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Strengths ── */}
        {(persona?.strengths?.length ?? 0) > 0 && (
          <Section title="💪 핵심 역량">
            <ul className={styles.strengthList}>
              {persona.strengths.map((s, i) => (
                <li key={i} className={styles.strengthItem}>
                  <span className={styles.strengthDot} />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`${styles.section} ${className ?? ""}`}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  );
}

function EligBadge({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className={`${styles.eligBadge} ${ok ? styles.eligOk : ok === false ? styles.eligNo : styles.eligUnknown}`}>
      {ok === true ? "✓" : ok === false ? "✗" : "?"} {label}
    </div>
  );
}
