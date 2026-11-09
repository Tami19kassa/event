export interface DaysLeftInfo {
  label: string;
  days: number;
  urgency: "today" | "tomorrow" | "soon" | "upcoming" | "past";
  colorClass: string;
}

export function calculateDaysLeft(dateStr: string): DaysLeftInfo {
  const now = new Date();
  const target = new Date(dateStr);

  // Normalize to local midnight for accurate calendar day count
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();

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
      colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold",
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
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    month: months[date.getMonth()] || "NOV",
    day: String(date.getDate()).padStart(2, "0"),
    weekday: weekdays[date.getDay()] || "Day",
    year: String(date.getFullYear()),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}
