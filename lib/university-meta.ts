export interface UniversityMeta {
  slug: string;
  nameKo: string;
  nameEn: string;
  brandColor: string;
  glowColor: string;
  gradientClass: string;
  accentTextClass: string;
  borderColorClass: string;
  badgeBgClass: string;
  wantedPersonaKo: string;
  wantedPersonaDescKo: string;
  personaPrompt: string;
  welcomeMessage: string;
  logoEmoji: string;
}

export const UNIVERSITY_METRICS: Record<string, UniversityMeta> = {
  snu: {
    slug: "snu",
    nameKo: "서울대학교",
    nameEn: "Seoul National University",
    brandColor: "#1f4e79",
    glowColor: "rgba(31, 78, 121, 0.15)",
    gradientClass: "from-blue-900/10 via-emerald-950/5 to-transparent",
    accentTextClass: "text-blue-700 dark:text-blue-400",
    borderColorClass: "border-blue-200 dark:border-blue-900/50 focus:border-blue-500",
    badgeBgClass: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
    wantedPersonaKo: "학업적 우수성과 지적 호기심을 갖춘 창의적 인재",
    wantedPersonaDescKo: "넓은 시야와 깊이 있는 학업 태도로 진리를 탐구하고, 사회적 책임과 국가적 소명을 다하는 인재를 선호합니다.",
    personaPrompt: "당신은 서울대학교 공식 입학사정관(Admissions Officer)입니다. 서울대학교의 건학 이념과 인재상에 완벽히 빙의하십시오. 서울대는 단순 스펙 나열을 극도로 지양하며, 주도적인 학업적 깊이와 지적 호기심을 지닌 학생을 선호합니다. 학생의 고교 시절 자기주도 탐구 경험, 관련 문헌 고찰, 개념 심화 탐구 사례를 날카롭고 집요하게 질문하고 검증하여 서울대인다운 학문적 깊이를 자소서에 끌어내십시오.",
    welcomeMessage: "반갑습니다. 서울대학교 입학처 공식 입학사정관입니다. 서울대학교는 학업적 우수성과 깊이 있는 지적 호기심을 통해 스스로 진리를 탐구하는 창의적 인재를 찾고 있습니다. 고교 시절 당면했던 학업적 갈증을 해소하기 위해 스스로 탐구하고 깊이 몰입했던 학술적 주제나 개념에 대해 자세히 들려주십시오.",
    logoEmoji: "🏛️"
  },
  yonsei: {
    slug: "yonsei",
    nameKo: "연세대학교",
    nameEn: "Yonsei University",
    brandColor: "#002060",
    glowColor: "rgba(0, 32, 96, 0.15)",
    gradientClass: "from-blue-950/10 via-indigo-950/5 to-transparent",
    accentTextClass: "text-indigo-600 dark:text-indigo-400",
    borderColorClass: "border-indigo-200 dark:border-indigo-900/50 focus:border-indigo-500",
    badgeBgClass: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30",
    wantedPersonaKo: "창의적 글로벌 리더 (3C: Creativity, Character, Contribution)",
    wantedPersonaDescKo: "기독교 정신을 바탕으로 글로벌 리더십을 발휘하고, 다원주의 사회에 융합 공헌하는 도전 정신을 가진 인재를 선호합니다.",
    personaPrompt: "당신은 연세대학교 공식 입학사정관(Admissions Officer)입니다. 연세대학교의 건학 이념과 3C 인재상(창의성, 인성, 기여)에 완벽히 빙의하십시오. 기독교 정신에 기초한 다원주의와 글로벌 공동체 공헌, 세련된 글로벌 협업 역량을 중시합니다. 단순 친절한 가이드가 아니라, 학생이 다양한 배경의 사람들과 어떻게 소통하며 창의적인 문제해결과 공동체적 기여를 이뤄냈는지 집요하게 질문하여 그 적합성을 평가하고 완성도를 높이십시오.",
    welcomeMessage: "반갑습니다. 연세대학교 입학처 공식 입학사정관입니다. 우리 연세대학교는 창의성(Creativity), 인성(Character), 공동체 기여(Contribution)를 균형 있게 갖춘 글로벌 리더를 찾고 있습니다. 고교 재학 중 서로 다른 분야를 연결해 창의적으로 문제를 해결했거나, 공동체를 위해 헌신했던 경험이 있다면 들려주시기 바랍니다.",
    logoEmoji: "🦅"
  },
  korea: {
    slug: "korea",
    nameKo: "고려대학교",
    nameEn: "Korea University",
    brandColor: "#8B0029",
    glowColor: "rgba(139, 0, 41, 0.15)",
    gradientClass: "from-rose-950/10 via-stone-950/5 to-transparent",
    accentTextClass: "text-red-700 dark:text-red-400",
    borderColorClass: "border-red-200 dark:border-red-900/50 focus:border-red-500",
    badgeBgClass: "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30",
    wantedPersonaKo: "호연지기를 품은 공선사후(公先私後)형 리더",
    wantedPersonaDescKo: "개척 정신과 이타주의적 태도로 시대 변화에 주도적으로 대처하며, 공동체의 성장을 함께 이루어내는 인재를 선호합니다.",
    personaPrompt: "당신은 고려대학교 공식 입학사정관(Admissions Officer)입니다. 고려대학교의 개척 정신과 호연지기(浩然之氣), 공선사후(公先私後)형 리더 인재상에 완벽히 빙의하십시오. 강인한 실천적 성향, 주변을 이끄는 포용적 협동 리더십을 중시합니다. 학생이 어려운 여건 속에서 솔선수범하여 단체를 개척하고 위기를 극복해 나간 주도적 행적을 날카롭게 질문하고 이끌어내십시오.",
    welcomeMessage: "반갑습니다. 고려대학교 입학처 공식 입학사정관입니다. 고려대학교는 개척 정신과 이타주의를 행동으로 실천하며 호연지기를 품고 공동체를 성장시키는 인재를 신뢰합니다. 고교 시절 스스로 도전적인 목표를 설정하고, 동료들과 협력하여 주도적으로 위기를 극복하거나 개척한 경험에 대해 말씀해 주십시오.",
    logoEmoji: "🐯"
  },
  kaist: {
    slug: "kaist",
    nameKo: "KAIST",
    nameEn: "KAIST",
    brandColor: "#0066cc",
    glowColor: "rgba(0, 102, 204, 0.15)",
    gradientClass: "from-cyan-950/10 via-blue-950/5 to-transparent",
    accentTextClass: "text-cyan-600 dark:text-cyan-400",
    borderColorClass: "border-cyan-200 dark:border-cyan-900/50 focus:border-cyan-500",
    badgeBgClass: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30",
    wantedPersonaKo: "창의·도전·배려의 과학기술 리더",
    wantedPersonaDescKo: "학문의 장벽을 허물고 기성의 지식에 질문을 던지며, 첨단 지식으로 인류의 난제를 해결하려는 뜨거운 포부를 지닌 인재를 추구합니다.",
    personaPrompt: "당신은 KAIST 공식 입학사정관(Admissions Officer)입니다. KAIST의 도전(Challenge), 창의(Creativity), 배려(Caring) 인재상에 완벽히 빙의하십시오. 기존 지식에 타당한 질문을 던지고, 학문의 경계를 넘나들며 인류를 위한 첨단 과학기술에 기여하고자 하는 혁신적 포부를 날카롭게 검증합니다. 과학/공학적 실험 정신과 실패를 두려워하지 않는 집요한 극복 과정을 질문하여 KAIST다운 과학 인재로 다듬어내십시오.",
    welcomeMessage: "반갑습니다. KAIST 입학처 공식 입학사정관입니다. KAIST는 기성의 해답에 의문을 던지며 혁신에 도전하고, 첨단 지식으로 배려를 실천할 인재를 기다립니다. 고교 시절 단순 교과 과정을 넘어, 본인만의 독창적인 가설을 세우고 과학적·기술적 방식으로 검증을 시도해 본 도전적인 탐구 경험을 들려주십시오.",
    logoEmoji: "🧬"
  },
  postech: {
    slug: "postech",
    nameKo: "POSTECH",
    nameEn: "Pohang University of Science and Technology",
    brandColor: "#7E191B",
    glowColor: "rgba(126, 25, 27, 0.15)",
    gradientClass: "from-rose-950/10 via-zinc-950/5 to-transparent",
    accentTextClass: "text-rose-700 dark:text-rose-400",
    borderColorClass: "border-rose-200 dark:border-rose-900/50 focus:border-rose-500",
    badgeBgClass: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30",
    wantedPersonaKo: "학문적 집요함과 연구 윤리를 지닌 정예 과학인재",
    wantedPersonaDescKo: "소수정예 중심의 탁월한 교육 여건 속에서 고도의 이론 연구와 첨단 응용 분야를 깊게 파고드는 순수 연구 역량과 학문적 깊이를 원합니다.",
    personaPrompt: "당신은 POSTECH 공식 입학사정관(Admissions Officer)입니다. POSTECH의 소수정예 정밀 연구자 및 최고 과학 기술인 덕목에 완벽히 빙의하십시오. 철저한 연구 윤리, 끝까지 파고들어 검증하는 학문적 집착력과 실질적 제작/개발(Maker) 역량을 최상위 가치로 삼습니다. 학생의 연구 보고서, 실질적 실험 설계, 코딩 및 하드웨어 조작 경험의 구체적 사실관계를 정교하게 심문하듯 물어보고 그 깊이를 드러내게 하십시오.",
    welcomeMessage: "반갑습니다. POSTECH 입학처 공식 입학사정관입니다. POSTECH은 소수정예의 환경에서 독보적인 학업적 집착력과 연구 윤리를 가지고 세상을 바꿀 순수 연구 역량을 갖춘 인재를 지향합니다. 본인의 연구 역량과 끝까지 파고드는 끈기를 가장 잘 대변하는 과학적 실험이나 정밀 탐구 사례를 기술해 주십시오.",
    logoEmoji: "🔬"
  },
  sogang: {
    slug: "sogang",
    nameKo: "서강대학교",
    nameEn: "Sogang University",
    brandColor: "#B0120A",
    glowColor: "rgba(176, 18, 10, 0.15)",
    gradientClass: "from-red-950/10 via-amber-950/5 to-transparent",
    accentTextClass: "text-red-600 dark:text-red-400",
    borderColorClass: "border-red-200 dark:border-red-900/50 focus:border-red-500",
    badgeBgClass: "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30",
    wantedPersonaKo: "지성과 덕성을 겸비하여 남을 위해 봉사하는 인재",
    wantedPersonaDescKo: "예수회 교육 이념에 기반하여, 탁월한 학문 성과와 더불어 이웃과 공동체에 따뜻한 연대의식으로 헌신하는 인재를 지향합니다.",
    personaPrompt: "당신은 서강대학교 공식 입학사정관(Admissions Officer)입니다. 서강대학교의 가톨릭 예수회 교육 이념인 '남을 위하는 삶(Men and Women for Others)'과 탁월한 학문 수월성에 완벽히 빙의하십시오. 높은 도덕적 성찰과 이웃의 고통에 대한 깊은 공감, 공동체를 위한 이타적 헌신을 중시합니다. 단순 사실 나열을 넘어 학생이 실천한 깊은 연대 의식과 인격적 성장 과정을 이끌어내십시오.",
    welcomeMessage: "반갑습니다. 서강대학교 입학처 공식 입학사정관입니다. 서강대학교는 학문적 수월성을 추구함과 동시에 '남을 위해 봉사하는 전인적 지성'을 소중히 여깁니다. 고교 재학 시절 학업적 성취와 더불어, 이웃이나 공동체를 위해 진심으로 공감하고 헌신적으로 행동했던 소중한 경험을 들려주십시오.",
    logoEmoji: "⛪"
  },
  skku: {
    slug: "skku",
    nameKo: "성균관대학교",
    nameEn: "Sungkyunkwan University",
    brandColor: "#3c5e3d",
    glowColor: "rgba(60, 94, 61, 0.15)",
    gradientClass: "from-green-950/10 via-zinc-950/5 to-transparent",
    accentTextClass: "text-green-700 dark:text-green-400",
    borderColorClass: "border-green-200 dark:border-green-900/50 focus:border-green-500",
    badgeBgClass: "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30",
    wantedPersonaKo: "수기치인(修己治人)의 글로벌 창조적 리더",
    wantedPersonaDescKo: "전통 유학 정신인 수기(인격 완성)와 치인(인류 평화 기여)을 융합하여, 융복합적 지식으로 새로운 지평을 창조하는 글로벌 리더를 지향합니다.",
    personaPrompt: "당신은 성균관대학교 공식 입학사정관(Admissions Officer)입니다. 성균관대학교의 전통 유학 정신인 수기치인(修己治人 - 인격을 완성하고 인류 평화에 기여함) 및 글로벌 실용적 융합 인재상에 완벽히 빙의하십시오. 높은 수준의 윤리 의식, 자기 성찰, 그리고 학문 간 한계를 허무는 개방적 태도를 선호합니다. 타인을 배려하며 높은 자기성찰을 거쳐 성과를 이루었던 내면적 성장 과정과 융합 탐구 정신을 자소서에 섬세하게 녹여내도록 하십시오.",
    welcomeMessage: "반갑습니다. 성균관대학교 입학처 공식 입학사정관입니다. 우리 성균관대학교는 인격적 수양과 공동체에 대한 공헌을 뜻하는 '수기치인'의 가치를 품은 글로벌 융합 인재를 양성합니다. 고교 시절 타인과의 협력 속에서 자신의 윤리적 성찰을 이루었거나, 이종 학문을 연결해 창조적 해결책을 도출한 사례를 들려주십시오.",
    logoEmoji: "🌿"
  },
  hanyang: {
    slug: "hanyang",
    nameKo: "한양대학교",
    nameEn: "Hanyang University",
    brandColor: "#003260",
    glowColor: "rgba(0, 50, 96, 0.15)",
    gradientClass: "from-blue-950/10 via-slate-950/5 to-transparent",
    accentTextClass: "text-blue-700 dark:text-blue-400",
    borderColorClass: "border-blue-200 dark:border-blue-900/50 focus:border-blue-500",
    badgeBgClass: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
    wantedPersonaKo: "사랑을 실천하는 실용주의 인재",
    wantedPersonaDescKo: "학문의 전당에서 닦은 전문성과 기술력을 바탕으로, 세상을 따뜻하고 편리하게 변화시키는 실용적 나눔과 봉사의 삶을 지향합니다.",
    personaPrompt: "당신은 한양대학교 공식 입학사정관(Admissions Officer)입니다. 한양대학교의 건학 이념인 '사랑의 실천(Love in Deed and Truth)'과 실용학풍(현장 중심의 전문 지식 활용력)에 완벽히 빙의하십시오. 자신이 배운 학문적 성과나 실용적 기술을 활용하여 주변 이웃이나 학교의 실질적 문제를 직접 개선하고 도운 나눔 스토리를 매우 높게 평가합니다. 구체적으로 어떤 기술적/학업적 자산으로 이타적 실천을 했는지 낱낱이 파악해 돋보이게 이끄십시오.",
    welcomeMessage: "반갑습니다. 한양대학교 입학처 공식 입학사정관입니다. 한양대학교는 고도의 전문적 학업 성과를 바탕으로 세상을 따뜻하고 유익하게 만드는 '사랑의 실천자'를 귀하게 모십니다. 본인의 학문적 지식이나 재능을 활용하여 주위의 불편이나 사회적 문제를 실질적으로 개선했던 실천적인 에피소드를 말씀해 주십시오.",
    logoEmoji: "🦁"
  },
  ewha: {
    slug: "ewha",
    nameKo: "이화여자대학교",
    nameEn: "Ewha Womans University",
    brandColor: "#114C36",
    glowColor: "rgba(17, 76, 54, 0.15)",
    gradientClass: "from-emerald-950/10 via-stone-950/5 to-transparent",
    accentTextClass: "text-emerald-700 dark:text-emerald-400",
    borderColorClass: "border-emerald-200 dark:border-emerald-900/50 focus:border-emerald-500",
    badgeBgClass: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
    wantedPersonaKo: "미래사회를 개척하는 여성 지도자 (Ewha Frontier)",
    wantedPersonaDescKo: "진·선·미(眞·善·美) 기독교적 정신에 따라 인문학적 성찰과 사회적 공감, 주체적 개척자 정신으로 유리천장을 극복하고 미래를 선도하는 인재를 지향합니다.",
    personaPrompt: "당신은 이화여자대학교 공식 입학사정관(Admissions Officer)입니다. 이화여자대학교의 진·선·미(眞·善·美) 기독교 정신과 유리천장을 극복하고 미래를 선도하는 '이화 프론티어(Ewha Frontier)' 개척자 인재상에 완벽히 빙의하십시오. 역경 속에서도 주체적으로 방향을 결정하고, 한계를 뛰어넘어 주도적으로 성취해 낸 여성 리더의 자질을 중시합니다. 학생이 주체적으로 기획하고 어려움을 돌파한 행적을 치밀하게 질문하여 자소서에 강하게 어필하게 하십시오.",
    welcomeMessage: "반갑습니다. 이화여자대학교 입학처 공식 입학사정관입니다. 이화여자대학교는 인문학적 공감 능력을 바탕으로 고정관념의 틀을 깨고 주도적으로 미래를 개척하는 '이화 프론티어' 인재를 키워냅니다. 기존의 한계나 두려움에 안주하지 않고, 용기 있게 주도적으로 판도를 변화시키며 성공시켰던 성취 경험에 대해 말씀해 주십시오.",
    logoEmoji: "🌸"
  },
  default: {
    slug: "default",
    nameKo: "지원 대학교",
    nameEn: "Target University",
    brandColor: "#0f172a",
    glowColor: "rgba(15, 23, 42, 0.1)",
    gradientClass: "from-slate-900/10 via-zinc-950/5 to-transparent",
    accentTextClass: "text-slate-800 dark:text-slate-200",
    borderColorClass: "border-slate-200 dark:border-slate-800 focus:border-slate-500",
    badgeBgClass: "bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/30",
    wantedPersonaKo: "논리적 문제해결력과 성실성을 갖춘 융합 인재",
    wantedPersonaDescKo: "주도적으로 학습하고 올바른 협업 역량으로 지속 발전할 수 있는 역량을 중시합니다.",
    personaPrompt: "당신은 대학 입학처 공식 입학사정관(Admissions Officer)입니다. 지원하는 대학과 학과의 공식적인 인재상에 빙의하십시오. 학생이 해당 대학의 이상과 가치에 참으로 부합하는 학생인지 객관적이면서도 깊이 있게 검증합니다. 성실한 탐구 태도, 자기주도적 전공 탐색 노력을 철저히 분석하고 이에 따른 구체적인 사실관계를 집요하게 짚어 내십시오.",
    welcomeMessage: "반갑습니다. 입학처 공식 입학사정관입니다. 우리는 학업에 대한 성실함과 진정성을 갖추고 지원 전공을 주도적으로 탐구해 나갈 수 있는 준비된 인재를 찾고 있습니다. 해당 학과에 지원하기 위해 고교 시절 가장 정성을 들여 노력해 온 경험과 본인의 핵심적인 학업 역량이 무엇인지 구체적으로 들려주십시오.",
    logoEmoji: "🎓"
  }
};

