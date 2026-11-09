import { getAllEvents, getFeaturedEvents, getCategories } from "@/lib/events";
import { getExpoSlides, getSponsors, getExpoScrollInterval } from "@/lib/expo-settings";
import { ExpoHeroSlider } from "@/components/home/ExpoHeroSlider";
import { SponsorsMarquee } from "@/components/home/SponsorsMarquee";
import { StatsSection } from "@/components/home/StatsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedEventsSection } from "@/components/home/FeaturedEventsSection";

export default async function HomePage() {
  const [featured, allEvents, categories, expoSlides, sponsors, scrollInterval] =
    await Promise.all([
      getFeaturedEvents(),
      getAllEvents(),
      getCategories(),
      getExpoSlides(),
      getSponsors(),
      getExpoScrollInterval(),
    ]);

  const upcoming = allEvents.slice(0, 6);

  return (
    <div>
      <ExpoHeroSlider slides={expoSlides} intervalSeconds={scrollInterval} />
      <SponsorsMarquee sponsors={sponsors} />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <FeaturedEventsSection featured={featured} upcoming={upcoming} />
    </div>
  );
}
