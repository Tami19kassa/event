import jsQR from "jsqr";

export async function decodeQrFromVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<string | null> {
  if (video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return null;
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) return null;

  const Detector = typeof window !== "undefined" ? (window as any).BarcodeDetector : undefined;
  if (Detector) {
    try {
      const detector = new Detector({ formats: ["qr_code"] });
      const codes = await detector.detect(video);
      if (codes?.[0]?.rawValue) return String(codes[0].rawValue);
    } catch {
      // Fall through cleanly to pure-JS decoder
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const found = jsQR(imgData.data, width, height, { inversionAttempts: "dontInvert" });
  return found?.data || null;
}

export async function decodeQrFromImageFile(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const found = jsQR(imgData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth",
    });
    return found?.data || null;
  } finally {
    bitmap.close();
  }
}
