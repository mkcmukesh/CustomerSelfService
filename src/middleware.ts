// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthed = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !isAuthed) {
    const url = new URL("/api/auth/signin", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
