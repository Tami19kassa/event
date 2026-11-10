"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

type Props = {
  siteName?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  categories?: Array<{ name: string; slug: string }>;
};

export function Header({
  siteName = "Utopia",
  logoUrl,
  categories,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4)
      : [
          { name: "Technology", slug: "technology" },
          { name: "Concerts & Arts", slug: "music" },
          { name: "Business Expos", slug: "business" },
        ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          <Link href="/" className="shrink-0">
            <BrandLogo siteName={siteName} logoUrl={logoUrl} showSubtitle={false} />
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-7 mx-2 lg:mx-6">
            <Link
              href="/discover"
              prefetch={true}
              className="text-sm font-bold text-slate-800 hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
            >
              Discover
            </Link>
            {navCategories.map((c, idx) => (
              <Link
                key={c.slug}
                href={`/discover?category=${c.slug}`}
                prefetch={true}
                className={`text-sm font-semibold text-slate-600 hover:text-[var(--color-primary)] transition-colors capitalize whitespace-nowrap ${
                  idx >= 2 ? "hidden lg:inline-block" : ""
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Tablet (md+) & Desktop Search Always Accessible */}
            <form
              action="/discover"
              method="GET"
              className="relative hidden md:block w-48 lg:w-64 xl:w-72"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                name="q"
                placeholder="Search events, expos, venues..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
            </form>

            <button
              type="button"
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 animate-in fade-in">
          <form action="/discover" method="GET" className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search events, expos, venues..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </form>

          <Link
            href="/discover"
            className="block px-3 py-2 text-base font-bold text-slate-800 rounded-xl hover:bg-slate-50"
            onClick={() => setMobileOpen(false)}
          >
            Discover All Events
          </Link>
          {navCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/discover?category=${c.slug}`}
              className="block px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 capitalize"
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
