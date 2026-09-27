// Shared Open Graph / Twitter Card preview images.
// Absolute URLs are required for social crawlers.
import ogDefault from "@/assets/og-default.jpg.asset.json";
import ogTools from "@/assets/og-tools.jpg.asset.json";
import ogReports from "@/assets/og-reports.jpg.asset.json";

const SITE = "https://aienergyintelligence.co.uk";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path}`);

export const OG_DEFAULT = abs(ogDefault.url);
export const OG_TOOLS = abs(ogTools.url);
export const OG_REPORTS = abs(ogReports.url);

/** Meta tags for og:image + twitter:image. Spread into a route's `meta` array. */
export function ogImageMeta(url: string) {
  return [
    { property: "og:image", content: url },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    { name: "twitter:image", content: url },
  ];
}
