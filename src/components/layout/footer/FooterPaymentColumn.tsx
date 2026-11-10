import { ShieldCheck } from "lucide-react";

type Props = {
  allowPayAtGate: boolean;
  currency: string;
};

export function FooterPaymentColumn({ allowPayAtGate, currency }: Props) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <h3 className="font-display text-sm sm:text-[15px] font-bold text-white">
        Verified Checkout
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed">
        Official ticket verification in {currency} with Telebirr and Commercial Bank of Ethiopia (CBE)
        {allowPayAtGate ? ", plus Pay at Gate reservations." : "."}
      </p>

      <div className="theme-radius bg-slate-900/75 border border-slate-800/90 p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-secondary-on-dark, #2dd4bf)" }}
            />
            Telebirr Receipt
          </span>
          <span className="text-[11px] font-medium text-slate-400">Instant</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-primary-on-dark, #a5b4fc)" }}
            />
            CBE Mobile / Branch
          </span>
          <span className="text-[11px] font-medium text-slate-400">Verified</span>
        </div>

        {allowPayAtGate && (
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-accent-on-dark, #f59e0b)" }}
              />
              Pay on Arrival
            </span>
            <span className="text-[11px] font-medium text-slate-400">Gate Hold</span>
          </div>
        )}

        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-secondary-on-dark, #2dd4bf)" }} />
            Settlement
          </span>
          <span className="px-2 py-0.5 theme-radius-sm bg-slate-950 border border-slate-800 font-bold text-white tracking-wide">
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
