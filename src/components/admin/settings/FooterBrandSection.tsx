"use client";

import { Globe, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string | null) => void;
}

export function FooterBrandSection({ settings, update }: Props) {
  const tagline = settings.footerTagline ?? "";

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <h2 className="font-semibold text-slate-900">Footer Identity, Contact &amp; Socials</h2>
          <p className="text-xs text-slate-400">
            Controls your public footer bio, contact details, and active social links across all public routes.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Brand Footer Tagline
          </label>
          <span className="text-[11px] font-medium text-slate-400">{tagline.length}/240</span>
        </div>
        <textarea
          rows={2}
          maxLength={240}
          value={tagline}
          onChange={(e) => update("footerTagline", e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-800 resize-none"
          placeholder="Concise statement describing your platform's events and expos..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> City / Region
          </label>
          <input
            type="text"
            maxLength={80}
            value={settings.contactCity || ""}
            onChange={(e) => update("contactCity", e.target.value)}
            placeholder="Addis Ababa, Ethiopia"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Support Email
          </label>
          <input
            type="email"
            maxLength={120}
            value={settings.supportEmail || ""}
            onChange={(e) => update("supportEmail", e.target.value)}
            placeholder="Optional (e.g. concierge@utopia.et)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Support Phone
          </label>
          <input
            type="tel"
            maxLength={40}
            value={settings.supportPhone || ""}
            onChange={(e) => update("supportPhone", e.target.value)}
            placeholder="Optional (e.g. +251 11 ...)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Social Channels
          </span>
          <span className="text-[11px] text-slate-400">
            Leave blank to hide unconfigured links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="url"
            maxLength={240}
            value={settings.socialTelegram || ""}
            onChange={(e) => update("socialTelegram", e.target.value)}
            placeholder="Telegram URL (https://t.me/...)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="url"
            maxLength={240}
            value={settings.socialInstagram || ""}
            onChange={(e) => update("socialInstagram", e.target.value)}
            placeholder="Instagram URL (https://instagram.com/...)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="url"
            maxLength={240}
            value={settings.socialLinkedIn || ""}
            onChange={(e) => update("socialLinkedIn", e.target.value)}
            placeholder="LinkedIn URL (https://linkedin.com/company/...)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="url"
            maxLength={240}
            value={settings.socialX || ""}
            onChange={(e) => update("socialX", e.target.value)}
            placeholder="X / Twitter URL (https://x.com/...)"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>
    </section>
  );
}
