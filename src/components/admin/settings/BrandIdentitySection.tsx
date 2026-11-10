"use client";

import { Sparkles } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ThemeSettings } from "@/lib/theme-types";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string | null) => void;
}

export function BrandIdentitySection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <h2 className="font-semibold text-slate-900">Brand Identity &amp; Logos</h2>
          <p className="text-xs text-slate-400">
            Applied automatically across public header, footer, admin sidebar, and sign-in portal.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Platform / Brand Name *
          </label>
          <input
            type="text"
            required
            value={settings.siteName}
            onChange={(e) => update("siteName", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-semibold text-slate-900"
            placeholder="e.g. Utopia"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload
            label="Primary Logo (Light Backgrounds)"
            value={settings.logoUrl || ""}
            onChange={(url) => update("logoUrl", url || null)}
            placeholder="https://..."
          />
          <ImageUpload
            label="Dark-Mode Logo (Footer & Admin Sidebar)"
            value={settings.logoDarkUrl || ""}
            onChange={(url) => update("logoDarkUrl", url || null)}
            placeholder="Optional dark-surface logo URL"
          />
        </div>

        <ImageUpload
          label="Browser Favicon (Square PNG / SVG)"
          value={settings.faviconUrl || ""}
          onChange={(url) => update("faviconUrl", url || null)}
          placeholder="https://.../favicon.png"
        />
      </div>
    </section>
  );
}
