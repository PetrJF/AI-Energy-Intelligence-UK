import { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 md:py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</div>
        <h1 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">{intro}</p>
        {children}
      </div>
    </section>
  );
}

export function ToolShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputCls}>{children}</select>;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={inputCls} />;
}
