import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { verifyQRToken } from "@/src/lib/verifyqr";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (
    !isAuthorizedRequest(req, ["SCAN_API_TOKEN", "ADMIN_API_TOKEN"], {
      allowWithoutTokenInDev: true,
    })
  ) {
    return NextResponse.json({ valid: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const token = typeof body?.token === "string" ? body.token : "";

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token manquant." },
        { status: 400 }
      );
    }

    const decoded = verifyQRToken(token);

    if (!decoded.valid) {
      return NextResponse.json(
        { valid: false, message: "QR code invalide." },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { uuid: decoded.uuid },
      include: {
        event: true,
      },
    });

    if (!ticket || ticket.eventId !== decoded.eventId) {
      return NextResponse.json(
        { valid: false, message: "Ticket introuvable." },
        { status: 404 }
      );
    }

    if (ticket.status === "USED") {
      return NextResponse.json(
        { valid: false, message: "Ticket deja utilise." },
        { status: 409 }
      );
    }

    if (ticket.status === "CANCELLED") {
      return NextResponse.json(
        { valid: false, message: "Ticket annule." },
        { status: 409 }
      );
    }

    const updateResult = await prisma.ticket.updateMany({
      where: {
        id: ticket.id,
        status: "VALID",
      },
      data: {
        status: "USED",
        validatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { valid: false, message: "Ticket deja consomme." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Acces autorise.",
      ticket: {
        id: ticket.id,
        name: ticket.fullName,
        color: ticket.color,
        group: ticket.group,
        event: ticket.event.name,
      },
    });
  } catch (error) {
    console.error("Ticket verification failed:", error);
    return NextResponse.json(
      { valid: false, message: "Verification impossible." },
      { status: 500 }
    );
  }
}
