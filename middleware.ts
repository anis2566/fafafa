import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./auth";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const signInUrl = new URL("/auth/sign-in", request.nextUrl);

    signInUrl.searchParams.set("callback", request.nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  } else {
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
