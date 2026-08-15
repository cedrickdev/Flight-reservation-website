/** Direction L'Itinéraire d'Or: the homepage uses a light editorial hero and a gold flight path to guide discovery. */
import { ArrowDown, ArrowUpRight, Check, Compass, Globe2, MoveRight, PlaneTakeoff } from "lucide-react";
import { Link } from "wouter";
import { FlightScene } from "@/components/FlightScene";
import { SEO } from "@/components/SEO";
import { ServiceCard } from "@/components/ServiceCard";
import { assets, services, ui } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const copy = ui[language];
  const isFr = language === "fr";

  return (
    <>
      <SEO title={isFr ? "Voyage accompagné avec méthode" : "Travel support with clarity"} path="/" />
      <main>
        <section className="hero-section">
          <img className="hero-image" src={assets.hero} alt="" width="1600" height="900" fetchPriority="high" decoding="async" />
          <div className="hero-wash" />
          <FlightScene />
          <div className="hero-content">
            <div className="hero-pretitle"><span className="gold-dot" />{isFr ? "Voyage · Dossier · Orientation" : "Travel · File · Guidance"}</div>
            <h1>{isFr ? <>Votre projet mérite<br /><em>une trajectoire claire.</em></> : <>Your plan deserves<br /><em>a clear path forward.</em></>}</h1>
            <p>{isFr ? "Trust Elite Travel vous accompagne dans les étapes importantes de votre voyage, avec précision et attention." : "Trust Elite Travel supports the important steps of your journey with precision and care."}</p>
            <div className="hero-actions"><Link href="/contact" className="button-primary">{copy.request}<ArrowUpRight size={18} /></Link><Link href="/services" className="inline-cta">{copy.allServices}<MoveRight size={19} /></Link></div>
          </div>
          <div className="hero-side-note"><span>01</span><p>{isFr ? "Un accompagnement qui commence par l’écoute." : "Support that begins with listening."}</p></div>
          <a className="hero-scroll" href="#services"><span>{isFr ? "Découvrir" : "Discover"}</span><ArrowDown size={17} /></a>
        </section>

        <section className="manifesto-section section-shell section-with-visual">
          <div className="section-marker"><span>02</span><span>{isFr ? "Notre approche" : "Our approach"}</span></div>
          <div className="manifesto-layout"><div><p className="service-eyebrow">{isFr ? "Le service 360°, sans bruit inutile" : "A 360° service, without unnecessary noise"}</p><h2>{isFr ? <>Un accompagnement complet,<br /><em>à votre mesure.</em></> : <>Complete support,<br /><em>on your terms.</em></>}</h2></div><div className="manifesto-copy"><p>{isFr ? "Un voyage se prépare autant par les bonnes questions que par les bonnes réservations. Nous vous aidons à organiser les informations, les choix et les prochaines étapes qui comptent." : "A journey is prepared as much through the right questions as through the right reservations. We help you organize the information, choices and next steps that matter."}</p><Link href="/a-propos" className="text-link">{isFr ? "Comprendre notre démarche" : "Understand our approach"}<ArrowUpRight size={17} /></Link></div></div>
          <div className="section-visual visual-globe" style={{ backgroundImage: `url(${assets.globe})` }}><div className="visual-content"><p className="service-eyebrow">{isFr ? "Une vision plus large" : "A wider view"}</p><h3>{isFr ? <>Un itinéraire pensé<br /><em>avec perspective.</em></> : <>An itinerary designed<br /><em>with perspective.</em></>}</h3><p>{isFr ? "Nous relions les détails de votre projet pour vous aider à avancer avec une direction lisible, du premier échange aux dernières étapes." : "We connect the details of your plan to help you move forward with a clear direction, from the first conversation to the final steps."}</p><div className="visual-caption"><Globe2 size={16} />{isFr ? "Vers de nouveaux horizons" : "Toward new horizons"}</div></div></div>
          <div className="quiet-commitments"><div><Check size={18} /><span>{isFr ? "Une demande structurée, dès le premier échange." : "A structured request from the first conversation."}</span></div><div><Check size={18} /><span>{isFr ? "Une présentation claire des prochaines étapes." : "Clear presentation of the next steps."}</span></div><div><Check size={18} /><span>{isFr ? "Un contact direct quand vous en avez besoin." : "Direct contact when you need it."}</span></div></div>
        </section>

        <section id="services" className="services-section"><div className="section-shell"><div className="section-heading"><div><p className="service-eyebrow">{isFr ? "Nos expertises" : "Our expertise"}</p><h2>{isFr ? <>Les étapes de votre voyage,<br /><em>bien accompagnées.</em></> : <>Each step of your journey,<br /><em>well supported.</em></>}</h2></div><Link href="/services" className="text-link desktop-only">{copy.allServices}<ArrowUpRight size={17} /></Link></div><div className="section-visual visual-route"><img src={assets.flightRoute} alt={isFr ? "Trajectoire de vol élégante" : "Elegant flight route"} loading="lazy" width="1600" height="700" /><div className="visual-caption"><PlaneTakeoff size={16} />{isFr ? "Une trajectoire, plusieurs escales" : "One route, several stops"}</div></div><div className="service-rail">{services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div></div></section>

        <section className="wing-section section-shell section-with-visual"><div className="wing-copy"><p className="service-eyebrow">{isFr ? "Le départ se prépare" : "Departure starts here"}</p><h2>{isFr ? <>Prendre de la hauteur,<br /><em>sans perdre le cap.</em></> : <>Take flight,<br /><em>without losing direction.</em></>}</h2><p>{isFr ? "Chaque détail compte avant le départ : le bon document, la bonne réservation, le bon interlocuteur." : "Every detail matters before departure: the right document, the right reservation, the right point of contact."}</p><Link href="/contact" className="button-secondary">{copy.request}<ArrowUpRight size={17} /></Link></div><div className="wing-visual"><img src={assets.wing} alt={isFr ? "Vue sur l’aile d’un avion au-dessus des nuages" : "View over an airplane wing above the clouds"} loading="lazy" width="1200" height="800" /><span>{isFr ? "En route" : "En route"}</span></div></section>

        <section className="image-statement section-shell"><div className="image-statement-photo"><img src={assets.douala} alt={isFr ? "Préparation d’un voyage avec méthode" : "Preparing a journey with care"} loading="lazy" width="800" height="1200" /><div className="image-caption"><Compass size={17} /><span>{isFr ? "Chaque demande commence par un cap clair." : "Every request begins with a clear direction."}</span></div></div><div className="image-statement-copy"><span className="large-number">360</span><p className="service-eyebrow">{isFr ? "Un service, plusieurs points de passage" : "One service, several touchpoints"}</p><h2>{isFr ? <>Préparer.<br /><em>Choisir.</em><br />Partir.</> : <>Prepare.<br /><em>Choose.</em><br />Travel.</>}</h2><p>{isFr ? "Visa, transport, hébergement, assurance, conciergerie ou orientation professionnelle : nous vous aidons à mettre de l’ordre dans ce qui précède le départ." : "Visa, transport, accommodation, insurance, concierge services or career guidance: we help bring order to what comes before departure."}</p><Link href="/contact" className="button-secondary">{copy.request}<ArrowUpRight size={17} /></Link></div></section>

        <section className="contact-banner"><div className="section-shell contact-banner-inner"><div><span className="hero-pretitle"><span className="gold-dot" />{isFr ? "Démarrer votre demande" : "Start your enquiry"}</span><h2>{isFr ? <>Votre prochaine étape<br /><em>commence ici.</em></> : <>Your next step<br /><em>starts here.</em></>}</h2></div><Link href="/contact" className="button-light">{copy.contact}<PlaneTakeoff size={18} /></Link></div></section>
      </main>
    </>
  );
}
