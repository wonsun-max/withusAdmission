import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const schools = [
    { name: "서울대학교", slug: "snu", depts: ["컴퓨터공학부", "경영대학", "산업공학과"] },
    { name: "연세대학교", slug: "yonsei", depts: ["컴퓨터과학과", "경영학과", "산업공학과"] },
    { name: "고려대학교", slug: "korea", depts: ["컴퓨터학과", "경영대학", "산업경영공학부"] },
    { name: "서강대학교", slug: "sogang", depts: ["컴퓨터공학전공", "경영학전공"] },
    { name: "성균관대학교", slug: "skku", depts: ["소프트웨어학과", "경영학과", "글로벌경영학과"] },
    { name: "한양대학교", slug: "hanyang", depts: ["컴퓨터소프트웨어학부", "경영학부", "산업공학과"] },
    { name: "중앙대학교", slug: "cau", depts: ["소프트웨어학부", "경영학부"] },
    { name: "경희대학교", slug: "khu", depts: ["컴퓨터공학과", "경영학과", "산업경영공학과"] },
    { name: "한국외국어대학교", slug: "hufs", depts: ["컴퓨터공학부", "경영학부"] },
    { name: "서울시립대학교", slug: "uos", depts: ["컴퓨터과학부", "경영학부"] },
    { name: "이화여자대학교", slug: "ewha", depts: ["컴퓨터공학전공", "경영학부"] },
    { name: "KAIST", slug: "kaist", depts: ["전산학부", "산업및시스템공학과"] },
    { name: "POSTECH", slug: "postech", depts: ["컴퓨터공학과", "산업경영공학과"] }
  ];

  const commonPrompts = {
    cs: [
      { id: 1, title: "전공 관련 학업 역량 및 활동 (알고리즘, 프로젝트 등)", limit: 1500 },
      { id: 2, title: "기술을 통한 사회적 문제 해결 경험", limit: 1000 },
      { id: 3, title: "향후 IT 리더로서의 포부 및 계획", limit: 1000 }
    ],
    ceo: [
      { id: 1, title: "리더십 발휘 경험 및 조직 관리 역량", limit: 1500 },
      { id: 2, title: "경제/경영 관련 탐구 활동 및 논리적 사고", limit: 1000 },
      { id: 3, title: "창업가 정신 및 비즈니스 모델 제안", limit: 1000 }
    ]
  };

  console.log("🚀 Seeding 13 Universities (CS & CEO tracks)...");

  for (const school of schools) {
    for (const dept of school.depts) {
      const isCs = dept.includes("컴퓨터") || dept.includes("소프트웨어") || dept.includes("전산");
      const id = `${school.slug}-${dept.replace(/\s+/g, "")}-2025`;

      await prisma.universityGuideline.upsert({
        where: { id },
        update: {
          university: school.name,
          major: dept,
          requirements: {
            track: "SPECIAL_12YR",
            prompts: isCs ? commonPrompts.cs : commonPrompts.ceo,
            keywords: isCs ? ["코딩", "문제해결", "혁신"] : ["리더십", "전략", "경영심리"]
          }
        },
        create: {
          id,
          university: school.name,
          major: dept,
          requirements: {
            track: "SPECIAL_12YR",
            prompts: isCs ? commonPrompts.cs : commonPrompts.ceo,
            keywords: isCs ? ["코딩", "문제해결", "혁신"] : ["리더십", "전략", "경영심리"]
          }
        }
      });
    }
  }

  console.log("✨ Seed complete. 13 Universities with CS/CEO tracks added.");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
