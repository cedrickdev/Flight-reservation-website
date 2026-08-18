"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { services, tr, ui } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const coaching = services.find(service => service.slug === "coaching") || services[0];
  return (
    <main id="main-content">
      <section className="inner-hero section-shell"><div className="section-marker"><span>01</span><span>Services</span></div><div className="inner-hero-grid"><h1>{isFr ? <>Un seul point de contact.<br /><em>Plusieurs horizons.</em></> : <>One point of contact.<br /><em>Several horizons.</em></>}</h1><p>{isFr ? "Chaque service est conçu comme une étape lisible dans votre parcours. Choisissez le point de départ correspondant à votre besoin." : "Each service is designed as a readable step in your journey. Choose the starting point that matches your needs."}</p></div></section>
      <section className="services-list section-shell">{services.map(service => <div className="service-list-row" key={service.slug}><div className="row-number">{service.number}</div><div className="row-title"><p className="service-eyebrow">{tr(service.eyebrow, language)}</p><h2>{tr(service.name, language)}</h2></div><p className="row-summary">{tr(service.summary, language)}</p><Link href={`/services/${service.slug}`} className="round-link" aria-label={`${ui[language].discover}: ${tr(service.name, language)}`}><ArrowUpRight size={22} aria-hidden="true" /></Link></div>)}</section>
      <section className="service-card-spotlight section-shell"><ServiceCard service={coaching} featured /><div><p className="service-eyebrow">{isFr ? "Construire son avenir" : "Build your future"}</p><h2>{isFr ? <>Un projet professionnel<br /><em>prend aussi son envol.</em></> : <>A professional plan<br /><em>also takes flight.</em></>}</h2><p>{isFr ? "Découvrez un accompagnement conçu pour les personnes qui souhaitent préparer leur parcours vers les métiers de cabine." : "Discover guidance designed for people preparing their path toward cabin careers."}</p></div></section>
    </main>
  );
}
