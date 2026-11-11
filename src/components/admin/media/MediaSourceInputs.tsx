"use client";

import { ImageUpload } from "@/components/ui/ImageUpload";
import type { MediaFormState } from "./MediaFormFields";

type Props = {
  form: MediaFormState;
  onChange: <K extends keyof MediaFormState>(key: K, val: MediaFormState[K]) => void;
};

export function MediaSourceInputs({ form, onChange }: Props) {
  return (
    <>
      {form.kind === "VIDEO_VLOG" && (
        <div className="p-4 bg-slate-50 theme-radius border border-slate-200 space-y-4">
          <ImageUpload
            label="Video Source (Paste YouTube / Vimeo URL or Upload MP4/WebM) *"
            accept="video"
            defaultTab="url"
            value={form.videoUrl}
            onChange={(url) => onChange("videoUrl", url)}
            placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration Badge</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => onChange("duration", e.target.value)}
                placeholder="e.g. 03:45"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug (Optional)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => onChange("slug", e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>
      )}

      {form.kind === "ARTICLE" && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Story URL Slug (Optional)
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="auto-generated-from-title"
            className="w-full px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      )}

      {form.kind === "EXTERNAL_LINK" ? (
        <div className="p-4 bg-slate-50 theme-radius border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">External Target URL *</label>
            <input
              type="url"
              required
              value={form.externalUrl}
              onChange={(e) => onChange("externalUrl", e.target.value)}
              placeholder="https://youtube.com/@... or https://press..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Label</label>
            <input
              type="text"
              value={form.externalLabel}
              onChange={(e) => onChange("externalLabel", e.target.value)}
              placeholder="e.g. Watch Channel / Read Coverage"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional External Link (Press / Resource)
            </label>
            <input
              type="url"
              value={form.externalUrl}
              onChange={(e) => onChange("externalUrl", e.target.value)}
              placeholder="https://... (optional)"
              className="w-full px-3.5 py-2 border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">External Button Label</label>
            <input
              type="text"
              value={form.externalLabel}
              onChange={(e) => onChange("externalLabel", e.target.value)}
              placeholder="e.g. Download Media Kit"
              className="w-full px-3.5 py-2 border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      )}

      <ImageUpload
        label="Poster / Cover Thumbnail (Auto-derived from YouTube if blank)"
        value={form.coverImageUrl}
        onChange={(url) => onChange("coverImageUrl", url)}
        placeholder="https://..."
      />
    </>
  );
}
