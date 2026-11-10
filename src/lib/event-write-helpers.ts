import type { Prisma } from "@prisma/client";

export function sanitizeSpeakersInput(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 30)
    .map((s: any, i: number) => ({
      name: String(s?.name || "").trim().slice(0, 120),
      title: String(s?.title || "").trim().slice(0, 120) || null,
      company: String(s?.company || "").trim().slice(0, 120) || null,
      bio: String(s?.bio || "").trim().slice(0, 2000) || null,
      imageUrl: String(s?.imageUrl || "").trim() || null,
      sortOrder: i,
    }))
    .filter((s) => s.name.length > 0);
}

export function sanitizeAgendaInput(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 60)
    .map((a: any, i: number) => ({
      time: String(a?.time || "").trim().slice(0, 60),
      title: String(a?.title || "").trim().slice(0, 160),
      description: String(a?.description || "").trim().slice(0, 1000) || null,
      sortOrder: i,
    }))
    .filter((a) => a.time.length > 0 && a.title.length > 0);
}

export async function syncEventSpeakersAndAgenda(
  tx: Prisma.TransactionClient,
  eventId: string,
  speakers?: unknown,
  agendaItems?: unknown
) {
  if (Array.isArray(speakers)) {
    await tx.speaker.deleteMany({ where: { eventId } });
    const rows = sanitizeSpeakersInput(speakers);
    if (rows.length > 0) {
      await tx.speaker.createMany({
        data: rows.map((row) => ({ ...row, eventId })),
      });
    }
  }

  if (Array.isArray(agendaItems)) {
    await tx.agendaItem.deleteMany({ where: { eventId } });
    const rows = sanitizeAgendaInput(agendaItems);
    if (rows.length > 0) {
      await tx.agendaItem.createMany({
        data: rows.map((row) => ({ ...row, eventId })),
      });
    }
  }
}
