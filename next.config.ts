import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const scriptSrc = `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  ...(!isDevelopment ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }] : []),
  { key: "Content-Security-Policy", value: ["default-src 'self'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self' mailto:", "object-src 'none'", scriptSrc, "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src 'self' https://fonts.gstatic.com data:", "img-src 'self' data: blob: https:", "connect-src 'self'", "frame-src https://www.google.com https://maps.google.com"].join("; ") },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 82],
    minimumCacheTTL: 86_400,
    localPatterns: [{ pathname: "/assets/**", search: "" }],
  },
  async headers() { return [{ source: "/:path*", headers: securityHeaders }]; },
};

export default nextConfig;
