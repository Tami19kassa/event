import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clapperboard } from "lucide-react";
import { getPublishedMediaPosts } from "@/lib/media-posts";
import { getThemeSettings } from "@/lib/settings";
import { StoriesArchiveClient } from "@/components/media/StoriesArchiveClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeSettings();
  return {
    title: `Media, Vlogs & Stories — ${theme.siteName}`,
    description:
      "Watch expo floor vlogs, keynote video highlights, industry articles, and press coverage.",
  };
}

export default async function StoriesArchivePage() {
  const [posts, theme] = await Promise.all([
    getPublishedMediaPosts(),
    getThemeSettings(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section
        data-surface="dark"
        className="relative bg-slate-950 text-white border-b border-slate-900 overflow-hidden"
      >
        <div
          className="h-1 w-full"
          style={{ background: "var(--hero-bg, var(--color-primary))" }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {theme.siteName}
          </Link>

          <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-11 h-11 theme-radius-sm bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
              <Clapperboard
                className="w-5 h-5"
                style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }}
              />
            </div>
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest block"
                style={{ color: "var(--color-primary-on-dark, #a5b4fc)" }}
              >
                Editorial &amp; Video Hub
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-white mt-1">
                Vlogs, Recaps &amp; Expo Stories
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Explore backstage walkthroughs, speaker spotlights, sector articles, and official press features across upcoming exhibitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoriesArchiveClient initialPosts={posts} />
      </div>
    </div>
  );
}
