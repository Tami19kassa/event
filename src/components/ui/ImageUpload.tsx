"use client";

import { useState, useRef, useId } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { uploadMediaAsset } from "@/lib/client-upload";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  accept?: "image" | "video" | "all";
  previewVariant?: "compact" | "banner" | "square";
  defaultTab?: "upload" | "url";
}

function isVideoValue(val: string): boolean {
  const v = val.trim().toLowerCase();
  return v.startsWith("data:video/") || /\.(mp4|webm)(\?|$)/i.test(v);
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  placeholder = "https://images.unsplash.com/...",
  accept = "image",
  previewVariant = "compact",
  defaultTab = "upload",
}: ImageUploadProps) {
  const [tab, setTab] = useState<"upload" | "url">(defaultTab);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const ytId = accept !== "image" ? extractYouTubeId(value) : null;

  const acceptAttr =
    accept === "video"
      ? "video/mp4,video/webm"
      : accept === "all"
      ? "image/*,video/mp4,video/webm"
      : "image/*";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const uploadedUrl = await uploadMediaAsset(file);
      onChange(uploadedUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        <div className="flex bg-slate-100 theme-radius-sm p-0.5 text-xs shrink-0">
          <button
            type="button" onClick={() => setTab("upload")}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              tab === "upload" ? "bg-white text-[var(--color-primary)] shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Local File
          </button>
          <button
            type="button" onClick={() => setTab("url")}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              tab === "url" ? "bg-white text-[var(--color-primary)] shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Web URL
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {tab === "upload" ? (
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept={acceptAttr} onChange={handleFileChange} className="hidden" id={inputId} />
          <label
            htmlFor={inputId}
            className="flex-1 border-2 border-dashed border-slate-200 hover:border-[var(--color-primary)] bg-slate-50 hover:bg-slate-100/70 theme-radius p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-[var(--color-primary)] text-xs font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Optimizing &amp; uploading...
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-xs font-bold text-slate-700">
                  {accept === "video" ? "Choose MP4 / WebM video from device" : "Choose logo/image from your device"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {accept === "video" ? "MP4 or WebM up to 25MB (CDN / Local)" : "PNG, JPG, WEBP, SVG auto-optimized up to 25MB"}
                </span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      )}

      {value && (
        <div className="relative inline-block mt-2">
          {ytId ? (
            <div className="flex items-center gap-3 p-2 pr-8 bg-slate-50 theme-radius-sm border border-slate-200 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getYouTubeThumbnail(ytId)} alt="YouTube video preview" className="w-24 h-14 object-cover rounded-lg bg-slate-200" />
              <div className="text-xs">
                <div className="font-bold text-slate-800">YouTube Stream Linked</div>
                <div className="text-[11px] font-mono text-slate-500">ID: {ytId}</div>
              </div>
            </div>
          ) : isVideoValue(value) ? (
            <video src={value} muted controls className="h-24 w-44 theme-radius-sm border border-slate-200 bg-slate-950 object-cover shadow-2xs" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value} alt="Preview"
              className={
                previewVariant === "banner"
                  ? "w-full max-w-md aspect-[16/10] object-cover bg-slate-100 theme-radius-sm border border-slate-200 shadow-2xs"
                  : previewVariant === "square"
                  ? "w-20 h-20 object-cover bg-slate-100 theme-radius-sm border border-slate-200 shadow-2xs"
                  : "h-20 w-32 object-contain bg-white theme-radius-sm border border-slate-200 p-1 shadow-2xs"
              }
            />
          )}
          <button
            type="button" onClick={() => onChange("")} title="Remove media"
            className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 shadow-sm transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
