
import  {prisma}  from "../lib/prisma"
import { Color, Group } from "@prisma/client"
const MAX_TOTAL = 150
const MAX_PER_COLOR = 30
const MAX_PER_GROUP = 30

export async function checkAvailability(
  eventId: string,
  color: Color,
  group: Group
) {
  // 🔹 total tickets
  const total = await prisma.ticket.count({
    where: { eventId },
  })

  if (total >= MAX_TOTAL) {
    return { available: false, reason: "EVENT_SOLD_OUT" }
  }

  // 🔹 couleur
  const colorCount = await prisma.ticket.count({
    where: { eventId, color },
  })

  if (colorCount >= MAX_PER_COLOR) {
    return { available: false, reason: "COLOR_SOLD_OUT" }
  }

  // 🔹 groupe
  const groupCount = await prisma.ticket.count({
    where: { eventId, group },
  })

  if (groupCount >= MAX_PER_GROUP) {
    return { available: false, reason: "GROUP_SOLD_OUT" }
  }

  return { available: true }
}