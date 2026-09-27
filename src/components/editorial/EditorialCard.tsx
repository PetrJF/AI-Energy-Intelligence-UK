import { Link } from "@tanstack/react-router";
import { SmartImage, type ImageRatio } from "@/components/media/SmartImage";
import { cn } from "@/lib/utils";

export type EditorialItem = {
  to: string;
  params?: Record<string, string>;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  category?: string | null;
  date?: string | null;
  meta?: string | null;
};

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatUkDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function MetaRow({ item }: { item: EditorialItem }) {
  const date = formatUkDate(item.date);
  const bits = [item.category, item.meta, date].filter(Boolean) as string[];
  if (bits.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {bits.map((b, i) => (
        <span key={`${b}-${i}`} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          <span className={i === 0 && item.category ? "font-semibold uppercase tracking-wider text-brand" : ""}>
            {b}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Large lead card: image on top (or beside on desktop when `horizontal`). */
export function LeadEditorialCard({
  item,
  ratio = "16/9",
  horizontal = false,
}: {
  item: EditorialItem;
  ratio?: ImageRatio;
  horizontal?: boolean;
}) {
  return (
    <Link
      to={item.to}
      params={item.params as never}
      className={cn(
        "group h-full overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        horizontal ? "grid md:grid-cols-2" : "flex flex-col",
      )}
    >
      <SmartImage
        src={item.imageUrl}
        alt={item.imageAlt ?? item.title}
        ratio={ratio}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={horizontal ? "h-full md:aspect-auto" : undefined}
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-7">
        <MetaRow item={item} />
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight group-hover:text-brand">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}


/** Standard grid card: 3:2 thumbnail. */
export function EditorialCard({ item, className }: { item: EditorialItem; className?: string }) {
  return (
    <Link
      to={item.to}
      params={item.params as never}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <SmartImage
        src={item.imageUrl}
        alt={item.imageAlt ?? item.title}
        ratio="3/2"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <MetaRow item={item} />
        <h3 className="font-display text-base font-bold leading-snug group-hover:text-brand">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

/** Compact horizontal row: small square thumbnail + headline. */
export function CompactEditorialCard({ item }: { item: EditorialItem }) {
  return (
    <Link
      to={item.to}
      params={item.params as never}
      className="group flex gap-4 border-b border-border py-4 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <SmartImage
        src={item.imageUrl}
        alt={item.imageAlt ?? item.title}
        ratio="square"
        className="w-20 shrink-0 rounded-lg"
        sizes="80px"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand">
          {item.title}
        </h3>
        <div className="mt-1">
          <MetaRow item={item} />
        </div>
      </div>
    </Link>
  );
}
