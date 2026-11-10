import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Globe, Play } from "lucide-react";
import { format } from "date-fns";
import { getMediaPostBySlug, getPublishedMediaPosts } from "@/lib/media-posts";
import { getThemeSettings } from "@/lib/settings";
import { resolveOgImageUrl } from "@/lib/site-url";
import { resolveMediaPoster, extractExternalDomain } from "@/lib/media-types";
import { resolveVideoSource } from "@/lib/youtube";
import { SafeStoryBody } from "@/components/media/SafeStoryBody";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, theme] = await Promise.all([getMediaPostBySlug(slug), getThemeSettings()]);
  if (!post) return { title: `Story Not Found — ${theme.siteName}` };

  const poster = resolveMediaPoster(post);
  const ogImage = resolveOgImageUrl(poster);
  return {
    title: `${post.title} — ${theme.siteName}`,
    description: post.excerpt || `${post.title} on ${theme.siteName}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `/stories/${post.slug}`,
      type: "article",
      images: ogImage ? [{ url: ogImage, alt: post.title }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedMediaPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getMediaPostBySlug(slug);
  if (!post) notFound();

  const poster = resolveMediaPoster(post);
  const video = resolveVideoSource(post.videoUrl);
  const domain = extractExternalDomain(post.externalUrl);
  const dateLabel = format(new Date(post.publishedAt), "MMMM d, yyyy");

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Vlogs &amp; Stories
        </Link>

        <article className="bg-white theme-radius-card border border-slate-200 overflow-hidden shadow-xs">
          {video ? (
            <div className="relative aspect-video bg-black w-full">
              {video.type === "youtube" || video.type === "vimeo" ? (
                <iframe
                  src={video.embedUrl.replace("autoplay=1", "autoplay=0")}
                  title={post.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={video.src}
                  poster={poster}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-full theme-badge border font-bold inline-flex items-center gap-1.5">
                {post.kind === "VIDEO_VLOG" && <Play className="w-3 h-3 fill-current" />}
                {post.kind === "EXTERNAL_LINK" && <Globe className="w-3 h-3" />}
                <span>{post.categoryTag || (post.kind === "VIDEO_VLOG" ? "Vlog" : "Story")}</span>
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium">{dateLabel}</span>
              {post.duration && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-semibold">{post.duration}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl text-slate-900 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium border-l-4 border-[var(--color-primary)] pl-4">
                {post.excerpt}
              </p>
            )}

            {post.content && (
              <div className="pt-4 border-t border-slate-100">
                <SafeStoryBody content={post.content} />
              </div>
            )}

            {(post.externalUrl || post.event) && (
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.externalUrl && (
                  <a
                    href={post.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 theme-radius border border-slate-200 bg-slate-50 hover:border-[var(--color-primary)] transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        External Link · {domain}
                      </span>
                      <span className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-primary)] truncate block">
                        {post.externalLabel || "Visit External Resource"}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  </a>
                )}

                {post.event && (
                  <Link
                    href={`/events/${post.event.slug}`}
                    className="p-4 theme-radius theme-btn-primary flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Linked Event
                      </span>
                      <span className="font-bold text-sm truncate block">{post.event.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
