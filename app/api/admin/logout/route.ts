import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isHttps } from "@/lib/adminAuth";

// Posted to directly by the navbar Logout form, so it redirects rather than
// returning JSON.
export async function POST(request: Request) {
  // request.url resolves to the internal localhost:3000 origin behind the
  // Apache reverse proxy, not the public host, even with ProxyPreserveHost
  // On — so build the redirect target from the Host header (which Apache
  // does forward correctly) instead of request.url.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = isHttps(request) ? "https" : "http";
  const res = NextResponse.redirect(new URL("/admin/login", `${protocol}://${host}`), 303);
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", secure: isHttps(request), maxAge: 0 });
  return res;
}
