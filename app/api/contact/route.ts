import { NextResponse } from "next/server";
import { sendContactEmail } from "@/src/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    await sendContactEmail({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact request failed:", error);
    return NextResponse.json(
      { message: "Impossible d'envoyer votre message." },
      { status: 500 }
    );
  }
}
