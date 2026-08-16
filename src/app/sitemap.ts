import type { MetadataRoute } from "next";
import { GALLERIES } from "@/lib/content/galleries";
import { SITE_URL } from "@/lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const galleryEntries: MetadataRoute.Sitemap = GALLERIES.map((g) => ({
    url: `${SITE_URL}/${g.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    ...galleryEntries,
    { url: `${SITE_URL}/processions`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/mostra-auschwitz`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/mostra-jazz`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/mostra-storie`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
