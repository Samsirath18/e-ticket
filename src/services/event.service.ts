import { Color, Group } from "@prisma/client";
import { getEventConfig } from "../lib/events";
import { prisma } from "../lib/prisma";

export async function ensureEventExists(eventId: string) {
  const config = getEventConfig(eventId);

  if (config) {
    return prisma.event.upsert({
      where: { id: eventId },
      update: {
        name: config.name,
        date: new Date(config.date),
        location: config.location,
        totalTickets: config.totalTickets,
      },
      create: {
        id: config.id,
        name: config.name,
        date: new Date(config.date),
        location: config.location,
        totalTickets: config.totalTickets,
      },
    });
  }

  return prisma.event.findUnique({
    where: { id: eventId },
  });
}

export async function checkAvailability(
  eventId: string,
  color: Color,
  group: Group
) {
  const event = await ensureEventExists(eventId);

  if (!event) {
    return { available: false as const, reason: "EVENT_NOT_FOUND" as const };
  }

  const config = getEventConfig(eventId);
  const maxPerColor = config?.maxPerColor ?? 30;
  const maxPerGroup = config?.maxPerGroup ?? 30;

  const total = await prisma.ticket.count({
    where: { eventId },
  });

  if (total >= event.totalTickets) {
    return { available: false as const, reason: "EVENT_SOLD_OUT" as const };
  }

  const colorCount = await prisma.ticket.count({
    where: { eventId, color },
  });

  if (colorCount >= maxPerColor) {
    return { available: false as const, reason: "COLOR_SOLD_OUT" as const };
  }

  const groupCount = await prisma.ticket.count({
    where: { eventId, group },
  });

  if (groupCount >= maxPerGroup) {
    return { available: false as const, reason: "GROUP_SOLD_OUT" as const };
  }

  return { available: true as const, event };
}
