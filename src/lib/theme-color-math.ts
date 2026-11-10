export function normalizeHex(hex: string | undefined | null, fallback = "#4F46E5"): string {
  const clean = (hex || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean;
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return fallback;
}

export function parseRgb(hex: string): [number, number, number] {
  const n = normalizeHex(hex).slice(1);
  return [
    parseInt(n.substring(0, 2), 16),
    parseInt(n.substring(2, 4), 16),
    parseInt(n.substring(4, 6), 16),
  ];
}

export function hexToRgbTuple(hex: string, fallback = "79, 70, 229"): string {
  if (!/^#[0-9a-fA-F]{3,6}$/.test((hex || "").trim())) return fallback;
  const [r, g, b] = parseRgb(hex);
  return `${r}, ${g}, ${b}`;
}

function channelLuminance(c: number): number {
  const srgb = c / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = parseRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = getRelativeLuminance(hexA);
  const lumB = getRelativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastForeground(hex: string): "#FFFFFF" | "#0F172A" {
  return getRelativeLuminance(hex) > 0.36 ? "#0F172A" : "#FFFFFF";
}

export function darkenHex(hex: string, ratio = 0.14): string {
  const [r, g, b] = parseRgb(hex);
  const f = 1 - Math.min(0.92, Math.max(0, ratio));
  const toHex = (v: number) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lightenHex(hex: string, ratio = 0.5): string {
  const [r, g, b] = parseRgb(hex);
  const f = Math.min(0.92, Math.max(0, ratio));
  const toHex = (v: number) => Math.round(v + (255 - v) * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mixHex(hexA: string, hexB: string, weightB = 0.5): string {
  const [r1, g1, b1] = parseRgb(hexA);
  const [r2, g2, b2] = parseRgb(hexB);
  const w = Math.min(1, Math.max(0, weightB));
  const toHex = (a: number, b: number) =>
    Math.round(a * (1 - w) + b * w)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r1, r2)}${toHex(g1, g2)}${toHex(b1, b2)}`.toUpperCase();
}

export function readableInkOnLight(hex: string): string {
  return getRelativeLuminance(hex) > 0.28 ? darkenHex(hex, 0.46) : normalizeHex(hex);
}

export function readableInkOnDark(hex: string): string {
  return getRelativeLuminance(hex) < 0.14 ? lightenHex(hex, 0.52) : normalizeHex(hex);
}
