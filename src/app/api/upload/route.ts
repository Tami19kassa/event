import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit

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
        { error: `File type "${file.type}" not supported. Allowed: JPG, PNG, WEBP, SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 15MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If running on Vercel or serverless (read-only filesystem) or if file is an image <= 5MB,
    // Base64 Data URL provides 100% persistence across ephemeral containers with 0 storage config.
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const mime = file.type || "image/png";

    if (isServerless || file.size <= 4 * 1024 * 1024) {
      const base64Url = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        url: base64Url,
        name: file.name,
        size: file.size,
        type: mime,
      });
    }

    // Local filesystem storage fallback for larger video/media
    try {
      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "_")
        .replace(/_+/g, "_");
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}-${safeName}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, uniqueName), buffer);

      return NextResponse.json({
        url: `/uploads/${uniqueName}`,
        name: file.name,
        size: file.size,
        type: mime,
      });
    } catch {
      // In case local write fails (e.g. read-only volume), fallback to Base64
      const fallbackUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        url: fallbackUrl,
        name: file.name,
        size: file.size,
        type: mime,
      });
    }
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
