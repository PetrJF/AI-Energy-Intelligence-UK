import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage, PolicySection, policyHead } from "@/components/PolicyPage";

const SECTIONS = [
  { id: "principles", label: "Principles" },
  { id: "sources", label: "Data sources" },
  { id: "calculators", label: "Calculator method" },
  { id: "assumptions", label: "Assumptions & defaults" },
  { id: "scenarios", label: "Scenarios vs forecasts" },
  { id: "uncertainty", label: "Uncertainty" },
  { id: "reports", label: "Report method" },
  { id: "review", label: "Review & versioning" },
  { id: "limits", label: "Known limitations" },
];

export const Route = createFileRoute("/research-methodology")({
  head: () =>
    policyHead({
      title: "Research Methodology — AI Energy Intelligence UK",
      description:
        "How AI Energy Intelligence UK builds its AI energy estimates: data sources, calculator assumptions, scenario design, uncertainty handling, review and versioning.",
      path: "/research-methodology",
    }),
  component: Methodology,
});

function Methodology() {
  return (
    <PolicyPage
      eyebrow="Trust"
      title="Research Methodology"
      intro="How we build the numbers: where the underlying data comes from, how our calculators and scenarios are constructed, and what those outputs can and cannot tell you."
      updated="10 August 2026"
      badge="Estimates, with assumptions shown"
      sections={SECTIONS}
    >
      <PolicySection id="principles" title="1. Principles">
        <ul>
          <li><strong>Reproducible</strong> — anyone reading a page should be able to rebuild the number from the stated inputs.</li>
          <li><strong>Transparent</strong> — assumptions and default values are shown on the page, not buried.</li>
          <li><strong>Conservative</strong> — where evidence is contested we present a range and lean away from the most dramatic figure.</li>
          <li><strong>UK-specific</strong> — tariffs, grid intensity and policy context are UK-based; we flag when a source is not.</li>
          <li><strong>Honest about gaps</strong> — where public data does not exist, we say so rather than filling the gap with an invented figure.</li>
        </ul>
      </PolicySection>

      <PolicySection id="sources" title="2. Data sources">
        <p>Our inputs are drawn from published, checkable material, typically:</p>
        <ul>
          <li>UK government and regulator publications (DESNZ, Ofgem, NESO / National Grid, the ONS);</li>
          <li>operator and vendor disclosures, including company reporting and sustainability filings;</li>
          <li>peer-reviewed and preprint academic research on model training and inference energy;</li>
          <li>planning applications and local authority documents for data centre projects;</li>
          <li>published price data for electricity tariffs and wholesale costs.</li>
        </ul>
        <p>
          Each figure carries the date of the source it came from. Where a value is a placeholder pending better
          data, the page says so explicitly.
        </p>
      </PolicySection>

      <PolicySection id="calculators" title="3. How the calculators work">
        <p>
          Every tool in our <Link to="/ai-energy-calculators" className="link">calculator suite</Link> follows the
          same shape: energy first, then cost, then comparison.
        </p>
        <ol>
          <li>
            <strong>Energy</strong> — an activity volume (prompts, GPU hours, rack capacity) is multiplied by an
            energy intensity per unit to give kWh.
          </li>
          <li>
            <strong>Overheads</strong> — where relevant, a power usage effectiveness (PUE) multiplier is applied to
            account for cooling and facility load.
          </li>
          <li>
            <strong>Cost</strong> — kWh are multiplied by a UK unit price, which you can override with your own
            tariff.
          </li>
          <li>
            <strong>Carbon and comparison</strong> — kWh are converted using a UK grid intensity factor and
            expressed against familiar reference points such as household appliance use.
          </li>
        </ol>
        <p>
          Calculations run in your browser. We do not store the values you enter — see our{" "}
          <Link to="/privacy" className="link">privacy policy</Link>.
        </p>
      </PolicySection>

      <PolicySection id="assumptions" title="4. Assumptions and defaults">
        <p>
          Default values are starting points, not claims about your specific situation. Energy per AI query in
          particular varies by orders of magnitude depending on model size, hardware, batching, context length and
          whether the workload is training or inference. That is why every tool exposes its inputs: the defaults
          exist so the tool is usable, and the overrides exist because the defaults will not match everyone.
        </p>
      </PolicySection>

      <PolicySection id="scenarios" title="5. Scenarios are not forecasts">
        <p>
          Our forward-looking tools and scenario pages model "if these inputs held, this is the arithmetic
          outcome". They are not predictions of what will happen, they contain no view on policy or market
          behaviour, and they should not be read as investment, procurement or planning advice.
        </p>
      </PolicySection>

      <PolicySection id="uncertainty" title="6. Handling uncertainty">
        <ul>
          <li>Ranges are used wherever the underlying evidence supports a range rather than a point estimate.</li>
          <li>We state the direction of likely error when a figure is known to be conservative or generous.</li>
          <li>We do not present a modelled output with more precision than its weakest input justifies.</li>
          <li>Where two credible sources disagree materially, we show both and explain the disagreement.</li>
        </ul>
      </PolicySection>

      <PolicySection id="reports" title="7. Report methodology">
        <p>
          Each report in our <Link to="/reports" className="link">reports library</Link> states its scope, its
          period of coverage, its data sources and its assumptions. Where a report contains original modelling, the
          method is described inside the document so a reader can challenge it. Reports are dated and superseded
          rather than silently rewritten.
        </p>
      </PolicySection>

      <PolicySection id="review" title="8. Review and versioning">
        <p>
          Methodology and default values are reviewed on a rolling basis and whenever a primary source publishes
          revised data. Material changes to a model are logged as a model revision under our{" "}
          <Link to="/corrections" className="link">corrections policy</Link>, recording the previous value, the new
          value and the reason.
        </p>
      </PolicySection>

      <PolicySection id="limits" title="9. Known limitations">
        <ul>
          <li>Public disclosure of AI workload energy use is limited; several inputs rest on a small evidence base.</li>
          <li>Data centre-level figures are often commercially confidential and only partially visible in planning documents.</li>
          <li>Grid carbon intensity varies constantly; our factors are period averages, not real-time values.</li>
          <li>Tariff defaults age quickly — always override them with your own contracted rate.</li>
        </ul>
        <p>
          These outputs are for information only and do not constitute professional, financial or engineering
          advice. Our full publishing rules are in our{" "}
          <Link to="/editorial-standards" className="link">editorial standards</Link>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
