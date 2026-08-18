import type { Metadata } from "next";
import Home from "@/pages/Home";

export const metadata: Metadata = {
  title: "Agence de voyage à Douala — billets, séjours et visa",
  description: "Billetterie, voyages, hôtels, assistance visa, assurance voyage et conciergerie à Douala : préparez votre prochain départ avec Trust Elite Travel.",
  alternates: { canonical: "/" },
};

export default function Page() { return <Home />; }
