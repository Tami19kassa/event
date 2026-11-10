export type FontPresetKey =
  | "inter"
  | "jakarta"
  | "dm-sans"
  | "outfit"
  | "space-grotesk"
  | "playfair-inter";

export type FontPresetConfig = {
  key: FontPresetKey;
  label: string;
  vibe: string;
  sampleHeading: string;
  sansStack: string;
  displayStack: string;
  displayWeight: "700" | "800";
  displayTracking: string;
};

const ETHIOPIC_FALLBACK = 'var(--font-ui-ethiopic), ui-sans-serif, system-ui, sans-serif';

export const FONT_PRESETS: FontPresetConfig[] = [
  {
    key: "inter",
    label: "Inter",
    vibe: "Clean Neutral SaaS",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-inter), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-inter), ${ETHIOPIC_FALLBACK}`,
    displayWeight: "800",
    displayTracking: "-0.025em",
  },
  {
    key: "jakarta",
    label: "Plus Jakarta Sans",
    vibe: "Friendly & Contemporary",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-jakarta), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-jakarta), ${ETHIOPIC_FALLBACK}`,
    displayWeight: "800",
    displayTracking: "-0.025em",
  },
  {
    key: "dm-sans",
    label: "DM Sans",
    vibe: "Crisp Swiss Geometry",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-dm), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-dm), ${ETHIOPIC_FALLBACK}`,
    displayWeight: "700",
    displayTracking: "-0.025em",
  },
  {
    key: "outfit",
    label: "Outfit",
    vibe: "Bold Expo Display",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-outfit), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-outfit), ${ETHIOPIC_FALLBACK}`,
    displayWeight: "800",
    displayTracking: "-0.02em",
  },
  {
    key: "space-grotesk",
    label: "Space Grotesk + Inter",
    vibe: "Tech & Innovation Summit",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-inter), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-space), ${ETHIOPIC_FALLBACK}`,
    displayWeight: "700",
    displayTracking: "-0.02em",
  },
  {
    key: "playfair-inter",
    label: "Playfair Display + Inter",
    vibe: "Editorial Gala & Culture",
    sampleHeading: "Modern Event Operations",
    sansStack: `var(--font-ui-inter), ${ETHIOPIC_FALLBACK}`,
    displayStack: `var(--font-ui-playfair), Georgia, serif`,
    displayWeight: "700",
    displayTracking: "-0.015em",
  },
];

export function isValidFontPreset(value: unknown): value is FontPresetKey {
  return FONT_PRESETS.some((p) => p.key === value);
}

export function getFontPreset(key?: string | null): FontPresetConfig {
  return FONT_PRESETS.find((p) => p.key === key) || FONT_PRESETS[0];
}
