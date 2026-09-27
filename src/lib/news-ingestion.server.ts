// Server-only news ingestion pipeline.
// Uses Firecrawl to search trusted UK sources and Lovable AI to analyse each article.
// Called from a public cron endpoint (twice-daily) — never from the client.

import Firecrawl from "@mendable/firecrawl-js";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { failedRetrievalReason } from "@/lib/news-quality";

// ---------------------------------------------------------------
// Trusted sources (allow-list). Firecrawl results are filtered
// against these domains — anything else is dropped.
// ---------------------------------------------------------------
export const TRUSTED_DOMAINS: readonly string[] = [
  // UK Government / regulators
  "gov.uk", "ofgem.gov.uk", "nationalgrideso.com", "neso.energy",
  "nationalgrid.com", "parliament.uk", "ons.gov.uk", "theccc.org.uk",
  // Energy think-tanks / bodies
  "iea.org", "ember-energy.org", "ember-climate.org", "es.catapult.org.uk",
  // Major UK / global press
  "bbc.co.uk", "bbc.com", "reuters.com", "ft.com", "theguardian.com",
  "news.sky.com", "sky.com", "thetimes.co.uk", "thetimes.com",
  "telegraph.co.uk", "bloomberg.com",
  // Tech / infra press
  "techcrunch.com", "theregister.com", "datacenterdynamics.com",
  "computerweekly.com", "datacentrenews.uk", "capacitymedia.com", "itpro.com",
  // UK energy trade press
  "utilityweek.co.uk", "current-news.co.uk", "energylivenews.com",
  // Regional business press (tier 3 — AI Growth Zone coverage)
  "businessnewswales.com", "insidermedia.com", "thebusinessdesk.com",
  // Official newsrooms
  "news.microsoft.com", "blog.google", "aboutamazon.com",
  "aboutamazon.co.uk", "openai.com", "nvidia.com", "newsroom.arm.com", "arm.com",
];

const SEARCH_TOPICS: readonly string[] = [
  "UK AI electricity demand",
  "UK data centre energy consumption",
  "National Grid AI infrastructure UK",
  "NESO AI data centre grid capacity",
  "Ofgem AI energy",
  "DESNZ AI policy UK",
  "UK AI Growth Zones electricity",
  "UK grid constraints data centre",
  "UK renewable energy AI data centre",
  "Small Modular Reactor UK AI data centre",
  "UK data centre investment hyperscale",
  "Microsoft UK data centre AI",
  "Google UK data centre",
  "AWS UK data centre energy",
  "battery storage UK grid AI",
  "UK electricity market reform AI",
];

