import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layoutPath = new URL("../app/layout.tsx", import.meta.url);
const routePolishPath = new URL("../client/src/route-polish.css", import.meta.url);
const themeContextPath = new URL("../client/src/contexts/ThemeContext.tsx", import.meta.url);
const siteChromePath = new URL("../client/src/components/SiteChrome.tsx", import.meta.url);

test("the theme initializer uses Next Script before hydration", async () => {
  const source = await readFile(layoutPath, "utf8");

  assert.match(source, /import Script from ["']next\/script["']/);
  assert.match(source, /<Script id="theme-init" strategy="beforeInteractive">/);
  assert.doesNotMatch(source, /<script dangerouslySetInnerHTML=.*localStorage/);
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
  assert.match(chromeSource, /event\.key !== "Escape"/);
  assert.match(chromeSource, /document\.body\.style\.overflow = "hidden"/);
});
