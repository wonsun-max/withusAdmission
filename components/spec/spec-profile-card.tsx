"use client";

import { useState } from "react";
import type { SpecAnalysisResult, AcademicSemester } from "@/lib/admission-types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Calendar, Globe, MapPin, GraduationCap, 
  Award, BookOpen, Clock, Users, Compass, ShieldCheck 
} from "lucide-react";
import styles from "./spec-profile-card.module.css";

interface Props {
  result: SpecAnalysisResult;
}

/** Renders the full AI-analyzed student profile after document upload with high granularity and premium layout. */
export default function SpecProfileCard({ result }: Props) {
  const { persona, academic, activities, volunteers = [], awards, tests, residency, personalInfo } = result;
  
  // 학년 탭 상태 관리
  const semestersData = academic?.semesters || [];
  const uniqueGrades = Array.from(new Set(semestersData.map((s) => s.grade)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const [activeGrade, setActiveGrade] = useState<string>(uniqueGrades[0] || "all");

  const filteredSemesters = semestersData.filter(
    (sem) => activeGrade === "all" || sem.grade === activeGrade
  );

  return (
    <div className={styles.root}>
      {/* ─── 👤 1. Personal Profile Header (개인 정보) ─── */}
      {personalInfo && (
        <div className={styles.personalBanner}>
          <div className={styles.personalHeader}>
            <div className={styles.personalAvatar}>
              <User size={24} color="var(--colors-primary)" />
            </div>
            <div className={styles.personalMain}>
              <h3 className={styles.studentName}>{personalInfo.name ?? "학생 프로필"}</h3>
              <p className={styles.studentMeta}>
                {academic?.school ?? "재학교 미확인"} · {academic?.curriculum ?? "교육과정 미확인"}
              </p>
            </div>
          </div>

          <div className={styles.personalGrid}>
            <div className={styles.personalCard}>
              <Calendar className={styles.personalIcon} size={14} />
              <div className={styles.personalText}>
                <span className={styles.personalLabel}>생년월일</span>
                <span className={styles.personalValue}>{personalInfo.dateOfBirth ?? "—"}</span>
              </div>
            </div>
            <div className={styles.personalCard}>
              <Globe className={styles.personalIcon} size={14} />
              <div className={styles.personalText}>
                <span className={styles.personalLabel}>국적</span>
                <span className={styles.personalValue}>{personalInfo.nationality ?? "—"}</span>
              </div>
            </div>
            <div className={styles.personalCard}>
              <MapPin className={styles.personalIcon} size={14} />
              <div className={styles.personalText}>
                <span className={styles.personalLabel}>거주 국가</span>
                <span className={styles.personalValue}>{personalInfo.currentCountry ?? "—"}</span>
              </div>
            </div>
            <div className={styles.personalCard}>
              <GraduationCap className={styles.personalIcon} size={14} />
              <div className={styles.personalText}>
                <span className={styles.personalLabel}>이수 트랙</span>
                <span className={styles.personalValue}>
                  {residency?.eligibility12yr ? "12년 특례 대상" : residency?.eligibility3yr ? "3년 특례 대상" : "일반 특례/자격 검토중"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 🧬 2. Hero: Persona ─── */}
      <div className={styles.hero}>
        <div className={styles.personaBadge}>입시 브랜드 페르소나</div>
        <h2 className={styles.personaTitle}>{persona?.title ?? "종합 입시 스펙 분석"}</h2>
        <p className={styles.personaSummary}>{persona?.summary}</p>
        <div className={styles.tags}>
          {persona?.interests?.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {/* ─── 🎓 3. Academic (학업 성적 및 구체적인 교과 성취) ─── */}
        <Section title="🎓 학업 성적 및 교과 상세" className={styles.wide}>
          <div className={styles.academicMeta}>
            {academic?.school && <MetaItem label="학교" value={academic.school} />}
            {academic?.curriculum && <MetaItem label="교육과정" value={academic.curriculum} />}
            {academic?.currentGrade && <MetaItem label="학년" value={academic.currentGrade} />}
            {academic?.gpa && <MetaItem label="GPA" value={`${academic.gpa}${academic.gpaScale ? ` / ${academic.gpaScale}` : ""}`} />}
          </div>

          {academic?.trajectory && (
            <p className={styles.trajectory}>{academic.trajectory}</p>
          )}

          {/* 학기별 상세 과목 성적 성취 (Grade Tabs) */}
          {semestersData.length > 0 ? (
            <div className={styles.transcriptSection}>
              <h4 className={styles.subSectionTitle}>🔍 학기별 교과 성적 상세 (Transcript)</h4>
              
              {/* Grade Tabs */}
              <div className={styles.gradeTabs}>
                {uniqueGrades.map((grade) => (
                  <button
                    key={grade}
                    className={`${styles.gradeTabBtn} ${activeGrade === grade ? styles.activeTab : ""}`}
                    onClick={() => setActiveGrade(grade)}
                  >
                    Grade {grade}
                    {activeGrade === grade && (
                      <motion.div
                        layoutId="activeGradeLine"
                        className={styles.activeTabLine}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
                {uniqueGrades.length > 1 && (
                  <button
                    className={`${styles.gradeTabBtn} ${activeGrade === "all" ? styles.activeTab : ""}`}
                    onClick={() => setActiveGrade("all")}
                  >
                    전체 학년
                    {activeGrade === "all" && (
                      <motion.div
                        layoutId="activeGradeLine"
                        className={styles.activeTabLine}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                )}
              </div>

              {/* Semester Transcript Tables */}
              <div className={styles.semesterList}>
                <AnimatePresence mode="wait">
                  {filteredSemesters.map((sem, sIdx) => (
                    <motion.div
                      key={`${sem.grade}-${sem.semester}-${sIdx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={styles.semesterCard}
                    >
                      <div className={styles.semesterHeader}>
                        <GraduationCap size={16} color="var(--colors-primary)" />
                        <span className={styles.semesterTitle}>
                          Grade {sem.grade} — {sem.semester === "1st Semester" ? "1학기 (1st Semester)" : sem.semester === "2nd Semester" ? "2학기 (2nd Semester)" : sem.semester}
                        </span>
                      </div>

                      <div className={styles.tableWrapper}>
                        <table className={styles.courseTable}>
                          <thead>
                            <tr>
                              <th>교과목명 (Course Title)</th>
                              <th>취득 성적 (Grade)</th>
                              <th>단위수 (Units)</th>
                              <th>교사의견 및 세특 분석 (Teacher Comments / Remarks)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sem.courses?.map((course, cIdx) => (
                              <tr key={cIdx} className={styles.courseRow}>
                                <td className={styles.courseName}>{course.name}</td>
                                <td className={styles.courseScore}>{course.score}</td>
                                <td className={styles.courseUnit}>{course.unit || "—"}</td>
                                <td className={styles.courseComment}>
                                  {course.teacherComment ? (
                                    <span className={styles.commentText} title={course.teacherComment}>
                                      {course.teacherComment}
                                    </span>
                                  ) : (
                                    <span className={styles.emptyComment}>의견 미기재</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // Fallback flat subject view if semestersData is empty
            (academic?.subjects?.length ?? 0) > 0 && (
              <div className={styles.subjectGrid}>
                {academic.subjects.map((s, i) => (
                  <div key={i} className={styles.subjectItem}>
                    <div className={styles.subjectName}>{s.name}</div>
                    <div className={styles.subjectScore}>{s.score}</div>
                    {s.significance && <div className={styles.subjectNote}>{s.significance}</div>}
                  </div>
                ))}
              </div>
            )
          )}
        </Section>

        {/* ─── 📊 4. Standardized Tests (표준화 시험) ─── */}
        {(tests?.length ?? 0) > 0 && (
          <Section title="📊 표준화 시험 성적">
            <div className={styles.testList}>
              {tests.map((t, i) => (
                <div key={i} className={styles.testItem}>
                  <div className={styles.testBadgeIcon}>
                    <BookOpen size={16} color="var(--colors-primary)" />
                  </div>
                  <div className={styles.testContent}>
                    <div className={styles.testName}>{t.exam}</div>
                    <div className={styles.testDate}>{t.date ?? "시험 일자 미확인"}</div>
                  </div>
                  <div className={styles.testScore}>{t.score}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── ✈️ 5. Residency & Entry/Exit Periods (해외 체류 & 특례 자격) ─── */}
        {residency && (
          <Section title="✈️ 해외 체류 및 특례 적격 검토">
            <div className={styles.residencyInfo}>
              <div className={styles.residencyMeta}>
                {residency.totalYears && <MetaItem label="총 체류 기간" value={residency.totalYears} />}
                {residency.countries && <MetaItem label="체류 국가" value={residency.countries.join(", ")} />}
              </div>
              
              <div className={styles.eligibilityRow}>
                <EligBadge label="12년 특례" ok={residency.eligibility12yr} />
                <EligBadge label="3년 특례" ok={residency.eligibility3yr} />
              </div>

              {residency.notes && (
                <div className={styles.residencyNoteWrapper}>
                  <ShieldCheck size={14} color="var(--colors-primary)" />
                  <p className={styles.residencyNote}>{residency.notes}</p>
                </div>
              )}

              {/* 출입국/재학 상세 타임라인 (Timeline of Periods) */}
              {residency.periods && residency.periods.length > 0 && (
                <div className={styles.timelineSection}>
                  <h4 className={styles.timelineTitle}>📅 세부 출입국 및 재학 기간 기록</h4>
                  <div className={styles.timelineList}>
                    {residency.periods.map((p, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineCountry}>{p.country}</div>
                          <div className={styles.timelineDates}>
                            {p.from} ~ {p.to}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ─── 🏃 6. Extracurricular Activities & Clubs (비교과 및 동아리) ─── */}
        {(activities?.length ?? 0) > 0 && (
          <Section title="👥 비교과 활동 및 동아리 성취" className={styles.wide}>
            <div className={styles.activityList}>
              {activities.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityHeader}>
                    <div className={styles.activityIconBox}>
                      <Users size={16} color="var(--colors-secondary)" />
                    </div>
                    <span className={styles.activityName}>{a.name}</span>
                    {a.role && <span className={styles.activityRole}>{a.role}</span>}
                    {a.period && <span className={styles.activityPeriod}>{a.period}</span>}
                  </div>
                  {a.description && (
                    <p className={styles.activityDescription}>{a.description}</p>
                  )}
                  {a.impact && (
                    <div className={styles.activityImpactWrapper}>
                      <span className={styles.impactLabel}>AI 입시 평가</span>
                      <p className={styles.activityImpact}>{a.impact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── 🤝 7. Volunteering Section (봉사 활동 상세) ─── */}
        {volunteers.length > 0 && (
          <Section title="🤝 상세 봉사 활동 실적" className={styles.wide}>
            <div className={styles.volunteerGrid}>
              {volunteers.map((v, i) => (
                <div key={i} className={styles.volunteerCard}>
                  <div className={styles.volunteerHeader}>
                    <div className={styles.volunteerOrg}>
                      <Compass size={16} color="var(--colors-primary)" />
                      <span className={styles.volunteerOrgName}>{v.organization}</span>
                    </div>
                    <div className={styles.volunteerHoursBadge}>
                      <Clock size={12} style={{ marginRight: 4 }} />
                      {v.hours ?? "시간 미기재"}
                    </div>
                  </div>
                  {v.period && <div className={styles.volunteerPeriod}>활동 기간: {v.period}</div>}
                  {v.description && <p className={styles.volunteerDesc}>{v.description}</p>}
                  {v.impact && (
                    <div className={styles.volunteerImpactWrapper}>
                      <span className={styles.volunteerImpactLabel}>기여 및 가치</span>
                      <p className={styles.volunteerImpact}>{v.impact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── 🏆 8. Awards & Honors (수상 실적) ─── */}
        {(awards?.length ?? 0) > 0 && (
          <Section title="🏆 수상 내역 및 학술 탁월성">
            <div className={styles.awardList}>
              {awards.map((a, i) => (
                <div key={i} className={styles.awardItem}>
                  <div className={styles.awardHeader}>
                    <Award size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <div className={styles.awardName}>{a.name}</div>
                    {a.rank && <span className={styles.awardRankBadge}>{a.rank}</span>}
                  </div>
                  <div className={styles.awardMetaRow}>
                    {a.date && <div className={styles.awardDate}>{a.date}</div>}
                  </div>
                  {a.description && <p className={styles.awardDescription}>{a.description}</p>}
                  {a.significance && (
                    <div className={styles.awardSignificanceWrapper}>
                      <span className={styles.awardSigLabel}>AI 학술 분석</span>
                      <p className={styles.awardNote}>{a.significance}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── 💪 9. Key Strengths (핵심 역량) ─── */}
        {(persona?.strengths?.length ?? 0) > 0 && (
          <Section title="💪 핵심 입시 역량">
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
