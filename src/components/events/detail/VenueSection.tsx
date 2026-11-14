import { ExternalLink, MapPin } from "lucide-react";

interface Props {
  location: {
    name: string;
    address?: string;
    city: string;
    country: string;
  };
  isOnline?: boolean;
}

export function VenueSection({ location, isOnline }: Props) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${location.name} ${location.city} ${location.country}`
  )}`;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xl font-display text-slate-900">Venue &amp; Location</h2>
          <p className="text-xs text-slate-400">Physical hall &amp; navigation</p>
        </div>
        {!isOnline && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="p-5 border border-slate-200 theme-radius-card bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>{location.name}</span>
          </div>
          {location.address && (
            <p className="text-xs text-slate-500 mt-1 pl-6">{location.address}</p>
          )}
          <p className="text-xs theme-text-secondary font-medium mt-0.5 pl-6">
            {location.city}, {location.country}
          </p>
        </div>

        {!isOnline && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 transition inline-flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}
