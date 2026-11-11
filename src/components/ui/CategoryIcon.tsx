import {
  Briefcase,
  Building2,
  Clapperboard,
  Compass,
  Cpu,
  Globe,
  GraduationCap,
  HeartPulse,
  Landmark,
  Mic2,
  Music,
  Palette,
  ShoppingBag,
  Sparkles,
  Sprout,
  Stethoscope,
  Tag,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type CategoryIconKey =
  | "briefcase"
  | "building-2"
  | "cpu"
  | "music"
  | "palette"
  | "graduation-cap"
  | "utensils"
  | "trophy"
  | "heart-pulse"
  | "sprout"
  | "stethoscope"
  | "landmark"
  | "globe"
  | "mic-2"
  | "clapperboard"
  | "compass"
  | "shopping-bag"
  | "sparkles"
  | "tag";

export const CATEGORY_ICON_OPTIONS: { key: CategoryIconKey; label: string }[] = [
  { key: "building-2", label: "Expos & Fairs" },
  { key: "briefcase", label: "Business" },
  { key: "cpu", label: "Tech & AI" },
  { key: "mic-2", label: "Conferences" },
  { key: "music", label: "Music & Shows" },
  { key: "palette", label: "Arts & Design" },
  { key: "graduation-cap", label: "Education" },
  { key: "utensils", label: "Food & Beverage" },
  { key: "trophy", label: "Sports" },
  { key: "heart-pulse", label: "Wellness" },
  { key: "sprout", label: "Agriculture" },
  { key: "stethoscope", label: "Healthcare" },
  { key: "landmark", label: "Gov & Policy" },
  { key: "globe", label: "Global & NGO" },
  { key: "clapperboard", label: "Media & Film" },
  { key: "shopping-bag", label: "Retail & Market" },
  { key: "compass", label: "Tourism" },
  { key: "tag", label: "General" },
];

const ICON_COMPONENTS: Record<CategoryIconKey, LucideIcon> = {
  briefcase: Briefcase,
  "building-2": Building2,
  cpu: Cpu,
  music: Music,
  palette: Palette,
  "graduation-cap": GraduationCap,
  utensils: Utensils,
  trophy: Trophy,
  "heart-pulse": HeartPulse,
  sprout: Sprout,
  stethoscope: Stethoscope,
  landmark: Landmark,
  globe: Globe,
  "mic-2": Mic2,
  clapperboard: Clapperboard,
  compass: Compass,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  tag: Tag,
};

const LEGACY_EMOJI_TO_KEY: Record<string, CategoryIconKey> = {
  "💼": "briefcase",
  "💻": "cpu",
  "🎵": "music",
  "🎨": "palette",
  "📚": "graduation-cap",
  "🎓": "graduation-cap",
  "🍷": "utensils",
  "🍔": "utensils",
  "⚽": "trophy",
  "🏃‍♂️": "trophy",
  "🧘": "heart-pulse",
  "🩺": "stethoscope",
  "🏥": "stethoscope",
  "🎪": "building-2",
  "🏗️": "building-2",
  "🌾": "sprout",
  "🏛️": "landmark",
  "🚀": "sparkles",
  "📌": "tag",
};

export function resolveCategoryIconKey(value?: string | null): CategoryIconKey {
  const raw = String(value || "").trim();
  if (!raw) return "tag";
  if (raw in ICON_COMPONENTS) return raw as CategoryIconKey;
  if (raw in LEGACY_EMOJI_TO_KEY) return LEGACY_EMOJI_TO_KEY[raw];
  return "tag";
}

interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export function CategoryIcon({ name, className = "w-4 h-4" }: CategoryIconProps) {
  const key = resolveCategoryIconKey(name);
  const IconComponent = ICON_COMPONENTS[key];
  return <IconComponent className={className} />;
}
