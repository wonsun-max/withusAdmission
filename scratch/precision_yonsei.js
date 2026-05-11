const fs = require('fs');
const pdf = require('pdf-parse');

async function extractYonseiQuestions() {
    try {
        const dataBuffer = fs.readFileSync('c:\\Users\\wonse\\withusAdmission\\guidelines\\연세대 모집요강 (3월).pdf');
        const data = await pdf(dataBuffer);
        const text = data.text;

        console.log("--- YONSEI ESSAY QUESTION SEARCH ---");
        
        // 자소서 문항의 전형적인 패턴 검색
        const patterns = [/1\.\s+.+?자\s+이내/g, /2\.\s+.+?자\s+이내/g, /3\.\s+.+?자\s+이내/g];
        
        for (const pattern of patterns) {
            const matches = text.match(pattern);
            if (matches) {
                console.log(`Found pattern match: ${matches[0]}`);
            }
        }

        // 특정 키워드 주변 텍스트 덤프
        const keywords = ["1.", "2.", "3.", "글자수"];
        for (const kw of keywords) {
            let index = text.indexOf(kw);
            while (index !== -1) {
                if (text.substring(index, index + 20).includes("이내")) {
                    console.log(`\n--- Potential Question at index ${index} ---`);
                    console.log(text.substring(index - 50, index + 500));
                }
                index = text.indexOf(kw, index + 1);
            }
        }
        
        console.log("--- END ---");
    } catch (error) {
        console.error("Error:", error);
    }
}

extractYonseiQuestions();
