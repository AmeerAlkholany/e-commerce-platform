import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get session cookie
  const session = request.cookies.get("session")?.value;
  let payload = null;

  if (session) {
    try {
      payload = await verifyJWT(session);
    } catch (error) {
      console.error("JWT verification failed in middleware:", error);
    }
  }

  // 2. Redirect authenticated users away from auth pages
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
      return NextResponse.next();
    }

    if (!payload || payload.role !== "admin") {
      const redirectUrl = payload ? "/" : "/login";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 4. Protect private client routes
  const isProtectedRoute = pathname.startsWith("/profile") || pathname.startsWith("/dashboard");
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/profile/:path*", "/dashboard/:path*"],
};
