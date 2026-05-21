import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 미들웨어 — Supabase 세션 갱신 + 인증 보호.
 *
 * Why: SSR 환경에서 쿠키 기반 세션을 매 요청마다 갱신해야 토큰 만료 시
 * 자동으로 재발급됩니다. 로그인하지 않은 유저는 /login으로 보냅니다.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (반드시 getUser() 호출 필요)
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 루트 → /spec 리다이렉트
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/spec", request.url));
  }

  // 공개 경로 (인증 불필요)
  const publicPaths = ["/login", "/auth", "/terms", "/privacy"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // 비로그인 유저가 보호된 경로 접근 시 → 로그인 페이지
  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 유저가 /login 접근 시 → /spec으로
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/spec", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
