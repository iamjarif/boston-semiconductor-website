"use client";

import Link from "next/link";
import {
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";

import { ButtonLabelReveal } from "@/components/ui/ButtonLabelReveal";
import { usePrefersHover } from "@/hooks/use-prefers-hover";
import { useScrollToSection } from "@/lib/navigation/use-scroll-to-section";

export type ButtonSize = "s" | "m" | "l" | "xl";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  href?: string;
  sectionId?: string;
  active?: boolean;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  xl: "gap-2 px-6 py-4 text-body font-semibold leading-[1.3] [&_svg]:size-5",
  l: "gap-2 px-4 py-3 text-body font-semibold leading-[1.3] [&_svg]:size-5",
  m: "gap-2 px-3 py-2 text-label [&_svg]:size-5",
  s: "gap-1 px-2 py-1 text-label-sm [&_svg]:size-3",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-border-button bg-gradient-button-primary text-text-primary pointer-fine:hover:bg-gradient-button-primary-hover",
  secondary:
    "border border-neutral-900 bg-gradient-button-secondary text-text-on-brand pointer-fine:hover:bg-gradient-button-secondary-hover",
  outline:
    "border-2 border-neutral-900 text-text-primary pointer-fine:hover:border-neutral-800",
  ghost: "text-text-primary",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "primary",
  size = "m",
  href,
  sectionId,
  active = false,
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  disabled,
  type = "button",
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canHover = usePrefersHover();
  const scrollToSection = useScrollToSection();
  const activeClasses =
    active && variant === "ghost"
      ? "relative text-brand-primary after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:rounded-full after:bg-brand-primary after:content-['']"
      : active && variant === "outline"
        ? "border-brand-primary text-brand-primary"
        : "";
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${activeClasses} ${className}`;
  const label = typeof children === "string" ? children : undefined;
  const ariaCurrent = active ? ("page" as const) : undefined;

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    if (disabled || !canHover) return;
    setIsHovered(true);
    onMouseEnter?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    if (disabled || !canHover) return;
    setIsHovered(false);
    onMouseLeave?.(event as MouseEvent<HTMLButtonElement>);
  };

  const content = (
    <>
      {leadingIcon ? (
        <span className="inline-flex shrink-0 items-center">{leadingIcon}</span>
      ) : null}
      <ButtonLabelReveal label={label} disabled={disabled} hovered={isHovered}>
        {label ? null : children}
      </ButtonLabelReveal>
      {trailingIcon ? (
        <span className="inline-flex shrink-0 items-center">{trailingIcon}</span>
      ) : null}
    </>
  );

  if (sectionId && !disabled) {
    return (
      <button
        type="button"
        className={classes}
        aria-current={ariaCurrent}
        onClick={(event) => {
          onClick?.(event);
          scrollToSection(sectionId);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {content}
      </button>
    );
  }

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        aria-current={ariaCurrent}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-current={ariaCurrent}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </button>
  );
}
