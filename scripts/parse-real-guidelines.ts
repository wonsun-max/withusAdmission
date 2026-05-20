import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GUIDELINES_DIR = "c:/Users/wonse/withusAdmission/guidelines";

const FILE_METADATA: Record<string, { slug: string; intake: "MARCH" | "SEPTEMBER"; nameKo: string }> = {
  "postect (9월).pdf": { slug: "postech", intake: "SEPTEMBER", nameKo: "포항공과대학교" },
  "경희대 모집요강 (3월).pdf": { slug: "khu", intake: "MARCH", nameKo: "경희대학교" },
  "고려대 모집요강 (3월).pdf": { slug: "korea", intake: "MARCH", nameKo: "고려대학교" },
  "서강대 모집요강 (3월).pdf": { slug: "sogang", intake: "MARCH", nameKo: "서강대학교" },
  "서울대 모집요강 (3월).pdf": { slug: "snu", intake: "MARCH", nameKo: "서울대학교" },
  "성균 모집요강 (3월).pdf": { slug: "skku", intake: "MARCH", nameKo: "성균관대학교" },
  "연세대 모집요강 (3월).pdf": { slug: "yonsei", intake: "MARCH", nameKo: "연세대학교" },
  "중앙대 모집요강 (3월).pdf": { slug: "cau", intake: "MARCH", nameKo: "중앙대학교" },
  "한양대 모집요강 (3월).pdf": { slug: "hanyang", intake: "MARCH", nameKo: "한양대학교" }
};

/**
 * Dynamic keyword-targeted multi-windowing to prevent OpenAI 429 TPM Rate Limits (30,000 token organization limit).
 * Scans the full PDF text for high-relevance keywords related to self-introductions (자소서) and document checklists,
 * slices targeted 8,000-character windows around them, and merges overlapping blocks to preserve context without high token volumes.
 * Always includes the first 5,000 characters of the document for cover-page and admission track metadata.
 * 
 * @param text The full raw text extracted from the PDF.
 * @returns A consolidated, context-dense text block matching the target tokens budget.
 */
function getRelevantTextWindow(text: string): string {
  const MAX_CHARS = 65000;
  if (text.length <= MAX_CHARS) {
    return text;
  }

  console.log(`📊 Text length (${text.length}) exceeds safety limit. Applying Keyword-Targeted Multi-Windowing...`);

  // Define target keywords that pinpoint where essay questions and document checklists live.
  const regex = /(자기소개서|자소서|수학계획서|personal statement|study plan|제출\s*서류)/gi;
  interface Range {
    start: number;
    end: number;
  }

  const ranges: Range[] = [];

  // Always seed the first 5,000 characters to capture the cover page, track rules, and general information.
  ranges.push({ start: 0, end: Math.min(5000, text.length) });

  let match;
  while ((match = regex.exec(text)) !== null) {
    const index = match.index;
    // Capture 1,000 characters before the match to catch section headers, and 3,000 after to cover multiple essay items.
    const start = Math.max(0, index - 1000);
    const end = Math.min(text.length, index + 3000);
    ranges.push({ start, end });
  }

  if (ranges.length === 1) {
    // If no keywords matched, fallback to standard Head-Tail smart windowing to avoid blank or insufficient text.
    console.log(`⚠️ No keyword matches found in guideline text. Falling back to Head-Tail Smart Windowing.`);
    const head = text.substring(0, 20000);
    const tail = text.substring(text.length - 45000);
    return `${head}\n\n[... TRUNCATED MIDDLE CONTENT TO CONSERVE TOKENS & PREVENT TPM LIMITS ...]\n\n${tail}`;
  }

  // Sort ranges by start index to prepare for interval merging.
  ranges.sort((a, b) => a.start - b.start);

  // Merge overlapping or adjacent ranges to eliminate duplicate text segments.
  const merged: Range[] = [];
  for (const range of ranges) {
    if (merged.length === 0) {
      merged.push(range);
    } else {
      const last = merged[merged.length - 1];
      if (range.start <= last.end) {
        last.end = Math.max(last.end, range.end);
      } else {
        merged.push(range);
      }
    }
  }

  // Build the final text block by joining the merged sectors with visible truncation markers.
  let result = "";
  let lastEnd = 0;
  for (const r of merged) {
    if (r.start > lastEnd) {
      result += `\n\n[... TRUNCATED SECTOR OF ${r.start - lastEnd} CHARS ...]\n\n`;
    }
    result += text.substring(r.start, r.end);
    lastEnd = r.end;
  }
  if (lastEnd < text.length) {
    result += `\n\n[... TRUNCATED SECTOR OF ${text.length - lastEnd} CHARS ...]`;
  }

  console.log(`💡 Keyword-Targeted Multi-Windowing consolidated text to ${result.length} characters.`);
  return result;
}

