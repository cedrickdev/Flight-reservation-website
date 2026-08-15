/** Direction L'Itinéraire d'Or: even a missing route offers an elegant route back to the main journey. */
import { ArrowLeft } from "lucide-react";import { Link } from "wouter";import { useLanguage } from "@/contexts/LanguageContext";
export default function NotFound(){const {language}=useLanguage();return <main className="not-found"><span>404</span><h1>{language==="fr"?"Cette escale n’existe pas.":"This stop does not exist."}</h1><Link href="/" className="button-primary"><ArrowLeft size={17}/>{language==="fr"?"Retour à l’accueil":"Back home"}</Link></main>}
