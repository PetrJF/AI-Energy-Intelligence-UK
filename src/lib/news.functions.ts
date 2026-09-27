// Public read-side of the news system.
// All queries hit the `news_articles` table which has a public RLS policy
// (`status = 'published'`). We use the admin client here purely because it's
// available; RLS-safe reads with the publishable key would also work.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type NewsListItem = {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  source_name: string;
  source_domain: string;
  featured_image_url: string | null;
  published_at: string;
  reading_time_minutes: number;
  categories: string[];
  tags: string[];
  is_breaking: boolean;
  executive_summary: string;
};

export type NewsArticle = NewsListItem & {
  source_url: string;
  original_published_at: string | null;
  confidence_rating: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  analysis: {
    executive_summary?: string;
    why_it_matters?: string;
    impact_electricity_demand?: string;
    impact_energy_security?: string;
    impact_business?: string;
    impact_consumers?: string;
    long_term_implications?: string;
    quotations?: Array<{ text: string; attribution: string }>;
    related_technologies?: string[];
  };
  key_statistics: Array<{ label: string; value: string }>;
  related_hub_links: Array<{ title: string; href: string }>;
  faq: Array<{ question: string; answer: string }>;
};

import { isPubliclyPresentable } from "@/lib/news-quality";

/** Shared presentability check for a news item (list or detail). */
function presentable(item: {
  title: string;
  headline: string | null;
  executive_summary: string;
}): boolean {
  return isPubliclyPresentable({
    title: item.title,
    headline: item.headline,
    analysis: item.executive_summary,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListItem(row: any): NewsListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    headline: row.headline,
    source_name: row.source_name,
    source_domain: row.source_domain,
    featured_image_url: row.featured_image_url,
    published_at: row.published_at,
    reading_time_minutes: row.reading_time_minutes,
    categories: row.categories ?? [],
    tags: row.tags ?? [],
    is_breaking: row.is_breaking,
    executive_summary:
      (row.analysis && row.analysis.executive_summary) ||
      row.meta_description ||
      "",
  };
}

export const listNews = createServerFn({ method: "GET" })
  .inputValidator((data: { limit?: number; category?: string } | undefined) =>
    z
      .object({
        limit: z.number().int().min(1).max(60).optional(),
        category: z.string().optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("@/lib/supabase-public.server");
    const limit = data.limit ?? 24;
    let query = getPublicSupabase()
      .from("news_articles")
      .select(
        "id, slug, title, headline, source_name, source_domain, featured_image_url, published_at, reading_time_minutes, categories, tags, is_breaking, analysis, meta_description",
      )
      .eq("status", "published")
      .eq("review_status", "approved")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (data.category) query = query.contains("categories", [data.category]);
    const { data: rows, error } = await query;
    if (error) {
      console.error("[news] listNews failed", error);
      return { items: [] as NewsListItem[] };
    }
    return { items: (rows ?? []).map(toListItem).filter(presentable) };
  });

export const getNewsBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("@/lib/supabase-public.server");
    const { data: row, error } = await getPublicSupabase()
      .from("news_articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .eq("review_status", "approved")
      .maybeSingle();
    if (error) {
      console.error("[news] getNewsBySlug failed", error);
      return { article: null as NewsArticle | null, prev: null, next: null };
    }
    if (!row) return { article: null as NewsArticle | null, prev: null, next: null };
    // Hide retrieval-failure stubs from the article page too, not just lists.
    if (!presentable(toListItem(row)))
      return { article: null as NewsArticle | null, prev: null, next: null };

    // prev/next by published_at. Fetch a small window so stubs that would be
    // hidden from display (failed retrievals) are skipped rather than shown
    // as links that lead to "Story not found".
    const [{ data: prevRows }, { data: nextRows }] = await Promise.all([
      getPublicSupabase()
        .from("news_articles")
        .select("slug, title, headline, analysis, meta_description")
        .eq("status", "published")
        .eq("review_status", "approved")
        .lt("published_at", row.published_at)
        .order("published_at", { ascending: false })
        .limit(6),
      getPublicSupabase()
        .from("news_articles")
        .select("slug, title, headline, analysis, meta_description")
        .eq("status", "published")
        .eq("review_status", "approved")
        .gt("published_at", row.published_at)
        .order("published_at", { ascending: true })
        .limit(6),
    ]);

    const pickPresentable = (
      rows: Array<{
        slug: string;
        title: string;
        headline: string | null;
        analysis: unknown;
        meta_description: string | null;
      }> | null,
    ) =>
      (rows ?? []).find((r) =>
        presentable({
          title: r.title,
          headline: r.headline,
          executive_summary:
            (r.analysis as { executive_summary?: string } | null)?.executive_summary ||
            r.meta_description ||
            "",
        }),
      ) ?? null;

    const prevRow = pickPresentable(prevRows);
    const nextRow = pickPresentable(nextRows);

    const article: NewsArticle = {
      ...toListItem(row),
      source_url: row.source_url,
      original_published_at: row.original_published_at,
      confidence_rating: row.confidence_rating,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      og_image_url: row.og_image_url,
      analysis: (row.analysis ?? {}) as NewsArticle["analysis"],
      key_statistics: (row.key_statistics ?? []) as NewsArticle["key_statistics"],
      related_hub_links: (row.related_hub_links ?? []) as NewsArticle["related_hub_links"],
      faq: (row.faq ?? []) as NewsArticle["faq"],
    };

    return {
      article,
      prev: prevRow ? { slug: prevRow.slug, title: prevRow.title } : null,
      next: nextRow ? { slug: nextRow.slug, title: nextRow.title } : null,
    };
  });

// Related articles: same category, exclude current
export const getRelatedNews = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; categories: string[] }) =>
    z
      .object({
        slug: z.string(),
        categories: z.array(z.string()).max(5),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("@/lib/supabase-public.server");
    if (data.categories.length === 0) return { items: [] as NewsListItem[] };
    const { data: rows, error } = await getPublicSupabase()
      .from("news_articles")
      .select(
        "id, slug, title, headline, source_name, source_domain, featured_image_url, published_at, reading_time_minutes, categories, tags, is_breaking, analysis, meta_description",
      )
      .eq("status", "published")
      .eq("review_status", "approved")
      .neq("slug", data.slug)
      .overlaps("categories", data.categories)
      .order("published_at", { ascending: false })
      .limit(3);
    if (error) return { items: [] as NewsListItem[] };
    return { items: (rows ?? []).map(toListItem).filter(presentable) };
  });
