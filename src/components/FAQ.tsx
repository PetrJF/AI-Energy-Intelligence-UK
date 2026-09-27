export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item, i) => (
          <details key={i} className="group p-5 [&[open]>summary>span:last-child]:rotate-45">
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-sm">
              {item.q}
              <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-lg leading-none transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          }),
        }}
      />
    </section>
  );
}
