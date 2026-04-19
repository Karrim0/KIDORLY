import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "kidorly";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, folder);

    const media = await prisma.media.create({
      data: {
        url: result.url,
        publicId: result.publicId,
        filename: file.name || null,
        folder,
      },
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      id: media.id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    if (error?.message?.includes("not configured")) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Check your .env file." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}