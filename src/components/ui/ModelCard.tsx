import type { ElementType } from "react";

export interface ModelCardRow {
  label: string;
  description: string;
}

export interface ModelCardProps {
  caption?: string;
  title: string;
  rows: ModelCardRow[];
  className?: string;
  as?: ElementType;
}

export function ModelCard({
  caption = "Caption",
  title,
  rows,
  className = "",
  as: Component = "div",
}: ModelCardProps) {
  return (
    <Component
      className={`group relative flex w-full flex-col gap-8 overflow-hidden rounded-3xl border-[6px] border-brand-primary bg-bg-base p-12 transition-colors hover:bg-bg-surface-raised ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-brand-primary/5 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-4">
        <p className="text-mono text-brand-primary">{caption}</p>
        <h3 className="text-h5 text-text-primary">{title}</h3>
      </div>

      <div className="relative flex flex-col">
        {rows.map((row) => (
          <div
            key={`${row.label}-${row.description}`}
            className="flex items-center gap-4 border-t border-border-default py-4 first:pt-4"
          >
            <p className="shrink-0 whitespace-nowrap text-body text-text-primary">
              {row.label}
            </p>
            <p className="min-w-0 flex-1 text-right text-body-sm text-text-secondary">
              {row.description}
            </p>
          </div>
        ))}
      </div>
    </Component>
  );
}
