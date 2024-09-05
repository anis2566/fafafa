import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./auth";
import { Role } from "@prisma/client";

const protectedRoutes = ["/dashboard", "/teacher"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isTeacherRoute = request.nextUrl.pathname.startsWith("/teacher");

  const isTeacher = session?.user.role === Role.Teacher;

  if (!session && isProtected) {
    const signInUrl = new URL("/auth/sign-in", request.nextUrl);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    if (request.nextUrl.pathname !== "/auth/sign-in") {
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isTeacherRoute && !isTeacher) {
    const applyUrl = new URL("/teacher/apply", request.nextUrl);

    if (request.nextUrl.pathname !== "/teacher/apply") {
      return NextResponse.redirect(applyUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
