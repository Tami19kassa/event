"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, CheckCircle2, AlertCircle, Building2, ArrowRight } from "lucide-react";
import { ThemeSettings, defaultThemeSettings } from "@/lib/settings";
import { BrandIdentitySection } from "@/components/admin/settings/BrandIdentitySection";
import { ColorPickerSection } from "@/components/admin/settings/ColorPickerSection";
import { TypographyShapeSection } from "@/components/admin/settings/TypographyShapeSection";
import { ThemeLivePreview } from "@/components/admin/settings/ThemeLivePreview";

export default function BrandingSettingsPage() {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings/theme")
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings({ ...defaultThemeSettings, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (key: keyof ThemeSettings, value: string | null) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save theme settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Visual Design System
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Branding &amp; Theme</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage platform identity, logos, color palette, rounding, and button styles.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2.5 bg-[var(--color-primary)] hover:brightness-110 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Branding"}
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-bold block">Looking to update homepage hero slides, videos, or sponsors?</span>
            <span className="text-slate-400">Homepage media carousels are managed in Expo &amp; Hero Slider.</span>
          </div>
        </div>
        <Link
          href="/admin/settings/expo"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition shrink-0 self-start sm:self-auto"
        >
          Expo &amp; Hero Slider <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Branding settings saved successfully across public &amp; admin pages.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <BrandIdentitySection settings={settings} update={update} />
          <ColorPickerSection settings={settings} update={update} />
          <TypographyShapeSection settings={settings} update={update} />
        </div>

        <div className="lg:col-span-1">
          <ThemeLivePreview settings={settings} />
        </div>
      </div>
    </div>
  );
}
