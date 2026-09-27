export type Verdict =
  | "Mostly true"
  | "Partly true"
  | "Misleading"
  | "Mostly false"
  | "Unclear"
  | "Depends on scale";

export type Confidence = "High" | "Medium" | "Low";

export type MythCategory =
  | "Electricity"
  | "Grid impact"
  | "Carbon"
  | "Water"
  | "Data centres"
  | "UK policy"
  | "Business cost"
  | "Consumer bills";

export type ToolKey =
  | "cost"
  | "datacentre"
  | "water"
  | "growthzone"
  | "forecast";

export const TOOL_LINKS: Record<ToolKey, { label: string; to: string }> = {
  cost: { label: "AI Electricity Cost Calculator", to: "/guides/ai-electricity-cost-calculator" },
  datacentre: { label: "AI Data Centre Electricity Calculator", to: "/ai-data-centre-electricity-calculator" },
  water: { label: "AI Water Consumption Calculator", to: "/ai-water-consumption-calculator" },
  growthzone: { label: "AI Growth Zone Impact Calculator", to: "/ai-growth-zone-impact-calculator" },
  forecast: { label: "AI Grid Impact Forecast Tool", to: "/ai-grid-impact-forecast-tool" },
};

export interface Myth {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: Confidence;
  categories: MythCategory[];
  short: string;
  whyBelieve: string;
  evidence: string;
  ukRelevance: string;
  tools: ToolKey[];
  articles: { label: string; href: string }[];
  nextQuestion: string;
}

const ART = {
  datacentres: {
    label: "Latest UK AI energy news",
    href: "/news",
  },
};

