"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X, QrCode, AlertCircle } from "lucide-react";
import { decodeQrFromImageFile, decodeQrFromVideoFrame } from "@/lib/qr-decoder";
import { extractOrderNumber } from "@/lib/orders-admin-helpers";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}

export function QrScannerModal({ open, onClose, onDetected }: ModalProps) {
  const [status, setStatus] = useState<"starting" | "scanning" | "error">("starting");
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopStream = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      stopStream();
      return;
    }

    let cancelled = false;
    setStatus("starting");
    setErrorMsg("");

    const bootCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setErrorMsg("Camera access requires HTTPS or a supported browser. You can upload a QR screenshot below.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("scanning");

        const loop = async () => {
          if (cancelled || !streamRef.current || !videoRef.current || !canvasRef.current) return;
          try {
            const raw = await decodeQrFromVideoFrame(videoRef.current, canvasRef.current);
            if (raw) {
              stopStream();
              onDetected(extractOrderNumber(raw));
              onClose();
              return;
            }
          } catch {}
          if (!cancelled) timerRef.current = window.setTimeout(loop, 90);
        };
        timerRef.current = window.setTimeout(loop, 120);
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Camera permission blocked or no webcam detected. Use QR image upload or manual pass lookup.");
        }
      }
    };

    bootCamera();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, onClose, onDetected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErrorMsg("");
    try {
      const raw = await decodeQrFromImageFile(file);
      if (!raw) {
        setErrorMsg("No QR pass found in that image. Try a clearer screenshot of the pass QR.");
        return;
      }
      stopStream();
      onDetected(extractOrderNumber(raw));
      onClose();
    } catch {
      setErrorMsg("Could not read that image file.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md bg-white theme-radius-card border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 theme-radius-sm theme-icon-soft border flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base text-slate-900">Scan Attendee QR Pass</h2>
              <p className="text-[11px] text-slate-500">Works with iPhone, Android, and desktop webcams</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close scanner" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 theme-radius-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-slate-100 theme-radius overflow-hidden border border-slate-200 flex items-center justify-center">
            <video ref={videoRef} playsInline muted className={`w-full h-full object-cover ${status === "scanning" ? "block" : "hidden"}`} />
            <canvas ref={canvasRef} className="hidden" />
            {status === "scanning" && (
              <div className="pointer-events-none absolute inset-8 border-2 border-dashed border-[var(--color-primary)]/70 theme-radius flex items-end justify-center pb-2">
                <span className="px-2.5 py-0.5 bg-white/90 text-[11px] font-bold text-slate-800 rounded-full shadow-xs">
                  Center QR code inside frame
                </span>
              </div>
            )}
            {status === "starting" && (
              <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                <Camera className="w-6 h-6 animate-pulse text-[var(--color-primary)]" />
                <span>Starting camera...</span>
              </div>
            )}
            {status === "error" && (
              <div className="p-5 text-center space-y-2 text-slate-600 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
                <p className="font-medium leading-relaxed">{errorMsg}</p>
              </div>
            )}
          </div>

          {errorMsg && status !== "error" && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 px-3 py-2 theme-radius-sm">{errorMsg}</p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold theme-radius-sm cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Scan from Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 theme-radius-sm cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
