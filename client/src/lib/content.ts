/** Direction L'Itinéraire d'Or: contenu bilingue précis, calme et sans promesse invérifiable. */
export type Language = "fr" | "en";
export type Localized = Record<Language, string>;
export const tr = (value: Localized, language: Language) => value[language];
export type ServiceSlug = "visa" | "billets" | "hotels" | "packages" | "assurance" | "conciergerie" | "coaching";
export type TravelService = { slug: ServiceSlug; number: string; name: Localized; eyebrow: Localized; summary: Localized; longDescription: Localized; deliverables: Localized[]; image?: string };

/** Local-first assets — replace files in client/public/assets/ to update the site. No external bucket required. */
export const assets = {
  logoOnLight: "/assets/logo-on-light.png",
  logoOnDark: "/assets/logo-on-dark.png",
  logoOnGold: "/assets/logo-on-gold.png",
  hero: "/assets/hero.webp",
  visa: "/assets/visa.webp",
  hotel: "/assets/hotel.webp",
  coaching: "/assets/coaching.webp",
  globe: "/assets/globe.webp",
  wing: "/assets/wing.webp",
  flightRoute: "/assets/flight-route.webp",
  douala: "/assets/douala.webp",
  office: "/assets/office.webp",
  faq: "/assets/faq.webp",
} as const;
export const contact = { email: "contact@trustelitetravels.com", phones: [{ display: "+237 655 44 93 35", wa: "237655449335" }, { display: "+237 654 99 77 30", wa: "237654997730" }], city: { fr: "Douala–Makepe, face CNPS", en: "Douala–Makepe, opposite CNPS" } satisfies Localized };
export const whatsappIntro = {
  fr: "Bonjour Trust Elite Travel, je souhaite obtenir des informations pour préparer mon voyage. Pouvez-vous m’accompagner, s’il vous plaît ?",
  en: "Hello Trust Elite Travel, I would like some information to prepare my trip. Could you please assist me?",
} satisfies Localized;
export const whatsappHref = (phone: string, language: Language) => `https://wa.me/${phone}?text=${encodeURIComponent(whatsappIntro[language])}`;

