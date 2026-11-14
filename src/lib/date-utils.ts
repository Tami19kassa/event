export interface DaysLeftInfo {
  label: string;
  days: number;
  urgency: "today" | "tomorrow" | "soon" | "upcoming" | "past";
  colorClass: string;
}

const EAST_AFRICA_TZ = "Africa/Addis_Ababa";

function getZonedYmd(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EAST_AFRICA_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: parseInt(map.year, 10),
    month: parseInt(map.month, 10) - 1,
    day: parseInt(map.day, 10),
  };
}

export function calculateDaysLeft(dateStr: string): DaysLeftInfo {
  const now = new Date();
  const target = new Date(dateStr);

  const nowZoned = getZonedYmd(now);
  const targetZoned = getZonedYmd(target);

  const nowDateOnly = Date.UTC(nowZoned.year, nowZoned.month, nowZoned.day);
  const targetDateOnly = Date.UTC(targetZoned.year, targetZoned.month, targetZoned.day);

  const diffMs = targetDateOnly - nowDateOnly;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      label: "Past Event",
      days,
      urgency: "past",
      colorClass: "bg-slate-100 text-slate-500 border-slate-200",
    };
  }

  if (days === 0) {
    return {
      label: "🌟 Happening Today",
      days: 0,
      urgency: "today",
      colorClass: "bg-emerald-500 text-white font-extrabold animate-pulse",
    };
  }

  if (days === 1) {
    return {
      label: "🔥 Starts Tomorrow",
      days: 1,
      urgency: "tomorrow",
      colorClass: "bg-amber-500 text-white font-extrabold",
    };
  }

  if (days <= 7) {
    return {
      label: `⚡ ${days} days left`,
      days,
      urgency: "soon",
      colorClass: "theme-badge font-bold",
    };
  }

  return {
    label: `🗓️ In ${days} days`,
    days,
    urgency: "upcoming",
    colorClass: "bg-slate-50 text-slate-700 border-slate-200 font-medium",
  };
}

export function formatEventDateBlock(dateStr: string) {
  const date = new Date(dateStr);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EAST_AFRICA_TZ,
    month: "short",
    day: "2-digit",
    weekday: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const period = map.dayPeriod ? ` ${map.dayPeriod.toUpperCase()}` : "";

  return {
    month: (map.month || "NOV").toUpperCase(),
    day: map.day || "01",
    weekday: map.weekday || "Day",
    year: map.year || "2026",
    time: `${map.hour || "12"}:${map.minute || "00"}${period}`,
  };
}
