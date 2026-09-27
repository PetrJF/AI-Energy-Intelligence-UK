import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { RelatedReports } from "@/components/RelatedReports";
import type { CategorySlug } from "@/data/reports";

export type HubTool = {
  to: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

export function HubPage({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  tools,
  reportCategories,
  reportTopics,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  tools: HubTool[];
  reportCategories?: CategorySlug[];
  reportTopics?: string[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <img
          src={image}
          alt={imageAlt}
          width={1024}
          height={768}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/65 to-primary/45" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/80">{eyebrow}</div>
          <h1 className="mt-3 max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-balance">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85 leading-relaxed">{intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className="rounded-xl bg-accent p-3 w-fit">
                <t.icon className="h-6 w-6 text-brand" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{t.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
                Start <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        {reportCategories && reportCategories.length > 0 && (
          <div className="mt-12">
            <RelatedReports
              categories={reportCategories}
              topics={reportTopics}
              title={`${title} — recommended reports`}
              intro={`In-depth research from the AI Energy Intelligence library on ${title.toLowerCase()}.`}
            />
          </div>
        )}
      </section>
    </>
  );
}
