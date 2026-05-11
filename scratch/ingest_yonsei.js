const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ingestYonsei() {
    console.log("Ingesting Yonsei University Guidelines...");
    const filePath = 'c:\\Users\\wonse\\withusAdmission\\guidelines\\연세대 모집요강 (3월).pdf';
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Extract Yonsei University (연세대학교) admission info for 12-year and 3-year special admission. 
                Include all essay prompts and character/byte limits.
                Return JSON format.`
            },
            {
                role: "user",
                content: text.substring(0, 15000)
            }
        ],
        response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log("Extracted Data:", JSON.stringify(result, null, 2));

    const id = "Yonsei_University_MARCH_2026";
    await prisma.universityGuideline.upsert({
        where: { id },
        update: {
            requirements: result,
            isActive: true
        },
        create: {
            id,
            university: "연세대학교",
            major: "General",
            intake: "MARCH",
            requirements: result,
            isActive: true
        }
    });

    console.log("Yonsei University Data Successfully Ingested to DB.");
}

ingestYonsei().catch(console.error);
