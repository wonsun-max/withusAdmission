import { openai } from "@/lib/openai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export class DocumentParserService {
  static async parseFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    let extractedText = "";

    if (mimeType === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (mimeType.startsWith("image/")) {
      // Return base64 for images so GPT-4o Vision can read it directly
      return `data:${mimeType};base64,${buffer.toString("base64")}`;
    } else {
      // Try to read as plain text for other file types like txt, csv
      extractedText = buffer.toString("utf-8");
    }

    return extractedText;
  }

  static async extractStructuredData(file: File) {
    const parsedContent = await this.parseFile(file);
    const isImage = parsedContent.startsWith("data:image/");

    const messages: any[] = [
      {
        role: "system",
        content: `당신은 세계 최고 수준의 입시 전략가이자 데이터 분석가입니다. 
학생이 업로드한 서류(성적표, 활동 보고서 등)를 분석하여 학생의 '입시 페르소나'를 정의하고 모든 정보를 체계적으로 구조화하십시오.

응답은 반드시 다음 구조를 포함하는 JSON이어야 합니다:
{
  "persona": {
    "title": "학생을 한 문장으로 정의하는 브랜드 타이틀",
    "summary": "학생의 강점, 관심사, 잠재력을 포함한 종합적인 서사적 요약 (3-4문장)",
    "interests": ["핵심 관심 키워드 3-4개"],
    "strengths": ["분석된 핵심 역량 3개"]
  },
  "academic": {
    "currentGrade": "학년 정보",
    "gpa": "평점 정보",
    "trajectory": "성적 추이 및 학업적 특징 분석",
    "subjects": [{ "name": "과목명", "score": "성적", "significance": "이 과목 성적이 갖는 의미", "confidence": 0.0~1.0 }]
  },
  "activities": [{ "name": "활동명", "role": "역할", "period": "기간", "impact": "활동의 가치 및 배운 점" }],
  "awards": [{ "name": "수상명", "date": "날짜", "significance": "수상이 증명하는 역량" }]
}

단순히 텍스트를 옮기는 것이 아니라, 학생의 입시 경쟁력을 높일 수 있는 방향으로 데이터를 '해석'하고 '구조화'하세요.`,
      }
    ];

    if (isImage) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "이 이미지로 된 성적표/서류에서 입시 데이터를 정교하게 추출하여 JSON으로 반환하세요." },
          { type: "image_url", image_url: { url: parsedContent } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: `다음 서류 내용에서 입시 데이터를 정교하게 추출하여 JSON으로 반환하세요:\n\n${parsedContent}`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }
}
