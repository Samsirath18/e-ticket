import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendTicketEmail({
  email,
  fullName,
  eventName,
  qrCode,
}: {
  email: string
  fullName: string
  eventName: string
  qrCode: string
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `🎟 Ton billet pour ${eventName}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Bonjour ${fullName},</h2>
        <p>Ton billet pour <b>${eventName}</b> est confirmé 🎉</p>
        
        <p>Présente ce QR Code à l'entrée :</p>

        <img src="${qrCode}" alt="QR Code" />

        <p>Merci et à bientôt 🚀</p>
      </div>
    `,
  })
}