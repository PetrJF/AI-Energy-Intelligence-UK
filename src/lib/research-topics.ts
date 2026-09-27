// The five permanent research pillars for AI Energy Intelligence UK.
//
// Pillar landing pages are *curated filtered views* over material that already
// exists on the site — analysis, Index indicators, the data-centre tracker,
// tools and reports. They never create content and never show placeholders.
//
// URL slugs are unchanged from the previous three research topics so existing
// links keep working; `data-centres` is the one new page.

import type { LinkProps } from "@tanstack/react-router";

export type PillarLink = {
  to: LinkProps["to"];
  params?: Record<string, string>;
  label: string;
  note: string;
};

export type ResearchTopic = {
  slug: string;
  /** Visitor-facing pillar name */
  label: string;
  /** Value stored in blog_posts.pillar */
  pillarKey:
    | "ai-electricity-demand"
    | "data-centres"
    | "grid-infrastructure"
    | "policy-economics"
    | "water-environment";
  title: string;
  description: string;
  /** What the pillar covers — shown when there is little or no analysis yet. */
  scope: string[];
  /** Categories used on blog_posts (legacy values retained so nothing is lost) */
  blogCategories: string[];
  /** Categories used on news_articles */
  newsCategories: string[];
  /** UK AI Energy Index pages relevant to this pillar */
  indexLinks: PillarLink[];
  /** Data-centre tracker material relevant to this pillar */
  dataCentreLinks: PillarLink[];
  /** Calculators and tools relevant to this pillar */
  tools: PillarLink[];
  /** Report categories — only published reports are ever rendered */
  reportCategories: string[];
};

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    slug: "electricity-demand",
    label: "AI Electricity Demand",
    pillarKey: "ai-electricity-demand",
    title: "AI Electricity Demand — UK Research",
    description:
      "How much electricity artificial intelligence actually uses in Britain, what can be measured, what can only be modelled, and how the two are told apart.",
    scope: [
      "Total UK data-centre electricity consumption and the evidence behind each figure",
      "Why no official UK dataset separates AI demand from other data-centre demand",
      "Scenario modelling of future demand, with every assumption published",
      "The difference between measured statistics, estimates and forecasts",
    ],
    blogCategories: ["AI Electricity Demand", "AI & Energy", "AI & Energy Efficiency", "Electricity Demand"],
    newsCategories: ["Electricity Demand", "Energy Security", "Market Analysis"],
    indexLinks: [
      {
        to: "/uk-ai-energy-index/electricity-demand",
        label: "Index: electricity demand",
        note: "Published indicators with source, period and confidence level for each figure.",
      },
      {
        to: "/uk-ai-energy-index/methodology",
        label: "Index methodology",
        note: "How indicators are collected, classified and reviewed.",
      },
    ],
    dataCentreLinks: [],
    tools: [
      {
        to: "/ai-energy-calculators/data-centres",
        label: "Data-centre electricity calculator",
        note: "Convert IT capacity, utilisation and PUE into annual consumption.",
      },
      {
        to: "/ai-energy-calculators/query-energy",
        label: "AI query energy calculator",
        note: "Per-query energy under stated assumptions.",
      },
      {
        to: "/ai-energy-calculators/demand-forecast",
        label: "Demand forecast tool",
        note: "Scenario ranges rather than single-point predictions.",
      },
    ],
    reportCategories: ["ai-energy", "electricity-demand"],
  },
  {
    slug: "data-centres",
    label: "Data Centres",
    pillarKey: "data-centres",
    title: "Data Centres — UK Research",
    description:
      "Where UK data centres are being built, what has planning permission, and what the verified project record does and does not show.",
    scope: [
      "Verified records of announced, approved and operational UK projects",
      "Planning status, local authority decisions and appeal outcomes",
      "Water use, cooling and local environmental conditions",
      "Regional concentration and what it means for nearby communities",
    ],
    blogCategories: ["Data Centres"],
    newsCategories: ["Data Centres", "AI Infrastructure", "Cloud Computing"],
    indexLinks: [
      {
        to: "/uk-ai-energy-index/data-centre-growth",
        label: "Index: data-centre growth",
        note: "Capacity indicators with definitions and evidence status.",
      },
    ],
    dataCentreLinks: [
      {
        to: "/uk-data-centre-tracker",
        label: "UK data-centre tracker",
        note: "The project register behind our analysis. Partial by design, with a source on every record.",
      },
      {
        to: "/uk-data-centre-tracker/regions",
        label: "Projects by region",
        note: "Regional breakdown of the register.",
      },
      {
        to: "/ai-growth-zones",
        label: "AI Growth Zones",
        note: "Designated zones and the milestones recorded against them.",
      },
    ],
    tools: [
      {
        to: "/ai-water-consumption-calculator",
        label: "Water consumption calculator",
        note: "Modelled water use from cooling assumptions.",
      },
      {
        to: "/ai-data-centre-electricity-calculator",
        label: "Data-centre electricity calculator",
        note: "Site-level electricity demand from capacity inputs.",
      },
    ],
    reportCategories: ["data-centres"],
  },
  {
    slug: "grid-infrastructure",
    label: "Grid and Infrastructure",
    pillarKey: "grid-infrastructure",
    title: "Grid and Infrastructure — UK Research",
    description:
      "Whether Britain's transmission and distribution networks can physically deliver the power that AI compute is being planned around.",
    scope: [
      "Connection queues, connection reform and what the published timetables imply",
      "Network reinforcement programmes and who pays for them",
      "Regional constraint evidence and its confidence level",
      "Generation options put forward for AI load, including their delivery risk",
    ],
    blogCategories: ["Grid and Infrastructure", "Grid", "Infrastructure"],
    newsCategories: [
      "National Grid",
      "Grid Capacity",
      "Renewable Energy",
      "Nuclear",
      "Battery Storage",
    ],
    indexLinks: [
      {
        to: "/uk-ai-energy-index/grid-pressure",
        label: "Index: grid pressure",
        note: "Regional assessments, including where we hold insufficient evidence to rate.",
      },
    ],
    dataCentreLinks: [
      {
        to: "/uk-grid",
        label: "UK grid overview",
        note: "Network context behind the connection questions.",
      },
    ],
    tools: [
      {
        to: "/ai-grid-impact-forecast-tool",
        label: "Grid impact forecast tool",
        note: "Modelled load against regional headroom assumptions.",
      },
      {
        to: "/advanced-ai-energy-tools/grid-capacity",
        label: "Grid capacity modeller",
        note: "Scenario testing for connection capacity.",
      },
    ],
    reportCategories: ["infrastructure"],
  },
  {
    slug: "policy-investment",
    label: "Policy and Economics",
    pillarKey: "policy-economics",
    title: "Policy and Economics — UK Research",
    description:
      "The government decisions, regulation and money shaping how AI infrastructure is built in Britain — and who carries the cost.",
    scope: [
      "Government bodies and strategies, and what they have actually published",
      "Ofgem regulation, charging methodologies and cost allocation",
      "AI Growth Zone designations and their regional consequences",
      "Investment announcements, distinguished from investment delivered",
    ],
    blogCategories: ["Policy and Economics", "Policy", "Investment", "Government & Policy"],
    newsCategories: ["UK Energy Policy", "AI Regulation", "Investment"],
    indexLinks: [
      {
        to: "/uk-ai-energy-index",
        label: "UK AI Energy Index",
        note: "The full indicator set, its editions and its change log.",
      },
    ],
    dataCentreLinks: [
      {
        to: "/ai-growth-zones",
        label: "AI Growth Zones",
        note: "Designations and recorded milestones.",
      },
    ],
    tools: [
      {
        to: "/ai-growth-zone-impact-calculator",
        label: "Growth zone impact calculator",
        note: "Modelled regional effect of a designated zone.",
      },
      {
        to: "/advanced-ai-energy-tools/energy-cost-society",
        label: "Energy cost to society model",
        note: "Cost distribution under stated assumptions.",
      },
    ],
    reportCategories: ["government-policy"],
  },
  {
    slug: "water-environment",
    label: "Water, Emissions and Environment",
    pillarKey: "water-environment",
    title: "Water, Emissions and Environment — UK Research",
    description:
      "The environmental side of AI infrastructure in Britain: cooling water, carbon accounting, local impact and what is — and is not — published about any of it.",
    scope: [
      "Cooling water demand, and why UK per-site figures are rarely published",
      "Carbon accounting for data-centre load, including how grid intensity is applied",
      "Local environmental conditions attached to planning permissions",
      "Where a claim rests on modelled assumptions rather than measurement",
    ],
    blogCategories: ["Water and Environment", "Water", "Environment", "Emissions", "Sustainability"],
    newsCategories: ["Water", "Environment", "Sustainability", "Carbon"],
    indexLinks: [
      {
        to: "/uk-ai-energy-index",
        label: "UK AI Energy Index",
        note: "Indicator set, editions and change log — including where evidence is insufficient to rate.",
      },
    ],
    dataCentreLinks: [
      {
        to: "/uk-data-centre-tracker",
        label: "UK data-centre tracker",
        note: "Project records with planning references, where cooling and environmental conditions are documented.",
      },
    ],
    tools: [
      {
        to: "/ai-water-consumption-calculator",
        label: "Water consumption calculator",
        note: "Modelled cooling water use from stated assumptions.",
      },
      {
        to: "/advanced-ai-energy-tools/carbon-impact",
        label: "Carbon impact model",
        note: "Emissions from modelled load and grid intensity.",
      },
    ],
    reportCategories: ["environment", "water"],
  },
];

export function findResearchTopic(slug: string): ResearchTopic | undefined {
  return RESEARCH_TOPICS.find((t) => t.slug === slug);
}

export function pillarBySlugKey(key: string | null | undefined): ResearchTopic | undefined {
  if (!key) return undefined;
  return RESEARCH_TOPICS.find((t) => t.pillarKey === key);
}
