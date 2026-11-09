"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Event, Category } from "@/types/event";
import { events as initialMockEvents, categories as initialMockCategories } from "@/lib/mock-data";
import { DiscoverHeader } from "@/components/events/discover/DiscoverHeader";
import { DiscoverSidebar } from "@/components/events/discover/DiscoverSidebar";
import { DiscoverGrid } from "@/components/events/discover/DiscoverGrid";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || null;

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [eventsList, setEventsList] = useState<Event[]>(initialMockEvents);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialMockCategories);

  useEffect(() => {
    async function fetchLiveData() {
      try {
        const [eventsRes, catsRes] = await Promise.all([
          fetch("/api/events?format=ui"),
          fetch("/api/categories"),
        ]);
        if (eventsRes.ok) {
          const live = await eventsRes.json();
          if (Array.isArray(live) && live.length > 0) setEventsList(live);
        }
        if (catsRes.ok) {
          const cats = await catsRes.json();
          if (Array.isArray(cats) && cats.length > 0) setCategoriesList(cats);
        }
      } catch {}
    }
    fetchLiveData();
  }, []);

  useEffect(() => {
    if (initialQuery) setSearch(initialQuery);
    if (initialCategory) {
      const match = categoriesList.find(
        (c) => c.slug.toLowerCase() === initialCategory.toLowerCase() ||
               c.name.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) setSelectedCategory(match.name);
    }
  }, [initialQuery, initialCategory, categoriesList]);

  const filtered = useMemo(() => {
    let result = [...eventsList];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription?.toLowerCase().includes(q) ||
          e.location.city.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedFormat !== "All") {
      result = result.filter(
        (e) => e.format.toLowerCase() === selectedFormat.toLowerCase()
      );
    }

    return result.sort((a, b) => {
      if (sortBy === "date") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (sortBy === "popularity") return b.attendeesCount - a.attendeesCount;
      if (sortBy === "price-asc") {
        const pA = Math.min(...a.ticketTiers.map((t) => t.price), 0);
        const pB = Math.min(...b.ticketTiers.map((t) => t.price), 0);
        return pA - pB;
      }
      return 0;
    });
  }, [eventsList, search, selectedCategory, selectedFormat, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DiscoverHeader
        search={search}
        onSearchChange={setSearch}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        sortBy={sortBy}
        onSortChange={setSortBy}
        view={view}
        onViewChange={setView}
      />

      <div className="flex flex-col md:flex-row gap-8">
        <DiscoverSidebar
          categories={categoriesList}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <DiscoverGrid
          events={filtered}
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
          search={search}
          onClearSearch={() => setSearch("")}
          view={view}
        />
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-400">Loading discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
