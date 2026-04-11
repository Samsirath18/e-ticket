import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (
    !isAuthorizedRequest(req, ["ADMIN_API_TOKEN"], {
      allowWithoutTokenInDev: true,
    })
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId")?.trim() || undefined;
    const ticketWhere = eventId ? { eventId } : {};
    const eventsWhere = eventId ? { id: eventId } : {};

    const [total, used, byColor, byGroup, events] = await Promise.all([
      prisma.ticket.count({ where: ticketWhere }),
      prisma.ticket.count({
        where: {
          ...ticketWhere,
          status: "USED",
        },
      }),
      prisma.ticket.groupBy({
        by: ["color"],
        where: ticketWhere,
        _count: { color: true },
      }),
      prisma.ticket.groupBy({
        by: ["group"],
        where: ticketWhere,
        _count: { group: true },
      }),
      prisma.event.findMany({
        where: eventsWhere,
        select: {
          id: true,
          name: true,
          totalTickets: true,
        },
      }),
    ]);

    const totalCapacity = events.reduce(
      (sum, event) => sum + event.totalTickets,
      0
    );

    return NextResponse.json({
      total,
      used,
      remaining: Math.max(totalCapacity - total, 0),
      byColor,
      byGroup,
      events,
    });
  } catch (error) {
    console.error("Admin stats failed:", error);
    return NextResponse.json({ error: "Erreur stats" }, { status: 500 });
  }
}
