import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock, Download, FileText, Info, Layers, Lock, Tag, Users } from "lucide-react";
import { useState } from "react";
import {
  getReport,
  getRelatedReports,
  getReportsByCategory,
  getCollectionsForReport,
  categoryLabel,
  formatDate,
  isAvailable,
  STATUS_LABELS,
  REPORT_CATEGORIES,
  type Report,
} from "@/data/reports";

import { FAQ } from "@/components/FAQ";
import { EmailGateDialog } from "@/components/EmailGateDialog";
import { OG_REPORTS } from "@/lib/og-images";
import { AboutThisData } from "@/components/AboutThisData";
import { PdfCorrectionNotice } from "@/components/PdfCorrectionNotice";



export const Route = createFileRoute("/reports/$slug")({
  loader: ({ params }) => {
    const report = getReport(params.slug);
    if (!report) throw notFound();
    return { report };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Report not found | AI Energy Intelligence UK" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const r = loaderData.report;
    const url = `https://aienergyintelligence.co.uk/reports/${r.slug}`;
    const image = !r.cover
      ? OG_REPORTS
      : r.cover.startsWith("http")
        ? r.cover
        : `https://aienergyintelligence.co.uk${r.cover}`;
    return {
      meta: [
        { title: `${r.title} | AI Energy Intelligence UK` },
        { name: "description", content: r.summary },
        { name: "keywords", content: [categoryLabel(r.category), ...r.topics].join(", ") },
        { property: "og:title", content: r.title },
        { property: "og:description", content: r.summary },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: r.title },
        { property: "og:site_name", content: "AI Energy Intelligence UK" },
        ...(r.publishedAt ? [{ property: "article:published_time", content: r.publishedAt }] : []),
        { property: "article:section", content: categoryLabel(r.category) },
        ...r.topics.map((t) => ({ property: "article:tag", content: t })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: r.title },
        { name: "twitter:description", content: r.summary },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Report",
            name: r.title,
            headline: r.title,
            description: r.summary,
            image,
            ...(r.publishedAt ? { datePublished: r.publishedAt, dateModified: r.publishedAt } : {}),
            creativeWorkStatus: STATUS_LABELS[r.status],
            inLanguage: "en-GB",
            isAccessibleForFree: isAvailable(r) && r.tier === "free",
            keywords: [categoryLabel(r.category), ...r.topics].join(", "),
            about: categoryLabel(r.category),
            url,
            mainEntityOfPage: url,
            author: {
              "@type": "Organization",
              name: "AI Energy Intelligence UK",
              url: "https://aienergyintelligence.co.uk",
            },
            publisher: {
              "@type": "Organization",
              name: r.publisher ?? "AI Energy Intelligence UK",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Reports", item: "https://aienergyintelligence.co.uk/reports" },
              { "@type": "ListItem", position: 3, name: r.title, item: url },
            ],
          }),
        },
        ...(r.faqs && r.faqs.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: r.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Report not found</h1>
      <p className="mt-3 text-muted-foreground">This report may have been renamed or is no longer available.</p>
      <Link to="/reports" className="mt-6 inline-flex items-center gap-1 text-brand font-semibold">
        Back to the library <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <Link to="/reports" className="mt-6 inline-flex items-center gap-1 text-brand font-semibold">
        Back to the library <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  component: ReportPage,
});

