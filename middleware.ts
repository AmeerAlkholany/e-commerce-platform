import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip non-admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 2. Development Bypass
if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
    return NextResponse.next();
  }

  // 3. Get session cookie
  const session = request.cookies.get("session")?.value;

  if (!session) {
    // Redirect to login if trying to access admin
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Verify JWT and check role
  try {
    const payload = await verifyJWT(session);
    if (!payload || payload.role !== "admin") {
      // Forbidden if not admin
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
