import { parseDocumentWithUpstage } from "@/lib/upstage";
import { db } from "@/lib/db";
import { StudentService } from "./student-service";

export class OCRService {
  /**
   * Processes a document upload: saves to DB and parses with Upstage.
   */
  static async processUpload(userId: string, file: File) {
    // 1. Parse with Upstage
    const ocrData = await parseDocumentWithUpstage(file);

    // 2. Persist to DB
    // In a real app, we'd upload to Supabase Storage first and get a path
    const storagePath = `transcripts/${Date.now()}_${file.name}`;

    const doc = await db.document.create({
      data: {
        studentId: userId,
        uploaderId: userId,
        type: "TRANSCRIPT",
        storagePath,
        ocrData,
        isApproved: false,
      },
    });

    await StudentService.updateStatus(userId, "OCR_REVIEW");

    return {
      documentId: doc.id,
      ocrData,
    };
  }
}
