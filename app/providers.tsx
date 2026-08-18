"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Footer, Header, WhatsAppFloat } from "@/components/SiteChrome";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <LanguageProvider>
        <div className="app-shell">
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
