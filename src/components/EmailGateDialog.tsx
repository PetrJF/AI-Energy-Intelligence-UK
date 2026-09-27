import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EmailGateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  reportSlug: string;
  onUnlocked: () => void;
};

export function EmailGateDialog({
  open,
  onOpenChange,
  reportTitle,
  reportSlug,
  onUnlocked,
}: EmailGateDialogProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [hpWebsite, setHpWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const openedAt = useRef<number>(0);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setCaptchaAnswer("");
    try {
      const res = await fetch("/api/public/captcha", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load captcha");
      const data = (await res.json()) as { question: string; token: string };
      setCaptcha(data);
    } catch {
      setCaptcha(null);
      setError("Couldn't load the captcha. Please try again.");
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      openedAt.current = Date.now();
      setError(null);
      void loadCaptcha();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!gdprConsent) {
      setError("Please confirm you agree to our privacy policy to continue.");
      return;
    }
    if (!captcha || !captchaAnswer.trim()) {
      setError("Please solve the captcha to continue.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "report-download",
          variant: "download",
          inputs: {
            report_slug: reportSlug,
            report_title: reportTitle,
            gdpr_consent: gdprConsent,
            gdpr_consent_at: new Date().toISOString(),
          },
          consent_marketing: consent,
          hp_website: hpWebsite,
          elapsed_ms: Date.now() - openedAt.current,
          captcha_token: captcha.token,
          captcha_answer: captchaAnswer.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Refresh captcha on failure so the user can retry.
        void loadCaptcha();
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      onOpenChange(false);
      // Small delay so the dialog closes cleanly before download begins
      setTimeout(() => onUnlocked(), 100);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Download your report</DialogTitle>
          <DialogDescription>
            Enter your work email to unlock <span className="font-medium text-foreground">{reportTitle}</span> and we'll send the weekly UK AI energy briefing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email-gate-email" className="text-sm font-medium">
              Work email
            </label>
            <Input
              id="email-gate-email"
              type="email"
              required
              autoFocus
              placeholder="you@company.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
            />
          </div>

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="email-gate-website">Website</label>
            <input
              id="email-gate-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              required
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span>
              I agree to AI Energy Intelligence UK storing my email to send this report and
              processing my data in line with the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                privacy policy
              </a>
              . <span className="text-destructive">*</span>
            </span>
          </label>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span>
              Also email me the weekly UK AI energy briefing. Unsubscribe anytime.
            </span>
          </label>

          <div className="space-y-1.5">
            <label htmlFor="email-gate-captcha" className="text-sm font-medium">
              Quick check <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-mono">
                {captchaLoading || !captcha ? "Loading…" : captcha.question}
              </div>
              <Input
                id="email-gate-captcha"
                type="text"
                inputMode="numeric"
                required
                autoComplete="off"
                placeholder="Answer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-24"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => void loadCaptcha()}
                className="text-xs text-muted-foreground underline hover:text-foreground"
                aria-label="New captcha"
              >
                New
              </button>
            </div>
          </div>


          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Unlocking…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Email me the PDF
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            We store your email to send the report and related updates. See our privacy policy.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
