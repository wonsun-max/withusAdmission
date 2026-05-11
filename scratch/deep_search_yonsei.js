const fs = require('fs');
const pdf = require('pdf-parse');

async function findYonseiEssayDeep() {
    try {
        const dataBuffer = fs.readFileSync('c:\\Users\\wonse\\withusAdmission\\guidelines\\연세대 모집요강 (3월).pdf');
        const data = await pdf(dataBuffer);
        const text = data.text;

        const keywords = ["자기소개서", "문항", "자 이내", "작성", "글로벌인재", "재외국민"];
        console.log("--- YONSEI DEEP SEARCH ---");
        
        for (const kw of keywords) {
            let index = text.indexOf(kw);
            while (index !== -1) {
                console.log(`\n[Found Keyword: ${kw} at index ${index}]`);
                console.log(text.substring(index - 200, index + 800));
                index = text.indexOf(kw, index + 1000); // 다음 위치 찾기
            }
        }
        console.log("--- END ---");
    } catch (error) {
        console.error("Error:", error);
    }
}

findYonseiEssayDeep();
