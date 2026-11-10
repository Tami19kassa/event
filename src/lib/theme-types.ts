import { isValidFontPreset, type FontPresetKey } from "./theme-fonts";

export type ThemeSettings = {
  siteName: string;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeType: "solid" | "gradient";
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  buttonStyle: "filled" | "soft" | "outline";
  fontPreset: FontPresetKey;
};

export const defaultThemeSettings: ThemeSettings = {
  siteName: "Utopia",
  logoUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  primaryColor: "#4F46E5",
  secondaryColor: "#0D9488",
  accentColor: "#F59E0B",
  themeType: "solid",
  gradientFrom: "#4F46E5",
  gradientTo: "#0D9488",
  gradientDirection: "to-br",
  borderRadius: "xl",
  buttonStyle: "filled",
  fontPreset: "inter",
};

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
const VALID_RADII = new Set(["none", "sm", "md", "lg", "xl"]);
const VALID_BTN_STYLES = new Set(["filled", "soft", "outline"]);

export function pickThemeFields(raw: Partial<ThemeSettings>): Partial<ThemeSettings> {
  const out: Partial<ThemeSettings> = {};
  if (typeof raw.siteName === "string" && raw.siteName.trim()) {
    out.siteName = raw.siteName.trim().slice(0, 80);
  }
  if (raw.logoUrl === null || typeof raw.logoUrl === "string") out.logoUrl = raw.logoUrl || null;
  if (raw.logoDarkUrl === null || typeof raw.logoDarkUrl === "string") out.logoDarkUrl = raw.logoDarkUrl || null;
  if (raw.faviconUrl === null || typeof raw.faviconUrl === "string") out.faviconUrl = raw.faviconUrl || null;

  if (typeof raw.primaryColor === "string" && HEX_COLOR_RE.test(raw.primaryColor.trim())) {
    out.primaryColor = raw.primaryColor.trim();
  }
  if (typeof raw.secondaryColor === "string" && HEX_COLOR_RE.test(raw.secondaryColor.trim())) {
    out.secondaryColor = raw.secondaryColor.trim();
  }
  if (typeof raw.accentColor === "string" && HEX_COLOR_RE.test(raw.accentColor.trim())) {
    out.accentColor = raw.accentColor.trim();
  }
  if (raw.themeType === "solid" || raw.themeType === "gradient") {
    out.themeType = raw.themeType;
  }
  if (typeof raw.gradientFrom === "string" && HEX_COLOR_RE.test(raw.gradientFrom.trim())) {
    out.gradientFrom = raw.gradientFrom.trim();
  }
  if (typeof raw.gradientTo === "string" && HEX_COLOR_RE.test(raw.gradientTo.trim())) {
    out.gradientTo = raw.gradientTo.trim();
  }
  if (typeof raw.gradientDirection === "string" && raw.gradientDirection.trim()) {
    out.gradientDirection = raw.gradientDirection.trim().slice(0, 20);
  }
  if (typeof raw.borderRadius === "string" && VALID_RADII.has(raw.borderRadius)) {
    out.borderRadius = raw.borderRadius as ThemeSettings["borderRadius"];
  }
  if (typeof raw.buttonStyle === "string" && VALID_BTN_STYLES.has(raw.buttonStyle)) {
    out.buttonStyle = raw.buttonStyle as ThemeSettings["buttonStyle"];
  }
  if (isValidFontPreset(raw.fontPreset)) {
    out.fontPreset = raw.fontPreset;
  }
  return out;
}
