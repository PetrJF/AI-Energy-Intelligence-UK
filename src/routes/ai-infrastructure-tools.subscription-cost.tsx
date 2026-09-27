import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  DataCard,
  SeoSection,
  EnergyFAQ,
  EField,
  ENumber,
  ESelect,
  gbp,
} from "@/components/energy/EnergyUI";
import { Tier2RelatedContent, Tier2NavButtons, RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/ai-infrastructure-tools/subscription-cost")({
  head: () => ({
    meta: [
      { title: "AI Subscription Real Cost Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate your real AI cost. See annual AI subscription spend alongside infrastructure burden, electricity demand and data centre dependency scores.",
      },
      { property: "og:title", content: "AI Subscription Real Cost Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Reveal the hidden infrastructure behind your AI subscription fees.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/subscription-cost" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/subscription-cost" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Subscription Real Cost Calculator UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/subscription-cost\",\"description\":\"Estimate your real AI cost. See annual AI subscription spend alongside infrastructure burden, electricity demand and data centre dependency scores.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Subscription Cost\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/subscription-cost\"}]}" },
    ],
  }),
  component: SubscriptionCostCalc,
});

type Level = "light" | "medium" | "heavy";

const LEVEL_FACTOR: Record<Level, number> = { light: 0.6, medium: 1, heavy: 1.8 };

function scoreToLevel(score: number): RatingLevel {
  if (score < 25) return "Low";
  if (score < 50) return "Medium";
  if (score < 80) return "High";
  return "Very High";
}

