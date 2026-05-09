import { db } from "@/lib/db";
import type { StudentProfile as StudentProfileType, AdmissionTrack } from "@/lib/admission-types";
import { Track } from "@prisma/client";

export class StudentService {
  /**
   * Fetches the complete student profile including documents and essays.
   */
  static async getProfile(userId: string) {
    return db.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        documents: true,
        essays: {
          include: {
            guideline: true,
          },
        },
      },
    });
  }

  /**
   * Updates the student's admission track and status.
   */
  static async updateTrack(userId: string, track: AdmissionTrack) {
    return db.studentProfile.update({
      where: { userId },
      data: {
        track: track as Track,
      },
    });
  }

  /**
   * Updates the pipeline status of the student.
   */
  static async updateStatus(userId: string, status: string) {
    return db.studentProfile.update({
      where: { userId },
      data: { status },
    });
  }

  /**
   * Fetches all documents for a student.
   */
  static async getDocuments(studentId: string) {
    return db.document.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Updates all workspace state fields in one transaction.
   */
  static async updateWorkspaceState(userId: string, data: {
    selectedThemeId?: string;
    storyAnswer?: string;
    targetGuidelineIds?: string[];
    evaluationResult?: any;
    track?: AdmissionTrack;
    status?: string;
  }) {
    return db.studentProfile.update({
      where: { userId },
      data: {
        ...data,
        track: data.track ? (data.track as Track) : undefined,
      },
    });
  }

  /**
   * Marks a document as approved and extracts facts (OCR data).
   */
  static async approveDocument(documentId: string) {
    return db.document.update({
      where: { id: documentId },
      data: { isApproved: true },
    });
  }
}
