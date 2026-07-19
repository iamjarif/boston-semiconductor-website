import type { ReactNode } from "react";

interface CardPrimitiveProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardPrimitiveProps) {
  return (
    <div
      className={`rounded-xl border border-border-default bg-bg-surface p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardPrimitiveProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardPrimitiveProps) {
  return (
    <h3 className={`text-h5 text-text-primary ${className}`}>{children}</h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: CardPrimitiveProps) {
  return (
    <p className={`text-body-sm text-text-secondary ${className}`}>
      {children}
    </p>
  );
}
