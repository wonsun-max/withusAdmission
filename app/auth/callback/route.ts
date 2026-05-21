import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";

/**
 * GET /auth/callback
 * Supabase OAuth 콜백 핸들러.
 *
 * Why: Google OAuth 완료 후 Supabase가 이 경로로 리다이렉트합니다.
 * 여기서 세션 쿠키를 교환하고, 최초 로그인 시 우리 DB에 User 레코드를 생성합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/spec";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { id, email, user_metadata } = data.user;
      const fullName = user_metadata?.full_name || user_metadata?.name || email?.split("@")[0] || "학생";

      // 최초 로그인 시 우리 DB에 User 레코드 upsert
      // Why: Supabase Auth와 우리 Prisma DB를 동기화해야 StudentSpec FK가 작동합니다.
      await db.user.upsert({
        where: { id },
        create: { id, email: email!, fullName },
        update: { fullName },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 오류 시 로그인 페이지로 돌려보냄
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
