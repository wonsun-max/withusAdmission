const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query('SELECT * FROM "UniversityGuideline" LIMIT 5');
    console.log("Guidelines Requirements Structure:");
    for (const row of res.rows) {
      console.log(`\nID: ${row.id} | Univ: ${row.university} | Major: ${row.major}`);
      console.log("Requirements:", JSON.stringify(row.requirements, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
