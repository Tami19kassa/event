import { getFontPreset } from "./theme-fonts";
import type { ThemeSettings } from "./theme-types";

export function normalizeHex(hex: string | undefined | null, fallback = "#4F46E5"): string {
  const clean = (hex || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean;
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return fallback;
}

function parseRgb(hex: string): [number, number, number] {
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

export function getContrastForeground(hex: string): "#FFFFFF" | "#0F172A" {
  return getRelativeLuminance(hex) > 0.36 ? "#0F172A" : "#FFFFFF";
}

export function darkenHex(hex: string, ratio = 0.14): string {
  const [r, g, b] = parseRgb(hex);
  const f = 1 - Math.min(0.65, Math.max(0, ratio));
  const toHex = (v: number) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lightenHex(hex: string, ratio = 0.5): string {
  const [r, g, b] = parseRgb(hex);
  const f = Math.min(0.85, Math.max(0, ratio));
  const toHex = (v: number) => Math.round(v + (255 - v) * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function readableInkOnLight(hex: string): string {
  return getRelativeLuminance(hex) > 0.28 ? darkenHex(hex, 0.46) : normalizeHex(hex);
}

export function readableInkOnDark(hex: string): string {
  return getRelativeLuminance(hex) < 0.14 ? lightenHex(hex, 0.52) : normalizeHex(hex);
}

export function radiusValue(r: string): string {
  switch (r) {
    case "none": return "0px";
    case "sm": return "6px";
    case "md": return "10px";
    case "lg": return "14px";
    case "xl": return "16px";
    default: return "14px";
  }
}

export function cardRadiusValue(r: string): string {
  switch (r) {
    case "none": return "0px";
    case "sm": return "8px";
    case "md": return "14px";
    case "lg": return "20px";
    case "xl": return "24px";
    default: return "20px";
  }
}

export function smallRadiusValue(r: string): string {
  switch (r) {
    case "none": return "0px";
    case "sm": return "4px";
    case "md": return "8px";
    case "lg": return "10px";
    case "xl": return "12px";
    default: return "10px";
  }
}

export function gradientAngle(dir?: string | null): string {
  switch (dir) {
    case "to-r": return "90deg";
    case "to-tr": return "45deg";
    case "to-b": return "180deg";
    case "to-bl": return "225deg";
    case "to-l": return "270deg";
    case "to-tl": return "315deg";
    case "to-t": return "0deg";
    default: return "135deg";
  }
}

export function buildThemeCssText(theme: ThemeSettings): string {
  const primary = normalizeHex(theme.primaryColor, "#4F46E5");
  const secondary = normalizeHex(theme.secondaryColor, "#0D9488");
  const accent = normalizeHex(theme.accentColor, "#F59E0B");
  const primaryHover = darkenHex(primary, 0.14);
  const secondaryHover = darkenHex(secondary, 0.14);
  const primaryFg = getContrastForeground(primary);
  const secondaryFg = getContrastForeground(secondary);
  const accentFg = getContrastForeground(accent);
  const secondaryInk = readableInkOnLight(secondary);
  const secondaryOnDark = readableInkOnDark(secondary);
  const accentInk = readableInkOnLight(accent);
  const accentOnDark = readableInkOnDark(accent);
  const font = getFontPreset(theme.fontPreset);
  const angle = gradientAngle(theme.gradientDirection);
  const heroBg =
    theme.themeType === "gradient"
      ? `linear-gradient(${angle}, ${primary}, ${secondary})`
      : primary;

  return `
    :root {
      --color-primary: ${primary} !important;
      --color-primary-hover: ${primaryHover} !important;
      --color-primary-rgb: ${hexToRgbTuple(primary)} !important;
      --color-primary-foreground: ${primaryFg} !important;
      --color-secondary: ${secondary} !important;
      --color-secondary-hover: ${secondaryHover} !important;
      --color-secondary-rgb: ${hexToRgbTuple(secondary, "13, 148, 136")} !important;
      --color-secondary-foreground: ${secondaryFg} !important;
      --color-secondary-ink: ${secondaryInk} !important;
      --color-secondary-on-dark: ${secondaryOnDark} !important;
      --color-accent: ${accent} !important;
      --color-accent-rgb: ${hexToRgbTuple(accent, "245, 158, 11")} !important;
      --color-accent-foreground: ${accentFg} !important;
      --color-accent-ink: ${accentInk} !important;
      --color-accent-on-dark: ${accentOnDark} !important;
      --radius: ${radiusValue(theme.borderRadius)} !important;
      --radius-card: ${cardRadiusValue(theme.borderRadius)} !important;
      --radius-sm: ${smallRadiusValue(theme.borderRadius)} !important;
      --hero-bg: ${heroBg} !important;
      --font-sans: ${font.sansStack} !important;
      --font-display: ${font.displayStack} !important;
      --font-display-weight: ${font.displayWeight} !important;
      --tracking-display: ${font.displayTracking} !important;
    }
    .theme-bg-primary { background-color: ${primary} !important; color: ${primaryFg} !important; }
    .theme-text-primary { color: ${primary} !important; }
    .theme-border-primary { border-color: ${primary} !important; }
    .theme-bg-secondary { background-color: ${secondary} !important; color: ${secondaryFg} !important; }
    .theme-text-secondary { color: ${secondaryInk} !important; }
    .theme-bg-accent { background-color: ${accent} !important; color: ${accentFg} !important; }
    .theme-text-accent { color: ${accentInk} !important; }
  `;
}

export function applyThemeToDocument(theme: ThemeSettings): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.buttonStyle = theme.buttonStyle || "filled";
  document.documentElement.dataset.themeType = theme.themeType || "solid";
  let styleEl = document.getElementById("theme-dynamic-vars") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "theme-dynamic-vars";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = buildThemeCssText(theme);
}
