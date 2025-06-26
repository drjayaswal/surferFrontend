import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UNPROTECTED_ROUTES } from "./lib/const";
import { isAuthenticated } from "./lib/isAuthenticate";

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // const isPublicPath = UNPROTECTED_ROUTES.includes(pathname);

  // const isAuth = await isAuthenticated(request);

  // const response = NextResponse.next();
  // response.headers.set("x-middleware-cache", "no-cache");

  // // Handle login redirect if already authenticated
  // if (pathname === "/login" && isAuth) {
  //   const url = new URL("/", request.url);
  //   url.searchParams.set("message", "already-logged-in");
  //   return NextResponse.redirect(url);
  // }

  // // Handle unauthenticated access to protected routes
  // if (!isPublicPath && !isAuth) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.png|site.webmanifest|Images|icon-512.png|signin).*)",
  ],
};
