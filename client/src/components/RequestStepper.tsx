"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, PlaneTakeoff } from "lucide-react";
import { contact, services, tr, type ServiceSlug } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";

type RequestData = {
  service: ServiceSlug | "";
  project: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: string;
  fullName: string;
  phone: string;
  email: string;
  details: string;
};

const initialData: RequestData = { service: "", project: "", destination: "", departureDate: "", returnDate: "", travelers: "1", fullName: "", phone: "", email: "", details: "" };

export function RequestStepper() {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RequestData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [emailUrl, setEmailUrl] = useState("");
  const labels = language === "fr" ? ["Votre besoin", "Votre voyage", "Vos coordonnées", "Confirmation"] : ["Your need", "Your trip", "Your details", "Confirmation"];
  const selectedService = services.find(service => service.slug === data.service);
  const serviceName = selectedService ? tr(selectedService.name, language) : "";
  const valid = useMemo(() => step === 0 ? Boolean(data.service) : step === 1 ? Boolean(data.project.trim() && data.destination.trim() && data.departureDate && data.travelers) : step === 2 ? Boolean(data.fullName.trim() && data.phone.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) : true, [data, step]);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    if (services.some(service => service.slug === slug)) setData(current => ({ ...current, service: slug as ServiceSlug }));
  }, []);

  const update = (field: keyof RequestData, value: string) => setData(current => ({ ...current, [field]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const lines = language === "fr"
      ? ["Bonjour Trust Elite Travel,", "", "Je souhaite recevoir une proposition pour mon voyage.", `Service : ${serviceName}`, `Objet : ${data.project}`, `Destination : ${data.destination}`, `Départ : ${data.departureDate}`, `Retour : ${data.returnDate || "À confirmer"}`, `Voyageurs : ${data.travelers}`, data.details ? `Précisions : ${data.details}` : "", "", `Nom : ${data.fullName}`, `Téléphone : ${data.phone}`, `E-mail : ${data.email}`]
      : ["Hello Trust Elite Travel,", "", "I would like to receive a proposal for my trip.", `Service: ${serviceName}`, `Subject: ${data.project}`, `Destination: ${data.destination}`, `Departure: ${data.departureDate}`, `Return: ${data.returnDate || "To be confirmed"}`, `Travelers: ${data.travelers}`, data.details ? `Details: ${data.details}` : "", "", `Name: ${data.fullName}`, `Phone: ${data.phone}`, `Email: ${data.email}`];
    const message = lines.filter(Boolean).join("\n");
    const nextWhatsappUrl = `https://wa.me/${contact.phones[0].wa}?text=${encodeURIComponent(message)}`;
    const nextEmailUrl = `mailto:${contact.email}?subject=${encodeURIComponent(language === "fr" ? `Demande de devis — ${serviceName}` : `Quote request — ${serviceName}`)}&body=${encodeURIComponent(message)}`;
    setWhatsappUrl(nextWhatsappUrl);
    setEmailUrl(nextEmailUrl);
    setSubmitted(true);
    window.open(nextWhatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (submitted) return (
    <div className="form-complete" role="status" aria-live="polite">
      <div className="complete-icon" aria-hidden="true"><span className="complete-icon-pulse" /><Check size={22} /></div>
      <p className="service-eyebrow">{language === "fr" ? "Demande préparée" : "Request prepared"}</p>
      <h3>{language === "fr" ? "Votre conversation WhatsApp est prête." : "Your WhatsApp conversation is ready."}</h3>
      <p>{language === "fr" ? "Votre message contient les informations du voyage. Envoyez-le dans WhatsApp pour démarrer l’échange avec notre équipe." : "Your message contains your trip details. Send it in WhatsApp to start the conversation with our team."}</p>
      <div className="form-complete-actions"><a className="button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />{language === "fr" ? "Ouvrir WhatsApp" : "Open WhatsApp"}</a><a className="button-secondary" href={emailUrl}><Mail size={17} />{language === "fr" ? "Envoyer par e-mail" : "Send by email"}</a></div>
      <button type="button" className="form-reset-link" onClick={() => { setSubmitted(false); setStep(0); }}>{language === "fr" ? "Modifier la demande" : "Edit request"}</button>
    </div>
  );

  return (
    <form className="request-stepper" onSubmit={submit} noValidate>
      <ol className="stepper-progress" aria-label={language === "fr" ? "Étapes du formulaire" : "Form steps"}>{labels.map((label, index) => <li key={label} className={index <= step ? "is-active" : ""} aria-current={index === step ? "step" : undefined}><span>{index < step ? <Check size={13} /> : `0${index + 1}`}</span><em>{label}</em></li>)}</ol>
      {step === 0 && <fieldset className="step-panel"><legend>{language === "fr" ? "Quel accompagnement recherchez-vous ?" : "Which service are you looking for?"}</legend><p>{language === "fr" ? "Choisissez le point de départ de votre demande." : "Choose the starting point of your enquiry."}</p><div className="service-choice-grid">{services.map(service => <label key={service.slug} className={data.service === service.slug ? "service-choice selected" : "service-choice"}><input type="radio" name="service" value={service.slug} checked={data.service === service.slug} onChange={() => update("service", service.slug)} /><span>{service.number}</span>{tr(service.name, language)}</label>)}</div></fieldset>}
      {step === 1 && <fieldset className="step-panel"><legend>{language === "fr" ? "Parlez-nous de votre voyage." : "Tell us about your trip."}</legend><p>{language === "fr" ? "Ces informations nous permettent de préparer un premier retour utile." : "These details help us prepare a useful first response."}</p><label className="field-label" htmlFor="project">{language === "fr" ? "Objet de votre demande" : "Request subject"}</label><input id="project" required value={data.project} onChange={event => update("project", event.target.value)} placeholder={language === "fr" ? "Ex. Voyage familial, visa étudiant…" : "E.g. Family trip, student visa…"} /><label className="field-label" htmlFor="destination">Destination</label><input id="destination" required value={data.destination} onChange={event => update("destination", event.target.value)} placeholder={language === "fr" ? "Ex. Paris, Istanbul, Yaoundé…" : "E.g. Paris, Istanbul, Yaoundé…"} /><div className="form-two-columns"><div><label className="field-label" htmlFor="departureDate">{language === "fr" ? "Date de départ" : "Departure date"}</label><input id="departureDate" required type="date" value={data.departureDate} onChange={event => update("departureDate", event.target.value)} /></div><div><label className="field-label" htmlFor="returnDate">{language === "fr" ? "Date de retour" : "Return date"}</label><input id="returnDate" type="date" value={data.returnDate} onChange={event => update("returnDate", event.target.value)} /></div></div><label className="field-label" htmlFor="travelers">{language === "fr" ? "Nombre de voyageurs" : "Number of travelers"}</label><input id="travelers" required type="number" min="1" max="30" inputMode="numeric" value={data.travelers} onChange={event => update("travelers", event.target.value)} /><label className="field-label" htmlFor="details">{language === "fr" ? "Précisions utiles (facultatif)" : "Useful details (optional)"}</label><textarea id="details" rows={3} value={data.details} onChange={event => update("details", event.target.value)} placeholder={language === "fr" ? "Contexte, préférences, contraintes…" : "Context, preferences, constraints…"} /><div className="lead-channel-note"><MessageCircle size={18} aria-hidden="true" /><span><strong>{language === "fr" ? "Échange direct sur WhatsApp" : "Direct WhatsApp conversation"}</strong><small>{language === "fr" ? "Après l’envoi, vous pourrez transmettre vos documents directement dans la conversation." : "After sending, you can share documents directly in the conversation."}</small></span></div></fieldset>}
      {step === 2 && <fieldset className="step-panel"><legend>{language === "fr" ? "Comment pouvons-nous vous répondre ?" : "How can we reply to you?"}</legend><p>{language === "fr" ? "Ces informations sont ajoutées à votre message. Elles ne sont pas enregistrées par le site." : "These details are added to your message. They are not stored by this website."}</p><div className="form-two-columns"><div><label className="field-label" htmlFor="fullname">{language === "fr" ? "Nom complet" : "Full name"}</label><input id="fullname" required autoComplete="name" value={data.fullName} onChange={event => update("fullName", event.target.value)} /></div><div><label className="field-label" htmlFor="phone">{language === "fr" ? "Numéro WhatsApp" : "WhatsApp number"}</label><input id="phone" required type="tel" autoComplete="tel" inputMode="tel" value={data.phone} onChange={event => update("phone", event.target.value)} placeholder="+237 …" /></div></div><label className="field-label" htmlFor="email">E-mail</label><input id="email" type="email" required autoComplete="email" value={data.email} onChange={event => update("email", event.target.value)} /></fieldset>}
      {step === 3 && <fieldset className="step-panel confirm-panel"><div className="confirm-icon"><PlaneTakeoff size={24} /></div><legend>{language === "fr" ? "Votre demande est prête." : "Your request is ready."}</legend><p>{language === "fr" ? "Vérifiez les éléments ci-dessous. Le bouton ouvrira WhatsApp avec votre message prérempli." : "Review the details below. The button will open WhatsApp with your pre-filled message."}</p><dl><div><dt>Service</dt><dd>{serviceName}</dd></div><div><dt>Destination</dt><dd>{data.destination}</dd></div><div><dt>{language === "fr" ? "Dates" : "Dates"}</dt><dd>{data.departureDate}{data.returnDate ? ` → ${data.returnDate}` : ""}</dd></div><div><dt>{language === "fr" ? "Voyageurs" : "Travelers"}</dt><dd>{data.travelers}</dd></div><div><dt>Contact</dt><dd>{data.fullName} · {data.phone}</dd></div></dl></fieldset>}
      <div className="stepper-actions">{step > 0 ? <button type="button" className="button-secondary" onClick={() => setStep(current => current - 1)}><ArrowLeft size={17} />{language === "fr" ? "Retour" : "Back"}</button> : <span />}{step < 3 ? <button type="button" disabled={!valid} className="button-primary" onClick={() => setStep(current => current + 1)}>{language === "fr" ? "Continuer" : "Continue"}<ArrowRight size={17} /></button> : <button className="button-primary" type="submit"><MessageCircle size={17} />{language === "fr" ? "Continuer sur WhatsApp" : "Continue on WhatsApp"}</button>}</div>
    </form>
  );
}