export const CATEGORIES = [
  "AI Infrastructure", "Data Centres", "Electricity Demand", "UK Energy Policy",
  "National Grid", "Grid Capacity", "Energy Security", "Renewable Energy",
  "Nuclear", "Battery Storage", "AI Regulation", "Cloud Computing",
  "Investment", "Technology", "Market Analysis",
] as const;

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isTrusted(url: string): boolean {
  const host = domainOf(url);
  if (!host) return false;
  return TRUSTED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function hashUrl(url: string): string {
  return createHash("sha256").update(url.toLowerCase()).digest("hex").slice(0, 32);
}

// Minimum confidence the AI analysis must report before a story is published.
const MIN_CONFIDENCE = 0.5;

// ---------------------------------------------------------------
// Source-quality tiers
//   1 = official / regulator / primary research — auto-approve
//   2 = established press & specialist trade press — auto-approve
//   3 = anything else on the allow-list — hold for editorial review
// ---------------------------------------------------------------
const TIER_1_DOMAINS: readonly string[] = [
  "gov.uk", "ofgem.gov.uk", "nationalgrideso.com", "neso.energy",
  "nationalgrid.com", "parliament.uk", "ons.gov.uk", "theccc.org.uk",
  "iea.org", "ember-energy.org", "ember-climate.org", "es.catapult.org.uk",
];

const TIER_2_DOMAINS: readonly string[] = [
  "bbc.co.uk", "bbc.com", "reuters.com", "ft.com", "theguardian.com",
  "news.sky.com", "sky.com", "thetimes.co.uk", "thetimes.com",
  "telegraph.co.uk", "bloomberg.com", "techcrunch.com", "theregister.com",
  "datacenterdynamics.com",
  // Specialist data-centre / tech trade press
  "computerweekly.com", "datacentrenews.uk", "capacitymedia.com", "itpro.com",
  // UK energy trade press
  "utilityweek.co.uk", "current-news.co.uk", "energylivenews.com",
];

function matchesDomain(host: string, list: readonly string[]): boolean {
  return list.some((d) => host === d || host.endsWith(`.${d}`));
}

export function sourceTier(url: string): 1 | 2 | 3 {
  const host = domainOf(url);
  if (matchesDomain(host, TIER_1_DOMAINS)) return 1;
  if (matchesDomain(host, TIER_2_DOMAINS)) return 2;
  return 3;
}

// ---------------------------------------------------------------
// Unsuitable-content rules — vacancies, paywalls, error/inaccessible pages
// ---------------------------------------------------------------
const URL_REJECT_PATTERNS: readonly RegExp[] = [
  /\/(jobs?|vacanc(y|ies)|careers?|recruit(ment)?|hiring|apprenticeship)s?(\/|$|\?)/i,
  /\/(tag|tags|topic|topics|author|authors|category|categories|search|newsletter|subscribe|privacy|terms|cookie)s?(\/|$|\?)/i,
  /\/(login|sign-?in|register|account|contact|about)(\/|$|\?)/i,
  /\.(pdf|zip|xlsx?|docx?|pptx?)(\?|$)/i,
];

const TITLE_REJECT_PATTERNS: readonly RegExp[] = [
  /\b(job|vacanc(y|ies)|career|hiring|we'?re recruiting|apply now|graduate scheme|apprenticeship)\b/i,
  /\b(404|page not found|not found|access denied|forbidden|error)\b/i,
  /\b(sign in|subscribe to (read|continue)|register to continue)\b/i,
];

const BODY_REJECT_PATTERNS: readonly RegExp[] = [
  /subscribe to (read|continue|unlock)/i,
  /this (article|content) is for subscribers/i,
  /\b(sign in|log in) to (read|continue|keep reading)/i,
  /you have reached your (free )?article limit/i,
  /enable javascript( and cookies)? to continue/i,
  /(are you a robot|verify you are (a )?human|checking your browser|access to this page has been denied)/i,
  /\b(404|page not found|this page (no longer exists|isn'?t available))\b/i,
  /apply for this (job|role|vacancy)/i,
  /(salary|closing date for applications)\s*[::]/i,
];

/**
 * Returns a rejection reason when the candidate is not a suitable news story,
 * or null when it passes. Applied to URL, title and (when scraped) body text.
 */
export function unsuitableReason(input: {
  url: string;
  title?: string;
  markdown?: string;
}): string | null {
  if (URL_REJECT_PATTERNS.some((re) => re.test(input.url))) {
    return "URL looks like a vacancy, index or non-article page";
  }
  const title = input.title ?? "";
  if (title && TITLE_REJECT_PATTERNS.some((re) => re.test(title))) {
    return "Headline indicates a vacancy, error or paywall page";
  }
  const body = (input.markdown ?? "").slice(0, 6000);
  if (body) {
    if (body.trim().length < 600) return "Page content too short to be a full article";
    const hit = BODY_REJECT_PATTERNS.find((re) => re.test(body));
    if (hit) return "Page body indicates a paywall, error or vacancy listing";
  }
  return null;
}

// Story-level near-duplicate detection: two outlets covering the same story
// produce different URLs but very similar headlines. Compare normalised
// significant words against recent articles.
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "as",
  "at", "by", "from", "is", "are", "be", "will", "its", "it", "that", "this",
  "uk", "new", "says", "after", "over", "amid", "into",
]);

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

function titleSimilarity(a: string, b: string): number {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return shared / Math.min(ta.size, tb.size);
}

async function isNearDuplicateStory(title: string): Promise<boolean> {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabaseAdmin
    .from("news_articles")
    .select("title, headline")
    .gte("published_at", since)
    .limit(200);
  return (data ?? []).some(
    (r) =>
      titleSimilarity(title, r.title ?? "") >= 0.7 ||
      titleSimilarity(title, r.headline ?? "") >= 0.7,
  );
}


// ---------------------------------------------------------------
// Lovable AI Gateway — analyse a single article
// ---------------------------------------------------------------
type AnalysisResult = {
  headline: string;
  executive_summary: string;
  why_it_matters: string;
  impact_electricity_demand: string;
  impact_energy_security: string;
  impact_business: string;
  impact_consumers: string;
  long_term_implications: string;
  key_statistics: Array<{ label: string; value: string }>;
  quotations: Array<{ text: string; attribution: string }>;
  related_technologies: string[];
  categories: string[];
  tags: string[];
  is_uk_focused: boolean;
  confidence_rating: number;
  meta_title: string;
  meta_description: string;
  faq: Array<{ question: string; answer: string }>;
};

const AI_SYSTEM_PROMPT = `You are the senior editor for AI Energy Intelligence UK, an independent research publication covering AI infrastructure and the UK energy system. You never invent facts, statistics, or quotations. You use British English throughout. If a fact is not clearly stated in the source, you omit it. You clearly distinguish reporting (what the source says) from analysis (implications). All analysis must be grounded in the provided source text.`;

async function analyseArticle(input: {
  title: string;
  sourceName: string;
  sourceUrl: string;
  markdown: string;
}): Promise<AnalysisResult | null> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");

  // Trim the source to keep prompt cost predictable
  const content = input.markdown.slice(0, 12000);

  const userPrompt = `Analyse the following news article for a UK audience interested in AI infrastructure and the energy system.

Article title: ${input.title}
Source: ${input.sourceName} (${input.sourceUrl})

---
${content}
---

Return JSON matching this schema exactly. Every field is required; use empty strings or empty arrays where you have no grounded content. Do not fabricate statistics or quotations.

{
  "headline": "punchy UK-focused rewrite of the headline, max 90 chars",
  "executive_summary": "2-3 sentence plain-English summary, British English",
  "why_it_matters": "1 short paragraph on why this matters for UK AI/energy readers",
  "impact_electricity_demand": "1 short paragraph (or empty string if not applicable)",
  "impact_energy_security": "1 short paragraph (or empty string)",
  "impact_business": "1 short paragraph (or empty string)",
  "impact_consumers": "1 short paragraph (or empty string)",
  "long_term_implications": "1 short paragraph",
  "key_statistics": [{"label": "short label", "value": "figure with unit exactly as stated in source"}],
  "quotations": [{"text": "direct quote as it appears", "attribution": "who said it"}],
  "related_technologies": ["short strings"],
  "categories": ["one or more of: AI Infrastructure, Data Centres, Electricity Demand, UK Energy Policy, National Grid, Grid Capacity, Energy Security, Renewable Energy, Nuclear, Battery Storage, AI Regulation, Cloud Computing, Investment, Technology, Market Analysis"],
  "tags": ["3-8 short topic tags"],
  "is_uk_focused": true,
  "confidence_rating": 0.85,
  "meta_title": "SEO title max 60 chars including 'UK'",
  "meta_description": "SEO description max 155 chars",
  "faq": [{"question": "concise Q", "answer": "grounded A"}]
}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[news-ingest] AI gateway ${res.status}: ${body}`);
    return null;
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch (e) {
    console.error("[news-ingest] AI returned non-JSON", raw.slice(0, 200));
    return null;
  }
}

