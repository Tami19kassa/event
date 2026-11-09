import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FeaturedProps {
  featured: Event[];
  upcoming: Event[];
}

export function FeaturedEventsSection({ featured, upcoming }: FeaturedProps) {
  return (
    <>
      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="bg-slate-50/80 border-y border-slate-200/90 py-12 md:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="fade-up" durationMs={500}>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                    <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      Featured Highlights
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Top-tier verified events in the capital</p>
                  </div>
                </div>

                <span className="md:hidden text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  Swipe <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </ScrollReveal>

            {/* Mobile: Horizontal Snap-Scroll; Desktop: 3-Col Grid */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
              {featured.map((evt, idx) => (
                <ScrollReveal
                  key={evt.id}
                  variant="fade-up"
                  delayMs={Math.min(idx * 80, 240)}
                  durationMs={550}
                  className="w-[84vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-start"
                >
                  <EventCard event={evt} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
        <ScrollReveal variant="fade-up" durationMs={500}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                Happening Soon
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Upcoming Events in Addis
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="md:hidden text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                Swipe <ArrowRight className="w-3 h-3" />
              </span>
              <Link
                href="/discover"
                className="hidden md:flex text-sm font-bold text-[var(--color-primary)] hover:opacity-80 items-center gap-1 transition"
              >
                Explore all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile: Horizontal Snap-Scroll; Desktop: 3-Col Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {upcoming.map((evt, idx) => (
            <ScrollReveal
              key={evt.id}
              variant="fade-up"
              delayMs={Math.min(idx * 70, 280)}
              durationMs={550}
              className="w-[84vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-start"
            >
              <EventCard event={evt} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile Explore All CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition shadow-md"
          >
            Explore all Addis Ababa events <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
