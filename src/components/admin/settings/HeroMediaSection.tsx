"use client";

import { Video, Image as ImageIcon, Youtube, CheckCircle2, Sparkles } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ThemeSettings } from "@/lib/settings";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: any) => void;
}

export function HeroMediaSection({ settings, update }: Props) {
  const currentVideoUrl = settings.heroVideoUrl || "";
  const youtubeId = extractYouTubeId(currentVideoUrl);

  const handleVideoUrlChange = (val: string) => {
    update("heroVideoUrl", val);
    const yt = extractYouTubeId(val);
    // If user pastes YouTube link and hasn't customized poster, auto-fill poster with YouTube thumbnail
    if (yt && (!settings.heroPosterUrl || settings.heroPosterUrl.includes("unsplash"))) {
      update("heroPosterUrl", getYouTubeThumbnail(yt));
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <ImageIcon className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-900">Brand Identity & Hero Media</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Platform / Site Name *
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => update("siteName", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="e.g. Utopia"
          />
        </div>

        <ImageUpload
          label="Platform Logo (Local Upload or URL)"
          value={settings.logoUrl || ""}
          onChange={(url) => update("logoUrl", url)}
          placeholder="https://..."
        />

        {/* Hero Media Type Toggle */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Hero Section Atmosphere
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              type="button"
              onClick={() => update("heroMediaType", "image")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                settings.heroMediaType !== "video"
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Static Image
            </button>
            <button
              type="button"
              onClick={() => update("heroMediaType", "video")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                settings.heroMediaType === "video"
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Video className="w-4 h-4" /> Video Loop (YouTube or MP4)
            </button>
          </div>

          {settings.heroMediaType === "video" && (
            <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hero Video Link (YouTube or Direct MP4)
                  </label>
                  {youtubeId ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                      <Youtube className="w-3 h-3 text-red-600 fill-red-600" /> YouTube ID: {youtubeId}
                    </span>
                  ) : currentVideoUrl ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                      <CheckCircle2 className="w-3 h-3" /> Direct Video File
                    </span>
                  ) : null}
                </div>

                <input
                  type="url"
                  value={currentVideoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...) or MP4 URL"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Paste any YouTube video link. It autoplays muted in an endless loop with dark cinematic overlay.
                  </span>
                </p>
              </div>

              {/* YouTube Thumbnail Preview */}
              {youtubeId && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getYouTubeThumbnail(youtubeId)}
                    alt="YouTube Video Preview"
                    className="w-24 h-14 rounded-lg object-cover border border-slate-100"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">YouTube Stream Connected</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Ready to loop as full-bleed background on the homepage hero.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3">
            <ImageUpload
              label="Hero Poster / Mobile Fallback Image"
              value={settings.heroPosterUrl || ""}
              onChange={(url) => update("heroPosterUrl", url)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
