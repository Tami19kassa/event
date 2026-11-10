import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

type Props = {
  currency: string;
};

export function FooterBanner({ currency }: Props) {
  return (
    <div className="border-b border-slate-800/80 pb-10 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-2xl">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Live Events &amp; Flagship Expos
        </span>
        <h2 className="font-display text-xl sm:text-2xl text-white leading-snug">
          Discover your next signature experience
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Browse verified conferences, trade exhibitions, and concerts with instant {currency} checkout.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          href="/discover"
          className="theme-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <span>Explore All Events</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
        <Link
          href="/#calendar"
          className="theme-radius px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-200 border border-slate-700/90 hover:border-slate-500 hover:text-white inline-flex items-center gap-2 transition"
        >
          <Calendar className="w-4 h-4 shrink-0" style={{ color: "var(--color-primary-on-dark, #a5b4fc)" }} />
          <span>Event Calendar</span>
        </Link>
      </div>
    </div>
  );
}
