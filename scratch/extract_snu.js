const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        console.log("--- TEXT START ---");
        // 처음 5000자만 출력해서 구조 확인
        console.log(data.text.substring(0, 5000));
        console.log("--- TEXT END ---");
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

const filePath = 'c:\\Users\\wonse\\withusAdmission\\guidelines\\서울대 모집요강 (3월).pdf';
extractText(filePath);
