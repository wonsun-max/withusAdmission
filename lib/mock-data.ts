import type {
  AdmissionTrack,
  AdmissionFamily,
  DocumentRequirement,
  GuidelineSource,
  StudentProfile,
  UniversityGuideline
} from "./admission-types";

export const sampleProfile: StudentProfile = {
  id: "stu-001",
  name: "Mina Park",
  dateOfBirth: "2008-09-12",
  track: "SPECIAL_12YR",
  targetMajor: "Biomedical Engineering",
  countryContext: "Korean applicant preparing overseas special admission with international school records",
  parentConsent: {
    status: "not-required",
    requiredBecause: {
      en: "Parent consent is required only for users under 14. This sample student is 14 or older.",
      ko: "만 14세 미만만 법정대리인 동의가 필요합니다. 이 샘플 학생은 만 14세 이상입니다."
    }
  },
  accountLinks: [
    {
      id: "link-parent-001",
      name: "Jiyoung Park",
      role: "PARENT",
      accessLevel: "edit",
      verified: true
    },
    {
      id: "link-school-001",
      name: "International School Counseling Office",
      role: "SCHOOL",
      accessLevel: "view",
      verified: false
    }
  ],
  gpaData: [
    {
      subject: "IB Biology HL",
      score: "7",
      scale: "1-7",
      confidence: 0.96
    },
    {
      subject: "IB Chemistry HL",
      score: "6",
      scale: "1-7",
      confidence: 0.94
    },
    {
      subject: "Mathematics AA HL",
      score: "7",
      scale: "1-7",
      confidence: 0.91
    },
    {
      subject: "English A SL",
      score: "6",
      scale: "1-7",
      confidence: 0.9
    }
  ],
  standardizedTests: [
    {
      exam: "SAT",
      score: "1530"
    },
    {
      exam: "IELTS",
      score: "8.0"
    }
  ],
  extracurriculars: [
    {
      name: "Hospital Volunteer Program",
      period: "2024",
      role: "Patient support volunteer",
      summary: "Assisted bilingual patient navigation in a community hospital."
    },
    {
      name: "Bioinformatics Research Club",
      period: "2023-2025",
      role: "Data lead",
      summary: "Built a small dataset to compare gene expression signals from public sources."
    },
    {
      name: "Model United Nations",
      period: "2022-2024",
      role: "Committee chair",
      summary: "Led English-language debate sessions with students from eight countries."
    }
  ],
  approvedFacts: [
    "IB Biology HL score is 7.",
    "IB Chemistry HL score is 6.",
    "Mathematics AA HL score is 7.",
    "SAT score is 1530.",
    "The student volunteered in hospital patient support in 2024.",
    "The student led data work in a bioinformatics research club from 2023 to 2025.",
    "The student chaired Model United Nations sessions from 2022 to 2024."
  ]
};

const baseDocumentRequirements: DocumentRequirement[] = [
  {
    id: "application-form",
    label: {
      en: "Application form",
      ko: "입학지원서"
    },
    helpText: {
      en: "University-specific application form or online submission confirmation.",
      ko: "대학별 입학지원서 또는 온라인 제출 확인 자료입니다."
    },
    category: "application",
    required: true,
    status: "complete"
  },
  {
    id: "transcript",
    label: {
      en: "High school transcript",
      ko: "고등학교 성적표"
    },
    helpText: {
      en: "Primary OCR target. Original subjects and scores must be preserved.",
      ko: "가장 먼저 OCR할 핵심 문서입니다. 원본 과목명과 점수를 유지합니다."
    },
    category: "academic",
    required: true,
    status: "ai-review"
  },
  {
    id: "graduation-certificate",
    label: {
      en: "Graduation or enrollment certificate",
      ko: "졸업 또는 재학 증명서"
    },
    helpText: {
      en: "Used to verify school attendance and graduation status.",
      ko: "재학 기간과 졸업 여부를 확인하는 문서입니다."
    },
    category: "academic",
    required: true,
    status: "not-started"
  },
  {
    id: "overseas-schooling-proof",
    label: {
      en: "Overseas schooling proof",
      ko: "해외 수학 기간 증빙"
    },
    helpText: {
      en: "Supports 3-year or 12-year overseas applicant eligibility.",
      ko: "3특/12특 자격 확인을 위한 해외 수학 기간 증빙입니다."
    },
    category: "eligibility",
    required: true,
    status: "not-started"
  },
  {
    id: "activity-proof",
    label: {
      en: "Activity proof",
      ko: "활동 증빙"
    },
    helpText: {
      en: "Awards, research, volunteering, leadership, or extracurricular proof.",
      ko: "수상, 연구, 봉사, 리더십, 비교과 활동 증빙입니다."
    },
    category: "activity",
    required: false,
    status: "not-started"
  },
  {
    id: "personal-statement",
    label: {
      en: "Personal statement",
      ko: "자기소개서"
    },
    helpText: {
      en: "Generated in English and Korean from approved facts and student answers.",
      ko: "승인된 사실과 학생 답변을 바탕으로 한/영 모두 생성합니다."
    },
    category: "application",
    required: true,
    status: "not-started"
  }
];

