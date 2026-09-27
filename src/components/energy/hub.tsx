import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Zap,
  Search,
  Cpu,
  Network,
  MapPin,
  Server,
  TrendingUp,
  PiggyBank,
  ClipboardCheck,
  Download,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  SeoSection,
} from "./EnergyUI";
import { LeadCapture } from "@/components/LeadCapture";
import { SaveToDashboardButton } from "@/components/dashboard/SaveToDashboardButton";
import { RelatedReports, categoriesForToolPath } from "@/components/RelatedReports";

/* ------------------------------------------------------------------ */
/* Hub + tool registry — single source of truth                        */
/* ------------------------------------------------------------------ */

export type HubKey = "energy-cost" | "infrastructure" | "business";

export type ToolDef = {
  to: string;
  title: string;
  desc: string;
  bestFor: string;
  icon: LucideIcon;
};

export type HubDef = {
  key: HubKey;
  to: string;
  label: string;
  icon: LucideIcon;
  tagline: string;
  intro: string;
  tools: ToolDef[];
};

export const HUBS: Record<HubKey, HubDef> = {
  "energy-cost": {
    key: "energy-cost",
    to: "/energy-cost",
    label: "Energy Cost Hub",
    icon: Zap,
    tagline: "Understand the real electricity cost of AI",
    intro:
      "Work out the electricity, cost and infrastructure footprint behind AI prompts, AI search and model training — using transparent UK assumptions.",
    tools: [
      {
        to: "/energy-cost/ai-electricity-cost-calculator",
        title: "AI Electricity Cost Calculator",
        desc: "Estimate the daily, monthly and annual electricity and cost of your AI prompts.",
        bestFor: "Individuals & teams sizing AI energy use",
        icon: Zap,
      },
      {
        to: "/energy-cost/ai-search-cost-calculator",
        title: "AI Search Cost Calculator",
        desc: "Compare the energy of AI search against traditional search across your user base.",
        bestFor: "Product & search teams",
        icon: Search,
      },
      {
        to: "/energy-cost/ai-model-training-calculator",
        title: "AI Model Training Cost Calculator",
        desc: "Estimate the energy, cost, carbon and infrastructure of training an AI model.",
        bestFor: "ML engineers & researchers",
        icon: Cpu,
      },
    ],
  },
  infrastructure: {
    key: "infrastructure",
    to: "/infrastructure",
    label: "Infrastructure Hub",
    icon: Network,
    tagline: "How AI reshapes the UK electricity network",
    intro:
      "Explore how data centre growth and AI adoption affect regional electricity demand, grid stress, jobs and infrastructure investment across the UK.",
    tools: [
      {
        to: "/infrastructure/ai-grid-impact-forecast",
        title: "AI Grid Impact Forecast Tool",
        desc: "Project regional demand growth, infrastructure needs and grid stress from AI.",
        bestFor: "Policy analysts & planners",
        icon: Network,
      },
      {
        to: "/infrastructure/ai-growth-zone-impact",
        title: "AI Growth Zone Impact Calculator",
        desc: "Estimate demand, jobs and investment from a proposed AI capacity build-out.",
        bestFor: "Local authorities & developers",
        icon: MapPin,
      },
      {
        to: "/infrastructure/data-centre-demand-calculator",
        title: "Data Centre Demand Calculator",
        desc: "Estimate annual electricity, water demand and household-equivalent use.",
        bestFor: "Data centre & infrastructure teams",
        icon: Server,
      },
    ],
  },
  business: {
    key: "business",
    to: "/business",
    label: "Business Hub",
    icon: TrendingUp,
    tagline: "Evaluate AI investment against energy costs",
    intro:
      "Help your business weigh the return, savings and readiness of AI adoption against rising energy costs — with clear, shareable numbers.",
    tools: [
      {
        to: "/business/ai-roi-calculator",
        title: "AI ROI Calculator",
        desc: "Calculate annual ROI, payback period and net benefit of AI investment.",
        bestFor: "Founders, finance & ops leaders",
        icon: TrendingUp,
      },
      {
        to: "/business/ai-energy-savings-calculator",
        title: "AI Energy Savings Calculator",
        desc: "Estimate annual savings, carbon reduction and payback from AI optimisation.",
        bestFor: "Sustainability & facilities teams",
        icon: PiggyBank,
      },
      {
        to: "/business/ai-readiness-assessment",
        title: "AI Readiness Assessment",
        desc: "Score your organisation's AI readiness and get tailored next steps.",
        bestFor: "Leadership & transformation teams",
        icon: ClipboardCheck,
      },
    ],
  },
};

export const ALL_TOOLS: ToolDef[] = Object.values(HUBS).flatMap((h) => h.tools);

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                     */
/* ------------------------------------------------------------------ */

const SITE = "https://aienergyintelligence.co.uk";

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `${SITE}${it.path}`,
      })),
    }),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    }),
  };
}

export function toolLd(name: string, path: string, description: string) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      url: `${SITE}${path}`,
      description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
      publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
    }),
  };
}

/* ------------------------------------------------------------------ */
/* Related tools block (shown on every calculator)                     */
/* ------------------------------------------------------------------ */

