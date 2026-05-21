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
학생이 업로드한 서류(성적표, 활동 보고서, 출입국 사실 증명, 여권, 공인 시험 성적 등)를 분석하여 모든 정보를 극도로 정교하고 구체적으로 추출하십시오.

[중요 지침 - 요약 절대 금지 (NO NARRATIVE COMPRESSION)]
1. 절대로 정보를 요약하거나, 그룹화하여 뭉뚱그리지 마십시오.
2. 서류상에 나열된 모든 개별 과목 성적, 개별 수상 실적, 개별 동아리 활동, 개별 봉사 시간, 개별 체류 및 출입국 기간을 하나하나 생략 없이 개별 배열 아이템으로 보존해야 합니다. 
3. 성적표(Academic Transcript)의 경우, 학년(Grade 10, 11, 12) 및 학기(1학기/1st Semester, 2학기/2nd Semester, Full Year 등)별로 이수한 과목과 성적, 단위수(Credit/Unit), 교사의견(Teacher Comment) 또는 성적 특징을 각각 고유한 개체로 완벽히 분류하십시오.
4. 봉사활동(Volunteer)은 일반 활동(Activities)과 엄격히 분류하여 봉사 기관명, 구체적인 시간, 역할 및 봉사 활동 상세 내용을 빠짐없이 추출하십시오.
5. 해외 체류(Residency) 기간은 출입국 기록이나 재학 기간 증명서 등을 바탕으로 각 출국/입국 기간(from, to)과 해당 국가를 빠짐없이 타임라인식 배열로 추출하십시오.

응답은 반드시 다음 구조를 포함하는 JSON이어야 합니다:
{
  "persona": {
    "title": "학생을 한 문장으로 정의하는 브랜드 타이틀",
    "summary": "학생의 강점, 관심사, 잠재력을 포함한 종합적인 서사적 요약 (3-4문장)",
    "interests": ["핵심 관심 키워드 3-4개"],
    "strengths": ["분석된 핵심 역량 3개"]
  },
  "personalInfo": {
    "name": "학생 한글/영문 성명",
    "dateOfBirth": "생년월일 (YYYY-MM-DD)",
    "nationality": "국적 (예: 대한민국, 미국)",
    "currentCountry": "현재 거주 또는 재학 국가"
  },
  "academic": {
    "currentGrade": "현재 학년 정보",
    "school": "재학 고등학교명",
    "curriculum": "이수 교육과정 (예: IB, AP, 한국 교육과정, A-Level 등)",
    "gpa": "누적 GPA 또는 전체 평점",
    "gpaScale": "GPA 만점 기준 (예: 4.0, 4.5, 100)",
    "trajectory": "성적 추이 및 학업적 성취 특징 분석",
    "subjects": [
      {
        "name": "과목명",
        "score": "성적/등급",
        "significance": "이 과목 성적이 갖는 입시적 의미 또는 성취 요약",
        "confidence": 0.95
      }
    ],
    "semesters": [
      {
        "grade": "학년 (예: 10, 11, 12)",
        "semester": "학기 (예: 1st Semester, 2nd Semester, Full Year)",
        "courses": [
          {
            "name": "구체적 교과목명 (예: AP Calculus BC)",
            "score": "취득 성적/점수 (예: A, 95, 5점)",
            "unit": "이수 단위수/크레딧 (예: 1.0, 5학점) - 기재되지 않은 경우 null 또는 공백",
            "teacherComment": "과목 세부 능력 및 교사 의견 또는 세특사항 원문/요약"
          }
        ]
      }
    ]
  },
  "activities": [
    {
      "name": "활동명/동아리명",
      "role": "역할 (예: 회장, 부장, 부원, 주전)",
      "period": "활동 기간 (예: 10학년, 2024.03 - 2025.02)",
      "description": "구체적인 활동 수행 내용, 주도적인 기여, 배운 점 등의 상세 서술 (절대 요약이나 축소 금지)",
      "impact": "활동이 학업/인성적 성장에 미친 가치 및 입시 평가"
    }
  ],
  "volunteers": [
    {
      "organization": "봉사기관명 또는 봉사 활동 분야",
      "hours": "구체적인 누적 봉사 시간 (예: 45시간, 2 hours/week)",
      "period": "봉사 활동 기간",
      "description": "수행한 봉사 활동 내역 및 구체적 역할 상세 서술",
      "impact": "봉사를 통해 사회 및 본인에게 미친 영향력과 배운 점"
    }
  ],
  "awards": [
    {
      "name": "수상 실적 명칭",
      "date": "수상 시기 (예: 2024.05 또는 11학년 1학기)",
      "rank": "수상 등급/순위 (예: 1등상, 금상, Grand Prize, Honorable Mention)",
      "description": "어떤 대회인지, 참가 규모, 본인의 수상 기여도 등 상세 내역",
      "significance": "수상이 증명하는 학술적/비교과적 탁월성 평가"
    }
  ],
  "tests": [
    {
      "exam": "공인 시험명 (예: SAT, AP, IB, TOEFL, ACT 등)",
      "score": "점수/등급",
      "date": "시험 취득 일자 (예: 2024.05)"
    }
  ],
  "residency": {
    "totalYears": "총 해외 체류/재학 연수 (예: 12년, 3년 6개월)",
    "countries": ["체류 국가 목록"],
    "periods": [
      {
        "country": "국가명",
        "from": "출국 또는 시작일 (YYYY-MM-DD)",
        "to": "입국 또는 종료일 (YYYY-MM-DD)"
      }
    ],
    "eligibility12yr": true,
    "eligibility3yr": false,
    "notes": "출입국 증명 및 재학 기록을 토대로 판정한 3년/12년 특례 자격 특이사항 기술"
  }
}

텍스트를 기계적으로 나열하지 말고, 각 데이터가 원본 서류에 있는 그대로를 가감 없이 고스란히 담아내도록 정밀하게 파싱하세요.`,
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
