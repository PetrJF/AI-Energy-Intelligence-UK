import research1 from "@/assets/research-1.jpg";
import research2 from "@/assets/research-2.jpg";
import research3 from "@/assets/research-3.jpg";
import aiEnergyImg from "@/assets/ai-energy.jpg";
import ukGridImg from "@/assets/uk-grid.jpg";
import dataCentreImg from "@/assets/data-centre.jpg";
import futureImg from "@/assets/future-scenarios.jpg";
import energyHero from "@/assets/energy-hero.jpg";
import aiEnergyIndexPdf from "@/assets/ai-energy-consumption-index-q2-2025.pdf.asset.json";
import aiSearchVsTraditionalPdf from "@/assets/ai-search-vs-traditional-search-index-2025.pdf.asset.json";
import ukAiEnergyReport2026Pdf from "@/assets/uk-ai-energy-report-2026.pdf.asset.json";
import bestValueEnergySuppliersReport2026Pdf from "@/assets/best-value-energy-suppliers-report-2026.pdf.asset.json";
import ukAiInfrastructureReport2026Pdf from "@/assets/uk-ai-infrastructure-report-2026.pdf.asset.json";
import businessGuideToAiEnergyCosts2026Pdf from "@/assets/business-guide-to-ai-energy-costs-2026.pdf.asset.json";
import aiDataCentresAndTheUkElectricityGrid2026Pdf from "@/assets/ai-data-centres-and-the-uk-electricity-grid-2026.pdf.asset.json";
import aiAndEnergyCrisis2026Pdf from "@/assets/ai-and-energy-crisis-2026.pdf.asset.json";



export const REPORT_CATEGORIES = [
  { slug: "ai-energy", label: "AI & Energy", blurb: "How AI is reshaping electricity demand across the UK." },
  { slug: "data-centres", label: "Data Centres", blurb: "Capacity, siting and grid impact of UK data centre growth." },
  { slug: "electricity-demand", label: "Electricity Demand", blurb: "Forecasts and modelling for UK power consumption to 2035." },
  { slug: "infrastructure", label: "Infrastructure", blurb: "Grid, transmission, water and connection queue analysis." },
  { slug: "business-ai", label: "Business AI", blurb: "ROI, adoption and productivity intelligence for UK firms." },
  { slug: "cyber-security", label: "Cyber Security", blurb: "AI-era threats to critical national energy infrastructure." },
  { slug: "government-policy", label: "Government & Policy", blurb: "UK regulation, AI Growth Zones and net-zero policy analysis." },
] as const;

export type CategorySlug = (typeof REPORT_CATEGORIES)[number]["slug"];

export type ReportStatus =
  | "published"
  | "published-methodology-incomplete"
  | "in-development"
  | "forthcoming";

export const STATUS_LABELS: Record<ReportStatus, string> = {
  published: "Published",
  "published-methodology-incomplete": "Published — methodology incomplete",
  "in-development": "In development",
  forthcoming: "Forthcoming",
};

export function isAvailable(r: Report): boolean {
  return r.status === "published" || r.status === "published-methodology-incomplete";
}

export type Report = {
  slug: string;
  title: string;
  category: CategorySlug;
  summary: string;
  cover: string;
  status: ReportStatus;
  /** Organisation that produced the document, where it is not AI Energy Intelligence. */
  publisher?: string;
  /** Supporting information the published document does not currently contain. */
  methodologyGaps?: string[];
  /** Known limitations of this specific document, drawn from our methodology. */
  limitations?: string[];
  /** Date the page content was last checked; falls back to publishedAt. */
  lastVerified?: string;
  /** Editorial recheck interval; defaults to 365 days. */
  reviewWindowDays?: number;
  publishedAt?: string; // ISO — only where a real document exists
  pages?: number; // verified page count of the actual document
  version?: string;
  tier: "free" | "premium";
  topics: string[];
  executiveSummary?: string;
  keyFindings?: Array<
    | string
    | {
        text: string;
        sourceUrl: string;
        sourceLabel: string;
      }
    | {
        /** Specific figure awaiting a verified primary source. */
        text: string;
        sourceNeeded: true;
        sourceNote?: string;
      }
    | {
        /** Segmented finding: each sentence carries its own inline source. */
        segments: Array<{
          text: string;
          sourceUrl?: string;
          sourceLabel?: string;
        }>;
      }
  >;
  /** Dated reader-facing record of a substantive correction to this report page. */
  correctionNote?: {
    date: string;
    text: string;
  };
  /** Scope of a report that has not been published yet. */
  proposedScope?: string;
  expectedTopics?: string[];
  audience: string[];
  toc?: string[];
  previewImages?: string[];
  relatedSlugs?: string[];
  downloadUrl?: string;
  faqs: { q: string; a: string }[];
};

