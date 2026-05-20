import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import UniversityDashboardClient from "@/components/university-dashboard";

export default async function UniversityPage({ params }: { params: { guidelineId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Next.js compatibility for params
  const resolvedParams = await Promise.resolve(params);
  const guidelineId = resolvedParams.guidelineId;

  // 1. Fetch Guideline
  const guideline = await db.universityGuideline.findUnique({
    where: { id: guidelineId },
  });

  if (!guideline) {
    redirect("/b2c/workspace");
  }

  // 2. Fetch or Create Application Slot
  let application = await db.universityApplication.findUnique({
    where: {
      studentId_guidelineId: {
        studentId: user.id,
        guidelineId: guideline.id,
      }
    }
  });

  if (!application) {
    application = await db.universityApplication.create({
      data: {
        studentId: user.id,
        guidelineId: guideline.id,
      }
    });
  }

  // 3. Fetch or Create Essay Session
  let essay = await db.essay.findFirst({
    where: {
      studentId: user.id,
      guidelineId: guideline.id,
    },
    include: { guideline: true }
  });

  if (!essay) {
    essay = await db.essay.create({
      data: {
        studentId: user.id,
        guidelineId: guideline.id,
      },
      include: { guideline: true }
    });
  }

  // 4. Fetch full student profile
  const profile = await db.studentProfile.findUnique({
    where: { userId: user.id },
    include: { documents: true }
  });

  return (
    <UniversityDashboardClient 
      application={application} 
      guideline={guideline} 
      essay={essay}
      profile={profile}
    />
  );
}
