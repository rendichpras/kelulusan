import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const limiter = new Map<string, { count: number; last: number }>();
const WINDOW = 60_000;
const LIMIT = 10;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anon";
    const now = Date.now();
    const item = limiter.get(ip);

    if (item) {
      if (now - item.last < WINDOW && item.count >= LIMIT) {
        return new NextResponse("Terlalu banyak percobaan. Coba lagi nanti.", { status: 429 });
      }
      if (now - item.last > WINDOW) {
        limiter.set(ip, { count: 1, last: now });
      } else {
        item.count++;
      }
    } else {
      limiter.set(ip, { count: 1, last: now });
    }
  }

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/((?!_next|.*\\..*).*)",
  ],
};