import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Wallet, LayoutDashboard } from "lucide-react";
import { HubPage } from "@/components/HubPage";
import scenarioHero from "@/assets/research-2.jpg";

export const Route = createFileRoute("/future-scenarios/")({
  head: () => ({
    meta: [
      { title: "AI Future Scenarios & Infrastructure Risk | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore possible AI growth futures and understand their implications for UK energy systems and infrastructure.",
      },
      { property: "og:title", content: "AI Future Scenarios & Infrastructure Risk | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Infrastructure risk assessment, spending tracking and scenario comparison for AI growth futures.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/future-scenarios" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/future-scenarios" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Future Scenarios"
      title="Future Scenarios"
      intro="Explore possible AI growth futures and understand their implications for energy systems and infrastructure."
      image={scenarioHero}
      imageAlt="Glowing server racks with blue indicator lights in a data centre aisle"
      tools={[
        {
          to: "/ai-infrastructure-tools/risk-assessment",
          icon: ShieldAlert,
          title: "Infrastructure Risk Assessment",
          desc: "Model capacity and grid pressure risks across conservative to aggressive AI growth scenarios.",
        },
        {
          to: "/ai-infrastructure-tools/spending-tracker",
          icon: Wallet,
          title: "Infrastructure Spending Tracker",
          desc: "Track AI infrastructure spending and investment across the UK.",
        },
        {
          to: "/advanced-ai-energy-tools/scenario-comparison",
          icon: LayoutDashboard,
          title: "Scenario Comparison Dashboard",
          desc: "Compare conservative, moderate and aggressive AI growth futures side by side.",
        },
      ]}
      reportCategories={["electricity-demand", "government-policy", "infrastructure"]}
    />
  ),
});
