import { db } from "./lib/db";

async function test() {
  try {
    const guidelines = await db.universityGuideline.findMany({
      where: { isActive: true }
    });
    console.log("Guidelines found:", guidelines.length);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

test();
