import Link from "next/link";
import { Palette, CreditCard, Clapperboard, ArrowRight } from "lucide-react";
import { getFontPreset } from "@/lib/theme-fonts";
import type { ThemeSettings } from "@/lib/theme-types";
import type { PaymentSettings } from "@/lib/payment-types";

interface OpsStripProps {
  theme: ThemeSettings;
  payments: PaymentSettings;
  publishedMediaCount: number;
  draftMediaCount: number;
}

export function DashboardOpsStrip({
  theme,
  payments,
  publishedMediaCount,
  draftMediaCount,
}: OpsStripProps) {
  const font = getFontPreset(theme.fontPreset);
  const currency = payments.currency || "ETB";

  const activeMethods = [
    payments.telebirrNumber ? "Telebirr" : null,
    payments.cbeAccount ? "CBE" : null,
    payments.allowPayAtGate ? "Pay at Gate" : null,
  ].filter(Boolean);

  return (
    <section aria-label="Platform Configuration Snapshot" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white theme-radius-card border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 theme-radius-sm theme-badge border flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Brand &amp; Typography</span>
              <span className="flex items-center gap-1 ml-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.secondaryColor }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {font.label} · {theme.buttonStyle} buttons · {theme.borderRadius.toUpperCase()} radius
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1 shrink-0"
        >
          Theme <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white theme-radius-card border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 theme-radius-sm theme-badge-secondary border flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900">Payment Gateways ({currency})</div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {activeMethods.length > 0 ? activeMethods.join(" · ") : "No payment channels configured"}
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings/payments"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1 shrink-0"
        >
          Setup <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white theme-radius-card border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 theme-radius-sm theme-badge-accent border flex items-center justify-center shrink-0">
            <Clapperboard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900">Media &amp; Stories</div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {publishedMediaCount} live on site · {draftMediaCount} draft{draftMediaCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <Link
          href="/admin/media"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1 shrink-0"
        >
          Studio <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
