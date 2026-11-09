import { prisma } from "./prisma";

export type HeroSlide = {
  id: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  badgeText: string;
  category: string;
  datesText: string;
  venueText: string;
  mediaType: "image" | "video";
  videoUrl?: string;
  posterUrl: string;
  visitorCtaText: string;
  visitorCtaLink: string;
  exhibitorCtaText: string;
  exhibitorCtaLink: string;
  isActive: boolean;
};

export type SponsorItem = {
  id: string;
  name: string;
  logoText: string;
  logoUrl?: string;
  tier: "STRATEGIC" | "PLATINUM" | "GOLD" | "MEDIA";
  websiteUrl?: string;
};

export const defaultExpoSlides: HeroSlide[] = [
  {
    id: "slide-privexpo-2026",
    title: "PRIVEXPO 2026 B2B Trade & FMCG Expo",
    titleHighlight: "B2B Trade",
    subtitle:
      "Connecting regional manufacturers and contract producers with 750+ verified retail chain buyers, e-commerce distributors, and FMCG importers.",
    badgeText: "B2B Trade Meeting & Matchmaking",
    category: "Trade Show",
    datesText: "Nov 4–5, 2026",
    venueText: "Millennium Hall, Addis Ababa",
    mediaType: "video",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600",
    visitorCtaText: "Get Trade Buyer Pass",
    visitorCtaLink: "/discover?category=business",
    exhibitorCtaText: "Book Exhibition Booth",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
  {
    id: "slide-tech-summit-2026",
    title: "Addis AI & Cloud Innovation Expo 2026",
    titleHighlight: "Innovation Expo",
    subtitle:
      "East Africa's flagship technology exhibition gathering 350+ software enterprise exhibitors, tech founders, and digital leaders.",
    badgeText: "Enterprise Technology Summit",
    category: "Technology",
    datesText: "Dec 10–12, 2026",
    venueText: "Skylight Convention Center",
    mediaType: "image",
    posterUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600",
    visitorCtaText: "Explore Keynotes & Passes",
    visitorCtaLink: "/discover?category=technology",
    exhibitorCtaText: "Reserve Startup Stand",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
  {
    id: "slide-agro-food-2027",
    title: "Ethiopia Agro-Manufacturing & Packaging Expo",
    titleHighlight: "Manufacturing",
    subtitle:
      "The premier B2B sourcing platform for agricultural processing machinery, packaging materials, and international food exports.",
    badgeText: "International Industry Expo",
    category: "Manufacturing",
    datesText: "Jan 18–20, 2027",
    venueText: "Friendship Expo Center, Addis Ababa",
    mediaType: "image",
    posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600",
    visitorCtaText: "Register as Buyer",
    visitorCtaLink: "/discover",
    exhibitorCtaText: "Apply for Shell Scheme",
    exhibitorCtaLink: "#exhibit",
    isActive: true,
  },
];

export const defaultSponsors: SponsorItem[] = [
  {
    id: "sp-ethio-telecom",
    name: "Ethio Telecom",
    logoText: "ethio telecom",
    tier: "STRATEGIC",
    websiteUrl: "https://www.ethiotelecom.et",
  },
  {
    id: "sp-cbe",
    name: "Commercial Bank of Ethiopia",
    logoText: "CBE Bank",
    tier: "STRATEGIC",
    websiteUrl: "https://www.combanketh.et",
  },
  {
    id: "sp-ethiopian-airlines",
    name: "Ethiopian Airlines",
    logoText: "Ethiopian Airlines",
    tier: "PLATINUM",
    websiteUrl: "https://www.ethiopianairlines.com",
  },
  {
    id: "sp-chamber",
    name: "Addis Ababa Chamber of Commerce",
    logoText: "Addis Chamber",
    tier: "PLATINUM",
    websiteUrl: "https://addischamber.com",
  },
  {
    id: "sp-tradeshow-intel",
    name: "TradeShow Intelligence",
    logoText: "TradeShow Intel",
    tier: "MEDIA",
    websiteUrl: "https://tradeshowintel.com",
  },
  {
    id: "sp-eurasia-b2b",
    name: "Eurasia Trade Network",
    logoText: "Eurasia B2B",
    tier: "MEDIA",
    websiteUrl: "https://privexpo.com",
  },
];

export async function getExpoSlides(): Promise<HeroSlide[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "expo_hero_slides" },
    });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultExpoSlides;
}

export async function saveExpoSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_hero_slides" },
    update: { value: JSON.stringify(slides) },
    create: { key: "expo_hero_slides", value: JSON.stringify(slides) },
  });
  return slides;
}

export async function getSponsors(): Promise<SponsorItem[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "expo_sponsors" },
    });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultSponsors;
}

export async function saveSponsors(sponsors: SponsorItem[]): Promise<SponsorItem[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_sponsors" },
    update: { value: JSON.stringify(sponsors) },
    create: { key: "expo_sponsors", value: JSON.stringify(sponsors) },
  });
  return sponsors;
}
