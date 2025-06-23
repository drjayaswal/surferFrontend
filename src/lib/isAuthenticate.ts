import type { NextRequest } from "next/server";

export async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return !!token;
}
