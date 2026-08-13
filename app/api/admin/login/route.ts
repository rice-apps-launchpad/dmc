import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isCorrectPassword, isHttps } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = body?.password;
  const token = adminToken();

  if (!token || typeof password !== "string" || !isCorrectPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isHttps(request),
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
