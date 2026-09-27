export type AiTool = {
  name: string;
  category: string;
  bestFor: string;
  pricing: string;
  pros: string[];
  cons: string[];
  ukRating: number; // 1-5
  affiliateUrl: string;
  url: string;
};

export const categories = [
  "AI writing tools",
  "AI image tools",
  "AI customer service tools",
  "AI meeting tools",
  "AI automation tools",
  "AI cybersecurity tools",
  "AI finance/accounting tools",
  "AI marketing tools",
] as const;

export const tools: AiTool[] = [
  { name: "ChatGPT", category: "AI writing tools", bestFor: "General writing, drafting, brainstorming", pricing: "Free / £16 pm Plus / Enterprise on request", pros: ["Best general-purpose model", "Huge ecosystem", "Voice & images included"], cons: ["Confidential data needs Enterprise", "Hallucinations on niche UK topics"], ukRating: 5, affiliateUrl: "", url: "https://chat.openai.com" },
  { name: "Claude", category: "AI writing tools", bestFor: "Long documents, careful reasoning", pricing: "Free / £15 pm Pro", pros: ["Excellent at long-form analysis", "Conservative & cautious tone"], cons: ["Smaller plugin ecosystem", "Image generation limited"], ukRating: 5, affiliateUrl: "", url: "https://claude.ai" },
  { name: "Microsoft Copilot", category: "AI writing tools", bestFor: "M365 users — Word, Excel, Outlook", pricing: "From £24.70 pm per user", pros: ["Inside Office apps", "UK enterprise data terms"], cons: ["Per-seat cost adds up", "Quality varies by app"], ukRating: 5, affiliateUrl: "", url: "https://copilot.microsoft.com" },
  { name: "Jasper", category: "AI writing tools", bestFor: "Marketing teams producing campaigns", pricing: "From $39 pm", pros: ["Brand voice control", "Templates for marketers"], cons: ["US-priced", "Underlying models you can use elsewhere"], ukRating: 3, affiliateUrl: "", url: "https://jasper.ai" },

  { name: "Midjourney", category: "AI image tools", bestFor: "High-quality marketing imagery", pricing: "From $10 pm", pros: ["Best-in-class image quality", "Strong style control"], cons: ["Discord/web only", "Not ideal for product photos"], ukRating: 4, affiliateUrl: "", url: "https://midjourney.com" },
  { name: "Adobe Firefly", category: "AI image tools", bestFor: "Brand-safe commercial imagery", pricing: "Bundled with Creative Cloud", pros: ["Commercially safe training data", "Inside Photoshop"], cons: ["Lower creative ceiling than Midjourney"], ukRating: 5, affiliateUrl: "", url: "https://firefly.adobe.com" },

  { name: "Intercom Fin", category: "AI customer service tools", bestFor: "Mid-market support automation", pricing: "From $0.99 per resolution", pros: ["Resolves repetitive tickets", "Strong analytics"], cons: ["Pricing can scale fast"], ukRating: 4, affiliateUrl: "", url: "https://intercom.com" },
  { name: "Zendesk AI", category: "AI customer service tools", bestFor: "Existing Zendesk customers", pricing: "Add-on to Zendesk plans", pros: ["Native to Zendesk", "Good triage"], cons: ["Locked to platform"], ukRating: 4, affiliateUrl: "", url: "https://zendesk.com" },

  { name: "Otter.ai", category: "AI meeting tools", bestFor: "Meeting transcripts and summaries", pricing: "Free / £8.33 pm Pro", pros: ["Solid transcription", "Action items"], cons: ["Accuracy on UK accents varies"], ukRating: 4, affiliateUrl: "", url: "https://otter.ai" },
  { name: "Fireflies.ai", category: "AI meeting tools", bestFor: "CRM-integrated meeting notes", pricing: "Free / £14 pm Pro", pros: ["Strong integrations", "Search across meetings"], cons: ["Storage limits on free"], ukRating: 4, affiliateUrl: "", url: "https://fireflies.ai" },

  { name: "Zapier", category: "AI automation tools", bestFor: "No-code automations across apps", pricing: "Free / from £15 pm", pros: ["Massive app library", "AI steps now built in"], cons: ["Costs grow with task volume"], ukRating: 5, affiliateUrl: "", url: "https://zapier.com" },
  { name: "Make", category: "AI automation tools", bestFor: "Visual automation builders", pricing: "Free / from $9 pm", pros: ["Powerful visual builder", "Good value"], cons: ["Steeper learning curve"], ukRating: 4, affiliateUrl: "", url: "https://make.com" },
  { name: "n8n", category: "AI automation tools", bestFor: "Self-hosted, data-sovereign automation", pricing: "Free self-host / cloud from $20 pm", pros: ["Self-host for UK data control", "Open source"], cons: ["Needs technical setup"], ukRating: 5, affiliateUrl: "", url: "https://n8n.io" },

  { name: "Darktrace", category: "AI cybersecurity tools", bestFor: "Enterprise threat detection (UK HQ)", pricing: "Quote-based", pros: ["Cambridge-based", "Strong network defence"], cons: ["Enterprise pricing only"], ukRating: 5, affiliateUrl: "", url: "https://darktrace.com" },
  { name: "Microsoft Defender", category: "AI cybersecurity tools", bestFor: "M365 customers", pricing: "Bundled with M365 plans", pros: ["Tight M365 integration", "AI-driven threat hunting"], cons: ["Best for Microsoft estates"], ukRating: 4, affiliateUrl: "", url: "https://microsoft.com/security" },

  { name: "Xero + AI features", category: "AI finance/accounting tools", bestFor: "UK SME accounting", pricing: "From £16 pm", pros: ["UK MTD ready", "Bank reconciliation AI"], cons: ["AI features still maturing"], ukRating: 5, affiliateUrl: "", url: "https://xero.com" },
  { name: "Dext", category: "AI finance/accounting tools", bestFor: "Receipt & invoice capture", pricing: "From £15 pm", pros: ["Excellent OCR", "UK accountant friendly"], cons: ["Per-client pricing"], ukRating: 5, affiliateUrl: "", url: "https://dext.com" },

  { name: "Surfer SEO", category: "AI marketing tools", bestFor: "Content optimisation for search", pricing: "From $89 pm", pros: ["Real SERP data", "AI writer included"], cons: ["US-priced"], ukRating: 4, affiliateUrl: "", url: "https://surferseo.com" },
  { name: "HubSpot AI", category: "AI marketing tools", bestFor: "All-in-one marketing & CRM", pricing: "Free / from £15 pm", pros: ["Inside HubSpot", "Strong email features"], cons: ["Get full value at higher tiers"], ukRating: 4, affiliateUrl: "", url: "https://hubspot.com" },
];
