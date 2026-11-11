import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/session";

const SESSION_COOKIE = "eventhub_session";

const ADMIN_ONLY_PREFIXES = [
  "/admin/users",
  "/admin/categories",
  "/admin/media",
  "/admin/inquiries",
  "/admin/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const verifiedUser = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const hasAdminAccess =
    verifiedUser && (verifiedUser.role === "ADMIN" || verifiedUser.role === "ORGANIZER");

  if (pathname === "/admin/login") {
    if (hasAdminAccess) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!hasAdminAccess) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    verifiedUser.role !== "ADMIN" &&
    ADMIN_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
