import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dhyanfoundationguwahati.org";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/donate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/astrology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/profile`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
  ];
}
