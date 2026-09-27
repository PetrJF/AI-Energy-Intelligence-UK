// Blog server functions.
// - Public: list/getBySlug (published only) via the publishable-key client, relying on the public RLS policies.
// - Admin: full CRUD; requires admin role.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: "draft" | "published";
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
  created_at: string;
  pillar: string | null;
  article_type: string;
  review_status: "unreviewed" | "in_review" | "reviewed";
};

export type ArticleSource = {
  title: string;
  publisher: string;
  url: string;
  accessed?: string;
};

export type BlogPost = BlogPostListItem & {
  body_html: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  author_name: string | null;
  key_findings: string[];
  sources: ArticleSource[];
  methodology: string | null;
  limitations: string | null;
  chart_note: string | null;
  corrections_note: string | null;
  last_updated_at: string | null;
  change_note: string | null;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

// ---------- Public ----------

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: string; pillar?: string; limit?: number } | undefined) =>
    z
      .object({
        category: z.string().optional(),
        pillar: z.string().max(60).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("@/lib/supabase-public.server");
    let q = getPublicSupabase()
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, status, categories, tags, published_at, updated_at, created_at, pillar, article_type, review_status",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(data.limit ?? 50);
    if (data.category) q = q.contains("categories", [data.category]);
    if (data.pillar) q = q.eq("pillar", data.pillar);
    const { data: rows, error } = await q;
    if (error) {
      console.error("[blog] listPublishedPosts", error);
      return { items: [] as BlogPostListItem[] };
    }
    return { items: (rows ?? []) as BlogPostListItem[] };
  });

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(160) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getPublicSupabase } = await import("@/lib/supabase-public.server");
    const { data: row, error } = await getPublicSupabase()
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, body_html, cover_image_url, status, categories, tags, published_at, updated_at, created_at, meta_title, meta_description, og_image_url, pillar, article_type, author_name, key_findings, sources, methodology, limitations, chart_note, corrections_note, last_updated_at, review_status, change_note",
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) {
      console.error("[blog] getPublishedPostBySlug", error);
      return { post: null as BlogPost | null };
    }
    const post = (row as BlogPost | null) ?? null;
    if (post && (post.body_html.includes("{{index:") || post.key_findings?.some((f) => f.includes("{{index:")))) {
      const SEP = "\u0000KF\u0000";
      const plain = await resolveIndexTokens((post.key_findings ?? []).join(SEP), true);
      post.key_findings = plain.split(SEP);
      post.body_html = await resolveIndexTokens(post.body_html);
    }
    return { post };
  });

// Replaces {{index:<indicator-slug>}} tokens in article HTML with the latest
// published datapoint for that Index indicator, so articles always show the
// Index's live figure. Missing data renders "Insufficient evidence".
async function resolveIndexTokens(html: string, plain = false): Promise<string> {
  const slugs = Array.from(new Set([...html.matchAll(/\{\{index:([a-z0-9-]+)\}\}/g)].map((m) => m[1])));
  if (slugs.length === 0) return html;
  const { data: inds } = await supabaseAdmin
    .from("index_indicators")
    .select("id, slug, unit")
    .in("slug", slugs)
    .eq("status", "published");
  const ids = (inds ?? []).map((i) => i.id);
  const { data: dps } = ids.length
    ? await supabaseAdmin
        .from("index_datapoints")
        .select("indicator_id, value, value_text, unit, period_label, period_end, publication_date")
        .in("indicator_id", ids)
        .eq("status", "published")
    : { data: [] as any[] };
  const unitSuffix = (u: string | null) => {
    if (!u) return "";
    if (/^percentage( change)?$/i.test(u)) return "%";
    return " " + u.replace(/ per year$/i, "");
  };
  const out = new Map<string, string>();
  for (const ind of inds ?? []) {
    const rows = (dps ?? [])
      .filter((d: any) => d.indicator_id === ind.id)
      .sort((a: any, b: any) =>
        String(b.period_end ?? b.period_label ?? "").localeCompare(String(a.period_end ?? a.period_label ?? "")) ||
        String(b.publication_date ?? "").localeCompare(String(a.publication_date ?? "")),
      );
    const d: any = rows[0];
    if (!d) continue;
    const val =
      d.value_text ??
      (d.value !== null && d.value !== undefined ? `${Number(d.value).toLocaleString("en-GB")}${unitSuffix(d.unit ?? ind.unit)}` : null);
    if (val) out.set(ind.slug, `${val} (${d.period_label})`);
  }
  return html.replace(/\{\{index:([a-z0-9-]+)\}\}/g, (_m, slug: string) => {
    const v = out.get(slug);
    if (plain) return v ?? "Insufficient evidence";
    const esc = (v ?? "Insufficient evidence").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    return `<strong data-index-indicator="${slug}">${esc}</strong>`;
  });
}

// ---------- Admin ----------

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, status, categories, tags, published_at, updated_at, created_at, pillar, article_type, review_status",
      )
      .order("updated_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { items: (rows ?? []) as BlogPostListItem[] };
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { post: (row as BlogPost | null) ?? null };
  });

const postInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphenated"),
  title: z.string().min(1).max(240),
  excerpt: z.string().max(600).nullable().optional(),
  body_html: z.string().max(200_000).default(""),
  cover_image_url: z.string().url().max(2000).nullable().optional(),
  status: z.enum(["draft", "published"]),
  categories: z.array(z.string().max(60)).max(10).default([]),
  tags: z.array(z.string().max(60)).max(20).default([]),
  meta_title: z.string().max(240).nullable().optional(),
  meta_description: z.string().max(600).nullable().optional(),
  og_image_url: z.string().url().max(2000).nullable().optional(),
  pillar: z
    .enum([
      "ai-electricity-demand",
      "data-centres",
      "grid-infrastructure",
      "policy-economics",
      "water-environment",
      "other",
    ])
    .nullable()
    .optional(),
  article_type: z.enum(["cornerstone", "standard", "briefing", "other"]).default("standard"),
  author_name: z.string().max(120).nullable().optional(),
  key_findings: z.array(z.string().max(400)).max(10).default([]),
  sources: z
    .array(
      z.object({
        title: z.string().min(1).max(240),
        publisher: z.string().max(160).default(""),
        url: z.string().url().max(2000),
        accessed: z.string().max(40).optional(),
      }),
    )
    .max(40)
    .default([]),
  methodology: z.string().max(8000).nullable().optional(),
  limitations: z.string().max(8000).nullable().optional(),
  chart_note: z.string().max(2000).nullable().optional(),
  corrections_note: z.string().max(1000).nullable().optional(),
  /** Set only when a substantive revision has been made. Never auto-stamped. */
  last_updated_at: z.string().max(40).nullable().optional(),
  /** Evidence review state. Only 'reviewed' articles are eligible for featuring. */
  review_status: z.enum(["unreviewed", "in_review", "reviewed"]).default("unreviewed"),
  /** Reader-facing note describing what changed in the last substantive revision. */
  change_note: z.string().max(2000).nullable().optional(),
});

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => postInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const now = new Date().toISOString();
    const payload: Record<string, any> = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      body_html: data.body_html ?? "",
      cover_image_url: data.cover_image_url ?? null,
      status: data.status,
      categories: data.categories ?? [],
      tags: data.tags ?? [],
      meta_title: data.meta_title ?? null,
      meta_description: data.meta_description ?? null,
      og_image_url: data.og_image_url ?? null,
      pillar: data.pillar ?? null,
      article_type: data.article_type ?? "standard",
      author_name: data.author_name ?? null,
      key_findings: data.key_findings ?? [],
      sources: data.sources ?? [],
      methodology: data.methodology ?? null,
      limitations: data.limitations ?? null,
      chart_note: data.chart_note ?? null,
      corrections_note: data.corrections_note ?? null,
      last_updated_at: data.last_updated_at || null,
      review_status: data.review_status ?? "unreviewed",
      change_note: data.change_note ?? null,
      author_id: context.userId,
    };

    if (data.id) {
      // If publishing for the first time, stamp published_at
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("status, published_at")
        .eq("id", data.id)
        .maybeSingle();
      if (
        data.status === "published" &&
        (!existing?.published_at || existing?.status !== "published")
      ) {
        payload.published_at = now;
      }
      const { data: updated, error } = await supabaseAdmin
        .from("blog_posts")
        .update(payload as any)
        .eq("id", data.id)
        .select("id, slug")
        .single();
      if (error) throw new Error(error.message);
      return { id: updated.id, slug: updated.slug };
    }

    if (data.status === "published") payload.published_at = now;
    const { data: inserted, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(payload as any)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id, slug: inserted.slug };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Image uploads ----------

const uploadInputSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif|avif|svg\+xml)$/i, "Unsupported image type"),
  // base64-encoded file bytes (no data: prefix)
  dataBase64: z.string().min(1).max(15_000_000), // ~11MB decoded max
});

export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => uploadInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const bytes = Buffer.from(data.dataBase64, "base64");
    if (bytes.byteLength > 10 * 1024 * 1024) {
      throw new Error("Image exceeds 10MB limit");
    }

    const extMatch = data.filename.match(/\.([a-z0-9]+)$/i);
    const ext = (extMatch?.[1] ?? data.contentType.split("/")[1] ?? "bin").toLowerCase();
    const safeExt = ext.replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
    const uid =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const key = `${new Date().getFullYear()}/${uid}.${safeExt}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(key, bytes, {
        contentType: data.contentType,
        cacheControl: "public, max-age=31536000, immutable",
        upsert: false,
      });
    if (upErr) throw new Error(upErr.message);

    // Bucket is private (public buckets blocked by workspace policy).
    // Issue a very long-lived signed URL so the image works on the public site.
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("blog-images")
      .createSignedUrl(key, 60 * 60 * 24 * 365 * 30); // 30 years
    if (signErr || !signed?.signedUrl) {
      throw new Error(signErr?.message ?? "Failed to sign URL");
    }

    return { url: signed.signedUrl, key };
  });
