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
  console.log(`Processing: ${fileName}...`);
  const filePath = path.join(GUIDELINES_DIR, fileName);
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert admission consultant. Extract key recruitment information from the provided text.
        Return a JSON object matching this structure:
        {
          "university": "University Name in Korean",
          "intake": "MARCH",
          "major": "General (모집 단위 전체)",
          "requirements": {
            "essayPrompts": [
              { "id": "1", "question": "Question text", "limit": "Character/Byte limit" }
            ],
            "requiredDocs": [
              { "name": "Document Name", "description": "Notes", "isRequired": true }
            ],
            "selectionCriteria": "Brief summary of evaluation method"
          }
        }`
      },
      {
        role: "user",
        content: `Extract info from this text (Focus on 3-year and 12-year special admission):\n\n${text.substring(0, 15000)}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const structuredData = JSON.parse(response.choices[0].message.content || "{}");
  
  // Use a predictable ID based on university and intake
  const id = `${structuredData.university.replace(/\s+/g, '_')}_MARCH_2026`;

  await prisma.universityGuideline.upsert({
    where: { id },
    update: {
      requirements: structuredData.requirements,
      isActive: true,
      intake: "MARCH"
    },
    create: {
      id,
      university: structuredData.university,
      major: structuredData.major,
      intake: "MARCH",
      requirements: structuredData.requirements,
      isActive: true
    }
  });

  console.log(`Successfully ingested: ${structuredData.university}`);
  return structuredData;
}

async function main() {
  const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
  const results = [];

  for (const file of files) {
    try {
      const result = await processGuideline(file);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }

  console.log("Ingestion Complete.");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
