import { NextResponse } from "next/server";
import { createToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

// Admin credentials from environment variables
// In production, store hashed password in DB
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
  try {
    const rateLimit = consumeRateLimit(`admin-login:${getClientIp(request)}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }

    const { email, password } = await request.json();

    if (!ADMIN_EMAIL || (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD)) {
      console.error("Admin credentials are not configured");
      return NextResponse.json({ success: false, error: "Login is not configured" }, { status: 503 });
    }

    const passwordMatches = process.env.ADMIN_PASSWORD_HASH
      ? await bcrypt.compare(String(password || ""), process.env.ADMIN_PASSWORD_HASH)
      : password === process.env.ADMIN_PASSWORD;

    if (email !== ADMIN_EMAIL || !passwordMatches) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({ email, role: "admin" });
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
