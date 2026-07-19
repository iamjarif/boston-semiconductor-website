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
    "bg-gradient-button-primary text-text-on-brand hover:bg-gradient-button-primary-hover focus-visible:ring-brand-primary",
  secondary:
    "border border-border-button bg-gradient-button-secondary text-text-on-brand hover:bg-gradient-button-secondary-hover focus-visible:ring-brand-primary",
  ghost:
    "text-text-primary hover:bg-bg-surface focus-visible:ring-brand-primary",
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
