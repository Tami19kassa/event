import { isValidFontPreset, type FontPresetKey } from "./theme-fonts";

export function sanitizePublicHttpUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    if (!parsed.hostname || !parsed.hostname.includes(".")) return "";
    return parsed.toString().slice(0, 240);
  } catch {
    return "";
  }
}

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
  footerTagline: string;
  supportEmail: string;
  supportPhone: string;
  contactCity: string;
  socialTelegram: string;
  socialInstagram: string;
  socialLinkedIn: string;
  socialX: string;
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
  footerTagline:
    "The premier platform for discovering trade expos, summits, concerts, and cultural experiences across Ethiopia.",
  supportEmail: "",
  supportPhone: "",
  contactCity: "Addis Ababa, Ethiopia",
  socialTelegram: "",
  socialInstagram: "",
  socialLinkedIn: "",
  socialX: "",
};

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
const VALID_RADII = new Set(["none", "sm", "md", "lg", "xl"]);
const VALID_BTN_STYLES = new Set(["filled", "soft", "outline"]);
const VALID_GRADIENT_DIRS = new Set([
  "to-br",
  "to-r",
  "to-b",
  "to-tr",
  "to-bl",
  "to-l",
  "to-tl",
  "to-t",
]);

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
  if (typeof raw.gradientDirection === "string" && VALID_GRADIENT_DIRS.has(raw.gradientDirection.trim())) {
    out.gradientDirection = raw.gradientDirection.trim();
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
  if (typeof raw.footerTagline === "string") {
    out.footerTagline = raw.footerTagline.trim().slice(0, 240);
  }
  if (typeof raw.supportEmail === "string") {
    const email = raw.supportEmail.trim().slice(0, 120);
    out.supportEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
  }
  if (typeof raw.supportPhone === "string") {
    out.supportPhone = raw.supportPhone.replace(/[^+\d\s\-()]/g, "").trim().slice(0, 40);
  }
  if (typeof raw.contactCity === "string") {
    out.contactCity = raw.contactCity.trim().slice(0, 80);
  }
  if (typeof raw.socialTelegram === "string") {
    out.socialTelegram = sanitizePublicHttpUrl(raw.socialTelegram);
  }
  if (typeof raw.socialInstagram === "string") {
    out.socialInstagram = sanitizePublicHttpUrl(raw.socialInstagram);
  }
  if (typeof raw.socialLinkedIn === "string") {
    out.socialLinkedIn = sanitizePublicHttpUrl(raw.socialLinkedIn);
  }
  if (typeof raw.socialX === "string") {
    out.socialX = sanitizePublicHttpUrl(raw.socialX);
  }
  return out;
}
