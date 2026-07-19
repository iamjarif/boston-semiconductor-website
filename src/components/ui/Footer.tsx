import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-bg-surface text-text-primary">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-h6">{siteConfig.name}</p>
            <p className="text-body-sm mt-2 text-text-secondary">{siteConfig.tagline}</p>
          </div>

          {siteConfig.footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-label-sm uppercase text-text-primary">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-default pt-8 sm:flex-row">
          <p className="text-body-sm text-text-disabled">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {siteConfig.socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm text-text-disabled transition-colors hover:text-text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
