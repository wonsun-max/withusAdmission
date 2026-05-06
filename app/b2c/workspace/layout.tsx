import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await db.studentProfile.findUnique({
    where: { userId: user.id }
  });

  if (profile?.status === "ONBOARDING") {
    redirect("/b2c/onboarding");
  }

  return <>{children}</>;
}
