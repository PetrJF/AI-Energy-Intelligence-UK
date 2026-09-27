import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Save, ShieldAlert, Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { adminGetPost, adminUpsertPost, adminUploadImage, type BlogPost } from "@/lib/blog.functions";
import { RichTextEditor } from "@/components/RichTextEditor";

export const Route = createFileRoute("/AIAdmin/blog/$id")({
  head: () => ({
    meta: [
      { title: "Edit post — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BlogEditor,
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  body_html: string;
  cover_image_url: string;
  status: "draft" | "published";
  categoriesRaw: string;
  tagsRaw: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  pillar: string;
  article_type: string;
  review_status: string;
  change_note: string;
  author_name: string;
  keyFindingsRaw: string;
  sourcesRaw: string;
  methodology: string;
  limitations: string;
  chart_note: string;
  corrections_note: string;
  last_updated_at: string;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  body_html: "",
  cover_image_url: "",
  status: "draft",
  categoriesRaw: "",
  tagsRaw: "",
  meta_title: "",
  meta_description: "",
  og_image_url: "",
  pillar: "",
  article_type: "standard",
  review_status: "unreviewed",
  change_note: "",
  author_name: "",
  keyFindingsRaw: "",
  sourcesRaw: "",
  methodology: "",
  limitations: "",
  chart_note: "",
  corrections_note: "",
  last_updated_at: "",
};

function fromPost(p: BlogPost): FormState {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    body_html: p.body_html ?? "",
    cover_image_url: p.cover_image_url ?? "",
    status: p.status,
    categoriesRaw: (p.categories ?? []).join(", "),
    tagsRaw: (p.tags ?? []).join(", "),
    meta_title: p.meta_title ?? "",
    meta_description: p.meta_description ?? "",
    og_image_url: p.og_image_url ?? "",
    pillar: p.pillar ?? "",
    article_type: p.article_type ?? "standard",
    review_status: p.review_status ?? "unreviewed",
    change_note: p.change_note ?? "",
    author_name: p.author_name ?? "",
    keyFindingsRaw: (p.key_findings ?? []).join("\n"),
    sourcesRaw: (p.sources ?? [])
      .map((s) => [s.title, s.publisher, s.url, s.accessed ?? ""].join(" | ").replace(/\s*\|\s*$/, ""))
      .join("\n"),
    methodology: p.methodology ?? "",
    limitations: p.limitations ?? "",
    chart_note: p.chart_note ?? "",
    corrections_note: p.corrections_note ?? "",
    last_updated_at: p.last_updated_at ? p.last_updated_at.slice(0, 10) : "",
  };
}

function BlogEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugDirty, setSlugDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: `/AIAdmin/blog/${id}` } });
    }
  }, [authLoading, user, navigate, id]);

  const getPost = useServerFn(adminGetPost);
  const upsert = useServerFn(adminUpsertPost);
  const uploadImage = useServerFn(adminUploadImage);

  const uploadFile = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10MB");
    const buf = await file.arrayBuffer();
    // Chunked base64 to avoid call-stack blowups on larger images
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    const dataBase64 = btoa(binary);
    const res = await uploadImage({
      data: {
        filename: file.name || "image",
        contentType: file.type || "image/png",
        dataBase64,
      },
    });
    return res.url;
  };

  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const onHeroPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setHeroUploading(true);
      const url = await uploadFile(file);
      setField("cover_image_url", url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setHeroUploading(false);
    }
  };

  const query = useQuery({
    queryKey: ["admin", "blog", "post", id],
    queryFn: () => getPost({ data: { id } }),
    enabled: !!user && !isNew,
    retry: false,
  });

  useEffect(() => {
    if (!isNew && query.data?.post) {
      setForm(fromPost(query.data.post));
      setSlugDirty(true);
    }
  }, [isNew, query.data]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => upsert({ data: payload }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "list"] });
      qc.invalidateQueries({ queryKey: ["blog"] });
      if (isNew) {
        navigate({ to: "/AIAdmin/blog/$id", params: { id: res.id }, replace: true });
      }
    },
    onError: (err: Error) => setError(err.message),
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onTitleChange = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugDirty || !isNew ? f.slug : slugify(v),
    }));
  };

  const submit = (status: "draft" | "published") => {
    setError(null);
    const categories = form.categoriesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = form.tagsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    saveMutation.mutate({
      id: isNew ? undefined : id,
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt || null,
      body_html: form.body_html,
      cover_image_url: form.cover_image_url || null,
      status,
      categories,
      tags,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image_url: form.og_image_url || null,
      pillar: form.pillar || null,
      article_type: form.article_type || "standard",
      review_status: form.review_status || "unreviewed",
      change_note: form.change_note || null,
      author_name: form.author_name || null,
      key_findings: form.keyFindingsRaw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      sources: form.sourcesRaw
        .split("\n")
        .map((l) => l.split("|").map((x) => x.trim()))
        .filter((parts) => parts.length >= 3 && parts[2])
        .map((parts) => ({
          title: parts[0],
          publisher: parts[1] ?? "",
          url: parts[2],
          ...(parts[3] ? { accessed: parts[3] } : {}),
        })),
      methodology: form.methodology || null,
      limitations: form.limitations || null,
      chart_note: form.chart_note || null,
      corrections_note: form.corrections_note || null,
      last_updated_at: form.last_updated_at || null,
    });
  };

  if (authLoading || (!isNew && query.isLoading)) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isNew && query.isError) {
    const msg = (query.error as Error)?.message ?? "";
    const forbidden = /forbidden|unauth/i.test(msg);
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">
          {forbidden ? "Admins only" : "Post not found"}
        </h1>
        <p className="text-sm text-muted-foreground">{msg}</p>
      </div>
    );
  }

  const saving = saveMutation.isPending;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/AIAdmin/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to posts
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => submit("draft")}
            disabled={saving || !form.title || !form.slug}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save draft
          </button>
          <button
            type="button"
            onClick={() => submit("published")}
            disabled={saving || !form.title || !form.slug || !form.body_html}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>

      <h1 className="mt-4 font-display text-2xl font-bold">
        {isNew ? "New blog post" : "Edit post"}
      </h1>

      {error && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Field label="Title" required>
            <input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="A clear, human title"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Slug" hint="URL segment, e.g. my-post-title">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugDirty(true);
                setField("slug", slugify(e.target.value));
              }}
              placeholder="my-post-title"
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Excerpt" hint="Short summary shown in cards and previews (≤600 chars)">
            <textarea
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              rows={3}
              maxLength={600}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Body" required>
            <RichTextEditor
              value={form.body_html}
              onChange={(html) => setField("body_html", html)}
              onUploadImage={uploadFile}
            />
          </Field>
        </div>

        <div className="space-y-6">
          <Field label="Status">
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setField("status", s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${
                    form.status === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Hero image" hint="Upload a file or paste a URL">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                disabled={heroUploading}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-40"
              >
                {heroUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {heroUploading ? "Uploading…" : "Upload image"}
              </button>
              {form.cover_image_url && (
                <button
                  type="button"
                  onClick={() => setField("cover_image_url", "")}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              )}
              <input
                ref={heroInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
                className="hidden"
                onChange={onHeroPick}
              />
            </div>
            <input
              value={form.cover_image_url}
              onChange={(e) => setField("cover_image_url", e.target.value)}
              placeholder="https://…"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {form.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt=""
                className="mt-2 aspect-[16/9] w-full rounded-md object-cover border border-border"
              />
            )}
          </Field>

          <Field label="Categories" hint="Comma-separated">
            <input
              value={form.categoriesRaw}
              onChange={(e) => setField("categoriesRaw", e.target.value)}
              placeholder="AI, UK Grid, Data Centres"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Tags" hint="Comma-separated">
            <input
              value={form.tagsRaw}
              onChange={(e) => setField("tagsRaw", e.target.value)}
              placeholder="ofgem, neso, ai-training"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-sm">Editorial template</h3>
            <Field label="Research pillar">
              <select
                value={form.pillar}
                onChange={(e) => setField("pillar", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Unassigned</option>
                <option value="ai-electricity-demand">AI Electricity Demand</option>
                <option value="data-centres">Data Centres</option>
                <option value="grid-infrastructure">Grid &amp; Infrastructure</option>
                <option value="policy-economics">Policy &amp; Economics</option>
                <option value="water-environment">Water, Emissions &amp; Environment</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Article type">
              <select
                value={form.article_type}
                onChange={(e) => setField("article_type", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="cornerstone">Cornerstone</option>
                <option value="standard">Standard</option>
                <option value="briefing">Monthly briefing</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Evidence review status" hint="Only 'Reviewed' articles are treated as meeting the current standard">
              <select
                value={form.review_status}
                onChange={(e) => setField("review_status", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="unreviewed">Unreviewed</option>
                <option value="in_review">In review</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </Field>
            <Field label="What changed" hint="Reader-facing note describing the last substantive revision">
              <textarea
                value={form.change_note}
                onChange={(e) => setField("change_note", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Byline" hint="Leave blank for the organisation byline">
              <input
                value={form.author_name}
                onChange={(e) => setField("author_name", e.target.value)}
                placeholder="AI Energy Intelligence Research Team"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Key findings" hint="One per line, max 10">
              <textarea
                value={form.keyFindingsRaw}
                onChange={(e) => setField("keyFindingsRaw", e.target.value)}
                rows={5}
                placeholder={"Finding one\nFinding two"}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Sources" hint="One per line: Title | Publisher | URL | Accessed">
              <textarea
                value={form.sourcesRaw}
                onChange={(e) => setField("sourcesRaw", e.target.value)}
                rows={5}
                placeholder="Clean Power 2030 | NESO | https://… | 2026-01-12"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Methodology" hint="How the figures were produced">
              <textarea
                value={form.methodology}
                onChange={(e) => setField("methodology", e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Limitations" hint="What this analysis cannot show">
              <textarea
                value={form.limitations}
                onChange={(e) => setField("limitations", e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Chart note" hint="Shown under charts or data tables">
              <textarea
                value={form.chart_note}
                onChange={(e) => setField("chart_note", e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Correction note" hint="Only when a published figure has been corrected">
              <textarea
                value={form.corrections_note}
                onChange={(e) => setField("corrections_note", e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Last substantive update" hint="Set only for real revisions">
              <input
                type="date"
                value={form.last_updated_at}
                onChange={(e) => setField("last_updated_at", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-sm">SEO</h3>
            <Field label="Meta title">
              <input
                value={form.meta_title}
                onChange={(e) => setField("meta_title", e.target.value)}
                placeholder="Overrides the page title"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Meta description">
              <textarea
                value={form.meta_description}
                onChange={(e) => setField("meta_description", e.target.value)}
                rows={3}
                maxLength={600}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Social image URL">
              <input
                value={form.og_image_url}
                onChange={(e) => setField("og_image_url", e.target.value)}
                placeholder="https://…"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
