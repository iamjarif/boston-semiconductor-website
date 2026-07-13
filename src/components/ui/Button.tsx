import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-dark focus-visible:ring-brand-accent",
  secondary:
    "border border-brand-primary text-brand-primary hover:bg-brand-primary/5 focus-visible:ring-brand-accent",
  ghost:
    "text-foreground hover:bg-muted focus-visible:ring-brand-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-label-sm uppercase",
  md: "px-6 py-3 text-label uppercase",
  lg: "px-8 py-4 text-label-lg uppercase",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
