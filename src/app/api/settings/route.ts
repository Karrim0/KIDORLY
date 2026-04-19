import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/settings?keys=key1,key2
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keysParam = searchParams.get("keys");

  if (!keysParam) {
    return NextResponse.json({ error: "Missing keys parameter" }, { status: 400 });
  }

  const keys = keysParam.split(",").map((k) => k.trim());
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;

  return NextResponse.json(map);
}

// POST /api/settings (admin only) — upsert multiple settings
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data: Record<string, string> = await request.json();

    for (const [key, value] of Object.entries(data)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
