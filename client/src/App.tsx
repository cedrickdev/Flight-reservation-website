/** Persistent application shell with route-level code splitting for faster initial delivery. */
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { Footer, Header, WhatsAppFloat } from "./components/SiteChrome";
import Home from "./pages/Home";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const CHUNK_RECOVERY_KEY = "trust-elite-chunk-recovery";

type LazyPageModule = { default: React.ComponentType<any> };

function lazyWithRecovery(load: () => Promise<LazyPageModule>) {
  return lazy(async () => {
    try {
      const page = await load();
      if (typeof window !== "undefined") window.sessionStorage.removeItem(CHUNK_RECOVERY_KEY);
      return page;
    } catch (error) {
      if (typeof window !== "undefined" && !window.sessionStorage.getItem(CHUNK_RECOVERY_KEY)) {
        window.sessionStorage.setItem(CHUNK_RECOVERY_KEY, "1");
        window.location.reload();
      }
      throw error;
    }
  });
}

const Services = lazyWithRecovery(() => import("./pages/Services"));
const ServiceDetail = lazyWithRecovery(() => import("./pages/ServiceDetail"));
const About = lazyWithRecovery(() => import("./pages/About"));
const Contact = lazyWithRecovery(() => import("./pages/Contact"));
const NotFound = lazyWithRecovery(() => import("./pages/NotFound"));

function PageFallback() {
  return <div className="route-fallback" role="status" aria-live="polite">Chargement…</div>;
}

function RoutedPage({ children }: { children: React.ReactNode }) {
  return <div id="main-content"><Suspense fallback={<PageFallback />}>{children}</Suspense></div>;
}

function Router() {
  return <Switch>
    <Route path="/"><RoutedPage><Home /></RoutedPage></Route>
    <Route path="/services"><RoutedPage><Services /></RoutedPage></Route>
    <Route path="/services/:slug"><RoutedPage><ServiceDetail /></RoutedPage></Route>
    <Route path="/a-propos"><RoutedPage><About /></RoutedPage></Route>
    <Route path="/contact"><RoutedPage><Contact /></RoutedPage></Route>
    <Route><RoutedPage><NotFound /></RoutedPage></Route>
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><LanguageProvider><div className="app-shell"><Header /><Router /><WhatsAppFloat /><Footer /></div></LanguageProvider></ThemeProvider></ErrorBoundary>;
}
