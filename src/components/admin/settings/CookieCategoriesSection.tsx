"use client";

interface CookieCategoriesSectionProps {
  showAnalytics: boolean;
  showMarketing: boolean;
  onUpdate: (key: string, value: boolean) => void;
}

export function CookieCategoriesSection({
  showAnalytics,
  showMarketing,
  onUpdate,
}: CookieCategoriesSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-slate-900">Cookie Categories</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <div className="font-medium text-sm text-slate-900">Essential</div>
            <div className="text-xs text-slate-500">
              Required for the site to function (always on)
            </div>
          </div>
          <span className="text-xs font-medium text-slate-400">Always active</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <div className="font-medium text-sm text-slate-900">Analytics</div>
            <div className="text-xs text-slate-500">
              Help us understand how visitors use the site
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdate("showAnalytics", !showAnalytics)}
            className={`relative w-11 h-6 rounded-full transition cursor-pointer ${
              showAnalytics ? "bg-[var(--color-primary)]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                showAnalytics ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <div className="font-medium text-sm text-slate-900">Marketing</div>
            <div className="text-xs text-slate-500">
              Used for advertising and retargeting
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdate("showMarketing", !showMarketing)}
            className={`relative w-11 h-6 rounded-full transition cursor-pointer ${
              showMarketing ? "bg-[var(--color-primary)]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                showMarketing ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
