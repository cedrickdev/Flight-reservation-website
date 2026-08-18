"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { FacebookBrandIcon, InstagramBrandIcon, TikTokBrandIcon, WhatsAppBrandIcon } from "@/components/BrandIcons";
import { assets, contact, socialLinks, ui, whatsappHref } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
] as const;

function BrandMark({ context, loading, darkSurface = false }: { context: "header" | "footer"; loading?: "eager" | "lazy"; darkSurface?: boolean }) {
  const { theme } = useTheme();
  const source = context === "footer" || darkSurface || theme === "dark" ? assets.logoOnDark : assets.logoOnLight;
  return <Image className={`brand-mark-official brand-mark-official--${context}`} src={source} alt="" width={485} height={512} sizes={context === "header" ? "64px" : "88px"} quality={75} loading={loading} />;
}

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`footer-socials ${className}`.trim()} aria-label="Réseaux sociaux">
      <a className="footer-social-link" href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><InstagramBrandIcon size={24} /></a>
      <a className="footer-social-link" href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok"><TikTokBrandIcon size={22} /></a>
      <a className="footer-social-link" href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><FacebookBrandIcon size={24} /></a>
    </div>
  );
}

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const copy = ui[language];
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const menu = mobileMenuRef.current;
    const focusable = Array.from(menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);
    const first = focusable[0];
    const last = focusable.at(-1);
    const focusFrame = window.requestAnimationFrame(() => first?.focus());
    const manageKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manageKeyboard);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", manageKeyboard);
    };
  }, [open]);

  return (
    <header className={open ? "site-header menu-is-open" : "site-header"}>
      <a className="skip-link" href="#main-content">{language === "fr" ? "Aller au contenu principal" : "Skip to main content"}</a>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Trust Elite Travel — accueil"><BrandMark context="header" loading="eager" /></Link>
        <nav className="desktop-nav" aria-label={language === "fr" ? "Navigation principale" : "Main navigation"}>
          {links.map(link => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}>{copy.nav[link.key]}</Link>;
          })}
        </nav>
        <div className="header-actions">
          <button type="button" className="theme-control touch-target" onClick={toggleTheme} aria-label={theme === "dark" ? (language === "fr" ? "Activer le thème clair" : "Use light theme") : (language === "fr" ? "Activer le thème sombre" : "Use dark theme")}>
            {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="language-control touch-target" onClick={toggleLanguage} aria-label={language === "fr" ? "Passer en anglais" : "Switch to French"}><span aria-hidden="true">{copy.language}</span></button>
          <Link href="/contact" className="header-cta"><span>{copy.request}</span><ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></Link>
          <button ref={menuButtonRef} className="menu-toggle touch-target" type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? copy.close : copy.menu}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && <div ref={mobileMenuRef} className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label={language === "fr" ? "Menu de navigation" : "Navigation menu"}><nav aria-label={language === "fr" ? "Navigation mobile" : "Mobile navigation"}>{links.map(link => <Link key={link.href} href={link.href} className={pathname === link.href ? "mobile-nav-link active" : "mobile-nav-link"}>{copy.nav[link.key]}</Link>)}</nav><div className="mobile-menu-footer"><span>{copy.location}</span><div className="mobile-menu-footer-actions"><SocialLinks className="mobile-menu-socials" /><a href={whatsappHref(contact.phones[0].wa, language)} target="_blank" rel="noopener noreferrer"><WhatsAppBrandIcon size={16} />WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a></div></div></div>}
    </header>
  );
}

export function WhatsAppFloat() {
  const { language } = useLanguage();
  return <a className="whatsapp-float" href={whatsappHref(contact.phones[0].wa, language)} target="_blank" rel="noopener noreferrer" aria-label={language === "fr" ? "Écrire un message préparé sur WhatsApp" : "Open a prepared message on WhatsApp"}><WhatsAppBrandIcon size={22} /><span>WhatsApp</span></a>;
}

export function Footer() {
  const { language } = useLanguage();
  const copy = ui[language];
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand"><BrandMark context="footer" loading="lazy" /><p>{copy.footer}</p></div>
        <div className="footer-contact"><span className="footer-label">{language === "fr" ? "Point de départ" : "Starting point"}</span><strong>{contact.city[language]}</strong>{contact.phones.map(phone => <a key={phone.wa} href={whatsappHref(phone.wa, language)} target="_blank" rel="noopener noreferrer">{phone.display}</a>)}</div>
        <div className="footer-contact"><span className="footer-label">{language === "fr" ? "Nous écrire" : "Write to us"}</span><a href={`mailto:${contact.email}`}>{contact.email}</a><Link href="/contact" className="footer-link">{copy.request}<ArrowUpRight size={16} aria-hidden="true" /></Link><SocialLinks /></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Trust Elite Travel</span><span>{copy.legal}</span></div>
    </footer>
  );
}
