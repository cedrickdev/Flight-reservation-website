import type { Metadata } from "next";
import Contact from "@/pages/Contact";

export const metadata: Metadata = {
  title: "Demander un devis voyage à Douala",
  description: "Préparez votre demande de billet, séjour, hôtel, assistance visa ou assurance voyage et contactez directement Trust Elite Travel.",
  alternates: { canonical: "/contact" },
};

export default function Page() { return <Contact />; }
