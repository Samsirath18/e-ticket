import { prisma } from "../../../../lib/prisma"

export async function GET() {
  try {
    const total = await prisma.ticket.count()

    const used = await prisma.ticket.count({
      where: { status: "USED" },
    })

    const remaining = 150 - total

    const byColor = await prisma.ticket.groupBy({
      by: ["color"],
      _count: { color: true },
    })

    const byGroup = await prisma.ticket.groupBy({
      by: ["group"],
      _count: { group: true },
    })

    return Response.json({
      total,
      used,
      remaining,
      byColor,
      byGroup,
    })
  } catch (error) {
    return Response.json({ error: "Erreur stats" }, { status: 500 })
  }
}