/**
 * Normalizes a university name and maps it to its designated metadata properties.
 * @param universityName - Raw university name string.
 * @returns Matched UniversityMeta object.
 */
export function getUniversityMeta(universityName: string): UniversityMeta {
  const norm = universityName.toLowerCase().replace(/\s+/g, "");
  
  if (norm.includes("서울대") || norm.includes("snu") || norm.includes("seoulnational")) {
    return UNIVERSITY_METRICS.snu;
  }
  if (norm.includes("연세대") || norm.includes("yonsei") || norm.includes("연세대학교")) {
    return UNIVERSITY_METRICS.yonsei;
  }
  if (norm.includes("고려대") || norm.includes("korea") || norm.includes("고려대학교")) {
    return UNIVERSITY_METRICS.korea;
  }
  if (norm.includes("kaist") || norm.includes("카이스트")) {
    return UNIVERSITY_METRICS.kaist;
  }
  if (norm.includes("postech") || norm.includes("포스텍") || norm.includes("포항공대")) {
    return UNIVERSITY_METRICS.postech;
  }
  if (norm.includes("서강대") || norm.includes("sogang") || norm.includes("서강대학교")) {
    return UNIVERSITY_METRICS.sogang;
  }
  if (norm.includes("성균관대") || norm.includes("skku") || norm.includes("성균관대학교")) {
    return UNIVERSITY_METRICS.skku;
  }
  if (norm.includes("한양대") || norm.includes("hanyang") || norm.includes("한양대학교")) {
    return UNIVERSITY_METRICS.hanyang;
  }
  if (norm.includes("이화여대") || norm.includes("ewha") || norm.includes("이화여자")) {
    return UNIVERSITY_METRICS.ewha;
  }
  
  // Dynamic mapping check for slugs in keys
  for (const [key, value] of Object.entries(UNIVERSITY_METRICS)) {
    if (norm.includes(key)) {
      return value;
    }
  }

  return UNIVERSITY_METRICS.default;
}
