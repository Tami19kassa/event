import { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { Sparkles, X } from "lucide-react";

interface GridProps {
  events: Event[];
  selectedCategory: string | null;
  onClearCategory: () => void;
  search: string;
  onClearSearch: () => void;
  view: "grid" | "list";
}

export function DiscoverGrid({
  events,
  selectedCategory,
  onClearCategory,
  search,
  onClearSearch,
  view,
}: GridProps) {
  return (
    <div className="flex-1">
      {/* Active Filter Pills */}
      {(selectedCategory || search) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 theme-badge border font-bold text-xs rounded-full">
              {selectedCategory}
              <button type="button" onClick={onClearCategory} className="cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200">
              &ldquo;{search}&rdquo;
              <button type="button" onClick={onClearSearch} className="cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {events.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No events match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing filters.
          </p>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
