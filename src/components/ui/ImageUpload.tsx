"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

// Client-side image optimization to keep uploads lightweight (< 50KB)
async function optimizeImage(file: File): Promise<File | Blob> {
  if (!file.type.startsWith("image/") || file.type.includes("svg")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 600;
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
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  placeholder = "https://images.unsplash.com/...",
}: ImageUploadProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const processedFile = await optimizeImage(file);
      const formData = new FormData();
      formData.append("file", processedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              tab === "upload" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Local File
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              tab === "url" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Web URL
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {tab === "upload" ? (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, "-")}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, "-")}`}
            className="flex-1 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Optimizing & uploading...
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Choose logo/image from your device</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, SVG auto-optimized</span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Live Preview */}
      {value && (
        <div className="relative inline-block mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-20 w-32 object-contain bg-white rounded-xl border border-slate-200 p-1 shadow-2xs"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 shadow-sm transition"
            title="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
