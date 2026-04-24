import { NextResponse } from "next/server";
import {
  FedaPayApiError,
  buildConfirmationUrl,
  createFedaPayPaymentLink,
  createFedaPayTransaction,
  getFedaPayCurrencyIso,
} from "@/src/lib/fedapay";
import { getEventConfig } from "@/src/lib/events";
import { parseTicketPurchaseInput } from "@/src/lib/ticket-input";
import { prisma } from "@/src/lib/prisma";
import { checkRateLimit } from "@/src/lib/rate-limit";
import { checkAvailability, ensureEventExists } from "@/src/services/event.service";

export const runtime = "nodejs";

const PHONE_PREFIX_TO_COUNTRY = [
  { prefix: "+229", country: "bj" },
  { prefix: "+228", country: "tg" },
  { prefix: "+225", country: "ci" },
  { prefix: "+221", country: "sn" },
  { prefix: "+227", country: "ne" },
  { prefix: "+224", country: "gn" },
] as const;

function normalizePhoneNumber(phone: string) {
  const compact = phone.replace(/[\s()-]/g, "");
  return compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
}

function inferPhoneCountry(phone: string) {
  const match = PHONE_PREFIX_TO_COUNTRY.find(({ prefix }) =>
    phone.startsWith(prefix)
  );

  return match?.country ?? "bj";
}

function splitCustomerName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstname: "", lastname: "" };
  }

  if (parts.length === 1) {
    return { firstname: parts[0], lastname: parts[0] };
  }

  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

export async function POST(req: Request) {
  console.log("DATABASE_URL présente ?", !!process.env.DATABASE_URL);
  console.log("FEDA_API_SECRET_KEY présente ?", !!process.env.FEDA_API_SECRET_KEY);
  try {
    const rateLimit = checkRateLimit(req, "payments:create", {
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: "Trop de tentatives de paiement. Reessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = parseTicketPurchaseInput(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const { eventId, fullName, email, phone, color, group } = parsed.data;
    const currencyIso = getFedaPayCurrencyIso();
    const normalizedPhone = normalizePhoneNumber(phone);
    const customerName = splitCustomerName(fullName);
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
      description: `Ticket ${eventConfig.name} pour ${email}`,
      amount: eventConfig.amount,
      callback_url: buildConfirmationUrl(req.url),
      currency: { iso: currencyIso },
      customer: {
        firstname: customerName.firstname,
        lastname: customerName.lastname,
        email,
        phone_number: {
          number: normalizedPhone,
          country: inferPhoneCountry(normalizedPhone),
        },
      },
      custom_metadata: {
        eventId,
        fullName,
        email,
        phone,
        color,
        group,
      },
    });

    if (!transaction?.id) {
      throw new Error(
        `FedaPay did not return a valid transaction id: ${JSON.stringify(transaction)}`
      );
    }

    const paymentLink = await createFedaPayPaymentLink(transaction.id);

    await prisma.payment.create({
      data: {
        amount: eventConfig.amount,
        currency: currencyIso,
        transactionId: transaction.id,
        status: "PENDING",
        eventId: event.id,
      },
    });

    return NextResponse.json({
      transactionId: transaction.id,
      url: paymentLink.url,
    });
  } catch (error) {
    console.error("Payment creation failed:", error);

    if (error instanceof FedaPayApiError && error.status === 401) {
      return NextResponse.json(
        {
          message:
            "Echec d'authentification FedaPay. Verifiez FEDA_API_SECRET_KEY et FEDA_ENVIRONMENT.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: "Impossible de lancer le paiement." },
      { status: 500 }
    );
  }
}
