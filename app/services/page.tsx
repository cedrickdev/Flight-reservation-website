import type { Metadata } from "next";
import Services from "@/pages/Services";

export const metadata: Metadata = {
  title: "Services de voyage",
  description: "Découvrez les services de Trust Elite Travel : billets d’avion, hôtels, assistance visa, séjours, assurance, conciergerie et coaching cabin crew.",
  alternates: { canonical: "/services" },
};

export default function Page() { return <Services />; }
