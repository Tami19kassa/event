import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/session";

const SESSION_COOKIE = "eventhub_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const verifiedUser = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const hasAdminAccess =
    verifiedUser && (verifiedUser.role === "ADMIN" || verifiedUser.role === "ORGANIZER");

  // Allow login page
  if (pathname === "/admin/login") {
    if (hasAdminAccess) {
      // Already logged in → redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (!hasAdminAccess) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
