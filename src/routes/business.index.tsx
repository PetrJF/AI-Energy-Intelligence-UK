import { createFileRoute } from "@tanstack/react-router";
import { HubLanding, breadcrumbLd } from "@/components/energy/hub";
import { OG_TOOLS, ogImageMeta } from "@/lib/og-images";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { title: "AI Business Hub — ROI, Savings & Readiness Tools | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Evaluate AI investment versus energy costs. Free UK tools for AI ROI, energy savings and an AI readiness assessment for your business.",
      },
      { property: "og:title", content: "AI Business Hub | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Free UK tools for AI ROI, energy savings and business AI readiness.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/business" },
      ...ogImageMeta(OG_TOOLS),
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/business" }],
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Business Hub", path: "/business" },
      ]),
    ],
  }),
  component: () => <HubLanding hub="business" />,
});
