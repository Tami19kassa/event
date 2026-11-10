export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
] as const;

export const ALLOWED_MEDIA_MIME_TYPES: readonly string[] = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
];

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB

export function sanitizeUploadFilename(name: string): string {
  const safe = (name || "upload.bin")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+/, "");
  return safe || "upload.bin";
}

export function sanitizeSvgMarkup(rawSvg: string): { ok: boolean; sanitized: string } {
  const trimmed = rawSvg.trim();
  if (!/<svg[\s>]/i.test(trimmed)) {
    return { ok: false, sanitized: "" };
  }

  const cleaned = trimmed
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<script[^>]*\/\s*>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<(iframe|object|embed)[\s\S]*?(?:<\/\1>|\/\s*>)/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:href|xlink:href|src)\s*=\s*(?:"\s*(?:javascript|vbscript):[^"]*"|'\s*(?:javascript|vbscript):[^']*')/gi, "");

  if (!/<svg[\s>]/i.test(cleaned)) {
    return { ok: false, sanitized: "" };
  }

  return { ok: true, sanitized: cleaned };
}
