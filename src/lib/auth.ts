import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
} from "@/lib/auth-token";

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function createToken(payload: Record<string, unknown>) {
  const email = typeof payload.email === "string" ? payload.email : "";
  return createAdminToken(email);
}

export async function verifyToken(token: string) {
  return verifyAdminToken(token);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function isAuthenticated(session: unknown): boolean {
  return session !== null;
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
