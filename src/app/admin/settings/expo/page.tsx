"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { HeroSlide, SponsorItem, defaultExpoSlides, defaultSponsors } from "@/lib/expo-settings";
import { ExpoSlidesManager } from "@/components/admin/expo/ExpoSlidesManager";
import { SponsorsManager } from "@/components/admin/expo/SponsorsManager";

export default function ExpoSettingsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultExpoSlides);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(defaultSponsors);
  const [scrollInterval, setScrollInterval] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings/expo")
      .then((r) => r.json())
      .then((data) => {
        if (data.slides) setSlides(data.slides);
        if (data.sponsors) setSponsors(data.sponsors);
        if (data.scrollInterval) setScrollInterval(Number(data.scrollInterval));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings/expo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides, sponsors, scrollInterval }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save expo settings");
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
            B2B Expo Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Expos, Hero Slider &amp; Commercial Sponsors
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure featured expos, scroll interval timing, and strategic sponsor logos.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 font-bold theme-btn-primary shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Expo slides and sponsor partners published successfully to the homepage!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading expo settings...</div>
      ) : (
        <div className="space-y-6">
          {/* Timing Control Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl theme-badge border flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Hero Slider Autoplay Timing</h3>
                <p className="text-xs text-slate-500">How long each featured expo stays visible before sliding.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[5, 7, 10, 15].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setScrollInterval(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    scrollInterval === sec
                      ? "bg-[var(--color-primary)] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {sec}s {sec === 7 && "(Default)"}
                </button>
              ))}
            </div>
          </div>

          <ExpoSlidesManager slides={slides} onChange={setSlides} />
          <SponsorsManager sponsors={sponsors} onChange={setSponsors} />
        </div>
      )}
    </div>
  );
}
