import type { NextRequest } from "next/server";

export async function is_authenticated(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return !!token;
}
