const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// Prisma 7.x uses 'datasourceUrl' instead of 'datasources'
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GUIDELINES_DIR = "c:/Users/wonse/withusAdmission/guidelines";

async function processGuideline(fileName) {
  console.log(`\n--- Processing: ${fileName} ---`);
  const filePath = path.join(GUIDELINES_DIR, fileName);
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Extract university admission info for 12-year and 3-year special admission.
        JSON structure:
        {
          "university": "University Name (Korean)",
          "trackInfo": [
            {
              "trackName": "e.g., 12년 특례",
              "essays": [{ "id": "1", "question": "Question text", "limit": "Limit" }],
              "docs": ["Document 1", "Document 2"]
            }
          ],
          "intake": "MARCH"
        }`
      },
      {
        role: "user",
        content: text.substring(0, 30000)
      }
    ],
    response_format: { type: "json_object" }
  });

  const structuredData = JSON.parse(response.choices[0].message.content || "{}");
  const id = `${structuredData.university.replace(/\s+/g, '_')}_MARCH_2026`;

  await prisma.universityGuideline.upsert({
    where: { id },
    update: {
      requirements: structuredData,
      isActive: true,
      intake: "MARCH"
    },
    create: {
      id,
      university: structuredData.university,
      major: "General",
      intake: "MARCH",
      requirements: structuredData,
      isActive: true
    }
  });

  console.log(`Successfully ingested to DB: ${structuredData.university}`);
  return structuredData;
}

async function main() {
  const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
  for (const file of files) {
    try {
      await processGuideline(file);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error.message);
    }
  }
  console.log("\n### ALL UNIVERSITIES INGESTED SUCCESSFULLY ###");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
