import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "@/index.css";
import "@/route-polish.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.trustelitetravels.com";
const description = "Agence de voyage à Douala pour vos billets d’avion, réservations d’hôtels, séjours, assistance visa, assurance voyage et conciergerie.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Trust Elite Travel — Agence de voyage à Douala", template: "%s | Trust Elite Travel" },
  description,
  keywords: ["agence de voyage Douala", "billetterie aérienne Cameroun", "assistance visa Douala", "réservation hôtel", "assurance voyage", "conciergerie voyage"],
  applicationName: "Trust Elite Travel",
  authors: [{ name: "Trust Elite Travel" }],
  creator: "Trust Elite Travel",
  publisher: "Trust Elite Travel",
  alternates: { canonical: "/" },
  icons: { icon: "/assets/logo-on-light.png", apple: "/assets/logo-on-light.png" },
  openGraph: {
    type: "website",
    locale: "fr_CM",
    alternateLocale: "en_CM",
    url: "/",
    siteName: "Trust Elite Travel",
    title: "Trust Elite Travel — Agence de voyage à Douala",
    description,
    images: [{ url: "/assets/hero.webp", width: 1600, height: 900, alt: "Trust Elite Travel" }],
  },
  twitter: { card: "summary_large_image", title: "Trust Elite Travel", description, images: ["/assets/hero.webp"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "travel",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#11110f", colorScheme: "dark light" };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Trust Elite Travel",
  url: siteUrl,
  logo: `${siteUrl}/assets/logo-on-light.png`,
  image: `${siteUrl}/assets/hero.webp`,
  email: "contact@trustelitetravels.com",
  telephone: "+237655449335",
  address: { "@type": "PostalAddress", streetAddress: "Makepe, face CNPS", addressLocality: "Douala", addressCountry: "CM" },
  areaServed: { "@type": "Country", name: "Cameroon" },
  sameAs: ["https://www.instagram.com/trust_elite_travel/", "https://www.tiktok.com/@trust.elite.trave"],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("theme")||"dark";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){document.documentElement.classList.add("dark")}`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
