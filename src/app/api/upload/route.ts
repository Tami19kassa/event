import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not supported. Allowed: JPG, PNG, WEBP, SVG, MP4, WebM.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 25MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_+/g, "_");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}-${safeName}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", uniqueName);

    await writeFile(uploadPath, buffer);

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
