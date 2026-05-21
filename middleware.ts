import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware — v2: 인증 없이 모든 경로 허용.
 * /spec 과 /universities만 존재. 루트는 /spec 으로 리다이렉트.
 */
export async function middleware(request: NextRequest) {
  // 루트 → /spec 리다이렉트
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/spec", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
