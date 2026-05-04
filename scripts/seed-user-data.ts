import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

async function main() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const targetEmail = "wonsunpro123444@gmail.com";
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  console.log(`📡 Seeding data for: ${targetEmail}`);

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false } 
  });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });
  
  try {
    // 1. Create or Update User
    const user = await db.user.upsert({
      where: { email: targetEmail },
      update: {
        role: "STUDENT",
        fullName: "Won Sun",
      },
      create: {
        email: targetEmail,
        fullName: "Won Sun",
        role: "STUDENT",
      },
    });

    console.log(`✅ User found/created: ${user.id}`);

    // 2. Create or Update Student Profile
    const profile = await db.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        track: "SPECIAL_12YR",
        status: "OCR_REVIEW",
      },
      create: {
        userId: user.id,
        track: "SPECIAL_12YR",
        status: "OCR_REVIEW",
      },
    });

    console.log(`✅ Student Profile updated: ${profile.userId}`);

    // 3. Ensure a University Guideline exists to link an essay
    const guideline = await db.universityGuideline.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" }, // Using a fixed ID for seed consistency
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        university: "Seoul National University",
        major: "Computer Science",
        requirements: {
          questions: [
            "Please describe your motivation and effort in academic study.",
            "Please describe your extracurricular activities."
          ],
          charLimit: 1500
        },
        isActive: true
      }
    });

    console.log(`✅ University Guideline ensured: ${guideline.university}`);

    // 4. (Optional) Create a dummy document if you want to test OCR flow
    const document = await db.document.create({
      data: {
        studentId: profile.userId,
        uploaderId: user.id,
        type: "TRANSCRIPT",
        storagePath: "seed/transcript.pdf",
        isApproved: false,
        ocrData: {
          gpa: "3.95/4.0",
          subjects: [
            { name: "AP Computer Science", score: "5" },
            { name: "AP Calculus BC", score: "5" }
          ]
        }
      }
    });

    console.log(`✅ Sample Document created: ${document.id}`);

    console.log("\n🚀 Seeding Complete for wonsunpro123444@gmail.com!");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
  } finally {
    await db.$disconnect();
    await pool.end();
    process.exit();
  }
}

main();