function ReportPage() {
  const { report: r } = Route.useLoaderData() as { report: Report };
  const related = getRelatedReports(r);
  const moreInCategory = getReportsByCategory(r.category, r.slug, 6);
  const inCollections = getCollectionsForReport(r.slug);
  const otherCategories = REPORT_CATEGORIES.filter((c) => c.slug !== r.category).slice(0, 4);
  const [gateOpen, setGateOpen] = useState(false);
  const available = isAvailable(r) && !!r.downloadUrl;
  const triggerDownload = () => {
    if (r.downloadUrl) window.open(r.downloadUrl, "_blank");
  };
  const handleDownload = () => {
    setGateOpen(true);
  };



  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-surface">
        <ol className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li>
            <Link to="/reports" className="hover:text-foreground">Reports</Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/reports"
              search={{ category: r.category, tier: "all", sort: "newest", topic: "all" }}
              className="hover:text-foreground"
            >
              {categoryLabel(r.category)}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{r.title}</li>
        </ol>
      </nav>



      {/* Hero */}
      <section className="border-b border-border bg-energy-deep text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
              <span className="text-electric">{categoryLabel(r.category)}</span>
              <span className="text-white/40">·</span>
              {r.tier === "premium" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-electric/20 px-2 py-0.5 text-electric">
                  <Lock className="h-2.5 w-2.5" /> Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 text-success">
                  Free
                </span>
              )}
            </div>
            <h1 className="mt-5 font-display text-3xl md:text-5xl font-bold text-balance">{r.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80 leading-relaxed">{r.summary}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-white/60">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/90">{STATUS_LABELS[r.status]}</span>
              {r.publishedAt && <span>Published {formatDate(r.publishedAt)}</span>}
              {r.pages && <span>{r.pages} pages</span>}
              {r.version && <span>Version {r.version}</span>}
              {r.publisher && <span>Published by {r.publisher}</span>}
            </div>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6">
            <div className="text-xs uppercase tracking-wider text-white/60">
              {available ? (r.tier === "free" ? "Free report" : "Premium report") : STATUS_LABELS[r.status]}
            </div>
            <div className="mt-1 font-display text-2xl font-bold">
              {available
                ? r.tier === "free"
                  ? "Download the PDF"
                  : "Request access"
                : "Not yet available"}
            </div>
            <p className="mt-2 text-sm text-white/70">
              {available
                ? r.tier === "free"
                  ? "Enter your email to download the full PDF and join our weekly UK AI energy briefing."
                  : "This report is available to teams and institutional subscribers."
                : r.status === "in-development"
                  ? "This report is in development. There is no document to download yet, and no findings are published on this page."
                  : "This report has not been produced yet. No publication date has been scheduled."}
            </p>
            <div className="mt-4">
              {available && r.tier === "free" ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Download className="h-4 w-4" /> Download PDF report
                </button>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  {available ? "Enquire about access" : "Ask about this research"} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {available && r.correctionNote && (
                <PdfCorrectionNotice publishedAt={r.publishedAt} tone="dark" className="mt-3" />
              )}
            </div>

          </aside>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          {r.executiveSummary && (
            <Block eyebrow="Executive summary" title="What this report covers">
              <p className="text-base leading-relaxed text-foreground/90">{r.executiveSummary}</p>
            </Block>
          )}

          {r.proposedScope && (
            <Block eyebrow={STATUS_LABELS[r.status]} title="Proposed scope">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="flex items-start gap-3 text-base leading-relaxed text-foreground/90">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <span>{r.proposedScope}</span>
                </p>
              </div>
            </Block>
          )}

          {r.keyFindings && r.keyFindings.length > 0 && (
            <Block eyebrow="Key findings" title="Headline conclusions">
              <ul className="space-y-3">
                {r.keyFindings.map((finding) => {
                  const text = typeof finding === "string" ? finding : "segments" in finding ? finding.segments[0].text : finding.text;
                  return (
                  <li key={text} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand shrink-0" />
                    <span className="text-foreground/90">
                      {typeof finding === "string" ? (
                        text
                      ) : "sourceNeeded" in finding ? (
                        <>
                          {finding.text}{" "}
                          <span
                            title={finding.sourceNote}
                            className="ml-1 inline-flex items-center rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300"
                          >
                            Source needed
                          </span>
                        </>
                      ) : "segments" in finding ? (
                        finding.segments.map((segment, i) => (
                          <span key={i}>
                            {i > 0 ? " " : ""}
                            {segment.text}
                            {segment.sourceUrl ? (
                              <>
                                {" "}
                                <a
                                  href={segment.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-brand hover:underline"
                                >
                                  {segment.sourceLabel}
                                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </a>
                              </>
                            ) : null}
                          </span>
                        ))
                      ) : (
                        <>
                          {finding.text}
                          {" "}
                          <a
                            href={finding.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-brand hover:underline"
                          >
                            {finding.sourceLabel}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                          .
                        </>
                      )}
                    </span>
                  </li>
                  );
                })}
              </ul>
            </Block>
          )}

          {r.correctionNote && (
            <Block eyebrow="Correction" title={`Correction — ${formatDate(r.correctionNote.date)}`}>
              <div className="rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-foreground/90">
                <p>{r.correctionNote.text}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Logged in accordance with our{" "}
                  <Link to="/corrections" className="text-brand hover:underline">corrections policy</Link>.
                </p>
              </div>
            </Block>
          )}

          {r.expectedTopics && r.expectedTopics.length > 0 && (
            <Block eyebrow="Planned contents" title="Topics we expect to cover">
              <ul className="space-y-3">
                {r.expectedTopics.map((k) => (
                  <li key={k} className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 text-brand shrink-0" />
                    <span className="text-foreground/90">{k}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {r.methodologyGaps && r.methodologyGaps.length > 0 && (
            <Block eyebrow="Transparency note" title="Supporting information still to be added">
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="flex items-start gap-3 text-sm text-foreground/90">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    This document is published and can be downloaded, but it does not yet contain everything we
                    expect of our own research. Missing at present:
                  </span>
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-10 text-sm text-muted-foreground">
                  {r.methodologyGaps.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            </Block>
          )}

          {r.limitations && r.limitations.length > 0 && (
            <Block eyebrow="Transparency note" title="Limitations of this report">
              <div className="rounded-xl border border-border bg-surface p-5">
                <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/90">
                  {r.limitations.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Adapted from the known limitations in our{" "}
                  <Link to="/research-methodology" className="text-brand hover:underline">research methodology</Link>.
                </p>
              </div>
            </Block>
          )}

          <Block eyebrow="Who should read this" title="Intended audience">
            <ul className="grid gap-2 sm:grid-cols-2">
              {r.audience.map((a) => (
                <li key={a} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 shadow-card">
                  <Users className="mt-0.5 h-4 w-4 text-brand shrink-0" />
                  <span className="text-sm">{a}</span>
                </li>
              ))}
            </ul>
          </Block>

          {r.toc && r.toc.length > 0 && (
            <Block eyebrow="Table of contents" title={r.pages ? `Inside the ${r.pages}-page report` : "Contents"}>
              <ol className="divide-y divide-border rounded-xl border border-border bg-card">
                {r.toc.map((t, i) => (
                  <li key={t} className="flex items-start gap-4 p-4 text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-foreground/90">{t}</span>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          <Block eyebrow="Accuracy" title="Publisher, corrections and disclaimer">
            <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-card">
              <p>
                <strong className="text-foreground">Publisher:</strong>{" "}
                {r.publisher ?? "AI Energy Intelligence UK"}
                {r.publisher && r.publisher !== "AI Energy Intelligence UK"
                  ? " — republished here with the original publisher credited. The research was not produced by AI Energy Intelligence UK."
                  : ""}
              </p>
              <p>
                <strong className="text-foreground">Status:</strong> {STATUS_LABELS[r.status]}.
                {!available && " No document is available for download."}
              </p>
              <p>
                Figures described as forecasts, scenarios or estimates are modelled, not measured. Spotted something
                wrong?{" "}
                <Link to="/corrections" className="text-brand hover:underline">
                  Submit a correction
                </Link>
                .
              </p>
            </div>
          </Block>

          {r.previewImages && r.previewImages.length > 0 && (
            <Block eyebrow="Preview" title="Sample pages">
              <div className="grid gap-4 sm:grid-cols-2">
                {r.previewImages.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border shadow-card">
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                  </div>
                ))}
              </div>
            </Block>
          )}

          <AboutThisData
            lastVerified={r.lastVerified ?? r.publishedAt}
            reviewWindowDays={r.reviewWindowDays ?? 365}
          />

          <FAQ items={r.faqs} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Report details</div>
            <dl className="mt-3 space-y-2 text-sm">
              <RowLink
                k="Category"
                to="/reports"
                search={{ category: r.category, tier: "all", sort: "newest", topic: "all" }}
                v={categoryLabel(r.category)}
              />
              <Row k="Status" v={STATUS_LABELS[r.status]} />
              {r.publishedAt && <Row k="Published" v={formatDate(r.publishedAt)} />}
              {r.pages && <Row k="Pages" v={String(r.pages)} />}
              {r.version && <Row k="Version" v={r.version} />}
              {r.publisher && <Row k="Publisher" v={r.publisher} />}
              <RowLink
                k="Access"
                to="/reports"
                search={{ category: "all", tier: r.tier, sort: "newest", topic: "all" }}
                v={r.tier === "free" ? "Free" : "Premium"}
              />
            </dl>
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Topics</div>
              <div className="flex flex-wrap gap-1.5">
                {r.topics.map((t) => (
                  <Link
                    key={t}
                    to="/reports"
                    search={{ category: "all", tier: "all", sort: "newest", topic: t }}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium hover:border-brand hover:text-brand"
                  >
                    <Tag className="h-3 w-3" /> {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Related reports</div>
              <ul className="mt-3 space-y-3">
                {related.map((rr) => (
                  <li key={rr.slug}>
                    <Link
                      to="/reports/$slug"
                      params={{ slug: rr.slug }}
                      className="group flex gap-3"
                    >
                      <img src={rr.cover} alt="" className="h-14 w-20 rounded-md object-cover shrink-0" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-brand">{categoryLabel(rr.category)}</div>
                        <div className="text-sm font-semibold leading-snug group-hover:text-brand">{rr.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {inCollections.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Part of these collections</div>
              <ul className="mt-3 space-y-3 text-sm">
                {inCollections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/collections/$slug"
                      params={{ slug: c.slug }}
                      className="group flex items-start gap-2 hover:text-brand"
                    >
                      <BookOpen className="mt-0.5 h-4 w-4 text-brand shrink-0" />
                      <span className="font-semibold leading-snug">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Explore other categories</div>
            <ul className="mt-3 space-y-2 text-sm">
              {otherCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/reports"
                    search={{ category: c.slug, tier: "all", sort: "newest", topic: "all" }}
                    className="group inline-flex items-center gap-1.5 hover:text-brand"
                  >
                    <Layers className="h-3.5 w-3.5 text-brand" /> {c.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/reports" className="inline-flex items-center gap-1 text-brand font-semibold hover:underline">
                  Browse the full library <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest related articles</div>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <Link to="/news" className="hover:text-brand inline-flex items-center gap-1">
                  Latest UK AI energy news <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand inline-flex items-center gap-1">
                  Research &amp; commentary <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link to="/guides/ai-electricity-cost-calculator" className="hover:text-brand inline-flex items-center gap-1">
                  Free UK electricity cost guide <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* More in this category */}
      {moreInCategory.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                  More in {categoryLabel(r.category)}
                </div>
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-balance">
                  Continue exploring {categoryLabel(r.category).toLowerCase()} research
                </h2>
              </div>
              <Link
                to="/reports"
                search={{ category: r.category, tier: "all", sort: "newest", topic: "all" }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                View all {categoryLabel(r.category)} reports <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreInCategory.map((rr) => (
                <li key={rr.slug}>
                  <Link
                    to="/reports/$slug"
                    params={{ slug: rr.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={rr.cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand">
                        {categoryLabel(rr.category)}
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{rr.tier === "free" ? "Free" : "Premium"}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-brand">
                        {rr.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {rr.summary}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                        Read report <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground">
            {available && r.tier === "free" ? <Download className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold text-balance">
            {available
              ? r.tier === "free"
                ? "Download the full report"
                : "Get in touch about this report"
              : "This report is not published yet"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {available
              ? r.tier === "free"
                ? "Enter your email to get the full PDF plus the weekly UK AI energy briefing."
                : "Contact the research team to discuss access."
              : "We do not sell or send documents that do not exist. Contact us if you would like to be told when this work is published, or explore the research we have already published."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {available && r.tier === "free" ? (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download PDF report
              </button>
            ) : (
              <>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  {available ? "Enquire about access" : "Ask about this research"} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/reports"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-accent"
                >
                  Browse published reports
                </Link>
              </>
            )}
          </div>
          {available && r.correctionNote && (
            <PdfCorrectionNotice publishedAt={r.publishedAt} className="mx-auto mt-6 max-w-xl text-left" />
          )}
        </div>
      </section>

      <EmailGateDialog
        open={gateOpen}
        onOpenChange={setGateOpen}
        reportTitle={r.title}
        reportSlug={r.slug}
        onUnlocked={triggerDownload}
      />
    </>
  );
}

function Block({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</div>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-balance">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function RowLink({
  k,
  v,
  to,
  search,
}: {
  k: string;
  v: string;
  to: "/reports";
  search: { category: string; tier: string; sort: string; topic: string };
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">
        <Link to={to} search={search} className="text-brand hover:underline inline-flex items-center gap-1">
          {v} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </dd>
    </div>
  );
}
