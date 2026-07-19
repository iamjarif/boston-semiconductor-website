import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";

export interface NavigationBarLink {
  label: string;
  href: string;
}

export interface NavigationBarProps {
  logo?: ReactNode;
  logoHref?: string;
  links?: NavigationBarLink[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const defaultLinks: NavigationBarLink[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export function NavigationBar({
  logo,
  logoHref = "/",
  links = defaultLinks,
  ctaLabel = "Request Quote",
  ctaHref = "#contact",
  className = "",
}: NavigationBarProps) {
  const logoContent =
    logo ?? (
      <span className="text-h6 text-brand-primary">{siteConfig.name}</span>
    );

  return (
    <header
      className={`flex items-center justify-center px-4 py-6 ${className}`}
    >
      <div className="flex w-full max-w-[1800px] items-center">
        <div className="flex w-[200px] shrink-0 items-center">
          <Link href={logoHref} className="inline-flex items-center">
            {logoContent}
          </Link>
        </div>

        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-3"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-body font-semibold leading-[1.3] text-text-primary transition-colors hover:bg-bg-surface-raised"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex w-[200px] shrink-0 items-center justify-end">
          <Button href={ctaHref} variant="outline" size="l">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}
