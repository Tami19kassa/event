import {
  contrastRatio,
  darkenHex,
  getContrastForeground,
  getRelativeLuminance,
  mixHex,
  normalizeHex,
} from "./theme-color-math";

export interface SidebarPalette {
  bg: string;
  isLight: boolean;
  fg: string;
  muted: string;
  group: string;
  border: string;
  hover: string;
  surfaceBtn: string;
  activeBg: string;
  activeFg: string;
  badgeBg: string;
  badgeFg: string;
  scrollThumb: string;
  hasActiveCollision: boolean;
}

export function deriveBrandSidebarTint(brandHex: string): string {
  const normalized = normalizeHex(brandHex, "#4F46E5");
  const deep = darkenHex(normalized, 0.78);
  return mixHex(deep, "#09090B", 0.35);
}

export function resolveSidebarPalette({
  sidebarColor,
  primaryColor,
  secondaryColor,
  accentColor,
  themeType,
}: {
  sidebarColor?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  themeType?: string | null;
}): SidebarPalette {
  const bg = normalizeHex(sidebarColor, "#09090B");
  const primary = normalizeHex(primaryColor, "#4F46E5");
  const secondary = normalizeHex(secondaryColor, "#0D9488");
  const accent = normalizeHex(accentColor, "#F59E0B");
  const isLight = getRelativeLuminance(bg) > 0.36;

  const primaryDistinct = contrastRatio(primary, bg) >= 2.2;
  const secondaryDistinct = contrastRatio(secondary, bg) >= 2.0;

  let activeBg = primary;
  let activeFg = getContrastForeground(primary);
  let hasActiveCollision = false;

  if (primaryDistinct) {
    if (themeType === "gradient" && secondaryDistinct) {
      activeBg = `linear-gradient(135deg, ${primary}, ${secondary})`;
    }
  } else {
    hasActiveCollision = true;
    activeBg = isLight ? "#0F172A" : "#FFFFFF";
    activeFg = isLight ? "#FFFFFF" : "#0F172A";
  }

  const accentDistinct = contrastRatio(accent, bg) >= 2.2;
  const badgeBg = accentDistinct ? accent : isLight ? "#0F172A" : "#FFFFFF";
  const badgeFg = getContrastForeground(badgeBg);

  return {
    bg,
    isLight,
    fg: isLight ? "#0F172A" : "#F8FAFC",
    muted: isLight ? "#475569" : "rgba(241, 245, 249, 0.72)",
    group: isLight ? "#64748B" : "rgba(241, 245, 249, 0.48)",
    border: isLight ? "rgba(15, 23, 42, 0.09)" : "rgba(255, 255, 255, 0.1)",
    hover: isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.08)",
    surfaceBtn: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.06)",
    activeBg,
    activeFg,
    badgeBg,
    badgeFg,
    scrollThumb: isLight ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 255, 255, 0.2)",
    hasActiveCollision,
  };
}

export function buildSidebarPresets(primaryColor: string, secondaryColor: string) {
  return [
    { name: "Obsidian", color: "#09090B" },
    { name: "Brand Tint", color: deriveBrandSidebarTint(primaryColor) },
    { name: "Secondary Dark", color: deriveBrandSidebarTint(secondaryColor) },
    { name: "Midnight Navy", color: "#0F172A" },
    { name: "Crisp White", color: "#FFFFFF" },
    { name: "Soft Slate", color: "#F1F5F9" },
  ];
}