const guidelineSources: Record<string, GuidelineSource> = {
  snu: {
    sourcePageUrl: "https://admission.snu.ac.kr/international/notice?bbsidx=164698&md=v",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "SNU official admissions notice for 2026 international/global talent undergraduate admission."
  },
  yonsei: {
    sourcePageUrl: "https://admission.yonsei.ac.kr/seoul/admission/html/abroad/guide.asp",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "Yonsei official overseas Korean admissions guide page with PDF download control."
  },
  korea: {
    sourcePageUrl: "https://oku.korea.ac.kr/attach/202506/1751010317415_0.pdf",
    pdfUrl: "https://oku.korea.ac.kr/attach/202506/1751010317415_0.pdf",
    status: "official-imported",
    checkedAt: "2026-04-30",
    notes: "Korea University official 2026 special admission PDF found on oku.korea.ac.kr."
  },
  sogang: {
    sourcePageUrl: "https://admission.sogang.ac.kr/",
    status: "needs-official-pdf",
    checkedAt: "2026-04-30",
    notes: "Official admissions site identified; direct 2026 overseas-special PDF URL needs manual confirmation."
  },
  skku: {
    sourcePageUrl: "https://admission.skku.edu/admission/html/abroad/guide.html",
    pdfUrl: "https://admission.skku.edu/upload/guide/20250704094406W2GGHW.pdf",
    status: "official-imported",
    checkedAt: "2026-04-30",
    notes: "SKKU official overseas Korean guide page and 2026 PDF found."
  },
  hanyang: {
    sourcePageUrl: "https://go.hanyang.ac.kr/web/mojib/mojib.do?m_type=JEOEGUK&m_year=2026",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "Hanyang official overseas Korean guide page found; direct PDF URL is behind site download controls."
  },
  cau: {
    sourcePageUrl: "https://admission.cau.ac.kr/detail.do?board_seq=3219&menuurl=GtVhpgQCdX1JUrE85Ea%2BtA%3D%3D&pageNo=1",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "Chung-Ang official 2026 September overseas Korean guide notice found with Korean and English attachments."
  },
  khu: {
    sourcePageUrl: "https://iphak.khu.ac.kr/detail.do?board_seq=14335&categoryid=3&menuurl=B4xLxlvMKTq0z1qBllurfg%3D%3D&pageNo=1&userpwd=",
    pdfUrl:
      "https://iphak.khu.ac.kr/file/download.do?ofn=2026%ED%95%99%EB%85%84%EB%8F%84+%EA%B2%BD%ED%9D%AC%EB%8C%80%ED%95%99%EA%B5%90+%EC%9E%AC%EC%99%B8%EA%B5%AD%EB%AF%BC%ED%8A%B9%EB%B3%84%EC%A0%84%ED%98%95+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf&sfn=20260416042054290_2026%ED%95%99%EB%85%84%EB%8F%84+%EA%B2%BD%ED%9D%AC%EB%8C%80%ED%95%99%EA%B5%90+%EC%9E%AC%EC%99%B8%EA%B5%AD%EB%AF%BC%ED%8A%B9%EB%B3%84%EC%A0%84%ED%98%95+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf",
    status: "official-imported",
    checkedAt: "2026-04-30",
    notes: "Kyung Hee official 2026 overseas Korean guide PDF found."
  },
  hufs: {
    sourcePageUrl: "https://admission.hufs.ac.kr/",
    status: "needs-official-pdf",
    checkedAt: "2026-04-30",
    notes: "Official HUFS admissions domain identified; search surfaced a Ministry overseas education portal mirror, so official PDF URL still needs verification."
  },
  uos: {
    sourcePageUrl: "https://admission.uos.ac.kr/",
    status: "needs-official-pdf",
    checkedAt: "2026-04-30",
    notes: "Official UOS admissions domain identified; direct 2026 overseas-special guide was not surfaced in search."
  },
  ewha: {
    sourcePageUrl: "https://admission.ewha.ac.kr/admission/html/abroad/guide.asp",
    pdfUrl: "https://admission.ewha.ac.kr/upload/GUIDES/20260209140453BW6LJ2.pdf",
    status: "official-imported",
    checkedAt: "2026-04-30",
    notes: "Ewha official overseas Korean guide page and 2026 September PDF found."
  },
  kaist: {
    sourcePageUrl: "https://admission.kaist.ac.kr/intl-undergraduate/application/ApplicationGuide",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "KAIST official international undergraduate application guide page. This is a STEM/international track, not the same as general 3-year/12-year overseas special admission."
  },
  postech: {
    sourcePageUrl: "https://adm-iu.postech.ac.kr/index.do",
    status: "official-page-found",
    checkedAt: "2026-04-30",
    notes: "POSTECH official international undergraduate admissions site for Fall 2026 intake. This is a STEM/international track."
  }
};

