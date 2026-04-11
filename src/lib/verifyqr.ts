import crypto from "crypto";

function getQrSecret() {
  if (process.env.QR_SECRET) {
    return process.env.QR_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("QR_SECRET is not configured.");
  }

  return "dev-only-qr-secret";
}

type ValidQrToken = {
  valid: true;
  uuid: string;
  eventId: string;
};

type InvalidQrToken = {
  valid: false;
};

export function verifyQRToken(token: string): ValidQrToken | InvalidQrToken {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const { uuid, eventId, signature } = decoded;

    if (
      typeof uuid !== "string" ||
      typeof eventId !== "string" ||
      typeof signature !== "string"
    ) {
      return { valid: false };
    }

    const expectedSignature = crypto
      .createHmac("sha256", getQrSecret())
      .update(`${uuid}:${eventId}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return {
      valid: true,
      uuid,
      eventId,
    };
  } catch {
    return { valid: false };
  }
}
