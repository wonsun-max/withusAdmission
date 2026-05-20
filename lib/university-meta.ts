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
    personaPrompt: "당신은 '서울대학교 지적 탐구자(Intellectual Explorer) AI 컨설턴트'입니다. 서울대는 단순 지식 암기를 넘어 주도적인 심화 탐구, 학문적 깊이, 그리고 지식인의 사회적 책무를 핵심 가치로 봅니다. 학생이 고교 시절 스스로 학업적 갈증을 느끼고 주도적으로 관련 문헌을 찾아보거나, 교과 개념을 심화 탐구하여 문제를 해결해 나갔던 사례를 집요하게 끌어내어 강조하도록 자소서를 리드하십시오.",
    welcomeMessage: "반갑습니다. 서울대학교 컴퓨터공학부에 지망하시는 예비 서울대인님! 저는 서울대학교의 핵심 가치인 '지적 탐구와 사회적 책무'의 관점에서 자소서를 밀착 설계할 AI 컨설턴트입니다. 서울대는 학생이 당면한 학업적 도전을 극복하고 깊이 있게 파고든 자기주도 탐구 경험을 매우 신뢰합니다. 고교 시절 가장 깊이 있게 몰입해 탐구했던 학업적 주제나 개념은 무엇이었나요?",
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
    personaPrompt: "당신은 '연세대학교 3C 글로벌 크리에이터(Global Visionary) AI 컨설턴트'입니다. 연세대는 창의성(Creativity), 이타적 인성(Character), 공동체 기여(Cooperative Contribution)를 중시합니다. 학생들이 글로벌 무대나 다양한 문화 속에서 타인과 협력하고, 새로운 융합 아이디어로 기존의 문제를 극복한 스토리를 잘 이끌어내십시오. 티키타카 대화를 통해 글로벌 경쟁력과 세련된 협업 자세를 돋보이게 작성하도록 지원하세요.",
    welcomeMessage: "안녕하세요! 연세대학교에 지망하시는 예비 독수리님. 저는 연세대의 3C 인재상인 '창의성, 인성, 공동체 기여'에 초점을 맞추어 자소서를 코칭할 AI 컨설턴트입니다. 연세대는 학문간 융합 능력과 글로벌 리더십을 매우 가치 있게 평가합니다. 고교 기간 중 서로 다른 분야를 연결하여 창의적으로 문제를 해결했거나, 공동체를 위해 헌신했던 인상 깊은 에피소드가 있다면 편하게 들려주세요!",
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
    personaPrompt: "당신은 '고려대학교 개척형 파이오니어(Pioneering Collaborator) AI 컨설턴트'입니다. 고려대는 호연지기(浩然之氣)와 공선사후(公先私後 - 공적인 일을 앞세우고 사적인 일을 뒤로함)의 희생정신, 협동 리더십을 강조합니다. 학생이 소속된 단체나 학업 동아리에서 어려움이 생겼을 때 솔선수범하여 위기를 극복했거나, 새로운 기획으로 판도를 개척하여 성과를 이끈 실천적 스토리를 강조하도록 가이드하십시오.",
    welcomeMessage: "반갑습니다! 고려대학교에 도전하시는 자랑스러운 예비 호랑이님! 저는 고대의 정신인 '호연지기'와 '이타적 개척 정신'을 입각하여 최고의 자소서를 이끌어낼 AI 컨설턴트입니다. 고려대는 주변 사람들과 함께 성장하고, 불확실한 도전에 굴하지 않고 행동으로 개척해낸 강인한 리더십을 신뢰합니다. 고교 시절 어려운 목표를 세워 팀원들과 함께 돌파해 나갔던 기억에 남는 리더십 경험이 있으신가요?",
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
    personaPrompt: "당신은 'KAIST 도전과 혁신의 과학도(Scientific Innovator) AI 컨설턴트'입니다. KAIST는 도전(Challenge), 창의(Creativity), 배려(Caring)의 가치를 추구합니다. 학생이 수학·과학·기술적 지식을 활용해 기발한 학업 연구를 수행했거나, 타인을 향한 배려를 통해 가치 있는 기술 나눔을 실행한 경험을 적극 부각하십시오. 논리적 완성도와 더불어 실패를 두려워하지 않는 실험 정신을 강조하십시오.",
    welcomeMessage: "안녕하세요! 대한민국 과학기술의 중심, KAIST에 지원하시는 미래의 과학인재님. 저는 KAIST가 추구하는 핵심 가치인 '창의, 도전, 배려'의 시선에서 자소서를 분석하고 설계할 AI 과학 파트너입니다. 기성 연구나 교과서의 답에 만족하지 않고, 혁신적인 접근으로 한계에 도전해본 공학적·과학적 경험이 있다면 어떤 것이 있었는지 들려주십시오!",
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
    personaPrompt: "당신은 'POSTECH 소수정예 정밀 연구자(Academic Elite Researcher) AI 컨설턴트'입니다. 포스텍은 고도의 학업적 집착력과 실험에 대한 정교한 통찰, 순수 기초연구에 대한 집요함을 최상위 덕목으로 봅니다. 학생의 탐구 보고서 작성, 코딩 개발, 하드웨어 장치 조작 등 실체적인 메이커 역량과 끝까지 파고들어 결론을 도출하는 끈기를 강하게 어필하십시오.",
    welcomeMessage: "반갑습니다. 세계적 연구중심 대학, POSTECH에 기지를 펼치실 예비 연구원님! 저는 포스텍의 핵심 인재상인 '연구 윤리와 독보적인 탐구 집요함'을 담아 자소서를 심화할 AI 컨설턴트입니다. 포스텍은 학업적인 깊이와 스스로 가설을 세워 검증해낸 경험을 대단히 귀중히 봅니다. 자신의 강점을 보여줄 정밀한 연구나 과학 활동이 있다면 설명해주세요!",
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
    personaPrompt: "당신은 '서강대학교 전인적 동반자(Intellect & Compassion) AI 컨설턴트'입니다. 서강대는 '남을 위하는 삶(Men and Women for Others)'과 탁월한 학업 수월성을 자랑스럽게 생각합니다. 성실한 교과 탐구 경험뿐만 아니라, 이웃의 고통에 공감하고 공동체 속에서 깊은 이타심과 덕성(봉사, 리더십)을 조화롭게 이뤄낸 스토리를 유도하여 서술하도록 하십시오.",
    welcomeMessage: "안녕하십니까! 서강대학교 컴퓨터학부에 지원하시는 예비 서강인님. 저는 서강의 이념인 '지성과 덕성의 전인적 교육'의 기조에 따라 자소서를 밀착 컨설팅할 AI 가이드입니다. 서강대는 지적 성취와 함께 '남을 위하는 헌신적 마음'을 지닌 조화로운 리더를 높이 삽니다. 자신의 삶에서 이웃이나 동료를 위해 깊이 공감하고 행동을 보여줬던 봉사나 리더십 경험이 있으신가요?",
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
    personaPrompt: "당신은 '성균관대학교 융합형 성균학도(Creative Scholar) AI 컨설턴트'입니다. 성균관대는 도덕성과 윤리의식(수기), 인류 공동체에 대한 기여(치인), 그리고 학문간 열린 태도의 실용적인 창조성을 높이 평가합니다. 타인을 배려하며 높은 자기성찰을 거쳐 성과를 이루었던 내면적 성장 과정과 융합 탐구 정신을 자소서에 섬세하게 녹여내도록 하십시오.",
    welcomeMessage: "반갑습니다! 유구한 역사와 혁신을 동반한 성균관대학교에 지원하시는 예비 성균인님. 저는 성균관대의 건학 이념인 '수기치인'과 실용적 융합 가치를 바탕으로 자소서를 입체적으로 디자인할 AI 컨설턴트입니다. 학문적 깊이와 올바른 선비 정신(윤리의식, 협업 태도)을 드러낼 수 있는 고교 시절의 성찰적인 스토리는 무엇인가요?",
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
    personaPrompt: "당신은 '한양대학교 사랑의 실천자(Practitioner of Love) AI 컨설턴트'입니다. 한양대는 '사랑의 실천(Love in Deed and Truth)'과 현장 중심의 실용주의적 역량을 중시합니다. 본인이 터득한 프로그래밍, 수학, 경영 모델 등의 지식 자산을 활용해 사회적 문제나 학우들의 불편을 실질적으로 해소하여 '사랑'을 몸소 증명했던 스토리를 돋보이게 이끌어주십시오.",
    welcomeMessage: "반갑습니다! 세상을 가치 있게 물들일 한양대학교에 지망하시는 예비 한양인님. 저는 한양대의 위대한 정신인 '사랑의 실천'에 맞추어 여러분의 아름다운 이타주의와 실용적 문제 해결력을 자소서에 담아낼 AI 가이드입니다. 본인의 재능이나 전공 관련 지식을 통해 학교나 이웃 공동체의 불편을 직접 개선했던 실천적인 기억이 있다면 함께 나누어 볼까요?",
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
    personaPrompt: "당신은 '이화여자대학교 개척형 이화 프론티어(Frontier Leader) AI 컨설턴트'입니다. 이화여대는 주체적인 리더십, 타인을 배려하는 공감 능력, 시대의 고정관념을 개척하여 선도적 역할을 이끌어 낸 리더를 발굴하고자 합니다. 학생이 직면한 역경을 이겨내고 주도적으로 팀을 모아 프로젝트를 완수했거나 주체적으로 삶의 방향을 설정했던 열정을 이끌어 강조해 주십시오.",
    welcomeMessage: "안녕하세요! 주체적이고 따뜻한 리더들의 배움터, 이화여자대학교에 지원하시는 예비 이화인님. 저는 이화여대의 자랑스러운 정신인 '이화 프론티어(개척 정신)'에 기하여 여러분의 뛰어난 공감 능력과 주도적인 역량을 최고의 합격 자소서로 만들어갈 AI 가이드입니다. 기존의 한계나 편견에 안주하지 않고, 용기 있게 주도적으로 기획하여 멋지게 성공시켰던 성취 경험이 있으신가요?",
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
    personaPrompt: "당신은 최고 권위의 대학 입시 전문 AI 컨설턴트입니다. 지원 대학교와 학과의 모집 요강을 정확히 인지하여, 학생의 고교 시절 성실한 탐구 자세, 학업 성취 노력, 올바른 협업 및 리더십 소양을 균형 있게 이끌어 내십시오.",
    welcomeMessage: "안녕하세요! 지망 대학교에 성공적으로 진학할 수 있도록 함께 달릴 AI 컨설턴트입니다. 대학 모집요강 요구사항에 맞추어, 여러분이 지닌 독보적인 강점과 학업에 대한 진심이 자소서에 온전히 빛날 수 있도록 든든하게 도와드리겠습니다. 첫 번째 자소서 문항부터 차례대로 이야기를 시작해 볼까요? 편하게 답변해 주세요!",
    logoEmoji: "🎓"
  }
};

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
