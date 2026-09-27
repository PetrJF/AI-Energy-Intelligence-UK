import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// Visitor correction form. Submissions go to an administrator review queue and
// never alter published figures automatically.
export function CorrectionForm({ defaultPage = "" }: { defaultPage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/public/corrections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          page_or_record: String(f.get("page_or_record") ?? ""),
          description: String(f.get("description") ?? ""),
          suggested_correction: String(f.get("suggested_correction") ?? ""),
          source_url: String(f.get("source_url") ?? ""),
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  const field = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-sm">
        <p className="font-medium">Thank you &mdash; your correction request has been received.</p>
        <p className="mt-2 text-muted-foreground">
          It has entered our review queue. Nothing published changes automatically; an editor will
          check the point and, where a change is made, it will be recorded with the reason and date.
        </p>
        <button
          type="button"
          className="mt-4 text-brand hover:underline"
          onClick={() => setStatus("idle")}
        >
          Submit another correction
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Page or record concerned *</span>
          <input
            name="page_or_record"
            required
            minLength={3}
            maxLength={300}
            defaultValue={defaultPage}
            placeholder="/uk-ai-energy-index/grid-pressure — Scotland rating"
            className={field}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Description of the possible error *</span>
          <textarea name="description" required minLength={10} maxLength={2000} rows={4} className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Suggested correction</span>
          <textarea name="suggested_correction" maxLength={2000} rows={3} className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Supporting source URL</span>
          <input name="source_url" type="url" maxLength={500} placeholder="https://" className={field} />
        </label>
        <label className="text-sm">
          <span className="font-medium">Your name</span>
          <input name="name" maxLength={120} className={field} />
        </label>
        <label className="text-sm">
          <span className="font-medium">Your email address</span>
          <input name="email" type="email" maxLength={255} className={field} />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60"
      >
        {status === "sending" ? "Sending\u2026" : "Submit correction"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Submissions enter an administrator review queue. Published data is never changed
        automatically by a submission.
      </p>
    </form>
  );
}
