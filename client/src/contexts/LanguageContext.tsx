"use client";

/** Direction L'Itinéraire d'Or: bilingual interface changes language without interrupting the journey. */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Language } from "@/lib/content";
type Value = { language: Language; setLanguage: (language: Language) => void; toggleLanguage: () => void };
const LanguageContext = createContext<Value | null>(null);
export function LanguageProvider({ children }: { children: React.ReactNode }) { const [language,setLanguage]=useState<Language>("fr"); useEffect(()=>{const stored=window.localStorage.getItem("trust-elite-language");if(stored==="en")setLanguage("en")},[]); useEffect(()=>{document.documentElement.lang=language;window.localStorage.setItem("trust-elite-language",language)},[language]); const value=useMemo(()=>({language,setLanguage,toggleLanguage:()=>setLanguage(current=>current==="fr"?"en":"fr")}),[language]); return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider> }
export function useLanguage() { const context=useContext(LanguageContext); if(!context) throw new Error("useLanguage must be used within LanguageProvider"); return context; }
