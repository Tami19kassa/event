"use client";

import { useState } from "react";
import type { MediaPostItem } from "@/lib/media-types";
import { MediaPostCard } from "./MediaPostCard";
import { VideoPlayerModal } from "./VideoPlayerModal";

export function EventMediaStrip({ posts }: { posts: MediaPostItem[] }) {
  const [activeVideo, setActiveVideo] = useState<MediaPostItem | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <>
      <section className="pt-2">
        <h2 className="text-xl font-display text-slate-900 mb-4">
          Video Highlights &amp; Press Coverage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <MediaPostCard key={post.id} post={post} onPlayVideo={setActiveVideo} />
          ))}
        </div>
      </section>

      <VideoPlayerModal post={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
