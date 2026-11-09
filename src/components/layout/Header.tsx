"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Menu, X, MapPin } from "lucide-react";
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
  primaryColor = "#4F46E5",
  categories,
}: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      // Hero section is ~560px-620px; reveal nav search once scrolled past 320px
      setScrolledPastHero(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const showSearch = !isHomePage || scrolledPastHero;

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
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="shrink-0">
            <BrandLogo siteName={siteName} logoUrl={logoUrl} />
          </Link>

          {/* Centered Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 mx-6">
            <Link
              href="/discover"
              prefetch={true}
              className="text-sm font-bold text-slate-800 hover:text-[var(--color-primary)] transition-colors active:scale-95"
            >
              Discover
            </Link>
            {navCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/discover?category=${c.slug}`}
                prefetch={true}
                className="text-sm font-semibold text-slate-600 hover:text-[var(--color-primary)] transition-colors capitalize active:scale-95"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input Bar with Smooth Progressive Disclosure */}
            <div
              className={`transition-all duration-300 ease-out hidden lg:block overflow-hidden ${
                showSearch
                  ? "w-64 xl:w-72 opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-4 pointer-events-none"
              }`}
            >
              <form action="/discover" method="GET" className="relative w-64 xl:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search events in Addis..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
              </form>
            </div>

            {/* Localized City Badge */}
            <div
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/80 border border-slate-200/80 px-3.5 py-2 rounded-full shadow-2xs"
              title="Official City: Addis Ababa, Ethiopia"
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Addis Ababa</span>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 animate-in fade-in">
          <form action="/discover" method="GET" className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search events in Addis Ababa..."
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
