const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log("=== CHECKING UNIVERSITY GUIDELINES ===");
    const guidelinesRes = await pool.query('SELECT "id", "university", "major", "intake" FROM "UniversityGuideline" ORDER BY "university", "major", "intake"');
    console.log(`Total guidelines in DB: ${guidelinesRes.rowCount}`);
    for (const row of guidelinesRes.rows) {
      console.log(`- ID: ${row.id} | Univ: ${row.university} | Major: ${row.major} | Intake: ${row.intake}`);
    }

    console.log("\n=== CHECKING UNIVERSITY APPLICATIONS (Student Choices) ===");
    const appsRes = await pool.query(`
      SELECT a."id", a."studentId", u."fullName" as "studentName", a."guidelineId", g."university", g."major", a."status"
      FROM "UniversityApplication" a
      JOIN "StudentProfile" s ON a."studentId" = s."userId"
      JOIN "User" u ON s."userId" = u."id"
      JOIN "UniversityGuideline" g ON a."guidelineId" = g."id"
      ORDER BY u."fullName", g."university"
    `);
    console.log(`Total applications in DB: ${appsRes.rowCount}`);
    for (const row of appsRes.rows) {
      console.log(`- App ID: ${row.id} | Student: ${row.studentName} (${row.studentId}) | Univ: ${row.university} | Major: ${row.major} | Guideline ID: ${row.guidelineId} | Status: ${row.status}`);
    }

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await pool.end();
  }
}

main();
