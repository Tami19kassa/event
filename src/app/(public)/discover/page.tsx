import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllEvents, getCategories } from "@/lib/events";
import { getThemeSettings } from "@/lib/settings";
import { DiscoverClient } from "@/components/events/discover/DiscoverClient";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const [{ category }, theme] = await Promise.all([searchParams, getThemeSettings()]);
  const label = category ? `${category} Events & Expos` : "Discover Events & Expos";
  return {
    title: `${label} — ${theme.siteName}`,
    description: `Browse verified conferences, concerts, and B2B exhibitions on ${theme.siteName}.`,
  };
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  const [{ q, category }, events, categories] = await Promise.all([
    searchParams,
    getAllEvents(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-400">Loading events...</div>}>
      <DiscoverClient
        initialEvents={events}
        initialCategories={categories}
        initialQuery={q || ""}
        initialCategorySlug={category || null}
      />
    </Suspense>
  );
}
