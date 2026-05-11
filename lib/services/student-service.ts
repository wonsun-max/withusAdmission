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
        applications: {
          include: {
            guideline: true,
          },
        },
        essays: {
          include: {
            guideline: true,
          },
        },
      },
    });
  }

  /**
   * Updates all workspace state fields and syncs university applications.
   */
  static async updateWorkspaceState(userId: string, data: {
    selectedThemeId?: string;
    storyAnswer?: string;
    targetGuidelineIds?: string[];
    track?: AdmissionTrack;
    status?: string;
  }) {
    // 1. Basic profile updates
    const profile = await db.studentProfile.update({
      where: { userId },
      data: {
        selectedThemeId: data.selectedThemeId,
        storyAnswer: data.storyAnswer,
        track: data.track ? (data.track as Track) : undefined,
        status: data.status,
      },
    });

    // 2. Sync University Applications if guideline IDs provided
    if (data.targetGuidelineIds) {
      // Add new ones
      for (const gid of data.targetGuidelineIds) {
        await db.universityApplication.upsert({
          where: { studentId_guidelineId: { studentId: userId, guidelineId: gid } },
          update: {},
          create: { studentId: userId, guidelineId: gid }
        });
      }

      // Optionally: Delete ones not in the list (if user removed a university)
      await db.universityApplication.deleteMany({
        where: {
          studentId: userId,
          guidelineId: { notIn: data.targetGuidelineIds }
        }
      });
    }

    return profile;
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
   * Marks a document as approved.
   */
  static async approveDocument(documentId: string) {
    return db.document.update({
      where: { id: documentId },
      data: { isApproved: true },
    });
  }

  /**
   * Computes the submission checklist for a specific university application.
   * Maps Global Vault docs to School-specific requirements.
   */
  static async getSubmissionChecklist(applicationId: string) {
    const app = await db.universityApplication.findUnique({
      where: { id: applicationId },
      include: {
        guideline: true,
        student: {
          include: { documents: true }
        }
      }
    });

    if (!app) throw new Error("Application not found");

    const requirements = (app.guideline.requirements as any).trackInfo || [];
    const studentDocs = app.student.documents.filter(d => d.isApproved);

    // Map each requirement to the student's vault
    const checklist = requirements.map((track: any) => ({
      trackName: track.trackName,
      docs: track.docs.map((reqDocName: string) => {
        // Advanced logic: Try to find a matching document by type or name
        const match = studentDocs.find(sd => 
          sd.type.toString().toLowerCase().includes(reqDocName.toLowerCase()) ||
          reqDocName.toLowerCase().includes(sd.type.toString().toLowerCase())
        );
        
        return {
          name: reqDocName,
          status: match ? "ATTACHED" : "MISSING",
          documentId: match?.id,
          type: match?.type
        };
      })
    }));

    return checklist;
  }
}
