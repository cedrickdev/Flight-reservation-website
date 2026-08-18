import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layoutPath = new URL("../app/layout.tsx", import.meta.url);
const routePolishPath = new URL("../client/src/route-polish.css", import.meta.url);
const themeContextPath = new URL("../client/src/contexts/ThemeContext.tsx", import.meta.url);
const siteChromePath = new URL("../client/src/components/SiteChrome.tsx", import.meta.url);
const brandIconsPath = new URL("../client/src/components/BrandIcons.tsx", import.meta.url);
const homePath = new URL("../client/src/pages/Home.tsx", import.meta.url);
const aboutPath = new URL("../client/src/pages/About.tsx", import.meta.url);
const aboutPortraitPath = new URL("../public/assets/about-founder.webp", import.meta.url);
const requestStepperPath = new URL("../client/src/components/RequestStepper.tsx", import.meta.url);
const requestFieldsPath = new URL("../client/src/lib/requestFields.ts", import.meta.url);
const contactRoutePath = new URL("../app/api/contact/route.ts", import.meta.url);
const nextConfigPath = new URL("../next.config.ts", import.meta.url);
const envExamplePath = new URL("../.env.example", import.meta.url);
const serviceDetailPath = new URL("../client/src/pages/ServiceDetail.tsx", import.meta.url);

test("the theme renders deterministically and restores persistence after hydration", async () => {
  const [layoutSource, themeSource] = await Promise.all([
    readFile(layoutPath, "utf8"),
    readFile(themeContextPath, "utf8"),
  ]);

  assert.match(layoutSource, /<html lang="fr" className="dark" suppressHydrationWarning>/);
  assert.doesNotMatch(layoutSource, /next\/script|theme-init|localStorage/);
  assert.match(themeSource, /useState<Theme>\(defaultTheme\)/);
  assert.match(themeSource, /localStorage\.getItem\("theme"\)/);
  assert.match(themeSource, /if \(!hydrated\) return/);
});

test("the JSON-LD block remains non-executable structured data", async () => {
  const source = await readFile(layoutPath, "utf8");

  assert.match(source, /<script type="application\/ld\+json"/);
});

test("the office portrait keeps its intrinsic ratio without clipping", async () => {
  const source = await readFile(routePolishPath, "utf8");
  const portraitRules = source.slice(source.indexOf("/* Keep the supplied portrait photo complete"));

  assert.match(portraitRules, /\.image-statement-photo\s*\{[^}]*margin:\s*0\s*!important;[^}]*overflow:\s*visible;/s);
  assert.match(portraitRules, /\.image-statement-photo\s*>\s*picture\s*\{[^}]*width:\s*min\(100%,\s*470px\);[^}]*aspect-ratio:\s*auto\s*!important;/s);
  assert.match(portraitRules, /\.image-statement-photo\s*>\s*picture\s*>\s*img\s*\{[^}]*height:\s*auto\s*!important;[^}]*aspect-ratio:\s*auto\s*!important;[^}]*object-fit:\s*contain\s*!important;/s);
  assert.doesNotMatch(portraitRules, /margin-left:\s*calc\(/);
});

test("the about portrait uses the supplied local asset at its native ratio", async () => {
  const [aboutSource, cssSource, portrait] = await Promise.all([
    readFile(aboutPath, "utf8"),
    readFile(routePolishPath, "utf8"),
    readFile(aboutPortraitPath),
  ]);

  assert.equal(portrait.subarray(0, 4).toString(), "RIFF");
  assert.equal(portrait.subarray(8, 12).toString(), "WEBP");
  assert.match(aboutSource, /src=\{assets\.aboutFounder\}/);
  assert.match(aboutSource, /width=\{1200\}\s+height=\{1600\}/);
  assert.match(cssSource, /\.principles-image\s*\{[^}]*aspect-ratio:3 \/ 4;/s);
  assert.match(cssSource, /\.principles-image img\s*\{[^}]*border-radius:14px;[^}]*object-fit:cover;/s);
});

