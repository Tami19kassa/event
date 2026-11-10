import { Suspense } from "react";
import { getAllEvents, getCategories } from "@/lib/events";
import { DiscoverClient } from "@/components/events/discover/DiscoverClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
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
