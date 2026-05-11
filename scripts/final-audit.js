const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();


async function main() {
  try {
    const guidelines = await prisma.universityGuideline.findMany();
    
    console.log("=== 9 University Document Requirement Audit (Standalone) ===");
    guidelines.forEach(g => {
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
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
