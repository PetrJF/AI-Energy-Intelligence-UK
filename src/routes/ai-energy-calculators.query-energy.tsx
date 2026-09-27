import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  DataCard,
  SeoSection,
  RelatedContent,
  ToolNavButtons,
  EnergyFAQ,
  EField,
  ENumber,
  ESelect,
  gbp,
  num,
  APPLIANCES,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/query-energy")({
  head: () => ({
    meta: [
      { title: "AI Query Energy Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the electricity consumption of AI text prompts, image and video generations per day, with daily, monthly and annual kWh and cost estimates.",
      },
      { property: "og:title", content: "AI Query Energy Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate AI electricity use in kWh and £ across daily, monthly and annual periods.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators/query-energy" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators/query-energy" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Query Energy Calculator UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/query-energy\",\"description\":\"Estimate the electricity consumption of AI text prompts, image and video generations per day, with daily, monthly and annual kWh and cost estimates.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Energy Calculators\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Query Energy\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/query-energy\"}]}" },
    ],
  }),
  component: QueryEnergyCalc,
});

const TEXT = { light: 0.0003, medium: 0.001, heavy: 0.003 };
const IMAGE = { light: 0.005, medium: 0.02, heavy: 0.05 };
const VIDEO = { light: 0.05, medium: 0.2, heavy: 0.5 };

type Level = "light" | "medium" | "heavy";

function QueryEnergyCalc() {
  const [text, setText] = useState(40);
  const [images, setImages] = useState(5);
  const [videos, setVideos] = useState(1);
  const [users, setUsers] = useState(1);
  const [level, setLevel] = useState<Level>("medium");
  const [price, setPrice] = useState(0.27);

  const r = useMemo(() => {
    const perDayPerUser = text * TEXT[level] + images * IMAGE[level] + videos * VIDEO[level];
    const daily = perDayPerUser * users;
    const monthly = daily * 30;
    const annual = daily * 365;
    return {
      daily,
      monthly,
      annual,
      monthlyCost: monthly * price,
      annualCost: annual * price,
      dishwashers: annual / APPLIANCES.dishwasher.kwh,
      dryers: annual / APPLIANCES.dryer.kwh,
    };
  }, [text, images, videos, users, level, price]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Query Energy Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Calculator 1"
        title="AI Query Energy Calculator"
        intro="Estimate the electricity consumption associated with your AI usage across text prompts, image generations and video generations."
        icon={Zap}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your AI usage</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Text prompts per day">
                <ENumber min={0} value={text} onChange={(e) => setText(+e.target.value)} />
              </EField>
              <EField label="Image generations per day">
                <ENumber min={0} value={images} onChange={(e) => setImages(+e.target.value)} />
              </EField>
              <EField label="Video generations per day">
                <ENumber min={0} value={videos} onChange={(e) => setVideos(+e.target.value)} />
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="Usage level" hint="energy intensity per action">
                <ESelect value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </ESelect>
              </EField>
              <EField label="Electricity price per kWh (£)">
                <ENumber min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Daily" value={`${num.format(r.daily)} kWh`} />
            <DataCard label="Monthly" value={`${num.format(r.monthly)} kWh`} />
            <DataCard label="Annual" value={`${num.format(r.annual)} kWh`} accent />
            <DataCard label="Monthly cost" value={gbp.format(r.monthlyCost)} />
            <DataCard label="Annual cost" value={gbp.format(r.annualCost)} />
            <DataCard label="Appliance equivalent" value={`${num.format(r.dishwashers)}×`} sub="dishwasher cycles / yr" />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English explanation</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Based on your inputs, this AI usage could consume approximately{" "}
            <strong>{num.format(r.annual)} kWh per year</strong>. That is roughly similar to{" "}
            <strong>{num.format(r.dishwashers)} dishwasher cycles</strong> or{" "}
            <strong>{num.format(r.dryers)} tumble dryer cycles</strong>. This is an estimate only because AI energy use
            depends heavily on model size, server hardware and data centre efficiency.
          </p>
          <p className="mt-3 rounded-lg bg-energy-grey p-3 text-xs text-energy-ink/70">
            This calculator uses broad public estimates and simplified assumptions. It is designed to show scale, not
            provide precise AI workload metering.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We apply a per-action energy assumption based on your selected usage level, multiply by your daily activity
            and number of users, then scale to daily, monthly and annual totals. Cost is calculated by multiplying total
            kWh by your electricity price.
          </p>
          <p>
            Per-action assumptions (kWh): text prompt — light 0.0003, medium 0.001, heavy 0.003; image generation —
            light 0.005, medium 0.02, heavy 0.05; video generation — light 0.05, medium 0.2, heavy 0.5.
          </p>
        </SeoSection>

        <SeoSection title="What The Result Means">
          <p>
            The headline annual figure shows the approximate electricity behind your AI activity. The appliance
            comparison translates that into familiar household terms so the scale is easier to grasp. Cost figures use
            the electricity price you entered.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            Real AI energy use varies enormously by model, data centre, cooling system, hardware, location and workload.
            These figures use simplified public estimates and should be treated as directional, not precise metering.
          </p>
        </SeoSection>

        <RelatedContent tool="query-energy" />

        <EnergyFAQ
          items={[
            {
              q: "Does this appear on my home electricity bill?",
              a: "Usually not directly — most AI compute happens in data centres. This tool estimates the underlying electricity demand behind AI services, not your domestic meter reading.",
            },
            {
              q: "Why are the assumptions so broad?",
              a: "Public information on per-query AI energy use varies widely. We use conservative mid-range figures to show scale rather than claim precision.",
            },
            {
              q: "Which usage level should I pick?",
              a: "Light suits short, simple prompts on smaller models; heavy suits long prompts on large frontier models or high-resolution media generation.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI energy tools</h3>
          <ToolNavButtons current="/ai-energy-calculators/query-energy" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
