import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";

export function EventHeroBanner({ event }: { event: Event }) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <div className="relative h-[40vh] md:h-[50vh] min-h-[320px]">
      <Image
        src={event.imageUrl}
        alt={event.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur text-white rounded-full">
              {event.category}
            </span>
            <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur text-white rounded-full capitalize">
              {event.format}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 max-w-3xl tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {format(startDate, "EEE, MMM d, yyyy")}
              {startDate.toDateString() !== endDate.toDateString() &&
                ` – ${format(endDate, "MMM d")}`}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              {format(startDate, "h:mm a")}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {event.location.name}, {event.location.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
