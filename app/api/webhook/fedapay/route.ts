import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Color, Group } from "@prisma/client";
import { sendTicketEmail } from "@/src/lib/email";
import { getEventConfig } from "@/src/lib/events";
import { generateQRCodeImage, generateQRPayload } from "@/src/lib/qr";
import { verifyWebhookPayload } from "@/src/lib/fedapay";
import { prisma } from "@/src/lib/prisma";
import { checkAvailability, ensureEventExists } from "@/src/services/event.service";

export const runtime = "nodejs";

function isSoldOutError(error: unknown) {
  return (
    error instanceof Error &&
    ["EVENT_SOLD_OUT", "COLOR_SOLD_OUT", "GROUP_SOLD_OUT"].includes(error.message)
  );
}

type FedaPayWebhookPayload = {
  name?: string;
  entity?: {
    id?: string | number;
    metadata?: {
      fullName?: string;
      email?: string;
      phone?: string;
      color?: Color;
      group?: Group;
      eventId?: string;
    };
  };
};

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-fedapay-signature");
    const payload = verifyWebhookPayload(
      rawBody,
      signature
    ) as FedaPayWebhookPayload;

    if (payload.name !== "transaction.approved") {
      return NextResponse.json({ received: true });
    }

    const transactionId = payload.entity?.id;
    const metadata = payload.entity?.metadata;

    if (!transactionId || !metadata) {
      return NextResponse.json(
        { error: "Webhook payload incomplet." },
        { status: 400 }
      );
    }

    const { eventId, fullName, email, phone, color, group } = metadata;

    if (
      !eventId ||
      !fullName ||
      !email ||
      !phone ||
      !color ||
      !group ||
      !Object.values(Color).includes(color) ||
      !Object.values(Group).includes(group)
    ) {
      return NextResponse.json(
        { error: "Metadata ticket invalide." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: String(transactionId),
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }

    if (payment.status === "SUCCESS") {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    const event = await ensureEventExists(eventId);
    const eventConfig = getEventConfig(eventId);

    if (!event || !eventConfig) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: "Evenement introuvable." },
        { status: 404 }
      );
    }

    const availability = await checkAvailability(eventId, color, group);

    if (!availability.available) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: "Plus de disponibilite pour ce billet." },
        { status: 409 }
      );
    }

    let result: { ticket: { id: string }; qrImage: string };

    try {
      result = await prisma.$transaction(async (tx) => {
        const total = await tx.ticket.count({
          where: { eventId },
        });

        if (total >= event.totalTickets) {
          throw new Error("EVENT_SOLD_OUT");
        }

        const colorCount = await tx.ticket.count({
          where: { eventId, color },
        });

        if (colorCount >= eventConfig.maxPerColor) {
          throw new Error("COLOR_SOLD_OUT");
        }

        const groupCount = await tx.ticket.count({
          where: { eventId, group },
        });

        if (groupCount >= eventConfig.maxPerGroup) {
          throw new Error("GROUP_SOLD_OUT");
        }

        const uuid = uuidv4();
        const payload = generateQRPayload(uuid, eventId);
        const qrImage = await generateQRCodeImage(payload.token);

        const ticket = await tx.ticket.create({
          data: {
            uuid,
            qrSignature: payload.token,
            fullName,
            email,
            phone,
            color,
            group,
            eventId,
            paymentId: payment.id,
          },
        });

        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESS" },
        });

        return { ticket, qrImage };
      });
    } catch (transactionError) {
      if (isSoldOutError(transactionError)) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });

        return NextResponse.json(
          { error: "Paiement recu mais plus de disponibilite pour ce billet." },
          { status: 409 }
        );
      }

      throw transactionError;
    }

    try {
      await sendTicketEmail({
        email,
        fullName,
        eventName: eventConfig.name,
        qrCode: result.qrImage,
      });
    } catch (emailError) {
      console.error("Ticket email failed:", emailError);
    }

    return NextResponse.json({
      received: true,
      ticketId: result.ticket.id,
    });
  } catch (error) {
    console.error("FedaPay webhook failed:", error);

    return NextResponse.json({ error: "Webhook failed." }, { status: 500 });
  }
}
