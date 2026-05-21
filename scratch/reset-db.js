const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const drops = [
      'DROP TABLE IF EXISTS "EssayMessage" CASCADE',
      'DROP TABLE IF EXISTS "EssaySession" CASCADE',
      'DROP TABLE IF EXISTS "SpecDocument" CASCADE',
      'DROP TABLE IF EXISTS "StudentSpec" CASCADE',
      'DROP TABLE IF EXISTS "User" CASCADE',
      'DROP TABLE IF EXISTS "Document" CASCADE',
      'DROP TABLE IF EXISTS "StudentProfile" CASCADE',
      'DROP TABLE IF EXISTS "UniversityApplication" CASCADE',
      'DROP TABLE IF EXISTS "UniversityGuideline" CASCADE',
      'DROP TABLE IF EXISTS "_prisma_migrations" CASCADE',
      'DROP TYPE IF EXISTS "MessageRole" CASCADE',
      'DROP TYPE IF EXISTS "Role" CASCADE',
      'DROP TYPE IF EXISTS "Track" CASCADE',
      'DROP TYPE IF EXISTS "AnalysisStatus" CASCADE',
    ];

    for (const sql of drops) {
      console.log("Executing:", sql);
      await client.query(sql);
    }

    await client.query("COMMIT");
    console.log("✅ All tables and types dropped successfully.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Error:", e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
