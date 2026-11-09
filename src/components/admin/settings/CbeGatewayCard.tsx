"use client";

import { Building2, ShieldCheck } from "lucide-react";
import { PaymentSettings } from "@/lib/payment-verification";

interface Props {
  settings: PaymentSettings;
  onChange: (key: keyof PaymentSettings, value: any) => void;
}

export function CbeGatewayCard({ settings, onChange }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">
            Commercial Bank of Ethiopia (CBE)
          </h2>
          <p className="text-xs text-slate-400">
            Attendees transfer directly to your CBE account or CBE Birr and submit the official receipt URL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            CBE Account Number *
          </label>
          <input
            type="text"
            required
            value={settings.cbeAccount}
            onChange={(e) => onChange("cbeAccount", e.target.value)}
            placeholder="e.g. 1000345678901"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Account Holder Name *
          </label>
          <input
            type="text"
            required
            value={settings.cbeAccountName}
            onChange={(e) => onChange("cbeAccountName", e.target.value)}
            placeholder="e.g. Utopia Event Management PLC"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Supports automated receipt verification via CBE online portal (
          <span className="font-mono text-slate-700">mbreciept.cbe.com.et</span>).
        </span>
      </div>
    </div>
  );
}
