import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { FedaPay, Transaction } from "fedapay"

// CONFIG
FedaPay.setApiKey(process.env.FEDAPAY_API_KEY!)
FedaPay.setEnvironment(
  process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox"
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      fullName,
      email,
      phone,
      color,
      group,
      eventId,
    } = body

    // 🔥 Vérification couleur
    const colorCount = await prisma.ticket.count({
      where: { eventId, color },
    })

    if (colorCount >= 30) {
      return NextResponse.json(
        { message: `Couleur ${color} complète` },
        { status: 400 }
      )
    }

    // 🔥 Vérification groupe
    const groupCount = await prisma.ticket.count({
      where: { eventId, group },
    })

    if (groupCount >= 30) {
      return NextResponse.json(
        { message: `Groupe ${group} complet` },
        { status: 400 }
      )
    }

    // 💳 Création transaction FedaPay
    const transaction = await Transaction.create({
      description: "Ticket MODE AVION",
      amount: 5000,
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
        fullName,
        email,
        phone,
        color,
        group,
        eventId,
      },
    })

    // 💾 Sauvegarde paiement
    await prisma.payment.create({
      data: {
        amount: 5000,
        currency: "XOF",
        transactionId: String(transaction.id),
        status: "PENDING",
        eventId,
      },
    })

    return NextResponse.json({
      payment_url: transaction.payment_url, // ✅ FIX
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Erreur paiement" }, // ✅ FIX
      { status: 500 }
    )
  }
}