export const services: TravelService[] = [
  { slug:"billets", number:"01", name:{fr:"Billetterie aérienne",en:"Air ticketing"}, eyebrow:{fr:"National & international",en:"National & international"}, summary:{fr:"Des billets adaptés à votre destination et à votre calendrier.",en:"Tickets tailored to your destination and schedule."}, longDescription:{fr:"Nous vous aidons à organiser votre transport et à choisir un itinéraire cohérent avec votre calendrier et votre projet.",en:"We help organize your transport and select a route that suits your schedule and travel plan."}, deliverables:[{fr:"Recherche d’itinéraires",en:"Route search"},{fr:"Comparaison des options",en:"Options comparison"},{fr:"Préparation au départ",en:"Departure preparation"}] },
  { slug:"hotels", number:"02", name:{fr:"Réservations d’hôtels",en:"Hotel reservations"}, eyebrow:{fr:"Confortables & sécurisées",en:"Comfortable & secure"}, summary:{fr:"Des hôtels sélectionnés pour un séjour confortable et serein.",en:"Selected hotels for a comfortable, worry-free stay."}, longDescription:{fr:"Nous vous présentons des options d’hébergement adaptées à votre destination, à la durée de votre séjour et à vos priorités.",en:"We present accommodation options that fit your destination, length of stay and priorities."}, deliverables:[{fr:"Sélection selon le séjour",en:"Stay-based selection"},{fr:"Présentation des options",en:"Options overview"},{fr:"Confirmation des informations",en:"Information confirmation"}], image:assets.hotel },
  { slug:"visa", number:"03", name:{fr:"Assistance visa",en:"Visa assistance"}, eyebrow:{fr:"Dossier & orientation",en:"File preparation & guidance"}, summary:{fr:"Une orientation claire pour préparer votre dossier de visa.",en:"Clear guidance to prepare your visa application."}, longDescription:{fr:"Préparez votre démarche avec méthode. Nous vous aidons à organiser les informations nécessaires et à comprendre les étapes à prévoir.",en:"Prepare your process methodically. We help you organize the necessary information and understand the expected steps."}, deliverables:[{fr:"Analyse initiale du besoin",en:"Initial needs review"},{fr:"Liste de pièces à préparer",en:"Document checklist"},{fr:"Suivi des prochaines étapes",en:"Next-step guidance"}], image:assets.visa },
  { slug:"packages", number:"04", name:{fr:"Organisation de voyages et séjours",en:"Travel & stay organization"}, eyebrow:{fr:"Séjours sur mesure",en:"Tailored stays"}, summary:{fr:"Des voyages et séjours conçus selon vos envies.",en:"Trips and stays designed around your plans."}, longDescription:{fr:"Nous vous orientons vers des propositions de séjour qui articulent destination, transport, hébergement et rythme de voyage.",en:"We guide you toward stay proposals that bring together destination, transport, accommodation and travel pace."}, deliverables:[{fr:"Écoute du projet",en:"Plan discovery"},{fr:"Proposition de séjour",en:"Stay proposal"},{fr:"Orientation pratique",en:"Practical guidance"}] },
  { slug:"assurance", number:"05", name:{fr:"Assurance voyage",en:"Travel insurance"}, eyebrow:{fr:"Voyagez en toute sécurité",en:"Travel with confidence"}, summary:{fr:"Une couverture adaptée pour voyager avec plus de sérénité.",en:"Suitable cover for greater peace of mind while travelling."}, longDescription:{fr:"La couverture voyage fait partie d’une préparation rigoureuse. Nous vous aidons à identifier les éléments utiles à votre demande.",en:"Travel cover is part of careful preparation. We help identify the elements useful to your request."}, deliverables:[{fr:"Orientation selon le projet",en:"Guidance based on your plan"},{fr:"Lecture des éléments essentiels",en:"Review of key elements"},{fr:"Intégration au dossier",en:"Integration into your file"}] },
  { slug:"conciergerie", number:"06", name:{fr:"Conciergerie & services",en:"Concierge & services"}, eyebrow:{fr:"Un service premium",en:"A premium service"}, summary:{fr:"Une attention personnalisée pour les détails qui comptent.",en:"Personalized attention for the details that matter."}, longDescription:{fr:"Lorsque votre projet demande davantage d’attention, nous vous aidons à anticiper les détails et à organiser les étapes complémentaires.",en:"When your plan requires added attention, we help anticipate details and organize the complementary steps."}, deliverables:[{fr:"Écoute personnalisée",en:"Personalized listening"},{fr:"Coordination des besoins",en:"Needs coordination"},{fr:"Suivi du parcours",en:"Journey follow-up"}] },
  { slug:"coaching", number:"07", name:{fr:"Accompagnement au métier de cabin crew / hôtesse de l’air",en:"Cabin crew career coaching"}, eyebrow:{fr:"Hôtesses de l’air & stewards",en:"Flight attendants & stewards"}, summary:{fr:"Une préparation structurée vers les métiers de cabine.",en:"Structured preparation for a cabin crew career."}, longDescription:{fr:"Nous vous accompagnons dans votre préparation, votre présentation et votre compréhension des exigences d’un parcours vers les métiers de cabine.",en:"We support your preparation, presentation and understanding of requirements for a path toward cabin careers."}, deliverables:[{fr:"Clarification du projet professionnel",en:"Career-plan clarification"},{fr:"Préparation à la présentation",en:"Presentation preparation"},{fr:"Orientation sur le parcours",en:"Pathway guidance"}], image:assets.coaching },
];

export const ui = { fr:{nav:{home:"Accueil",services:"Services",about:"À propos",contact:"Contact"},contact:"Nous contacter",request:"Faire une demande",discover:"Découvrir le service",allServices:"Voir tous les services",language:"EN",location:"Notre adresse",close:"Fermer le menu",menu:"Ouvrir le menu",footer:"Un accompagnement de voyage clair, attentif et sur mesure.",legal:"Douala–Makepe, face CNPS · Contact direct et accompagnement sur mesure."}, en:{nav:{home:"Home",services:"Services",about:"About",contact:"Contact"},contact:"Contact us",request:"Make an enquiry",discover:"Explore service",allServices:"View all services",language:"FR",location:"Our address",close:"Close menu",menu:"Open menu",footer:"Clear, attentive and tailored travel support.",legal:"Douala–Makepe, opposite CNPS · Direct contact and tailored support."} } as const;


