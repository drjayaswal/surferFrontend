import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { unprotected_routes } from "./lib/const";
import { is_authenticated } from "./lib/authenticator";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = unprotected_routes.includes(pathname);

  const isAuth = await is_authenticated(request);

  const response = NextResponse.next();
  response.headers.set("x-middleware-cache", "no-cache");

  if (pathname === "/login" && isAuth) {
    const url = new URL("/", request.url);
    url.searchParams.set("message", "already-logged-in");
    return NextResponse.redirect(url);
  }

  if (!isPublicPath && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.png|site.webmanifest|Images|icon-512.png|signin).*)",
  ],
};
