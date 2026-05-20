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
        academicRecords: true,
        activities: true,
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
   * Updates the student's spec (GPA, academic records, and activities).
   */
  static async updateSpec(userId: string, data: {
    gpa?: number;
    academicRecords?: Array<{ subject: string; grade: string; credit?: number }>;
    activities?: Array<{ title: string; description: string }>;
  }) {
    // 1. Update GPA
    const profile = await db.studentProfile.update({
      where: { userId },
      data: {
        gpa: data.gpa,
      },
    });

    // 2. Update Academic Records (Replace all for simplicity, or upsert)
    if (data.academicRecords) {
      await db.academicRecord.deleteMany({ where: { studentId: userId } });
      if (data.academicRecords.length > 0) {
        await db.academicRecord.createMany({
          data: data.academicRecords.map(r => ({
            studentId: userId,
            subject: r.subject,
            grade: r.grade,
            credit: r.credit || 1,
          })),
        });
      }
    }

    // 3. Update Activities
    if (data.activities) {
      await db.activity.deleteMany({ where: { studentId: userId } });
      if (data.activities.length > 0) {
        await db.activity.createMany({
          data: data.activities.map(a => ({
            studentId: userId,
            title: a.title,
            description: a.description,
          })),
        });
      }
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

    // Advanced logic: Map school-specific names to standard types with high-precision keywords
    const checklist = requirements.map((track: any) => ({
      trackName: track.trackName,
      docs: track.docs.map((reqDocName: string) => {
        const lowerName = reqDocName.toLowerCase();
        
        // Comprehensive mapping dictionary for Korean top universities
        const match = studentDocs.find(sd => {
          const typeStr = sd.type.toString().toLowerCase();
          
          // 1. Exact or Partial Type match
          if (lowerName.includes(typeStr) || typeStr.includes(lowerName)) return true;
          
          // 2. Keyword-based synonyms (English & Korean)
          const synonyms: Record<string, string[]> = {
            TRANSCRIPT: ["성적", "grade", "academic record", "school record"],
            GRADUATION: ["졸업", "graduation", "degree", "diploma"],
            QUALIFICATION: ["출입국", "entry", "exit", "qualification", "exam form"],
            PASSPORT: ["여권", "passport", "id card"],
            LANGUAGE: ["한국어", "topik", "language", "proficiency", "ielts", "toefl"],
            ACTIVITY: ["활동", "activity", "award", "club", "service", "봉사", "수상"],
            TEST_SCORE: ["학력평가", "test score", "sat", "ap", "ib", "act"],
            APPLICATION: ["원서", "application"],
            CONSENT: ["동의서", "consent"],
            ATTENDANCE: ["재학", "attendance", "enrollment"],
            SCHOOL_INFO: ["학사일정", "calendar", "school info"],
            SCHOOL_PROFILE: ["프로파일", "profile", "curriculum"]
          };

          const keywords = synonyms[sd.type] || [];
          return keywords.some(k => lowerName.includes(k));
        });
        
        return {
          name: reqDocName,
          status: match ? "ATTACHED" : "MISSING",
          documentId: match?.id,
          type: match?.type || "OTHER"
        };
      })
    }));

    return checklist;
  }
}
