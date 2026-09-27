import { useRef, useState } from "react";
import { Bell, CheckCircle2, Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Source = "tracker-csv" | "project-alert" | "region-alert";

async function submitLead(args: {
  email: string;
  source: Source;
  inputs: Record<string, unknown>;
  consent: boolean;
  hp: string;
  elapsed: number;
}): Promise<{ csv?: string }> {
  const res = await fetch("/api/public/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: args.email,
      source: args.source,
      variant: args.source === "tracker-csv" ? "download" : "alert",
      inputs: args.inputs,
      consent_marketing: args.consent,
      hp_website: args.hp,
      elapsed_ms: args.elapsed,
    }),
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? "Something went wrong. Please try again.");
  }
  return (await res.json()) as { csv?: string };
}

function Fields(props: {
  email: string;
  setEmail: (v: string) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
  hp: string;
  setHp: (v: string) => void;
}) {
  return (
    <>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={props.hp}
        onChange={(e) => props.setHp(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <Input
        type="email"
        required
        placeholder="you@example.com"
        value={props.email}
        onChange={(e) => props.setEmail(e.target.value)}
        aria-label="Email address"
      />
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={props.consent}
          onChange={(e) => props.setConsent(e.target.checked)}
          className="mt-0.5"
        />
        Also send me the monthly tracker update. See our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </label>
    </>
  );
}

export function TrackerCsvDownload() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openedAt = useRef(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { csv } = await submitLead({
        email,
        source: "tracker-csv",
        inputs: {},
        consent,
        hp,
        elapsed: Date.now() - openedAt.current,
      });
      if (!csv) throw new Error("The download couldn't be prepared. Please try again.");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `uk-data-centre-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          openedAt.current = Date.now();
          setError(null);
          setOpen(true);
        }}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        <Download className="h-4 w-4" aria-hidden /> Download the tracker as CSV
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download the tracker as CSV</DialogTitle>
            <DialogDescription>
              Enter your email and the file of published tracker records will download straight away.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3">
            <Fields email={email} setEmail={setEmail} consent={consent} setConsent={setConsent} hp={hp} setHp={setHp} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download CSV
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TrackerAlertBox(
  props:
    | { kind: "project"; projectSlug: string; projectName: string }
    | { kind: "region"; region: string },
) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await submitLead({
        email,
        source: props.kind === "project" ? "project-alert" : "region-alert",
        inputs:
          props.kind === "project"
            ? { project_slug: props.projectSlug, project_name: props.projectName }
            : { region: props.region },
        consent,
        hp,
        elapsed: Date.now() - mountedAt.current,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Bell className="h-4 w-4" aria-hidden /> Email me when this changes
      </h2>
      {done ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden /> Thanks — you&rsquo;re on the list.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">
            {props.kind === "project"
              ? "Get an email when we update this project's published record."
              : `Get an email when we update any published record in ${props.region}.`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1 space-y-3">
              <Fields email={email} setEmail={setEmail} consent={consent} setConsent={setConsent} hp={hp} setHp={setHp} />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Notify me
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      )}
    </div>
  );
}
