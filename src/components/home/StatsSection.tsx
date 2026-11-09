import { Calendar, Users, Ticket, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  { icon: Calendar, label: "Events in Addis", value: "240+" },
  { icon: Users, label: "Active attendees", value: "45k+" },
  { icon: Ticket, label: "Tickets & Gate Passes", value: "120k+" },
  { icon: Sparkles, label: "Verified Organizers", value: "100%" },
];

export function StatsSection() {
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
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[var(--color-primary)] mb-2.5 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
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
