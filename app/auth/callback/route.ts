import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 리다이렉트할 경로 (기본값은 워크스페이스)
  const next = searchParams.get("next") ?? "/b2c/workspace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // DB 유저 정보 동기화
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { db } = await import("@/lib/db");
        await db.user.upsert({
          where: { email: user.email! },
          update: { 
            fullName: user.user_metadata.full_name || user.email!.split("@")[0] 
          },
          create: {
            id: user.id, // Supabase UUID와 일치시킴
            email: user.email!,
            fullName: user.user_metadata.full_name || user.email!.split("@")[0],
            role: "STUDENT",
          },
        });
      }

      // 환경 변수 또는 요청 origin을 기반으로 베이스 URL 결정
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
      const redirectUrl = new URL(next, baseUrl);
      
      console.log(`Redirecting to: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  return NextResponse.redirect(new URL("/login?error=auth_failed", baseUrl));
}
