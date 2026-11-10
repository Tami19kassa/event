"use client";

import { DoorOpen, Coins } from "lucide-react";
import { PaymentSettings } from "@/lib/payment-verification";

interface Props {
  settings: PaymentSettings;
  onChange: (key: keyof PaymentSettings, value: any) => void;
}

export function GatePaymentCard({ settings, onChange }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl theme-badge border flex items-center justify-center font-bold">
          <DoorOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">
            Pay at Gate & Venue Options
          </h2>
          <p className="text-xs text-slate-400">
            Allow attendees to reserve online and pay via cash or Birr upon arrival at the venue entrance.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          id="allowPayAtGate"
          checked={settings.allowPayAtGate}
          onChange={(e) => onChange("allowPayAtGate", e.target.checked)}
          className="mt-1 w-5 h-5 rounded text-[var(--color-primary)] border-slate-300 focus:ring-[var(--color-primary)] cursor-pointer"
        />
        <label htmlFor="allowPayAtGate" className="cursor-pointer">
          <span className="font-bold text-slate-900 text-sm block">
            Enable &ldquo;Pay at Gate / On Arrival&rdquo;
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            Attendees receive a valid reservation pass with instructions to settle at the door. Staff verify and mark them paid at check-in.
          </span>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-100 max-w-xs">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-slate-400" />
          Default Currency Code
        </label>
        <input
          type="text"
          value={settings.currency}
          onChange={(e) => onChange("currency", e.target.value.toUpperCase())}
          placeholder="ETB"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}
