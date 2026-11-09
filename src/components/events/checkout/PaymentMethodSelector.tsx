"use client";

import { useState } from "react";
import { Smartphone, Building2, DoorOpen, Copy, Check } from "lucide-react";

export type PaymentGatewayInfo = {
  cbeAccount: string;
  cbeAccountName: string;
  telebirrNumber: string;
  telebirrAccountName: string;
  allowPayAtGate: boolean;
  currency: string;
};

interface PaymentSelectorProps {
  method: "TELEBIRR" | "CBE" | "PAY_AT_GATE";
  onMethodChange: (method: "TELEBIRR" | "CBE" | "PAY_AT_GATE") => void;
  receiptUrl: string;
  onReceiptUrlChange: (url: string) => void;
  total: number;
  gatewaySettings: PaymentGatewayInfo;
}

export function PaymentMethodSelector({
  method,
  onMethodChange,
  receiptUrl,
  onReceiptUrlChange,
  total,
  gatewaySettings,
}: PaymentSelectorProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="pt-2 border-t border-slate-100">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
        Select Payment Method
      </label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => onMethodChange("TELEBIRR")}
          className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
            method === "TELEBIRR"
              ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold">Telebirr</span>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange("CBE")}
          className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
            method === "CBE"
              ? "border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold">CBE Bank</span>
        </button>

        {gatewaySettings.allowPayAtGate && (
          <button
            type="button"
            onClick={() => onMethodChange("PAY_AT_GATE")}
            className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
              method === "PAY_AT_GATE"
                ? "border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DoorOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold">Pay at Gate</span>
          </button>
        )}
      </div>

      {/* Telebirr Details */}
      {method === "TELEBIRR" && (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium">Telebirr Receiver Number:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {gatewaySettings.telebirrNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(gatewaySettings.telebirrNumber, "telebirr")}
                className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition"
              >
                {copiedField === "telebirr" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700">
            Registered Name: <span className="font-bold">{gatewaySettings.telebirrAccountName}</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
              Paste Telebirr Receipt URL or Transaction Ref *
            </label>
            <input
              type="text"
              required
              value={receiptUrl}
              onChange={(e) => onReceiptUrlChange(e.target.value)}
              placeholder="e.g. https://transactioninfo.ethiotelecom.et/receipt/DK90W608P4"
              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* CBE Details */}
      {method === "CBE" && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-800 font-medium">CBE Account Number:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                {gatewaySettings.cbeAccount}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(gatewaySettings.cbeAccount, "cbe")}
                className="p-1 text-amber-700 hover:bg-amber-100 rounded transition"
              >
                {copiedField === "cbe" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="text-[11px] text-amber-700">
            Account Holder: <span className="font-bold">{gatewaySettings.cbeAccountName}</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
              Paste CBE Online Receipt URL or Ref Number *
            </label>
            <input
              type="text"
              required
              value={receiptUrl}
              onChange={(e) => onReceiptUrlChange(e.target.value)}
              placeholder="e.g. https://mbreciept.cbe.com.et/v2-hfHCxNV6JF7DhAbgHI8i"
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* Pay at Gate */}
      {method === "PAY_AT_GATE" && (
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <DoorOpen className="w-4 h-4 text-indigo-600" /> Pay on Arrival at the Venue
          </div>
          <p className="text-[11px] leading-relaxed text-indigo-800">
            Your reservation will be confirmed. Settle <span className="font-bold">ETB {total.toLocaleString()}</span> at the entrance desk via cash or Birr upon arrival.
          </p>
        </div>
      )}
    </div>
  );
}
