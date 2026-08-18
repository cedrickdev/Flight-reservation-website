"use client";

/** Trust Elite Travel home: editorial hero, clear commercial promise, services, trust and conversion paths. */
import { ArrowDown, ArrowUpRight, BadgeCheck, Check, ChevronDown, Globe2, MoveRight, PlaneTakeoff, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import { GlobeO } from "@/components/GlobeO";
import { ServiceCard } from "@/components/ServiceCard";
import { WhatsAppBrandIcon } from "@/components/BrandIcons";
import { assets, contact, homeMessaging, services, ui, whatsappHref } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const copy = ui[language];
  const message = homeMessaging[language];
  const isFr = language === "fr";

  return (
    <main id="main-content">
        <section className="hero-section">
          <img className="hero-image" src={assets.hero} alt="" width="1600" height="900" fetchPriority="high" decoding="async" />
          <div className="hero-wash" />
          <div className="hero-content">
            <div className="hero-pretitle hero-slogan-emphasis"><span className="gold-dot" /><span className="hero-slogan-text">{message.slogan}</span></div>
            <h1 aria-label={isFr ? "Votre projet mérite une trajectoire claire." : "Your plan deserves a clear path forward."}>
              {isFr ? <>Votre projet mérite<br /><em>une traject<span className="hero-globe-letter"><GlobeO label="Globe interactif des pays" /></span>ire claire.</em></> : <>Your plan deserves<br /><em>a clear path forward.</em></>}
            </h1>
            <p>{message.description}</p>
            <div className="hero-actions">
              <Link href="/contact?service=billets" className="button-primary">{message.reserve}<ArrowUpRight size={18} /></Link>
              <Link href="/contact" className="inline-cta">{message.contact}<MoveRight size={19} /></Link>
            </div>
          </div>
          <div className="hero-side-note"><span>01</span><p>{isFr ? "Un accompagnement qui commence par l’écoute." : "Support that begins with listening."}</p></div>
          <a className="hero-scroll" href="#services"><span>{isFr ? "Découvrir" : "Discover"}</span><ArrowDown size={17} /></a>
        </section>

        <section className="manifesto-section section-shell section-with-visual">
          <div className="section-marker"><span>02</span><span>{isFr ? "Notre approche" : "Our approach"}</span></div>
          <div className="manifesto-layout"><div><p className="service-eyebrow">{isFr ? "Le service 360°, sans bruit inutile" : "A 360° service, without unnecessary noise"}</p><h2>{isFr ? <>Un accompagnement complet,<br /><em>à votre mesure.</em></> : <>Complete support,<br /><em>on your terms.</em></>}</h2></div><div className="manifesto-copy"><p>{isFr ? "Un voyage se prépare autant par les bonnes questions que par les bonnes réservations. Nous vous aidons à organiser les informations, les choix et les prochaines étapes qui comptent." : "A journey is prepared as much through the right questions as through the right reservations. We help you organize the information, choices and next steps that matter."}</p><Link href="/a-propos" className="text-link">{isFr ? "Comprendre notre démarche" : "Understand our approach"}<ArrowUpRight size={17} /></Link></div></div>
          <div className="section-visual visual-globe" style={{ backgroundImage: `url(${assets.globe})` }}><div className="visual-content"><p className="service-eyebrow" style={{ color: "#f0d991" }}>{isFr ? "Une vision plus large" : "A wider view"}</p><h3 style={{ color: "#fffaf0" }}>{isFr ? <>Un itinéraire pensé<br /><em style={{ color: "#f0d991" }}>avec perspective.</em></> : <>An itinerary designed<br /><em style={{ color: "#f0d991" }}>with perspective.</em></>}</h3><p style={{ color: "#fffaf0" }}>{isFr ? "Nous relions les détails de votre projet pour vous aider à avancer avec une direction lisible, du premier échange aux dernières étapes." : "We connect the details of your plan to help you move forward with a clear direction, from the first conversation to the final steps."}</p><div className="visual-caption" style={{ color: "#fffaf0" }}><Globe2 size={16} />{isFr ? "Vers de nouveaux horizons" : "Toward new horizons"}</div></div></div>
          <div className="quiet-commitments"><div><Check size={18} /><span>{isFr ? "Une demande structurée, dès le premier échange." : "A structured request from the first conversation."}</span></div><div><Check size={18} /><span>{isFr ? "Une présentation claire des prochaines étapes." : "Clear presentation of the next steps."}</span></div><div><Check size={18} /><span>{isFr ? "Un contact direct quand vous en avez besoin." : "Direct contact when you need it."}</span></div></div>
        </section>

        <section id="services" className="services-section services-section--route-bg"><div className="services-route-background" aria-hidden="true" style={{ backgroundImage: `url(${assets.flightRoute})` }} /><div className="services-route-scrim" aria-hidden="true" /><div className="section-shell services-section-content"><div className="section-heading"><div><p className="service-eyebrow">{isFr ? "Nos expertises" : "Our expertise"}</p><h2>{isFr ? <>Les étapes de votre voyage,<br /><em>bien accompagnées.</em></> : <>Each step of your journey,<br /><em>well supported.</em></>}</h2></div><Link href="/services" className="text-link desktop-only">{copy.allServices}<ArrowUpRight size={17} /></Link></div><div className="services-route-caption"><PlaneTakeoff size={16} aria-hidden="true" />{isFr ? "Une trajectoire, plusieurs escales" : "One route, several stops"}</div><div className="service-rail">{services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div></div></section>

        <section className="trust-section section-shell">
          <div className="trust-section-heading"><div><p className="service-eyebrow">{message.trustEyebrow}</p><h2>{message.trustTitle}</h2></div><p>{message.trustText}</p></div>
          <div className="trust-grid">{message.trustPoints.map((point, index) => <div className="trust-point" key={point}><span className="trust-point-number">0{index + 1}</span><BadgeCheck size={20} aria-hidden="true" /><strong>{point}</strong></div>)}</div>
        </section>

        <section className="wing-section section-shell section-with-visual"><div className="wing-copy"><p className="service-eyebrow">{isFr ? "Le départ se prépare" : "Departure starts here"}</p><h2>{isFr ? <>Prendre de la hauteur,<br /><em>sans perdre le cap.</em></> : <>Take flight,<br /><em>without losing direction.</em></>}</h2><p>{isFr ? "Chaque détail compte avant le départ : le bon document, la bonne réservation, le bon interlocuteur." : "Every detail matters before departure: the right document, the right reservation, the right point of contact."}</p><Link href="/contact" className="button-secondary">{message.quote}<ArrowUpRight size={17} /></Link></div><div className="wing-visual"><img src={assets.wing} alt={isFr ? "Vue sur l’aile d’un avion au-dessus des nuages" : "View over an airplane wing above the clouds"} loading="lazy" width="1200" height="800" /><span>{isFr ? "En route" : "En route"}</span></div></section>

        <section className="trust-proof-section section-shell"><div className="trust-proof-copy"><p className="service-eyebrow">{message.testimonialsTitle}</p><h2>{isFr ? <>La confiance se construit<br /><em>avec des preuves réelles.</em></> : <>Trust is built<br /><em>with real proof.</em></>}</h2><p>{message.testimonialsText}</p></div><div className="trust-proof-card"><UsersRound size={24} aria-hidden="true" /><strong>{isFr ? "Espace réservé aux retours authentifiés" : "Reserved space for authenticated feedback"}</strong><span>{isFr ? "Aucun avis fictif ou note inventée n’est publié." : "No fabricated review or rating is published."}</span></div></section>

        <section className="faq-section">
          <div className="faq-layout">
            <div className="faq-content">
              <div className="section-heading"><div><p className="service-eyebrow">{message.faqEyebrow}</p><h2>{message.faqTitle}</h2></div><Sparkles size={24} aria-hidden="true" /></div>
              <div className="faq-list">{message.faq.map(([question, answer]) => <details key={question} className="faq-item"><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
            </div>
            <div className="faq-visual">
              <img src={assets.faq} alt={isFr ? "Conseillère Trust Elite Travel dans l’agence de Douala" : "Trust Elite Travel adviser in the Douala agency"} loading="lazy" width="768" height="1024" decoding="async" />
            </div>
          </div>
        </section>

        <section className="image-statement section-shell"><div className="image-statement-photo"><picture><source srcSet={assets.office} type="image/webp" /><img src="/assets/office.jpg" alt={isFr ? "Equipe Trust Elite Travel devant les comptoirs de l'agence" : "Trust Elite Travel team in front of the agency counters"} loading="lazy" width="1200" height="1600" decoding="async" /></picture></div><div className="image-statement-copy"><span className="large-number">360</span><p className="service-eyebrow">{isFr ? "Un service, plusieurs points de passage" : "One service, several touchpoints"}</p><h2>{isFr ? <>Préparer.<br /><em>Choisir.</em><br />Partir.</> : <>Prepare.<br /><em>Choose.</em><br />Travel.</>}</h2><p>{isFr ? "Visa, transport, hébergement, assurance, conciergerie ou orientation professionnelle : nous vous aidons à mettre de l’ordre dans ce qui précède le départ." : "Visa, transport, accommodation, insurance, concierge services or career guidance: we help bring order to what comes before departure."}</p><Link href="/contact" className="button-secondary">{message.quote}<ArrowUpRight size={17} /></Link></div></section>

        <section className="contact-banner"><div className="section-shell contact-banner-inner"><img className="contact-banner-mark" src={assets.logoOnGold} alt="" width="512" height="264" aria-hidden="true" /><div><span className="hero-pretitle"><span className="gold-dot" />{isFr ? "Démarrer votre demande" : "Start your enquiry"}</span><h2>{isFr ? <>Votre prochaine étape<br /><em>commence ici.</em></> : <>Your next step<br /><em>starts here.</em></>}</h2></div><div className="contact-banner-actions"><Link href="/contact" className="button-light">{message.contact}<PlaneTakeoff size={18} /></Link><a href={whatsappHref(contact.phones[0].wa, language)} className="button-light button-light--outline" target="_blank" rel="noopener noreferrer"><WhatsAppBrandIcon size={18} />WhatsApp</a></div></div></section>
    </main>
  );
}
