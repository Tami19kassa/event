"use client";

import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, X, DoorOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Order } from "./OrderRow";

interface Props {
  scannedOrder: Order | null;
  scanCode: string;
  actionInProgress: string | null;
  onScanResolved: (orderNumber: string) => void;
  onClearScan: () => void;
  onCheckIn: (orderId: string, orderNumber: string) => void;
}

export function extractOrderNumber(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    if (trimmed.includes("://")) {
      const url = new URL(trimmed);
      const q = url.searchParams.get("scan");
      if (q) return q.trim().toUpperCase();
    }
  } catch {}
  const match = trimmed.match(/EVT-[A-Z0-9-]+/i);
  return (match ? match[0] : trimmed).toUpperCase();
}

export function GateScannerBar({
  scannedOrder,
  scanCode,
  actionInProgress,
  onScanResolved,
  onClearScan,
  onCheckIn,
}: Props) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setCameraError("");
    const Detector = (window as any).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Browser camera QR detection unavailable here — type/scan pass code or use phone Camera app.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new Detector({ formats: ["qr_code"] });
        const tick = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes?.[0]?.rawValue) {
              const code = extractOrderNumber(codes[0].rawValue);
              stopCamera();
              onScanResolved(code);
              return;
            }
          } catch {}
          if (streamRef.current) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    } catch {
      setCameraError("Camera permission denied or unavailable.");
      stopCamera();
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">Venue Gate Scanner</div>
            <div className="text-[11px] text-slate-400">Scan QR pass or paste order code (EVT-...)</div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualInput.trim()) {
              onScanResolved(extractOrderNumber(manualInput));
              setManualInput("");
            }
          }}
          className="flex flex-1 gap-2"
        >
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Scan or enter EVT-... pass reference"
            className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl cursor-pointer">
            Verify
          </button>
          <button
            type="button"
            onClick={cameraOpen ? stopCamera : startCamera}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            {cameraOpen ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span className="hidden sm:inline">{cameraOpen ? "Stop" : "Camera"}</span>
          </button>
        </form>
      </div>

      {cameraError && <p className="text-xs text-amber-300">{cameraError}</p>}

      {cameraOpen && (
        <div className="rounded-2xl overflow-hidden bg-black max-w-xs border border-slate-700">
          <video ref={videoRef} playsInline muted className="w-full h-48 object-cover" />
        </div>
      )}

      {scanCode && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {!scannedOrder ? (
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Pass &ldquo;{scanCode}&rdquo; was not found in active orders.</span>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-300">{scannedOrder.orderNumber}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${scannedOrder.checkedIn ? "bg-amber-400 text-slate-950" : "bg-emerald-400 text-slate-950"}`}>
                  {scannedOrder.checkedIn ? "ALREADY CHECKED IN" : scannedOrder.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-slate-200 font-semibold">
                {scannedOrder.customerName || "Guest"} · {scannedOrder.event?.title} · {scannedOrder.items?.map((i) => `${i.quantity}x ${i.ticketName}`).join(", ")}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {scannedOrder && !scannedOrder.checkedIn && !["CANCELLED", "FAILED"].includes(scannedOrder.status) && (
              <button
                type="button"
                disabled={actionInProgress === scannedOrder.id}
                onClick={() => onCheckIn(scannedOrder.id, scannedOrder.orderNumber)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <DoorOpen className="w-4 h-4" />
                {scannedOrder.status === "RESERVED_PAY_AT_GATE" ? `Collect ETB ${scannedOrder.totalAmount} & Admit` : "Confirm Gate Entry"}
              </button>
            )}
            {scannedOrder?.checkedIn && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Admitted
              </span>
            )}
            <button type="button" onClick={onClearScan} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
