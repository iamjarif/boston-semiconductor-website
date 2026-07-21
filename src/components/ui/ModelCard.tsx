import type { ElementType } from "react";

export interface ModelCardRow {
  label: string;
  description: string;
}

export interface ModelCardProps {
  caption?: string;
  title: string;
  rows: ModelCardRow[];
  highlighted?: boolean;
  className?: string;
  as?: ElementType;
}

export function ModelCard({
  caption = "Caption",
  title,
  rows,
  highlighted = true,
  className = "",
  as: Component = "div",
}: ModelCardProps) {
  return (
    <Component
      className={`relative flex w-full flex-col gap-8 overflow-hidden rounded-3xl bg-bg-base p-12 ${highlighted ? "border-[6px] border-brand-primary" : "border border-transparent"} ${className}`}
    >
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
