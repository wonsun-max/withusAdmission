const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query('SELECT "id", "university", "requirements" FROM "UniversityGuideline" ORDER BY "id"');
    console.log("Guidelines in DB:");
    for (const row of res.rows) {
      const requirementsObj = typeof row.requirements === 'string'
        ? JSON.parse(row.requirements)
        : row.requirements;
      const prompts = requirementsObj?.prompts || [];
      console.log(`- ID: ${row.id} | Univ: ${row.university} | Prompts Count: ${prompts.length}`);
      if (prompts.length > 0) {
        console.log(`  📝 Prompts:`, JSON.stringify(prompts));
      }
    }
  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await pool.end();
  }
}

main();
