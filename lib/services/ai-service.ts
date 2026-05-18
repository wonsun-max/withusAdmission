import { openai } from "@/lib/openai";
import { StudentService } from "./student-service";

export class AIService {
  /**
   * Evaluates a student's profile using OpenAI based on their OCR data.
   */
  static async evaluateProfile(studentId: string) {
    const student = await StudentService.getProfile(studentId);
    if (!student) throw new Error("Student not found");

    const recentOcrData = student.documents
      .filter((d: any) => d.type === "TRANSCRIPT" && d.isApproved)
      .map((d: any) => d.ocrData)
      .filter(Boolean);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `당신은 대한민국 재외국민 특별전형 전문 입시 컨설턴트입니다. 
          학생의 성적표(OCR)를 분석하여 다음 JSON 구조로 결과를 반환하세요:
          { 
            "mode": "medical" | "general", 
            "strengths": string[], 
            "weaknesses": string[], 
            "criticalWeakness": string,
            "overallSummary": string,
            "themes": [{ "id": string, "title": string, "angle": string, "evidence": string[], "question": string }]
          }`,
        },
        {
          role: "user",
          content: `학생 트랙: ${student.track}\n성적 데이터: ${JSON.stringify(recentOcrData)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Update status in DB
    await StudentService.updateWorkspaceState(studentId, { status: "EVALUATION_COMPLETE" });
    
    return result;
  }

  /**
   * Generates story themes for the student.
   */
  static async buildStoryThemes(studentId: string) {
    // Similar logic to evaluateProfile but focused on themes
    // For now, evaluateProfile already returns themes
    return this.evaluateProfile(studentId);
  }
}
