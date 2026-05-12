import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const role = (user as any)?.role;

  // Admin + QR — doar ADMIN și OWNER
  if (pathname.startsWith("/admin") || pathname.startsWith("/qr")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Captain — doar CAPTAIN, ADMIN, OWNER
  if (pathname.startsWith("/captain")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "CAPTAIN" && role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Dashboard + Matches — orice user logat
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/matches")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/matches/:path*",
    "/qr/:path*",
    "/qr",
    "/captain/:path*",
    "/captain",
  ],
};