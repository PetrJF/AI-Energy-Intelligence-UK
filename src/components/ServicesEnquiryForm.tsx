import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Captcha = { question: string; token: string };

export function ServicesEnquiryForm() {
  const [fields, setFields] = useState({ name: "", company: "", email: "", sold: "", regions: "", message: "" });
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [answer, setAnswer] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  async function loadCaptcha() {
    const response = await fetch("/api/public/captcha", { cache: "no-store" });
    if (!response.ok) throw new Error("Captcha unavailable");
    setCaptcha((await response.json()) as Captcha);
    setAnswer("");
  }

  useEffect(() => { void loadCaptcha().catch(() => setError("The quick check could not load. Please try again.")); }, []);

  const set = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((current) => ({ ...current, [key]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!captcha || !answer.trim()) return setError("Please complete the quick check.");
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email,
          source: "services-enquiry",
          variant: "enquiry",
          inputs: {
            name: fields.name,
            company: fields.company,
            what_sold: fields.sold,
            regions: fields.regions,
            message: fields.message,
            enquiry_type: "services",
          },
          consent_marketing: false,
          hp_website: website,
          elapsed_ms: Date.now() - mountedAt.current,
          captcha_token: captcha.token,
          captcha_answer: answer,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Send failed");
      }
      setDone(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      void loadCaptcha().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  }

  if (done) return (
    <div className="rounded-lg border border-border bg-card p-6">
      <CheckCircle2 className="h-6 w-6 text-success" aria-hidden />
      <h2 className="mt-3 font-display text-xl font-bold">Thanks — enquiry received</h2>
      <p className="mt-2 text-sm text-muted-foreground">We&rsquo;ll review your requirements and reply by email.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-xl font-bold">Tell us what you sell</h2>
      <p className="mt-1 text-sm text-muted-foreground">We&rsquo;ll use this to understand whether and where we can help.</p>
      <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([
          ["name", "Name", "text"], ["company", "Company", "text"], ["email", "Email", "email"],
          ["sold", "What do you sell?", "text"], ["regions", "Regions of interest", "text"],
        ] as const).map(([key, label, type]) => (
          <label key={key} className={key === "regions" ? "sm:col-span-2" : ""}>
            <span className="text-sm font-medium">{label}</span>
            <Input className="mt-1" type={type} required value={fields[key]} onChange={set(key)} />
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="text-sm font-medium">Message</span>
          <textarea className="mt-1 min-h-32 w-full rounded-md border border-input bg-background p-3 text-sm" required maxLength={3000} value={fields.message} onChange={set("message")} />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium">Quick check: {captcha?.question ?? "Loading…"}</span>
          <Input className="mt-1 max-w-40" inputMode="numeric" required value={answer} onChange={(event) => setAnswer(event.target.value)} />
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={busy || !captcha} className="mt-5">
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send enquiry
      </Button>
    </form>
  );
}