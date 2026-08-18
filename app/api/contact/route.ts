import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { services, tr, type Language, type ServiceSlug } from "@/lib/content";
import {
  getRequestValueLabel,
  isRequestFieldVisible,
  serviceRequestFlows,
  textFor,
  validateRequestDetails,
} from "@/lib/requestFields";

export const runtime = "nodejs";

type ContactPayload = {
  service: ServiceSlug;
  serviceDetails: Record<string, string>;
  fullName: string;
  phone: string;
  email: string;
  language: Language;
};

type RateBucket = { count: number; resetAt: number };

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60_000;
const buckets = new Map<string, RateBucket>();

const clean = (value: unknown, max: number) => typeof value === "string" ? value.replace(/\0/g, "").trim().slice(0, max) : "";
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);

function isRateLimited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function normalizePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const language: Language = source.language === "en" ? "en" : "fr";
  const service = clean(source.service, 40) as ServiceSlug;
  if (!services.some(item => item.slug === service)) return null;

  const sourceDetails = source.serviceDetails && typeof source.serviceDetails === "object"
    ? source.serviceDetails as Record<string, unknown>
    : {};
  const serviceDetails = Object.fromEntries(serviceRequestFlows[service].fields.map(field => [
    field.key,
    clean(sourceDetails[field.key], field.type === "textarea" ? 2_000 : 180),
  ]));
  const fullName = clean(source.fullName, 120);
  const phone = clean(source.phone, 40);
  const email = clean(source.email, 254).toLowerCase();

  if (validateRequestDetails(service, serviceDetails, language)) return null;
  if (fullName.length < 2 || phone.length < 6) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { service, serviceDetails, fullName, phone, email, language };
}

function requestRows(payload: ContactPayload) {
  const flow = serviceRequestFlows[payload.service];
  return flow.fields
    .filter(field => isRequestFieldVisible(field, payload.serviceDetails) && payload.serviceDetails[field.key])
    .map(field => [textFor(field.label, payload.language), getRequestValueLabel(field, payload.serviceDetails[field.key], payload.language)]);
}

function renderRows(items: string[][]) {
  return items.map(([label, value]) => `<tr><td class="label" style="width:34%;padding:11px 0;border-bottom:1px solid #e7dfcf;color:#766f62;font:600 11px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td><td class="value" style="padding:11px 0;border-bottom:1px solid #e7dfcf;color:#171613;font:500 14px Arial,sans-serif;line-height:1.5;vertical-align:top;white-space:pre-line">${escapeHtml(value)}</td></tr>`).join("");
}

function emailLogoUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://trustelitetravels.com").replace(/\/$/, "");
  return `${siteUrl}/assets/logo-on-dark.png`;
}

function emailShell({ language, eyebrow, title, reference, intro, serviceName, requestTitle, rows, contactTitle, contactRows, action, footer }: {
  language: Language;
  eyebrow: string;
  title: string;
  reference: string;
  intro: string;
  serviceName: string;
  requestTitle: string;
  rows: string[][];
  contactTitle?: string;
  contactRows?: string[][];
  action?: { href: string; label: string };
  footer: string;
}) {
  const logo = emailLogoUrl();
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@media(max-width:620px){.card-pad{padding:24px 20px!important}.label{display:block!important;width:auto!important;padding-bottom:4px!important}.value{display:block!important}}</style></head><body style="margin:0;padding:0;background:#f3efe6"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3efe6"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffdfa;border:1px solid #e1d7c2;border-radius:18px;overflow:hidden"><tr><td class="card-pad" style="padding:28px 32px;background:#11110f"><img src="${escapeHtml(logo)}" alt="Trust Elite Travel" width="58" height="61" style="display:block;width:58px;height:auto;margin:0 0 18px"><div style="color:#d7b84f;font:700 11px Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase">${escapeHtml(eyebrow)}</div><h1 style="margin:10px 0 0;color:#fffaf0;font:400 30px Georgia,serif;line-height:1.12">${escapeHtml(title)}</h1><p style="margin:10px 0 0;color:#c9c1b5;font:400 13px Arial,sans-serif">${language === "fr" ? "Référence" : "Reference"} ${escapeHtml(reference)}</p></td></tr><tr><td class="card-pad" style="padding:30px 32px"><p style="margin:0 0 22px;color:#4a473f;font:400 14px Arial,sans-serif;line-height:1.65">${escapeHtml(intro)}</p><div style="margin:0 0 22px;padding:14px 16px;background:#f6f2ea;border-left:3px solid #d7b84f;border-radius:0 10px 10px 0"><div style="color:#766f62;font:700 10px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase">${language === "fr" ? "Service demandé" : "Requested service"}</div><div style="margin-top:6px;color:#171613;font:400 21px Georgia,serif">${escapeHtml(serviceName)}</div></div><h2 style="margin:0 0 12px;color:#9b7621;font:700 11px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(requestTitle)}</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${renderRows(rows)}</table>${contactRows?.length ? `<h2 style="margin:30px 0 12px;color:#9b7621;font:700 11px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(contactTitle || "")}</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${renderRows(contactRows)}</table>` : ""}${action ? `<p style="margin:28px 0 0"><a href="${escapeHtml(action.href)}" style="display:inline-block;padding:13px 18px;border-radius:9px;background:#d7b84f;color:#11110f;font:700 13px Arial,sans-serif;text-decoration:none">${escapeHtml(action.label)}</a></p>` : ""}</td></tr><tr><td class="card-pad" style="padding:18px 32px;background:#f6f2ea;color:#766f62;font:400 11px Arial,sans-serif;line-height:1.5">${escapeHtml(footer)}</td></tr></table></td></tr></table></body></html>`;
}

