/** Persistent application shell with route-level code splitting for faster initial delivery. */
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { Header, Footer } from "./components/SiteChrome";
import Home from "./pages/Home";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><LanguageProvider><div className="app-shell"><Header /><Router /><Footer /></div></LanguageProvider></ThemeProvider></ErrorBoundary>;
}
