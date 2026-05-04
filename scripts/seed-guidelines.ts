import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const TARGET_GUIDELINES = [
  {
    id: "snu-SPECIAL_12YR-2026",
    university: "Seoul National University",
    major: "Biomedical Engineering",
    questions: ["Describe the academic or personal experience that shaped your intended field of study."],
  },
  {
    id: "yonsei-SPECIAL_12YR-2026",
    university: "Yonsei University",
    major: "Medicine",
    questions: ["Describe your motivation and preparation for medical school."],
  },
  {
    id: "korea-SPECIAL_3YR-2026",
    university: "Korea University",
    major: "Global Studies",
    questions: ["How do your global experiences contribute to your major fit?"],
  }
];

async function main() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  console.log(`📡 Seeding University Guidelines (String IDs)...`);

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false } 
  });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });
  
  try {
    for (const g of TARGET_GUIDELINES) {
      await db.universityGuideline.upsert({
        where: { id: g.id },
        update: {
          university: g.university,
          major: g.major,
          requirements: {
            questions: g.questions,
            charLimit: 1000
          }
        },
        create: {
          id: g.id,
          university: g.university,
          major: g.major,
          requirements: {
            questions: g.questions,
            charLimit: 1000
          }
        }
      });
      console.log(`✅ Seeded: ${g.id}`);
    }

    console.log(`\n🚀 Guidelines Seeding Complete!`);

  } catch (error) {
    console.error("❌ Seeding Failed:", error);
  } finally {
    await db.$disconnect();
    await pool.end();
    process.exit();
  }
}

main();
