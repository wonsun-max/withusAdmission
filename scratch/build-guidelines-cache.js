const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const GUIDELINES_DIR = "C:/Users/wonse/withusAdmission/guidelines";
const CACHE_DIR = path.join(GUIDELINES_DIR, "cache");

const SLUG_TO_FILE = {
  snu: "서울대 모집요강 (3월).pdf",
  yonsei: "연세대 모집요강 (3월).pdf",
  korea: "고려대 모집요강 (3월).pdf",
  postech: "postect (9월).pdf",
  sogang: "서강대 모집요강 (3월).pdf",
  skku: "성균 모집요강 (3월).pdf",
  hanyang: "한양대 모집요강 (3월).pdf",
  "chung-ang": "중앙대 모집요강 (3월).pdf",
  kyunghee: "경희대 모집요강 (3월).pdf",
};

async function buildCacheForSlug(slug, fileName) {
  const filePath = path.join(GUIDELINES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`[WARN] File not found for ${slug}: ${filePath}`);
    return;
  }

  console.log(`[INFO] Parsing ${fileName} for university ${slug}...`);
  const dataBuffer = fs.readFileSync(filePath);
  const parsedPdf = await pdf(dataBuffer);
  const text = parsedPdf.text;

  // Search and extract matching sections
  // We want to extract passages containing keywords like "자기소개서", "자소서", "제출 서류", "지원 자격", "일정"
  const keywords = ["자기소개서", "자소서", "제출서류", "제출 서류", "지원자격", "지원 자격", "일정", "전형", "글자수"];
  const lines = text.split("\n");
  const extractedParagraphs = [];
  
  // Basic smart extraction: find lines containing keywords and grab context
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const matchesKeyword = keywords.some(k => line.toLowerCase().includes(k));
    if (matchesKeyword) {
      // Grab 5 lines before and 10 lines after for context
      const start = Math.max(0, i - 4);
      const end = Math.min(lines.length, i + 12);
      const chunk = lines.slice(start, end).join("\n");
      extractedParagraphs.push(chunk);
      // Skip ahead to avoid duplicates
      i += 8;
    }
  }

  // Deduplicate and join chunks
  const uniqueChunks = Array.from(new Set(extractedParagraphs));
  const fullExtracted = uniqueChunks.join("\n\n---\n\n");

  // Keep a maximum size to fit in context window comfortably
  const limitedText = fullExtracted.slice(0, 15000); 

  const cachePath = path.join(CACHE_DIR, `${slug}.md`);
  fs.writeFileSync(cachePath, `# 2026 ${slug.toUpperCase()} 모집요강 핵심 정보\n\n${limitedText}`);
  console.log(`[SUCCESS] Saved cache to ${cachePath} (${limitedText.length} characters)`);
}

async function main() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  for (const [slug, fileName] of Object.entries(SLUG_TO_FILE)) {
    try {
      await buildCacheForSlug(slug, fileName);
    } catch (err) {
      console.error(`[ERROR] Failed to process ${slug}:`, err);
    }
  }
  console.log("[INFO] Guidelines cache building completed.");
}

main().catch(console.error);
