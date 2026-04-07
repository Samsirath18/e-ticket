import QRCode from "qrcode"
import crypto from "crypto"

// 🔐 secret (à mettre dans .env)
const SECRET = process.env.QR_SECRET || "super_secret_key"

// 🎯 Structure du payload sécurisé
export function generateQRPayload(uuid: string, eventId: string) {
  const payload = `${uuid}:${eventId}`

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")

  const token = Buffer.from(
    JSON.stringify({
      uuid,
      eventId,
      signature,
    })
  ).toString("base64")

  return { token }
}

// 🎨 Génération image QR
export async function generateQRCodeImage(token: string) {
  return QRCode.toDataURL(token, {
    type: "image/png",
    width: 300,
    margin: 2,
  })
}