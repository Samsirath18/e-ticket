import { prisma } from "../../../../lib/prisma"

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return Response.json(tickets)
}