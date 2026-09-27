import { createFileRoute } from "@tanstack/react-router";
import { Zap, Gauge, Leaf, Droplets } from "lucide-react";
import { HubPage } from "@/components/HubPage";
import researchHero from "@/assets/research-3.jpg";

export const Route = createFileRoute("/ai-energy/")({
  head: () => ({
    meta: [
      { title: "AI Energy Tools UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore how artificial intelligence consumes electricity and impacts carbon emissions, water demand and energy use across the UK.",
      },
      { property: "og:title", content: "AI Energy Tools UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "AI electricity, carbon and water tools to understand the energy impact of artificial intelligence.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy" }],
  }),
  component: () => (
    <HubPage
      eyebrow="AI Energy"
      title="AI Energy"
      intro="Explore how artificial intelligence consumes electricity and impacts carbon emissions, water demand and energy use."
      image={researchHero}
      imageAlt="Wind turbines and electricity pylons across the British countryside at dusk"
      tools={[
        {
          to: "/ai-energy-calculators/query-energy",
          icon: Zap,
          title: "AI Query Energy Calculator",
          desc: "Estimate the electricity your AI text, image and video usage consumes — in kWh and £.",
        },
        {
          to: "/ai-energy-calculators/vs-appliances",
          icon: Gauge,
          title: "AI Appliance Comparison Tool",
          desc: "See your AI energy use in everyday terms — kettles, tumble dryers and EV charges.",
        },
        {
          to: "/advanced-ai-energy-tools/carbon-impact",
          icon: Leaf,
          title: "AI Carbon Calculator",
          desc: "Estimate the carbon footprint of AI usage across prompts, images and video generation.",
        },
        {
          to: "/advanced-ai-energy-tools/water-usage",
          icon: Droplets,
          title: "AI Water Usage Calculator",
          desc: "Understand how AI workloads and data centre cooling translate into water demand pressure.",
        },
      ]}
      reportCategories={["ai-energy", "electricity-demand"]}
      reportTopics={["efficiency", "grid", "forecast"]}
    />
  ),
});
