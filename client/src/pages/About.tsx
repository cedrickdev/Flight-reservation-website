"use client";

/** Trust Elite Travel about page: story, vision, commitments and an authentic team placeholder. */
import {
  ArrowUpRight,
  Check,
  ImagePlus,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { assets, ui } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function About() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isFr = language === "fr";
  const principles = isFr
    ? [
        "Écouter avant d’orienter",
        "Présenter les étapes avec clarté",
        "Rester disponible au bon moment",
      ]
    : [
        "Listen before guiding",
        "Present every step clearly",
        "Remain available at the right moment",
      ];
  const differentiators = isFr
    ? [
        "Un seul point de contact pour plusieurs étapes",
        "Une information structurée et compréhensible",
        "Une présence humaine avant, pendant et après le voyage",
      ]
    : [
        "One point of contact for several steps",
        "Structured and understandable information",
        "Human support before, during and after the journey",
      ];
  return (
    <main id="main-content">
      <section className="about-hero section-shell">
        <div className="section-marker">
          <span>01</span>
          <span>{isFr ? "À propos" : "About"}</span>
        </div>
        <div className="about-hero-content">
          <h1>
            {isFr ? (
              <>
                Le voyage est plus serein
                <br />
                quand l’on sait <em>où l’on va.</em>
              </>
            ) : (
              <>
                Travel feels calmer
                <br />
                when you know <em>where you are going.</em>
              </>
            )}
          </h1>
          <p>
            {isFr
              ? "Trust Elite Travel existe pour rendre les projets de voyage plus lisibles, plus humains et mieux préparés, depuis Douala jusqu’à la prochaine escale."
              : "Trust Elite Travel exists to make travel plans clearer, more human and better prepared, from Douala to the next stop."}
          </p>
        </div>
      </section>
      <section className="about-story-section section-shell">
        <div>
          <p className="service-eyebrow">
            {isFr ? "Pourquoi nous existons" : "Why we exist"}
          </p>
          <h2>
            {isFr ? (
              <>
                Pourquoi Trust Elite Travel
                <br />
                <em>existe.</em>
              </>
            ) : (
              <>
                Why Trust Elite Travel
                <br />
                <em>exists.</em>
              </>
            )}
          </h2>
        </div>
        <div className="about-story-copy">
          <p>
            {isFr
              ? "Trust Elite Travel existe pour rendre les projets de voyage plus simples à comprendre et plus sereins à préparer. Un voyage ne se résume pas à un billet : il commence par une écoute, une destination à clarifier et des décisions à prendre au bon moment."
              : "Trust Elite Travel exists to make travel plans easier to understand and calmer to prepare. A journey is more than a ticket: it starts with listening, a destination to clarify and the right decisions at the right time."}
          </p>
          <p>
            {isFr
              ? "Trust Elite Travel rassemble ces étapes dans un accompagnement simple à comprendre, avec une attention particulière portée aux détails qui rassurent."
              : "Trust Elite Travel brings these steps together in support that is easy to understand, with particular care for the details that create confidence."}
          </p>
        </div>
      </section>
      <section className="principles-section">
        <div className="section-shell principles-layout">
          <div className="principles-image">
            <Image
              src={assets.aboutFounder}
              alt={
                isFr
                  ? "Portrait professionnel de l’équipe Trust Elite Travel"
                  : "Professional portrait of the Trust Elite Travel team"
              }
              width={1200}
              height={1600}
              sizes="(max-width: 760px) calc(100vw - 40px), 42vw"
              quality={82}
            />
          </div>
          <div className="principles-copy">
            <p className="service-eyebrow">
              {isFr ? "Notre manière d’accompagner" : "How we support you"}
            </p>
            <h2>
              {isFr ? (
                <>
                  Une présence
                  <br />
                  <em>attentive et précise.</em>
                </>
              ) : (
                <>
                  An attentive
                  <br />
                  <em>and precise presence.</em>
                </>
              )}
            </h2>
            <p>
              {isFr
                ? "Nous privilégions la compréhension de votre demande, une information facile à suivre et une orientation qui respecte votre calendrier. Notre rôle est de rendre le parcours plus lisible."
                : "We prioritize understanding your request, easy-to-follow information and guidance that respects your timeframe. Our role is to make the path more readable."}
            </p>
            <ul>
              {principles.map(item => (
                <li key={item}>
                  <Check size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="about-differentiators section-shell">
        <div className="section-heading">
          <div>
            <p className="service-eyebrow">
              {isFr ? "Ce qui nous différencie" : "What sets us apart"}
            </p>
            <h2>
              {isFr ? (
                <>
                  Une expérience
                  <br />
                  <em>qui reste humaine.</em>
                </>
              ) : (
                <>
                  An experience
                  <br />
                  <em>that stays human.</em>
                </>
              )}
            </h2>
          </div>
          <ShieldCheck size={26} aria-hidden="true" />
        </div>
        <div className="differentiator-grid">
          {differentiators.map((item, index) => (
            <div className="differentiator-card" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="about-mark-section section-shell">
        <Image
          className="about-official-logo"
          src={theme === "dark" ? assets.logoOnDark : assets.logoOnLight}
          alt=""
          width={485}
          height={512}
          sizes="220px"
          quality={75}
        />
        <div>
          <p className="service-eyebrow">
            {isFr ? "Notre point de départ" : "Our starting point"}
          </p>
          <h2>
            {isFr ? (
              <>
                Un point de départ
                <br />
                <em>pour vos projets.</em>
              </>
            ) : (
              <>
                A starting point
                <br />
                <em>for your plans.</em>
              </>
            )}
          </h2>
          <Link href="/contact" className="text-link">
            {ui[language].request}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
