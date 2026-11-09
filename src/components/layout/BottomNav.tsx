"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide on admin routes (which have their own dedicated sidebar)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass,
      isActive: pathname.startsWith("/discover"),
    },
    {
      label: "Calendar",
      href: "/#calendar",
      icon: Calendar,
      isActive: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                active
                  ? "text-[var(--color-primary)] font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <div
                style={{
                  backgroundColor: active
                    ? "rgba(var(--color-primary-rgb, 79, 70, 229), 0.12)"
                    : "transparent",
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  active ? "text-[var(--color-primary)]" : "text-slate-500"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
