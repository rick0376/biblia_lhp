import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const existingVisitorId = request.cookies.get("visitor_id")?.value;

  if (existingVisitorId) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  response.cookies.set("visitor_id", crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)",
  ],
};
