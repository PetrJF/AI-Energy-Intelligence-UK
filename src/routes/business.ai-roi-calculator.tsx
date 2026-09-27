import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
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
  gbp,
  num,
} from "@/components/energy/EnergyUI";
import { ToolPageFooter, breadcrumbLd, faqLd, toolLd } from "@/components/energy/hub";

const PATH = "/business/ai-roi-calculator";

const FAQ = [
  {
    q: "What counts as staff savings?",
    a: "The value of time freed up by AI — for example hours saved on admin or drafting, valued at your loaded staff cost.",
  },
  {
    q: "How is payback period calculated?",
    a: "Annual cost (software + energy increase) divided by annual gross gain (staff savings + productivity gains), expressed in years.",
  },
];

export const Route = createFileRoute("/business/ai-roi-calculator")({
  head: () => ({
    meta: [
      { title: "AI ROI Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Calculate the annual ROI, payback period and net financial benefit of adopting AI in your business, factoring in software costs and energy increases.",
      },
      { property: "og:title", content: "AI ROI Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Calculate annual ROI, payback period and net benefit of AI investment.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI ROI Calculator", PATH, "Calculate ROI, payback and net benefit of AI investment."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Business Hub", path: "/business" },
        { name: "AI ROI Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [software, setSoftware] = useState(12000);
  const [staff, setStaff] = useState(30000);
  const [productivity, setProductivity] = useState(15000);
  const [energy, setEnergy] = useState(2000);

  const r = useMemo(() => {
    const cost = software + energy;
    const gain = staff + productivity;
    const net = gain - cost;
    const roi = cost > 0 ? (net / cost) * 100 : 0;
    const paybackYears = gain > 0 ? cost / gain : 0;
    return { cost, gain, net, roi, paybackYears, paybackMonths: paybackYears * 12 };
  }, [software, staff, productivity, energy]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Business Hub", to: "/business" },
          { label: "AI ROI Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Business Hub"
        title="AI ROI Calculator"
        intro="Calculate the annual return, payback period and net financial benefit of adopting AI in your business — weighed against software and energy costs."
        icon={TrendingUp}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Annual figures (£)</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="AI software cost">
                <ENumber min={0} value={software} onChange={(e) => setSoftware(+e.target.value)} />
              </EField>
              <EField label="Staff time savings">
                <ENumber min={0} value={staff} onChange={(e) => setStaff(+e.target.value)} />
              </EField>
              <EField label="Productivity gains">
                <ENumber min={0} value={productivity} onChange={(e) => setProductivity(+e.target.value)} />
              </EField>
              <EField label="Energy cost increase">
                <ENumber min={0} value={energy} onChange={(e) => setEnergy(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Annual ROI" value={`${num.format(r.roi)}%`} accent />
            <DataCard label="Net benefit" value={gbp.format(r.net)} accent />
            <DataCard
              label="Payback period"
              value={r.net > 0 ? `${num.format(r.paybackMonths)} mo` : "—"}
              sub={r.net > 0 ? "to recoup cost" : "no payback"}
            />
            <DataCard label="Total annual cost" value={gbp.format(r.cost)} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English summary</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            On these figures, AI delivers a net annual benefit of <strong>{gbp.format(r.net)}</strong>, an ROI of{" "}
            <strong>{num.format(r.roi)}%</strong>
            {r.net > 0 ? (
              <>
                {" "}
                and pays back in about <strong>{num.format(r.paybackMonths)} months</strong>.
              </>
            ) : (
              <> — costs currently outweigh the modelled benefits.</>
            )}
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            Net benefit = (staff savings + productivity gains) − (software cost + energy increase). ROI = net benefit ÷
            total cost. Payback = total cost ÷ annual gross gain.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            A positive ROI and short payback indicate AI is likely to pay for itself; energy cost increases are included
            so the picture reflects the true running cost.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Estimates depend on how accurately you value time saved and productivity gains. Use conservative figures.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-roi"
          inputs={{ software, staff, productivity, energy }}
          resultSummary={{ roi: r.roi, net: r.net, paybackMonths: r.paybackMonths }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
