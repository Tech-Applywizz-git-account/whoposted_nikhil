import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? decrypt(cookie) : null;

  // 1. Handle root path redirect
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Handle auth pages redirect (don't show login/signup if already logged in)
  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // 🔒 Protect user routes
  const protectedRoutes = ["/role-analysis", "/company-analysis", "/overview", "/api/company", "/api/domain", "/api/overview", "/api/job-posts-today"];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/overview/:path*",
    "/role-analysis/:path*",
    "/company-analysis/:path*",
    "/top-performers/:path*",
    "/data-explorer/:path*",
    "/api/company/:path*",
    "/api/domain/:path",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
  runtime: "nodejs", // important since you’re using crypto
};
