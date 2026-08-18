import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trust Elite Travel",
    short_name: "Trust Elite",
    description: "Agence de voyage et billetterie à Douala.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2ea",
    theme_color: "#11110f",
    icons: [{ src: "/assets/logo-on-light.png", sizes: "485x512", type: "image/png" }],
  };
}
