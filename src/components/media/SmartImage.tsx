import { useState } from "react";
import { cn } from "@/lib/utils";

export type ImageRatio = "16/9" | "3/2" | "4/3" | "square" | "a4";

const RATIO_CLASS: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  square: "aspect-square",
  a4: "aspect-[210/297]",
};

type Props = {
  src?: string | null;
  alt: string;
  ratio?: ImageRatio;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Text shown in the branded fallback when no image is available. */
  fallbackLabel?: string;
  focal?: "center" | "top" | "bottom";
};

/**
 * Shared site image component.
 * - Consistent aspect ratios (prevents layout shift)
 * - Lazy loading + async decoding below the fold
 * - Graceful branded fallback when the image is missing or fails to load
 */
export function SmartImage({
  src,
  alt,
  ratio = "16/9",
  className,
  imgClassName,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  fallbackLabel,
  focal = "center",
}: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className={cn("relative overflow-hidden bg-surface", RATIO_CLASS[ratio], className)}>
      {showFallback ? (
        <BrandedFallback label={fallbackLabel ?? alt} />
      ) : (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover",
            focal === "top" && "object-top",
            focal === "bottom" && "object-bottom",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}

function BrandedFallback({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex h-full w-full items-end bg-[linear-gradient(135deg,var(--energy-deep),var(--energy-navy))] p-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
        AI Energy Intelligence UK
      </span>
    </div>
  );
}
