import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { is_authenticated } from "./lib/authenticator";
import { unprotected_routes } from "./lib/const";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const isPublicPath = unprotected_routes.includes(pathname);

    // Check auth
    const isAuth = await is_authenticated(request);

    // Try to extract role from token
    const token = request.cookies.get("access_token")?.value;

    const response = NextResponse.next();
    response.headers.set("x-middleware-cache", "no-cache");

    // 1. Redirect logged-in users away from /login
    if (pathname === "/login" && isAuth) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // 2. Block access to protected routes if not authenticated
    if (!isPublicPath && !isAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch (err) {
    console.error("[MIDDLEWARE] Unexpected error:", err);
    return NextResponse.redirect(new URL("/error", request.url)); // Optional fallback
  }
}
export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.png|site.webmanifest|Images|icon-512.png|signin).*)",
  ],
};
