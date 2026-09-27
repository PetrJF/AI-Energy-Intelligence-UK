import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

const SELECT_COLS =
  "id, slug, title, headline, source_name, source_url, source_domain, source_tier, review_status, quality_score, confidence_rating, rejection_reason, categories, is_uk_focused, published_at, reviewed_at";

export type ReviewArticle = {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  source_name: string;
  source_url: string;
  source_domain: string;
  source_tier: number;
  review_status: string;
  quality_score: number | null;
  confidence_rating: number | null;
  rejection_reason: string | null;
  categories: string[];
  is_uk_focused: boolean;
  published_at: string;
  reviewed_at: string | null;
};

export const adminListNewsForReview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: string } | undefined) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    let query = context.supabase
      .from("news_articles")
      .select(SELECT_COLS)
      .order("published_at", { ascending: false })
      .limit(200);
    if (data.status && data.status !== "all") {
      query = query.eq("review_status", data.status);
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { articles: (rows ?? []) as ReviewArticle[] };
  });

export const adminSetNewsReviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: "approved" | "pending" | "rejected"; reason?: string }) => {
    if (!input?.id) throw new Error("id required");
    if (!["approved", "pending", "rejected"].includes(input.status)) {
      throw new Error("invalid status");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Items held by the retrieval-failure guard are stored as drafts, so approval
    // must also flip the publication status or the story stays invisible.
    const publicationStatus =
      data.status === "approved" ? "published" : data.status === "rejected" ? "archived" : "draft";
    const { error } = await context.supabase
      .from("news_articles")
      .update({
        review_status: data.status,
        status: publicationStatus,
        rejection_reason: data.status === "rejected" ? (data.reason ?? "Rejected by editor") : null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: context.userId,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteNewsArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id) throw new Error("id required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("news_articles")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
