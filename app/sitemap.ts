import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";

  return ["", "/jobs", "/internships", "/companies", "/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
