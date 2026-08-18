"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, PlaneTakeoff } from "lucide-react";
import { contact, services, tr, type Language, type ServiceSlug } from "@/lib/content";
import {
  getInitialServiceDetails,
  getRequestValueLabel,
  isRequestFieldVisible,
  serviceRequestFlows,
  textFor,
  validateRequestDetails,
  type RequestField,
} from "@/lib/requestFields";
import { useLanguage } from "@/contexts/LanguageContext";

type RequestData = {
  service: ServiceSlug | "";
  serviceDetails: Record<string, string>;
  fullName: string;
  phone: string;
  email: string;
};

type ContactResponse = { ok?: boolean; reference?: string; confirmationSent?: boolean; message?: string };
type ValidationResult = { message: string; fieldId: string } | null;

const initialData: RequestData = {
  service: "",
  serviceDetails: {},
  fullName: "",
  phone: "",
  email: "",
};

function buildMessage(data: RequestData, serviceName: string, language: Language) {
  const flow = data.service ? serviceRequestFlows[data.service] : null;
  const requestLines = flow?.fields
    .filter(field => isRequestFieldVisible(field, data.serviceDetails) && data.serviceDetails[field.key]?.trim())
    .map(field => `${textFor(field.label, language)} : ${getRequestValueLabel(field, data.serviceDetails[field.key], language)}`) || [];
  const heading = language === "fr"
    ? ["Bonjour Trust Elite Travel,", "", `Je souhaite recevoir une proposition pour : ${serviceName}.`, ""]
    : ["Hello Trust Elite Travel,", "", `I would like a proposal for: ${serviceName}.`, ""];
  const contactLines = language === "fr"
    ? ["", `Nom : ${data.fullName}`, `Téléphone : ${data.phone}`, `E-mail : ${data.email}`]
    : ["", `Name: ${data.fullName}`, `Phone: ${data.phone}`, `Email: ${data.email}`];

  return [...heading, ...requestLines, ...contactLines].join("\n");
}

