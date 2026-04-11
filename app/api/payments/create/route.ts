import { NextResponse } from "next/server";
import {
  buildConfirmationUrl,
  createFedaPayPaymentLink,
  createFedaPayTransaction,
} from "@/src/lib/fedapay";
import { getEventConfig } from "@/src/lib/events";
import { parseTicketPurchaseInput } from "@/src/lib/ticket-input";
import { prisma } from "@/src/lib/prisma";
import { checkAvailability, ensureEventExists } from "@/src/services/event.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseTicketPurchaseInput(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const { eventId, fullName, email, phone, color, group } = parsed.data;
    const event = await ensureEventExists(eventId);
    const eventConfig = getEventConfig(eventId);

    if (!event || !eventConfig) {
      return NextResponse.json(
        { message: "Evenement introuvable." },
        { status: 404 }
      );
    }

    const availability = await checkAvailability(eventId, color, group);

    if (!availability.available) {
      const messageByReason: Record<string, string> = {
        EVENT_NOT_FOUND: "Evenement introuvable.",
        EVENT_SOLD_OUT: "Toutes les places sont deja vendues.",
        COLOR_SOLD_OUT: `La couleur ${color} est complete.`,
        GROUP_SOLD_OUT: `Le groupe ${group} est complet.`,
      };

      return NextResponse.json(
        {
          message:
            messageByReason[availability.reason] ??
            "Ce ticket n'est plus disponible.",
        },
        { status: 409 }
      );
    }

    const transaction = await createFedaPayTransaction({
      description: `Ticket ${eventConfig.name}`,
      amount: eventConfig.amount,
      callback_url: buildConfirmationUrl(),
      currency: { iso: "XOF" },
      customer: {
        firstname: fullName,
        email,
        phone_number: {
          number: phone,
          country: "BJ",
        },
      },
      metadata: {
        eventId,
        fullName,
        email,
        phone,
        color,
        group,
      },
    });

    const paymentLink = await createFedaPayPaymentLink(transaction.id);

    await prisma.payment.create({
      data: {
        amount: eventConfig.amount,
        currency: "XOF",
        transactionId: String(transaction.id),
        status: "PENDING",
        eventId: event.id,
      },
    });

    return NextResponse.json({
      transactionId: String(transaction.id),
      url: paymentLink.url,
    });
  } catch (error) {
    console.error("Payment creation failed:", error);

    return NextResponse.json(
      { message: "Impossible de lancer le paiement." },
      { status: 500 }
    );
  }
}
