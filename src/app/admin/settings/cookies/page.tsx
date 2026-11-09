"use client";

import { useState } from "react";
import { Cookie, Save, Info } from "lucide-react";
import { CookieCategoriesSection } from "@/components/admin/settings/CookieCategoriesSection";

export default function CookieSettingsPage() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: "We value your privacy",
    description:
      "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
    acceptAllLabel: "Accept All",
    rejectAllLabel: "Reject Non-Essential",
    customizeLabel: "Customize",
    privacyPolicyUrl: "/privacy",
    position: "bottom",
    showAnalytics: true,
    showMarketing: true,
  });

  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Cookie className="w-6 h-6 text-indigo-600" />
          Cookie Consent
        </h1>
        <p className="text-slate-500 mt-1">
          Configure the cookie consent banner and tracking preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Enable */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Enable Cookie Banner</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Show a consent banner to first-time visitors
              </p>
            </div>
            <button
              onClick={() => update("enabled", !settings.enabled)}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.enabled ? "bg-indigo-600" : "bg-slate-300"
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

        {/* Content */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Banner Content</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <CookieCategoriesSection
          showAnalytics={settings.showAnalytics}
          showMarketing={settings.showMarketing}
          onUpdate={(key, val) => update(key, val)}
        />

        {/* Info box */}
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
          <Info className="w-5 h-5 shrink-0 text-blue-500" />
          <div>
            <p className="font-medium">Cookie usage in this platform</p>
            <ul className="mt-1 space-y-1 text-blue-700 list-disc list-inside">
              <li>Essential: session, auth, CSRF, cookie consent preference</li>
              <li>Preferences: theme, language, currency, saved filters</li>
              <li>Analytics: page views, event popularity (if enabled)</li>
              <li>Marketing: conversion tracking (if enabled)</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setSaved(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save cookie settings"}
        </button>
      </div>
    </div>
  );
}
