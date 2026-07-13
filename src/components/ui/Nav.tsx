import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-h6 text-brand-primary">
            {siteConfig.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {siteConfig.navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="mailto:info@bostonsemiconductor.com"
          className="text-label rounded-lg bg-brand-primary px-4 py-2 uppercase text-white transition-colors hover:bg-brand-primary-dark"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
