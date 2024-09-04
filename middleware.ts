import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./auth";

const protectedRoutes = ["/dashboard", "/teacher"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const signInUrl = new URL("/auth/sign-in", request.nextUrl);

    // Set the callback URL to redirect back after sign-in
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);

    console.log("Redirecting to sign-in:", signInUrl.href); // Debug log

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
