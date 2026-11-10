import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { getEventBySlug, getAllEvents } from "@/lib/events";
import { getEventMediaPosts } from "@/lib/media-posts";
import { getThemeSettings } from "@/lib/settings";
import { resolveOgImageUrl } from "@/lib/site-url";
import { TicketSelector } from "@/components/events/TicketSelector";
import { EventHeroBanner } from "@/components/events/detail/EventHeroBanner";
import { EventDetailsContent } from "@/components/events/detail/EventDetailsContent";
import { EventMediaStrip } from "@/components/media/EventMediaStrip";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [event, theme] = await Promise.all([getEventBySlug(slug), getThemeSettings()]);
  if (!event) {
    return { title: `Event Not Found — ${theme.siteName}` };
  }

  const description = (event.shortDescription || event.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const ogImage = resolveOgImageUrl(event.imageUrl);
  const title = `${event.title} — ${theme.siteName}`;

  return {
    title,
    description: description || `${event.title} in ${event.location.city}.`,
    openGraph: {
      title: event.title,
      description: description || `${event.title} · ${event.location.name}`,
      url: `/events/${event.slug}`,
      siteName: theme.siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: event.title }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: event.title,
      description: description || `${event.title} · ${event.location.city}`,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const eventMedia = await getEventMediaPosts(event.id);

  return (
    <div>
      <EventHeroBanner event={event} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <EventDetailsContent event={event} />
            <EventMediaStrip posts={eventMedia} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <TicketSelector event={event} />

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-900">
                  <Users className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>{event.attendeesCount.toLocaleString()} attendees registered</span>
                </div>
                <div className="text-slate-400">
                  Venue maximum capacity: {event.capacity.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
