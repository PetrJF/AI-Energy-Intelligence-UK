import { useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(200).optional(),
  enquiryType: z.enum(["market-entry-sprint", "opportunity-desk", "consultancy", "general", "partnership", "support"]),
  message: z.string().trim().min(10, "Please add a short message").max(2000),
});

const TYPE_LABELS: Record<string, string> = {
  "market-entry-sprint": "Market Entry Sprint",
  "opportunity-desk": "Opportunity Desk",
  consultancy: "Consultancy enquiry",
  general: "General question",
  partnership: "Partnership",
  support: "Account or billing support",
};

export function ContactEnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [enquiryType, setEnquiryType] = useState<
    "market-entry-sprint" | "opportunity-desk" | "consultancy" | "general" | "partnership" | "support"
  >("market-entry-sprint");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = FormSchema.safeParse({ name, email, company, enquiryType, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          source:
            ["market-entry-sprint", "opportunity-desk", "consultancy"].includes(parsed.data.enquiryType)
              ? "consultancy-enquiry"
              : "contact-enquiry",
          variant: "enquiry",
          inputs: {
            name: parsed.data.name,
            company: parsed.data.company || null,
            enquiry_type: parsed.data.enquiryType,
            message: parsed.data.message,
          },
          consent_marketing: false,
          hp_website: website,
          elapsed_ms: Date.now() - mountedAt.current,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-brand shrink-0" />
          <div>
            <h3 className="font-display font-semibold text-lg">Thanks — message received</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We aim to respond within 2–3 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4"
    >
      <div>
        <h3 className="font-display font-bold text-xl">Send us a message</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Use this form for consultancy enquiries or general questions.
        </p>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Company (optional)</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Enquiry type</span>
          <select
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value as any)}
            className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background p-3 text-sm"
        />
      </label>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send message
      </button>
    </form>
  );
}