function businessEmailContent(payload: ContactPayload, reference: string) {
  const service = services.find(item => item.slug === payload.service)!;
  const serviceName = tr(service.name, payload.language);
  const rows = requestRows(payload);
  const contactRows = [
    [payload.language === "fr" ? "Nom" : "Name", payload.fullName],
    [payload.language === "fr" ? "Téléphone" : "Phone", payload.phone],
    ["E-mail", payload.email],
  ];
  const descriptor = payload.serviceDetails.destination || payload.serviceDetails.destinationCountry || payload.serviceDetails.departureCity || payload.serviceDetails.currentCity || serviceName;
  const subject = `[${reference}] Nouvelle demande · ${serviceName} · ${descriptor}`;
  const requestTitle = payload.language === "fr" ? "Détails de la demande" : "Request details";
  const contactTitle = payload.language === "fr" ? "Coordonnées" : "Contact details";
  const emailTitle = payload.language === "fr" ? "Nouvelle demande client" : "New customer request";
  const text = [
    `${emailTitle.toUpperCase()} — ${reference}`,
    "",
    `Service : ${serviceName}`,
    ...rows.map(([label, value]) => `${label} : ${value}`),
    "",
    ...contactRows.map(([label, value]) => `${label} : ${value}`),
  ].join("\n");
  const html = emailShell({
    language: payload.language,
    eyebrow: payload.language === "fr" ? "Trust Elite Travel · Lead entrant" : "Trust Elite Travel · New lead",
    title: emailTitle,
    reference,
    intro: payload.language === "fr" ? "Toutes les informations saisies par le prospect sont regroupées ci-dessous pour faciliter le traitement de sa demande." : "All information entered by the prospect is grouped below for efficient follow-up.",
    serviceName,
    requestTitle,
    rows,
    contactTitle,
    contactRows,
    action: { href: `mailto:${payload.email}`, label: `${payload.language === "fr" ? "Répondre à" : "Reply to"} ${payload.fullName}` },
    footer: payload.language === "fr" ? "Demande transmise depuis trustelitetravels.com. Répondez directement à cet e-mail pour contacter le prospect." : "Request sent from trustelitetravels.com. Reply directly to contact the prospect.",
  });

  return { subject, text, html };
}

function customerEmailContent(payload: ContactPayload, reference: string) {
  const service = services.find(item => item.slug === payload.service)!;
  const serviceName = tr(service.name, payload.language);
  const rows = requestRows(payload);
  const isFr = payload.language === "fr";
  const title = isFr ? "Votre demande a bien été reçue" : "We have received your request";
  const subject = `${title} · ${reference}`;
  const text = [
    title.toUpperCase(),
    `${isFr ? "Référence" : "Reference"} : ${reference}`,
    "",
    `${isFr ? "Service" : "Service"} : ${serviceName}`,
    ...rows.map(([label, value]) => `${label} : ${value}`),
    "",
    isFr ? "Notre équipe examinera ces informations et vous répondra avec le contexte nécessaire." : "Our team will review these details and reply with the necessary context.",
  ].join("\n");
  const html = emailShell({
    language: payload.language,
    eyebrow: "Trust Elite Travel",
    title,
    reference,
    intro: isFr ? `Bonjour ${payload.fullName}, merci pour votre confiance. Voici le récapitulatif exact de votre demande.` : `Hello ${payload.fullName}, thank you for your trust. Here is the exact summary of your request.`,
    serviceName,
    requestTitle: isFr ? "Récapitulatif de votre demande" : "Your request summary",
    rows,
    action: { href: `mailto:${process.env.CONTACT_TO_EMAIL || "contact@trustelitetravels.com"}`, label: isFr ? "Nous écrire" : "Contact us" },
    footer: isFr ? "Ceci est un accusé de réception automatique. Conservez votre référence pour faciliter le suivi." : "This is an automatic acknowledgement. Keep your reference to make follow-up easier.",
  });
  return { subject, text, html };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    if (origin && new URL(origin).host !== request.nextUrl.host) return NextResponse.json({ ok: false, message: "Origine non autorisée." }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false, message: "Origine non autorisée." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Demande trop volumineuse." }, { status: 413 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) return NextResponse.json({ ok: false, message: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ ok: false, message: "Demande illisible." }, { status: 400 });
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Demande trop volumineuse." }, { status: 413 });

  let payload: ContactPayload | null = null;
  try {
    payload = normalizePayload(JSON.parse(raw));
  } catch {
    payload = null;
  }
  if (!payload) return NextResponse.json({ ok: false, message: "Vérifiez les informations du formulaire." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "contact@trustelitetravels.com";
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is missing");
    return NextResponse.json({ ok: false, message: "Le service e-mail est temporairement indisponible." }, { status: 503 });
  }

  const reference = `TET-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const businessEmail = businessEmailContent(payload, reference);
  const customerEmail = customerEmailContent(payload, reference);
  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": reference },
    body: JSON.stringify([
      { from, to: [to], reply_to: payload.email, subject: businessEmail.subject, html: businessEmail.html, text: businessEmail.text },
      { from, to: [payload.email], reply_to: to, subject: customerEmail.subject, html: customerEmail.html, text: customerEmail.text },
    ]),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  if (!response?.ok) {
    console.error("[contact] Resend delivery failed", { status: response?.status || 0, reference });
    return NextResponse.json({ ok: false, message: "L’e-mail n’a pas pu être envoyé." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, reference, confirmationSent: true }, { headers: { "Cache-Control": "no-store" } });
}
