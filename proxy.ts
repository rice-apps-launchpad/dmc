import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/adminAuth";

/**
 * True for routes that require the admin cookie. Admin screens are all
 * guarded except the login page; API routes are guarded except the three
 * calls the patron-facing kiosk makes (browse forms, submit a checkout).
 */
function requiresAdmin(pathname: string, method: string): boolean {
  if (pathname.startsWith("/admin")) return pathname !== "/admin/login";

  if (pathname === "/api/forms" && method === "GET") return false;
  if (/^\/api\/forms\/[^/]+$/.test(pathname) && method === "GET") return false;
  if (pathname === "/api/submissions" && method === "POST") return false;

  return true;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (requiresAdmin(pathname, request.method) && !isValidAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    // Browsers get the login page; API callers get a plain 401.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next({ request });
}

export const config = {
  // /api/admin (login/logout) is deliberately not matched, and the kiosk
  // routes under /kiosk stay open.
  matcher: [
    "/admin/:path*",
    "/api/forms",
    "/api/forms/:path*",
    "/api/submissions",
    "/api/submissions/:path*",
    "/api/upload",
  ],
};
