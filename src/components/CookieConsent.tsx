"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, SlidersHorizontal } from "lucide-react";
import { CookieSettings, defaultCookieSettings } from "@/lib/cookie-settings";

interface Props {
  settings?: CookieSettings;
}

export function CookieConsent({ settings = defaultCookieSettings }: Props) {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(settings.showAnalytics);
  const [marketing, setMarketing] = useState(settings.showMarketing);

  useEffect(() => {
    if (!settings.enabled) return;
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) {
      const t = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, [settings.enabled]);

  const saveChoice = (prefs: { analytics: boolean; marketing: boolean }) => {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem("visitor_id", visitorId);
    }

    const payload = {
      essential: true,
      analytics: settings.showAnalytics ? prefs.analytics : false,
      marketing: settings.showMarketing ? prefs.marketing : false,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("cookie_consent", JSON.stringify(payload));
    setVisible(false);

    fetch("/api/cookies/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, ...payload }),
    }).catch(() => {});
  };

  if (!settings.enabled || !visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 pointer-events-auto">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center shrink-0 text-[var(--color-primary)]">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{settings.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              {settings.description}{" "}
              <Link href={settings.privacyPolicyUrl || "/privacy"} className="text-[var(--color-primary)] font-semibold hover:underline">
                Privacy Policy
              </Link>
            </p>

            {customizing && (
              <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Essential (Required)</span>
                  <span className="text-emerald-600 font-bold">Always Active</span>
                </div>
                {settings.showAnalytics && (
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Analytics & Event Discovery Insights</span>
                    <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" />
                  </label>
                )}
                {settings.showMarketing && (
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Partner & Sponsor Offers</span>
                    <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" />
                  </label>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => saveChoice({ analytics: true, marketing: true })}
                style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                className="px-4 py-2 text-white text-xs sm:text-sm font-semibold rounded-xl hover:brightness-110 transition cursor-pointer"
              >
                {settings.acceptAllLabel}
              </button>
              <button
                type="button"
                onClick={() => saveChoice({ analytics: false, marketing: false })}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                {settings.rejectAllLabel}
              </button>
              {(settings.showAnalytics || settings.showMarketing) && (
                <button
                  type="button"
                  onClick={() => (customizing ? saveChoice({ analytics, marketing }) : setCustomizing(true))}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium rounded-xl hover:bg-slate-50 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {customizing ? "Save Preferences" : settings.customizeLabel}
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => saveChoice({ analytics: false, marketing: false })}
            aria-label="Dismiss cookie notice"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