export const REPORTS: Report[] = [
  {
    slug: "uk-ai-electricity-demand-outlook-2026",
    title: "UK AI Electricity Demand Outlook 2026",
    category: "ai-energy",
    status: "in-development",
    summary:
      "In development: a planned outlook on AI-driven electricity growth across UK regions to 2030. No published document is available yet.",
    cover: aiEnergyImg,
    tier: "free",
    topics: ["forecast", "grid", "efficiency"],
    proposedScope:
      "We intend to publish a documented, reproducible outlook for AI-related electricity demand in the UK to 2030, built on published DESNZ, NESO and Ofgem data with the model workings and assumptions set out in full. No findings are available yet, and none are shown on this page.",
    expectedTopics: [
      "UK AI compute baseline and how it is measured",
      "Adoption pathways and their stated assumptions",
      "Regional distribution of new load",
      "Efficiency trajectories and their effect on totals",
      "Grid connection and constraint context",
    ],
    audience: [
      "Energy analysts and grid planners",
      "UK policymakers and regulators",
      "Data centre operators and hyperscaler strategy teams",
      "Institutional investors and infrastructure funds",
    ],
    relatedSlugs: ["uk-ai-energy-report-2026", "ai-data-centres-and-the-uk-electricity-grid-2026"],
    faqs: [
      { q: "Can I read this report now?", a: "No. It is in development and no document exists yet. Sourced UK electricity demand figures we can currently evidence are published on the UK AI Energy Index." },
    ],
  },
  {
    slug: "uk-data-centre-capacity-atlas-2026",
    title: "UK Data Centre Capacity Atlas",
    category: "data-centres",
    status: "forthcoming",
    summary:
      "Forthcoming: a planned site-by-site inventory of UK data centre capacity. Not yet produced — no capacity totals or site counts are published here.",
    cover: dataCentreImg,
    tier: "premium",
    topics: ["capacity", "siting", "planning"],
    reviewWindowDays: 90,
    proposedScope:
      "A planned register of UK data centre sites with planning status, stated power requirement and expected commissioning date, compiled from planning authority records and company announcements. The register does not yet exist. The projects we have verified to date are published openly in the UK Data Centre Tracker.",
    expectedTopics: [
      "Site register drawn from local planning authority records",
      "Stated capacity and how each figure is defined",
      "Planning and grid connection status",
      "Named source for every entry",
    ],
    audience: [
      "Infrastructure investors and REITs",
      "Data centre developers and operators",
      "Planning and grid connection teams",
    ],
    relatedSlugs: ["ai-data-centres-and-the-uk-electricity-grid-2026"],
    faqs: [
      { q: "Is there a site register I can use today?", a: "Yes — the UK Data Centre Tracker on this site lists the projects we have verified, each with its source and confidence level." },
    ],
  },
  {
    slug: "ai-data-centres-and-the-uk-electricity-grid-2026",
    title: "AI Data Centres and the UK Electricity Grid 2026",
    category: "data-centres",
    status: "published",
    limitations: [
      "Limited AI workload disclosure: operators publish little about AI-specific energy use, so the briefing's demand projections (such as data centres reaching around 9% of UK electricity by 2035) describe data centres as a whole and cannot isolate the share driven by AI.",
      "Commercially confidential site figures: capacity estimates for individual projects and regions, including the 2.4 GW to 6.2 GW grid-connected outlook, rely partly on planning documents and operator announcements, because site-level power data is often not disclosed.",
      "Grid carbon intensity as period averages: the renewables and power-mix discussion uses average carbon intensity over a period, not real-time values, so emissions at particular hours or locations may differ.",
      "Tariff defaults ageing: the regional electricity pricing section reflects prices available up to mid-2025. Prices move quickly, so readers should check current contracted rates before relying on them.",
    ],
    summary:
      "A structured briefing on how artificial intelligence infrastructure is reshaping Britain's power network — from substation bottlenecks to regional investment opportunities and long-term grid risk.",
    cover: dataCentreImg,
    publishedAt: "2026-07-13",
    lastVerified: "2026-09-24",
    reviewWindowDays: 90,
    pages: 20,
    version: "v1.0",
    tier: "free",
    topics: ["grid", "data centres", "connection queue", "infrastructure", "policy"],
    executiveSummary:
      "AI workloads are pushing UK data centre electricity demand to levels the grid was not designed to absorb. This briefing explains grid connection mechanics, substation constraints, regional opportunities, investment forecasts and the policy reforms that will decide which projects connect.",
    keyFindings: [
      { text: "UK data centre IT power capacity is estimated at around 2.9 GW today, with a further 6.2 GW of new capacity expected to be added by 2030.", sourceUrl: "https://www.oxfordeconomics.com/resource/the-uks-data-centre-boom-growth-trends-drivers-and-the-rising-power-challenge/", sourceLabel: "Oxford Economics, The UK's data centre boom" },
      {
        segments: [
          {
            text: "Ofgem reports total contracted demand in the GB grid connection queue grew from 41 GW (November 2024) to 125 GW (June 2025) — a measure of contracted connection capacity, not electricity consumed, not exclusively data-centre demand, and not a guarantee every queued project connects; Ofgem itself has flagged concern that a significant share may not proceed.",
            sourceUrl: "https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf",
            sourceLabel: "Ofgem proposed data centre connection reforms consultation",
          },
          {
            text: "Separately, NESO's connections reform restructured the broader UK-wide connections queue (covering both demand and generation projects): roughly 217 GW of projects lacking consents or land rights were removed, cutting that total from over 700 GW to around 238 GW under a new readiness-based system, with an estimated 13 GW of demand connecting before 2030 and a further 86 GW between 2030 and 2035. These are two distinct measures on different scopes and should not be read as the same figure before and after reform.",
            sourceUrl: "https://www.neso.energy/industry-information/connections-reform/connections-reform-results",
            sourceLabel: "NESO connections reform results",
          },
        ],
      },
      { text: "Data centres could account for ~9% of UK electricity demand by 2035, up from 2.6% today.", sourceNeeded: true, sourceNote: "The 9%-by-2035 figure traces to a US-specific Bloomberg statistic, not a UK one. The 2.6% baseline traces only to a framing remark opening a House of Commons committee session (16 April 2026), not a published projection with a stated method. No UK primary source states this pairing." },
      "AI Growth Zones are redirecting investment toward regions with available grid headroom and renewable surplus.",
    ],
    correctionNote: {
      date: "2026-09-24",
      text: "Replaced the connection-queue finding again: our previous correction incorrectly conflated two different metrics. The 41 GW to 125 GW growth is Ofgem's measure of total contracted demand in the GB grid connection queue; the 217 GW removal and 238 GW total come from NESO's UK-wide connections reform, which covers both demand and generation projects and changed how the queue is counted. The two figures describe different scopes and are not the same number before and after reform. Both are now cited separately in the finding.",
    },
    audience: [
      "Data centre developers and investors",
      "Grid planners and network operators",
      "Policymakers and regulators",
      "Energy and infrastructure analysts",
    ],
    toc: [
      "1. The scale of the challenge",
      "2. How data centres connect to the grid",
      "3. The connection application process",
      "4. Why substations matter",
      "5. Grid constraints — the bottleneck crisis",
      "6. Regional opportunities",
      "7. AI Growth Zones — the policy framework",
      "8. Investment forecasts",
      "9. Key investment projects",
      "10. Grid investment — what is being built",
      "11. The power demand profile of AI data centres",
      "12. Renewables, nuclear and data centre power",
      "13. Flexibility and demand response",
      "14. Regional electricity pricing",
      "15. Investment forecasts — grid infrastructure spending",
      "16. Future risks — grid and system stability",
      "17. Future risks — policy and regulatory",
      "18. The regulatory landscape",
      "19. Summary — key takeaways",
    ],
    previewImages: [dataCentreImg, ukGridImg],
    relatedSlugs: ["uk-data-centre-capacity-atlas-2026", "uk-grid-connection-queue-analysis"],
    downloadUrl: aiDataCentresAndTheUkElectricityGrid2026Pdf.url,
    faqs: [
      { q: "What is the main focus of this briefing?", a: "It explains how AI data centre growth is interacting with UK electricity grid capacity, connection queues, substations and regional investment patterns." },
      { q: "Who is it for?", a: "Data centre developers, infrastructure investors, grid planners, policymakers and energy analysts who need a concise but complete picture of the sector." },
      { q: "How current is the data?", a: "The briefing reflects the latest NESO, Ofgem, National Grid and Oxford Economics data available through mid-2025." },
    ],
  },
  {
    slug: "uk-grid-connection-queue-analysis",
    title: "UK Grid Connection Queue Analysis",
    category: "infrastructure",
    status: "in-development",
    summary:
      "In development: planned analysis of the transmission and distribution connection queue as it affects AI and data centre load. No document is available yet.",
    cover: ukGridImg,
    tier: "free",
    topics: ["grid", "connections", "planning"],
    reviewWindowDays: 90,
    proposedScope:
      "A planned analysis of connection queue reform and its effect on AI-related load, based on NESO and Ofgem published material. No findings, queue volumes or wait times are shown until the analysis is complete and sourced.",
    expectedTopics: [
      "How the connection queue works and who administers it",
      "Published NESO and Ofgem reform measures",
      "What the published data does and does not show about data centre connections",
      "Regional constraint evidence",
    ],
    audience: [
      "Grid and connections teams",
      "Developers and investors",
      "Policy and regulatory analysts",
    ],
    relatedSlugs: ["ai-data-centres-and-the-uk-electricity-grid-2026"],
    faqs: [
      { q: "What can I read now?", a: "The Grid Pressure section of the UK AI Energy Index sets out the evidence we currently hold, including where evidence is insufficient." },
    ],
  },
  {
    slug: "uk-electricity-demand-2035",
    title: "UK Electricity Demand to 2035",
    category: "electricity-demand",
    status: "forthcoming",
    summary:
      "Forthcoming: a planned long-range view of UK electricity demand with AI and data centres treated explicitly. Not yet produced.",
    cover: futureImg,
    tier: "premium",
    topics: ["forecast", "scenarios", "demand"],
    proposedScope:
      "A planned scenario study of UK electricity demand to 2035, benchmarked against NESO Future Energy Scenarios and DESNZ projections, with every divergence from those published scenarios documented. No scenario outputs are published on this page because none have been produced.",
    expectedTopics: [
      "Benchmarking against published NESO and DESNZ scenarios",
      "Treatment of AI and data centre load",
      "Electrification of heat and transport",
      "Documented assumptions and uncertainty ranges",
    ],
    audience: [
      "Utilities and generators",
      "Policy and regulatory analysts",
      "Institutional investors",
    ],
    relatedSlugs: ["uk-ai-energy-report-2026"],
    faqs: [
      { q: "Does this align with NESO FES?", a: "It is intended to be benchmarked against the published Future Energy Scenarios, but the study has not been produced yet." },
    ],
  },
  {
    slug: "business-ai-roi-benchmark-2026",
    title: "Business AI ROI Framework",
    category: "business-ai",
    status: "in-development",
    summary:
      "In development: a modelled framework for estimating AI return on investment for UK organisations. This is not an observed benchmark and no survey or company dataset underlies it.",
    cover: research2,
    tier: "free",
    topics: ["roi", "adoption", "productivity"],
    proposedScope:
      "We previously described this page as a benchmark of realised returns across UK companies. No such dataset, survey or fieldwork exists, so those figures have been withdrawn. The intended replacement is an openly documented calculation framework that lets an organisation model its own AI costs, energy use and payback from its own inputs, with every assumption stated.",
    expectedTopics: [
      "Cost components: licences, compute, energy, integration and staff time",
      "How to measure benefit without overstating it",
      "A worked, reproducible payback calculation",
      "Stated assumptions, sensitivities and limitations",
    ],
    audience: [
      "CIOs, CDOs and CTOs at UK firms",
      "Board directors and audit committees",
      "Management consultants and advisors",
    ],
    relatedSlugs: ["business-guide-to-ai-energy-costs-2026", "ai-electricity-cost-calculator-uk-business-guide-2026"],
    faqs: [
      { q: "Was a survey of UK companies carried out?", a: "No. Earlier wording on this page referred to a sample of UK companies and a median payback period. No underlying dataset exists and those claims have been removed." },
      { q: "What can I use today?", a: "The Business Guide to AI Energy Costs and the AI electricity cost calculators on this site use transparent, checkable inputs." },
    ],
  },
  {
    slug: "ai-electricity-cost-calculator-uk-business-guide-2026",
    title: "AI Electricity Cost Calculator: UK Business Guide 2026",
    category: "business-ai",
    status: "published",
    summary:
      "The hidden electricity cost of AI, explained for UK businesses. A practical, data-driven guide with methodology, worked scenarios, charts and clear recommendations for energy, IT and finance teams.",
    cover: research2,
    publishedAt: "2026-03-01",
    lastVerified: "2026-09-24",
    pages: 17,
    version: "v1.0",
    tier: "free",
    topics: ["cost", "methodology", "scenarios", "uk-pricing"],
    executiveSummary:
      "AI workloads carry a real, quantifiable electricity cost that most UK businesses under-estimate. This guide walks through the drivers — training, inference, cooling and infrastructure — applies a transparent calculator methodology, and works three UK scenarios (small business, mid-size org and enterprise) using 2026 pricing.",
    keyFindings: [
      "AI energy costs are dominated by inference at scale, not one-off training.",
      "UK pricing, standing charges and peak/off-peak windows materially change the annual bill.",
      "Everyday comparisons (kettle, EV charge, washing machine) help contextualise AI's true footprint.",
      { text: "Practical operating changes can cut AI energy cost by 20–40% without changing model choice.", sourceNeeded: true, sourceNote: "An extensive search found no named research-firm or cloud-provider study behind this range — only inconsistent vendor marketing claims from cost-optimisation tool vendors (ranging from 40-80%), suggesting this is an editorial estimate rather than a sourceable statistic." },
    ],
    audience: [
      "Energy, IT and finance decision-makers at UK businesses",
      "Sustainability and ESG leads quantifying AI's footprint",
      "Consultants and advisors supporting UK adopters",
      "Procurement teams evaluating AI vendor cost claims",
    ],
    toc: [
      "1. How AI uses electricity — data centres, servers, cooling, training & inference",
      "2. Understanding consumption — LLMs, image and video generation, enterprise AI",
      "3. UK electricity costs explained — pricing, standing charges, peak vs off-peak, regions",
      "4. The cost-calculator methodology, inputs and outputs (energy, cost, carbon)",
      "5. Three worked UK scenarios — small business, mid-size org and enterprise",
      "6. AI vs everyday electricity — kettle, EV charge, washing machine and more",
      "7. AI & the future UK grid — demand forecasts, data-centre growth, AI Growth Zones",
      "8. Practical strategies to reduce AI energy costs and clear recommendations",
    ],
    previewImages: [research2, aiEnergyImg],
    relatedSlugs: ["business-ai-roi-benchmark-2026", "uk-ai-electricity-demand-outlook-2026"],
    downloadUrl: "/guides/ai-electricity-cost-calculator-uk-business-guide-2026.pdf",
    faqs: [
      { q: "Is the guide free?", a: "Yes — the 16-page PDF is free to download. We ask for an email so we can send you a permanent link." },
      { q: "Does it include worked UK examples?", a: "Yes — three worked scenarios covering a small business, a mid-size organisation and an enterprise, using 2026 UK pricing." },
      { q: "Can I model my own organisation?", a: "The methodology is documented in full so you can reproduce it, and our free interactive calculators let you run the numbers directly." },
    ],
  },
  {
    slug: "business-guide-to-ai-energy-costs-2026",
    title: "The Business Guide to AI Energy Costs 2026",
    category: "business-ai",
    status: "published-methodology-incomplete",
    methodologyGaps: [
      "A stated research method",
      "Limitations and uncertainty ranges",
    ],
    summary:
      "A practical, costed framework for understanding what AI tools really cost to run — built for UK SMEs, IT managers and business owners who need clarity on energy, infrastructure and ROI.",
    cover: aiEnergyImg,
    publishedAt: "2026-07-13",
    lastVerified: "2026-09-24",
    pages: 12,
    version: "v1.0",
    tier: "free",
    topics: ["cost", "roi", "sme", "energy", "infrastructure"],
    executiveSummary:
      "Most UK businesses only budget for the AI subscription licence fee and miss the full cost stack — energy, infrastructure, maintenance, governance and compliance. This guide sets out a transparent, evidence-based framework for calculating the true cost of AI tools, compares cloud and local inference options, and gives a practical ROI model and action plan for UK SMEs adopting AI in 2025–26.",
    keyFindings: [
      "AI tools consume energy at every level, from cloud data centres to local devices; inference — not training — drives most ongoing business cost.",
      { text: "Organisations typically underestimate total AI costs by 40–60% when budgeting on subscription price alone.", sourceNeeded: true, sourceNote: "No source states this range. The closest real analogue is IDC's prediction that 'Global 1,000 companies will underestimate their AI infrastructure costs by 30% through 2027' (IDC FutureScape, via CIO.com, 19 December 2025) — a different figure and a different scope (total infrastructure cost forecasting, not subscription-price budgeting) than stated here." },
      "Cloud-based AI tools are the right choice for most UK SMEs, with lower upfront cost, faster deployment and less management overhead than on-premise hardware.",
      { text: "A structured, phased AI rollout can deliver a realistic 12–18 month payback for most UK SMEs.", sourceNeeded: true, sourceNote: "No UK SME-specific study supporting this range was found, and available evidence points the other way: Deloitte's EMEA generative-AI survey found most organisations report satisfactory ROI within two to four years, with only 6% achieving payback inside one year." },
    ],
    audience: [
      "Business owners and directors at UK SMEs",
      "IT managers and CIOs evaluating AI tools",
      "Finance and procurement teams budgeting AI spend",
      "Sustainability and ESG leads tracking AI energy use",
    ],
    toc: [
      "1. What AI energy costs actually mean for your business",
      "2. The real cost of AI tools",
      "3. Step 1: Understanding the AI tool cost stack",
      "4. Step 2: Hidden energy costs — what your subscription doesn't tell you",
      "5. Step 3: AI ROI calculations — the honest framework",
      "6. Step 4: Infrastructure requirements for AI",
      "7. Step 5: Cloud vs. local AI — the cost comparison",
      "8. The definitive answer — cloud vs. local AI for UK SMEs",
      "9. Complete cost summary — what AI really costs a UK SME",
      "10. Your action plan — where to start this week",
    ],
    previewImages: [aiEnergyImg, research2],
    relatedSlugs: [
      "ai-electricity-cost-calculator-uk-business-guide-2026",
      "business-ai-roi-benchmark-2026",
      "uk-business-ai-policy-template-and-governance-pack-2026",
    ],
    downloadUrl: businessGuideToAiEnergyCosts2026Pdf.url,
    faqs: [
      { q: "Is this guide free to download?", a: "Yes — the 12-page PDF is free to download and share within your organisation." },
      { q: "Does it cover both cloud and local AI options?", a: "Yes — it compares cloud SaaS tools and on-premise inference hardware across upfront cost, electricity, management overhead and suitability for UK SMEs." },
      { q: "Can I use the ROI framework for my own business?", a: "Yes — the guide includes a practical, worked ROI model for a 20-person UK SME that you can adapt to your own size, tools and assumptions." },
    ],
  },
  {
    slug: "ai-and-energy-crisis-2026",
    title: "AI & Energy Crisis: UK Power Demand Forecast 2026",
    category: "business-ai",
    status: "published-methodology-incomplete",
    methodologyGaps: [
      "A stated research method",
      "Calculation assumptions behind the demand scenarios",
    ],
    summary:
      "A comprehensive analysis of AI-driven electricity demand across the United Kingdom — from current consumption baselines to 2040 growth scenarios, grid constraints and the renewable generation required to power the nation's AI ambitions.",
    cover: aiEnergyImg,
    publishedAt: "2026-07-13",
    lastVerified: "2026-09-24",
    pages: 12,
    version: "v1.0",
    tier: "free",
    topics: ["energy", "demand", "forecast", "grid", "renewables", "business"],
    reviewWindowDays: 90,
    executiveSummary:
      "AI is now a first-order driver of UK electricity demand and infrastructure planning. This report consolidates current baselines, three demand scenarios to 2040, regional growth zones, grid upgrade requirements and renewable generation needs — and sets out a practical action plan for developers, investors, grid planners and business decision-makers.",
    keyFindings: [
      { text: "UK data centres consumed an estimated 4.5 TWh in 2024 — 2% of Great Britain's 249.2 TWh grid electricity consumption — up from around 3.2 TWh in 2020, a 41% rise over the period.", sourceUrl: "https://assets.publishing.service.gov.uk/media/6a3e9f25da47783d87723bf2/Data_centre_electricity_consumption_in_Great_Britain__2020_to_2024.pdf", sourceLabel: "DESNZ, Data centre electricity consumption in Great Britain, 2020 to 2024" },
      { text: "NESO's connection queue holds around 50 GW of demand from roughly 140 data centres that have applied for, or are likely to receive, a 'ready to connect' (Gate 2) offer — more data-centre demand than Great Britain's entire peak electricity demand (about 45 GW in February 2026).", sourceUrl: "https://www.theregister.com/2026/02/27/datacenter_uk_grid_demand/", sourceLabel: "The Register, 27 Feb 2026, citing NESO" },
      {
        segments: [
          {
            text: "NESO's Clean Power 2030 plan projects UK data centre electricity demand rising from around 5 TWh today to 22 TWh by 2030.",
            sourceUrl: "https://www.neso.energy/document/346791/download",
            sourceLabel: "NESO, Clean Power 2030 Annex 1: Electricity demand and supply analysis",
          },
          {
            text: "Looking further out, NESO has said data centre demand by 2050 could range from 30 to 71 TWh, reflecting high scenario uncertainty.",
            sourceUrl: "https://www.datacenterdynamics.com/en/news/uk-grid-operator-high-uncertainty-on-data-center-growth-makes-forecasting-hard-could-range-from-30-71twh-by-2050/",
            sourceLabel: "DatacenterDynamics, citing NESO",
          },
        ],
      },
      "Scotland, the North East and Wales are emerging as strategic growth zones, leveraging surplus wind, price discounts and AI Growth Zone status.",
    ],
    correctionNote: {
      date: "2026-09-24",
      text: "Replaced the data-centre consumption finding: the previous wording claimed UK data centres consume roughly 6% of national electricity supply, up from 2% in 2023, which was factually wrong — no source supports the 6% figure and it conflicts with published estimates. The finding now uses DESNZ's data centre electricity consumption estimates for Great Britain: an estimated 4.5 TWh in 2024 (2% of grid electricity consumption), up from around 3.2 TWh in 2020. This was a factual error corrected against the primary source, not merely a missing citation.",
    },
    audience: [
      "Energy policymakers, grid planners and regulators",
      "Data centre developers, hyperscalers and investors",
      "Sustainability and ESG leads at UK enterprises",
      "Business leaders and finance teams budgeting AI energy exposure",
      "Advisors and consultants evaluating UK AI infrastructure",
    ],
    toc: [
      "1. Where we stand — current AI electricity demand",
      "2. The scale of the challenge — key headline figures",
      "3. Future growth forecasts — three pathways to 2040",
      "4. UK regional forecast — where demand is growing",
      "5. Data centre expansion — major sites and developments",
      "6. Grid upgrade requirements — the infrastructure bottleneck",
      "7. Renewable generation needs — powering AI to 2040",
      "8. Renewable energy vs. demand growth — the carbon risk",
      "9. UK AI power demand forecast summary — 2026 to 2040",
      "10. Policy and investment framework — what must happen",
      "11. Stakeholder action plan — what to do now",
      "12. Data sources, references and methodology",
    ],
    previewImages: [aiEnergyImg, energyHero],
    relatedSlugs: [
      "business-guide-to-ai-energy-costs-2026",
      "ai-electricity-cost-calculator-uk-business-guide-2026",
      "uk-ai-energy-report-2026",
    ],
    downloadUrl: aiAndEnergyCrisis2026Pdf.url,
    faqs: [
      { q: "Is this report free to download?", a: "Yes — the full 12-page PDF is free to download. We ask for an email so we can send you future updates and related research." },
      { q: "Who is the forecast for?", a: "Energy policymakers, grid planners, data centre developers, investors, sustainability leads and business decision-makers who need a data-grounded view of UK AI electricity demand through 2040." },
      { q: "Which scenarios does it cover?", a: "Baseline (managed growth), high-growth (AI acceleration) and extreme (unconstrained demand) pathways, with annual TWh forecasts from 2026 to 2040." },
    ],
  },
  {
    slug: "uk-business-ai-policy-template-and-governance-pack-2026",

    title: "UK Business AI Policy Template & Governance Pack 2026",
    category: "business-ai",
    status: "published",
    summary:
      "Practical AI governance, GDPR guidance and editable staff usage policies for UK organisations adopting AI safely.",
    cover: research3,
    publishedAt: "2026-07-12",
    pages: 15,
    version: "v1.0",
    tier: "free",
    topics: ["governance", "gdpr", "policy", "compliance"],
    executiveSummary:
      "Artificial intelligence is already present in UK workplaces. Without a formal governance framework, that usage creates significant legal, reputational and operational exposure. This pack gives UK organisations a practical AI policy template, GDPR-aligned data classification, staff training checklists, incident response guidance and editable governance forms.",
    keyFindings: [
      "Shadow AI — staff using unapproved tools with company data — is the most common hidden data governance gap.",
      "Personal data entered into third-party AI systems may be processed or used for training without adequate legal basis under UK GDPR.",
      "A formal AI policy builds staff confidence, reduces liability and demonstrates professionalism to clients and regulators.",
      "UK SMEs can implement effective AI governance with a practical, proportionate approach and the editable templates in this pack.",
    ],
    audience: [
      "Business owners, directors and compliance leads at UK SMEs",
      "CIOs, CDOs and risk managers rolling out AI tools",
      "Data protection officers and GDPR compliance teams",
      "Advisors and consultants supporting UK business AI adoption",
    ],
    toc: [
      "1. Executive summary — why AI governance matters in 2026",
      "2. What is an AI policy? Scope, purpose and key components",
      "3. AI risks for UK businesses — GDPR, shadow AI, cyber and more",
      "4. Data classification framework for AI use",
      "5. Acceptable AI usage policy template",
      "6. Staff AI training checklist",
      "7. AI governance workflow",
      "8. AI incident response guidance",
      "9. AI disclosure guidance",
      "10. AI compliance checklist",
      "11. Future AI governance trends",
      "12. Editable templates",
      "13. Final recommendations for UK SMEs",
    ],
    previewImages: [research3],
    relatedSlugs: ["business-ai-roi-benchmark-2026"],
    downloadUrl: "/guides/uk-business-ai-policy-template-and-governance-pack-2026.pdf",
    faqs: [
      { q: "Is this pack free to download?", a: "Yes — the 15-page PDF is free to download. It includes editable policy templates and checklists for UK organisations." },
      { q: "Does it constitute legal advice?", a: "No — it is a governance template and practical guidance resource. Regulated businesses should seek independent legal or compliance counsel." },
      { q: "Which regulations does it cover?", a: "It aligns with UK GDPR, the Data Protection Act 2018, the Data (Use and Access) Act 2025 and current ICO guidance." },
    ],
  },
  {
    slug: "ai-energy-consumption-index-q2-2025",
    title: "AI Energy Consumption Index: Q2 2025 Edition",
    category: "business-ai",
    status: "published",
    publisher: "AI Energy Intelligence",
    summary:
      "The hidden electricity footprint of leading AI services, benchmarked for UK decision-makers. An independent, evidence-based quarterly index covering ChatGPT, Claude, Gemini, Copilot and more — with UK demand, grid impact and forecasts to 2035.",
    cover: aiEnergyImg,
    publishedAt: "2025-07-01",
    lastVerified: "2026-09-24",
    reviewWindowDays: 90,
    pages: 44,
    version: "Q2 2025",
    tier: "free",
    topics: ["ai-energy", "inference", "data-centres", "uk-grid", "forecasts"],
    executiveSummary:
      "Global data centre electricity reached an estimated 485 TWh in 2025, with AI workloads driving 20–25% of that total and growing 50% year-on-year. This edition of the AI Energy Consumption Index sets out transparent, evidence-based estimates for the leading AI models and services, benchmarks UK demand against international peers, and projects the electricity trajectory to 2035 under three scenarios.",
    keyFindings: [
      { text: "Global data centre electricity consumption is on track to roughly double from 485 TWh in 2025 to 950 TWh in 2030; AI-focused data centres accounted for around a third of the 2025 total.", sourceUrl: "https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary", sourceLabel: "IEA, Key Questions on Energy and AI (2026)" },
      { text: "Under the IEA Base Case, global data centre demand could reach 945–950 TWh by 2030 — roughly Japan's annual consumption.", sourceUrl: "https://www.iea.org/reports/energy-and-ai/executive-summary", sourceLabel: "IEA, Energy and AI (April 2025)" },
      { text: "ChatGPT receives around 2.5 billion prompts per day from users worldwide, according to OpenAI.", sourceUrl: "https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/", sourceLabel: "TechCrunch, 21 July 2025, citing OpenAI" },
      { text: "Inference has overtaken training as the dominant driver of AI electricity use.", sourceNeeded: true, sourceNote: "No named study or company statement was found substantiating this framing; only unattributed aggregator commentary repeats it." },
      { text: "UK data centres used around 5 TWh of electricity in 2023 (2% of total UK demand); Oxford Economics projects this reaching 26.2 TWh by 2030 (8.8% of total UK demand).", sourceUrl: "https://www.oxfordeconomics.com/resource/the-uks-data-centre-boom-growth-trends-drivers-and-the-rising-power-challenge/", sourceLabel: "Oxford Economics, The UK's data centre boom" },
      {
        segments: [
          {
            text: "Ofgem reports total contracted demand in the GB grid connection queue grew from 41 GW (November 2024) to 125 GW (June 2025) — a measure of contracted connection capacity, not electricity consumed, not exclusively data-centre demand, and not a guarantee every queued project connects; Ofgem itself has flagged concern that a significant share may not proceed.",
            sourceUrl: "https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf",
            sourceLabel: "Ofgem proposed data centre connection reforms consultation",
          },
          {
            text: "Separately, NESO's connections reform restructured the broader UK-wide connections queue (covering both demand and generation projects): roughly 217 GW of projects lacking consents or land rights were removed, cutting that total from over 700 GW to around 238 GW under a new readiness-based system, with an estimated 13 GW of demand connecting before 2030 and a further 86 GW between 2030 and 2035. These are two distinct measures on different scopes and should not be read as the same figure before and after reform.",
            sourceUrl: "https://www.neso.energy/industry-information/connections-reform/connections-reform-results",
            sourceLabel: "NESO connections reform results",
          },
        ],
      },
    ],
    correctionNote: {
      date: "2026-09-24",
      text: "Replaced the connection-queue finding again: our previous correction incorrectly conflated two different metrics. The 41 GW to 125 GW growth is Ofgem's measure of total contracted demand in the GB grid connection queue; the 217 GW removal and 238 GW total come from NESO's UK-wide connections reform, which covers both demand and generation projects and changed how the queue is counted. The two figures describe different scopes and are not the same number before and after reform. Both are now cited separately in the finding.",
    },
    audience: [
      "Policymakers, regulators and DESNZ / Ofgem analysts",
      "Data centre operators, hyperscalers and grid planners",
      "AI companies, cloud providers and semiconductor investors",
      "Sustainability, ESG and net-zero leads at UK enterprises",
      "Journalists and researchers covering AI's energy footprint",
    ],
    toc: [
      "1. Executive summary and key findings — Q2 2025",
      "2. Methodology — how AI electricity estimates are calculated",
      "3. Executive dashboard — regional demand and service benchmarks",
      "4. State of AI — adoption timeline and market structure",
      "5. Electricity profiles — ChatGPT, Claude, Gemini, Copilot, Meta AI, Perplexity, Grok, DeepSeek",
      "6. Image generation — Midjourney and Stable Diffusion",
      "7. Model comparison — efficiency by class, open-source vs proprietary",
      "8. Data centres — AI server deployments, cooling and grid impacts",
      "9. Electricity trends 2020–2025 and quarterly peak demand",
      "10. Water consumption — cooling systems and regional impacts",
      "11. Carbon footprint — Scope 2, renewables and net-zero commitments",
      "12. International comparison — UK, US, EU, China, Japan, Singapore, Middle East",
      "13. Electricity demand forecast to 2035 — three scenarios",
      "14. Industry analysis — semiconductors, nuclear, renewables and grid flexibility",
      "15. Key risks and opportunities",
      "16. Recommendations — government, energy companies, AI developers, cloud providers and investors",
      "17. Glossary, references and detailed methodology appendices",
    ],
    previewImages: [aiEnergyImg, research1],
    relatedSlugs: [
      "uk-ai-electricity-demand-outlook-2026",
      "ai-electricity-cost-calculator-uk-business-guide-2026",
      "uk-electricity-demand-2035",
    ],
    downloadUrl: aiEnergyIndexPdf.url,
    faqs: [
      { q: "Is the index free to download?", a: "Yes — the full 44-page Q2 2025 edition is free. We ask for an email so we can send you future quarterly updates." },
      { q: "How are the electricity estimates produced?", a: "From disclosed hardware configurations, published user and query metrics, academic modelling and infrastructure filings. Methodology and assumptions are documented in full in the appendices." },
      { q: "How often is the index updated?", a: "Quarterly. Estimates are revised as new operator disclosures, academic research and infrastructure data become available." },
    ],
  },
  {
    slug: "ai-search-vs-traditional-search-index-2026",
    title: "AI Search vs Traditional Search: Electricity, Water & Carbon Index 2026",
    category: "ai-energy",
    status: "published",
    publisher: "AI Energy Intelligence",
    summary:
      "The environmental cost of AI-generated answers versus conventional search, benchmarked for UK decision-makers. An independent, evidence-based comparison of electricity, water and carbon per query across Google, Gemini, ChatGPT, Copilot, Perplexity and Claude — with forecasts to 2035.",
    cover: aiEnergyImg,
    publishedAt: "2026-07-01",
    lastVerified: "2026-09-24",
    pages: 44,
    version: "v1.0",
    tier: "free",
    topics: ["ai-search", "inference", "water", "carbon", "uk-grid"],
    executiveSummary:
      "A single AI-generated search response consumes an estimated 3 to 100 times more electricity than a traditional Google query, depending on model, query complexity and data centre location. This report benchmarks the electricity, water and carbon footprint of leading AI search platforms against conventional search, quantifies grid and water impacts, and projects the trajectory to 2035 under three scenarios.",
    keyFindings: [
      { text: "Google states the median energy use of a Gemini Apps text prompt at 0.24 Wh, based on a full-stack accounting methodology it published in August 2025.", sourceUrl: "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference", sourceLabel: "Google Cloud blog, August 2025" },
      { text: "A current, directly comparable per-query energy figure for Google Search or for ChatGPT has not been published by either company.", sourceNeeded: true, sourceNote: "Commonly cited comparison figures are unreliable: a ~0.3 Wh Google search estimate traces to a 2009 Google blog post describing infrastructure from that era, not a current figure; and a ~2.9 Wh figure sometimes attributed to 'long-form ChatGPT' actually comes from a Schneider Electric estimate for generative AI queries generally, not ChatGPT specifically." },
      { text: "Global data centre electricity reached ~415 TWh in 2024 and is projected to nearly double to 945 TWh by 2030, with AI the primary driver.", sourceUrl: "https://www.iea.org/reports/energy-and-ai/executive-summary", sourceLabel: "IEA, Energy and AI (April 2025)" },
      { text: "Data centre electricity demand grew about 17% in 2025 — nearly six times the roughly 3% growth in overall global electricity demand.", sourceUrl: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions", sourceLabel: "IEA news release, 2026" },
      { text: "Global data centre water use is estimated at around 560 billion litres per year, with some projections reaching approximately 1.2 trillion litres by 2030.", sourceNeeded: true, sourceNote: "Widely attributed to the IEA's 2025 World Energy Outlook special report on energy and AI via secondary academic citation, but the primary IEA page has not been directly located to confirm exact wording — kept flagged pending direct verification." },
      "Only Google and OpenAI have published verified per-query energy figures — the wider AI industry remains opaque.",
    ],
    audience: [
      "Policymakers, regulators and DESNZ / Ofgem analysts",
      "Sustainability, ESG and net-zero leads at UK enterprises",
      "Search, marketing and digital leaders assessing AI adoption",
      "Researchers, journalists and civil-society organisations",
      "Data centre operators, hyperscalers and grid planners",
    ],
    toc: [
      "1. Executive summary — the environmental cost of the search transition",
      "2. Methodology — measuring electricity, water and carbon per query",
      "3. Data centre operations — infrastructure behind every query",
      "4. The evolution of search — from directories to generative AI",
      "5. How traditional search works — crawling, indexing and ranking",
      "6. How AI search works — LLMs, GPUs and inference",
      "7. Electricity consumption — platform-by-platform comparison",
      "8. The 10× to 100× energy gap in context",
      "9. Water consumption — the hidden thirst of AI search",
      "10. Cooling technologies and regional water-stress implications",
      "11. Carbon emissions — grid mix, renewables and Scope 2 reality",
      "12. Data centre growth and grid pressure",
      "13. Economic and productivity impact of AI search",
      "14. The future of search — agentic AI energy concerns",
      "15. International comparison — UK, EU, US, China, Japan, Singapore",
      "16. UK deep dive — demand, grid queue and policy response",
      "17. Forecasts to 2035 — electricity, water, carbon and query volume",
      "18. Recommendations for government, industry and users",
      "19. Balanced assessment, glossary, references and appendices",
    ],
    previewImages: [aiEnergyImg, ukGridImg],
    relatedSlugs: [
      "ai-energy-consumption-index-q2-2025",
      "uk-ai-electricity-demand-outlook-2026",
      "ai-electricity-cost-calculator-uk-business-guide-2026",
    ],
    downloadUrl: aiSearchVsTraditionalPdf.url,
    faqs: [
      { q: "Is the report free to download?", a: "Yes — the full 44-page report is free. We ask for an email so we can send you future updates and related research." },
      { q: "How do you compare energy per query fairly?", a: "Disclosed corporate figures (Google, OpenAI) are reported separately from third-party academic estimates for Copilot, Perplexity, Claude and Meta AI. Assumptions, ranges and uncertainty are documented in full." },
      { q: "Does it cover water and carbon as well as electricity?", a: "Yes — the report benchmarks Water Usage Effectiveness, Scope 2 emissions and regional grid intensity alongside per-query electricity." },
    ],
  },
  {
    slug: "uk-ai-energy-report-2026",
    title: "UK AI Energy Report 2026",
    category: "ai-energy",
    status: "published",
    summary:
      "The definitive UK view of AI's electricity, grid and infrastructure impact in 2026. An independent, evidence-based report on demand growth, data centre build-out, AI Growth Zones and the trajectory to 2035 — for UK policymakers, operators and investors.",
    cover: aiEnergyImg,
    publishedAt: "2026-06-01",
    lastVerified: "2026-09-24",
    pages: 25,
    version: "v1.0",
    tier: "free",
    topics: ["ai-energy", "uk-grid", "data-centres", "forecasts", "policy"],
    reviewWindowDays: 90,
    executiveSummary:
      "AI is now a first-order driver of UK electricity demand and infrastructure planning. This report sets out the state of UK AI-linked electricity consumption in 2026, benchmarks it against international peers, and projects the trajectory to 2035 under three scenarios — covering data centre build-out, grid connection reform, AI Growth Zones, water and carbon impacts, and the policy response.",
    keyFindings: [
      { text: "UK AI-linked electricity demand is on track to add 14–26 TWh per year by 2030 under the central scenario.", sourceNeeded: true, sourceNote: "No UK-specific source for this range or 'central scenario' was found. The IEA's Energy and AI report gives Europe-wide (not UK-specific) figures of +45 TWh and 70% growth by 2030." },
      { text: "Contracted demand in Ofgem's grid connection queue rose from 41 GW to 125 GW between November 2024 and June 2025, with data centres accounting for at least 80 GW of that increase — capacity, not capital, is now the binding constraint on new connections.", sourceUrl: "https://www.ofgem.gov.uk/press-release/ofgem-acts-free-grid-capacity-tackling-speculative-data-centre-projects", sourceLabel: "Ofgem press release" },
      "Inference has overtaken training as the dominant AI electricity driver, concentrated in a handful of UK clusters.",
      "AI Growth Zones and connection queue reform (TMO4+) reshape which projects reach commissioning before 2030.",
      "Water, land-use and local grid impacts are under-appreciated relative to headline electricity numbers.",
    ],
    audience: [
      "UK policymakers, regulators and DESNZ / Ofgem analysts",
      "Data centre operators, hyperscalers and grid planners",
      "Institutional investors and infrastructure funds",
      "Sustainability, ESG and net-zero leads at UK enterprises",
      "Journalists and researchers covering AI and UK energy",
    ],
    toc: [
      "1. Executive summary — the state of UK AI energy in 2026",
      "2. Methodology and data sources",
      "3. UK AI compute baseline and adoption by sector",
      "4. Electricity demand — regional cluster analysis",
      "5. Data centre pipeline and grid connection reform",
      "6. AI Growth Zones and siting economics",
      "7. Water consumption and cooling",
      "8. Carbon footprint, renewables and Scope 2 reality",
      "9. International comparison — UK vs US, EU, China and peers",
      "10. Forecasts to 2035 — three scenarios",
      "11. Key risks and opportunities",
      "12. Recommendations for government, industry and investors",
      "13. Glossary, references and appendices",
    ],
    previewImages: [aiEnergyImg, ukGridImg],
    relatedSlugs: [
      "uk-ai-electricity-demand-outlook-2026",
      "ai-energy-consumption-index-q2-2025",
      "ai-search-vs-traditional-search-index-2026",
      "uk-electricity-demand-2035",
    ],
    downloadUrl: ukAiEnergyReport2026Pdf.url,
    faqs: [
      { q: "Is the report free to download?", a: "Yes — the full UK AI Energy Report 2026 is free. We ask for an email so we can send you future updates and related research." },
      { q: "How are the electricity estimates produced?", a: "From ESO, Ofgem, DESNZ and DSIT data, operator disclosures, academic modelling and our own bottom-up model of UK AI compute deployments. Assumptions and ranges are documented in the appendices." },
      { q: "How often is it updated?", a: "Annually, with quarterly interim updates when material policy or infrastructure changes occur." },
    ],
  },
  {
    slug: "best-value-energy-suppliers-report-2026",
    title: "Best Value Energy Suppliers Report 2026",
    category: "electricity-demand",
    status: "published",
    publisher: "PowerGuardian.co.uk",
    summary:
      "Independent analysis of the UK's best value energy suppliers for households in 2026 — covering tariffs, customer service, green energy, switching value and the July Ofgem price cap.",
    cover: energyHero,
    publishedAt: "2026-06-01",
    lastVerified: "2026-09-24",
    reviewWindowDays: 90,
    pages: 21,
    version: "v1.0",
    tier: "free",
    topics: ["energy-suppliers", "tariffs", "households", "pricing", "switching"],
    executiveSummary:
      "The UK energy market in 2026 presents both challenges and opportunities for households. With the Ofgem price cap rising 13% to £1,862/year from 1 July 2026, competitive fixed tariffs remain available well below that level. This report assesses supplier value across eight weighted dimensions — tariff competitiveness, customer service, billing accuracy, digital tools, green credentials, flexibility, financial stability and complaint performance — to identify the best overall value and specialist picks for different household types.",
    keyFindings: [
      { text: "Octopus Energy has grown to around 8 million UK customers as of April 2026, making it one of the UK's largest suppliers.", sourceUrl: "https://octopus.energy/press/more-news-press-releases/1-million-customers-for-every-tentacle-octopus-energy-supercharges-to-8-million-customers-in-the-uk/", sourceLabel: "Octopus Energy press release, April 2026" },
      { text: "Outfox Energy ranked #1 for customer service in Citizens Advice's April-June 2026 supplier ratings (4.03 out of 5), ahead of 100Green (3.90) and E.ON Next (3.71); Ecotricity, the top-ranked supplier in the second half of 2025, has since fallen out of the top three.", sourceUrl: "https://www.citizensadvice.org.uk/consumer/energy/energy-supply/get-a-better-energy-deal/compare-domestic-energy-suppliers-customer-service/outfox-energy/details/", sourceLabel: "Citizens Advice supplier customer service comparison" },
      { text: "100Green is a Which? Recommended Provider for 2026 (its second year running), and Which? states it is the only UK supplier offering both 100% renewable electricity and 100% green gas.", sourceUrl: "https://www.which.co.uk/reviews/energy-companies/article/energy-company-reviews/100green-ai2k24n4hnaQ", sourceLabel: "Which?, 100Green review" },
      {
        segments: [
          {
            text: "Ofgem's energy price cap rose 4% to £1,723 per year from October 2026, up from £1,663.",
            sourceUrl: "https://www.ofgem.gov.uk/press-release/energy-price-cap-will-rise-4-october-2026",
            sourceLabel: "Ofgem press release",
          },
          {
            text: "Uswitch found that households who fixed their energy deal beat the price cap by £182 on average over the following year, though savings varied by when they switched.",
            sourceUrl: "https://www.uswitch.com/media-centre/2026/09/done-deal-whatever-day-you-fixed-your-energy-deal-last-year-you-beat-the-variable-rate-by-182-on-average/",
            sourceLabel: "Uswitch, September 2026",
          },
        ],
      },
      { text: "835,000 UK households were on smart time-of-use tariffs by July 2025 (up 68% year-on-year), including 653,000 on EV-specific tariffs — about 2.8% of the domestic market.", sourceUrl: "https://www.ofgem.gov.uk/research/tracking-energy-consumers-use-low-carbon-and-flexible-products-and-services-2025", sourceLabel: "Ofgem, Tracking energy consumers' use of low carbon and flexible products and services: 2025" },
    ],
    audience: [
      "UK households reviewing their energy supplier",
      "Switchers looking to beat the Ofgem price cap",
      "EV owners, heat pump owners and solar households seeking specialist tariffs",
      "Consumer journalists and money-saving commentators",
    ],
    toc: [
      "1. Executive summary — key findings at a glance",
      "2. The UK energy market in 2026 and price-cap trajectory",
      "3. Methodology — how we define value",
      "4. Best overall value suppliers",
      "5. Supplier profiles — Octopus Energy, 100Green and Ecotricity",
      "6. The large legacy suppliers — critical assessment",
      "7. Best suppliers by household type",
      "8. Economy 7 and specialist meter customers",
      "9. Customer service rankings",
      "10. Complaint performance",
      "11. Tariff value analysis",
      "12. Green energy value",
      "13. Supplier watchlist 2026",
      "14. What to expect in 2027",
      "15. Key takeaways and switching checklist",
    ],
    previewImages: [energyHero, research1],
    relatedSlugs: [
      "uk-ai-electricity-demand-outlook-2026",
      "ai-electricity-cost-calculator-uk-business-guide-2026",
      "uk-electricity-demand-2035",
    ],
    downloadUrl: bestValueEnergySuppliersReport2026Pdf.url,
    faqs: [
      { q: "Is the report free to download?", a: "Yes — the full 21-page report is free. We ask for an email so we can send you a permanent link and future updates." },
      { q: "Which suppliers does it cover?", a: "Octopus Energy, 100Green, Ecotricity, Outfox the Market, British Gas, E.ON Next, OVO, EDF and other active UK domestic suppliers." },
      { q: "Is the tariff data current?", a: "Tariff data reflects publicly available market information as at June 2026. Prices change frequently, so always verify current rates before switching." },
    ],
  },
  {
    slug: "uk-ai-infrastructure-investment-report-2026",
    title: "UK AI Infrastructure Investment Report 2026",
    category: "infrastructure",
    status: "published-methodology-incomplete",
    methodologyGaps: [
      "A stated research method",
      "Named sources for the headline investment total",
      "Limitations",
    ],
    summary:
      "A comprehensive briefing for investors and executives on UK AI infrastructure capital deployment — covering data centres, energy generation, battery storage, grid upgrades, substations and nuclear projects to 2030.",
    cover: ukGridImg,
    publishedAt: "2026-07-13",
    lastVerified: "2026-09-24",
    pages: 22,
    version: "v1.0",
    tier: "free",
    topics: ["infrastructure", "data-centres", "investment", "grid", "nuclear", "battery-storage"],
    reviewWindowDays: 90,
    executiveSummary:
      "The United Kingdom stands at a historic inflection point. The convergence of artificial intelligence, clean energy policy and critical infrastructure investment has created a multi-decade capital deployment opportunity across six interconnected sectors. Total private and public investment committed to UK AI infrastructure exceeds £100 billion, with the government targeting the UK as a global AI superpower by 2030. This report provides a structured overview of data centres, energy generation, battery storage, grid upgrades, substations and nuclear projects.",
    keyFindings: [
      { text: "UK data centre IT load is projected to grow from around 3,220 MW in 2025 to 12,410 MW by 2030, with the market growing from roughly $15.2bn in 2025 to $32.0bn by 2031.", sourceUrl: "https://www.mordorintelligence.com/industry-reports/united-kingdom-data-center-market", sourceLabel: "Mordor Intelligence, United Kingdom Data Center Market" },
      { text: "Announced data centre investment as part of the AI Opportunities Action Plan totals around £14bn, led by Vantage (£12bn) and Nscale (£2.5bn), alongside Kyndryl's commitment to create up to 1,000 AI-related jobs in Liverpool.", sourceUrl: "https://www.datacenterdynamics.com/en/news/uk-ai-opportunities-action-plan-data-center/", sourceLabel: "Data Center Dynamics, UK AI Opportunities Action Plan coverage" },
      { text: "NESO's Clean Power 2030 plan calls for 43-50GW of offshore wind and around 217GW of total clean generation capacity by 2030; data centre electricity demand is projected to rise from around 5 TWh today to 22 TWh in 2030.", sourceUrl: "https://www.neso.energy/document/346791/download", sourceLabel: "NESO, Clean Power 2030 Annex 1: Electricity demand and supply analysis" },
      {
        segments: [
          {
            text: "UK operational battery storage capacity reached around 6.8 GW / 10.5 GWh by September 2025.",
            sourceUrl: "https://www.renewableuk.com/energypulse/blog/stacking-up-the-storage-where-the-uk-battery-market-stands-in-2025/",
            sourceLabel: "RenewableUK, September 2025",
          },
          {
            text: "NESO's Clean Power 2030 plan calls for 23-27 GW of battery storage by 2030.",
            sourceUrl: "https://www.neso.energy/document/346791/download",
            sourceLabel: "NESO, Clean Power 2030 Annex 1",
          },
          {
            text: "Masdar alone has committed more than £1 billion to UK battery storage projects.",
            sourceUrl: "https://masdar.ae/en/news/newsroom/masdar-completes-first-uk-bess-project",
            sourceLabel: "Masdar, December 2025",
          },
        ],
      },
      { text: "Grid upgrades represent around £90 billion of combined electricity and gas network investment to 2031, confirmed in Ofgem's RIIO-3 Final Determinations; substation capacity, rather than high-voltage transmission, is increasingly identified as the binding constraint on new data centre connections.", sourceUrl: "https://www.newcivilengineer.com/latest/ofgem-final-determinations-for-5-year-energy-period-sets-up-potential-90bn-network-investment-04-12-2025/", sourceLabel: "New Civil Engineer, citing Ofgem's RIIO-3 Final Determinations, December 2025" },
    ],
    correctionNote: {
      date: "2026-09-24",
      text: "Replaced the AI Opportunities Action Plan investment finding: the previous wording claimed the plan totals £14bn+ \"including Microsoft (£22bn), Vantage (£10bn), Google (£5bn) and Nscale (£2bn)\", which was factually wrong — the components exceeded the stated total, and the Microsoft and Google figures do not appear in the announcement at all. The finding now reads: around £14bn, led by Vantage (£12bn) and Nscale (£2.5bn), alongside Kyndryl's commitment to create up to 1,000 AI-related jobs in Liverpool. This was a factual error corrected against coverage of the announcement, not merely a missing citation.",
    },
    audience: [
      "Infrastructure investors, private equity and infrastructure funds",
      "Data centre developers, operators and hyperscalers",
      "Energy developers and renewable investors",
      "Corporate strategy and public affairs teams",
      "Policymakers and regulators tracking AI infrastructure",
    ],
    toc: [
      "1. Executive summary",
      "2. The investment case — why now",
      "3. Sector 1: Data centres — market scale and policy enablers",
      "4. Data centre key investment commitments",
      "5. Sector 2: Energy generation — Clean Power 2030 and PPAs",
      "6. Energy generation investment opportunity",
      "7. Sector 3: Battery storage — operational capacity and pipeline",
      "8. Battery storage investment landscape and pipeline analysis",
      "9. Sector 4: Grid upgrades — the Great Grid Upgrade",
      "10. Grid connections reform — the investment unlock",
      "11. Sector 5: Substations — the last mile of power",
      "12. Substation investment themes",
      "13. Sector 6: Nuclear projects — Wylfa SMR and Sizewell C",
      "14. Nuclear investment detail",
      "15. Sector interconnection — how the pieces fit",
      "16. AI Growth Zones — the designated opportunity map",
      "17. Investment capital map — committed spend by sector",
      "18. Risk factors — what investors must assess",
      "19. The investment thesis and conclusion",
    ],
    previewImages: [ukGridImg, dataCentreImg],
    relatedSlugs: [
      "uk-data-centre-capacity-atlas-2026",
      "uk-grid-connection-queue-analysis",
      "ai-energy-policy-briefing-2026",
    ],
    downloadUrl: ukAiInfrastructureReport2026Pdf.url,
    faqs: [
      { q: "Is the report free to download?", a: "Yes — the full 22-page investment briefing is free. We ask for an email so we can send you future updates and related research." },
      { q: "Who is the report for?", a: "Investors, executives, policymakers and advisors evaluating capital deployment opportunities across UK AI infrastructure." },
      { q: "Which sectors does it cover?", a: "Data centres, energy generation, battery storage, grid upgrades, substations and nuclear projects — plus AI Growth Zones and cross-sector interdependencies." },
    ],
  },






  {
    slug: "ai-cyber-threats-critical-infrastructure-2026",
    title: "AI-Era Cyber Threats to UK Energy Infrastructure",
    category: "cyber-security",
    status: "forthcoming",
    summary:
      "Forthcoming: a planned briefing on AI-era cyber risk to UK energy infrastructure. Not yet produced, and under review for whether it belongs on this site.",
    cover: research3,
    tier: "premium",
    topics: ["cyber", "resilience", "policy"],
    proposedScope:
      "A planned briefing drawing on published NCSC, Ofgem and operator material. No threat counts, incident figures or findings are published here because the briefing has not been produced.",
    expectedTopics: [
      "Published NCSC guidance relevant to energy operators",
      "Regulatory duties under UK NIS regulations",
      "Where AI changes the risk picture, and where it does not",
    ],
    audience: [
      "Energy sector CISOs and risk teams",
      "Board directors",
      "Regulators and policy teams",
    ],
    faqs: [
      { q: "When will this publish?", a: "No publication date has been scheduled." },
    ],
  },
  {
    slug: "ai-energy-policy-briefing-2026",
    title: "UK AI & Energy Policy Briefing",
    category: "government-policy",
    status: "in-development",
    summary:
      "In development: a planned briefing on UK policy at the intersection of AI and energy. No document is available yet.",
    cover: energyHero,
    tier: "free",
    topics: ["policy", "regulation", "growth-zones"],
    proposedScope:
      "A planned summary of published UK policy — the AI Opportunities Action Plan, AI Growth Zones, connection reform and net zero commitments — with each measure linked to its primary government source and clearly separated from our interpretation.",
    expectedTopics: [
      "AI Growth Zones: what has actually been announced",
      "Grid connection reform measures",
      "Energy and net zero policy touchpoints",
      "Open questions and unresolved policy gaps",
    ],
    audience: [
      "Policy and public affairs teams",
      "Investors tracking UK policy risk",
      "Operators and developers",
    ],
    relatedSlugs: ["uk-ai-energy-report-2026"],
    faqs: [
      { q: "What can I read now?", a: "The AI Growth Zones section of this site summarises announcements we have been able to source directly." },
    ],
  },
];

export const COLLECTIONS = [
  {
    slug: "ai-and-energy-collection",
    title: "AI & Energy Collection",
    blurb: "Everything we publish on AI's UK electricity impact — demand forecasts, efficiency and grid coupling.",
    reports: ["uk-ai-energy-report-2026", "uk-ai-electricity-demand-outlook-2026", "uk-electricity-demand-2035", "best-value-energy-suppliers-report-2026", "ai-energy-policy-briefing-2026", "ai-energy-consumption-index-q2-2025", "ai-search-vs-traditional-search-index-2026"],
    price: "Available on enquiry",
    cover: aiEnergyImg,
  },
  {
    slug: "uk-data-centre-collection",
    title: "UK Data Centre Collection",
    blurb: "Site atlas, grid queue analysis and policy briefing — the operator's intelligence pack.",
    reports: ["uk-data-centre-capacity-atlas-2026", "ai-data-centres-and-the-uk-electricity-grid-2026", "uk-grid-connection-queue-analysis", "ai-energy-policy-briefing-2026"],
    price: "Available on enquiry",
    cover: dataCentreImg,
  },
  {
    slug: "business-ai-toolkit",
    title: "Business AI Toolkit",
    blurb: "Benchmarks, readiness data and playbooks for UK CIOs and boards evaluating AI deployment.",
    reports: ["business-ai-roi-benchmark-2026", "ai-electricity-cost-calculator-uk-business-guide-2026", "business-guide-to-ai-energy-costs-2026", "ai-and-energy-crisis-2026", "uk-business-ai-policy-template-and-governance-pack-2026"],
    price: "Available on enquiry",
    cover: research2,
  },
  {
    slug: "cyber-security-collection",
    title: "Cyber Security Collection",
    blurb: "AI-era threats to UK critical national energy infrastructure, with board-level guidance.",
    reports: ["ai-cyber-threats-critical-infrastructure-2026", "ai-energy-policy-briefing-2026"],
    price: "Available on enquiry",
    cover: research3,
  },
];

export type Collection = (typeof COLLECTIONS)[number];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getReport(slug: string): Report | undefined {
  return REPORTS.find((r) => r.slug === slug);
}

export function getRelatedReports(report: Report): Report[] {
  const bySlug = (report.relatedSlugs ?? [])
    .map(getReport)
    .filter((r): r is Report => !!r);
  if (bySlug.length >= 2) return bySlug.slice(0, 3);
  const sameCategory = REPORTS.filter(
    (r) => r.category === report.category && r.slug !== report.slug,
  );
  return [...bySlug, ...sameCategory].slice(0, 3);
}

export function getReportsByCategory(
  category: CategorySlug,
  excludeSlug?: string,
  limit = 6,
): Report[] {
  return REPORTS.filter(
    (r) => r.category === category && r.slug !== excludeSlug,
  ).slice(0, limit);
}

export function getReportsByTopic(
  topic: string,
  excludeSlug?: string,
  limit = 4,
): Report[] {
  return REPORTS.filter(
    (r) => r.topics.includes(topic) && r.slug !== excludeSlug,
  ).slice(0, limit);
}

export function getCollectionsForReport(slug: string): Collection[] {
  return COLLECTIONS.filter((c) => (c.reports as readonly string[]).includes(slug));
}

export function categoryLabel(slug: CategorySlug): string {
  return REPORT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