export function RelatedTools({ current }: { current: string }) {
  const related = ALL_TOOLS.filter((t) => t.to !== current).slice(0, 6);
  return (
    <SeoSection title="Related Tools">
      <p>Continue exploring the UK AI Energy Intelligence Centre.</p>
      <div className="mt-3 grid sm:grid-cols-2 gap-2">
        {related.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors"
          >
            <t.icon className="h-4 w-4 text-electric shrink-0" />
            <span className="font-semibold text-energy-ink text-sm">{t.title}</span>
            <ArrowRight className="ml-auto h-3.5 w-3.5 text-electric shrink-0" />
          </Link>
        ))}
      </div>
    </SeoSection>
  );
}

/* ------------------------------------------------------------------ */
/* Related downloads block                                             */
/* ------------------------------------------------------------------ */

export function RelatedDownloads() {
  return (
    <SeoSection title="Related Downloads">
      <p>Free UK AI energy resources from AI Energy Intelligence UK.</p>
      <ul className="mt-2 space-y-2">
        {[
          { label: "Free UK AI Energy Report", to: "/guides/ai-electricity-cost-calculator" },
          { label: "AI Electricity Cost Guide", to: "/guides/ai-electricity-cost-calculator" },
        ].map((d) => (
          <li key={d.label}>
            <Link
              to={d.to}
              className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors"
            >
              <Download className="h-4 w-4 text-electric shrink-0" />
              <span className="font-semibold text-energy-ink text-sm">{d.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SeoSection>
  );
}

/* ------------------------------------------------------------------ */
/* Lead capture wrapper (consistent block after results)               */
/* ------------------------------------------------------------------ */

export function ResultsLead({
  source,
  inputs,
  resultSummary,
}: {
  source: React.ComponentProps<typeof LeadCapture>["source"];
  inputs?: Record<string, unknown>;
  resultSummary?: Record<string, unknown>;
}) {
  return (
    <div className="rounded-2xl bg-energy-card p-2 md:p-3">
      <LeadCapture variant="results" source={source} inputs={inputs} resultSummary={resultSummary} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic hub landing page                                            */
/* ------------------------------------------------------------------ */

const ARTICLES: { title: string; href: string }[] = [];

export function HubLanding({ hub }: { hub: HubKey }) {
  const h = HUBS[hub];
  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: h.label },
        ]}
      />
      <EnergyHero eyebrow={h.tagline} title={h.label} intro={h.intro} icon={h.icon} />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        {/* Tool cards */}
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-4">Tools in this hub</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {h.tools.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex flex-col rounded-2xl bg-energy-card text-energy-ink p-6 border border-black/5 shadow-card hover:shadow-elegant transition-all"
              >
                <div className="rounded-lg bg-electric/10 p-2.5 w-fit">
                  <t.icon className="h-6 w-6 text-electric" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm text-energy-ink/70 leading-relaxed">{t.desc}</p>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-energy-ink/50">
                  {t.bestFor}
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-electric">
                  Open tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Articles */}
        <SeoSection title="Latest AI energy analysis">
          <ul className="mt-1 space-y-2">
            {ARTICLES.map((a) => (
              <li key={a.title}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-electric shrink-0" />
                  <span className="font-semibold text-energy-ink text-sm">{a.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </SeoSection>

        <RelatedDownloads />

        <RelatedReports
          categories={categoriesForToolPath(h.to)}
          title={`${h.label} — recommended reports`}
          intro="Deeper research to pair with the tools in this hub."
        />

        {/* Newsletter */}
        <div className="rounded-2xl bg-energy-card p-6 md:p-8">
          <h3 className="font-display text-lg font-bold text-energy-ink">Free UK AI Energy Report</h3>
          <p className="mt-1 text-sm text-energy-ink/70">
            Join the AI Energy Intelligence UK briefing for UK AI energy and infrastructure intelligence.
          </p>
          <div className="mt-4">
            <LeadCapture variant="newsletter" source={`${hub}-hub` as never} />
          </div>
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}

/* Re-export commonly used building blocks for tool pages */
export function ToolPageFooter({
  current,
  source,
  inputs,
  resultSummary,
}: {
  current: string;
  source: React.ComponentProps<typeof LeadCapture>["source"];
  inputs?: Record<string, unknown>;
  resultSummary?: Record<string, unknown>;
}): ReactNode {
  const tool = ALL_TOOLS.find((t) => t.to === current);
  return (
    <>
      {tool && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-energy-card p-4">
          <span className="text-sm font-medium text-energy-ink/80">
            Keep this result for later
          </span>
          <SaveToDashboardButton
            className="ml-auto"
            toolSlug={current}
            toolName={tool.title}
            inputs={inputs}
            resultSummary={resultSummary}
          />
        </div>
      )}
      <ResultsLead source={source} inputs={inputs} resultSummary={resultSummary} />
      <RelatedTools current={current} />
      <RelatedDownloads />
      <RelatedReports
        categories={categoriesForToolPath(current)}
        title="Go deeper with our research"
        intro="Reports and analysis that build on the numbers from this tool."
      />
    </>
  );
}
