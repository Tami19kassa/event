"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { PaymentSettings, defaultPaymentSettings } from "@/lib/payment-verification";
import { CbeGatewayCard } from "@/components/admin/settings/CbeGatewayCard";
import { TelebirrGatewayCard } from "@/components/admin/settings/TelebirrGatewayCard";
import { GatePaymentCard } from "@/components/admin/settings/GatePaymentCard";

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings/payments")
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings({ ...defaultPaymentSettings, ...data });
      })
      .catch(() => {});
  }, []);

  const handleChange = (key: keyof PaymentSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/settings/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update payment settings");
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
    <div className="p-6 md:p-10 space-y-8 max-w-5xl">
      <div>
        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
          Financial Infrastructure
        </span>
        <h1 className="text-3xl font-display text-slate-900">
          Payment Gateways &amp; Accounts
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure banking and mobile wallet coordinates for attendee ticket purchases in Ethiopia.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>Payment configuration saved successfully. Public checkout now reflects these coordinates.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <CbeGatewayCard settings={settings} onChange={handleChange} />
        <TelebirrGatewayCard settings={settings} onChange={handleChange} />
        <GatePaymentCard settings={settings} onChange={handleChange} />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 font-bold theme-btn-primary shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving settings..." : "Save Payment Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
