const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT university, requirements FROM "UniversityGuideline"');
    
    console.log("=== 9 University Document Requirement Audit (RAW SQL) ===");
    res.rows.forEach(g => {
      console.log(`\n[${g.university}]`);
      const trackInfo = g.requirements.trackInfo || [];
      trackInfo.forEach(t => {
        console.log(`  Track: ${t.trackName}`);
        console.log(`  Required Docs: ${t.docs.join(', ')}`);
      });
      console.log("-----------------------------------");
    });
  } catch (err) {
    console.error("Audit Error:", err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();
