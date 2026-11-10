import { Calendar, Ticket, Award, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface StatsProps {
  liveEventsCount: number;
  availablePassesCount: number;
  sponsorsCount: number;
  categoriesCount: number;
}

export function StatsSection({
  liveEventsCount,
  availablePassesCount,
  sponsorsCount,
  categoriesCount,
}: StatsProps) {
  const stats = [
    { icon: Calendar, label: "Live Events & Expos", value: `${liveEventsCount}` },
    { icon: Ticket, label: "Available Passes", value: availablePassesCount.toLocaleString() },
    { icon: Award, label: "Official Sponsors", value: `${sponsorsCount}` },
    { icon: ShieldCheck, label: `Tracks Across ${categoriesCount} Sectors`, value: "Telebirr · CBE" },
  ];

  return (
    <section className="border-b border-slate-200/80 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <ScrollReveal
              key={stat.label}
              variant="fade-up"
              delayMs={idx * 75}
              durationMs={500}
            >
              <div className="flex flex-col items-center group">
                <div
                  className={`w-10 h-10 theme-radius-sm border flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300 ${
                    idx % 2 === 1 ? "theme-badge-secondary" : "theme-badge"
                  }`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-display text-slate-900">
                  {stat.value}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
