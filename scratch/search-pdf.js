const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const GUIDELINES_DIR = "c:/Users/wonse/withusAdmission/guidelines";
const OUTPUT_FILE = "c:/Users/wonse/withusAdmission/scratch/pdf_search_results.txt";

async function checkFile(fileName, stream) {
  const filePath = path.join(GUIDELINES_DIR, fileName);
  const dataBuffer = fs.readFileSync(filePath);
  const parsedPdf = await pdf(dataBuffer);
  const text = parsedPdf.text;

  stream.write(`\n========================================\n`);
  stream.write(`Checking file: ${fileName}\n`);
  stream.write(`Total text length: ${text.length}\n`);

  const keywords = ["자기소개서", "자소서", "자기소개", "수학계획서", "personal statement", "study plan"];
  let found = false;

  for (const keyword of keywords) {
    let index = 0;
    while ((index = text.toLowerCase().indexOf(keyword.toLowerCase(), index)) !== -1) {
      found = true;
      stream.write(`\n🔍 Found "${keyword}" at index ${index}:\n`);
      const start = Math.max(0, index - 150);
      const end = Math.min(text.length, index + 350);
      const snippet = text.substring(start, end).replace(/\s+/g, " ");
      stream.write(`... ${snippet} ...\n`);
      index += keyword.length;
    }
  }

  if (!found) {
    stream.write(`❌ No mention of self-introduction keywords in ${fileName}\n`);
  }
}

async function main() {
  const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
  const stream = fs.createWriteStream(OUTPUT_FILE);
  
  for (const file of files) {
    try {
      await checkFile(file, stream);
    } catch (e) {
      stream.write(`❌ Error processing ${file}: ${e.message}\n`);
    }
  }
  
  stream.end();
  console.log(`Finished checking all PDFs. Results written to ${OUTPUT_FILE}`);
}

main().catch(console.error);
