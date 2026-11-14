"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { X, Copy, Check, Share2, Send, MessageCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  eventTitle: string;
  eventSlug: string;
  onClose: () => void;
}

export function ShareEventModal({ isOpen, eventTitle, eventSlug, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${eventSlug}`
      : `/events/${eventSlug}`;

  useEffect(() => {
    if (isOpen && pageUrl) {
      QRCode.toString(pageUrl, {
        type: "svg",
        margin: 1,
        width: 140,
        color: { dark: "#0f172a", light: "#ffffff" },
      })
        .then((svg) => setQrCodeUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`))
        .catch(() => {});
    }
  }, [isOpen, pageUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(`Check out ${eventTitle}`)}`;
  const whatsAppShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${eventTitle} - ${pageUrl}`)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Attending ${eventTitle}`)}&url=${encodeURIComponent(pageUrl)}`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white theme-radius-modal max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-1">
          <Share2 className="w-4 h-4" />
          <span>Share with Colleagues &amp; Friends</span>
        </div>
        <h3 className="text-xl font-display text-slate-900 leading-snug mb-1">
          Invite Others
        </h3>
        <p className="text-xs text-slate-500 truncate mb-5">{eventTitle}</p>

        {/* Copy link box */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            readOnly
            value={pageUrl}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 theme-radius-sm text-xs font-mono text-slate-700 select-all focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2.5 theme-btn-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <a
            href={telegramShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 border border-slate-200 hover:bg-slate-50 theme-radius-sm flex flex-col items-center gap-1 text-slate-700 transition"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span className="text-[11px] font-bold">Telegram</span>
          </a>
          <a
            href={whatsAppShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 border border-slate-200 hover:bg-slate-50 theme-radius-sm flex flex-col items-center gap-1 text-slate-700 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </a>
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 border border-slate-200 hover:bg-slate-50 theme-radius-sm flex flex-col items-center gap-1 text-slate-700 transition"
          >
            <span className="font-bold text-xs leading-none mt-1">𝕏</span>
            <span className="text-[11px] font-bold mt-1">Post</span>
          </a>
        </div>

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="p-3 bg-slate-50 border border-slate-100 theme-radius-card flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="Event QR" className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Scan on Mobile</span>
              <span className="text-slate-500 text-[11px]">Instant pass &amp; page access for friends nearby.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
