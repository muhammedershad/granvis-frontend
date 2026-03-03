import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = [
  "/super-admin",
  "/admin",
  "/manager",
  "/accountant",
  "/employee",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/accountant/:path*",
    "/employee/:path*",
  ],
};