// ---------------------------------------------------------------
// Ensure slug uniqueness (append -2, -3 ... on collision)
// ---------------------------------------------------------------
async function uniqueSlug(base: string): Promise<string> {
  const seed = slugify(base) || "article";
  for (let i = 0; i < 6; i++) {
    const candidate = i === 0 ? seed : `${seed}-${i + 1}`;
    const { data } = await supabaseAdmin
      .from("news_articles")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `${seed}-${Date.now()}`;
}

// ---------------------------------------------------------------
// Hub link suggestions based on categories
// ---------------------------------------------------------------
function suggestHubLinks(categories: string[]): Array<{ title: string; href: string }> {
  const links: Array<{ title: string; href: string }> = [];
  const cats = new Set(categories);
  if (cats.has("Electricity Demand") || cats.has("AI Infrastructure")) {
    links.push({ title: "AI Electricity Cost Calculator", href: "/energy-cost/ai-electricity-cost-calculator" });
  }
  if (cats.has("Data Centres") || cats.has("Cloud Computing")) {
    links.push({ title: "Data Centre Demand Calculator", href: "/infrastructure/data-centre-demand-calculator" });
  }
  if (cats.has("National Grid") || cats.has("Grid Capacity")) {
    links.push({ title: "AI Grid Impact Forecast", href: "/infrastructure/ai-grid-impact-forecast" });
  }
  if (cats.has("UK Energy Policy") || cats.has("AI Regulation")) {
    links.push({ title: "AI Growth Zone Impact", href: "/infrastructure/ai-growth-zone-impact" });
  }
  if (cats.has("Investment") || cats.has("Market Analysis")) {
    links.push({ title: "AI ROI Calculator", href: "/business/ai-roi-calculator" });
  }
  if (links.length === 0) {
    links.push(
      { title: "Explore AI energy calculators", href: "/ai-energy-calculators" },
      { title: "Analysis & Research", href: "/blog" },
    );
  }
  return links.slice(0, 4);
}

// ---------------------------------------------------------------
// Main entry — run a full ingestion pass
// ---------------------------------------------------------------
export type IngestionSummary = {
  runId: string;
  status: "success" | "partial" | "error";
  topicsSearched: number;
  candidatesFound: number;
  published: number;
  skippedDuplicate: number;
  skippedUntrusted: number;
  skippedUnsuitable?: number;
  heldForReview?: number;
  error?: string;

};

export async function runNewsIngestion(options?: {
  maxArticles?: number;
  topicsPerRun?: number;
}): Promise<IngestionSummary> {
  const maxArticles = options?.maxArticles ?? 6;
  const topicsPerRun = options?.topicsPerRun ?? 5;

  const fcKey = process.env.FIRECRAWL_API_KEY;
  if (!fcKey) {
    return {
      runId: "",
      status: "error",
      topicsSearched: 0,
      candidatesFound: 0,
      published: 0,
      skippedDuplicate: 0,
      skippedUntrusted: 0,
      error: "FIRECRAWL_API_KEY not configured",
    };
  }

  // Start ingestion run log
  const { data: run, error: runErr } = await supabaseAdmin
    .from("news_ingestion_runs")
    .insert({ status: "running" })
    .select("id")
    .single();
  if (runErr || !run) {
    console.error("[news-ingest] failed to create run row", runErr);
    return {
      runId: "",
      status: "error",
      topicsSearched: 0,
      candidatesFound: 0,
      published: 0,
      skippedDuplicate: 0,
      skippedUntrusted: 0,
      error: runErr?.message ?? "run insert failed",
    };
  }

  const runId = run.id as string;
  const firecrawl = new Firecrawl({ apiKey: fcKey });

  // Rotate through topics deterministically by day so we don't spam the same searches
  const dayIndex = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
  const start = (dayIndex * topicsPerRun) % SEARCH_TOPICS.length;
  const topics: string[] = [];
  for (let i = 0; i < topicsPerRun; i++) {
    topics.push(SEARCH_TOPICS[(start + i) % SEARCH_TOPICS.length]);
  }

  const seenUrls = new Set<string>();
  const candidates: Array<{
    url: string;
    title: string;
    description?: string;
    markdown?: string;
  }> = [];
  let skippedUntrusted = 0;
  let skippedUnsuitable = 0;


  for (const topic of topics) {
    try {
      const result = await firecrawl.search(topic, {
        limit: 8,
        tbs: "qdr:w", // past week
        location: "gb",
      });
      // SDK v2 exposes results under `web`
      // Fall back to `.data` for older shapes.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyResult = result as any;
      const items: Array<{ url: string; title?: string; description?: string }> =
        anyResult?.web ?? anyResult?.data ?? [];
      for (const item of items) {
        if (!item?.url || seenUrls.has(item.url)) continue;
        seenUrls.add(item.url);
        if (!isTrusted(item.url)) {
          skippedUntrusted++;
          continue;
        }
        // Cheap pre-scrape filter: vacancies, index pages, obvious non-articles
        const preReject = unsuitableReason({ url: item.url, title: item.title });
        if (preReject) {
          skippedUnsuitable++;
          continue;
        }
        candidates.push({
          url: item.url,
          title: item.title ?? item.url,
          description: item.description,
        });
        if (candidates.length >= maxArticles * 2) break;
      }

      if (candidates.length >= maxArticles * 2) break;
    } catch (e) {
      console.error(`[news-ingest] search failed for topic "${topic}"`, e);
    }
  }

  // Scrape and analyse in sequence to keep costs bounded
  let published = 0;
  let heldForReview = 0;
  let skippedDuplicate = 0;

  for (const cand of candidates) {
    if (published + heldForReview >= maxArticles) break;

    const dedupeHash = hashUrl(cand.url);
    const { data: existing } = await supabaseAdmin
      .from("news_articles")
      .select("id")
      .eq("dedupe_hash", dedupeHash)
      .maybeSingle();
    if (existing) {
      skippedDuplicate++;
      continue;
    }

    try {
      // Scrape for markdown + metadata (image, description)
      const scrape = await firecrawl.scrape(cand.url, {
        formats: ["markdown"],
        onlyMainContent: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = scrape as any;
      const markdown: string = s?.markdown ?? s?.data?.markdown ?? "";
      const metadata = s?.metadata ?? s?.data?.metadata ?? {};
      const statusCode: number | undefined =
        s?.metadata?.statusCode ?? s?.data?.metadata?.statusCode;
      if (typeof statusCode === "number" && statusCode >= 400) {
        skippedUnsuitable++;
        console.warn(`[news-ingest] inaccessible (${statusCode}) ${cand.url}`);
        continue;
      }
      if (!markdown || markdown.length < 400) {
        skippedUnsuitable++;
        console.warn(`[news-ingest] insufficient content for ${cand.url}`);
        continue;
      }

      const title: string = metadata.title || cand.title;

      // Post-scrape suitability: paywall walls, error pages, job adverts
      const reason = unsuitableReason({ url: cand.url, title, markdown });
      if (reason) {
        skippedUnsuitable++;
        console.warn(`[news-ingest] rejected ${cand.url}: ${reason}`);
        continue;
      }

      const image: string | undefined =
        metadata.ogImage || metadata["og:image"] || metadata.image;
      const publishedIso: string | undefined =
        metadata.publishedTime || metadata["article:published_time"] || metadata.datePublished;

      const analysis = await analyseArticle({
        title,
        sourceName: domainOf(cand.url),
        sourceUrl: cand.url,
        markdown,
      });
      if (!analysis) continue;

      // Quality gate: drop low-confidence analyses and near-duplicate stories
      // already covered by another outlet in the past fortnight.
      const confidence = Math.min(1, Math.max(0, analysis.confidence_rating ?? 0.7));
      if (confidence < MIN_CONFIDENCE) {
        console.warn(`[news-ingest] low confidence (${confidence}) for ${cand.url}`);
        continue;
      }
      if (await isNearDuplicateStory(analysis.headline || title)) {
        skippedDuplicate++;
        continue;
      }

      // Source-quality rules + composite quality score decide whether the
      // story auto-publishes or waits in the editorial review queue.
      const tier = sourceTier(cand.url);
      const ukBonus = analysis.is_uk_focused !== false ? 0.1 : -0.15;
      const tierBonus = tier === 1 ? 0.15 : tier === 2 ? 0.05 : -0.1;
      const statsBonus = (analysis.key_statistics ?? []).length > 0 ? 0.05 : 0;
      const qualityScore = Math.min(
        1,
        Math.max(0, confidence + ukBonus + tierBonus + statsBonus),
      );
      // Final guard: the scrape may have succeeded technically while the page
      // itself was a paywall notice, CAPTCHA or empty shell, in which case the
      // model writes "access denied"-style copy. Such items are never
      // published — they are held unpublished with a recorded reason.
      const retrievalFailure = failedRetrievalReason(
        [
          analysis.headline,
          analysis.executive_summary,
          analysis.why_it_matters,
          analysis.impact_electricity_demand,
          analysis.long_term_implications,
          title,
        ]
          .filter(Boolean)
          .join(" "),
      );

      const autoApprove = !retrievalFailure && tier <= 2 && qualityScore >= 0.7;
      const reviewStatus = autoApprove ? "approved" : "pending";


      // Whitelist categories against allowed set
      const cleanCategories = (analysis.categories ?? [])
        .filter((c) => (CATEGORIES as readonly string[]).includes(c))
        .slice(0, 5);
      if (cleanCategories.length === 0) cleanCategories.push("AI Infrastructure");

      const slug = await uniqueSlug(analysis.headline || title);
      const originalPublished = publishedIso ? new Date(publishedIso) : null;
      const now = new Date();
      const isBreaking =
        !!originalPublished &&
        now.getTime() - originalPublished.getTime() < 24 * 60 * 60 * 1000;

      const insertRes = await supabaseAdmin.from("news_articles").insert({
        slug,
        title,
        headline: analysis.headline?.slice(0, 200) ?? title,
        source_name: metadata.siteName || domainOf(cand.url),
        source_url: cand.url,
        source_domain: domainOf(cand.url),
        dedupe_hash: dedupeHash,
        featured_image_url: image ?? null,
        og_image_url: image ?? null,
        original_published_at: originalPublished?.toISOString() ?? null,
        reading_time_minutes: readingTimeMinutes(markdown),
        categories: cleanCategories,
        tags: (analysis.tags ?? []).slice(0, 8),
        is_breaking: isBreaking,
        is_uk_focused: analysis.is_uk_focused !== false,
        status: retrievalFailure ? "draft" : "published",
        review_status: reviewStatus,
        rejection_reason: retrievalFailure,
        quality_score: qualityScore,
        source_tier: tier,
        confidence_rating: confidence,

        analysis: {
          executive_summary: analysis.executive_summary,
          why_it_matters: analysis.why_it_matters,
          impact_electricity_demand: analysis.impact_electricity_demand,
          impact_energy_security: analysis.impact_energy_security,
          impact_business: analysis.impact_business,
          impact_consumers: analysis.impact_consumers,
          long_term_implications: analysis.long_term_implications,
          quotations: analysis.quotations ?? [],
          related_technologies: analysis.related_technologies ?? [],
        },
        key_statistics: analysis.key_statistics ?? [],
        related_hub_links: suggestHubLinks(cleanCategories),
        meta_title: analysis.meta_title?.slice(0, 70) ?? title.slice(0, 70),
        meta_description: analysis.meta_description?.slice(0, 165) ?? analysis.executive_summary?.slice(0, 165),
        faq: analysis.faq ?? [],
      });

      if (insertRes.error) {
        console.error(`[news-ingest] insert failed for ${cand.url}`, insertRes.error);
        continue;
      }
      if (autoApprove) published++;
      else heldForReview++;
    } catch (e) {
      console.error(`[news-ingest] failed to process ${cand.url}`, e);
    }
  }

  const finalStatus: "success" | "partial" =
    published + heldForReview === 0 && candidates.length > 0 ? "partial" : "success";

  await supabaseAdmin
    .from("news_ingestion_runs")
    .update({
      finished_at: new Date().toISOString(),
      status: finalStatus,
      topics_searched: topics.length,
      candidates_found: candidates.length,
      articles_published: published,
      articles_skipped_duplicate: skippedDuplicate,
      articles_skipped_untrusted: skippedUntrusted,
      meta: { topics, skipped_unsuitable: skippedUnsuitable, held_for_review: heldForReview },
    })
    .eq("id", runId);

  return {
    runId,
    status: finalStatus,
    topicsSearched: topics.length,
    candidatesFound: candidates.length,
    published,
    skippedDuplicate,
    skippedUntrusted,
    skippedUnsuitable,
    heldForReview,
  };

}
