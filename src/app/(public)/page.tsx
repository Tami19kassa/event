import { getAllEvents, getFeaturedEvents, getCategories } from "@/lib/events";
import { getThemeSettings } from "@/lib/settings";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedEventsSection } from "@/components/home/FeaturedEventsSection";

export default async function HomePage() {
  const [featured, allEvents, categories, theme] = await Promise.all([
    getFeaturedEvents(),
    getAllEvents(),
    getCategories(),
    getThemeSettings(),
  ]);

  const upcoming = allEvents.slice(0, 6);

  return (
    <div>
      <HeroSection
        mediaType={theme.heroMediaType || "image"}
        videoUrl={theme.heroVideoUrl}
        posterUrl={theme.heroPosterUrl}
        badgeText={theme.heroBadgeText}
        title={theme.heroTitle}
        titleHighlight={theme.heroTitleHighlight}
        subtitle={theme.heroSubtitle}
        searchPlaceholder={theme.heroSearchPlaceholder}
      />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <FeaturedEventsSection featured={featured} upcoming={upcoming} />
    </div>
  );
}