async function processFile(fileName: string, prisma: PrismaClient) {
  const meta = FILE_METADATA[fileName];
  if (!meta) {
    console.log(`⏩ Skipping unmapped file: ${fileName}`);
    return;
  }

  console.log(`\n==================================================`);
  console.log(`📄 Processing PDF: ${fileName} (${meta.nameKo})`);
  console.log(`==================================================`);

  const filePath = path.join(GUIDELINES_DIR, fileName);
  const dataBuffer = fs.readFileSync(filePath);
  const parsedPdf = await pdf(dataBuffer);
  
  console.log(`📊 Total characters extracted from PDF: ${parsedPdf.text.length}`);
  const relevantText = getRelevantTextWindow(parsedPdf.text);

  console.log(`🔮 Sending parsed text (${relevantText.length} chars) to GPT-4o...`);

  const systemPrompt = `You are a professional university admission consultant specializing in Korean university admissions for overseas students (3-year and 12-year special admissions - 3년 특례 및 12년 특례).

Analyze the provided university admission guideline text and extract:
1. The official name of the university in Korean.
2. The intake semester (either "MARCH" or "SEPTEMBER").
3. The track-specific rules, documents, and actual essay (자기소개서/자소서) questions.
   - You must support both 12-year special admission (SPECIAL_12YR / 12년 특례) and 3-year special admission (SPECIAL_3YR / 3년 특례).
   - If the university has official essay prompts, extract all questions, their prompt IDs, and character/word/byte limits. If there are no essay prompts (some universities do not require self-introduction letters for certain tracks), leave the essays list empty.
4. Core keywords representing the university's target talent persona (인재상) (extract 3-4 keywords).

Return a JSON object conforming exactly to this structure:
{
  "university": "공식 대학교명 (한글)",
  "intake": "MARCH" | "SEPTEMBER",
  "trackInfo": [
    {
      "trackName": "SPECIAL_12YR",
      "essays": [
        { "id": "1", "question": "실제 1번 질문 내용", "limit": "글자수 제한 (예: 1,000자 또는 3,000byte)" }
      ],
      "docs": [
        "제출해야 하는 서류 명칭 (예: 고등학교 졸업증명서, 성적증명서 등)"
      ]
    },
    {
      "trackName": "SPECIAL_3YR",
      "essays": [
        { "id": "1", "question": "실제 1번 질문 내용", "limit": "글자수 제한" }
      ],
      "docs": [
        "제출해야 하는 서류 명칭"
      ]
    }
  ],
  "prompts": [
    { "id": 1, "title": "실제 1번 질문 내용", "limit": 1000 }
  ],
  "keywords": ["인재상 키워드 1", "키워드 2", "키워드 3"]
}

Notes for extraction:
- In the "prompts" list, the "id" must be a number (1, 2, 3...), "title" must be the Korean question, and "limit" must be a number representing the character limit (e.g. if the limit is 1,000 characters or 3,000 bytes, set it to 1000). If no limit is mentioned, default to 1000.
- If the guideline text contains no essay (자소서) questions for a track, do not invent them. Leave the essays/prompts list empty.
- Ensure all extracted text is in neat, grammatical Korean, matching the official PDF guideline text exactly.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Here is the extracted text from the admission guideline of ${meta.nameKo}:\n\n${relevantText}` }
    ],
    response_format: { type: "json_object" },
    max_tokens: 2000
  });

  const structuredData = JSON.parse(response.choices[0].message.content || "{}");
  console.log(`✅ Extracted data for: ${structuredData.university}`);
  console.log(`🔑 Keywords: ${structuredData.keywords.join(", ")}`);
  console.log(`📝 Essays found: ${structuredData.prompts?.length || 0}`);

  // Create clean new guideline ID
  const newGuidelineId = `${meta.slug}_${meta.intake}_2026`;

  // 1. Upsert new general guideline
  await prisma.universityGuideline.upsert({
    where: { id: newGuidelineId },
    update: {
      university: meta.nameKo,
      requirements: structuredData as any,
      isActive: true,
      intake: meta.intake
    },
    create: {
      id: newGuidelineId,
      university: meta.nameKo,
      major: "General",
      intake: meta.intake,
      requirements: structuredData as any,
      isActive: true
    }
  });
  console.log(`💾 Seeded primary guideline: ${newGuidelineId}`);

  // 2. Synchronize to all matching pre-existing mock slots
  const oldGuidelines = await prisma.universityGuideline.findMany({
    where: {
      id: {
        startsWith: `${meta.slug}-`
      }
    }
  });

  for (const old of oldGuidelines) {
    console.log(`   🔄 Synchronizing real prompts to department slot: ${old.id}`);
    await prisma.universityGuideline.update({
      where: { id: old.id },
      data: {
        requirements: structuredData as any
      }
    });
  }
}

async function main() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in the environment!");
  }

  console.log("⚡ Starting database connection...");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
    console.log(`Found ${files.length} PDF guideline files in directory.`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await processFile(file, prisma);
        if (i < files.length - 1) {
          console.log("😴 Sleeping for 15 seconds to respect OpenAI TPM rate limits...");
          await delay(15000);
        }
      } catch (err: any) {
        console.error(`❌ Failed to process guideline file ${file}:`, err.message || err);
      }
    }

    console.log("\n🚀 All guidelines ingested and synchronized successfully!");

  } catch (error) {
    console.error("❌ Fatal Error in Guidelines Ingestion:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
