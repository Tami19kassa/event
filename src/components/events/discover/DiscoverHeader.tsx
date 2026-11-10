import { Search, Grid3X3, List } from "lucide-react";

interface HeaderProps {
  search: string;
  onSearchChange: (q: string) => void;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
}

const formats = ["All", "In-person", "Online", "Hybrid"];
const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "date", label: "Date: Soonest first" },
  { value: "popularity", label: "Most popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function DiscoverHeader({
  search,
  onSearchChange,
  selectedFormat,
  onSelectFormat,
  sortBy,
  onSortChange,
  view,
  onViewChange,
}: HeaderProps) {
  return (
    <div className="space-y-6 mb-8">
      <div>
        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
          Event Directory
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discover Events</h1>
        <p className="text-xs text-slate-500 mt-1">
          Conferences, trade exhibitions, festivals, and summits across Ethiopia.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by event title, venue, city, or keywords..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {formats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onSelectFormat(fmt)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedFormat === fmt
                  ? "bg-[var(--color-primary)] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {fmt}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <div className="hidden sm:flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg cursor-pointer ${
                view === "grid" ? "bg-slate-100 text-[var(--color-primary)]" : "text-slate-400"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="List view"
              className={`p-1.5 rounded-lg cursor-pointer ${
                view === "list" ? "bg-slate-100 text-[var(--color-primary)]" : "text-slate-400"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
