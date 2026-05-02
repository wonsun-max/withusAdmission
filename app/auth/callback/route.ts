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

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
