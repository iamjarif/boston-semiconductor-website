"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useScrollToSection } from "@/lib/navigation/use-scroll-to-section";

const linkClassName =
  "text-left text-body text-text-primary transition-colors pointer-fine:hover:text-brand-primary";

interface FooterLinkProps {
  children: ReactNode;
  href?: string;
  sectionId?: string;
  className?: string;
  external?: boolean;
}

export function FooterLink({
  children,
  href,
  sectionId,
  className = "",
  external = false,
}: FooterLinkProps) {
  const scrollToSection = useScrollToSection();
  const classes = `${linkClassName} ${className}`.trim();

  if (sectionId) {
    return (
      <button
        type="button"
        onClick={() => scrollToSection(sectionId)}
        className={classes}
      >
        {children}
      </button>
    );
  }

  if (href) {
    if (external || href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a
          href={href}
          className={classes}
          {...(external || href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <span className={`text-body text-text-primary ${className}`.trim()}>
      {children}
    </span>
  );
}
