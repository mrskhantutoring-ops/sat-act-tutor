import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "sat_session";
const ADMIN_COOKIE = "sat_admin";

/** Returns the logged-in user, or null. Safe to call from server components and API routes. */
export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { passwordHash: _ignored, ...safeUser } = session.user;
  return safeUser;
}

/** Creates a 30-day session and sets the httpOnly cookie. */
export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { token, userId, expiresAt } });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Destroys the current session. */
export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { token } });
  cookies().delete(SESSION_COOKIE);
}

/**
 * Admin auth: the /admin dashboard is protected by a shared ADMIN_TOKEN env var.
 * After entering the token once, an httpOnly cookie holding the token is set;
 * API routes compare it against the env var on every request.
 */
export function setAdminCookie(token: string) {
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE);
}

/** Works for both App Router Request objects and next/headers in server components. */
export function isAdminCookieValid(cookieHeader: string | null): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token || !cookieHeader) return false;
  const match = cookieHeader.match(/(?:^|;\s*)sat_admin=([^;]+)/);
  return !!match && decodeURIComponent(match[1]) === token;
}

export function isAdminFromHeaders(): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return cookies().get(ADMIN_COOKIE)?.value === token;
}
