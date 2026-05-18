import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import ChatWorkspaceClient from "@/components/chat-workspace";
import { AppNav } from "@/components/app-nav";

export default async function EssayChatPage({ params }: { params: { essayId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Next.js compatibility for params
  const resolvedParams = await Promise.resolve(params);
  const essayId = resolvedParams.essayId;

  // Fetch Essay and Guidelines
  const essay = await db.essay.findUnique({
    where: { id: essayId },
    include: {
      guideline: true,
    },
  });

  if (!essay || essay.studentId !== user.id) {
    redirect("/b2c/workspace");
  }

  return (
    <div className="app-shell flex h-screen overflow-hidden bg-surface-pearl">
      <AppNav mode="student" locale="ko" />
      <main className="flex-1 flex flex-col h-full overflow-hidden animate-in">
        <ChatWorkspaceClient essay={essay} />
      </main>
    </div>
  );
}
