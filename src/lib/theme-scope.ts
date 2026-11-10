import type { CSSProperties } from "react";
import { getFontPreset } from "./theme-fonts";
import type { ThemeSettings } from "./theme-types";
import {
  darkenHex,
  getContrastForeground,
  getRelativeLuminance,
  hexToRgbTuple,
  normalizeHex,
  readableInkOnDark,
  readableInkOnLight,
} from "./theme-color-math";
import {
  cardRadiusValue,
  gradientAngle,
  radiusValue,
  smallRadiusValue,
} from "./theme-colors";
import { resolveSidebarPalette } from "./theme-sidebar";

export function isSidebarLightSurface(sidebarColor?: string | null): boolean {
  return getRelativeLuminance(normalizeHex(sidebarColor, "#09090B")) > 0.36;
}

export function buildThemeScopeStyle(theme: ThemeSettings): CSSProperties {
  const primary = normalizeHex(theme.primaryColor, "#4F46E5");
  const secondary = normalizeHex(theme.secondaryColor, "#0D9488");
  const accent = normalizeHex(theme.accentColor, "#F59E0B");
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

  const vars: Record<string, string> = {
    "--color-primary": primary,
    "--color-primary-hover": darkenHex(primary, 0.14),
    "--color-primary-rgb": hexToRgbTuple(primary),
    "--color-primary-foreground": getContrastForeground(primary),
    "--color-primary-ink": readableInkOnLight(primary),
    "--color-primary-on-dark": readableInkOnDark(primary),
    "--color-secondary": secondary,
    "--color-secondary-hover": darkenHex(secondary, 0.14),
    "--color-secondary-rgb": hexToRgbTuple(secondary, "13, 148, 136"),
    "--color-secondary-foreground": getContrastForeground(secondary),
    "--color-secondary-ink": readableInkOnLight(secondary),
    "--color-secondary-on-dark": readableInkOnDark(secondary),
    "--color-accent": accent,
    "--color-accent-rgb": hexToRgbTuple(accent, "245, 158, 11"),
    "--color-accent-foreground": getContrastForeground(accent),
    "--color-accent-ink": readableInkOnLight(accent),
    "--color-accent-on-dark": readableInkOnDark(accent),
    "--admin-sidebar-bg": sidebar.bg,
    "--admin-sidebar-fg": sidebar.fg,
    "--admin-sidebar-muted": sidebar.muted,
    "--admin-sidebar-group": sidebar.group,
    "--admin-sidebar-border": sidebar.border,
    "--admin-sidebar-hover": sidebar.hover,
    "--admin-sidebar-surface-btn": sidebar.surfaceBtn,
    "--admin-sidebar-active-bg": sidebar.activeBg,
    "--admin-sidebar-active-fg": sidebar.activeFg,
    "--admin-sidebar-badge-bg": sidebar.badgeBg,
    "--admin-sidebar-badge-fg": sidebar.badgeFg,
    "--admin-sidebar-scroll": sidebar.scrollThumb,
    "--radius": radiusValue(theme.borderRadius),
    "--radius-card": cardRadiusValue(theme.borderRadius),
    "--radius-sm": smallRadiusValue(theme.borderRadius),
    "--hero-bg": heroBg,
    "--font-sans": font.sansStack,
    "--font-display": font.displayStack,
    "--font-display-weight": font.displayWeight,
    "--tracking-display": font.displayTracking,
  };

  return vars as CSSProperties;
}
