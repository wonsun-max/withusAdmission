import { db } from "../lib/db";

async function main() {
  const guidelines = await db.universityGuideline.findMany({
    select: {
      id: true,
      university: true,
      major: true,
      requirements: true
    }
  });

  console.log("=== University Guideline Audit ===");
  guidelines.forEach(g => {
    const requirements = g.requirements as any;
    console.log(`ID: ${g.id}`);
    console.log(`DB University: ${g.university}`);
    console.log(`DB Major: ${g.major}`);
    console.log(`AI Extracted Name: ${requirements.university}`);
    console.log("-----------------------------------");
  });
}

main().catch(console.error).finally(() => process.exit(0));
