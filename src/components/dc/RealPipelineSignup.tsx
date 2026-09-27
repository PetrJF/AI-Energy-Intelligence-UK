import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RealPipelineSignup({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) {
      setError("Please confirm that you want to receive the monthly email.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "tracker-updates",
          variant: "newsletter",
          inputs: { cadence: "monthly" },
          consent_marketing: true,
          hp_website: website,
          elapsed_ms: Date.now() - mountedAt.current,
        }),
      });
      if (!response.ok) throw new Error("Signup failed");
      setDone(true);
    } catch {
      setError("We couldn't add you just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id={id} className="border-y border-border bg-surface scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Monthly intelligence</p>
            <h2 className="mt-2 font-display text-2xl font-bold">The Real Pipeline — monthly</h2>
            <p className="mt-2 text-muted-foreground">
              Which UK data-centre projects moved, and why. One email a month.
            </p>
          </div>
          {done ? (
            <p className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden /> Thanks — you&rsquo;re on the list.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.co.uk"
                  aria-label="Email address"
                  className="h-10 flex-1"
                />
                <Button type="submit" disabled={busy} className="h-10">
                  {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Mail aria-hidden />}
                  Get the Real Pipeline
                </Button>
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I agree to receive the monthly tracker update and accept the{" "}
                  <a href="/privacy" className="underline">privacy policy</a>. Unsubscribe at any time.
                </span>
              </label>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}