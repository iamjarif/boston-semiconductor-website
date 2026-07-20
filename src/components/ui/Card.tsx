import type { ElementType, ReactNode } from "react";

export interface CardProps {
  title: string;
  subText?: ReactNode;
  caption?: string;
  showCaption?: boolean;
  icon?: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Card({
  title,
  subText,
  caption = "Caption",
  showCaption = true,
  icon,
  className = "",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={`group relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl border border-transparent bg-bg-surface p-8 transition-colors hover:border-border-strong hover:bg-bg-surface-raised ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-brand-primary/5 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-4">
        {icon ? (
          <span className="inline-flex size-[42px] shrink-0 items-center text-brand-primary">
            {icon}
          </span>
        ) : null}

        {showCaption && caption ? (
          <p className="text-mono text-brand-primary">{caption}</p>
        ) : null}

        <h3 className="text-h5 text-text-primary">{title}</h3>

        {subText ? (
          <div className="text-body-sm text-text-secondary">{subText}</div>
        ) : null}
      </div>
    </Component>
  );
}
