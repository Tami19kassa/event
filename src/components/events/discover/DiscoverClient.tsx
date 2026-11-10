"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Event, Category } from "@/types/event";
import { DiscoverHeader } from "./DiscoverHeader";
import { DiscoverSidebar } from "./DiscoverSidebar";
import { DiscoverGrid } from "./DiscoverGrid";

interface Props {
  initialEvents: Event[];
  initialCategories: Category[];
  initialQuery: string;
  initialCategorySlug: string | null;
}

function getEntryPrice(event: Event): number {
  const prices = event.ticketTiers?.map((t) => t.price) || [];
  return prices.length > 0 ? Math.min(...prices) : 0;
}

function resolveCategoryName(categories: Category[], slugOrName: string | null): string | null {
  if (!slugOrName) return null;
  const target = slugOrName.toLowerCase();
  const match = categories.find(
    (c) => c.slug.toLowerCase() === target || c.name.toLowerCase() === target
  );
  return match ? match.name : slugOrName;
}

export function DiscoverClient({
  initialEvents,
  initialCategories,
  initialQuery,
  initialCategorySlug,
}: Props) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? initialQuery;
  const urlCat = searchParams.get("category") ?? initialCategorySlug;

  const [search, setSearch] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() =>
    resolveCategoryName(initialCategories, urlCat)
  );
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? initialQuery);
  }, [searchParams, initialQuery]);

  useEffect(() => {
    const paramCat = searchParams.get("category") ?? initialCategorySlug;
    setSelectedCategory(resolveCategoryName(initialCategories, paramCat));
  }, [searchParams, initialCategorySlug, initialCategories]);

  const filtered = useMemo(() => {
    let result = [...initialEvents];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription?.toLowerCase().includes(q) ||
          e.location.city.toLowerCase().includes(q) ||
          e.location.name.toLowerCase().includes(q) ||
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
      if (sortBy === "date") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === "popularity") {
        return b.attendeesCount - a.attendeesCount;
      }
      if (sortBy === "price-asc") {
        return getEntryPrice(a) - getEntryPrice(b);
      }
      if (sortBy === "price-desc") {
        return getEntryPrice(b) - getEntryPrice(a);
      }
      return 0;
    });
  }, [initialEvents, search, selectedCategory, selectedFormat, sortBy]);

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
          categories={initialCategories}
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
