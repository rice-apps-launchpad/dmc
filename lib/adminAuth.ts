import { createHmac, timingSafeEqual } from "crypto";

/** Cookie that marks a browser as authorized for the admin panel. */
export const ADMIN_COOKIE = "dmc_admin_auth";

/**
 * Deterministic session token derived from ADMIN_PASSWORD. Storing this in the
 * cookie (rather than the password itself) keeps the password out of the
 * browser, needs no session store, and changing ADMIN_PASSWORD in .env
 * invalidates every existing cookie at once. Returns null if ADMIN_PASSWORD is
 * unset, in which case all admin access is denied (fail closed).
 */
export function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("dmc-admin-session").digest("hex");
}

/** Constant-time comparison that also handles unset/missing values. */
function safeEqual(a: string | undefined, b: string | null): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function isValidAdminCookie(value: string | undefined): boolean {
  return safeEqual(value, adminToken());
}

export function isCorrectPassword(password: string): boolean {
  return safeEqual(password, process.env.ADMIN_PASSWORD ?? null);
}

/**
 * Whether the client connection is HTTPS, so the auth cookie can carry the
 * Secure flag automatically in production without breaking plain-HTTP local
 * testing. Behind the Apache TLS proxy the request reaches Next over HTTP, so
 * trust X-Forwarded-Proto (first hop) when present.
 */
export function isHttps(request: Request): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) return forwardedProto.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}
