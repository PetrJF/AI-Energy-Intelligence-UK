import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, MapPin, ShieldCheck } from "lucide-react";
import heroBgAsset from "@/assets/ai-energy-hero-bg.jpg.asset.json";
import { RealPipelineSignup } from "@/components/dc/RealPipelineSignup";
import {
  publishedDcProjectsQueryOptions,
  publishedFacilityCount,
} from "@/lib/dc-projects.queries";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedDcProjectsQueryOptions),
  head: () => ({
    meta: [
      { title: "UK Data Centre Reality Scores & Real Pipeline" },
      { name: "description", content: "Independent UK data-centre intelligence: Reality Scores, public evidence and the projects most likely to be built." },
      { property: "og:title", content: "UK Data Centre Reality Scores & Real Pipeline" },
      { property: "og:description", content: "Independent UK data-centre intelligence: Reality Scores, public evidence and the projects most likely to be built." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/cb5bb0de-af7f-4f36-8511-f3d6dc02c94a" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/cb5bb0de-af7f-4f36-8511-f3d6dc02c94a" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/" }],
  }),
  component: Home,
});

function Home() {
  const { data: projects } = useSuspenseQuery(publishedDcProjectsQueryOptions);
  const count = publishedFacilityCount(projects);
  return (
    <>
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-energy-deep text-electric-foreground">
        <img src={heroBgAsset.url} alt="UK electricity transmission infrastructure" width={1920} height={1088} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-energy-deep/85" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">The Real Pipeline</p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              £100bn of UK data centres announced. We tell you which ones are real.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-electric-foreground/75">
              Every project gets a Reality Score: planning, grid, funding, delivery team and momentum, each backed by public evidence. For firms selling into the build-out, it&rsquo;s the difference between chasing headlines and chasing contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/uk-data-centre-tracker" className="inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-semibold text-electric-foreground transition-opacity hover:opacity-90">
                See the Real Pipeline <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center rounded-md border border-electric-foreground/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-electric-foreground/10">
                Book a Market Entry Sprint
              </Link>
            </div>
            <p className="mt-8 text-sm text-electric-foreground/55">
              {count} published UK data-centre project records · Independent · Public evidence only
            </p>
          </div>
        </div>
      </section>
      <RealPipelineSignup id="real-pipeline-signup" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BarChart3, title: "Reality Scores", body: "Compare projects by planning, grid, funding, team and momentum.", to: "/reality-score" as const, label: "How scoring works" },
            { icon: MapPin, title: "The Real Pipeline", body: "Filter the published project register and focus on the strongest opportunities.", to: "/uk-data-centre-tracker" as const, label: "Open the tracker" },
            { icon: ShieldCheck, title: "Market entry support", body: "Turn public evidence into a practical UK target list and route to market.", to: "/services" as const, label: "View services" },
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <item.icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <Link to={item.to} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                {item.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}