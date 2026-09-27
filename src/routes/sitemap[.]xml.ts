import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { REPORTS, COLLECTIONS } from "@/data/reports";
import { regionSlug } from "@/lib/dc-projects";
import { RESEARCH_TOPICS } from "@/lib/research-topics";

import type { FileRoutesByTo } from "@/routeTree.gen";

const BASE_URL = "https://aienergyintelligence.co.uk";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

// Routes to exclude from the sitemap (private, admin, API, dynamic templates,
// dashboard sub-pages, or the sitemap itself).
const EXCLUDE_PREFIXES = [
  "/api",
  "/AIAdmin",
  "/dashboard",
  "/login",
  "/activity",
  "/favourites",
  "/notifications",
  "/saved-calculations",
  "/settings",
  "/report/",
  "/sitemap.xml",
  "/research",
];

// Per-route hints for changefreq / priority. Anything not listed falls back to
// sensible defaults for a leaf page.
const ROUTE_HINTS: Record<string, { changefreq: SitemapEntry["changefreq"]; priority: string }> = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/reports": { changefreq: "weekly", priority: "0.9" },
  "/blog": { changefreq: "weekly", priority: "0.8" },
  "/uk-ai-energy-index": { changefreq: "monthly", priority: "1.0" },
  "/uk-data-centre-tracker": { changefreq: "weekly", priority: "0.9" },
  "/uk-ai-energy-index/electricity-demand": { changefreq: "monthly", priority: "0.9" },
  "/uk-ai-energy-index/data-centre-growth": { changefreq: "monthly", priority: "0.8" },
  "/uk-ai-energy-index/grid-pressure": { changefreq: "monthly", priority: "0.8" },
  "/uk-ai-energy-index/methodology": { changefreq: "yearly", priority: "0.5" },
  "/news": { changefreq: "daily", priority: "0.8" },
  "/tools": { changefreq: "weekly", priority: "0.8" },
  "/hub": { changefreq: "weekly", priority: "0.7" },
  "/about": { changefreq: "yearly", priority: "0.5" },
  "/contact": { changefreq: "yearly", priority: "0.5" },
  "/privacy": { changefreq: "yearly", priority: "0.3" },
  "/terms": { changefreq: "yearly", priority: "0.3" },
  "/refunds": { changefreq: "yearly", priority: "0.3" },
  "/editorial-team": { changefreq: "yearly", priority: "0.5" },
  "/editorial-standards": { changefreq: "yearly", priority: "0.5" },
  "/corrections": { changefreq: "yearly", priority: "0.4" },
  "/research-methodology": { changefreq: "yearly", priority: "0.5" },
  "/ai-use-and-conflicts": { changefreq: "yearly", priority: "0.4" },
};

function hintFor(path: string): { changefreq: SitemapEntry["changefreq"]; priority: string } {
  if (ROUTE_HINTS[path]) return ROUTE_HINTS[path];
  // Section index pages (single-segment) get higher priority than deep leaves.
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 1) return { changefreq: "weekly", priority: "0.8" };
  return { changefreq: "monthly", priority: "0.7" };
}

