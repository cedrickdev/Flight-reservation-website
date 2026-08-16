/** Local SEO and page metadata for Trust Elite Travel. */
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const defaultDescription = {
  fr: "Trust Elite Travel est une agence de voyage à Douala et au Cameroun : billets d’avion, voyages et séjours, hôtels, assistance visa, assurance voyage et conciergerie.",
  en: "Trust Elite Travel is a travel agency in Douala and Cameroon for flight tickets, trips and stays, hotels, visa assistance, travel insurance and concierge services.",
};

export function SEO({ title, description, path = "" }: { title: string; description?: string; path?: string }) {
  const { language } = useLanguage();
  useEffect(() => {
    const content = description || defaultDescription[language];
    const fullTitle = `${title} | Trust Elite Travel`;
    const keywords = language === "fr" ? "agence de voyage Douala, agence de voyage Cameroun, billet d’avion Douala, assistance visa Cameroun, réservation hôtel Douala, voyage Cameroun" : "travel agency Douala, travel agency Cameroon, flight tickets Douala, visa assistance Cameroon, hotel booking Douala, Cameroon travel";
    const setMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
      let node = document.head.querySelector<HTMLMetaElement>(selector);
      if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.appendChild(node); }
      node.content = value;
    };
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", content);
    setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[name="robots"]', "name", "robots", "index,follow");
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", content);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:locale"]', "property", "og:locale", language === "fr" ? "fr_CM" : "en_US");
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `https://trust-elite-travels.com${path}`;
    let structured = document.head.querySelector<HTMLScriptElement>('script[data-trust-elite-schema="local-business"]');
    if (!structured) { structured = document.createElement("script"); structured.type = "application/ld+json"; structured.dataset.trustEliteSchema = "local-business"; document.head.appendChild(structured); }
    structured.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Trust Elite Travel",
      url: "https://trust-elite-travels.com",
      email: "contact@trustelitetravels.com",
      telephone: "+237655449335",
      address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM", streetAddress: "Makepe, face CNPS" },
      areaServed: ["Douala", "Cameroon"],
      sameAs: ["https://www.instagram.com/trust_elite_travel/", "https://www.tiktok.com/@trust.elite.trave"],
      knowsAbout: ["Air tickets", "Travel planning", "Hotel reservations", "Visa assistance", "Travel insurance", "Concierge services", "Cabin crew coaching"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Trust Elite Travel services",
        itemListElement: [
          "Air ticketing",
          "Travel and stay planning",
          "Hotel reservations",
          "Visa assistance",
          "Travel insurance",
          "Concierge services",
          "Cabin crew career guidance",
        ].map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
    });
  }, [description, language, path, title]);
  return null;
}
