import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";
import type { MediaPostItem } from "@/lib/media-types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MediaSectionClient } from "@/components/media/MediaSectionClient";

type Props = {
  posts: MediaPostItem[];
};

export function MediaHighlightsSection({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-slate-50/70 border-t border-slate-200/90 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" durationMs={500}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 theme-radius-sm theme-badge-secondary border flex items-center justify-center shrink-0 mt-0.5">
                <Clapperboard className="w-5 h-5" />
              </div>
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}
                >
                  Expo Media &amp; Editorial
                </span>
                <h2 className="text-2xl md:text-3xl font-display text-slate-900">
                  Vlogs, Highlights &amp; Expo Stories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Keynote reels, exhibitor floor vlogs, industry briefs, and featured media coverage.
                </p>
              </div>
            </div>

            <Link
              href="/stories"
              className="text-sm font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1.5 transition shrink-0 self-start sm:self-auto"
            >
              <span>View all stories &amp; videos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <MediaSectionClient posts={posts} />
      </div>
    </section>
  );
}
