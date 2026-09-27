import { useState, useRef } from "react";
import { Mail, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Variant = "results" | "newsletter" | "checklist";

const config: Record<Variant, { title: string; subtitle: string; cta: string; icon: typeof Mail }> = {
  results: {
    title: "Email me my results",
    subtitle: "Get a copy of this report sent to your inbox.",
    cta: "Send results",
    icon: Mail,
  },
  newsletter: {
    title: "Weekly AI business briefing",
    subtitle: "Practical AI insights for UK businesses, every Friday.",
    cta: "Subscribe",
    icon: Mail,
  },
  checklist: {
    title: "Download the AI implementation checklist",
    subtitle: "A free PDF guide for adopting AI in your business.",
    cta: "Get the checklist",
    icon: Download,
  },
};

type Source =
  | "readiness-checker"
  | "savings-calculator"
  | "risk-checker"
  | "homepage-newsletter"
  | "footer-newsletter"
  | "checklist"
  | "ai-electricity-guide"
  | "ai-appliances-guide"
  | "ai-electricity-cost"
  | "ai-search-cost"
  | "ai-model-training"
  | "ai-grid-impact"
  | "ai-growth-zone"
  | "data-centre-demand"
  | "ai-roi"
  | "ai-energy-savings"
  | "ai-readiness"
  | "energy-cost-hub"
  | "infrastructure-hub"
  | "business-hub"
  | "reports-library"
  | "report-download"
  | "report-collection"
  | "energy-index";

export function LeadCapture({
  variant = "results",
  source,
  context,
  inputs,
  resultSummary,
  onDownload,
  downloadLabel = "Download your PDF report",
  compact = false,
  title,
  subtitle,
}: {
  variant?: Variant;
  source: Source;
  context?: string;
  inputs?: Record<string, unknown>;
  resultSummary?: Record<string, unknown>;
  onDownload?: () => void;
  downloadLabel?: string;
  compact?: boolean;
  /** Overrides the default heading for this variant. */
  title?: string;
  /** Overrides the default supporting line for this variant. */
  subtitle?: string;
}) {

  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(variant === "newsletter");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Honeypot: bots fill hidden fields; humans never see this.
  const [website, setWebsite] = useState("");
  // Timing: forms submitted near-instantly are almost always bots.
  const mountedAt = useRef(Date.now());
  const cfg = config[variant];
  const Icon = cfg.icon;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    // Honeypot tripped: pretend success, save nothing.
    if (website.trim() !== "") {
      setDone(true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          variant,
          inputs: inputs ?? null,
          result_summary: resultSummary ?? null,
          consent_marketing: variant === "newsletter" ? true : marketing,
          hp_website: website,
          elapsed_ms: Date.now() - mountedAt.current,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      try { trackEvent("lead_capture_submit", { variant, source, context }); } catch {}
      if (variant === "newsletter") {
        try { trackEvent("newsletter_subscribe", { source }); } catch {}
      }
      setDone(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      console.error("[LeadCapture] submit failed", err);
      try { trackEvent("lead_capture_error", { source, message }); } catch {}
      setError("Couldn't save your email. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDownload() {
    try { trackEvent("thank_you_download", { variant, source, context }); } catch {}
    onDownload?.();
  }

  if (done) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-sm">Thanks — you&rsquo;re on the list.</div>
            {onDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90 transition"
              >
                <Download className="h-4 w-4" />
                {downloadLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-xl border border-border bg-card shadow-card ${compact ? "p-4" : "p-5"}`}
    >
      {!compact && (
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-lg bg-accent p-2"><Icon className="h-4 w-4 text-brand" /></div>
          <div>
            <div className="font-semibold text-sm">{title ?? cfg.title}</div>
            <div className="text-xs text-muted-foreground">{subtitle ?? cfg.subtitle}</div>

          </div>
        </div>
      )}
      {/* Honeypot — visually hidden, off-screen, excluded from tab order. Bots fill it, humans can't see it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lc-website">Website</label>
        <input
          id="lc-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.co.uk"
          disabled={submitting}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {cfg.cta}
        </button>
      </div>

      {variant === "results" && (
        <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-input accent-[var(--brand)]"
          />
          <span>Also send me the weekly AI Energy Intelligence UK briefing — practical AI for UK businesses.</span>
        </label>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground">
        We use your email to send your report and (if you've opted in) the weekly briefing. Unsubscribe any time. See our{" "}
        <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>.
      </p>
    </form>
  );
}
