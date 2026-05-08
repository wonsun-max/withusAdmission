import { openai } from "@/lib/openai";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export class DocumentParserService {
  static async parseFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    let extractedText = "";

    if (mimeType === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
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
        content: `당신은 최고 수준의 글로벌 입시 전문 서류 분석 AI입니다. 
학생이 업로드한 문서(Word, PDF, 이미지 등)를 읽고, 입시에 필요한 핵심 데이터를 식별하여 정형화된 JSON 포맷으로 추출하십시오.
추출해야 할 주요 정보: 요약(summary), 평점/성적(gpa), 과목별 성적(subjects), 비교과 활동(extracurriculars), 수상내역(awards).
반드시 JSON 객체 형태로 응답하세요.`,
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
