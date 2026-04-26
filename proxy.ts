import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 🔒 Routes admin — ADMIN uniquement
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 🔒 Routes utilisateur connecté
  if (pathname.startsWith("/checkout") || pathname.startsWith("/orders")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${pathname}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/orders/:path*"],
};