function SubscriptionCostCalc() {
  const [monthlyCost, setMonthlyCost] = useState(20);
  const [subscriptions, setSubscriptions] = useState(2);
  const [type, setType] = useState("ChatGPT");
  const [users, setUsers] = useState(1);
  const [level, setLevel] = useState<Level>("medium");
  const [prompts, setPrompts] = useState(2000);

  const r = useMemo(() => {
    const monthly = monthlyCost * subscriptions * users;
    const annual = monthly * 12;

    const factor = LEVEL_FACTOR[level];
    // Heuristic scoring (0-100) based on scale of usage.
    const base = subscriptions * users * factor;
    const promptFactor = Math.min(prompts / 1000, 30);

    const infrastructure = Math.min(100, Math.round(base * 6 + promptFactor * 1.5));
    const electricity = Math.min(100, Math.round(base * 5 + promptFactor * 2));
    const dataCentre = Math.min(100, Math.round(base * 7 + promptFactor));

    return {
      monthly,
      annual,
      infrastructure,
      electricity,
      dataCentre,
      infraLevel: scoreToLevel(infrastructure),
      elecLevel: scoreToLevel(electricity),
      dcLevel: scoreToLevel(dataCentre),
    };
  }, [monthlyCost, subscriptions, type, users, level, prompts]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools", to: "/ai-infrastructure-tools" },
          { label: "AI Subscription Real Cost Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 6"
        title="AI Subscription Real Cost Calculator"
        intro="AI subscription fees represent only part of the wider infrastructure cost behind AI services. This tool puts your spend alongside the hidden infrastructure, energy and data centre burden it depends on."
        icon={Calculator}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This calculator provides educational estimates only. It is
          not financial advice and does not estimate company profitability or actual operating costs.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your AI subscriptions</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Monthly subscription cost (£)">
                <ENumber min={0} step={0.5} value={monthlyCost} onChange={(e) => setMonthlyCost(+e.target.value)} />
              </EField>
              <EField label="Number of subscriptions">
                <ENumber min={1} value={subscriptions} onChange={(e) => setSubscriptions(+e.target.value)} />
              </EField>
              <EField label="Subscription type">
                <ESelect value={type} onChange={(e) => setType(e.target.value)}>
                  {["ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney", "Other"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="Usage level">
                <ESelect value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </ESelect>
              </EField>
              <EField label="Monthly prompts estimate" hint="optional">
                <ENumber min={0} value={prompts} onChange={(e) => setPrompts(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Monthly spend" value={gbp.format(r.monthly)} />
            <DataCard label="Annual spend" value={gbp.format(r.annual)} accent />
            <DataCard label="Infrastructure burden" value={`${r.infrastructure}/100`} sub={r.infraLevel} />
            <DataCard label="Electricity demand" value={`${r.electricity}/100`} sub={r.elecLevel} />
            <DataCard label="Data centre dependency" value={`${r.dataCentre}/100`} sub={r.dcLevel} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English explanation</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Your annual AI subscription spend is approximately <strong>{gbp.format(r.annual)}</strong>. While the
            subscription cost is visible, the supporting infrastructure includes servers, storage, networking equipment,
            cooling systems and electricity consumption across multiple data centres.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-energy-ink/60">Infrastructure burden:</span> <RatingBadge level={r.infraLevel} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-energy-ink/60">Electricity demand:</span> <RatingBadge level={r.elecLevel} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-energy-ink/60">Data centre dependency:</span> <RatingBadge level={r.dcLevel} />
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-energy-grey p-3 text-xs text-energy-ink/70">
            This calculator does not estimate company profitability or actual operating costs. Scores are directional
            indicators based on the scale of your usage, not measured figures.
          </p>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We multiply your monthly subscription cost by the number of subscriptions and users to produce monthly and
            annual spend. The infrastructure, electricity and data centre scores are heuristic 0–100 indicators that grow
            with the number of subscriptions, users, your usage level and estimated monthly prompts.
          </p>
        </SeoSection>

        <SeoSection title="What Your Subscription Actually Pays For">
          <p>
            A monthly AI fee funds far more than software. It contributes towards graphics-heavy servers, high-speed
            storage, networking equipment, redundant power supplies, cooling systems and the electricity that runs them —
            spread across multiple data centres, often in different regions.
          </p>
        </SeoSection>

        <SeoSection title="Why AI Infrastructure Is Expensive">
          <p>
            Modern AI relies on specialist accelerators that are costly to buy, power and cool. Facilities need resilient
            power, backup generation and continuous cooling, all of which add capital and operating costs well beyond the
            visible subscription price.
          </p>
        </SeoSection>

        <SeoSection title="Why Energy Costs Matter">
          <p>
            Electricity is one of the largest ongoing costs of running AI at scale. As models grow and usage rises, the
            energy required to serve responses increases — which is why energy efficiency and grid capacity are central
            to the economics of AI.
          </p>
        </SeoSection>

        <SeoSection title="Why AI Companies Monitor Utilisation">
          <p>
            Because compute is expensive, providers track how intensively each account uses their systems. Heavy usage
            consumes more electricity and hardware time, which is why usage tiers, rate limits and fair-use policies are
            common.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            These figures are simplified educational indicators. Real infrastructure costs depend on model size,
            efficiency, hardware, data centre design and provider economics, none of which are publicly metered per
            subscription.
          </p>
        </SeoSection>

        <Tier2RelatedContent tool="subscription-cost" />

        <EnergyFAQ
          items={[
            {
              q: "Why are AI subscriptions relatively cheap?",
              a: "Providers spread enormous infrastructure costs across millions of users and often subsidise consumer pricing to grow adoption, so the headline fee rarely reflects the full cost of serving you.",
            },
            {
              q: "What costs are hidden behind AI services?",
              a: "Servers, AI accelerators, storage, networking, redundant power, cooling and electricity across multiple data centres — plus research, staffing and maintenance.",
            },
            {
              q: "How much infrastructure supports AI?",
              a: "A single AI service can rely on thousands of accelerators across several data centres. This tool gives a directional sense of that dependency rather than an exact figure.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI infrastructure tools</h3>
          <Tier2NavButtons current="/ai-infrastructure-tools/subscription-cost" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
