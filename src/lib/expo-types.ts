export type HeroSlide = {
  id: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  detailedDescription?: string;
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
