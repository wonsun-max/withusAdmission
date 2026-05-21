const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const studentsRes = await pool.query('SELECT * FROM "StudentProfile"');
    console.log(`Total Student Profiles: ${studentsRes.rowCount}`);
    for (const s of studentsRes.rows) {
      console.log("\n--- Student Profile ---");
      console.log(JSON.stringify(s, null, 2));

      // Get applications
      const appsRes = await pool.query('SELECT * FROM "UniversityApplication" WHERE "studentId" = $1', [s.userId]);
      console.log(`Applications for ${s.userId}:`);
      console.log(JSON.stringify(appsRes.rows, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
