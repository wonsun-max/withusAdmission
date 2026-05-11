import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GUIDELINES_DIR = "c:/Users/wonse/withusAdmission/guidelines";

async function processGuideline(fileName: string) {
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
}

async function main() {
  const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
  for (const file of files) {
    try {
      await processGuideline(file);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
