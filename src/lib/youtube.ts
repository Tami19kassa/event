/**
 * Extracts a YouTube 11-character video ID from any URL or share string
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Direct 11-character video ID (with or without query params like ?si=...)
  const directMatch = trimmed.match(/^([a-zA-Z0-9_-]{11})(?:\?.*)?$/);
  if (directMatch) {
    return directMatch[1];
  }

  // 2. Standard YouTube URL patterns (youtu.be, youtube.com/watch?v=, embed, shorts, etc.)
  const urlPattern =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(urlPattern);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Fallback: if query param v=XXXXXXXXXXX exists
  const vParamMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vParamMatch && vParamMatch[1]) {
    return vParamMatch[1];
  }

  return null;
}

/**
 * Builds an optimal chromeless background loop embed URL for hero sections
 */
export function buildYouTubeBackgroundUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
    showinfo: "0",
    modestbranding: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    enablejsapi: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Fallback poster from YouTube thumbnail
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
