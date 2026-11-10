import { upload } from "@vercel/blob/client";
import { sanitizeUploadFilename } from "@/lib/media-security";

async function optimizeImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1400;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const outName = file.name.replace(/\.[^.]+$/, ".webp");
              resolve(new File([blob], outName, { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.86
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaAsset(file: File): Promise<string> {
  const prepared = await optimizeImageFile(file);
  const canTryDirectBlob =
    prepared.type !== "image/svg+xml" &&
    (prepared.type.startsWith("video/") || prepared.size > 3 * 1024 * 1024);

  if (canTryDirectBlob) {
    try {
      const blob = await upload(`uploads/${sanitizeUploadFilename(prepared.name)}`, prepared, {
        access: "public",
        handleUploadUrl: "/api/upload/blob",
        contentType: prepared.type,
      });
      if (blob?.url) return blob.url;
    } catch (err: any) {
      const msg = String(err?.message || "");
      // Fall through cleanly if Blob storage is unconfigured in local/staging envs
      if (msg.includes("403") || msg.includes("Admin authorization")) {
        throw err;
      }
    }
  }

  const formData = new FormData();
  formData.append("file", prepared);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }
  return data.url;
}
