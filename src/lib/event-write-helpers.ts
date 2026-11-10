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

export async function syncEventTicketTiers(
  tx: Prisma.TransactionClient,
  eventId: string,
  existingTiers: Array<{ id: string; quantity: number; remaining: number; currency: string }>,
  incomingTiers: unknown
) {
  if (!Array.isArray(incomingTiers)) return;

  const cleanTiers = incomingTiers.filter(
    (t: any) => typeof t?.name === "string" && t.name.trim()
  );
  const existingMap = new Map(existingTiers.map((t) => [t.id, t]));
  const incomingIds = new Set<string>(
    cleanTiers
      .filter((t: any) => typeof t?.id === "string" && t.id)
      .map((t: any) => String(t.id))
  );

  const removedIds = existingTiers
    .filter((t) => !incomingIds.has(t.id))
    .map((t) => t.id);

  if (removedIds.length > 0) {
    await tx.ticketTier.deleteMany({
      where: { eventId, id: { in: removedIds } },
    });
  }

  for (let i = 0; i < cleanTiers.length; i++) {
    const t = cleanTiers[i];
    const qty = Math.max(1, Math.floor(Number(t.quantity) || 100));
    const price = Math.max(0, Number(t.price) || 0);
    const prev = t?.id ? existingMap.get(t.id) : undefined;
    const desc = typeof t.description === "string" ? t.description.trim() || null : null;

    if (prev) {
      const nextRemaining = Math.max(0, Math.min(qty, prev.remaining + (qty - prev.quantity)));
      await tx.ticketTier.update({
        where: { id: prev.id },
        data: {
          name: String(t.name).trim().slice(0, 100),
          description: desc,
          price,
          currency: t.currency || prev.currency || "ETB",
          quantity: qty,
          remaining: nextRemaining,
          earlyBird: Boolean(t.earlyBird),
          sortOrder: i,
        },
      });
    } else {
      await tx.ticketTier.create({
        data: {
          eventId,
          name: String(t.name).trim().slice(0, 100),
          description: desc,
          price,
          currency: t.currency || "ETB",
          quantity: qty,
          remaining: Math.min(qty, Math.max(0, Math.floor(Number(t.remaining ?? qty)))),
          earlyBird: Boolean(t.earlyBird),
          sortOrder: i,
        },
      });
    }
  }
}

export async function syncEventSpeakersAndAgenda(
  tx: Prisma.TransactionClient,
  eventId: string,
  speakers?: unknown,
  agendaItems?: unknown,
  existingCounts?: { speakers: number; agendaItems: number }
) {
  if (Array.isArray(speakers)) {
    const rows = sanitizeSpeakersInput(speakers);
    if (!existingCounts || existingCounts.speakers > 0) {
      await tx.speaker.deleteMany({ where: { eventId } });
    }
    if (rows.length > 0) {
      await tx.speaker.createMany({
        data: rows.map((row) => ({ ...row, eventId })),
      });
    }
  }

  if (Array.isArray(agendaItems)) {
    const rows = sanitizeAgendaInput(agendaItems);
    if (!existingCounts || existingCounts.agendaItems > 0) {
      await tx.agendaItem.deleteMany({ where: { eventId } });
    }
    if (rows.length > 0) {
      await tx.agendaItem.createMany({
        data: rows.map((row) => ({ ...row, eventId })),
      });
    }
  }
}
