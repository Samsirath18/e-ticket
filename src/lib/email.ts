import { Resend } from "resend";

function getMailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    contactTo: process.env.CONTACT_TO || process.env.EMAIL_FROM,
  };
}

function getResendClient() {
  const { apiKey } = getMailConfig();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}

export async function sendTicketEmail({
  email,
  fullName,
  eventName,
  qrCode,
}: {
  email: string;
  fullName: string;
  eventName: string;
  qrCode: string;
}) {
  const { apiKey, from } = getMailConfig();

  if (!apiKey || !from) {
    console.warn("Ticket email skipped because Resend is not fully configured.");
    return;
  }

  await getResendClient().emails.send({
    from,
    to: [email],
    subject: `Ton billet pour ${eventName}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
        <h2>Bonjour ${fullName},</h2>
        <p>Ton billet pour <strong>${eventName}</strong> est confirme.</p>
        <p>Presente ce QR code a l'entree de l'evenement.</p>
        <p><img src="${qrCode}" alt="QR code" style="max-width:300px" /></p>
        <p>Merci et a bientot.</p>
      </div>
    `,
  });
}

export async function sendContactEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const { from, contactTo } = getMailConfig();

  if (!from || !contactTo) {
    throw new Error("Contact email is not configured.");
  }

  await getResendClient().emails.send({
    from,
    to: [contactTo],
    replyTo: email,
    subject: `Nouveau message de contact - ${name}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      </div>
    `,
  });
}

export async function sendOrganizerLeadEmail({
  name,
  email,
  phone,
  eventName,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  eventName: string;
  message: string;
}) {
  const { from, contactTo } = getMailConfig();

  if (!from || !contactTo) {
    throw new Error("Organizer email is not configured.");
  }

  await getResendClient().emails.send({
    from,
    to: [contactTo],
    replyTo: email,
    subject: `Nouvelle demande organisateur - ${eventName}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
        <h2>Nouvelle demande organisateur</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${phone}</p>
        <p><strong>Evenement:</strong> ${eventName}</p>
        <p><strong>Description:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      </div>
    `,
  });
}
