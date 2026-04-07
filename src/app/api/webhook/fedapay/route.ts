import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { generateQRPayload, generateQRCodeImage } from "../../../../lib/qr"
import { checkAvailability } from "../../../../services/event.service"
import { Color, Group } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { sendTicketEmail } from "../../../../lib/email"

// 🔐 (OPTIONNEL MAIS RECOMMANDÉ)
// Vérification signature webhook (à activer en prod)
function verifyWebhook(req: Request) {
  const signature = req.headers.get("x-fedapay-signature")
  if (!signature) return false

  // 👉 tu pourras ajouter une vraie vérification HMAC ici
  return true
}

type FedaPayWebhook = {
  name: string
  entity: {
    id: string
    metadata?: {
      fullName: string
      email: string
      phone: string
      color: Color
      group: Group
      eventId: string
    }
  }
}

export async function POST(req: Request) {
  try {
    // 🔐 Sécurité webhook
    if (!verifyWebhook(req)) {
      return NextResponse.json(
        { error: "Unauthorized webhook" },
        { status: 401 }
      )
    }

    const body: FedaPayWebhook = await req.json()

    // 1. Vérifier type événement
    if (body.name !== "transaction.approved") {
      return NextResponse.json({ received: true })
    }

    const transaction = body.entity

    console.log("🔔 Webhook reçu:", transaction.id)

    // 2. Vérifier paiement
    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: String(transaction.id),
      },
    })

    if (!payment) {
      console.error("❌ Payment not found:", transaction.id)
      return NextResponse.json({ error: "Payment not found" })
    }

    // éviter double traitement
    if (payment.status === "SUCCESS") {
      console.log("⚠️ Déjà traité:", transaction.id)
      return NextResponse.json({ received: true })
    }

    // 3. Metadata
    const metadata = transaction.metadata

    if (!metadata) {
      console.error("❌ Metadata manquante")
      return NextResponse.json({ error: "No metadata" })
    }

    const { fullName, email, phone, color, group, eventId } = metadata

    // 🔒 Validation ENUM
    if (!Object.values(Color).includes(color)) {
      throw new Error("Invalid color")
    }

    if (!Object.values(Group).includes(group)) {
      throw new Error("Invalid group")
    }

    // 4. Vérification disponibilité
    const availability = await checkAvailability(eventId, color, group)

    if (!availability.available) {
      console.warn("🚫 Sold out (pre-check)")
      return NextResponse.json({ error: "Sold out" })
    }

    // 5. Transaction DB sécurisée
    const result = await prisma.$transaction(async (tx) => {
      const colorCount = await tx.ticket.count({
        where: { eventId, color },
      })

      if (colorCount >= 30) {
        throw new Error("Color sold out")
      }

      const groupCount = await tx.ticket.count({
        where: { eventId, group },
      })

      if (groupCount >= 30) {
        throw new Error("Group sold out")
      }

      // 🎟 Génération ticket
      const uuid = uuidv4()

      const payload = generateQRPayload(uuid, eventId)
      const qrImage = await generateQRCodeImage(payload.token)

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
      })

      // 💳 Update paiement
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      })

      return { ticket, qrImage }
    })

    // 📧 Envoi email (safe)
    try {
      await sendTicketEmail({
        email,
        fullName,
        eventName: "MODE AVION",
        qrCode: result.qrImage,
      })

      console.log("📩 Email envoyé à:", email)
    } catch (emailError) {
      console.error("❌ Erreur envoi email:", emailError)
      // 👉 ne bloque pas le webhook
    }

    console.log("✅ Ticket créé:", result.ticket.id)

    return NextResponse.json({
      success: true,
      ticketId: result.ticket.id,
    })

  } catch (error) {
    console.error("🔥 Webhook error:", error)

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    )
  }
}