import { db } from "../lib/db";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GUIDELINES_DIR = path.resolve(process.cwd(), "guidelines");

async function processGuideline(fileName: string) {
  console.log(`\n--- Processing: ${fileName} ---`);
  const filePath = path.join(GUIDELINES_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Extract university admission info for 12-year and 3-year special admission. 
        JSON structure: { university, trackInfo: [{ trackName, essays: [{ id, question, limit }], docs: [name] }], intake: "MARCH" }`
      },
      {
        role: "user",
        content: text.substring(0, 25000)
      }
    ],
    response_format: { type: "json_object" }
  });

  const structuredData = JSON.parse(response.choices[0].message.content || "{}");
  const id = `${structuredData.university.replace(/\s+/g, '_')}_MARCH_2026`;

  await db.universityGuideline.upsert({
    where: { id },
    update: {
      requirements: structuredData as any,
      isActive: true,
      intake: "MARCH"
    },
    create: {
      id,
      university: structuredData.university,
      major: "General",
      intake: "MARCH",
      requirements: structuredData as any,
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
    } catch (error: any) {
      console.error(`Failed to process ${file}:`, error.message);
    }
  }
}

main()
  .catch((e) => {
    console.error("Fatal error in seed script:", e);
    process.exit(1);
  });