function validateStep(data: RequestData, step: number, language: Language): ValidationResult {
  if (step === 0 && !data.service) {
    return { message: language === "fr" ? "Choisissez un service pour continuer." : "Choose a service to continue.", fieldId: "" };
  }

  if (step === 1 && data.service) {
    const error = validateRequestDetails(data.service, data.serviceDetails, language);
    if (error) return { message: error.message, fieldId: `service-${error.fieldKey}` };
  }

  if (step === 2) {
    if (!data.fullName.trim()) return { message: language === "fr" ? "Renseignez votre nom complet." : "Enter your full name.", fieldId: "fullname" };
    if (data.phone.trim().length < 6) return { message: language === "fr" ? "Saisissez un numéro WhatsApp valide." : "Enter a valid WhatsApp number.", fieldId: "phone" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { message: language === "fr" ? "Saisissez une adresse e-mail valide." : "Enter a valid email address.", fieldId: "email" };
  }

  return null;
}

function DynamicField({ field, value, language, invalid, onChange }: { field: RequestField; value: string; language: Language; invalid: boolean; onChange: (value: string) => void }) {
  const id = `service-${field.key}`;
  const label = textFor(field.label, language);
  const placeholder = field.placeholder ? textFor(field.placeholder, language) : undefined;
  const className = field.type === "textarea" ? "adaptive-field adaptive-field--wide" : "adaptive-field";

  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>{label}{!field.required && <span className="field-optional"> {language === "fr" ? "— facultatif" : "— optional"}</span>}</label>
      {field.type === "select" ? (
        <select id={id} name={field.key} required={field.required} value={value} aria-invalid={invalid || undefined} aria-describedby={invalid ? "step-validation-error" : undefined} onChange={event => onChange(event.target.value)}>
          {!field.defaultValue && <option value="">{language === "fr" ? "Sélectionner" : "Select"}</option>}
          {field.options?.map(item => <option key={item.value} value={item.value}>{textFor(item.label, language)}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea id={id} name={field.key} required={field.required} rows={4} value={value} aria-invalid={invalid || undefined} aria-describedby={invalid ? "step-validation-error" : undefined} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
      ) : (
        <input id={id} name={field.key} required={field.required} type={field.type} min={field.min} max={field.max} inputMode={field.type === "number" ? "numeric" : undefined} value={value} aria-invalid={invalid || undefined} aria-describedby={invalid ? "step-validation-error" : undefined} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export function RequestStepper() {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RequestData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState<ValidationResult>(null);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [emailUrl, setEmailUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const activeStepHeadingRef = useRef<HTMLLegendElement>(null);
  const initialStepRender = useRef(true);
  const labels = language === "fr" ? ["Votre besoin", "Votre demande", "Vos coordonnées", "Confirmation"] : ["Your need", "Your request", "Your details", "Confirmation"];
  const selectedService = services.find(service => service.slug === data.service);
  const serviceName = selectedService ? tr(selectedService.name, language) : "";
  const activeFlow = data.service ? serviceRequestFlows[data.service] : null;

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    if (services.some(service => service.slug === slug)) {
      const service = slug as ServiceSlug;
      setData(current => ({ ...current, service, serviceDetails: getInitialServiceDetails(service) }));
    }
  }, []);

  useEffect(() => {
    if (initialStepRender.current) {
      initialStepRender.current = false;
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const form = formRef.current;
        if (!form) return;
        const headerOffset = window.innerWidth <= 760 ? 60 : 64;
        const top = window.scrollY + form.getBoundingClientRect().top - headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
        activeStepHeadingRef.current?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [step]);

  const clearErrors = () => {
    setStepError(null);
    setSubmitError("");
  };

  const selectService = (service: ServiceSlug) => {
    setData(current => ({ ...current, service, serviceDetails: getInitialServiceDetails(service) }));
    clearErrors();
  };

  const updateDetails = (field: string, value: string) => {
    setData(current => ({ ...current, serviceDetails: { ...current.serviceDetails, [field]: value } }));
    clearErrors();
  };

  const updateContact = (field: "fullName" | "phone" | "email", value: string) => {
    setData(current => ({ ...current, [field]: value }));
    clearErrors();
  };

  const advance = () => {
    const error = validateStep(data, step, language);
    if (error) {
      setStepError(error);
      requestAnimationFrame(() => {
        const target = error.fieldId ? document.getElementById(error.fieldId) : formRef.current?.querySelector<HTMLInputElement>('input[name="service"]');
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    clearErrors();
    setStep(current => current + 1);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !data.service) return;

    const message = buildMessage(data, serviceName, language);
    const nextWhatsappUrl = `https://wa.me/${contact.phones[0].wa}?text=${encodeURIComponent(message)}`;
    const nextEmailUrl = `mailto:${contact.email}?subject=${encodeURIComponent(language === "fr" ? `Demande de devis — ${serviceName}` : `Quote request — ${serviceName}`)}&body=${encodeURIComponent(message)}`;
    setWhatsappUrl(nextWhatsappUrl);
    setEmailUrl(nextEmailUrl);
    setSubmitError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, language }) });
      const result = await response.json().catch(() => ({})) as ContactResponse;
      if (!response.ok || !result.ok) throw new Error(result.message || "CONTACT_SEND_FAILED");
      setReference(result.reference || "");
      setSubmitted(true);
    } catch {
      setSubmitError(language === "fr" ? "L’envoi automatique n’a pas abouti. Réessayez ou utilisez l’alternative e-mail ci-dessous." : "Automatic delivery failed. Try again or use the email alternative below.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="form-complete" role="status" aria-live="polite">
      <div className="complete-icon" aria-hidden="true"><span className="complete-icon-pulse" /><Check size={22} /></div>
      <p className="service-eyebrow">{language === "fr" ? "Demande envoyée" : "Request sent"}</p>
      <h3>{language === "fr" ? "Votre demande a bien été transmise." : "Your request has been delivered."}</h3>
      <p>{language === "fr" ? "Notre équipe a reçu toutes vos informations. Un récapitulatif vient également d’être envoyé à votre adresse e-mail." : "Our team received all your details. A confirmation summary has also been sent to your email address."}</p>
      {reference && <p className="submission-reference">{language === "fr" ? "Référence" : "Reference"} · {reference}</p>}
      <div className="form-complete-actions"><a className="button-secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />{language === "fr" ? "Poursuivre sur WhatsApp" : "Continue on WhatsApp"}</a></div>
      <button type="button" className="form-reset-link" onClick={() => { setSubmitted(false); setStep(0); setData(initialData); }}>{language === "fr" ? "Créer une autre demande" : "Create another request"}</button>
    </div>
  );

  const confirmationFields = activeFlow?.fields.filter(field => isRequestFieldVisible(field, data.serviceDetails) && data.serviceDetails[field.key]?.trim()) || [];

  return (
    <form ref={formRef} className="request-stepper" onSubmit={submit} noValidate aria-busy={submitting}>
      <ol className="stepper-progress" aria-label={language === "fr" ? "Étapes du formulaire" : "Form steps"}>{labels.map((label, index) => <li key={label} className={index <= step ? "is-active" : ""} aria-current={index === step ? "step" : undefined}><span>{index < step ? <Check size={13} /> : `0${index + 1}`}</span><em>{label}</em></li>)}</ol>

      {step === 0 && <fieldset className="step-panel" aria-describedby={stepError ? "step-validation-error" : undefined}><legend ref={activeStepHeadingRef} tabIndex={-1}>{language === "fr" ? "Quel accompagnement recherchez-vous ?" : "Which service are you looking for?"}</legend><p>{language === "fr" ? "Votre choix adapte automatiquement la suite du formulaire." : "Your choice automatically adapts the rest of the form."}</p><div className="service-choice-grid">{services.map(service => <label key={service.slug} className={data.service === service.slug ? "service-choice selected" : "service-choice"}><input type="radio" name="service" value={service.slug} checked={data.service === service.slug} aria-invalid={Boolean(stepError) || undefined} onChange={() => selectService(service.slug)} /><span>{service.number}</span>{tr(service.name, language)}</label>)}</div></fieldset>}

      {step === 1 && activeFlow && <fieldset className="step-panel step-panel--adaptive"><legend ref={activeStepHeadingRef} tabIndex={-1}>{textFor(activeFlow.title, language)}</legend><p>{textFor(activeFlow.intro, language)}</p><div className="adaptive-field-grid">{activeFlow.fields.filter(field => isRequestFieldVisible(field, data.serviceDetails)).map(field => <DynamicField key={field.key} field={field} value={data.serviceDetails[field.key] || ""} language={language} invalid={stepError?.fieldId === `service-${field.key}`} onChange={value => updateDetails(field.key, value)} />)}</div><div className="lead-channel-note"><MessageCircle size={18} aria-hidden="true" /><span><strong>{language === "fr" ? "Un suivi direct après l’envoi" : "Direct follow-up after sending"}</strong><small>{language === "fr" ? "Notre équipe reçoit d’abord votre demande structurée par e-mail. Vous pourrez ensuite poursuivre sur WhatsApp." : "Our team first receives your structured request by email. You can then continue on WhatsApp."}</small></span></div></fieldset>}

      {step === 2 && <fieldset className="step-panel"><legend ref={activeStepHeadingRef} tabIndex={-1}>{language === "fr" ? "Comment pouvons-nous vous répondre ?" : "How can we reply to you?"}</legend><p>{language === "fr" ? "Ces coordonnées sont transmises uniquement à notre équipe afin de répondre à votre demande." : "These details are sent only to our team so we can reply to your request."}</p><div className="form-two-columns"><div><label className="field-label" htmlFor="fullname">{language === "fr" ? "Nom complet" : "Full name"}</label><input id="fullname" required autoComplete="name" value={data.fullName} aria-invalid={stepError?.fieldId === "fullname" || undefined} aria-describedby={stepError?.fieldId === "fullname" ? "step-validation-error" : undefined} onChange={event => updateContact("fullName", event.target.value)} /></div><div><label className="field-label" htmlFor="phone">{language === "fr" ? "Numéro WhatsApp" : "WhatsApp number"}</label><input id="phone" required type="tel" autoComplete="tel" inputMode="tel" value={data.phone} aria-invalid={stepError?.fieldId === "phone" || undefined} aria-describedby={stepError?.fieldId === "phone" ? "step-validation-error" : undefined} onChange={event => updateContact("phone", event.target.value)} placeholder="+237 …" /></div></div><label className="field-label" htmlFor="email">E-mail</label><input id="email" type="email" required autoComplete="email" value={data.email} aria-invalid={stepError?.fieldId === "email" || undefined} aria-describedby={stepError?.fieldId === "email" ? "step-validation-error" : undefined} onChange={event => updateContact("email", event.target.value)} /></fieldset>}

      {step === 3 && activeFlow && <fieldset className="step-panel confirm-panel"><div className="confirm-icon"><PlaneTakeoff size={24} /></div><legend ref={activeStepHeadingRef} tabIndex={-1}>{language === "fr" ? "Votre demande est prête." : "Your request is ready."}</legend><p>{language === "fr" ? "Vérifiez les éléments ci-dessous. Ils seront transmis à notre équipe dans un e-mail structuré." : "Review the details below. They will be sent to our team in a structured email."}</p><dl><div><dt>Service</dt><dd>{serviceName}</dd></div>{confirmationFields.map(field => <div key={field.key}><dt>{textFor(field.label, language)}</dt><dd>{getRequestValueLabel(field, data.serviceDetails[field.key], language)}</dd></div>)}<div><dt>Contact</dt><dd>{data.fullName} · {data.phone} · {data.email}</dd></div></dl>{submitError && <div className="form-submit-error" role="alert"><span>{submitError}</span>{emailUrl && <><br /><a href={emailUrl}>{language === "fr" ? "Envoyer avec mon application e-mail" : "Send with my email app"}</a></>}</div>}</fieldset>}

      {stepError && <p id="step-validation-error" className="step-validation-error" role="alert">{stepError.message}</p>}
      <div className="stepper-actions">{step > 0 ? <button type="button" className="button-secondary" onClick={() => { setStepError(null); setStep(current => current - 1); }}><ArrowLeft size={17} />{language === "fr" ? "Retour" : "Back"}</button> : <span />}{step < 3 ? <button type="button" className="button-primary" onClick={advance}>{language === "fr" ? "Continuer" : "Continue"}<ArrowRight size={17} /></button> : <button className="button-primary" type="submit" disabled={submitting}><Mail size={17} />{submitting ? (language === "fr" ? "Envoi en cours…" : "Sending…") : (language === "fr" ? "Envoyer la demande" : "Send request")}</button>}</div>
    </form>
  );
}
