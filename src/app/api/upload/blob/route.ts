import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";
import { MAX_UPLOAD_BYTES } from "@/lib/media-security";

// Note: SVG deliberately omitted here so SVGs always pass through /api/upload script sanitization.
const BLOB_CLIENT_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob storage is not configured on this environment.", blobEnabled: false },
      { status: 501 }
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
          throw new Error("Admin authorization required");
        }
        return {
          allowedContentTypes: BLOB_CLIENT_MIMES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // URL returned directly to upload() caller on client
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err: any) {
    const message = err?.message || "Failed to authorize direct blob upload";
    const status = message.includes("Admin authorization") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
