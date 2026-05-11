const fs = require('fs');
const pdf = require('pdf-parse');

async function dumpFullText() {
    try {
        const dataBuffer = fs.readFileSync('c:\\Users\\wonse\\withusAdmission\\guidelines\\연세대 모집요강 (3월).pdf');
        const data = await pdf(dataBuffer);
        fs.writeFileSync('c:\\Users\\wonse\\withusAdmission\\scratch\\yonsei_full_text.txt', data.text);
        console.log("Full text dumped to scratch/yonsei_full_text.txt");
        console.log("Text length:", data.text.length);
    } catch (error) {
        console.error("Error:", error);
    }
}

dumpFullText();
