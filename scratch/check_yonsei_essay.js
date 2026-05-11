const fs = require('fs');
const pdf = require('pdf-parse');

async function checkYonseiEssay() {
    try {
        const dataBuffer = fs.readFileSync('c:\\Users\\wonse\\withusAdmission\\guidelines\\연세대 모집요강 (3월).pdf');
        const data = await pdf(dataBuffer);
        
        console.log("--- YONSEI PDF CONTENT (Focus on Essay) ---");
        // '자기소개서' 키워드가 있는 주변 텍스트를 집중적으로 찾습니다.
        const essayIndex = data.text.indexOf("자기소개서");
        if (essayIndex !== -1) {
            console.log(data.text.substring(essayIndex - 500, essayIndex + 3000));
        } else {
            console.log("Keyword '자기소개서' not found. Printing first 5000 chars:");
            console.log(data.text.substring(0, 5000));
        }
        console.log("--- END ---");
    } catch (error) {
        console.error("Error:", error);
    }
}

checkYonseiEssay();
