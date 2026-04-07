import crypto from "crypto"

const SECRET = process.env.QR_SECRET || "super_secret_key"

export function verifyQRToken(token: string) {
  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    )

    const { uuid, eventId, signature } = decoded

    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(`${uuid}:${eventId}`)
      .digest("hex")

    if (signature !== expectedSignature) {
      return { valid: false }
    }

    return {
      valid: true,
      uuid,
      eventId,
    }
  } catch (error) {
    return { valid: false }
  }
}