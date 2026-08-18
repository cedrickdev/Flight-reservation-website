import type { Language, Localized, ServiceSlug } from "@/lib/content";

export type RequestFieldType = "text" | "date" | "number" | "select" | "textarea";

export type RequestFieldOption = {
  value: string;
  label: Localized;
};

export type RequestField = {
  key: string;
  label: Localized;
  type: RequestFieldType;
  required?: boolean;
  placeholder?: Localized;
  options?: RequestFieldOption[];
  min?: number;
  max?: number;
  defaultValue?: string;
  when?: { field: string; values?: string[]; nonZero?: boolean };
};

type DateOrder = { start: string; end: string };

export type RequestFlow = {
  title: Localized;
  intro: Localized;
  fields: RequestField[];
  dateOrders?: DateOrder[];
};

const option = (value: string, fr: string, en: string): RequestFieldOption => ({ value, label: { fr, en } });

export const serviceRequestFlows: Record<ServiceSlug, RequestFlow> = {
  billets: {
    title: { fr: "Précisons votre recherche de vol.", en: "Tell us about your flight." },
    intro: { fr: "Itinéraire, dates et niveau de confort nous aideront à rechercher les options pertinentes.", en: "Route, dates and comfort level help us identify relevant options." },
    fields: [
      { key: "departureCity", label: { fr: "Ville ou aéroport de départ", en: "Departure city or airport" }, type: "text", required: true, placeholder: { fr: "Ex. Douala (DLA)", en: "E.g. Douala (DLA)" } },
      { key: "destination", label: { fr: "Ville ou aéroport d’arrivée", en: "Arrival city or airport" }, type: "text", required: true, placeholder: { fr: "Ex. Paris (CDG)", en: "E.g. Paris (CDG)" } },
      { key: "tripType", label: { fr: "Type de trajet", en: "Trip type" }, type: "select", required: true, defaultValue: "roundTrip", options: [option("roundTrip", "Aller-retour", "Round trip"), option("oneWay", "Aller simple", "One way"), option("multiCity", "Multi-destinations", "Multi-city")] },
      { key: "departureDate", label: { fr: "Date de départ", en: "Departure date" }, type: "date", required: true },
      { key: "returnDate", label: { fr: "Date de retour", en: "Return date" }, type: "date", required: true, when: { field: "tripType", values: ["roundTrip"] } },
      { key: "adults", label: { fr: "Adultes (12 ans et plus)", en: "Adults (12 and over)" }, type: "number", required: true, min: 1, max: 9, defaultValue: "1" },
      { key: "children", label: { fr: "Enfants (2 à 11 ans)", en: "Children (2 to 11)" }, type: "number", min: 0, max: 8, defaultValue: "0" },
      { key: "infants", label: { fr: "Bébés (moins de 2 ans)", en: "Infants (under 2)" }, type: "number", min: 0, max: 8, defaultValue: "0" },
      { key: "cabinClass", label: { fr: "Classe de voyage", en: "Cabin class" }, type: "select", required: true, defaultValue: "economy", options: [option("economy", "Économique", "Economy"), option("premium", "Premium Economy", "Premium Economy"), option("business", "Affaires", "Business"), option("first", "Première", "First")] },
      { key: "dateFlexibility", label: { fr: "Flexibilité des dates", en: "Date flexibility" }, type: "select", defaultValue: "fixed", options: [option("fixed", "Dates fixes", "Fixed dates"), option("threeDays", "Flexible à ± 3 jours", "Flexible by ± 3 days"), option("oneWeek", "Flexible à ± 1 semaine", "Flexible by ± 1 week")] },
      { key: "routeDetails", label: { fr: "Étapes du trajet", en: "Trip segments" }, type: "textarea", required: true, when: { field: "tripType", values: ["multiCity"] }, placeholder: { fr: "Indiquez chaque ville et la date souhaitée.", en: "List each city and preferred date." } },
      { key: "notes", label: { fr: "Bagages ou préférences", en: "Baggage or preferences" }, type: "textarea", placeholder: { fr: "Bagage en soute, compagnie préférée, assistance…", en: "Checked baggage, preferred airline, assistance…" } },
    ],
    dateOrders: [{ start: "departureDate", end: "returnDate" }],
  },
  hotels: {
    title: { fr: "Précisons votre hébergement.", en: "Tell us about your accommodation." },
    intro: { fr: "Ces informations nous permettent de cibler un hôtel adapté au séjour.", en: "These details help us target suitable accommodation." },
    fields: [
      { key: "destination", label: { fr: "Destination", en: "Destination" }, type: "text", required: true, placeholder: { fr: "Ville ou quartier", en: "City or district" } },
      { key: "checkInDate", label: { fr: "Date d’arrivée", en: "Check-in date" }, type: "date", required: true },
      { key: "checkOutDate", label: { fr: "Date de départ", en: "Check-out date" }, type: "date", required: true },
      { key: "rooms", label: { fr: "Nombre de chambres", en: "Number of rooms" }, type: "number", required: true, min: 1, max: 10, defaultValue: "1" },
      { key: "adults", label: { fr: "Adultes", en: "Adults" }, type: "number", required: true, min: 1, max: 30, defaultValue: "1" },
      { key: "children", label: { fr: "Enfants", en: "Children" }, type: "number", min: 0, max: 20, defaultValue: "0" },
      { key: "childAges", label: { fr: "Âge des enfants", en: "Children’s ages" }, type: "text", required: true, when: { field: "children", nonZero: true }, placeholder: { fr: "Ex. 4 et 9 ans", en: "E.g. 4 and 9" } },
      { key: "hotelCategory", label: { fr: "Catégorie souhaitée", en: "Preferred category" }, type: "select", defaultValue: "unsure", options: [option("three", "3 étoiles", "3 stars"), option("four", "4 étoiles", "4 stars"), option("five", "5 étoiles", "5 stars"), option("unsure", "À conseiller", "Open to advice")] },
      { key: "roomPreference", label: { fr: "Type de chambre", en: "Room preference" }, type: "select", defaultValue: "unsure", options: [option("single", "Individuelle", "Single"), option("double", "Double", "Double"), option("twin", "Lits séparés", "Twin"), option("family", "Familiale", "Family"), option("suite", "Suite", "Suite"), option("unsure", "À conseiller", "Open to advice")] },
      { key: "notes", label: { fr: "Préférences", en: "Preferences" }, type: "textarea", placeholder: { fr: "Petit-déjeuner, accessibilité, lits séparés…", en: "Breakfast, accessibility, separate beds…" } },
    ],
    dateOrders: [{ start: "checkInDate", end: "checkOutDate" }],
  },
  visa: {
    title: { fr: "Précisons votre demande de visa.", en: "Tell us about your visa request." },
    intro: { fr: "Nous ne demandons ici aucune donnée sensible ni numéro de passeport.", en: "We do not request sensitive data or passport numbers here." },
    fields: [
      { key: "destinationCountry", label: { fr: "Pays de destination", en: "Destination country" }, type: "text", required: true },
      { key: "nationality", label: { fr: "Nationalité", en: "Nationality" }, type: "text", required: true },
      { key: "visaType", label: { fr: "Motif du voyage", en: "Purpose of travel" }, type: "select", required: true, options: [option("tourism", "Tourisme", "Tourism"), option("business", "Affaires", "Business"), option("study", "Études", "Studies"), option("family", "Visite familiale", "Family visit"), option("other", "Autre", "Other")] },
      { key: "intendedDepartureDate", label: { fr: "Date de départ envisagée", en: "Intended departure date" }, type: "date", required: true },
      { key: "travelers", label: { fr: "Nombre de demandeurs", en: "Number of applicants" }, type: "number", required: true, min: 1, max: 10, defaultValue: "1" },
      { key: "passportStatus", label: { fr: "Situation du passeport", en: "Passport status" }, type: "select", required: true, options: [option("valid", "Passeport valide", "Valid passport"), option("renewal", "Renouvellement en cours", "Renewal in progress"), option("notYet", "Pas encore de passeport", "No passport yet")] },
      { key: "notes", label: { fr: "Contexte utile", en: "Useful context" }, type: "textarea", placeholder: { fr: "Premier visa, précédent refus, invitation… sans donnée confidentielle.", en: "First visa, prior refusal, invitation… without confidential data." } },
    ],
  },
  packages: {
    title: { fr: "Construisons votre séjour.", en: "Let’s shape your trip." },
    intro: { fr: "Donnez-nous le cadre du voyage; notre équipe pourra ensuite affiner la proposition.", en: "Share the outline of your trip so our team can refine the proposal." },
    fields: [
      { key: "departureCity", label: { fr: "Ville de départ", en: "Departure city" }, type: "text", required: true },
      { key: "destination", label: { fr: "Destination souhaitée", en: "Preferred destination" }, type: "text", required: true },
      { key: "departureDate", label: { fr: "Date de départ", en: "Departure date" }, type: "date", required: true },
      { key: "returnDate", label: { fr: "Date de retour", en: "Return date" }, type: "date", required: true },
      { key: "travelers", label: { fr: "Nombre de voyageurs", en: "Number of travelers" }, type: "number", required: true, min: 1, max: 30, defaultValue: "1" },
      { key: "tripStyle", label: { fr: "Style de séjour", en: "Trip style" }, type: "select", defaultValue: "leisure", options: [option("leisure", "Découverte et loisirs", "Leisure and discovery"), option("family", "En famille", "Family"), option("honeymoon", "Voyage de noces", "Honeymoon"), option("business", "Professionnel", "Business"), option("group", "Groupe", "Group")] },
      { key: "budgetRange", label: { fr: "Budget indicatif", en: "Indicative budget" }, type: "text", placeholder: { fr: "Montant et devise", en: "Amount and currency" } },
      { key: "notes", label: { fr: "Envies et priorités", en: "Preferences and priorities" }, type: "textarea" },
    ],
    dateOrders: [{ start: "departureDate", end: "returnDate" }],
  },
  assurance: {
    title: { fr: "Précisons la couverture recherchée.", en: "Tell us about the cover you need." },
    intro: { fr: "Le contexte du voyage nous aide à orienter votre demande d’assurance.", en: "Your travel context helps us guide your insurance request." },
    fields: [
      { key: "destination", label: { fr: "Destination", en: "Destination" }, type: "text", required: true },
      { key: "departureDate", label: { fr: "Date de départ", en: "Departure date" }, type: "date", required: true },
      { key: "returnDate", label: { fr: "Date de retour", en: "Return date" }, type: "date", required: true },
      { key: "travelers", label: { fr: "Nombre de voyageurs", en: "Number of travelers" }, type: "number", required: true, min: 1, max: 30, defaultValue: "1" },
      { key: "travelerAges", label: { fr: "Âges des voyageurs", en: "Traveler ages" }, type: "text", required: true, placeholder: { fr: "Ex. 34, 31 et 6 ans", en: "E.g. 34, 31 and 6" } },
      { key: "coverageNeed", label: { fr: "Besoin principal", en: "Main coverage need" }, type: "select", required: true, options: [option("medical", "Frais médicaux", "Medical expenses"), option("cancellation", "Annulation", "Cancellation"), option("comprehensive", "Couverture complète", "Comprehensive cover"), option("unsure", "À conseiller", "Open to advice")] },
      { key: "notes", label: { fr: "Précisions", en: "Details" }, type: "textarea" },
    ],
    dateOrders: [{ start: "departureDate", end: "returnDate" }],
  },
  conciergerie: {
    title: { fr: "Décrivons le service à organiser.", en: "Tell us what needs to be arranged." },
    intro: { fr: "Précisez le lieu, la période et le niveau d’accompagnement attendu.", en: "Share the location, timing and assistance you expect." },
    fields: [
      { key: "destination", label: { fr: "Lieu du service", en: "Service location" }, type: "text", required: true },
      { key: "startDate", label: { fr: "Date de début", en: "Start date" }, type: "date", required: true },
      { key: "endDate", label: { fr: "Date de fin", en: "End date" }, type: "date" },
      { key: "travelers", label: { fr: "Nombre de personnes", en: "Number of people" }, type: "number", min: 1, max: 50, defaultValue: "1" },
      { key: "requestType", label: { fr: "Type de service", en: "Service type" }, type: "select", required: true, options: [option("transport", "Transport et transferts", "Transport and transfers"), option("accommodation", "Hébergement", "Accommodation"), option("appointments", "Rendez-vous et démarches", "Appointments and errands"), option("events", "Événement", "Event"), option("other", "Autre demande", "Other request")] },
      { key: "notes", label: { fr: "Service attendu", en: "Service required" }, type: "textarea", required: true, placeholder: { fr: "Décrivez précisément ce que vous souhaitez déléguer.", en: "Describe exactly what you would like us to arrange." } },
    ],
    dateOrders: [{ start: "startDate", end: "endDate" }],
  },
  coaching: {
    title: { fr: "Précisons votre projet cabin crew.", en: "Tell us about your cabin crew goal." },
    intro: { fr: "Votre niveau et votre objectif nous aideront à préparer un accompagnement pertinent.", en: "Your level and goal help us prepare relevant coaching." },
    fields: [
      { key: "currentCity", label: { fr: "Ville de résidence", en: "Current city" }, type: "text", required: true },
      { key: "targetRole", label: { fr: "Métier visé", en: "Target role" }, type: "select", required: true, options: [option("cabinCrew", "Cabin crew / personnel navigant", "Cabin crew"), option("hostess", "Hôtesse de l’air", "Flight attendant"), option("steward", "Steward", "Steward"), option("unsure", "À définir", "To be defined")] },
      { key: "experienceLevel", label: { fr: "Avancement du projet", en: "Current stage" }, type: "select", required: true, options: [option("beginner", "Je découvre le métier", "Exploring the career"), option("applying", "Je prépare mes candidatures", "Preparing applications"), option("interview", "J’ai un entretien à préparer", "Preparing for an interview")] },
      { key: "availability", label: { fr: "Disponibilités", en: "Availability" }, type: "text", required: true, placeholder: { fr: "Ex. Soirs, samedis ou à partir du 15 juin", en: "E.g. Evenings, Saturdays or from 15 June" } },
      { key: "languageLevel", label: { fr: "Niveau d’anglais", en: "English level" }, type: "text" },
      { key: "notes", label: { fr: "Objectif de l’accompagnement", en: "Coaching goal" }, type: "textarea", required: true, placeholder: { fr: "CV, présentation, entretien, compréhension du métier…", en: "CV, presentation, interview, career understanding…" } },
    ],
  },
};

