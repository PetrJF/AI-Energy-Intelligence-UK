import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { getReportById } from "@/lib/reports.functions";
import { buildReportFromStored } from "@/lib/report-builder";
import { downloadReport } from "@/lib/pdf";
import { PageHero, ToolShell } from "@/components/ToolUI";

export const Route = createFileRoute("/report/$id")({
  head: () => ({
    meta: [
      { title: "Your AI Energy Intelligence UK report" },
      {
        name: "description",
        content:
          "Download your personalised AI Energy Intelligence UK report — a PDF summary of your calculator inputs and results, ready to share or save.",
      },
      { property: "og:title", content: "Your AI Energy Intelligence UK report" },
      {
        property: "og:description",
        content:
          "Download your personalised AI Energy Intelligence UK report — a PDF summary of your calculator inputs and results.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { id } = Route.useParams();
  const fetchReport = useServerFn(getReportById);
  const [autoTriggered, setAutoTriggered] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["report", id],
    queryFn: () => fetchReport({ data: { id } }),
    retry: false,
  });

  const report = data?.report ?? null;
  const parsed = report
    ? {
        source: report.source,
        variant: report.variant,
        inputs: JSON.parse(report.inputs) as Record<string, any>,
        resultSummary: JSON.parse(report.resultSummary) as Record<string, any>,
      }
    : null;

  const pdf = parsed ? buildReportFromStored(parsed) : null;

  // Auto-trigger the download once on first successful load.
  useEffect(() => {
    if (pdf && !autoTriggered) {
      setAutoTriggered(true);
      // Slight delay so the success UI renders before the browser save dialog.
      setTimeout(() => downloadReport(pdf), 350);
    }
  }, [pdf, autoTriggered]);

  return (
    <>
      <PageHero
        eyebrow="Your report"
        title="Your AI Energy Intelligence UK report is ready"
        intro="Your personalised PDF should download automatically. If it doesn't, use the button below."
      />
      <ToolShell>
        {isLoading && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground shadow-card">
            Loading your report…
          </div>
        )}

        {!isLoading && (!report || !pdf) && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <h2 className="font-display text-xl font-bold">Report not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isError
                ? "Something went wrong fetching your report."
                : "This report link is invalid or has expired. Run the tool again to generate a fresh report."}
            </p>
            <div className="mt-5">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Back to AI Energy Intelligence UK
              </Link>
            </div>
          </div>
        )}

        {pdf && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-accent p-3">
                <FileText className="h-6 w-6 text-brand" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold">{pdf.title}</h2>
                {pdf.subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{pdf.subtitle}</p>
                )}
                {pdf.highlight && (
                  <div className="mt-4 rounded-xl bg-secondary p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {pdf.highlight.label}
                    </div>
                    <div className="mt-1 font-display text-3xl font-bold text-brand">
                      {pdf.highlight.value}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => downloadReport(pdf)}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download PDF report
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Tip: bookmark this page if you want to download it again later.
                </p>
              </div>
            </div>
          </div>
        )}
      </ToolShell>
    </>
  );
}
