import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

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

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPG, PNG, WebP, AVIF, or GIF." },
        { status: 415 },
      );
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image must be smaller than 8 MB." },
        { status: 413 },
      );
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").slice(0, 80) || "kidorly";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, safeFolder);

    const media = await prisma.media.create({
      data: {
        url: result.url,
        publicId: result.publicId,
        filename: file.name || null,
        folder: safeFolder,
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
