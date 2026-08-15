import nodemailer from "nodemailer";

export type TravelRequestEmail = {
  requestCode: string;
  service: string;
  project: string;
  requesterName: string;
  phone: string;
  email: string;
  details?: string;
  attachments: Array<{ originalName: string; storageUrl?: string; storageKey: string; mimeType: string; sizeBytes: number }>;
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing SMTP configuration: ${name}`);
  return value;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
}

export async function sendTravelRequestEmail(request: TravelRequestEmail) {
  const host = required("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = required("SMTP_USER");
  const password = required("SMTP_PASSWORD");
  const from = process.env.SMTP_FROM || user;
  const to = process.env.CONTACT_EMAIL || "contact@trustelitetravels.com";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: password },
  });

  const attachmentRows = request.attachments.length
    ? request.attachments.map(file => `<li>${escapeHtml(file.originalName)} — ${escapeHtml(file.mimeType)} (${Math.ceil(file.sizeBytes / 1024)} Ko)${file.storageUrl ? ` — <a href="${escapeHtml(file.storageUrl)}">Ouvrir le document</a>` : ""}</li>`).join("")
    : "<li>Aucun document joint</li>";

  await transporter.sendMail({
    from,
    to,
    replyTo: request.email,
    subject: `[Trust Elite Travel] Nouvelle demande ${request.requestCode} — ${request.service}`,
    text: [
      `Nouvelle demande ${request.requestCode}`,
      `Service : ${request.service}`,
      `Projet : ${request.project}`,
      `Nom : ${request.requesterName}`,
      `Téléphone : ${request.phone}`,
      `E-mail : ${request.email}`,
      `Détails : ${request.details || "—"}`,
      `Documents : ${request.attachments.map(file => file.originalName).join(", ") || "Aucun"}`,
    ].join("\n"),
    html: `<h2>Nouvelle demande ${escapeHtml(request.requestCode)}</h2><p><strong>Service :</strong> ${escapeHtml(request.service)}</p><p><strong>Projet :</strong> ${escapeHtml(request.project)}</p><p><strong>Nom :</strong> ${escapeHtml(request.requesterName)}</p><p><strong>Téléphone :</strong> ${escapeHtml(request.phone)}</p><p><strong>E-mail :</strong> <a href="mailto:${escapeHtml(request.email)}">${escapeHtml(request.email)}</a></p><p><strong>Détails :</strong><br/>${escapeHtml(request.details || "—").replace(/\n/g, "<br/>")}</p><p><strong>Documents stockés :</strong></p><ul>${attachmentRows}</ul>`,
  });

  transporter.close();
}


export async function sendRequesterConfirmationEmail(request: Pick<TravelRequestEmail, "requesterName" | "email" | "service">) {
  const host = required("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = required("SMTP_USER");
  const password = required("SMTP_PASSWORD");
  const from = process.env.SMTP_FROM || user;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: password },
  });
  const firstName = request.requesterName.trim().split(/\s+/)[0] || request.requesterName;
  const subject = "Nous avons bien reçu votre demande — Trust Elite Travel";
  await transporter.sendMail({
    from,
    to: request.email,
    subject,
    text: `Bonjour ${firstName},\n\nNous avons bien reçu votre demande concernant ${request.service}. Elle est en cours de traitement par notre équipe et nous reviendrons vers vous sous peu aux coordonnées indiquées.\n\nMerci pour votre confiance,\nTrust Elite Travel\ncontact@trustelitetravels.com`,
    html: `<p>Bonjour ${escapeHtml(firstName)},</p><p>Nous avons bien reçu votre demande concernant <strong>${escapeHtml(request.service)}</strong>.</p><p>Elle est en cours de traitement par notre équipe et nous reviendrons vers vous sous peu aux coordonnées indiquées.</p><p>Merci pour votre confiance,<br/><strong>Trust Elite Travel</strong><br/><a href="mailto:contact@trustelitetravels.com">contact@trustelitetravels.com</a></p>`,
  });
  transporter.close();
}