function collectStaticRoutes(): SitemapEntry[] {
  // FileRoutesByTo is a generated type; at runtime we don't have the keys, so
  // we can't reflect over it. Instead we build the list from the generated
  // route paths by scanning `import.meta.glob` of the routes directory.
  const modules = import.meta.glob("/src/routes/**/*.{ts,tsx}", { eager: false });
  const paths = new Set<string>();

  for (const file of Object.keys(modules)) {
    // Strip base and extension: /src/routes/foo.bar.tsx -> foo.bar
    let name = file.replace(/^\/src\/routes\//, "").replace(/\.(tsx|ts)$/, "");

    // Skip API routes, admin, dashboard, root layout, sitemap, and dynamic
    // segments — those are covered separately or aren't user-facing.
    if (
      name.startsWith("api/") ||
      name.startsWith("AIAdmin") ||
      name.startsWith("dashboard") ||
      name === "__root" ||
      name.startsWith("sitemap") ||
      name.includes("$") ||
      name === "login"
    ) {
      continue;
    }

    // Folder-style filenames use "/"; flat-style uses ".". Normalise both.
    name = name.replace(/\//g, ".");
    // Strip trailing ".index" and bare "index".
    name = name.replace(/\.index$/, "");
    if (name === "index") name = "";
    // Dots → slashes for the final URL path.
    const path = "/" + name.split(".").filter(Boolean).join("/");
    paths.add(path === "//" ? "/" : path);
  }

  const filtered = Array.from(paths).filter(
    (p) => !EXCLUDE_PREFIXES.some((prefix) => (prefix === p ? true : p.startsWith(prefix + "/") || p === prefix)),
  );

  filtered.sort();
  return filtered.map((path) => ({ path, ...hintFor(path) }));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = collectStaticRoutes();

        // Reports (from src/data/reports.ts) — static content, but keeping the
        // lastmod from publishedAt so the sitemap reflects real page dates.
        const reportEntries: SitemapEntry[] = [
          // Category views are filtered variants of /reports, not distinct
          // canonical pages, so they are deliberately not listed.

          ...REPORTS.map((r) => ({
            path: `/reports/${r.slug}`,
            changefreq: "monthly" as const,
            priority: r.tier === "free" ? "0.8" : "0.7",
            lastmod: r.publishedAt,
          })),
          ...COLLECTIONS.map((c) => ({
            path: `/collections/${c.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];

        // Research topic landing pages (filtered views over existing content).
        const researchTopicEntries: SitemapEntry[] = RESEARCH_TOPICS.map((t) => ({
          path: `/research/${t.slug}`,
          changefreq: "weekly" as const,
          priority: "0.7",
        }));


        // Dynamic: blog posts and news articles pulled live from the DB.
        const dynamicEntries: SitemapEntry[] = [];
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const [blogRes, newsRes, dcRes] = await Promise.all([
            supabaseAdmin
              .from("blog_posts")
              .select("slug, updated_at, published_at")
              .eq("status", "published")
              .order("published_at", { ascending: false })
              .limit(1000),
            supabaseAdmin
              .from("news_articles")
              .select("slug, updated_at, published_at, title, headline, analysis")
              .eq("status", "published")
              .eq("review_status", "approved")
              .order("published_at", { ascending: false })
              .limit(1000),
            supabaseAdmin
              .from("dc_projects")
              .select("slug, updated_at, region, project_type")
              .eq("status_publication", "published")
              .limit(1000),
          ]);

          const dcRegions = new Set<string>();
          let hasGrowthZones = false;
          for (const d of dcRes.data ?? []) {
            dynamicEntries.push({
              path: `/uk-data-centre-tracker/${(d as any).slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: (d as any).updated_at ?? undefined,
            });
            if ((d as any).project_type === "growth_zone") {
              hasGrowthZones = true;
              dynamicEntries.push({
                path: `/ai-growth-zones/${(d as any).slug}`,
                changefreq: "monthly",
                priority: "0.7",
                lastmod: (d as any).updated_at ?? undefined,
              });
            }
            if ((d as any).region) dcRegions.add((d as any).region as string);
          }

          if (hasGrowthZones) {
            dynamicEntries.push({
              path: "/ai-growth-zones",
              changefreq: "weekly",
              priority: "0.8",
            });
          }


          if (dcRegions.size > 0) {
            dynamicEntries.push({
              path: "/uk-data-centre-tracker/regions",
              changefreq: "monthly",
              priority: "0.7",
            });
          }
          for (const region of dcRegions) {
            dynamicEntries.push({
              path: `/uk-data-centre-tracker/regions/${regionSlug(region)}`,
              changefreq: "monthly",
              priority: "0.6",
            });
          }


          for (const p of blogRes.data ?? []) {
            dynamicEntries.push({
              path: `/blog/${(p as any).slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: (p as any).updated_at ?? (p as any).published_at ?? undefined,
            });
          }
          const { isPubliclyPresentable } = await import("@/lib/news-quality");
          const presentableNews = (newsRes.data ?? []).filter((n: any) =>
            isPubliclyPresentable({
              title: n.title,
              headline: n.headline,
              analysis: n.analysis?.executive_summary ?? null,
            }),
          );
          for (const n of presentableNews) {
            dynamicEntries.push({
              path: `/news/${(n as any).slug}`,
              changefreq: "weekly",
              priority: "0.6",
              lastmod: (n as any).updated_at ?? (n as any).published_at ?? undefined,
            });
          }
        } catch (err) {
          console.error("[sitemap] dynamic entries fetch failed", err);
        }

        const allEntries = [...staticEntries, ...reportEntries, ...researchTopicEntries, ...dynamicEntries];

        const urls = allEntries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

// Silence unused-type warning; FileRoutesByTo is imported for future use.
export type _FileRoutesByTo = FileRoutesByTo;
