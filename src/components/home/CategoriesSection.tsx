import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/event";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
      <ScrollReveal variant="fade-up" durationMs={500}>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
              Curated Addis Collections
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Browse by Category
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="md:hidden text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              Swipe <ArrowRight className="w-3 h-3" />
            </span>
            <Link
              href="/discover"
              className="hidden md:flex text-sm font-bold text-[var(--color-primary)] hover:opacity-80 items-center gap-1 transition"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Mobile: Horizontal Snap Carousel; Desktop: 6-Col Grid with staggered entrance */}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-3 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {categories.map((cat, idx) => (
          <ScrollReveal
            key={cat.id}
            variant="scale-up"
            delayMs={Math.min(idx * 60, 360)}
            durationMs={450}
            className="w-[150px] sm:w-[170px] md:w-auto shrink-0 md:shrink snap-start"
          >
            <Link
              href={`/discover?category=${cat.slug}`}
              prefetch={true}
              className="group p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 shadow-2xs h-full active:scale-95"
            >
              <span className="text-3xl group-hover:scale-115 transition-transform duration-300">
                {cat.icon || "📌"}
              </span>
              <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition truncate w-full">
                {cat.name}
              </span>
              <span className="text-xs text-slate-400 group-hover:text-slate-500">
                {cat.count} {cat.count === 1 ? "event" : "events"}
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
