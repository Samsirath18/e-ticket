import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { verifyQRToken } from "../../../../lib/verifyqr"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ valid: false, message: "Token manquant" })
    }

    //  Vérification signature
    const decoded = verifyQRToken(token)

    if (!decoded.valid) {
      return NextResponse.json({
        valid: false,
        message: "QR invalide",
      })
    }

    const { uuid } = decoded

    //  Vérifier ticket
    const ticket = await prisma.ticket.findUnique({
      where: { uuid },
    })

    if (!ticket) {
      return NextResponse.json({
        valid: false,
        message: "Ticket introuvable",
      })
    }

    //  Déjà utilisé
    if (ticket.status === "USED") {
      return NextResponse.json({
        valid: false,
        message: "Ticket déjà utilisé",
      })
    }

    //  Marquer comme utilisé
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        validatedAt: new Date(),
      },
    })

    return NextResponse.json({
      valid: true,
      message: "Accès autorisé",
      user: {
        name: ticket.fullName,
        color: ticket.color,
        group: ticket.group,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}