const topThirteenAdmissionTargets = [
  {
    id: "snu",
    university: "Seoul National University",
    universityKo: "서울대학교",
    major: "Biomedical Engineering",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "yonsei",
    university: "Yonsei University",
    universityKo: "연세대학교",
    major: "Medicine",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "korea",
    university: "Korea University",
    universityKo: "고려대학교",
    major: "Global Studies",
    track: "3-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "sogang",
    university: "Sogang University",
    universityKo: "서강대학교",
    major: "Business Administration",
    track: "3-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "skku",
    university: "Sungkyunkwan University",
    universityKo: "성균관대학교",
    major: "Pharmacy",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "hanyang",
    university: "Hanyang University",
    universityKo: "한양대학교",
    major: "Computer Science",
    track: "3-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "cau",
    university: "Chung-Ang University",
    universityKo: "중앙대학교",
    major: "Media Communication",
    track: "3-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "khu",
    university: "Kyung Hee University",
    universityKo: "경희대학교",
    major: "Hospitality Management",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "hufs",
    university: "Hankuk University of Foreign Studies",
    universityKo: "한국외국어대학교",
    major: "International Studies",
    track: "3-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "uos",
    university: "University of Seoul",
    universityKo: "서울시립대학교",
    major: "Urban Sociology",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "ewha",
    university: "Ewha Womans University",
    universityKo: "이화여자대학교",
    major: "Nursing",
    track: "12-year" as const,
    admissionFamily: "overseas-special" as const
  },
  {
    id: "kaist",
    university: "KAIST",
    universityKo: "한국과학기술원",
    major: "Computer Science",
    track: "12-year" as const,
    admissionFamily: "international-stem" as const
  },
  {
    id: "postech",
    university: "POSTECH",
    universityKo: "포항공과대학교",
    major: "Artificial Intelligence",
    track: "12-year" as const,
    admissionFamily: "international-stem" as const
  }
] satisfies Array<{
  id: string;
  university: string;
  universityKo: string;
  major: string;
  track: "3-year" | "12-year";
  admissionFamily: AdmissionFamily;
}>;

export const universityGuidelines: UniversityGuideline[] = topThirteenAdmissionTargets.map((target) => ({
  id: `${target.id}-${target.track}-2026`,
  university: target.university,
  universityKo: target.universityKo,
  major: target.major,
  track: target.track === "12-year" ? "SPECIAL_12YR" : "SPECIAL_3YR" as AdmissionTrack,
  admissionFamily: target.admissionFamily,
  applicationYear: "2026",
  sourceStatus: guidelineSources[target.id].status,
  source: guidelineSources[target.id],
  requiredDocs: baseDocumentRequirements.map((doc) => doc.label.en),
  documentRequirements: baseDocumentRequirements.map((doc) => ({ ...doc })),
  essayPrompts: [
    {
      id: `${target.id}-statement-1`,
      prompt:
        "Describe the academic or personal experience that shaped your intended field of study. Use only verifiable facts.",
      promptKo:
        "지원 전공을 선택하게 된 학업적 또는 개인적 경험을 서술하세요. 검증 가능한 사실만 사용하세요.",
      limit: "1,000 characters including spaces"
    }
  ]
}));

export const consultantStudents = [
  {
    id: "stu-001",
    name: "Mina Park",
    track: "SPECIAL_12YR",
    target: "SNU Biomedical Engineering",
    progress: 78,
    status: "Master essay ready",
    risk: "Chemistry proof needs final approval"
  },
  {
    id: "stu-002",
    name: "Daniel Kim",
    track: "SPECIAL_3YR",
    target: "Korea University Global Studies",
    progress: 52,
    status: "OCR review",
    risk: "Residence proof missing"
  },
  {
    id: "stu-003",
    name: "Ari Choi",
    track: "SPECIAL_12YR",
    target: "Yonsei Medicine",
    progress: 64,
    status: "Evaluation complete",
    risk: "Medical service evidence is thin"
  }
];
