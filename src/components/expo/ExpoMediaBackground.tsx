import { extractYouTubeId, buildYouTubeBackgroundUrl } from "@/lib/youtube";

interface Props {
  mediaType: "image" | "video";
  videoUrl?: string;
  posterUrl: string;
  title: string;
}

export function ExpoMediaBackground({ mediaType, videoUrl, posterUrl, title }: Props) {
  const cleanVideo = videoUrl?.trim();
  const ytId = mediaType === "video" && cleanVideo ? extractYouTubeId(cleanVideo) : null;

  if (mediaType === "video" && ytId) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={buildYouTubeBackgroundUrl(ytId)}
          title={title}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover scale-[1.2] border-0"
          tabIndex={-1}
        />
      </div>
    );
  }

  if (mediaType === "video" && cleanVideo) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl || undefined}
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src={cleanVideo} />
      </video>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={posterUrl}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
  );
}
