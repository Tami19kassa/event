import { Category } from "@/types/event";

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (name: string | null) => void;
}

export function DiscoverSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="bg-white theme-radius-card border border-slate-200 p-5 shadow-xs">
        <h3 className="font-display text-slate-900 text-sm mb-4">Event Categories</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 theme-radius-sm text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              selectedCategory === null
                ? "theme-badge font-extrabold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-3 py-2 theme-radius-sm text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.name
                  ? "theme-badge font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{cat.icon || "📌"}</span>
                <span>{cat.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
