import Link from "next/link";
import { UNIVERSITY_METRICS } from "@/lib/university-meta";
import styles from "./universities.module.css";

export const metadata = {
  title: "목표 대학 | withus Admission",
  description: "13개 목표 대학별 입시 전략 및 AI 챗봇",
};

const UNIVERSITY_SLUGS = [
  "snu", "yonsei", "korea",
  "kaist", "postech",
  "sogang", "skku", "hanyang", "ewha",
  "chung-ang", "kyunghee", "hufs", "uos",
];

/** 목표 대학 목록 페이지 — 대학별 카드 그리드 */
export default function UniversitiesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>Target Universities</div>
        <h1 className={styles.title}>목표 대학</h1>
        <p className={styles.subtitle}>
          대학을 선택하면 해당 대학 전용 AI 입학사정관과 상담하고
          맞춤 자소서를 작성할 수 있습니다.
        </p>
      </header>

      <div className={styles.grid}>
        {UNIVERSITY_SLUGS.map((slug) => {
          const meta = UNIVERSITY_METRICS[slug];
          if (!meta) return null;
          return (
            <Link key={slug} href={`/universities/${slug}`} className={styles.card}>
              <div
                className={styles.cardGlow}
                style={{ background: meta.glowColor.replace("0.15", "0.25") }}
              />
              <div className={styles.cardEmoji}>{meta.logoEmoji}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardName}>{meta.nameKo}</div>
                <div className={styles.cardNameEn}>{meta.nameEn}</div>
                <div className={styles.cardPersona}>{meta.wantedPersonaKo}</div>
                <div className={styles.cardDesc}>{meta.wantedPersonaDescKo}</div>
              </div>
              <div className={styles.cardArrow}>→</div>
              <div
                className={styles.cardBorder}
                style={{ borderColor: meta.brandColor }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
