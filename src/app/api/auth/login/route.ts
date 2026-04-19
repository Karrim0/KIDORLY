import { NextResponse } from "next/server";
import { createToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Admin credentials from environment variables
// In production, store hashed password in DB
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kidorly.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({ email, role: "admin" });
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