test("the form actions have no separator above the navigation buttons", async () => {
  const source = await readFile(routePolishPath, "utf8");

  assert.match(source, /\.request-stepper \.stepper-actions\s*\{[^}]*border-top:0;/s);
});

test("the site chrome and future founder photo slot use compact proportions", async () => {
  const [cssSource, stepperSource] = await Promise.all([
    readFile(routePolishPath, "utf8"),
    readFile(requestStepperPath, "utf8"),
  ]);
  const compactRules = cssSource.slice(cssSource.indexOf("/* Compact site chrome"));

  assert.match(compactRules, /\.site-header\s*\{[^}]*height:64px;/s);
  assert.match(compactRules, /@media \(max-width:760px\)[\s\S]*\.site-header\s*\{[^}]*height:60px;/s);
  assert.match(compactRules, /\.team-photo-placeholder\s*\{[^}]*width:min\(100%,380px\);[^}]*min-height:300px;/s);
  assert.match(stepperSource, /window\.innerWidth <= 760 \? 60 : 64/);
});

test("polish safeguards keep content visible and dark heroes legible", async () => {
  const source = await readFile(routePolishPath, "utf8");

  assert.match(source, /@keyframes section-rise\s*\{\s*from\s*\{\s*opacity:\s*1;/);
  assert.match(source, /\.detail-hero \.detail-content h1\s*\{[^}]*color:\s*#fffaf0;/s);
  assert.match(source, /\.whatsapp-float\s*\{[^}]*position:\s*fixed;/s);
});

test("theme persistence and the mobile menu wait for hydration and support Escape", async () => {
  const [themeSource, chromeSource] = await Promise.all([
    readFile(themeContextPath, "utf8"),
    readFile(siteChromePath, "utf8"),
  ]);

  assert.match(themeSource, /const \[hydrated, setHydrated\] = useState\(false\)/);
  assert.match(themeSource, /if \(!hydrated\) return/);
  assert.match(chromeSource, /event\.key === "Escape"/);
  assert.match(chromeSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(chromeSource, /event\.key !== "Tab"/);
  assert.match(chromeSource, /aria-modal="true"/);
});

test("the hero keeps trajectoire indivisible around the inline globe", async () => {
  const [homeSource, cssSource] = await Promise.all([
    readFile(homePath, "utf8"),
    readFile(routePolishPath, "utf8"),
  ]);

  assert.match(homeSource, /className="hero-trajectory-word">traject/);
  assert.match(cssSource, /\.hero-trajectory-word\s*\{[^}]*white-space:\s*nowrap;[^}]*word-break:\s*keep-all;/s);
  assert.match(cssSource, /\.hero-image\s*\{[^}]*object-position:71% center;/s);
  assert.match(cssSource, /\.hero-content\s*\{[^}]*margin-bottom:clamp\(155px,20vh,180px\);/s);
  assert.match(cssSource, /\.hero-heading-line\s*\{[^}]*hyphens:none;[^}]*word-break:normal;/s);
  assert.match(cssSource, /\.hero-globe-letter\s*\{[^}]*width:1em;[^}]*height:1em;/s);
});

test("mobile navigation and about cards remain legible in both themes", async () => {
  const source = await readFile(routePolishPath, "utf8");

  assert.match(source, /html:not\(\.dark\) \.mobile-menu\s*\{[^}]*color:#11110f;[^}]*background:#f6f2ea;/s);
  assert.match(source, /html\.dark \.about-differentiators \.section-heading h2\s*\{[^}]*color:#f6f2ea;/s);
  assert.match(source, /html:not\(\.dark\) \.about-differentiators \.section-heading h2\s*\{[^}]*color:#11110f;/s);
  assert.match(source, /\.differentiator-card\s*\{[^}]*border-radius:14px;/s);
});

test("the global footer exposes real Instagram, TikTok and Facebook icons", async () => {
  const [chromeSource, iconSource] = await Promise.all([
    readFile(siteChromePath, "utf8"),
    readFile(brandIconsPath, "utf8"),
  ]);

  assert.match(chromeSource, /socialLinks\.instagram/);
  assert.match(chromeSource, /socialLinks\.tiktok/);
  assert.match(chromeSource, /socialLinks\.facebook/);
  assert.match(chromeSource, /<FacebookBrandIcon size=\{24\}/);
  assert.match(iconSource, /export function FacebookBrandIcon/);
});

test("the contact stepper sends every field to the same-origin email endpoint", async () => {
  const source = await readFile(requestStepperPath, "utf8");

  assert.match(source, /fetch\("\/api\/contact"/);
  assert.match(source, /JSON\.stringify\(\{ \.\.\.data, language \}\)/);
  assert.match(source, /scrollIntoView\(\{ behavior:/);
  assert.match(source, /window\.scrollTo\(\{ top: Math\.max\(0, top\)/);
  assert.match(source, /activeStepHeadingRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /<legend ref=\{activeStepHeadingRef\} tabIndex=\{-1\}>/);
  assert.match(source, /validateStep\(data, step, language\)/);
  assert.match(source, /activeFlow\.fields\.filter/);
  assert.match(source, /serviceDetails: getInitialServiceDetails\(service\)/);
  assert.doesNotMatch(source, /window\.open\(/);
});

test("every service has a dedicated request flow and air ticketing uses flight fields", async () => {
  const source = await readFile(requestFieldsPath, "utf8");

  for (const slug of ["billets", "hotels", "visa", "packages", "assurance", "conciergerie", "coaching"]) {
    assert.match(source, new RegExp(`\\b${slug}: \\{`));
  }
  assert.match(source, /key: "tripType"/);
  assert.match(source, /key: "cabinClass"/);
  assert.match(source, /key: "infants"/);
  assert.match(source, /adults \+ children \+ infants > 9/);
  assert.match(source, /key: "roomPreference"/);
  assert.match(source, /key: "childAges"[\s\S]*nonZero: true/);
  assert.match(source, /key: "routeDetails"[\s\S]*when: \{ field: "tripType", values: \["multiCity"\] \}/);
  assert.match(source, /validateRequestDetails/);
  assert.doesNotMatch(source, /passportNumber|numéro de passeport.*type: "text"/i);
});

test("the contact endpoint validates requests and sends two branded structured emails through Resend", async () => {
  const [source, envSource] = await Promise.all([
    readFile(contactRoutePath, "utf8"),
    readFile(envExamplePath, "utf8"),
  ]);

  assert.match(source, /normalizePayload/);
  assert.match(source, /isRateLimited/);
  assert.match(source, /https:\/\/api\.resend\.com\/emails\/batch/);
  assert.match(source, /reply_to:\s*payload\.email/);
  assert.match(source, /to:\s*\[payload\.email\]/);
  assert.match(source, /confirmationSent:\s*true/);
  assert.match(source, /logo-on-dark\.png/);
  assert.match(source, /serviceRequestFlows\[payload\.service\]/);
  assert.match(source, /Détails de la demande/);
  assert.match(source, /Coordonnées/);
  assert.match(envSource, /RESEND_API_KEY=re_x{20,}/);
});

test("Next.js optimizes all primary page imagery with responsive formats and sizes", async () => {
  const [homeSource, aboutSource, detailSource, chromeSource, configSource] = await Promise.all([
    readFile(homePath, "utf8"),
    readFile(aboutPath, "utf8"),
    readFile(serviceDetailPath, "utf8"),
    readFile(siteChromePath, "utf8"),
    readFile(nextConfigPath, "utf8"),
  ]);

  for (const source of [homeSource, aboutSource, detailSource, chromeSource]) {
    assert.match(source, /from "next\/image"/);
    assert.doesNotMatch(source, /<img\b/);
  }
  assert.match(homeSource, /preload/);
  assert.match(homeSource, /sizes="100vw"/);
  assert.match(configSource, /formats:\s*\["image\/avif", "image\/webp"\]/);
  assert.match(configSource, /localPatterns:/);
});
