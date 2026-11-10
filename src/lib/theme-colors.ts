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
  const f = 1 - Math.min(0.5, Math.max(0, ratio));
  const toHex = (v: number) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

export function buildThemeCssText(theme: ThemeSettings): string {
  const primary = normalizeHex(theme.primaryColor, "#4F46E5");
  const secondary = normalizeHex(theme.secondaryColor, "#0D9488");
  const accent = normalizeHex(theme.accentColor, "#F59E0B");
  const primaryHover = darkenHex(primary, 0.14);
  const secondaryHover = darkenHex(secondary, 0.14);
  const primaryFg = getContrastForeground(primary);
  const secondaryFg = getContrastForeground(secondary);
  const font = getFontPreset(theme.fontPreset);
  const heroBg =
    theme.themeType === "gradient"
      ? `linear-gradient(135deg, ${primary}, ${secondary})`
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
      --color-accent: ${accent} !important;
      --color-accent-rgb: ${hexToRgbTuple(accent, "245, 158, 11")} !important;
      --radius: ${radiusValue(theme.borderRadius)} !important;
      --hero-bg: ${heroBg} !important;
      --font-sans: ${font.sansStack} !important;
      --font-display: ${font.displayStack} !important;
    }
    .theme-bg-primary { background-color: ${primary} !important; color: ${primaryFg} !important; }
    .theme-text-primary { color: ${primary} !important; }
    .theme-border-primary { border-color: ${primary} !important; }
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
