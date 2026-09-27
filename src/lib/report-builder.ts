import type { PdfReport } from "./pdf";

const fmtGBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

type Stored = {
  source: string;
  inputs: Record<string, any>;
  resultSummary: Record<string, any>;
};

// Maps a saved lead's inputs + result summary back into the same PdfReport
// shape the tools build directly. Mirrors the structure used in the three
// tool routes so emailed reports look identical to on-page downloads.
export function buildReportFromStored(stored: Stored): PdfReport | null {
  const { source, inputs: f, resultSummary: r } = stored;

  if (source === "savings-calculator") {
    return {
      filename: "ai-energy-savings-report.pdf",
      title: "AI Cost Savings Report",
      subtitle: `Team size: ${f.employees ?? "—"} · Avg hourly cost: £${f.hourly ?? "—"}`,
      intro:
        "An estimate of weekly, monthly and annual AI savings for your business based on the inputs you provided.",
      highlight: {
        label: "Realistic annual saving",
        value: fmtGBP.format(Number(r.annual ?? 0)),
      },
      sections: [
        {
          heading: "Headline figures",
          bullets: [
            `Weekly saving: ${fmtGBP.format(Number(r.weekly ?? 0))}`,
            `Monthly saving: ${fmtGBP.format(Number(r.monthly ?? 0))}`,
            `Annual saving (realistic): ${fmtGBP.format(Number(r.annual ?? 0))}`,
            `Hours saved per week (team total): ${Number(r.hoursSaved ?? 0).toFixed(0)}`,
          ],
        },
        {
          heading: "Annual scenarios",
          bullets: [
            `Conservative: ${fmtGBP.format(Number(r.conservative ?? 0))}`,
            `Realistic: ${fmtGBP.format(Number(r.annual ?? 0))}`,
            `Optimistic: ${fmtGBP.format(Number(r.optimistic ?? 0))}`,
          ],
        },
        {
          heading: "Suggested AI use cases",
          bullets: (r.useCases as string[] | undefined) ?? [],
        },
        {
          heading: "Your inputs",
          bullets: [
            `Employees: ${f.employees}`,
            `Average hourly staff cost: £${f.hourly}`,
            `Weekly admin / support / marketing hours per person: ${f.admin} / ${f.support} / ${f.marketing}`,
            `Current monthly software spend: £${f.software}`,
            `Estimated automation: ${f.automation}%`,
          ],
        },
        {
          heading: "Disclaimer",
          body: "These figures are directional estimates designed to support business cases, not guarantees. Actual savings depend on rollout, training and adoption.",
        },
      ],
    };
  }

  if (source === "readiness-checker") {
    return {
      filename: "ai-readiness-report.pdf",
      title: "AI Business Readiness Report",
      subtitle: `Sector: ${f.sector || "—"} · Staff: ${f.staff || "—"}`,
      intro:
        "Your tailored AI readiness assessment, generated from your responses to the AI Energy Intelligence UK Readiness Checker.",
      highlight: {
        label: `Readiness — ${r.level ?? ""}`,
        value: `${r.score ?? 0} / 100`,
      },
      sections: [
        { heading: "Best first use cases", bullets: (r.useCases as string[]) ?? [] },
        {
          heading: "Main risks",
          bullets:
            ((r.risks as string[]) ?? []).length > 0
              ? (r.risks as string[])
              : ["No major risks flagged based on your answers."],
        },
        { heading: "Suggested next steps", bullets: (r.next as string[]) ?? [] },
        { heading: "Recommended tool categories", bullets: (r.tools as string[]) ?? [] },
        {
          heading: "Your inputs",
          bullets: [
            `Sector: ${f.sector}`,
            `Staff: ${f.staff}`,
            `Current AI use: ${f.currentAi}`,
            `Main challenge: ${f.challenges}`,
            `Admin / customer service / marketing workload: ${f.admin} / ${f.customerService} / ${f.marketing}`,
            `Data sensitivity: ${f.dataSensitivity}`,
            `Monthly AI budget: ${f.budget}`,
          ],
        },
      ],
    };
  }

  if (source === "risk-checker") {
    return {
      filename: "ai-risk-report.pdf",
      title: "AI Risk & Compliance Report",
      subtitle: `UK GDPR-aware audit · ${r.level ?? "—"} risk rating`,
      intro:
        "A practical UK-focused risk audit of your current AI use, with concerns and a mitigation checklist.",
      highlight: { label: "Risk rating", value: `${r.level ?? "—"} risk` },
      sections: [
        { heading: "Key risks", bullets: (r.risks as string[]) ?? [] },
        { heading: "UK GDPR / data protection concerns", bullets: (r.gdpr as string[]) ?? [] },
        { heading: "Staff & policy recommendations", bullets: (r.policy as string[]) ?? [] },
        { heading: "Practical mitigation checklist", bullets: (r.mitigations as string[]) ?? [] },
        {
          heading: "Disclaimer",
          body: "This report is directional guidance, not legal advice. For DPIAs and special category data, consult a qualified data protection lawyer or DPO.",
        },
      ],
    };
  }

  return null;
}
