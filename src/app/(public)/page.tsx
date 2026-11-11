import { getAllEvents, getFeaturedEvents, getCategories } from "@/lib/events";
import { getExpoSlides, getSponsors, getExpoScrollInterval } from "@/lib/expo-settings";
import { getHomepageMediaPosts } from "@/lib/media-posts";
import { ExpoHeroSlider } from "@/components/home/ExpoHeroSlider";
import { StatsSection } from "@/components/home/StatsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { EventCalendarSection } from "@/components/home/calendar/EventCalendarSection";
import { FeaturedEventsSection } from "@/components/home/FeaturedEventsSection";
import { MediaHighlightsSection } from "@/components/home/MediaHighlightsSection";
import { SponsorsMarquee } from "@/components/home/SponsorsMarquee";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, allEvents, categories, expoSlides, sponsors, scrollInterval, mediaPosts] =
    await Promise.all([
      getFeaturedEvents(),
      getAllEvents(),
      getCategories(),
      getExpoSlides(),
      getSponsors(),
      getExpoScrollInterval(),
      getHomepageMediaPosts(6),
    ]);

  const activeExpos = expoSlides.filter((s) => s.isActive).length;
  const availablePassesCount = allEvents.reduce(
    (sum, ev) => sum + ev.ticketTiers.reduce((tSum, t) => tSum + (t.remaining || 0), 0),
    0
  );
  const upcoming = allEvents.slice(0, 6);

  return (
    <div>
      <ExpoHeroSlider slides={expoSlides} intervalSeconds={scrollInterval} />
      <StatsSection
        liveEventsCount={allEvents.length + activeExpos}
        availablePassesCount={availablePassesCount}
        sponsorsCount={sponsors.length}
        categoriesCount={categories.length}
      />
      <CategoriesSection categories={categories} />
      <div id="calendar">
        <EventCalendarSection events={allEvents} />
      </div>
      <FeaturedEventsSection featured={featured} upcoming={upcoming} />
      <MediaHighlightsSection posts={mediaPosts} />
      <SponsorsMarquee sponsors={sponsors} />
    </div>
  );
}
