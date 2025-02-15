import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Applebot", "Bingbot", "Yeti"],
        allow: ["/"],
      },
    ],
    sitemap: "https://ai-trend-now.stream/sitemap.xml",
  };
}
