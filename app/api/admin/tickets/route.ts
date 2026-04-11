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
    const limit = Number(searchParams.get("limit") || "50");

    const tickets = await prisma.ticket.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        payment: {
          select: {
            id: true,
            transactionId: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 50,
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Admin tickets failed:", error);
    return NextResponse.json({ error: "Erreur tickets" }, { status: 500 });
  }
}
