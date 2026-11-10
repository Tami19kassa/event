"use client";

import { Calendar, MapPin, Star, CheckCircle2, Circle, Eye } from "lucide-react";
import { format } from "date-fns";
import type { EventFormData } from "@/lib/event-form-types";
import type { EventFormTabKey } from "./EventFormHeader";

const FORMAT_LABELS: Record<EventFormData["format"], string> = {
  IN_PERSON: "In-Person",
  ONLINE: "Online",
  HYBRID: "Hybrid",
};

interface Props {
  form: EventFormData;
  currency: string;
  categoryName: string;
  update: (key: keyof EventFormData, value: any) => void;
  onJumpTab: (tab: EventFormTabKey) => void;
}

export function EventLivePreviewSidebar({
  form,
  currency,
  categoryName,
  update,
  onJumpTab,
}: Props) {
  const prices = form.ticketTiers.map((t) => Number(t.price) || 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const parsedStart = form.startDate ? new Date(form.startDate) : null;
  const formattedDate =
    parsedStart && !Number.isNaN(parsedStart.getTime())
      ? format(parsedStart, "MMM d, yyyy · h:mm a")
      : "Pick start date";

  const hasValidDates =
    Boolean(form.startDate && form.endDate) && new Date(form.endDate) > new Date(form.startDate);
  const hasVenue = Boolean(form.locationName.trim() || form.locationCity.trim());

  const checks: { label: string; ok: boolean; tab: EventFormTabKey }[] = [
    { label: "Event title & slug", ok: Boolean(form.title.trim() && form.slug.trim()), tab: "basics" },
    { label: "Event type selected", ok: Boolean(form.categoryId), tab: "basics" },
    { label: "Cover banner uploaded", ok: Boolean(form.imageUrl.trim()), tab: "basics" },
    { label: "Valid date & venue", ok: hasValidDates && hasVenue, tab: "schedule" },
    {
      label: "Ticket tier configured",
      ok: form.ticketTiers.length > 0 && form.ticketTiers.every((t) => Boolean(t.name.trim())),
      tab: "tickets",
    },
  ];

  const readyCount = checks.filter((c) => c.ok).length;

  return (
    <aside className="space-y-4 lg:sticky lg:top-20">
      <section className="bg-white theme-radius-card border border-slate-200 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Eye className="w-4 h-4 text-[var(--color-primary)]" />
            Publishing &amp; Visibility
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {readyCount}/{checks.length} ready
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Listing Status
          </label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="DRAFT">Draft (Admin only)</option>
            <option value="PUBLISHED">Published (Public live)</option>
            <option value="LIVE">Live Now (Ongoing)</option>
            <option value="ENDED">Ended</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <label className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 theme-radius-sm cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                form.isFeatured ? "theme-icon-accent" : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${form.isFeatured ? "fill-current" : ""}`} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Feature on Homepage
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                Pin to Highlights strip
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
            className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer shrink-0"
          />
        </label>

        <div className="space-y-1.5 pt-1">
          {checks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onJumpTab(item.tab)}
              className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 text-left text-xs transition cursor-pointer"
            >
              <span className="flex items-center gap-2 min-w-0">
                {item.ok ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                <span className={item.ok ? "text-slate-700 font-medium" : "text-slate-500"}>
                  {item.label}
                </span>
              </span>
              {!item.ok && (
                <span className="text-[10px] font-bold text-[var(--color-primary-ink,var(--color-primary))]">
                  Fix
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="bg-white theme-radius-card overflow-hidden border border-slate-200 shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Public Card Preview</span>
          <span className="font-mono lowercase truncate max-w-[140px]">
            /{form.slug || "slug"}
          </span>
        </div>

        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-white/90 text-xs font-semibold p-4 text-center"
              style={{ background: "var(--hero-bg, var(--color-primary))" }}
            >
              <span>Default fallback banner</span>
              <span className="text-[10px] text-white/75 mt-0.5">Upload 16:10 artwork in Basics</span>
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold bg-white/95 text-slate-800 rounded-full shadow-xs">
            {FORMAT_LABELS[form.format]}
          </span>
        </div>

        <div className="p-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-secondary-ink,var(--color-secondary))]">
            {categoryName || "General"}
          </div>
          <h3 className="font-display text-slate-900 text-sm line-clamp-2 leading-snug">
            {form.title.trim() || "Untitled Event Preview"}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {form.locationName || form.locationCity || "Venue TBD"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">From</span>
            <span className={lowestPrice === 0 ? "text-emerald-600" : "text-[var(--color-primary)]"}>
              {lowestPrice === 0 ? "Free" : `${currency} ${lowestPrice.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
