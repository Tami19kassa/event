"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cookie, Save, Info, Loader2, CheckCircle2 } from "lucide-react";
import { CookieCategoriesSection } from "@/components/admin/settings/CookieCategoriesSection";
import { CookieSettings, defaultCookieSettings } from "@/lib/cookie-types";

interface Props {
  initialSettings: CookieSettings;
}

export function CookieSettingsClient({ initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<CookieSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof CookieSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (error) setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings/cookies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setSettings({ ...defaultCookieSettings, ...data });
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-display text-slate-900 flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[var(--color-primary)]" />
          Cookie Consent
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure the public cookie consent banner, labels, privacy URL, and tracking toggles.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-medium theme-radius border border-rose-200">
          {error}
        </div>
      )}

      <section className="bg-white theme-radius-card border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Enable Cookie Banner</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Show consent prompt to first-time visitors
            </p>
          </div>
          <button
            type="button"
            onClick={() => update("enabled", !settings.enabled)}
            className={`relative w-12 h-6 rounded-full transition cursor-pointer ${
              settings.enabled ? "bg-[var(--color-primary)]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.enabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </section>

      <section className="bg-white theme-radius-card border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h2 className="font-semibold text-slate-900">Banner Content</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Privacy Policy URL
            </label>
            <input
              type="text"
              value={settings.privacyPolicyUrl}
              onChange={(e) => update("privacyPolicyUrl", e.target.value)}
              placeholder="/privacy"
              className="w-full px-4 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Accept button
            </label>
            <input
              type="text"
              value={settings.acceptAllLabel}
              onChange={(e) => update("acceptAllLabel", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Reject button
            </label>
            <input
              type="text"
              value={settings.rejectAllLabel}
              onChange={(e) => update("rejectAllLabel", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Customize button
            </label>
            <input
              type="text"
              value={settings.customizeLabel}
              onChange={(e) => update("customizeLabel", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-sm"
            />
          </div>
        </div>
      </section>

      <CookieCategoriesSection
        showAnalytics={settings.showAnalytics}
        showMarketing={settings.showMarketing}
        onUpdate={(key, val) => update(key as keyof CookieSettings, val)}
      />

      <div className="flex gap-3 p-4 theme-badge border theme-radius-sm text-sm">
        <Info className="w-5 h-5 shrink-0" />
        <p className="text-xs leading-relaxed text-slate-700">
          Essential cookies handle admin authentication and session integrity. Analytics and marketing preferences are persisted per visitor in browser storage and recorded via{" "}
          <span className="font-mono">/api/cookies/consent</span>.
        </p>
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 font-semibold theme-btn-primary cursor-pointer disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? "Saving..." : saved ? "Saved & Live!" : "Save Cookie Settings"}
      </button>
    </div>
  );
}
