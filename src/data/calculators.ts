export type Calculator = {
  slug: string;
  path: string;
  title: string;
  description: string;
  tags: string[]; // lowercase keywords for matching
};

export const CALCULATORS: Calculator[] = [
  {
    slug: "ai-electricity-cost",
    path: "/energy-cost/ai-electricity-cost-calculator",
    title: "AI Electricity Cost Calculator",
    description: "Estimate the electricity bill for running or training AI workloads in the UK.",
    tags: ["ai", "electricity", "cost", "energy", "bill", "kwh", "business", "supermarket"],
  },
  {
    slug: "ai-model-training",
    path: "/energy-cost/ai-model-training-calculator",
    title: "AI Model Training Cost Calculator",
    description: "Model GPU-hours, energy use and cost for training frontier and fine-tuned models.",
    tags: ["training", "gpu", "model", "ai", "compute", "energy"],
  },
  {
    slug: "ai-search-cost",
    path: "/energy-cost/ai-search-cost-calculator",
    title: "AI vs Traditional Search Cost Calculator",
    description: "Compare the electricity, water and cost of an AI answer vs a classic search query.",
    tags: ["search", "query", "google", "chatgpt", "ai", "water", "carbon"],
  },
  {
    slug: "ai-query-energy",
    path: "/ai-energy-calculators/query-energy",
    title: "AI Query Energy Calculator",
    description: "Convert prompts per day into kWh, cost and CO₂ for any AI assistant.",
    tags: ["query", "prompt", "chatgpt", "energy", "kwh", "co2"],
  },
  {
    slug: "ai-vs-appliances",
    path: "/ai-energy-calculators/vs-appliances",
    title: "AI vs Household Appliances",
    description: "See how AI usage compares against kettles, fridges, TVs and EVs.",
    tags: ["household", "appliance", "consumer", "compare", "everyday"],
  },
  {
    slug: "data-centre-electricity",
    path: "/ai-data-centre-electricity-calculator",
    title: "AI Data Centre Electricity Calculator",
    description: "Size the MW load, annual GWh and grid impact of a UK AI data centre.",
    tags: ["data centre", "datacentre", "data-centre", "mw", "grid", "infrastructure", "house prices"],
  },
  {
    slug: "data-centre-demand",
    path: "/infrastructure/data-centre-demand-calculator",
    title: "Data Centre Demand Calculator",
    description: "Forecast regional AI data centre demand and connection queue impact.",
    tags: ["data centre", "demand", "grid", "region", "infrastructure", "planning"],
  },
  {
    slug: "growth-zone-impact",
    path: "/ai-growth-zone-impact-calculator",
    title: "AI Growth Zone Impact Calculator",
    description: "Model jobs, GVA and power demand for a UK AI Growth Zone.",
    tags: ["growth zone", "policy", "region", "jobs", "gva", "planning"],
  },
  {
    slug: "demand-forecast",
    path: "/ai-energy-calculators/demand-forecast",
    title: "UK AI Electricity Demand Forecast",
    description: "Project national AI electricity demand to 2030 under different scenarios.",
    tags: ["forecast", "demand", "national", "grid", "2030", "policy"],
  },
  {
    slug: "ai-water",
    path: "/ai-water-consumption-calculator",
    title: "AI Water Consumption Calculator",
    description: "Estimate the litres of water AI workloads and data centres consume.",
    tags: ["water", "cooling", "data centre", "sustainability"],
  },
  {
    slug: "business-ai-roi",
    path: "/business/ai-roi-calculator",
    title: "Business AI ROI Calculator",
    description: "Model payback, savings and ROI on deploying AI in your business.",
    tags: ["business", "roi", "sme", "savings", "productivity"],
  },
  {
    slug: "business-ai-savings",
    path: "/business/ai-energy-savings-calculator",
    title: "Business AI Energy Savings Calculator",
    description: "Estimate how much energy — and money — AI can save your operation.",
    tags: ["business", "savings", "efficiency", "energy", "supermarket", "retail"],
  },
];

function scoreCalc(c: Calculator, haystack: string, topics: string[]): number {
  let score = 0;
  for (const t of c.tags) {
    if (topics.includes(t)) score += 10;
    if (haystack.includes(t)) score += 3;
  }
  return score;
}

export function pickRelatedCalculators({
  text = "",
  topics = [],
  excludeSlugs = [],
  limit = 3,
}: {
  text?: string;
  topics?: string[];
  excludeSlugs?: string[];
  limit?: number;
}): Calculator[] {
  const haystack = text.toLowerCase();
  const lcTopics = topics.map((t) => t.toLowerCase());
  const scored = CALCULATORS
    .filter((c) => !excludeSlugs.includes(c.slug))
    .map((c) => ({ c, s: scoreCalc(c, haystack, lcTopics) }))
    .sort((a, b) => b.s - a.s);
  const picks = scored.filter((x) => x.s > 0).slice(0, limit).map((x) => x.c);
  if (picks.length >= limit) return picks;
  // Fill with generic top calculators
  for (const c of CALCULATORS) {
    if (picks.length >= limit) break;
    if (!picks.includes(c) && !excludeSlugs.includes(c.slug)) picks.push(c);
  }
  return picks;
}
