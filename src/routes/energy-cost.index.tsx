import { createFileRoute } from "@tanstack/react-router";
import { HubLanding, breadcrumbLd } from "@/components/energy/hub";
import { OG_TOOLS, ogImageMeta } from "@/lib/og-images";

export const Route = createFileRoute("/energy-cost/")({
  head: () => ({
    meta: [
      { title: "AI Energy Cost Hub — Electricity & Cost Calculators | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Understand the real electricity and infrastructure costs of AI. Free UK calculators for AI prompts, AI search and model training energy and cost.",
      },
      { property: "og:title", content: "AI Energy Cost Hub | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Free UK calculators for the electricity and cost of AI prompts, search and model training.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/energy-cost" },
      ...ogImageMeta(OG_TOOLS),
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/energy-cost" }],
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Energy Cost Hub", path: "/energy-cost" },
      ]),
    ],
  }),
  component: () => <HubLanding hub="energy-cost" />,
});
