const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GUIDELINES_DIR = "c:/Users/wonse/withusAdmission/guidelines";

async function processGuideline(fileName) {
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
        Focus on:
        1. Essay prompts and their limits.
        2. Required documents.
        3. Intake (March).
        Return JSON.`
      },
      {
        role: "user",
        content: `Text:\n\n${text.substring(0, 15000)}`
      }
    ],
    response_format: { type: "json_object" }
  });

  console.log(`\n### ${fileName} 분석 결과 ###`);
  console.log(response.choices[0].message.content);
}

async function main() {
  const files = fs.readdirSync(GUIDELINES_DIR).filter(f => f.endsWith(".pdf"));
  for (const file of files) {
    try {
      await processGuideline(file);
    } catch (error) {
      console.error(`Error: ${file}`, error.message);
    }
  }
}

main();