export const homeMessaging = {
  fr: {
    slogan: "Voyagez autrement, en toute confiance.",
    description: "Billetterie, voyages, hôtels, assistance visa, assurance voyage, conciergerie et accompagnement professionnel : un seul point de contact pour préparer la suite.",
    reserve: "Réserver un billet",
    quote: "Demander un devis",
    contact: "Nous contacter",
    trustEyebrow: "Pourquoi nous choisir",
    trustTitle: "Une agence sérieuse, pour un voyage plus serein.",
    trustText: "Nous transformons les informations dispersées en prochaines étapes compréhensibles, avec un accompagnement humain avant, pendant et après le voyage.",
    trustPoints: ["Accompagnement personnalisé", "Conseils professionnels", "Service fiable et transparent", "Solutions adaptées à chaque voyageur", "Assistance avant, pendant et après le voyage"],
    faqEyebrow: "Questions fréquentes",
    faqTitle: "Les réponses essentielles, avant de commencer.",
    faq: [
      ["Comment réserver un billet ?", "Décrivez votre destination, vos dates et vos préférences dans la demande de devis. Nous revenons vers vous avec les prochaines options."],
      ["Faites-vous les billets domestiques et internationaux ?", "Oui, nous pouvons vous orienter pour des trajets nationaux et internationaux selon votre projet et les disponibilités."],
      ["Proposez-vous une assistance visa ?", "Oui. Nous vous aidons à comprendre les étapes, organiser les pièces et préparer un dossier plus lisible, sans garantir la décision consulaire."],
      ["Quels documents faut-il fournir ?", "Les pièces dépendent du service et de la destination. Nous vous indiquons la liste utile après le premier échange."],
      ["Faites-vous les réservations d’hôtel ?", "Oui, nous recherchons des options d’hébergement cohérentes avec votre destination, vos dates et vos priorités."],
      ["Comment demander un devis ?", "Utilisez le formulaire de contact ou le bouton WhatsApp fixe pour nous transmettre les informations principales de votre projet."],
    ],
    socialTitle: "Suivre l’agence",
    socialPending: "Les liens officiels de nos réseaux seront ajoutés dès confirmation.",
    testimonialsTitle: "Témoignages vérifiés à venir",
    testimonialsText: "Cet espace accueillera des retours authentifiés de nos clients lorsque nous aurons leur accord de publication.",
  },
  en: {
    slogan: "Travel differently, with confidence.",
    description: "Air tickets, travel, hotels, visa assistance, travel insurance, concierge services and professional guidance: one point of contact for what comes next.",
    reserve: "Book a ticket",
    quote: "Request a quote",
    contact: "Contact us",
    trustEyebrow: "Why choose us",
    trustTitle: "A serious agency for a calmer journey.",
    trustText: "We turn scattered information into clear next steps, with human support before, during and after your trip.",
    trustPoints: ["Personalized support", "Professional advice", "Reliable and transparent service", "Solutions adapted to every traveler", "Support before, during and after the trip"],
    faqEyebrow: "Frequently asked questions",
    faqTitle: "The essential answers before you begin.",
    faq: [
      ["How do I book a ticket?", "Tell us your destination, dates and preferences in the quote request. We will return with the next options."],
      ["Do you handle domestic and international tickets?", "Yes, we can guide you for domestic and international journeys according to your plan and availability."],
      ["Do you offer visa assistance?", "Yes. We help you understand the steps, organize documents and prepare a clearer file, without guaranteeing a consular decision."],
      ["Which documents are required?", "Documents depend on the service and destination. We will share the relevant list after the first exchange."],
      ["Do you reserve hotels?", "Yes, we look for accommodation options consistent with your destination, dates and priorities."],
      ["How do I request a quote?", "Use the contact form or the fixed WhatsApp button to send us the main information about your plan."],
    ],
    socialTitle: "Follow the agency",
    socialPending: "Official social links will be added once confirmed.",
    testimonialsTitle: "Verified testimonials coming soon",
    testimonialsText: "This space will host authenticated client feedback once we have permission to publish it.",
  },
} as const;

export const socialPlatforms = ["Instagram", "Facebook", "LinkedIn", "TikTok"] as const;
