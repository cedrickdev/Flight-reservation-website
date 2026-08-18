import type { Metadata } from "next";
import About from "@/pages/About";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez la vision et l’accompagnement humain de Trust Elite Travel, agence de voyage à Douala.",
  alternates: { canonical: "/a-propos" },
};

export default function Page() { return <About />; }
