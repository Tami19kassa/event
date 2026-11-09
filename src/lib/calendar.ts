export function formatCalendarDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

export type CalendarEventData = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  orderNumber?: string;
  status?: string;
  url?: string;
};

/**
 * Generates a direct Google Calendar addition link
 */
export function getGoogleCalendarUrl(evt: CalendarEventData): string {
  const start = formatCalendarDate(new Date(evt.startDate));
  const end = formatCalendarDate(new Date(evt.endDate));

  const details = [
    evt.description,
    "",
    evt.orderNumber ? `Ticket / Pass Reference: ${evt.orderNumber}` : "",
    evt.status ? `Status: ${evt.status}` : "",
    evt.url ? `Event Link: ${evt.url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: evt.title,
    dates: `${start}/${end}`,
    details,
    location: evt.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates standard .ICS file content for Apple Calendar, Outlook, and Android
 */
export function generateIcsContent(evt: CalendarEventData): string {
  const start = formatCalendarDate(new Date(evt.startDate));
  const end = formatCalendarDate(new Date(evt.endDate));
  const now = formatCalendarDate(new Date());

  const cleanDescription = (evt.description || "").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Utopia Events//Addis Ababa//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:evt-${Date.now()}@utopia-events.et`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${evt.title}`,
    `DESCRIPTION:${cleanDescription}\\nReference: ${evt.orderNumber || "General Reservation"}`,
    `LOCATION:${evt.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Triggers a client-side download of an .ICS file
 */
export function downloadIcsFile(evt: CalendarEventData, filename = "event-pass.ics") {
  const content = generateIcsContent(evt);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
