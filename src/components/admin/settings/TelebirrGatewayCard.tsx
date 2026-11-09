"use client";

import { PhoneCall, ShieldCheck } from "lucide-react";
import { PaymentSettings } from "@/lib/payment-verification";

interface Props {
  settings: PaymentSettings;
  onChange: (key: keyof PaymentSettings, value: any) => void;
}

export function TelebirrGatewayCard({ settings, onChange }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">
            Ethio Telecom · Telebirr
          </h2>
          <p className="text-xs text-slate-400">
            Attendees send payment via Telebirr mobile wallet and paste the transaction info link or SMS code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Telebirr Merchant / Phone Number *
          </label>
          <input
            type="text"
            required
            value={settings.telebirrNumber}
            onChange={(e) => onChange("telebirrNumber", e.target.value)}
            placeholder="e.g. 0911223344"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Telebirr Registered Name *
          </label>
          <input
            type="text"
            required
            value={settings.telebirrAccountName}
            onChange={(e) => onChange("telebirrAccountName", e.target.value)}
            placeholder="e.g. Utopia Events"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Supports automated receipt verification via Ethio Telecom portal (
          <span className="font-mono text-slate-700">transactioninfo.ethiotelecom.et</span>).
        </span>
      </div>
    </div>
  );
}
