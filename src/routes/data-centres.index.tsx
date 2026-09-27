import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Server, Building2, MapPin, Zap, LineChart, BookOpen, Newspaper } from "lucide-react";
import { HubPage } from "@/components/HubPage";
import dcHero from "@/assets/research-1.jpg";
import { publishedDcProjectsQueryOptions, publishedFacilityCount } from "@/lib/dc-projects.queries";

export const Route = createFileRoute("/data-centres/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedDcProjectsQueryOptions),
  head: () => ({
    meta: [
      { title: "UK Data Centre Intelligence | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Track AI infrastructure, data centre development and regional investment across the UK with specialist directories and impact tools.",
      },
      { property: "og:title", content: "UK Data Centre Intelligence | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "UK data centre directory, impact checker and AI investment map.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/data-centres" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/data-centres" }],
  }),
  component: DataCentresHub,
});

function DataCentresHub() {
  const { data: projects } = useSuspenseQuery(publishedDcProjectsQueryOptions);
  const projectCount = publishedFacilityCount(projects);
  return (
    <>
      <HubPage
        eyebrow="Data Centres"
        title="Data Centres"
         intro={`Track ${projectCount} published UK data-centre project records, development evidence and regional investment.`}
        image={dcHero}
        imageAlt="Aerial view of a large modern UK data centre campus surrounded by countryside"
        tools={[
          {
            to: "/uk-data-centre-tracker",
            icon: MapPin,
            title: "UK Data Centre Tracker",
            desc: "Verified register of UK data centre and AI infrastructure projects, with sources on every entry.",
          },
          {
            to: "/ai-growth-zones",
            icon: Zap,
            title: "UK AI Growth Zones",
            desc: "Every designated AI Growth Zone: investment, power, planning and a sourced progress timeline.",
          },
          {
            to: "/ai-energy-calculators/data-centres",
            icon: Server,
            title: "Data Centre Directory",
            desc: "Search a UK directory of AI-related data centres by region, status and energy pressure.",
          },
          {
            to: "/ai-infrastructure-tools/data-centre-impact",
            icon: Building2,
            title: "Data Centre Impact Checker",
            desc: "Assess the local impacts of a data centre on jobs, grid pressure and water demand.",
          },
          {
            to: "/ai-infrastructure-tools/investment-map",
            icon: MapPin,
            title: "AI Investment Map",
            desc: "Explore AI infrastructure investment and project locations across the UK.",
          },
        ]}
        reportCategories={["data-centres", "infrastructure"]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Research, index and news</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything else we publish on UK data centres — the index sub-index, analysis and the news feed.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link
            to="/uk-ai-energy-index/data-centre-growth"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elegant"
          >
            <LineChart className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-semibold">Data Centre Growth Index</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Sourced figures on UK data-centre capacity and the AI-capable build-out.
            </p>
          </Link>
          <Link
            to="/research/$topic"
            params={{ topic: "grid-infrastructure" }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elegant"
          >
            <BookOpen className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-semibold">Grid &amp; Infrastructure research</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Analysis and news on data centres, connection queues and grid capacity.
            </p>
          </Link>
          <Link
            to="/news"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elegant"
          >
            <Newspaper className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-semibold">UK AI energy news</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The latest reported developments across UK AI and energy infrastructure.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}

