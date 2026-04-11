import { Color, Group } from "@prisma/client";

export type TicketPurchaseInput = {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  color: Color;
  group: Group;
};

export function isColor(value: string): value is Color {
  return Object.values(Color).includes(value as Color);
}

export function isGroup(value: string): value is Group {
  return Object.values(Group).includes(value as Group);
}

export function parseTicketPurchaseInput(
  value: unknown
): { success: true; data: TicketPurchaseInput } | { success: false; error: string } {
  if (!value || typeof value !== "object") {
    return { success: false, error: "Payload invalide." };
  }

  const data = value as Record<string, unknown>;
  const eventId = typeof data.eventId === "string" ? data.eventId.trim() : "";
  const fullName =
    typeof data.fullName === "string" ? data.fullName.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const color = typeof data.color === "string" ? data.color.trim() : "";
  const group = typeof data.group === "string" ? data.group.trim() : "";

  if (!eventId || !fullName || !email || !phone || !color || !group) {
    return { success: false, error: "Tous les champs sont obligatoires." };
  }

  if (!isColor(color)) {
    return { success: false, error: "Couleur invalide." };
  }

  if (!isGroup(group)) {
    return { success: false, error: "Groupe invalide." };
  }

  return {
    success: true,
    data: {
      eventId,
      fullName,
      email,
      phone,
      color,
      group,
    },
  };
}