export const textFor = (value: Localized, language: Language) => value[language];

export function getInitialServiceDetails(service: ServiceSlug): Record<string, string> {
  return Object.fromEntries(serviceRequestFlows[service].fields.map(field => [field.key, field.defaultValue || ""]));
}

export function isRequestFieldVisible(field: RequestField, values: Record<string, string>) {
  if (!field.when) return true;
  const controllingValue = values[field.when.field] || "";
  if (field.when.nonZero) return Number(controllingValue) > 0;
  return field.when.values?.includes(controllingValue) || false;
}

export function getRequestValueLabel(field: RequestField, value: string, language: Language) {
  return field.options?.find(item => item.value === value)?.label[language] || value;
}

export function validateRequestDetails(service: ServiceSlug, values: Record<string, string>, language: Language) {
  const flow = serviceRequestFlows[service];
  for (const field of flow.fields) {
    if (!isRequestFieldVisible(field, values)) continue;
    const value = (values[field.key] || "").trim();
    if (field.required && !value) {
      return { fieldKey: field.key, message: language === "fr" ? `Renseignez le champ « ${field.label.fr} ».` : `Complete the “${field.label.en}” field.` };
    }
    if (value && field.type === "number") {
      const number = Number(value);
      if (!Number.isInteger(number) || (field.min !== undefined && number < field.min) || (field.max !== undefined && number > field.max)) {
        return { fieldKey: field.key, message: language === "fr" ? `Vérifiez la valeur du champ « ${field.label.fr} ».` : `Check the “${field.label.en}” value.` };
      }
    }
    if (value && field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { fieldKey: field.key, message: language === "fr" ? `Vérifiez la date « ${field.label.fr} ».` : `Check the “${field.label.en}” date.` };
    }
    if (value && field.options && !field.options.some(item => item.value === value)) {
      return { fieldKey: field.key, message: language === "fr" ? `Choisissez une valeur valide pour « ${field.label.fr} ».` : `Choose a valid “${field.label.en}” value.` };
    }
  }

  for (const order of flow.dateOrders || []) {
    const start = values[order.start] || "";
    const end = values[order.end] || "";
    if (start && end && end < start) {
      return { fieldKey: order.end, message: language === "fr" ? "La date de fin doit être postérieure à la date de début." : "The end date must be after the start date." };
    }
  }

  if (service === "billets") {
    const adults = Number(values.adults || 0);
    const children = Number(values.children || 0);
    const infants = Number(values.infants || 0);
    if (adults + children + infants > 9) {
      return { fieldKey: "adults", message: language === "fr" ? "Une recherche en ligne peut contenir au maximum 9 passagers." : "An online search can include up to 9 passengers." };
    }
    if (infants > adults) {
      return { fieldKey: "infants", message: language === "fr" ? "Chaque bébé doit être accompagné par un adulte." : "Each infant must travel with an adult." };
    }
  }

  return null;
}
