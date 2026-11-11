"use client";

import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, X, DoorOpen, AlertTriangle, CheckCircle2, Eye, ShieldCheck } from "lucide-react";
import {
  extractOrderNumber,
  findScannedOrder,
  isReleasedStatus,
  type AdminOrderRow,
} from "@/lib/orders-admin-helpers";

interface Props {
  orders: AdminOrderRow[];
  scanCode: string;
  currency: string;
  canManageReceipts: boolean;
  actionInProgress: string | null;
  onScanResolved: (code: string) => void;
  onClearScan: () => void;
  onCheckIn: (orderId: string, orderNumber: string) => void;
  onApproveReceipt: (orderId: string, orderNumber: string) => void;
  onInspectOrder: (order: AdminOrderRow) => void;
}

export function GateScannerBar({
  orders, scanCode, currency, canManageReceipts, actionInProgress,
  onScanResolved, onClearScan, onCheckIn, onApproveReceipt, onInspectOrder,
}: Props) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };
  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setCameraError("");
    const Detector = (window as any).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) {
      return setCameraError("Camera QR detection unavailable — enter pass code, receipt ref, or phone.");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(async () => {
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
        const detector = new Detector({ formats: ["qr_code"] });
        const tick = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes?.[0]?.rawValue) { stopCamera(); return onScanResolved(extractOrderNumber(codes[0].rawValue)); }
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

  const scannedOrder = findScannedOrder(orders, scanCode);
  const ordCurrency = scannedOrder?.currency || currency;
  const isBlocked = scannedOrder ? isReleasedStatus(scannedOrder.status) : false;
  const isPendingReceipt = scannedOrder?.status === "PENDING_VERIFICATION";

  return (
    <div className="bg-slate-900 text-white theme-radius-card p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 theme-radius-sm theme-bg-primary border border-white/15 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-100">Venue Gate Scanner</div>
            <div className="text-[11px] text-slate-400">Scan QR pass, EVT code, receipt ref, or phone</div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualInput.trim()) { onScanResolved(extractOrderNumber(manualInput)); setManualInput(""); }
          }}
          className="flex flex-1 gap-2"
        >
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Scan or enter EVT-... code, receipt ref, or phone"
            className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 theme-radius-sm text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button type="submit" className="px-3.5 py-2 theme-btn-solid border border-white/20 text-xs font-bold cursor-pointer">Verify</button>
          <button type="button" onClick={cameraOpen ? stopCamera : startCamera} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold theme-radius-sm flex items-center gap-1.5 cursor-pointer">
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
        <div className="bg-slate-800/95 border border-slate-700 theme-radius p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {!scannedOrder ? (
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Pass or ref &ldquo;{scanCode}&rdquo; was not found in your orders.</span>
            </div>
          ) : (
            <div className="space-y-1 text-xs min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-white">{scannedOrder.orderNumber}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  isBlocked ? "bg-rose-500 text-white" : scannedOrder.checkedIn ? "bg-emerald-400 text-slate-950" : isPendingReceipt ? "bg-amber-400 text-slate-950" : "bg-sky-400 text-slate-950"
                }`}>
                  {isBlocked ? `VOID (${scannedOrder.status})` : scannedOrder.checkedIn ? "ALREADY CHECKED IN" : scannedOrder.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-slate-200 font-semibold truncate">
                {scannedOrder.customerName || "Guest"} · {scannedOrder.event?.title} · {scannedOrder.items.map((i) => `${i.quantity}x ${i.ticketName}`).join(", ")}
              </div>
              {isPendingReceipt && !isBlocked && (
                <div className="text-amber-300 font-semibold flex items-center gap-1.5 pt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Payment receipt unverified — confirm transfer before admitting.
                </div>
              )}
              {isBlocked && (
                <div className="text-rose-300 font-semibold flex items-center gap-1.5 pt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Cancelled or failed booking — entry blocked.
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {scannedOrder && (
              <button type="button" onClick={() => onInspectOrder(scannedOrder)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold theme-radius-sm flex items-center gap-1.5 cursor-pointer">
                <Eye className="w-3.5 h-3.5" /> Inspect
              </button>
            )}
            {scannedOrder && isPendingReceipt && canManageReceipts && !isBlocked && (
              <button type="button" disabled={actionInProgress === scannedOrder.id} onClick={() => onApproveReceipt(scannedOrder.id, scannedOrder.orderNumber)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold theme-radius-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                <ShieldCheck className="w-3.5 h-3.5" /> Verify Receipt
              </button>
            )}
            {scannedOrder && !scannedOrder.checkedIn && !isBlocked && (
              <button type="button" disabled={actionInProgress === scannedOrder.id} onClick={() => onCheckIn(scannedOrder.id, scannedOrder.orderNumber)} className={`px-4 py-2 font-extrabold text-xs theme-radius-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${isPendingReceipt ? "bg-amber-400 hover:bg-amber-300 text-slate-950" : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"}`}>
                <DoorOpen className="w-4 h-4" />
                {scannedOrder.status === "RESERVED_PAY_AT_GATE" ? `Collect ${ordCurrency} ${scannedOrder.totalAmount.toLocaleString()} & Admit` : "Confirm Gate Entry"}
              </button>
            )}
            {scannedOrder?.checkedIn && !isBlocked && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Admitted</span>
            )}
            <button type="button" onClick={onClearScan} aria-label="Clear scan" className="p-1.5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
