/** The header and footer form a dependable ink-and-gold frame around every route. */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
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

export function Footer() {
  const { language } = useLanguage();
  const copy = ui[language];
  return <footer className="site-footer"><div className="footer-grid"><div className="footer-brand"><img src={assets.logo} alt="Trust Elite Travel" width="104" height="104" loading="lazy" /><p>{copy.footer}</p></div><div className="footer-contact"><span className="footer-label">{language === "fr" ? "Point de départ" : "Starting point"}</span><strong>{contact.city[language]}</strong><a href={`https://wa.me/${contact.phones[0].wa}`} target="_blank" rel="noreferrer">{contact.phones[0].display}</a><a href={`https://wa.me/${contact.phones[1].wa}`} target="_blank" rel="noreferrer">{contact.phones[1].display}</a></div><div className="footer-contact"><span className="footer-label">{language === "fr" ? "Nous écrire" : "Write to us"}</span><a href={`mailto:${contact.email}`}>{contact.email}</a><Link href="/contact" className="footer-link">{copy.request}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Trust Elite Travel</span><span>{copy.legal}</span></div></footer>;
}
