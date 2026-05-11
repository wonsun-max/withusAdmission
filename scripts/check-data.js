require('dotenv').config();
const { db } = require('../lib/db');

async function main() {
  try {
    const guidelines = await db.universityGuideline.findMany({
      select: {
        id: true,
        university: true,
        major: true,
        requirements: true
      }
    });

    console.log("=== University Guideline Audit (JS) ===");
    guidelines.forEach(g => {
      const requirements = g.requirements || {};
      console.log(`ID: ${g.id}`);
      console.log(`DB University: ${g.university}`);
      console.log(`DB Major: ${g.major}`);
      console.log(`AI Extracted Name: ${requirements.university}`);
      console.log("-----------------------------------");
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

main();
