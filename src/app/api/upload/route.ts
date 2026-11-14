import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ALLOWED_MEDIA_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  sanitizeSvgMarkup,
  sanitizeUploadFilename,
} from "@/lib/media-security";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "ORGANIZER")) {
    return NextResponse.json({ error: "Authorization required" }, { status: 403 });
  }

  const rateCheck = checkRateLimit(`upload:${session.id}`, 30, 10 * 60 * 1000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `Upload rate limit reached. Please try again in ${rateCheck.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mime = file.type || "";
    if (!ALLOWED_MEDIA_MIME_TYPES.includes(mime)) {
      return NextResponse.json(
        { error: `File type "${mime}" not supported. Allowed: JPG, PNG, WEBP, GIF, SVG, MP4, WebM.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds 25MB limit." }, { status: 400 });
    }

    let buffer: Buffer = Buffer.from(await file.arrayBuffer());

    if (mime === "image/svg+xml") {
      const check = sanitizeSvgMarkup(buffer.toString("utf8"));
      if (!check.ok) {
        return NextResponse.json({ error: "Invalid SVG file." }, { status: 400 });
      }
      buffer = Buffer.from(check.sanitized, "utf8");
    }

    const safeName = sanitizeUploadFilename(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${safeName}`;

    // Priority 1: Vercel Blob CDN when BLOB_READ_WRITE_TOKEN is provisioned
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${uniqueName}`, buffer, {
        access: "public",
        contentType: mime,
      });
      return NextResponse.json({
        url: blob.url,
        name: file.name,
        size: buffer.length,
        type: mime,
        storage: "vercel-blob",
      });
    }

    // Priority 2: Writable filesystem (/public/uploads) in local / Node VPS environments
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (!isServerless) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, uniqueName), buffer);

      return NextResponse.json({
        url: `/uploads/${uniqueName}`,
        name: file.name,
        size: buffer.length,
        type: mime,
        storage: "local",
      });
    }

    // Priority 3: Read-only serverless fallback without Blob — reject video payloads & oversized assets
    if (mime.startsWith("video/")) {
      return NextResponse.json(
        {
          error:
            "Cloud video uploads require BLOB_READ_WRITE_TOKEN configured in Vercel, or paste an MP4/YouTube URL.",
        },
        { status: 400 }
      );
    }

    if (buffer.length > 2 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "File exceeds 2MB serverless inline fallback. Configure BLOB_READ_WRITE_TOKEN for large cloud uploads.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: `data:${mime};base64,${buffer.toString("base64")}`,
      name: file.name,
      size: buffer.length,
      type: mime,
      storage: "base64",
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
