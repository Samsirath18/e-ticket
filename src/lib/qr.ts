import crypto from "crypto";
import QRCode from "qrcode";

function getQrSecret() {
  if (process.env.QR_SECRET) {
    return process.env.QR_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("QR_SECRET is not configured.");
  }

  return "dev-only-qr-secret";
}

export function generateQRPayload(uuid: string, eventId: string) {
  const payload = `${uuid}:${eventId}`;
  const signature = crypto
    .createHmac("sha256", getQrSecret())
    .update(payload)
    .digest("hex");

  const token = Buffer.from(
    JSON.stringify({
      uuid,
      eventId,
      signature,
    })
  ).toString("base64");

  return { token };
}

export async function generateQRCodeImage(token: string) {
  return QRCode.toDataURL(token, {
    type: "image/png",
    width: 300,
    margin: 2,
  });
}
