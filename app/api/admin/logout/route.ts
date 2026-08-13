import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isHttps } from "@/lib/adminAuth";

// Posted to directly by the navbar Logout form, so it redirects rather than
// returning JSON.
export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", secure: isHttps(request), maxAge: 0 });
  return res;
}
