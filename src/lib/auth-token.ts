import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const ADMIN_COOKIE_NAME = "kidorly-admin-token";

function getJwtSecret() {
  const value = process.env.JWT_SECRET;

  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }

  return new TextEncoder().encode(value);
}

export async function createAdminToken(email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
