import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

async function main() {
  const adminEmail = "admin@withus.ai";
  
  // DIRECT_URL이 없으면 DATABASE_URL 사용
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  console.log(`📡 Connecting to: ${connectionString?.split('@')[1]} (Redacted password)`);

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false } 
  });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });
  
  try {
    const admin = await db.user.upsert({
      where: { email: adminEmail },
      update: {
        role: "SUPER_ADMIN",
      },
      create: {
        email: adminEmail,
        fullName: "WithUs Super Admin",
        role: "SUPER_ADMIN",
      },
    });

    console.log("✅ DB Connection & Admin Creation Success!");
    console.log(`- Email: ${admin.email}`);
    console.log(`- Role: ${admin.role}`);
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  } finally {
    await db.$disconnect();
    await pool.end();
    process.exit();
  }
}

main();
