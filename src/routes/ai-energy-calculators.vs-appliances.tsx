import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
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
  num,
  APPLIANCES,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/vs-appliances")({
  head: () => ({
    meta: [
      { title: "AI vs Household Appliance Energy Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Compare estimated AI energy use with common UK household appliances like kettles, dishwashers, tumble dryers and EV charging.",
      },
      { property: "og:title", content: "AI vs Household Appliance Energy Calculator UK" },
      {
        property: "og:description",
        content: "See how estimated AI energy use compares with everyday UK appliances.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators/vs-appliances" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators/vs-appliances" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI vs Household Appliance Energy Calculator UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/vs-appliances\",\"description\":\"Compare estimated AI energy use with common UK household appliances like kettles, dishwashers, tumble dryers and EV charging.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Energy Calculators\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Vs Appliances\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/vs-appliances\"}]}" },
    ],
  }),
  component: VsAppliancesCalc,
});

const TEXT = { low: 0.0003, medium: 0.001, high: 0.003 };
const IMAGE = { low: 0.005, medium: 0.02, high: 0.05 };
const VIDEO = { low: 0.05, medium: 0.2, high: 0.5 };

type Level = "low" | "medium" | "high";
type ApplianceKey = keyof typeof APPLIANCES;

function VsAppliancesCalc() {
  const [text, setText] = useState(40);
  const [images, setImages] = useState(5);
  const [videos, setVideos] = useState(1);
  const [users, setUsers] = useState(1);
  const [level, setLevel] = useState<Level>("medium");
  const [appliance, setAppliance] = useState<ApplianceKey>("dryer");

  const r = useMemo(() => {
    const perDayPerUser = text * TEXT[level] + images * IMAGE[level] + videos * VIDEO[level];
    const daily = perDayPerUser * users;
    const monthly = daily * 30;
    const app = APPLIANCES[appliance];
    return {
      daily,
      monthly,
      appEquivMonthly: monthly / app.kwh,
      appLabel: app.label,
    };
  }, [text, images, videos, users, level, appliance]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI vs Household Appliance Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Calculator 2"
        title="AI vs Household Appliance Calculator"
        intro="Compare your estimated AI energy use with common UK household appliances to put the numbers in everyday terms."
        icon={Gauge}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your AI usage</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="AI text prompts per day">
                <ENumber min={0} value={text} onChange={(e) => setText(+e.target.value)} />
              </EField>
              <EField label="AI image generations per day">
                <ENumber min={0} value={images} onChange={(e) => setImages(+e.target.value)} />
              </EField>
              <EField label="AI video generations per day">
                <ENumber min={0} value={videos} onChange={(e) => setVideos(+e.target.value)} />
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="Usage level">
                <ESelect value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Compare with appliance">
                <ESelect value={appliance} onChange={(e) => setAppliance(e.target.value as ApplianceKey)}>
                  <option value="kettle">Kettle</option>
                  <option value="dishwasher">Dishwasher</option>
                  <option value="washing">Washing Machine</option>
                  <option value="dryer">Tumble Dryer</option>
                  <option value="oven">Electric Oven</option>
                  <option value="shower">Electric Shower</option>
                  <option value="ev">EV Charge</option>
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-1 gap-3 content-start">
            <DataCard label="Estimated AI daily use" value={`${num.format(r.daily)} kWh`} />
            <DataCard label="Estimated AI monthly use" value={`${num.format(r.monthly)} kWh`} accent />
            <DataCard
              label="Appliance equivalent"
              value={`${num.format(r.appEquivMonthly)}×`}
              sub={`${r.appLabel} per month`}
            />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English comparison</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Your estimated monthly AI use is around <strong>{num.format(r.monthly)} kWh</strong>. That is roughly
            equivalent to <strong>{num.format(r.appEquivMonthly)} {r.appLabel.toLowerCase()}</strong> per month. This does
            not mean your AI use directly appears on your home electricity bill, but it helps show the wider
            infrastructure demand behind AI services.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We estimate daily AI energy from your prompt, image and video volumes at the chosen usage level, scale to a
            monthly figure, then divide by the energy of one cycle of your chosen appliance to produce an equivalent.
          </p>
          <p>
            Appliance assumptions (kWh): kettle boil 0.1, dishwasher cycle 1.2, washing machine cycle 0.8, tumble dryer
            cycle 2.5, electric oven hour 2.0, electric shower (10 min) 1.5, small EV charge 7.0.
          </p>
        </SeoSection>

        <SeoSection title="What The Result Means">
          <p>
            Appliance equivalents make abstract kWh figures tangible. They illustrate the scale of energy behind AI
            services — most of which is consumed in data centres rather than at home — and help frame conversations about
            wider grid and infrastructure demand.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            These comparisons are illustrative. Appliance energy use varies by model and usage, and AI energy use varies
            by model, hardware and data centre efficiency. Treat the result as a sense of scale, not a precise figure.
          </p>
        </SeoSection>

        <RelatedContent tool="vs-appliances" />

        <EnergyFAQ
          items={[
            {
              q: "Does my AI use add to my home energy bill?",
              a: "Generally no — AI compute happens in data centres. The comparison shows the underlying energy scale, not a charge on your domestic meter.",
            },
            {
              q: "Why compare with appliances at all?",
              a: "Kilowatt-hours are hard to picture. Everyday appliances give an intuitive reference for how much energy AI activity represents.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI energy tools</h3>
          <ToolNavButtons current="/ai-energy-calculators/vs-appliances" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
