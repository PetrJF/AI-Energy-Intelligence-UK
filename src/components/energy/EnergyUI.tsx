import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ChevronDown, AlertTriangle, ExternalLink } from "lucide-react";
import { RELATED, type RelatedKey } from "./relatedLinks";
import { RelatedLinkRow } from "./RelatedLinkRow";

/* ---------------- Layout shell ---------------- */

export function EnergyShell({ children }: { children: ReactNode }) {
  return <div className="bg-energy-deep text-white/90">{children}</div>;
}

export function EnergyContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/* ---------------- Breadcrumb ---------------- */

type Crumb = { label: string; to?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-white/10 bg-energy-navy">
      <EnergyContainer className="py-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-white/60">
          {items.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1">
              {c.to ? (
                <Link to={c.to} className="hover:text-electric transition-colors">{c.label}</Link>
              ) : (
                <span className="text-white/90 font-medium">{c.label}</span>
              )}
              {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-white/30" />}
            </li>
          ))}
        </ol>
      </EnergyContainer>
    </nav>
  );
}

/* ---------------- Hero ---------------- */

export function EnergyHero({
  eyebrow,
  title,
  intro,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon?: any;
}) {
  return (
    <section className="bg-energy-navy border-b border-white/10">
      <EnergyContainer className="py-12 md:py-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-electric">{eyebrow}</div>
        <h1 className="mt-3 flex items-start gap-3 text-3xl md:text-5xl font-bold text-white text-balance">
          {Icon && <Icon className="mt-1 h-8 w-8 md:h-10 md:w-10 text-electric shrink-0" />}
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70 leading-relaxed">{intro}</p>
      </EnergyContainer>
    </section>
  );
}

/* ---------------- Disclaimer ---------------- */

export function DisclaimerBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-electric/30 bg-electric/10 p-4 text-sm text-white/80 flex gap-3">
      <AlertTriangle className="h-5 w-5 text-electric shrink-0 mt-0.5" />
      <p>
        {children ?? (
          <>
            <strong className="text-white">Important:</strong> These tools provide educational estimates only.
            Actual AI electricity use varies by model, data centre, cooling system, hardware, location and workload.
            Do not use these results as official energy, planning, investment or engineering advice.
          </>
        )}
      </p>
    </div>
  );
}

/* ---------------- White content card ---------------- */

export function WhiteCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-energy-card text-energy-ink p-6 md:p-8 shadow-elegant ${className}`}>
      {children}
    </div>
  );
}

/* ---------------- Data card (result) ---------------- */

export function DataCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        accent ? "bg-electric text-electric-foreground border-electric" : "bg-energy-card text-energy-ink border-black/5 shadow-card"
      }`}
    >
      <div className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-white/80" : "text-energy-ink/60"}`}>
        {label}
      </div>
      <div className="mt-2 font-display text-2xl md:text-3xl font-bold">{value}</div>
      {sub && <div className={`mt-1 text-sm ${accent ? "text-white/80" : "text-energy-ink/60"}`}>{sub}</div>}
    </div>
  );
}

/* ---------------- SEO section (light grey, H3) ---------------- */

export function SeoSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="rounded-2xl bg-energy-grey text-energy-ink p-6 md:p-8 border border-black/5">
      <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm md:text-base text-energy-ink/80 leading-relaxed">{children}</div>
    </section>
  );
}

/* ---------------- Form fields (for white cards) ---------------- */

const inputCls =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm text-energy-ink focus:outline-none focus:ring-2 focus:ring-electric";

export function EField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-energy-ink">{label}</span>
        {hint && <span className="text-xs text-energy-ink/50">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function ENumber(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={inputCls} />;
}

export function EText(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={inputCls} />;
}

export function ESelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputCls}>
      {children}
    </select>
  );
}

/* ---------------- Related content block ---------------- */

export function RelatedContent({ tool }: { tool: RelatedKey }) {
  const rows = RELATED[tool];
  return (
    <SeoSection title="Related Articles & Reference Material">
      <p>
        Deep-dives from our own <Link to="/blog" className="text-electric underline-offset-2 hover:underline">blog</Link>
        {" "}and <Link to="/news" className="text-electric underline-offset-2 hover:underline">UK AI energy news</Link>,
        plus verified UK sources and PowerGuardian for live energy price context.
      </p>
      <ul className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <RelatedLinkRow key={`${r.label}-${r.href}-${i}`} link={r} />
        ))}
      </ul>
    </SeoSection>
  );
}

/* ---------------- Cross-tool navigation ---------------- */

const TOOL_LINKS = [
  { to: "/ai-energy-calculators/query-energy", label: "Use AI Query Energy Calculator" },
  { to: "/ai-energy-calculators/vs-appliances", label: "Compare AI With Household Appliances" },
  { to: "/ai-energy-calculators/demand-forecast", label: "Explore AI Electricity Demand" },
  { to: "/ai-energy-calculators/growth-zone", label: "Check AI Growth Zone Relevance" },
  { to: "/ai-energy-calculators/data-centres", label: "View AI Data Centre Directory" },
] as const;

export function ToolNavButtons({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOL_LINKS.filter((t) => t.to !== current).map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

/* ---------------- FAQ ---------------- */

export function EnergyFAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <SeoSection title="FAQ">
      <div className="divide-y divide-black/10">
        {items.map((it) => (
          <FaqRow key={it.q} q={it.q} a={it.a} />
        ))}
      </div>
    </SeoSection>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="font-semibold text-energy-ink">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-electric transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="mt-2 text-sm text-energy-ink/70 leading-relaxed">{a}</p>}
    </div>
  );
}

/* ---------------- shared formatters & constants ---------------- */

export const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 });
export const num = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

export const APPLIANCES = {
  kettle: { label: "Kettle boil", kwh: 0.1 },
  dishwasher: { label: "Dishwasher cycle", kwh: 1.2 },
  washing: { label: "Washing machine cycle", kwh: 0.8 },
  dryer: { label: "Tumble dryer cycle", kwh: 2.5 },
  oven: { label: "Electric oven hour", kwh: 2.0 },
  shower: { label: "Electric shower (10 min)", kwh: 1.5 },
  ev: { label: "Small EV charge", kwh: 7.0 },
} as const;