export const MYTHS: Myth[] = [
  {
    id: "ai-uses-more-than-realised",
    claim: "AI uses more electricity than most people realise.",
    verdict: "Mostly true",
    confidence: "Medium",
    categories: ["Electricity", "Data centres"],
    short:
      "Most everyday users never see the electricity behind an AI response. The compute, cooling and supporting infrastructure add up, especially at national scale.",
    whyBelieve:
      "People interact with AI through a phone or laptop that draws very little power, so the energy cost feels invisible. Headlines about data centre demand then create a sense of a hidden, surprising footprint.",
    evidence:
      "A single AI query is small in isolation, but the servers, cooling systems and 24/7 operation behind large models consume meaningful electricity. As usage scales to billions of requests and new data centres are built, total AI-related demand becomes significant. Independent analyses suggest data centre electricity use is rising notably, with AI a growing share. The exact figures vary widely depending on model size, hardware efficiency and how demand is measured, so 'more than people realise' is fair as a direction of travel rather than a precise number.",
    ukRelevance:
      "For Britain this matters because new AI data centres need substantial grid connections that can take years to secure, and concentrated demand affects local infrastructure, planning and the path to net zero. Understanding the true footprint helps businesses and policymakers plan rather than be surprised.",
    tools: ["cost", "datacentre", "forecast"],
    articles: [ART.datacentres],
    nextQuestion: "Is AI electricity demand too small to matter?",
  },
  {
    id: "prompt-vs-phone-charge",
    claim: "A single AI prompt uses as much electricity as charging a phone.",
    verdict: "Misleading",
    confidence: "Medium",
    categories: ["Electricity"],
    short:
      "This comparison is usually exaggerated. A typical text prompt uses a tiny fraction of a phone charge, though heavy image or video generation uses more.",
    whyBelieve:
      "Viral comparisons make abstract energy figures relatable, and they spread quickly because they sound dramatic. Some early estimates also mixed up training energy with per-query energy.",
    evidence:
      "Estimates for a single text prompt are typically a small number of watt-hours or less, while charging a phone is roughly 10–20 watt-hours. So a routine prompt is generally well below a full phone charge. The picture changes for large image or video generation, which can use considerably more per request. The honest answer is 'it depends on the task': simple text is small, rich media is larger, and totals across millions of users are what really add up.",
    ukRelevance:
      "For UK readers and journalists, the risk is that a catchy but wrong comparison shapes public debate and policy. Accurate per-task figures matter when estimating household and business AI footprints and when modelling national demand.",
    tools: ["cost"],
    articles: [ART.datacentres],
    nextQuestion: "Is AI energy use mainly caused by model training?",
  },
  {
    id: "ai-power-cuts",
    claim: "AI data centres will cause power cuts in the UK.",
    verdict: "Unclear",
    confidence: "Low",
    categories: ["Grid impact", "Data centres"],
    short:
      "There is no clear evidence AI data centres will directly cause blackouts, but concentrated demand can strain local grids if connections and reinforcement do not keep pace.",
    whyBelieve:
      "Stories about large grid connection requests and constrained networks make power cuts feel like a logical next step, and the scale of proposed projects is genuinely large.",
    evidence:
      "Power cuts usually result from faults, extreme weather or supply-demand imbalances, not a single category of user. The grid is actively managed and new large connections go through planning and reinforcement processes. The real risk is local: where many large loads cluster faster than network upgrades, connection queues and constraints grow. Whether this translates into reliability problems depends on investment, planning speed and how flexibly data centres operate. So the claim is plausible at extreme scale but far from certain.",
    ukRelevance:
      "Britain's connection queue and regional network limits are central here. AI Growth Zones, National Grid upgrades and where data centres locate will determine whether local strain becomes a real reliability issue.",
    tools: ["forecast", "growthzone", "datacentre"],
    articles: [ART.datacentres],
    nextQuestion: "Is the UK grid ready for unlimited AI growth?",
  },
  {
    id: "force-new-power-stations",
    claim: "AI will force Britain to build more power stations.",
    verdict: "Depends on scale",
    confidence: "Medium",
    categories: ["Grid impact", "UK policy"],
    short:
      "At modest growth, efficiency and existing plans may absorb AI demand. At high-growth scenarios, additional generation, renewables or storage may be needed.",
    whyBelieve:
      "Large headline demand figures naturally suggest new supply is required, and AI is often discussed alongside ambitious data centre expansion.",
    evidence:
      "Whether new generation is needed depends on how fast AI demand grows versus efficiency gains and planned capacity additions. In lower scenarios, improving chip efficiency, better PUE and existing pipeline projects can help. In high or extreme scenarios, AI demand can reach the scale of one or more large power stations' output, which may require new generation, renewables, grid-scale storage or dedicated infrastructure. It is a question of scale and timing rather than a simple yes or no.",
    ukRelevance:
      "This ties directly to UK energy strategy, renewable build-out, planning reform and carbon targets. Scenario modelling helps show when AI shifts from a manageable load to a national planning factor.",
    tools: ["forecast", "growthzone"],
    articles: [ART.datacentres],
    nextQuestion: "Can renewable energy alone easily power AI growth?",
  },
  {
    id: "data-centres-water",
    claim: "Data centres use huge amounts of water.",
    verdict: "Partly true",
    confidence: "Medium",
    categories: ["Water", "Data centres"],
    short:
      "Some data centres use significant water for cooling, but consumption varies enormously by cooling design, climate and whether evaporative cooling is used.",
    whyBelieve:
      "Reports of large water use at specific sites in hot climates get widely shared and applied to all data centres, even though designs differ.",
    evidence:
      "Water use depends heavily on cooling method. Evaporative cooling can consume substantial water, while closed-loop liquid cooling and air cooling use far less. Climate matters too: hotter regions lean on water-intensive cooling more often. Many operators are moving towards designs that cut water use, and some report water consumption directly. So 'huge amounts' is true for some facilities and overstated for others. The headline figure for any site depends on its specific design and location.",
    ukRelevance:
      "In the UK, cooler temperatures reduce the need for water-intensive cooling compared with hotter regions, but local water stress, planning and environmental rules still make water use a relevant consideration for new data centres.",
    tools: ["water", "datacentre"],
    articles: [ART.datacentres],
    nextQuestion: "Is AI clean because it is digital?",
  },
  {
    id: "ai-clean-digital",
    claim: "AI is clean because it is digital.",
    verdict: "Mostly false",
    confidence: "High",
    categories: ["Carbon", "Electricity"],
    short:
      "Digital does not mean energy-free. AI runs on physical hardware in data centres that draw electricity and, depending on the grid, produce carbon emissions.",
    whyBelieve:
      "Because AI has no visible exhaust or smoke and lives 'in the cloud', it feels intangible and therefore clean.",
    evidence:
      "Every AI computation runs on physical servers that consume electricity and require cooling. The carbon footprint depends on the electricity source: on a low-carbon grid emissions are lower, on a fossil-heavy grid they are higher. Manufacturing the hardware also carries an embodied footprint. So while AI can be relatively low-carbon when powered by renewables, it is not inherently clean simply because it is digital. The 'clean cloud' framing hides a real, physical energy system.",
    ukRelevance:
      "The UK grid's carbon intensity changes over time and by hour, so AI's footprint in Britain depends on when and where compute runs. This connects to carbon targets, renewable supply and data centre siting.",
    tools: ["datacentre", "cost"],
    articles: [ART.datacentres],
    nextQuestion: "Could AI help the grid as well as stress it?",
  },
  {
    id: "demand-too-small",
    claim: "AI electricity demand is too small to matter.",
    verdict: "Misleading",
    confidence: "Medium",
    categories: ["Electricity", "Grid impact"],
    short:
      "Per query the energy is small, but aggregate and concentrated AI demand is growing fast enough to matter for grid planning and infrastructure.",
    whyBelieve:
      "Looking at a single prompt's tiny energy cost makes the whole topic seem trivial, especially compared with heating or transport.",
    evidence:
      "Individual queries are indeed small, but national-scale AI infrastructure is not. Data centre electricity use is a rising share of demand in several countries, and AI is accelerating that trend. Concentrated loads create local grid pressure even when the national percentage looks modest. Dismissing AI demand as 'too small' ignores both growth rates and the clustering of large facilities. The truthful framing is that it is small per use but increasingly significant in aggregate.",
    ukRelevance:
      "For Britain, the issue is concentration: large connections in specific regions can strain local networks well before AI is a large share of total national demand.",
    tools: ["forecast", "datacentre"],
    articles: [ART.datacentres],
    nextQuestion: "Does AI use more electricity than most people realise?",
  },
  {
    id: "ai-not-paying-full-cost",
    claim: "AI companies are not paying the full energy cost of their services.",
    verdict: "Partly true",
    confidence: "Low",
    categories: ["Business cost", "UK policy"],
    short:
      "It is complex. Companies pay for electricity they use, but wider system costs, grid reinforcement and external impacts are not always fully reflected in prices.",
    whyBelieve:
      "Concerns about who pays for grid upgrades and whether large users carry their share of network costs fuel this view.",
    evidence:
      "Large electricity users do pay for the power they consume, often at negotiated rates. The debate is about wider costs: network reinforcement, balancing, and external impacts such as carbon and local infrastructure. How these are allocated between large users, other businesses and households depends on regulation and tariff design. There is genuine policy discussion about whether current arrangements fully capture these costs. So the claim has merit in parts but is not a simple case of companies avoiding payment.",
    ukRelevance:
      "Ofgem rules, connection charging and network cost allocation are live UK issues. How costs are shared affects business competitiveness, household bills and the pace of grid investment.",
    tools: ["growthzone", "forecast"],
    articles: [ART.datacentres],
    nextQuestion: "Will AI increase household energy bills?",
  },
  {
    id: "growth-zones-local-grids",
    claim: "AI Growth Zones will put pressure on local grids.",
    verdict: "Mostly true",
    confidence: "Medium",
    categories: ["Grid impact", "UK policy", "Data centres"],
    short:
      "Concentrating large AI data centres in specific zones increases local demand significantly, which can stress nearby grid infrastructure without reinforcement.",
    whyBelieve:
      "The whole point of growth zones is to cluster large loads, so the logic of local pressure is intuitive and broadly correct.",
    evidence:
      "AI Growth Zones aim to accelerate data centre development by improving planning and grid access in chosen areas. Concentrating hundreds of megawatts of demand in one region naturally increases local network load. Whether this becomes a problem depends on coordinated reinforcement, generation nearby and flexible operation. With good planning, zones can be served efficiently; without it, local constraints and connection queues grow. So local pressure is real, but its severity depends on accompanying investment.",
    ukRelevance:
      "This is directly about UK policy. Growth zones, National Grid upgrades and regional planning determine whether clustering delivers efficient growth or local strain.",
    tools: ["growthzone", "forecast", "datacentre"],
    articles: [ART.datacentres],
    nextQuestion: "Is the UK grid ready for unlimited AI growth?",
  },
  {
    id: "renewables-alone",
    claim: "Renewable energy alone can easily power AI growth.",
    verdict: "Misleading",
    confidence: "Medium",
    categories: ["Carbon", "Grid impact"],
    short:
      "Renewables can power a lot of AI, but 'easily' overlooks intermittency, grid connection limits, storage needs and the 24/7 nature of data centre demand.",
    whyBelieve:
      "Strong growth in renewables and corporate clean-energy pledges create optimism that supply can simply scale to match AI.",
    evidence:
      "Renewables are essential and increasingly cheap, but AI data centres run continuously while wind and solar are variable. Matching constant demand with intermittent supply needs storage, grid flexibility, interconnection and sometimes firm low-carbon generation. Connection queues and network capacity also constrain how fast new renewable supply reaches large loads. So renewables can power much of AI growth over time, but 'easily' understates the system challenges involved. It is achievable with investment and planning, not automatic.",
    ukRelevance:
      "Britain's renewable expansion, storage build-out, interconnectors and grid reform all shape how realistically clean energy can keep pace with AI demand.",
    tools: ["forecast", "growthzone"],
    articles: [ART.datacentres],
    nextQuestion: "Will AI force Britain to build more power stations?",
  },
  {
    id: "household-bills",
    claim: "AI will increase household energy bills.",
    verdict: "Unclear",
    confidence: "Low",
    categories: ["Consumer bills", "UK policy"],
    short:
      "It depends on policy and scale. Rising demand and network costs could add pressure, but new generation, efficiency and cost allocation rules could offset it.",
    whyBelieve:
      "Any large new source of demand raises understandable fears about prices, especially after recent energy cost volatility.",
    evidence:
      "Household bills are shaped by wholesale prices, network charges, policy costs and supply. Large new demand can influence wholesale prices and network investment, which could feed into bills. But the net effect depends on how much new low-cost generation is added, how network costs are allocated between users, and efficiency improvements. It is entirely possible for bills to be largely unaffected, or even helped, if AI investment accelerates cheaper clean generation. So the honest verdict is genuinely uncertain.",
    ukRelevance:
      "UK tariff design, Ofgem decisions on network cost allocation, and the pace of clean generation are the key variables for British households.",
    tools: ["forecast", "growthzone"],
    articles: [ART.datacentres],
    nextQuestion: "Are AI companies paying the full energy cost of their services?",
  },
  {
    id: "efficient-chips-solve",
    claim: "Efficient AI chips will solve the energy problem.",
    verdict: "Partly true",
    confidence: "Medium",
    categories: ["Electricity", "Data centres"],
    short:
      "Efficiency gains genuinely cut energy per task, but rising usage can offset savings — a rebound effect where cheaper compute drives much more of it.",
    whyBelieve:
      "Each new chip generation is markedly more efficient, so it feels like efficiency alone will keep total demand in check.",
    evidence:
      "Hardware efficiency has improved dramatically and reduces the energy needed per computation. However, history shows that cheaper, faster compute often leads to far more usage — the rebound or Jevons effect. If demand grows faster than efficiency improves, total energy use can still rise. Efficiency is necessary and helpful, but on its own it rarely 'solves' an energy problem driven by exploding demand. It must be paired with clean supply, smart siting and demand management.",
    ukRelevance:
      "For the UK, efficiency lowers the energy intensity of each data centre but does not remove the need for grid planning if overall AI adoption keeps climbing.",
    tools: ["datacentre", "forecast"],
    articles: [ART.datacentres],
    nextQuestion: "Is AI energy use mainly caused by model training?",
  },
  {
    id: "like-office-buildings",
    claim: "AI data centres are just like normal office buildings.",
    verdict: "Mostly false",
    confidence: "High",
    categories: ["Data centres", "Grid impact"],
    short:
      "AI data centres draw far more power per square metre than offices, run continuously, and need specialised cooling and large grid connections.",
    whyBelieve:
      "Both are large buildings full of computers, so they can look superficially similar from the outside.",
    evidence:
      "An office building's electricity use is modest and intermittent. An AI data centre packs dense racks of high-power GPUs running around the clock, with power densities orders of magnitude higher than an office. They need dedicated cooling, redundant power and grid connections that can reach hundreds of megawatts. Their demand profile, infrastructure requirements and grid impact are completely different. Treating them as equivalent badly understates their energy and planning implications.",
    ukRelevance:
      "This matters for UK planning and grid connection processes, which must treat large data centres as major energy infrastructure rather than ordinary commercial buildings.",
    tools: ["datacentre", "growthzone"],
    articles: [ART.datacentres],
    nextQuestion: "Will AI Growth Zones put pressure on local grids?",
  },
  {
    id: "mainly-training",
    claim: "AI energy use is mainly caused by model training.",
    verdict: "Misleading",
    confidence: "Medium",
    categories: ["Electricity", "Data centres"],
    short:
      "Training is energy-intensive but happens occasionally. Serving models to millions of users (inference) can dominate total energy over a model's life.",
    whyBelieve:
      "Training large models grabs headlines with big one-off energy figures, so it feels like the main cost.",
    evidence:
      "Training a large model is a significant, concentrated energy event. But once trained, a popular model answers vast numbers of queries, and this ongoing inference can accumulate more total energy than the original training over time. The balance depends on model popularity, usage patterns and how often models are retrained. Focusing only on training misses the steady, large energy cost of everyday use. Both matter, and for widely used models inference is often the bigger long-run factor.",
    ukRelevance:
      "For UK demand forecasting, this means sustained inference load — not just occasional training runs — drives the continuous grid demand data centres place on the network.",
    tools: ["cost", "forecast"],
    articles: [ART.datacentres],
    nextQuestion: "Will most AI energy use come from everyday AI usage?",
  },
  {
    id: "everyday-usage",
    claim: "Most AI energy use will come from everyday AI usage.",
    verdict: "Depends on scale",
    confidence: "Low",
    categories: ["Electricity"],
    short:
      "As AI becomes embedded in everyday tools, inference at massive scale could dominate energy use — but this depends on adoption, efficiency and usage patterns.",
    whyBelieve:
      "AI is being built into search, office tools and apps, so ubiquitous everyday use seems likely to dominate.",
    evidence:
      "If AI features become standard in widely used products, the cumulative energy of billions of small interactions could outweigh occasional training. But the outcome depends on adoption rates, how efficient inference becomes, whether usage is light or heavy (text versus video), and how aggressively features are deployed. It is a plausible trajectory rather than a certainty. The key variable is scale: light adoption keeps everyday use modest, mass embedding makes it dominant.",
    ukRelevance:
      "UK demand scenarios hinge on how deeply AI is embedded in mainstream consumer and business tools, which shapes the baseline load on data centres.",
    tools: ["forecast", "cost"],
    articles: [ART.datacentres],
    nextQuestion: "Is AI energy use mainly caused by model training?",
  },
  {
    id: "ai-helps-grid",
    claim: "AI could help the grid as well as stress it.",
    verdict: "Mostly true",
    confidence: "Medium",
    categories: ["Grid impact", "UK policy"],
    short:
      "AI can improve grid forecasting, balancing and flexibility, and large data centres can offer demand response — alongside the demand pressure they create.",
    whyBelieve:
      "The debate often focuses only on AI as a load, but operators and grid bodies increasingly use AI tools for optimisation.",
    evidence:
      "AI can improve demand forecasting, optimise renewable integration, detect faults and help balance supply and demand. Large flexible data centres can also shift or curtail load to support the grid at peak times. These benefits are real but do not cancel the demand AI adds. The net effect depends on whether flexibility and optimisation are actually deployed. So AI is genuinely double-edged: a growing load that can also be part of a smarter, more flexible energy system.",
    ukRelevance:
      "Britain's push for a smarter, flexible grid and demand-side response makes AI's helpful role relevant to National Grid operations and net zero goals.",
    tools: ["forecast", "growthzone"],
    articles: [ART.datacentres],
    nextQuestion: "Is the UK grid ready for unlimited AI growth?",
  },
  {
    id: "grid-ready-unlimited",
    claim: "The UK grid is ready for unlimited AI growth.",
    verdict: "Mostly false",
    confidence: "High",
    categories: ["Grid impact", "UK policy"],
    short:
      "No grid is ready for 'unlimited' growth. Connection queues, regional constraints and reinforcement timelines mean AI growth needs planning and investment.",
    whyBelieve:
      "Confidence in the grid's reliability and ambitious AI investment announcements can create an impression of unlimited capacity.",
    evidence:
      "The UK grid is robust but finite. There are well-documented connection queues, regional capacity constraints and multi-year timelines for reinforcement and new transmission. 'Unlimited' growth is not something any grid can absorb without planning, investment and reform. Britain is actively working on connection reform and network upgrades, but capacity must be built and coordinated. So the grid can support substantial, well-planned AI growth, but the idea of unlimited, frictionless capacity is not realistic.",
    ukRelevance:
      "This is central to UK policy: connection reform, transmission investment, AI Growth Zones and planning all determine how much AI growth the grid can actually accommodate.",
    tools: ["forecast", "growthzone", "datacentre"],
    articles: [ART.datacentres],
    nextQuestion: "Will AI Growth Zones put pressure on local grids?",
  },
  {
    id: "forecasts-certain",
    claim: "AI energy forecasts are certain.",
    verdict: "Mostly false",
    confidence: "High",
    categories: ["Electricity", "UK policy"],
    short:
      "AI energy forecasts vary widely because they depend on uncertain assumptions about adoption, efficiency, hardware, policy and data centre build-out.",
    whyBelieve:
      "Confident-sounding headline numbers and official-looking charts can make forecasts seem precise and settled.",
    evidence:
      "Forecasts of AI energy demand differ enormously between sources because small changes in assumptions — growth rates, chip efficiency, adoption, usage mix, data centre locations and policy — produce very different outcomes. Many published figures are scenarios, not predictions. This is why credible analysis presents ranges and clearly states assumptions. Treating any single forecast as certain misrepresents genuine uncertainty. The responsible approach is scenario modelling with transparent inputs, which is exactly why estimates should be read as indicative.",
    ukRelevance:
      "UK planning should use scenario ranges rather than single numbers, because grid investment and policy decisions depend on assumptions that can change quickly.",
    tools: ["forecast"],
    articles: [ART.datacentres],
    nextQuestion: "Why do different sources give different AI energy estimates?",
  },
];

export const ALL_CATEGORIES: MythCategory[] = [
  "Electricity",
  "Grid impact",
  "Carbon",
  "Water",
  "Data centres",
  "UK policy",
  "Business cost",
  "Consumer bills",
];

export const VERDICT_STYLES: Record<Verdict, string> = {
  "Mostly true": "bg-green-100 text-green-800 border-green-200",
  "Partly true": "bg-lime-100 text-lime-800 border-lime-200",
  Misleading: "bg-amber-100 text-amber-800 border-amber-200",
  "Mostly false": "bg-red-100 text-red-800 border-red-200",
  Unclear: "bg-slate-100 text-slate-700 border-slate-200",
  "Depends on scale": "bg-blue-100 text-blue-800 border-blue-200",
};

export const CONFIDENCE_STYLES: Record<Confidence, string> = {
  High: "bg-energy-navy text-white",
  Medium: "bg-electric/15 text-electric",
  Low: "bg-slate-200 text-slate-700",
};
