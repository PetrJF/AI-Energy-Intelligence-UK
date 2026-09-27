import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Network, Activity, Landmark } from "lucide-react";
import { HubPage } from "@/components/HubPage";
import gridHero from "@/assets/uk-grid.jpg";

export const Route = createFileRoute("/uk-grid/")({
  head: () => ({
    meta: [
      { title: "UK Electricity Grid & AI Demand Tools | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Understand how AI growth may affect electricity networks, substations, capacity planning and infrastructure investment across the UK.",
      },
      { property: "og:title", content: "UK Electricity Grid & AI Demand Tools | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "AI demand forecasting, grid capacity and electricity demand modelling for the UK.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/uk-grid" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/uk-grid" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "UK Electricity Grid & AI Demand Tools",
          url: "https://aienergyintelligence.co.uk/uk-grid",
          description:
            "Understand how AI growth may affect electricity networks, substations, capacity planning and infrastructure investment across the UK.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              { name: "AI Demand Forecast Tool", url: "/ai-energy-calculators/demand-forecast" },
              { name: "Grid Capacity Checker", url: "/advanced-ai-energy-tools/grid-capacity" },
              { name: "Electricity Demand Modeller", url: "/advanced-ai-energy-tools/demand-modeller" },
              { name: "Energy Cost To Society Calculator", url: "/advanced-ai-energy-tools/energy-cost-society" },
            ].map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: `https://aienergyintelligence.co.uk${t.url}`,
            })),
          },
        }),
      },
    ],
  }),
  component: () => (
    <HubPage
      eyebrow="UK Electricity Grid"
      title="UK Electricity Grid"
      intro="Understand how AI growth may affect electricity networks, substations, capacity planning and infrastructure investment."
      image={gridHero}
      imageAlt="UK electricity substation with transformers and pylons at golden hour"
      tools={[
        {
          to: "/ai-energy-calculators/demand-forecast",
          icon: LineChart,
          title: "AI Demand Forecast Tool",
          desc: "Explore how AI adoption could shift UK electricity demand from 2026 to 2035.",
        },
        {
          to: "/advanced-ai-energy-tools/grid-capacity",
          icon: Network,
          title: "Grid Capacity Checker",
          desc: "See how AI growth may affect regional electricity networks, substations and connections.",
        },
        {
          to: "/advanced-ai-energy-tools/demand-modeller",
          icon: Activity,
          title: "Electricity Demand Modeller",
          desc: "Model long-term electricity demand to 2040 across adoption, population and electrification.",
        },
        {
          to: "/advanced-ai-energy-tools/energy-cost-society",
          icon: Landmark,
          title: "Energy Cost To Society Calculator",
          desc: "Explore the wider infrastructure investment pressure created by large-scale AI deployment.",
        },
      ]}
      reportCategories={["electricity-demand", "infrastructure"]}
    />
  ),
});
