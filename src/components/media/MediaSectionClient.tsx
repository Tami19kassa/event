"use client";

import { useState } from "react";
import type { MediaPostItem } from "@/lib/media-types";
import { MediaPostCard } from "./MediaPostCard";
import { VideoPlayerModal } from "./VideoPlayerModal";

type Props = {
  posts: MediaPostItem[];
};

export function MediaSectionClient({ posts }: Props) {
  const [activeVideo, setActiveVideo] = useState<MediaPostItem | null>(null);

  if (posts.length === 0) return null;

  const gridPosts = posts.slice(0, 3);

  return (
    <>
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {gridPosts.map((post) => (
          <div key={post.id} className="w-[84vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-start">
            <MediaPostCard post={post} onPlayVideo={setActiveVideo} />
          </div>
        ))}
      </div>

      <VideoPlayerModal post={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
