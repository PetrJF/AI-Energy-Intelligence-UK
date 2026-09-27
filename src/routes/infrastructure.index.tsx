import { createFileRoute } from "@tanstack/react-router";
import { HubLanding, breadcrumbLd } from "@/components/energy/hub";
import { OG_TOOLS, ogImageMeta } from "@/lib/og-images";

export const Route = createFileRoute("/infrastructure/")({
  head: () => ({
    meta: [
      { title: "AI Infrastructure Hub — UK Grid & Data Centre Tools | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore how AI affects the UK electricity network. Free tools for grid impact forecasting, AI growth zones and data centre demand.",
      },
      { property: "og:title", content: "AI Infrastructure Hub | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Free UK tools for grid impact, AI growth zones and data centre electricity & water demand.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/infrastructure" },
      ...ogImageMeta(OG_TOOLS),
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/infrastructure" }],
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Infrastructure Hub", path: "/infrastructure" },
      ]),
    ],
  }),
  component: () => <HubLanding hub="infrastructure" />,
});
