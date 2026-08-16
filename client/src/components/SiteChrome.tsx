/** The header and footer form a dependable ink-and-gold frame around every route. */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Menu, MessageCircle, Moon, Music2, Sun, X } from "lucide-react";
import { assets, contact, ui } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const copy = ui[language];
  useEffect(() => setOpen(false), [location]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{language === "fr" ? "Aller au contenu principal" : "Skip to main content"}</a>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Trust Elite Travel">
          <span className="brand-logo-crop" aria-hidden="true"><img className="brand-logo-official" src={assets.logo} alt="" width="104" height="104" /></span>
        </Link>
        <nav className="desktop-nav" aria-label={language === "fr" ? "Navigation principale" : "Main navigation"}>
          {links.map(link => (
            <Link key={link.href} href={link.href} className={location === link.href ? "nav-link active" : "nav-link"} aria-current={location === link.href ? "page" : undefined}>
              {copy.nav[link.key]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="theme-control touch-target" onClick={toggleTheme} aria-label={theme === "dark" ? (language === "fr" ? "Activer le thème clair" : "Use light theme") : (language === "fr" ? "Activer le thème sombre" : "Use dark theme")}>
            {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="language-control touch-target" onClick={toggleLanguage} aria-label={language === "fr" ? "Passer en anglais" : "Switch to French"}>
            <span aria-hidden="true">{copy.language}</span>
          </button>
          <Link href="/contact" className="header-cta"><span>{copy.request}</span><ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></Link>
          <button className="menu-toggle touch-target" type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} aria-label={open ? copy.close : copy.menu}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && <div className="mobile-menu">
        <nav aria-label={language === "fr" ? "Navigation mobile" : "Mobile navigation"}>
          {links.map(link => <Link key={link.href} href={link.href} className={location === link.href ? "mobile-nav-link active" : "mobile-nav-link"} aria-current={location === link.href ? "page" : undefined}>{copy.nav[link.key]}</Link>)}
        </nav>
        <div className="mobile-menu-footer"><span>{copy.location}</span><a href={`https://wa.me/${contact.phones[0].wa}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a></div>
      </div>}
    </header>
  );
}

export function WhatsAppFloat() {
  const { language } = useLanguage();
  return <a className="whatsapp-float" href={`https://wa.me/${contact.phones[0].wa}`} target="_blank" rel="noreferrer" aria-label={language === "fr" ? "Écrire sur WhatsApp" : "Write on WhatsApp"}><MessageCircle size={21} aria-hidden="true" /><span>WhatsApp</span></a>;
}

const socialIcons = { Instagram, Facebook, Linkedin, TikTok: Music2 };

export function Footer() {
  const { language } = useLanguage();
  const copy = ui[language];
  return <footer className="site-footer"><div className="footer-grid"><div className="footer-brand"><img src={assets.logo} alt="Trust Elite Travel" width="104" height="104" loading="lazy" /><p>{copy.footer}</p></div><div className="footer-contact"><span className="footer-label">{language === "fr" ? "Point de départ" : "Starting point"}</span><strong>{contact.city[language]}</strong><a href={`https://wa.me/${contact.phones[0].wa}`} target="_blank" rel="noreferrer">{contact.phones[0].display}</a><a href={`https://wa.me/${contact.phones[1].wa}`} target="_blank" rel="noreferrer">{contact.phones[1].display}</a></div><div className="footer-contact"><span className="footer-label">{language === "fr" ? "Nous écrire" : "Write to us"}</span><a href={`mailto:${contact.email}`}>{contact.email}</a><Link href="/contact" className="footer-link">{copy.request}<ArrowUpRight size={16} aria-hidden="true" /></Link><div className="footer-socials" aria-label={language === "fr" ? "Réseaux sociaux" : "Social networks"}><a className="footer-social-pending footer-social-link" href="https://www.instagram.com/trust_elite_travel/" target="_blank" rel="noreferrer" title="Instagram"><Instagram size={15} aria-hidden="true" /><span className="sr-only">Instagram</span></a><a className="footer-social-pending footer-social-link" href="https://www.tiktok.com/@trust.elite.trave" target="_blank" rel="noreferrer" title="TikTok"><Music2 size={15} aria-hidden="true" /><span className="sr-only">TikTok</span></a><span className="footer-social-pending" title={language === "fr" ? "Facebook — lien à confirmer" : "Facebook — link to be confirmed"}><Facebook size={15} aria-hidden="true" /><span className="sr-only">Facebook</span></span><span className="footer-social-pending" title={language === "fr" ? "LinkedIn — lien à confirmer" : "LinkedIn — link to be confirmed"}><Linkedin size={15} aria-hidden="true" /><span className="sr-only">LinkedIn</span></span></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Trust Elite Travel</span><span>{copy.legal}</span></div></footer>;
}
