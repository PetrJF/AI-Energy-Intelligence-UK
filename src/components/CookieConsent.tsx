import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getStoredConsent, storeConsent, revokeConsent, type ConsentChoice } from "@/lib/analytics";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getStoredConsent()) setOpen(true);
    const handler = () => setOpen(!getStoredConsent());
    window.addEventListener("aiei:consent:open", handler);
    return () => window.removeEventListener("aiei:consent:open", handler);
  }, []);

  if (!open) return null;

  const choose = (c: ConsentChoice) => {
    storeConsent(c);
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-elegant">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Cookie className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-base font-bold">We value your privacy</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                We use essential cookies to make this site work. With your permission we'd also like to use analytics cookies (Google Analytics 4) to understand how visitors use our tools, and marketing cookies for measurement. Read our{" "}
                <Link to="/privacy" className="font-semibold text-brand underline underline-offset-2 hover:opacity-80">privacy &amp; cookie policy</Link>{" "}
                — you can change your choice anytime.
              </p>

              {showDetails && (
                <div className="mt-4 grid gap-2 text-xs">
                  <Row label="Strictly necessary" desc="Required for the site to function. Always on." state="Always active" />
                  <Row label="Analytics (GA4)" desc="Anonymous usage data — page views, tool completions." state="You choose" />
                  <Row label="Marketing / advertising" desc="Used for ad measurement and personalisation." state="You choose" />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => choose("all")}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Accept all
                </button>
                <button
                  onClick={() => choose("analytics-only")}
                  className="inline-flex items-center justify-center rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90"
                >
                  Accept analytics only
                </button>
                <button
                  onClick={() => choose("denied")}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  {showDetails ? "Hide details" : "Manage preferences"}
                </button>
              </div>
            </div>
            <button
              aria-label="Close"
              onClick={() => choose("denied")}
              className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, desc, state }: { label: string; desc: string; state: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-secondary/60 px-3 py-2">
      <div>
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-muted-foreground">{desc}</div>
      </div>
      <span className="shrink-0 text-[10px] uppercase tracking-wider font-semibold text-brand">{state}</span>
    </div>
  );
}

/** Re-open the banner from anywhere (e.g. footer link). */
export function openConsent() {
  revokeConsent();
  window.dispatchEvent(new Event("aiei:consent:open"));
}
