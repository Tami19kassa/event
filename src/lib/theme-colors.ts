import { getFontPreset } from "./theme-fonts";
import type { ThemeSettings } from "./theme-types";
import {
  darkenHex,
  getContrastForeground,
  getRelativeLuminance,
  hexToRgbTuple,
  lightenHex,
  normalizeHex,
  readableInkOnDark,
  readableInkOnLight,
} from "./theme-color-math";
import { resolveSidebarPalette } from "./theme-sidebar";

export {
  normalizeHex,
  hexToRgbTuple,
  getRelativeLuminance,
  getContrastForeground,
  darkenHex,
  lightenHex,
  readableInkOnLight,
  readableInkOnDark,
};

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
  const primaryInk = readableInkOnLight(primary);
  const primaryOnDark = readableInkOnDark(primary);
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

  const sidebar = resolveSidebarPalette({
    sidebarColor: theme.adminSidebarColor,
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    themeType: theme.themeType,
  });

  return `
    :root {
      --color-primary: ${primary} !important;
      --color-primary-hover: ${primaryHover} !important;
      --color-primary-rgb: ${hexToRgbTuple(primary)} !important;
      --color-primary-foreground: ${primaryFg} !important;
      --color-primary-ink: ${primaryInk} !important;
      --color-primary-on-dark: ${primaryOnDark} !important;
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
      --admin-sidebar-bg: ${sidebar.bg} !important;
      --admin-sidebar-fg: ${sidebar.fg} !important;
      --admin-sidebar-muted: ${sidebar.muted} !important;
      --admin-sidebar-group: ${sidebar.group} !important;
      --admin-sidebar-border: ${sidebar.border} !important;
      --admin-sidebar-hover: ${sidebar.hover} !important;
      --admin-sidebar-surface-btn: ${sidebar.surfaceBtn} !important;
      --admin-sidebar-active-bg: ${sidebar.activeBg} !important;
      --admin-sidebar-active-fg: ${sidebar.activeFg} !important;
      --admin-sidebar-badge-bg: ${sidebar.badgeBg} !important;
      --admin-sidebar-badge-fg: ${sidebar.badgeFg} !important;
      --admin-sidebar-scroll: ${sidebar.scrollThumb} !important;
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
    .theme-text-primary { color: ${primaryInk} !important; }
    .theme-border-primary { border-color: ${primary} !important; }
    .theme-bg-secondary { background-color: ${secondary} !important; color: ${secondaryFg} !important; }
    .theme-text-secondary { color: ${secondaryInk} !important; }
    .theme-bg-accent { background-color: ${accent} !important; color: ${accentFg} !important; }
    .theme-text-accent { color: ${accentInk} !important; }
  `;
}

export function applyThemeToDocument(theme: ThemeSettings): void {
  if (typeof document === "undefined") return;
  const sidebarLum = getRelativeLuminance(normalizeHex(theme.adminSidebarColor, "#09090B"));
  document.documentElement.dataset.buttonStyle = theme.buttonStyle || "filled";
  document.documentElement.dataset.themeType = theme.themeType || "solid";
  document.documentElement.dataset.sidebarSurface = sidebarLum > 0.36 ? "light" : "dark";
  let styleEl = document.getElementById("theme-dynamic-vars") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "theme-dynamic-vars";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = buildThemeCssText(theme);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("utopia:theme-change", { detail: theme }));
  }
}
